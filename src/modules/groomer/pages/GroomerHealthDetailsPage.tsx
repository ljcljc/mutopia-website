import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, CircleAlert, Lightbulb, Phone } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { OrangeButton } from "@/components/common/OrangeButton";
import { Spinner } from "@/components/common/Spinner";
import { buildImageUrl, getGroomerBookingDetail, startGroomerTravel, type GroomerBookingDetailOut } from "@/lib/api";
import { normalizeQuestionnaire } from "@/pages/account/booking-health/questionnaire";
import type { BookingHealthQuestionnaire, TimelineEntry } from "@/pages/account/booking-health/types";
import { formatGroomerTimeLabel, shouldShowStartTravel } from "@/modules/groomer/utils/time";
import DEFAULT_PET_AVATAR from "@/assets/icons/icon-pet-avatar-placeholder.svg";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getString(source: Record<string, unknown>, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatBirthLabel(value: string): string {
  if (!value) return "-";
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed.slice(0, 7);
  return trimmed;
}

function formatWeightLabel(value: string, unit: string): string {
  if (!value) return "-";
  if (!unit) return value;
  return `${value} ${unit}`;
}

function formatFrequencyLabel(questionnaire: BookingHealthQuestionnaire, snapshot: Record<string, unknown>): string {
  const days = questionnaire.lifestyle.groomingIntervalDays;
  if (days > 0 && days <= 10) return "Weekly";
  if (days > 10 && days <= 20) return "Bi-weekly";
  if (days > 20 && days <= 45) return "Monthly";
  if (days > 45) return "Occasionally";

  const legacy = getString(snapshot, ["grooming_frequency"]);
  if (!legacy) return "-";
  return titleCase(legacy);
}

function formatVaccinationStatus(entry: TimelineEntry) {
  if (!entry.type) return null;
  return {
    label: titleCase(entry.type),
    status: entry.date ? "Up to date" : "Not provided",
    isActive: Boolean(entry.date),
  };
}

function buildAlerts(questionnaire: BookingHealthQuestionnaire): string[] {
  const items = [
    ...questionnaire.clinical.preExistingHealthConditions,
    ...questionnaire.clinical.chronicConditions,
    ...questionnaire.clinical.metabolicAndGeneralHealth,
  ]
    .filter((item) => {
      const normalized = item.trim().toLowerCase();
      return normalized && !["normal", "no known illnesses", "no chronic conditions"].includes(normalized);
    })
    .slice(0, 3);

  if (questionnaire.prevention.restrictions.trim()) {
    items.unshift(questionnaire.prevention.restrictions.trim());
  }

  return Array.from(new Set(items)).slice(0, 3);
}

function buildActionPlan(questionnaire: BookingHealthQuestionnaire): string[] {
  const items = [
    ...questionnaire.prevention.primaryGoals.map((goal) => `Prioritize ${goal.toLowerCase()}`),
    ...questionnaire.prevention.recentTreatments
      .filter((entry) => entry.type.trim())
      .map((entry) => `${titleCase(entry.type)}${entry.date ? ` (${entry.date})` : ""}`),
  ];

  return Array.from(new Set(items)).slice(0, 3);
}

function buildCoreNeeds(questionnaire: BookingHealthQuestionnaire): string[] {
  const items = [
    ...questionnaire.nutrition.foodSensitivities.map((item) => `Avoid ${item.toLowerCase()}`),
    questionnaire.prevention.internalParasiteIntervalDays > 0
      ? `Internal parasite prevention every ${questionnaire.prevention.internalParasiteIntervalDays} days`
      : "",
    questionnaire.prevention.externalParasiteIntervalDays > 0
      ? `External parasite prevention every ${questionnaire.prevention.externalParasiteIntervalDays} days`
      : "",
    questionnaire.medical.topicalMedications.trim() ? `Topical medications: ${questionnaire.medical.topicalMedications.trim()}` : "",
    questionnaire.medical.oralMedications.trim() ? `Oral medications: ${questionnaire.medical.oralMedications.trim()}` : "",
  ].filter(Boolean);

  return Array.from(new Set(items)).slice(0, 3);
}

function buildNotes(questionnaire: BookingHealthQuestionnaire): string[] {
  return [
    questionnaire.prevention.restrictions.trim(),
    questionnaire.medical.recentVetVisitReason.trim(),
    ...questionnaire.clinical.eatingHabitsAndBehaviors.filter(Boolean),
  ].filter(Boolean);
}

function buildBehaviorRows(questionnaire: BookingHealthQuestionnaire): Array<{ label: string; value: string }> {
  return [
    {
      label: "Energy Level",
      value: questionnaire.clinical.metabolicAndGeneralHealth[0] || "Not provided",
    },
    {
      label: "Socialization",
      value: questionnaire.lifestyle.householdSetup.join(", ") || "Not provided",
    },
    {
      label: "Previous Grooming",
      value: formatFrequencyLabel(questionnaire, {}),
    },
  ];
}

export default function GroomerHealthDetailsPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const parsedBookingId = Number(bookingId);
  const [detail, setDetail] = useState<GroomerBookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingTravel, setIsStartingTravel] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(parsedBookingId)) {
      toast.error("Invalid booking.");
      navigate("/groomer/dashboard", { replace: true });
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      setIsLoading(true);
      try {
        const result = await getGroomerBookingDetail(parsedBookingId);
        if (!cancelled) setDetail(result);
      } catch (error) {
        console.error("Failed to load groomer health details:", error);
        if (!cancelled) {
          toast.error("Failed to load health details.");
          navigate("/groomer/dashboard", { replace: true });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [navigate, parsedBookingId]);

  const detailRecord = useMemo(() => asRecord(detail), [detail]);
  const petSnapshot = useMemo(() => asRecord(detail?.pet_snapshot), [detail]);
  const questionnaire = useMemo(
    () => normalizeQuestionnaire(petSnapshot.health_questionnaire),
    [petSnapshot],
  );

  const petName = getString(petSnapshot, ["name"], "Pet");
  const petType = titleCase(getString(petSnapshot, ["pet_type", "species", "type"], "Pet"));
  const breed = getString(petSnapshot, ["breed", "pet_breed"], "-");
  const birthDate = formatBirthLabel(getString(petSnapshot, ["birthday", "date_of_birth", "birth_date"]));
  const gender = titleCase(getString(petSnapshot, ["gender", "sex"], "-"));
  const weightLabel = formatWeightLabel(
    getString(petSnapshot, ["weight_value", "weight_kg", "weight"], ""),
    getString(petSnapshot, ["weight_unit"], ""),
  );
  const coat = questionnaire.clinical.preExistingHealthConditions[0]
    || getString(petSnapshot, ["coat_condition", "coat"], "-");
  const behavior = questionnaire.clinical.eatingHabitsAndBehaviors[0] || getString(petSnapshot, ["behavior"], "-");
  const frequency = formatFrequencyLabel(questionnaire, petSnapshot);
  const avatarUrl = buildImageUrl(getString(petSnapshot, ["avatar_url", "pet_avatar", "avatar"])) || DEFAULT_PET_AVATAR;
  const phone = getString(detailRecord, ["owner_phone", "phone", "user_phone", "contact_phone"]);
  const alerts = buildAlerts(questionnaire);
  const actionPlan = buildActionPlan(questionnaire);
  const coreNeeds = buildCoreNeeds(questionnaire);
  const notes = buildNotes(questionnaire);
  const vaccinationRows = questionnaire.prevention.vaccinationHistory
    .map(formatVaccinationStatus)
    .filter((item): item is NonNullable<ReturnType<typeof formatVaccinationStatus>> => Boolean(item))
    .slice(0, 3);
  const behaviorRows = buildBehaviorRows(questionnaire);
  const scheduledTime = detail?.scheduled_time ?? "";
  const canStartTravel = Boolean(detail?.id) && shouldShowStartTravel(scheduledTime, new Date(), detail?.status);

  const handleStartTravel = async () => {
    if (!detail?.id) return;
    setIsStartingTravel(true);
    try {
      await startGroomerTravel(detail.id);
      toast.success("Travel started.");
      navigate("/groomer/dashboard");
    } catch (error) {
      console.error("Failed to start travel from health details:", error);
      toast.error("Failed to start travel");
    } finally {
      setIsStartingTravel(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-full w-full max-w-[731px] flex-col bg-white shadow-[0_18px_48px_rgba(15,23,43,0.12)]">
        <div className="flex items-center gap-4 border-b border-[#e5e7eb] px-5 py-4">
          <div className="h-8 w-8 rounded-full bg-[#f3f4f6]" />
          <div className="h-5 w-48 rounded-full bg-[#f3f4f6]" />
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="h-28 rounded-[18px] bg-[#faf5ef]" />
          <div className="h-32 rounded-[18px] bg-[#fff1f1]" />
          <div className="h-32 rounded-[18px] bg-[#eefcf5]" />
          <div className="h-56 rounded-[18px] bg-[#edf4ff]" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[731px] flex-col bg-white shadow-[0_18px_48px_rgba(15,23,43,0.12)]">
      <div className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex w-full max-w-[588px] items-center gap-[14px] px-4 py-4 sm:px-[21px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex size-[31px] items-center justify-center rounded-full text-[#25314c]"
            aria-label="Go back"
          >
            <ArrowLeft className="size-[17px]" strokeWidth={1.8} />
          </button>
          <h1 className="font-comfortaa text-[18px] font-semibold leading-[24px] text-[#0f172b]">
            Health details - {petName}
          </h1>
        </div>
      </div>

      <div className="flex-1 bg-white">
        <div className="mx-auto flex w-full max-w-[588px] flex-col gap-4 px-4 py-5 sm:px-[21px]">
          <section className="rounded-[12px] border-2 border-[#de6a07] bg-white p-[22px] shadow-[0px_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <img src={avatarUrl} alt={petName} className="size-14 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-comfortaa text-[16px] leading-6 text-[#4a3c2a]">{petName}</p>
                <div className="mt-[7px] flex flex-wrap gap-x-3 gap-y-2 text-[#4a3c2a]">
                  {[
                    ["Pet type", petType],
                    ["Breed", breed],
                    ["Date of birth", birthDate],
                    ["Gender", gender],
                    ["Weight", weightLabel],
                    ["Frequency", frequency],
                    ["Coat", coat],
                    ["Behavior", behavior],
                  ].map(([label, value]) => (
                    <div key={label} className="w-[80px]">
                      <p className="font-comfortaa text-[10px] leading-3 text-[#6b5a4d]">{label}</p>
                      <p className="mt-1 font-comfortaa text-[12px] font-bold leading-4 text-[#4a3c2a]">{value || "-"}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {phone ? (
              <div className="mt-3 flex justify-end">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex h-7 items-center gap-[5px] rounded-[32px] bg-[#8b6357] px-7 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#fff7ed]"
                >
                  <span>Contact</span>
                  <Phone className="size-[14px]" strokeWidth={2} />
                </a>
              </div>
            ) : null}
          </section>

          <section className="rounded-[14px] border-2 border-[#ffc9c9] bg-[#fef2f2] p-5">
            <h2 className="font-comfortaa text-[16px] font-semibold leading-6 text-[#82181a]">
              Critical Alerts (Read Before Grooming)
            </h2>
            <div className="mt-4 flex flex-col gap-[10px]">
              {(alerts.length > 0 ? alerts : ["No critical alerts were provided by the owner."]).map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-[18px] border-2 border-[#ffa2a2] bg-white px-4 py-4">
                  <CircleAlert className="mt-[2px] size-4 shrink-0 text-[#c81e1e]" strokeWidth={2} />
                  <p className="font-comfortaa text-[14px] font-semibold leading-[21px] text-[#9f0712]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[14px] border-2 border-[#8ee2bf] bg-[#edfdf5] p-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-[#0f9f6e]" strokeWidth={2} />
              <h2 className="font-comfortaa text-[16px] font-semibold leading-6 text-[#0f7a58]">
                Grooming Action Plan
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {(actionPlan.length > 0 ? actionPlan : ["No specific grooming goals were submitted."]).map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0f9f6e] font-comfortaa text-[11px] font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="font-comfortaa text-[14px] leading-[21px] text-[#246356]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[14px] border-2 border-[#b8d7ff] bg-[#eef4ff] p-5">
            <h2 className="font-comfortaa text-[16px] font-semibold leading-6 text-[#2f5fd4]">Core needs and note</h2>
            <div className="mt-4 flex flex-col gap-3">
              {(coreNeeds.length > 0 ? coreNeeds : ["No extra core-care instructions were provided."]).map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] font-comfortaa text-[11px] font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="font-comfortaa text-[14px] leading-[21px] text-[#2f5fd4]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="font-comfortaa text-[12px] font-semibold uppercase leading-[18px] tracking-[0.3px] text-[#4a3c2a]">
                Notes
              </p>
              <div className="mt-3 rounded-[14px] bg-white/90 px-4 py-4">
                <p className="font-comfortaa text-[13px] leading-5 text-[#5b6473]">
                  {notes.length > 0 ? notes.join(". ") : "No additional notes were submitted."}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
            <button
              type="button"
              onClick={() => setIsProfileExpanded((current) => !current)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="font-comfortaa text-[14px] leading-[21px] text-[#4a5565]">
                View Full Health Profile (Diet, Vaccines, Habits)
              </span>
              {isProfileExpanded ? (
                <ChevronUp className="size-4 text-[#64748b]" strokeWidth={1.8} />
              ) : (
                <ChevronDown className="size-4 text-[#64748b]" strokeWidth={1.8} />
              )}
            </button>

            {isProfileExpanded ? (
              <div className="border-t border-[#e5e7eb] px-4 py-4">
                <div className="space-y-5">
                  <div>
                    <p className="font-comfortaa text-[12px] font-semibold uppercase leading-[18px] tracking-[0.3px] text-[#0f172b]">
                      Nutrition & Diet
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        ["Primary Diet", questionnaire.nutrition.primaryDiet.join(", ") || "Not provided"],
                        ["Stool Condition", questionnaire.nutrition.stoolCondition.join(", ") || "Not provided"],
                        ["Vomiting", questionnaire.nutrition.vomitingFrequency || "Not provided"],
                        [
                          "Food Sensitivities",
                          [
                            ...questionnaire.nutrition.foodSensitivities,
                            questionnaire.nutrition.otherFoodSensitivity.trim(),
                          ].filter(Boolean).join(", ") || "Not provided",
                        ],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-start justify-between gap-4">
                          <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556c]">{label}:</p>
                          <p className="text-right font-comfortaa text-[14px] font-medium leading-[21px] text-[#0f172b]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-comfortaa text-[12px] font-semibold uppercase leading-[18px] tracking-[0.3px] text-[#0f172b]">
                      Vaccinations
                    </p>
                    <div className="mt-3 space-y-2">
                      {(vaccinationRows.length > 0 ? vaccinationRows : [{ label: "Vaccinations", status: "Not provided", isActive: false }]).map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4">
                          <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556c]">{item.label}:</p>
                          <span
                            className={
                              item.isActive
                                ? "rounded-full bg-[#dcfce7] px-[10px] py-[4px] font-comfortaa text-[10.5px] font-medium leading-[14px] text-[#008236]"
                                : "rounded-full bg-[#f3f4f6] px-[10px] py-[4px] font-comfortaa text-[10.5px] font-medium leading-[14px] text-[#64748b]"
                            }
                          >
                            {item.isActive ? "✓ " : ""}{item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-comfortaa text-[12px] font-semibold uppercase leading-[18px] tracking-[0.3px] text-[#0f172b]">
                      Behavioral Habits
                    </p>
                    <div className="mt-3 space-y-2">
                      {behaviorRows.map((item) => (
                        <div key={item.label} className="flex items-start justify-between gap-4">
                          <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556c]">{item.label}:</p>
                          <p className="text-right font-comfortaa text-[14px] font-medium leading-[21px] text-[#0f172b]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <div className="border-t border-[#e5e7eb] bg-white shadow-[0_-10px_18px_rgba(15,23,43,0.06)]">
        <div className="mx-auto flex w-full max-w-[588px] flex-col items-center px-4 py-[14px] sm:px-[21px]">
          {canStartTravel ? (
            <OrangeButton
              type="button"
              variant="outline"
              fullWidth
              onClick={() => void handleStartTravel()}
              disabled={isStartingTravel}
              className="border-[#314158]! text-[#314158]! hover:bg-[#f8fafc]! active:bg-[#f8fafc]! focus-visible:bg-[#f8fafc]! [&_p]:font-semibold [&_p]:text-[#314158]!"
            >
              {isStartingTravel ? <Spinner size="small" color="#314158" /> : "Start Travel"}
            </OrangeButton>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-[56px] w-full items-center justify-center rounded-full border-2 border-[#314158] font-comfortaa text-[16px] font-semibold leading-6 text-[#314158] opacity-60"
            >
              Start Travel
            </button>
          )}
          <p className="mt-2 font-comfortaa text-[10.5px] leading-[14px] text-[#62748e]">
            {scheduledTime
              ? `${canStartTravel ? "Appointment time" : "Available within 2 hours before appointment"}${scheduledTime ? ` • ${formatGroomerTimeLabel(scheduledTime, scheduledTime)}` : ""}`
              : "Appointment time unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

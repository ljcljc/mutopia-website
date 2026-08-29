import { useEffect, useMemo, useState } from "react";
import { ChevronDown, CircleAlert, Lightbulb } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import DEFAULT_PET_AVATAR from "@/assets/icons/icon-pet-avatar-placeholder.svg";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { HealthReportSection, PdfPreviewDialog, Spinner, type HealthReportItem } from "@/components/common";
import { usePdfPreview } from "@/components/common/usePdfPreview";
import AccountContentContainer from "@/components/layout/AccountContentContainer";
import {
  buildImageUrl,
  fetchAuthenticatedBlob,
  getGroomerBookingDetail,
  getInspectionPetNotes,
  startGroomerTravel,
  type GroomerBookingDetailOut,
} from "@/lib/api";
import { formatGroomerTimeLabel, isGroomerStartTravelStatus, shouldShowStartTravel } from "@/modules/groomer/utils/time";
import { BOOKING_HEALTH_STEPS, normalizeQuestionnaire } from "@/pages/account/booking-health/questionnaire";
import type { BookingHealthQuestionnaire, TimelineEntry } from "@/pages/account/booking-health/types";

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

function getStringList(source: Record<string, unknown>, keys: string[]): string[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  return [];
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
  return unit ? `${value} ${unit}` : value;
}

function formatFrequencyLabel(questionnaire: BookingHealthQuestionnaire, snapshot: Record<string, unknown>): string {
  const days = questionnaire.lifestyle.groomingIntervalDays;
  if (days > 0 && days <= 10) return "Weekly";
  if (days > 10 && days <= 20) return "Bi-weekly";
  if (days > 20 && days <= 45) return "Monthly";
  if (days > 45) return "Occasionally";

  const legacy = getString(snapshot, ["grooming_frequency"]);
  return legacy ? titleCase(legacy) : "-";
}

function formatScheduleLabel(value: string): string {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatHealthReportUpdatedLabel(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hour = String(parsed.getHours()).padStart(2, "0");
  return `${year}-${month}-${day} at ${hour}H`;
}

function formatListValue(values: string[], fallback = "Not provided"): string {
  const normalized = values.map((item) => item.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized.join(", ") : fallback;
}

function formatNumberValue(value: number, suffix = "", fallback = "Not provided"): string {
  if (value > 0) return suffix ? `${value} ${suffix}` : String(value);
  return fallback;
}

function formatVaccinationStatus(entry: TimelineEntry) {
  if (!entry.type) return null;
  return {
    label: titleCase(entry.type),
    status: entry.date ? `Updated ${entry.date}` : "Not provided",
    isActive: Boolean(entry.date),
  };
}

function buildAlerts(questionnaire: BookingHealthQuestionnaire): string[] {
  const items = [
    questionnaire.prevention.restrictions.trim(),
    ...questionnaire.clinical.preExistingHealthConditions,
    ...questionnaire.clinical.chronicConditions,
    ...questionnaire.clinical.metabolicAndGeneralHealth,
  ]
    .filter((item) => {
      const normalized = item.trim().toLowerCase();
      return normalized && !["normal", "no known illnesses", "no chronic conditions"].includes(normalized);
    })
    .map((item) => titleCase(item))
    .slice(0, 4);

  return Array.from(new Set(items));
}

function buildActionPlan(questionnaire: BookingHealthQuestionnaire): string[] {
  const items = [
    ...questionnaire.prevention.primaryGoals.map((goal) => `Prioritize ${goal.toLowerCase()}`),
    ...questionnaire.prevention.recentTreatments
      .filter((entry) => entry.type.trim())
      .map((entry) => `${titleCase(entry.type)}${entry.date ? ` (${entry.date})` : ""}`),
    questionnaire.medical.recentMedicalManagement.includes("Current topical medications") && questionnaire.medical.topicalMedications.trim()
      ? `Handle topical medication areas carefully`
      : "",
    questionnaire.medical.recentMedicalManagement.includes("Current oral medications") && questionnaire.medical.oralMedications.trim()
      ? `Confirm oral medication timing with owner`
      : "",
  ].filter(Boolean);

  return Array.from(new Set(items)).slice(0, 4);
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
    questionnaire.medical.topicalMedications.trim() ? `Topical meds: ${questionnaire.medical.topicalMedications.trim()}` : "",
    questionnaire.medical.oralMedications.trim() ? `Oral meds: ${questionnaire.medical.oralMedications.trim()}` : "",
  ].filter(Boolean);

  return Array.from(new Set(items)).slice(0, 4);
}

function buildNotes(questionnaire: BookingHealthQuestionnaire, snapshot: Record<string, unknown>): string[] {
  return [
    getString(snapshot, ["special_notes"]),
    questionnaire.prevention.restrictions.trim(),
    questionnaire.medical.recentVetVisitReason.trim(),
    ...questionnaire.clinical.eatingHabitsAndBehaviors.filter(Boolean),
  ].filter(Boolean);
}

function buildPhotoUrls(snapshot: Record<string, unknown>, primaryKeys: string[], fallbackKeys: string[] = []): string[] {
  const urls = [
    ...getStringList(snapshot, primaryKeys),
    ...getStringList(snapshot, fallbackKeys),
  ]
    .map((url) => buildImageUrl(url) || url)
    .filter(Boolean);

  return Array.from(new Set(urls));
}

export function hasCurrentHealthReport(healthReport: unknown): boolean {
  return Boolean(healthReport && typeof healthReport === "object");
}

export function getGroomerHealthDetailsAvatarUrl(
  detail: Pick<GroomerBookingDetailOut, "pet_avatar"> | null,
  petSnapshot: Record<string, unknown>
): string {
  return (
    buildImageUrl(
      getString(
        detail ? asRecord(detail) : {},
        ["pet_avatar"],
      ) ||
        getString(petSnapshot, ["avatar_url", "primary_photo", "pet_avatar", "avatar"])
    ) || DEFAULT_PET_AVATAR
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="font-comfortaa text-[10px] leading-3 text-[#8B6357]">{label}</p>
      <p className="mt-1 font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">{value || "-"}</p>
    </div>
  );
}

type PetInfoCardProps = {
  avatarUrl: string;
  petName: string;
  serviceName: string;
  phone: string;
  petType: string;
  breed: string;
  birthDate: string;
  genderLabel: string;
  weightLabel: string;
  coatLabel: string;
  behaviorLabel: string;
  frequencyLabel: string;
  serviceTimeLabel: string;
  appointmentDateLabel: string;
  addressLabel: string;
  hasHealthDetails?: boolean;
  detailsContent?: React.ReactNode;
};

function MobileDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556C]">{label}:</p>
      <p className="text-right font-comfortaa text-[14px] font-medium leading-[21px] text-[#0F172B]">{value || "Not provided"}</p>
    </div>
  );
}

function MobileDetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-comfortaa text-[12.25px] font-semibold uppercase tracking-[0.3063px] text-[#0F172B]">{title}</p>
      <div className="mt-[10.5px] space-y-[7px]">{children}</div>
    </div>
  );
}

function MobileVaccinationRow({ label, status, isActive }: { label: string; status: string; isActive: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556C]">{label}:</p>
      <span
        className={`rounded-full px-[8.75px] py-[3.5px] font-comfortaa text-[10.5px] font-medium leading-[14px] ${
          isActive ? "bg-[#DCFCE7] text-[#008236]" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}
      >
        {isActive ? `✓ ${status}` : status}
      </span>
    </div>
  );
}

function DesktopProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556C]">{label}:</p>
      <p className="text-right font-comfortaa text-[14px] font-medium leading-[21px] text-[#0F172B]">{value || "Not provided"}</p>
    </div>
  );
}

function DesktopVaccinationRow({ label, status, isActive }: { label: string; status: string; isActive: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <p className="font-comfortaa text-[14px] leading-[21px] text-[#45556C]">{label}:</p>
      <span
        className={`rounded-full px-[8.75px] py-[3.5px] font-comfortaa text-[10.5px] font-medium leading-[14px] ${
          isActive ? "bg-[#DCFCE7] text-[#008236]" : "bg-[#F3F4F6] text-[#6B7280]"
        }`}
      >
        {isActive ? `✓ ${status}` : status}
      </span>
    </div>
  );
}

function PetInfoCardMobile({
  avatarUrl,
  petName,
  petType,
  breed,
  birthDate,
  weightLabel,
  coatLabel,
  behaviorLabel,
  frequencyLabel,
  hasHealthDetails = false,
  detailsContent,
}: PetInfoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-[16px] border-2 border-[#DE6A07] bg-white px-[22px] py-[14px] md:hidden">
      <div className="flex items-start gap-3">
        <img src={avatarUrl} alt={petName} className="size-14 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">{petName}</p>
          <div className="mt-[7px] grid grid-cols-2 gap-x-10 gap-y-4 text-[#4A3C2A]">
            <SummaryField label="Pet type" value={petType} />
            <SummaryField label="Breed" value={breed} />
            <SummaryField label="Weight" value={weightLabel} />
            <SummaryField label="Date of birth" value={birthDate} />
            <SummaryField label="Coat condition" value={coatLabel} />
            <SummaryField label="Behavior" value={behaviorLabel} />
          </div>
          <div className="mt-2 h-px bg-[#D1D5DC]" />
          <div className="mt-3">
            <div className="w-20">
              <SummaryField label="Frequency" value={frequencyLabel} />
            </div>
          </div>
        </div>
      </div>

      {hasHealthDetails ? (
        <>
          {isExpanded && detailsContent ? (
            <div className="mt-3 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] p-[18.5px]">
              {detailsContent}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            className="mt-2 flex w-full items-center justify-center gap-2 px-3 py-1 text-center"
          >
            <ChevronDown className={`size-3 text-[#8B6357] transition-transform ${isExpanded ? "rotate-180" : "rotate-0"}`} strokeWidth={2} />
            <span className="font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">
              {isExpanded ? "Hide health details" : "Show health details"}
            </span>
          </button>
        </>
      ) : null}
    </section>
  );
}

function PetInfoCardDesktop({
  avatarUrl,
  petName,
  phone,
  petType,
  breed,
  birthDate,
  genderLabel,
  weightLabel,
  coatLabel,
  behaviorLabel,
  frequencyLabel,
}: PetInfoCardProps) {
  return (
    <section className="hidden rounded-[12px] border-2 border-[#DE6A07] bg-white p-[22px] shadow-[0px_8px_6px_rgba(0,0,0,0.1)] md:block">
      <div className="flex items-start gap-2">
        <img src={avatarUrl} alt={petName} className="size-14 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">{petName}</p>
          <div className="mt-[7px] space-y-2">
            <div className="flex flex-wrap gap-[16px_12px] text-[#4A3C2A]">
              <div className="w-20 shrink-0">
                <SummaryField label="Pet type" value={petType} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Breed" value={breed} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Date of birth" value={birthDate} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Gender" value={genderLabel} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Weight" value={weightLabel} />
              </div>
            </div>

            <div className="h-px bg-[#D1D5DC]" />

            <div className="flex items-center gap-3">
              <div className="w-20 shrink-0">
                <SummaryField label="Frequency" value={frequencyLabel} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Coat" value={coatLabel} />
              </div>
              <div className="w-20 shrink-0">
                <SummaryField label="Behavior" value={behaviorLabel} />
              </div>
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="ml-auto inline-flex h-7 shrink-0 items-center gap-[5px] rounded-[32px] bg-[#8B6357] px-7 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#FFF7ED]"
                >
                  Contact
                  <Icon name="button-arrow" className="size-[14px] text-[#FFF7ED]" aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="ml-auto inline-flex h-7 shrink-0 items-center gap-[5px] rounded-[32px] bg-[#8B6357]/45 px-7 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#FFF7ED]/85"
                >
                  Contact
                  <Icon name="button-arrow" className="size-[14px] text-[#FFF7ED]/85" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightPanel({
  title,
  tone,
  items,
  emptyText,
  icon,
  noteText,
}: {
  title: string;
  tone: "danger" | "success" | "info";
  items: string[];
  emptyText: string;
  icon?: React.ReactNode;
  noteText?: string;
}) {
  const toneClasses = {
    danger: {
      wrapper: "border-[#FFC9C9] bg-[#FEF2F2]",
      card: "border-[#FFA2A2] bg-white",
      title: "text-[#82181A]",
      text: "text-[#9F0712]",
    },
    success: {
      wrapper: "border-[#A4F4CF] bg-[#ECFDF5]",
      card: "border-[#9EE7C2] bg-white",
      title: "text-[#004F3B]",
      text: "text-[#314158]",
      index: "bg-[#009966] text-white",
      accent: "text-[#007A55]",
    },
    info: {
      wrapper: "border-[#BEDBFF] bg-[#EFF6FF]",
      card: "border-[#E5E7EB] bg-white",
      title: "text-[#0E2B93]",
      text: "text-[#193CB8]",
      index: "bg-[#2374FF] text-white",
      noteTitle: "text-[#0F172B]",
      noteText: "text-[#314158]",
    },
  }[tone];

  const visibleItems = items.length > 0 ? items : [emptyText];

  return (
    <div className={`rounded-[18px] border-2 p-[14px] ${toneClasses.wrapper}`}>
      {tone === "danger" ? (
        <>
          <h3 className={`font-comfortaa text-[15.75px] font-semibold leading-[24.5px] ${toneClasses.title}`}>{title}</h3>
          <div className="mt-[14px] space-y-[10.5px]">
            {visibleItems.map((item) => (
              <div key={`${title}-${item}`} className={`rounded-[18px] border-2 px-4 py-4 ${toneClasses.card}`}>
                <div className="flex items-start gap-[7px]">
                  <CircleAlert className="mt-1 size-3 shrink-0 text-[#DE1507]" strokeWidth={2.4} />
                  <p className={`font-comfortaa text-[14px] font-semibold leading-[21px] ${toneClasses.text}`}>{item}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : tone === "success" ? (
        <>
          <div className="flex items-center gap-[7px]">
            <span className="text-[15.75px] leading-[24.5px]">💡</span>
            <h3 className={`font-comfortaa text-[15.75px] font-semibold leading-[24.5px] ${toneClasses.title}`}>{title}</h3>
          </div>
          <div className="mt-[14px] space-y-[10.5px]">
            {visibleItems.map((item, index) => {
              const match = item.match(/^(.*?)(\s*\([^()]+\))$/);
              const mainText = match ? match[1].trimEnd() : item;
              const accentText = match ? match[2].trim() : "";

              return (
                <div key={`${title}-${item}`} className="flex items-start gap-[10.5px]">
                  <div className={`flex size-[24.5px] shrink-0 items-center justify-center rounded-full font-comfortaa text-[12.25px] font-semibold leading-[17.5px] ${toneClasses.index}`}>
                    {index + 1}
                  </div>
                  <p className={`pt-[2.25px] font-comfortaa text-[14px] leading-[21px] ${toneClasses.text}`}>
                    {mainText}
                    {accentText ? <span className={`font-medium ${toneClasses.accent}`}> {accentText}</span> : null}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      ) : tone === "info" ? (
        <>
          <h3 className={`font-comfortaa text-[15.75px] font-semibold leading-[24.5px] ${toneClasses.title}`}>{title}</h3>
          <div className="mt-3 space-y-[10.5px]">
            {visibleItems.map((item, index) => (
              <div key={`${title}-${item}`} className="flex items-start gap-[10.5px]">
                <div className={`flex size-[24.5px] shrink-0 items-center justify-center rounded-full font-comfortaa text-[12.25px] font-semibold leading-[17.5px] ${toneClasses.index}`}>
                  {index + 1}
                </div>
                <p className={`pt-[2.25px] font-comfortaa text-[14px] leading-[21px] ${toneClasses.text}`}>{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p className={`font-comfortaa text-[12.25px] font-semibold uppercase leading-[17.5px] tracking-[0.3063px] ${toneClasses.noteTitle}`}>Notes</p>
            <div className={`mt-[10.5px] rounded-[14px] border px-[15px] py-[15px] ${toneClasses.card}`}>
              <p className={`font-comfortaa text-[12.25px] leading-[19.906px] ${toneClasses.noteText}`}>
                {noteText || "No special notes were provided."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {icon}
            <h3 className={`font-comfortaa text-[14px] font-semibold leading-[22px] ${toneClasses.title}`}>{title}</h3>
          </div>
          <div className="mt-3 space-y-[10px]">
            {visibleItems.map((item, index) => (
              <div key={`${title}-${item}`} className={`flex items-start gap-3 rounded-[16px] border-2 px-4 py-3 ${toneClasses.card}`}>
                <div className={`mt-[2px] flex size-5 shrink-0 items-center justify-center rounded-full font-comfortaa text-[10px] font-bold ${toneClasses.index}`}>
                  {index + 1}
                </div>
                <p className={`font-comfortaa text-[13px] leading-5 ${toneClasses.text}`}>{item}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PhotoGalleryCard({ title, photos, emptyText }: { title: string; photos: string[]; emptyText: string }) {
  return (
    <div className="space-y-2">
      <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#4A3C2A]">{title}</p>
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {photos.slice(0, 6).map((photoUrl, index) => (
            <a
              key={`${title}-${index}`}
              href={photoUrl}
              target="_blank"
              rel="noreferrer"
              className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA]"
            >
              <img src={photoUrl} alt={`${title} ${index + 1}`} className="aspect-square w-full object-cover" />
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-[12px] border border-dashed border-[#D6D3D1] bg-[#FAFAFA] px-4 py-5">
          <p className="font-comfortaa text-[12px] leading-[18px] text-[#717182]">{emptyText}</p>
        </div>
      )}
    </div>
  );
}

export default function GroomerHealthDetailsPage() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const parsedBookingId = Number(bookingId);
  const [detail, setDetail] = useState<GroomerBookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingTravel, setIsStartingTravel] = useState(false);
  const [previousGroomerNote, setPreviousGroomerNote] = useState("");
  const [isDesktopProfileExpanded, setIsDesktopProfileExpanded] = useState(true);
  const [isMobileInsightsExpanded, setIsMobileInsightsExpanded] = useState(true);
  const {
    blobUrl: healthReportBlobUrl,
    open: isHealthReportViewerOpen,
    loading: isHealthReportViewerLoading,
    openWithBlob: openHealthReportPdf,
    close: closeHealthReportPdf,
  } = usePdfPreview();

  useEffect(() => {
    if (!Number.isFinite(parsedBookingId)) {
      toast.error("Invalid booking.");
      navigate("/groomer/dashboard", { replace: true });
      return;
    }

    let cancelled = false;
    setPreviousGroomerNote("");

    const loadDetail = async () => {
      setIsLoading(true);
      try {
        const result = await getGroomerBookingDetail(parsedBookingId);
        if (!cancelled) setDetail(result);

        try {
          const petNotes = await getInspectionPetNotes(parsedBookingId);
          const previousNote = petNotes.notes.find(
            (note) => note.booking_id !== parsedBookingId && note.body.trim(),
          );
          if (!cancelled) setPreviousGroomerNote(previousNote?.body.trim() ?? "");
        } catch (error) {
          console.error("Failed to load previous groomer note:", error);
          if (!cancelled) setPreviousGroomerNote("");
        }
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
  const packageSnapshot = useMemo(() => asRecord(detail?.package_snapshot), [detail]);
  const addressSnapshot = useMemo(() => asRecord(detail?.address_snapshot), [detail]);
  const questionnaire = useMemo(() => normalizeQuestionnaire(petSnapshot.health_questionnaire), [petSnapshot]);

  const petName = getString(petSnapshot, ["name"], "Pet");
  const petType = titleCase(getString(petSnapshot, ["pet_type", "species", "type"], "Pet"));
  const breed = getString(petSnapshot, ["breed", "pet_breed"], "-");
  const birthDate = formatBirthLabel(getString(petSnapshot, ["birthday", "date_of_birth", "birth_date"]));
  const genderLabel = titleCase(getString(petSnapshot, ["gender", "sex"], "-"));
  const weightLabel = formatWeightLabel(
    getString(petSnapshot, ["weight_value", "weight_kg", "weight"], ""),
    getString(petSnapshot, ["weight_unit"], ""),
  );
  const coatLabel = titleCase(getString(petSnapshot, ["coat_condition", "coat"], "Not provided"));
  const behaviorLabel = questionnaire.clinical.eatingHabitsAndBehaviors[0] || titleCase(getString(petSnapshot, ["behavior"], "Not provided"));
  const frequencyLabel = formatFrequencyLabel(questionnaire, petSnapshot);
  const phone = getString(detailRecord, ["owner_phone", "phone", "user_phone", "contact_phone"]);
  const serviceName = getString(packageSnapshot, ["service_name"], "Service not provided");
  const serviceTime = getString(packageSnapshot, ["service_time"]);
  const addressLabel = getString(addressSnapshot, ["address", "full_address"], "Address unavailable");
  const appointmentDateLabel = formatScheduleLabel(detail?.scheduled_time ?? "");
  const appointmentTimeLabel = formatGroomerTimeLabel(detail?.scheduled_time ?? "", "-");
  const avatarUrl = getGroomerHealthDetailsAvatarUrl(detail, petSnapshot);

  const alerts = buildAlerts(questionnaire);
  const actionPlan = buildActionPlan(questionnaire);
  const coreNeeds = buildCoreNeeds(questionnaire);
  const noteItems = buildNotes(questionnaire, petSnapshot);
  const vaccinationRows = questionnaire.prevention.vaccinationHistory
    .map(formatVaccinationStatus)
    .filter((item): item is NonNullable<ReturnType<typeof formatVaccinationStatus>> => Boolean(item))
    .slice(0, 6);

  const petPhotos = buildPhotoUrls(petSnapshot, ["photos"], ["primary_photo"]);
  const referencePhotos = buildPhotoUrls(petSnapshot, ["reference_photos"]);

  const nutritionRows = [
    {
      label: "Primary diet",
      value: formatListValue(questionnaire.nutrition.primaryDiet),
    },
    {
      label: "Current brand",
      value: questionnaire.nutrition.currentBrand.trim() || "Not provided",
    },
    {
      label: "Feeding habits",
      value: formatListValue(questionnaire.nutrition.feedingHabits),
    },
    {
      label: "Meals per day",
      value: formatNumberValue(questionnaire.nutrition.feedingFrequencyPerDay, "/ day"),
    },
    {
      label: "Water intake",
      value: formatListValue(questionnaire.nutrition.waterIntake),
    },
    {
      label: "Stool condition",
      value: formatListValue(questionnaire.nutrition.stoolCondition),
    },
    {
      label: "Vomiting",
      value: questionnaire.nutrition.vomitingFrequency || "Not provided",
    },
    {
      label: "Food sensitivities",
      value: formatListValue(
        [
          ...questionnaire.nutrition.foodSensitivities,
          questionnaire.nutrition.otherFoodSensitivity.trim(),
        ].filter(Boolean) as string[],
      ),
    },
    {
      label: "Treat frequency",
      value: questionnaire.nutrition.treatFrequency || "Not provided",
    },
    {
      label: "Treat times per day",
      value: formatNumberValue(questionnaire.nutrition.treatTimesPerDay, "/ day"),
    },
    {
      label: "Treat types",
      value: formatListValue(questionnaire.nutrition.treatTypes),
    },
    {
      label: "Daily supplements",
      value: formatListValue(questionnaire.nutrition.dailySupplements),
    },
  ];

  const energyLevel =
    questionnaire.clinical.metabolicAndGeneralHealth.find((item) => item.toLowerCase().includes("energy")) ||
    questionnaire.clinical.eatingHabitsAndBehaviors.find((item) => item.toLowerCase().includes("energy")) ||
    "Not provided";

  const behaviorRows = [
    {
      label: "Energy level",
      value: titleCase(energyLevel),
    },
    {
      label: "Eating habits & behaviors",
      value: formatListValue(questionnaire.clinical.eatingHabitsAndBehaviors),
    },
    {
      label: "Previous grooming",
      value: frequencyLabel || "Not provided",
    },
  ];

  const scheduledTime = detail?.scheduled_time ?? "";
  const canStartTravel = Boolean(detail?.id) && shouldShowStartTravel(scheduledTime, new Date(), detail?.status);
  const showStartTravelButton = isGroomerStartTravelStatus(detail?.status);
  const joinedNotes = noteItems.length > 0 ? noteItems.join(". ") : "No special notes were provided.";
  const healthReport = detail?.health_report ?? null;
  const hasHealthReport = hasCurrentHealthReport(healthReport);
  const healthReportUpdatedLabel = formatHealthReportUpdatedLabel(healthReport?.updated_at ?? "");
  const healthReportSourceUrl = typeof healthReport?.pdf_url === "string" ? healthReport.pdf_url : null;
  const healthReportPetId = Number(getString(petSnapshot, ["id", "pet_id"], "0")) || 0;
  const hasOwnerReport = BOOKING_HEALTH_STEPS.some((_, index) => {
    if (index === 0) return questionnaire.lifestyle.neighborhoods.length > 0 || questionnaire.lifestyle.neighborhoodDraft.trim().length > 0;
    if (index === 1) return questionnaire.prevention.primaryGoals.length > 0 || questionnaire.prevention.restrictions.trim().length > 0;
    if (index === 2) return questionnaire.nutrition.primaryDiet.length > 0 || questionnaire.nutrition.foodSensitivities.length > 0;
    return questionnaire.clinical.eatingHabitsAndBehaviors.length > 0 || questionnaire.clinical.preExistingHealthConditions.length > 0;
  });

  useEffect(() => {
    setIsMobileInsightsExpanded(hasOwnerReport);
  }, [hasOwnerReport]);

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

  const handleOpenHealthReport = async () => {
    if (!healthReportSourceUrl) {
      if (!healthReportSourceUrl) toast.error("Health report PDF is unavailable.");
      return;
    }

    try {
      await openHealthReportPdf((signal) => fetchAuthenticatedBlob(healthReportSourceUrl, signal));
    } catch (error) {
      console.error("Failed to open health report PDF:", error);
      toast.error("Failed to open health report PDF.");
    }
  };

  if (isLoading) {
    return (
      <AccountContentContainer className="px-4 pb-8 pt-4 sm:px-6">
        <div className="mx-auto w-full space-y-4">
          <div className="h-6 w-52 rounded-full bg-white/20" />
          <div className="h-44 rounded-[20px] bg-white/90" />
          <div className="h-52 rounded-[20px] bg-white/90" />
          <div className="h-40 rounded-[20px] bg-white/90" />
        </div>
      </AccountContentContainer>
    );
  }

  return (
    <AccountContentContainer className="px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto w-full space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 whitespace-nowrap font-comfortaa text-[14px] font-bold leading-[20px] text-white"
        >
          <Link to="/groomer/dashboard" className="transition-colors hover:text-[#FFE4C7]">
            Dashboard
          </Link>
          <span aria-hidden="true">{">"}</span>
          <span className="truncate">{petName}</span>
        </nav>

        <section className="space-y-0">
          <PetInfoCardMobile
            avatarUrl={avatarUrl}
            petName={petName}
            serviceName={serviceName}
            phone={phone}
            petType={petType}
            breed={breed}
            birthDate={birthDate}
            genderLabel={genderLabel}
            weightLabel={weightLabel}
            coatLabel={coatLabel}
            behaviorLabel={behaviorLabel}
            frequencyLabel={frequencyLabel}
            serviceTimeLabel={serviceTime || appointmentTimeLabel}
            appointmentDateLabel={appointmentDateLabel}
            addressLabel={addressLabel}
            hasHealthDetails={hasOwnerReport}
            detailsContent={
              <div className="space-y-4">
                <MobileDetailSection title="Nutrition & diet">
                  {nutritionRows.map((item) => (
                    <MobileDetailRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </MobileDetailSection>

                <MobileDetailSection title="Vaccinations">
                  {vaccinationRows.length > 0 ? (
                    vaccinationRows.map((item) => (
                      <MobileVaccinationRow
                        key={item.label}
                        label={item.label}
                        status={item.isActive ? "Up to date" : item.status}
                        isActive={item.isActive}
                      />
                    ))
                  ) : (
                    <MobileDetailRow label="Vaccinations" value="Not provided" />
                  )}
                </MobileDetailSection>

                <MobileDetailSection title="Behavioral habits">
                  {behaviorRows.map((item) => (
                    <MobileDetailRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </MobileDetailSection>
              </div>
            }
          />
          <PetInfoCardDesktop
            avatarUrl={avatarUrl}
            petName={petName}
            serviceName={serviceName}
            phone={phone}
            petType={petType}
            breed={breed}
            birthDate={birthDate}
            genderLabel={genderLabel}
            weightLabel={weightLabel}
            coatLabel={coatLabel}
            behaviorLabel={behaviorLabel}
            frequencyLabel={frequencyLabel}
            serviceTimeLabel={serviceTime || appointmentTimeLabel}
            appointmentDateLabel={appointmentDateLabel}
            addressLabel={addressLabel}
          />
        </section>

        {hasOwnerReport ? (
          <section className="rounded-[16px] border-2 border-[#DE6A07] bg-white p-[14px] md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileInsightsExpanded((current) => !current)}
              className="flex w-full items-center justify-between gap-4 text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-[#DE6A07]" strokeWidth={2} />
                <h2 className="font-comfortaa text-[15px] font-bold leading-6 text-[#DE6A07]">Insights from owner&apos;s report</h2>
              </div>
              <ChevronDown
                className={`size-4 shrink-0 text-[#8B6357] transition-transform ${isMobileInsightsExpanded ? "rotate-180" : "rotate-0"}`}
                strokeWidth={2}
              />
            </button>

            {isMobileInsightsExpanded ? (
              <div className="mt-4 space-y-3">
                <InsightPanel
                  title="Critical Alerts (Read Before Grooming)"
                  tone="danger"
                  items={alerts}
                  emptyText="No critical alerts were submitted by the owner."
                  icon={<CircleAlert className="size-4 text-[#DE1507]" strokeWidth={2} />}
                />
                <InsightPanel
                  title="Grooming Action Plan"
                  tone="success"
                  items={actionPlan}
                  emptyText="No specific grooming goals were submitted."
                />
                <InsightPanel
                  title="Core needs and note"
                  tone="info"
                  items={coreNeeds}
                  emptyText="No extra care instructions were submitted."
                  noteText={joinedNotes}
                />
              </div>
            ) : null}
          </section>
        ) : null}

        {hasOwnerReport ? (
          <section className="hidden rounded-[18px] border-2 border-[#DE6A07] bg-white px-4 py-4 shadow-[0px_8px_20px_rgba(0,0,0,0.12)] sm:px-5 md:block">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-[#DE6A07]" strokeWidth={2} />
              <h2 className="font-comfortaa text-[15px] font-bold leading-6 text-[#DE6A07]">Insights from owner&apos;s report</h2>
            </div>

            <div className="mt-4 space-y-3">
              <InsightPanel
                title="Critical Alerts (Read Before Grooming)"
                tone="danger"
                items={alerts}
                emptyText="No critical alerts were submitted by the owner."
                icon={<CircleAlert className="size-4 text-[#DE1507]" strokeWidth={2} />}
              />
              <InsightPanel
                title="Grooming Action Plan"
                tone="success"
                items={actionPlan}
                emptyText="No specific grooming goals were submitted."
              />
              <InsightPanel
                title="Core needs and note"
                tone="info"
                items={coreNeeds}
                emptyText="No extra care instructions were submitted."
                noteText={joinedNotes}
              />

              <section className="rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-[18.5px] py-[18.5px]">
                <button
                  type="button"
                  onClick={() => setIsDesktopProfileExpanded((current) => !current)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <h2 className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#314158]">
                    View Full Health Profile (Diet, Vaccines, Habits)
                  </h2>
                  <ChevronDown
                    className={`size-[17.5px] shrink-0 text-[#74829A] transition-transform ${isDesktopProfileExpanded ? "rotate-180" : "rotate-0"}`}
                    strokeWidth={2}
                  />
                </button>

                {isDesktopProfileExpanded ? (
                  <div className="mt-5 space-y-5">
                    <div>
                      <p className="font-comfortaa text-[12.25px] font-semibold uppercase leading-[17.5px] tracking-[0.3063px] text-[#0F172B]">
                        Nutrition & diet
                      </p>
                      <div className="mt-[10.5px] grid gap-[7px] lg:grid-cols-2">
                        {nutritionRows.map((item) => (
                          <DesktopProfileRow key={item.label} label={item.label} value={item.value} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-comfortaa text-[12.25px] font-semibold uppercase leading-[17.5px] tracking-[0.3063px] text-[#0F172B]">
                        Vaccinations
                      </p>
                      <div className="mt-[10.5px] grid gap-[7px] lg:grid-cols-2">
                        {vaccinationRows.length > 0 ? (
                          vaccinationRows.map((item) => (
                            <DesktopVaccinationRow
                              key={item.label}
                              label={item.label}
                              status={item.isActive ? "Up to date" : item.status}
                              isActive={item.isActive}
                            />
                          ))
                        ) : (
                          <DesktopProfileRow label="Vaccinations" value="Not provided" />
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="font-comfortaa text-[12.25px] font-semibold uppercase leading-[17.5px] tracking-[0.3063px] text-[#0F172B]">
                        Behavioral habits
                      </p>
                      <div className="mt-[10.5px] grid gap-[7px] lg:grid-cols-2">
                        {behaviorRows.map((item) => (
                          <DesktopProfileRow key={item.label} label={item.label} value={item.value} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </section>
        ) : null}

        <section className="rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] sm:px-5">
          <h2 className="font-comfortaa text-[16px] font-semibold leading-6 text-[#4A3C2A]">Photos</h2>
          <div className="mt-4 space-y-4">
            <PhotoGalleryCard title="Pet photos" photos={petPhotos} emptyText="The owner did not upload pet photos." />
            <div className="h-px bg-[#E5E7EB]" />
            <PhotoGalleryCard title="Reference photos" photos={referencePhotos} emptyText="The owner did not upload reference photos." />
          </div>
        </section>

        {hasHealthReport ? (
          <HealthReportSection
            reports={[
              {
                petId: healthReportPetId,
                petName,
                updatedAt: healthReportUpdatedLabel ? `Updated: ${healthReportUpdatedLabel}` : "Updated recently",
                status: "ready",
                reportId: healthReport?.id ?? 0,
              } satisfies HealthReportItem,
            ]}
            onOpenPdf={() => void handleOpenHealthReport()}
          />
        ) : null}

        {previousGroomerNote ? (
          <section className="rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] sm:px-5">
            <h2 className="font-comfortaa text-[16px] font-semibold leading-6 text-[#4A3C2A]">Special instruments or notes</h2>
            <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#717182]">Only visible to groomers, not visible to client</p>
            <div className="mt-3 rounded-[12px] border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-4">
              <p className="font-comfortaa text-[12px] leading-[19px] text-[#717182]">{previousGroomerNote}</p>
            </div>
          </section>
        ) : null}

        {showStartTravelButton ? (
          <section className="rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-4 shadow-[0px_8px_20px_rgba(0,0,0,0.08)] sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-comfortaa text-[16px] font-semibold leading-6 text-[#4A3C2A]">Ready to head out?</p>
                <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#717182]">
                  {scheduledTime
                    ? `${canStartTravel ? "Appointment time" : "Start travel available within 2 hours"} • ${appointmentDateLabel} ${appointmentTimeLabel}`
                    : "Appointment time unavailable"}
                </p>
              </div>
              <OrangeButton
                type="button"
                onClick={() => void handleStartTravel()}
                disabled={!canStartTravel || isStartingTravel}
                fullWidth
                className="sm:w-auto sm:min-w-[180px]"
              >
                {isStartingTravel ? <Spinner size="small" color="white" /> : "Start Travel"}
              </OrangeButton>
            </div>
          </section>
        ) : null}
      </div>
      <PdfPreviewDialog
        blobUrl={healthReportBlobUrl}
        fileName={`health-report-${detail?.id ?? "booking"}.pdf`}
        open={isHealthReportViewerOpen}
        loading={isHealthReportViewerLoading}
        onClose={closeHealthReportPdf}
      />
    </AccountContentContainer>
  );
}

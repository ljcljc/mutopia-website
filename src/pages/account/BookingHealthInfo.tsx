import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import IconButtonArrow from "@/assets/icons/icon-button-arrow.svg?react";
import { BrownOutlineButton } from "@/components/common/BrownOutlineButton";
import { OrangeButton } from "@/components/common/OrangeButton";
import { getBookingDetail, updateBookingHealthInfo, type BookingDetailOut, type BookingHealthInfoUpdateIn } from "@/lib/api";
import { BOOKING_HEALTH_STEPS, createDefaultQuestionnaire, normalizeQuestionnaire } from "./booking-health/questionnaire";
import { LifestyleEnvironmentStep } from "./booking-health/steps/LifestyleEnvironmentStep";
import { PreventionCoreNeedsStep } from "./booking-health/steps/PreventionCoreNeedsStep";
import { NutritionDigestionStep } from "./booking-health/steps/NutritionDigestionStep";
import { ClinicalHistoryStep } from "./booking-health/steps/ClinicalHistoryStep";
import type { BookingHealthQuestionnaire } from "./booking-health/types";

function getSnapshotValue(snapshot: Record<string, unknown> | undefined, key: string): string {
  const value = snapshot?.[key];
  return typeof value === "string" ? value : "";
}

function buildLegacyHealthFields(questionnaire: BookingHealthQuestionnaire): Partial<BookingHealthInfoUpdateIn> {
  const groomingDays = questionnaire.lifestyle.groomingIntervalDays;
  let groomingFrequency: string | null = null;
  if (groomingDays > 0 && groomingDays <= 10) groomingFrequency = "weekly";
  else if (groomingDays <= 20) groomingFrequency = "bi_weekly";
  else if (groomingDays <= 45) groomingFrequency = "monthly";
  else if (groomingDays > 45) groomingFrequency = "occasionally";

  return {
    behavior: questionnaire.clinical.eatingHabitsAndBehaviors[0] ?? null,
    grooming_frequency: groomingFrequency,
    special_notes: questionnaire.prevention.restrictions.trim() || questionnaire.medical.recentVetVisitReason.trim() || null,
  };
}

function getLifestyleStepIssues(questionnaire: BookingHealthQuestionnaire): string[] {
  const lifestyle = questionnaire.lifestyle;
  const issues: string[] = [];

  if (lifestyle.neighborhoods.length === 0 && lifestyle.neighborhoodDraft.trim().length === 0) {
    issues.push("Living neighborhood");
  }
  if (lifestyle.livingArrangement.length !== 1) {
    issues.push("Living arrangement");
  }
  if (lifestyle.localEnvironment.length !== 1) {
    issues.push("Local environment");
  }
  if (lifestyle.householdSetup.length !== 1) {
    issues.push("Household setup");
  }
  if (lifestyle.careExperience.length !== 1) {
    issues.push("Your pet care experience");
  }
  if (lifestyle.bathingIntervalDays <= 0) {
    issues.push("Bathing interval");
  }
  if (lifestyle.groomingIntervalDays <= 0) {
    issues.push("Grooming interval");
  }

  return issues;
}

export default function BookingHealthInfo() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const parsedBookingId = Number(bookingId);
  const [detail, setDetail] = useState<BookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [questionnaire, setQuestionnaire] = useState<BookingHealthQuestionnaire>(createDefaultQuestionnaire());

  useEffect(() => {
    if (!Number.isFinite(parsedBookingId)) {
      toast.error("Invalid booking.");
      navigate("/");
      return;
    }

    let cancelled = false;

    const loadDetail = async () => {
      setIsLoading(true);
      try {
        const bookingDetail = await getBookingDetail(parsedBookingId);
        if (cancelled) return;
        const snapshot = (bookingDetail.pet_snapshot ?? {}) as Record<string, unknown>;
        setDetail(bookingDetail);
        setQuestionnaire(normalizeQuestionnaire(snapshot.health_questionnaire));
      } catch (error) {
        console.error("Failed to load booking health info:", error);
        if (!cancelled) {
          toast.error("Failed to load booking information.");
          navigate("/");
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

  const canSubmit = detail?.status === "confirmed";
  const petSnapshot = useMemo(() => ((detail?.pet_snapshot ?? {}) as Record<string, unknown>), [detail]);
  const petName = getSnapshotValue(petSnapshot, "name") || "Your pet";
  const stepMeta = BOOKING_HEALTH_STEPS[currentStep];
  const visualProgressStep = currentStep;
  const visualProgressSegments = BOOKING_HEALTH_STEPS.length;
  const lifestyleStepIssues = useMemo(() => getLifestyleStepIssues(questionnaire), [questionnaire]);
  const canProceedCurrentStep = useMemo(() => {
    if (currentStep === 0) return lifestyleStepIssues.length === 0;
    return true;
  }, [currentStep, lifestyleStepIssues]);

  const handleSubmit = async (nextQuestionnaire: BookingHealthQuestionnaire = questionnaire) => {
    if (!detail) return;
    if (!canSubmit) {
      console.log("[health-form] submit blocked: booking not editable", {
        bookingStatus: detail?.status ?? null,
        bookingId: detail.id,
      });
      toast.error("Health information can only be submitted while the appointment is in the confirmed state.");
      return;
    }

    setIsSaving(true);
    try {
      await updateBookingHealthInfo(detail.id, {
        questionnaire: nextQuestionnaire,
        ...buildLegacyHealthFields(nextQuestionnaire),
      });
      toast.success("Health information updated.");
      navigate(`/account/bookings/${detail.id}`);
    } catch (error) {
      console.error("Failed to update booking health info:", error);
      toast.error("Failed to update health information.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkipClinicalAndSubmit = async () => {
    const nextQuestionnaire: BookingHealthQuestionnaire = {
      ...questionnaire,
      clinical: {
        ...questionnaire.clinical,
        noKnownMedicalConditions: true,
        eatingHabitsAndBehaviors: [],
        metabolicAndGeneralHealth: [],
        preExistingHealthConditions: [],
        chronicConditions: [],
        surgeryHistory: [],
      },
    };

    setQuestionnaire(nextQuestionnaire);
    await handleSubmit(nextQuestionnaire);
  };

  const stepContent = useMemo(() => {
    const props = {
      value: questionnaire,
      onChange: (updater: (current: BookingHealthQuestionnaire) => BookingHealthQuestionnaire) => setQuestionnaire(updater),
    };
    switch (currentStep) {
      case 0:
        return <LifestyleEnvironmentStep {...props} petName={petName} />;
      case 1:
        return <PreventionCoreNeedsStep {...props} petName={petName} />;
      case 2:
        return <NutritionDigestionStep {...props} />;
      default:
        return <ClinicalHistoryStep {...props} onSkipSubmit={() => void handleSkipClinicalAndSubmit()} isSubmitting={isSaving} />;
    }
  }, [currentStep, handleSkipClinicalAndSubmit, isSaving, petName, questionnaire]);

  const handleNext = async () => {
    if (currentStep === 0 && lifestyleStepIssues.length > 0) {
      toast.error(`Please complete: ${lifestyleStepIssues.join(", ")}`);
      return;
    }

    if (currentStep === BOOKING_HEALTH_STEPS.length - 1) {
      await handleSubmit();
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, BOOKING_HEALTH_STEPS.length - 1));
  };

  return (
    <div className="min-h-full bg-[#f9f1e8] px-0 pb-0 pt-0 sm:px-4 sm:pb-8 sm:pt-6">
      <div className="mx-auto w-full max-w-[731px]">
        <div className="overflow-hidden bg-white sm:rounded-[4px] sm:border sm:border-[#e5e7eb] sm:shadow-[0_18px_48px_rgba(15,23,43,0.08)]">
          {isLoading ? (
            <div className="space-y-4 p-6 sm:p-8">
              <div className="h-8 w-52 rounded-full bg-[#ead8c7]" />
              <div className="h-20 rounded-[24px] bg-[#f4e7da]" />
              <div className="h-60 rounded-[24px] bg-[#f8ede3]" />
            </div>
          ) : (
            <>
              <div className="border-b border-[#e5e7eb] bg-white">
                <div className="mx-auto w-full max-w-[588px] px-4 pb-7 pt-4 sm:px-[21px] sm:pb-[28px] sm:pt-[14px]">
                  <div className="flex items-center gap-[14px]">
                    {currentStep > 0 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((step) => step - 1)}
                        className="inline-flex size-[31px] cursor-pointer items-center justify-center rounded-full text-[#25314c]"
                        aria-label="Go back"
                      >
                        <ArrowLeft className="size-[17px]" strokeWidth={1.8} />
                      </button>
                    ) : null}
                    <p className="shrink-0 font-comfortaa text-[14px] font-normal leading-[22.75px] text-black">{stepMeta.timeLabel}</p>
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-[5.25px]">
                        {Array.from({ length: visualProgressSegments }, (_, index) => (
                          <span
                            key={index}
                            className={`h-[5.25px] flex-1 rounded-full ${index <= visualProgressStep ? "bg-[#8b6357]" : "bg-[#e5e7eb]"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-7 sm:px-[21px] sm:py-[28px]">
                {!canSubmit ? (
                  <div className="mx-auto mb-5 w-full max-w-[588px] rounded-[18px] border border-[#ef4444] bg-[#fef2f2] px-4 py-3 font-comfortaa text-[13px] text-[#b91c1c]">
                    This appointment is currently `{detail?.status ?? "unavailable"}`. You can review the form, but submission is only available when the appointment is in the confirmed state.
                  </div>
                ) : null}

                {stepContent}
              </div>

              <div className="border-t border-[#e5e7eb] bg-white shadow-[0_-10px_18px_rgba(15,23,43,0.06)]">
                <div className="mx-auto flex w-full max-w-[588px] items-center justify-center px-4 py-[14px] sm:px-[21px]">
                  <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-center">
                    {currentStep > 0 ? (
                      <BrownOutlineButton
                        onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
                        disabled={isSaving}
                        size="standard"
                        className="w-full px-5 py-3 text-[13px] font-bold sm:w-auto"
                      >
                        Back
                      </BrownOutlineButton>
                    ) : null}
                    <OrangeButton
                      onClick={() => void handleNext()}
                      disabled={!canProceedCurrentStep}
                      loading={isSaving}
                      fullWidth
                      className="min-h-[52px] w-full rounded-[16777200px] bg-[#8B6357] px-6 py-4 text-[15px] font-semibold text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] hover:bg-[#8B6357CC] active:bg-[#6F4B41] focus-visible:bg-[#8B6357CC] sm:w-auto sm:min-w-[330px]"
                    >
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span>{stepMeta.cta}</span>
                        {!isSaving ? <IconButtonArrow className="size-[14px] shrink-0" aria-hidden="true" /> : null}
                      </span>
                    </OrangeButton>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

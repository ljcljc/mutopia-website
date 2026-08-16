import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { OrangeButton } from "@/components/common";
import { Spinner } from "@/components/common/Spinner";
import AccountContentContainer from "@/components/layout/AccountContentContainer";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteInspectionPhoto,
  getCheckInObservation,
  getGroomerBookingDetail,
  getPhotoHealthAnalysis,
  getPhotoHealthReportDraft,
  getPublishedPhotoHealthReport,
  fetchAuthenticatedBlob,
  getPhotoHealthInspection,
  savePhotoHealthInspectionProgress,
  retryPhotoHealthAnalysis,
  publishPhotoHealthReport,
  startPhotoHealthInspection,
  submitPhotoHealthInspection,
  updateInspectionPhoto,
  updatePhotoHealthReportInsights,
  uploadInspectionPhoto,
  type InspectionArea,
  type InspectionPhotoClassification,
  type InspectionPhotoOut,
  type PhotoHealthInspectionOut,
  type PhotoHealthReportDraftOut,
} from "@/lib/api";
import { InspectionAreaSection } from "@/modules/groomer/components/InspectionAreaSection";
import { InspectionPhotoReview } from "@/modules/groomer/components/InspectionPhotoReview";
import { PhotoHealthReportReview } from "@/modules/groomer/components/PhotoHealthReportReview";
import { PhotoHealthOverview } from "@/modules/groomer/components/PhotoHealthOverview";
import { INSPECTION_STEPS } from "@/modules/groomer/photoHealthConfig";

interface InspectionLocalDraft {
  currentStep: number;
  currentNote: string;
  handoverNote: string;
  overallProfessionalImpression: PhotoHealthInspectionOut["overall_professional_impression"];
  step6Phase: PhotoHealthInspectionOut["step6_phase"];
  observationTags: string[];
  photos: Array<
    Pick<
      InspectionPhotoOut,
      "id" | "classification" | "finding_hints" | "confirmed"
    >
  >;
  lastReviewPhotoId: number | null;
  panelSnap: "collapsed" | "default" | "expanded";
}

const inspectionDraftKey = (bookingId: number, petId: number) =>
  `photo-health-draft:${bookingId}:${petId}`;

function normalizeStep6Phase(
  value: unknown
): PhotoHealthInspectionOut["step6_phase"] {
  return value === "notes" ? "notes" : "impression";
}

function getPetCacheId(petSnapshot?: Record<string, unknown>): number | null {
  const value = petSnapshot?.id ?? petSnapshot?.pet_id;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function restoreLocalDraft(
  inspection: PhotoHealthInspectionOut,
  draft: InspectionLocalDraft
): PhotoHealthInspectionOut {
  const photoDrafts = new Map(draft.photos.map((photo) => [photo.id, photo]));
  return {
    ...inspection,
    current_step: Math.max(
      1,
      Math.min(6, draft.currentStep || inspection.current_step)
    ),
    current_note: draft.currentNote,
    handover_note: draft.handoverNote ?? inspection.handover_note,
    overall_professional_impression:
      draft.overallProfessionalImpression ??
      inspection.overall_professional_impression,
    step6_phase: normalizeStep6Phase(
      draft.step6Phase ?? inspection.step6_phase
    ),
    observation_tags: draft.observationTags,
    photos: inspection.photos.map((photo) => ({
      ...photo,
      ...photoDrafts.get(photo.id),
    })),
  };
}

function ReportPageShell({
  breadcrumbLabel,
  children,
}: {
  breadcrumbLabel: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#633479] pb-28">
      <AccountContentContainer className="px-4 pb-8 pt-4 sm:px-6">
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 whitespace-nowrap font-comfortaa text-[14px] font-bold leading-[20px] text-white"
          >
            <Link
              to="/groomer/dashboard"
              className="transition-colors hover:text-[#FFE4C7]"
            >
              Dashboard
            </Link>
            <span aria-hidden="true">{">"}</span>
            <span className="truncate">{breadcrumbLabel}</span>
          </nav>
          {children}
        </div>
      </AccountContentContainer>
    </main>
  );
}

function ReportGenerationLoadingScreen() {
  return (
    <main
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[#633479] px-6"
      role="status"
      aria-live="polite"
      aria-label="Generating health report"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <Spinner size={52} color="#7DE0C3" />
        <p className="font-comfortaa text-[18px] font-semibold leading-7 text-white">
          Generating health report...
        </p>
      </div>
    </main>
  );
}

function InspectionStepActions({
  disabled,
  nextLabel,
  previousLabel = "Previous",
  onNext,
  onPrevious,
}: {
  disabled: boolean;
  nextLabel: string;
  previousLabel?: string;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      <button
        type="button"
        disabled={disabled}
        onClick={onPrevious}
        className="h-12 w-full cursor-pointer rounded-full border border-white bg-transparent px-5 font-comfortaa text-[14px] text-white transition-colors hover:bg-white/10 active:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#633479] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[228px]"
      >
        {previousLabel}
      </button>
      <OrangeButton
        type="button"
        fullWidth
        disabled={disabled}
        onClick={onNext}
        textSize={14}
        className="sm:max-w-[228px]"
      >
        {nextLabel}
      </OrangeButton>
    </div>
  );
}

export default function GroomerPhotoHealthInspectionPage() {
  const navigate = useNavigate();
  const bookingId = Number(useParams().bookingId);
  const [inspection, setInspection] = useState<PhotoHealthInspectionOut | null>(
    null
  );
  const [booking, setBooking] = useState<Awaited<
    ReturnType<typeof getGroomerBookingDetail>
  > | null>(null);
  const [arrival, setArrival] = useState<Awaited<
    ReturnType<typeof getCheckInObservation>
  > | null>(null);
  const [currentNote, setCurrentNote] = useState("");
  const [handoverNote, setHandoverNote] = useState("");
  const [overallProfessionalImpression, setOverallProfessionalImpression] =
    useState<PhotoHealthInspectionOut["overall_professional_impression"]>("");
  const [step6Phase, setStep6Phase] =
    useState<PhotoHealthInspectionOut["step6_phase"]>("impression");
  const [observationTags, setObservationTags] = useState<string[]>([]);
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [reviewPanelSnap, setReviewPanelSnap] = useState<
    "collapsed" | "default" | "expanded"
  >("default");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [draft, setDraft] = useState<PhotoHealthReportDraftOut | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const openFilePicker = (input: HTMLInputElement | null) => {
    if (!input || input.disabled) return;
    input.click();
  };
  const inspectionStatus = inspection?.status;
  const petId = getPetCacheId(booking?.pet_snapshot) ?? bookingId;
  const localDraftKey = Number.isFinite(petId)
    ? inspectionDraftKey(bookingId, petId as number)
    : null;

  useEffect(() => {
    if (!Number.isFinite(bookingId)) return;
    Promise.all([
      getGroomerBookingDetail(bookingId),
      getCheckInObservation(bookingId),
      getPhotoHealthInspection(bookingId)
        .then((lookup) => lookup.inspection)
        .catch(() => null),
    ])
      .then(([bookingData, arrivalData, inspectionData]) => {
        setBooking(bookingData);
        setArrival(arrivalData);
        let restoredInspection = inspectionData;
        if (inspectionData?.status === "draft") {
          try {
            const raw = window.localStorage.getItem(
              inspectionDraftKey(
                bookingId,
                getPetCacheId(bookingData.pet_snapshot) ?? bookingId
              )
            );
            if (raw) {
              const localDraft = JSON.parse(raw) as InspectionLocalDraft;
              restoredInspection = restoreLocalDraft(
                inspectionData,
                localDraft
              );
              setReviewPanelSnap(localDraft.panelSnap ?? "default");
            }
          } catch {
            // Ignore malformed or unavailable local storage and continue with server state.
          }
        }
        setInspection(restoredInspection);
        if (inspectionData) {
          setCurrentNote(
            restoredInspection?.current_note ?? inspectionData.current_note
          );
          setHandoverNote(
            restoredInspection?.handover_note ?? inspectionData.handover_note
          );
          setOverallProfessionalImpression(
            restoredInspection?.overall_professional_impression ??
              inspectionData.overall_professional_impression
          );
          setStep6Phase(
            normalizeStep6Phase(
              restoredInspection?.step6_phase ?? inspectionData.step6_phase
            )
          );
          setObservationTags(
            restoredInspection?.observation_tags ??
              inspectionData.observation_tags
          );
          if (inspectionData.status === "published") {
            getPublishedPhotoHealthReport(bookingId).then(setDraft);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!localDraftKey || !inspection || inspection.status !== "draft") return;
    const draft: InspectionLocalDraft = {
      currentStep: inspection.current_step,
      currentNote,
      handoverNote,
      overallProfessionalImpression,
      step6Phase,
      observationTags,
      photos: inspection.photos.map(
        ({ id, classification, finding_hints, confirmed }) => ({
          id,
          classification,
          finding_hints,
          confirmed,
        })
      ),
      lastReviewPhotoId: reviewQueue[0] ?? null,
      panelSnap: reviewPanelSnap,
    };
    window.localStorage.setItem(localDraftKey, JSON.stringify(draft));
  }, [
    currentNote,
    handoverNote,
    inspection,
    localDraftKey,
    observationTags,
    overallProfessionalImpression,
    reviewPanelSnap,
    reviewQueue,
    step6Phase,
  ]);

  useEffect(() => {
    if (
      !inspectionStatus ||
      !["submitted", "analyzing", "analysis_failed", "review"].includes(
        inspectionStatus
      )
    )
      return;
    if (inspectionStatus === "review") {
      getPhotoHealthReportDraft(bookingId).then(setDraft);
      return;
    }
    if (inspectionStatus === "analysis_failed") {
      setAnalysisFailed(true);
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    let cancelled = false;
    let timer: number | undefined;
    const poll = async () => {
      try {
        const analysis = await getPhotoHealthAnalysis(bookingId);
        if (cancelled) return;
        if (analysis.review_ready) {
          const reportDraft = await getPhotoHealthReportDraft(bookingId);
          if (!cancelled) {
            setDraft(reportDraft);
            setInspection((current) =>
              current ? { ...current, status: "review" } : current
            );
            setSubmitting(false);
          }
        } else if (analysis.status === "failed") {
          setAnalysisFailed(true);
          setSubmitting(false);
        } else {
          timer = window.setTimeout(() => void poll(), 2000);
        }
      } catch {
        if (!cancelled) timer = window.setTimeout(() => void poll(), 3000);
      }
    };
    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [bookingId, inspectionStatus]);

  const step = inspection?.current_step ?? 0;
  const stepConfig = step >= 1 && step <= 5 ? INSPECTION_STEPS[step] : null;
  const breadcrumbLabel =
    step >= 1 && step <= 5 && stepConfig
      ? `Step ${step} of 6 - ${stepConfig.title}`
      : "Step 6 of 6 - Summary & notes";
  const nextStepLabel =
    step >= 1 && step <= 5
      ? `Next: ${(() => {
          const title = (INSPECTION_STEPS[step + 1]?.title ?? "Note").replace(
            /\s*\(Optional\)$/,
            ""
          );
          return title.toLowerCase().endsWith("inspection")
            ? title
            : `${title} inspection`;
        })()}`
      : "Next";
  const activeReviewPhoto = useMemo(
    () =>
      inspection?.photos.find((photo) => photo.id === reviewQueue[0]) ?? null,
    [inspection?.photos, reviewQueue]
  );
  const activeReviewConfig =
    stepConfig?.areas.find((area) => area.area === activeReviewPhoto?.area) ??
    null;
  const isPairedInspection = step === 2 || step === 4;
  const pairedAreas = isPairedInspection ? (stepConfig?.areas ?? []) : [];
  const pairedAreaName = step === 2 ? "Ear" : "Eye";
  const activeAreaPhotos = useMemo(
    () =>
      isPairedInspection
        ? (inspection?.photos.filter((photo) =>
            pairedAreas.some((area) => area.area === photo.area)
          ) ?? [])
        : (inspection?.photos.filter(
            (photo) => photo.area === activeReviewPhoto?.area
          ) ?? []),
    [
      activeReviewPhoto?.area,
      inspection?.photos,
      isPairedInspection,
      pairedAreas,
    ]
  );
  const pairedInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const begin = async () => {
    if (inspection) {
      setShowOverview(false);
      return;
    }
    setSaving(true);
    try {
      const data = await startPhotoHealthInspection(bookingId);
      setInspection(data);
      setCurrentNote(data.current_note);
      setHandoverNote(data.handover_note);
      setOverallProfessionalImpression(data.overall_professional_impression);
      setStep6Phase(normalizeStep6Phase(data.step6_phase));
      setObservationTags(data.observation_tags);
    } finally {
      setSaving(false);
    }
  };

  const goToPreviousStep = () => {
    if (!inspection) return;
    if (step === 6 && step6Phase === "notes") {
      setStep6Phase("impression");
      setInspection((current) =>
        current ? { ...current, step6_phase: "impression" } : current
      );
      setErrors({});
      return;
    }
    const previousStep = step === 1 ? 1 : step - 1;
    if (step === 1) setShowOverview(true);
    else
      setInspection((current) =>
        current ? { ...current, current_step: previousStep } : current
      );
    setErrors({});
  };

  const upload = async (area: InspectionArea, files: File[]) => {
    setErrors((current) => ({ ...current, [area]: "" }));
    const uploaded: InspectionPhotoOut[] = [];
    for (const file of files) {
      try {
        const requestId =
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${file.name}-${file.lastModified}`;
        uploaded.push(
          await uploadInspectionPhoto(bookingId, area, file, requestId)
        );
      } catch {
        setErrors((current) => ({
          ...current,
          [area]: "Some photos failed to upload. Accepted photos were kept.",
        }));
      }
    }
    if (uploaded.length > 0) {
      setInspection((current) =>
        current
          ? { ...current, photos: [...current.photos, ...uploaded] }
          : current
      );
      setReviewQueue((current) => [
        ...current,
        ...uploaded.map((photo) => photo.id),
      ]);
    }
  };

  const confirmPhoto = (
    photoId: number,
    classification: InspectionPhotoClassification,
    findingHints: string[]
  ) => {
    setInspection((current) =>
      current
        ? {
            ...current,
            photos: current.photos.map((photo) =>
              photo.id === photoId
                ? {
                    ...photo,
                    classification,
                    finding_hints: findingHints,
                    confirmed: true,
                  }
                : photo
            ),
          }
        : current
    );
  };

  const removePhoto = async (photo: InspectionPhotoOut) => {
    await deleteInspectionPhoto(bookingId, photo.id);
    setInspection((current) =>
      current
        ? {
            ...current,
            photos: current.photos.filter((item) => item.id !== photo.id),
          }
        : current
    );
  };

  const saveStep = async (nextStep: number) => {
    if (!inspection) return;
    if (stepConfig) {
      const minimumPhotos = isPairedInspection ? 2 : 1;
      const missing = stepConfig.areas.filter(
        (area) =>
          inspection.photos.filter(
            (photo) => photo.area === area.area && photo.confirmed
          ).length < minimumPhotos
      );
      if (missing.length > 0) {
        setErrors((current) => ({
          ...current,
          page: `Confirm at least ${minimumPhotos} photo${minimumPhotos === 1 ? "" : "s"} for ${missing.map((item) => item.label).join(", ")}.`,
        }));
        return;
      }
    }
    const nextPhase = nextStep === 6 ? "impression" : step6Phase;
    setSaving(true);
    try {
      const updated = await savePhotoHealthInspectionProgress(bookingId, {
        current_step: nextStep,
        observation_tags: observationTags,
        current_note: currentNote,
        handover_note: handoverNote,
        overall_professional_impression: overallProfessionalImpression,
        step6_phase: nextPhase,
      });
      setInspection(updated);
      setStep6Phase(normalizeStep6Phase(updated.step6_phase));
      setErrors({});
    } catch {
      setErrors((current) => ({
        ...current,
        page: "Unable to save progress. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  const continueToNotes = async () => {
    if (!inspection || !overallProfessionalImpression) return;
    setSaving(true);
    try {
      const updated = await savePhotoHealthInspectionProgress(bookingId, {
        current_step: 6,
        observation_tags: observationTags,
        current_note: currentNote,
        handover_note: handoverNote,
        overall_professional_impression: overallProfessionalImpression,
        step6_phase: "notes",
      });
      setInspection(updated);
      setStep6Phase("notes");
      setErrors({});
    } catch {
      setErrors((current) => ({
        ...current,
        page: "Unable to save progress. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    if (!inspection) return;
    setSubmitting(true);
    try {
      for (const photo of inspection.photos) {
        await updateInspectionPhoto(bookingId, photo.id, {
          classification: photo.classification ?? "normal",
          finding_hints:
            photo.classification === "ai_scan" ? photo.finding_hints : [],
        });
      }
      await savePhotoHealthInspectionProgress(bookingId, {
        current_step: 6,
        observation_tags: observationTags,
        current_note: currentNote,
        handover_note: handoverNote,
        overall_professional_impression: overallProfessionalImpression,
        step6_phase: "notes",
      });
      await submitPhotoHealthInspection(bookingId, observationTags);
      if (localDraftKey) window.localStorage.removeItem(localDraftKey);
      setAnalysisFailed(false);
      setInspection((current) =>
        current ? { ...current, status: "analyzing", locked: true } : current
      );
    } catch {
      setErrors((current) => ({
        ...current,
        page: "Unable to generate the report. Please try again.",
      }));
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <ReportPageShell breadcrumbLabel="Fill health report">
        <div className="flex justify-center py-24">
          <Spinner size={48} color="#fff" />
        </div>
      </ReportPageShell>
    );

  if (submitting) return <ReportGenerationLoadingScreen />;

  if (draft) {
    return (
      <ReportPageShell
        breadcrumbLabel={
          draft.published ? "View health report" : "Review health report"
        }
      >
        <PhotoHealthReportReview
          draft={draft}
          readOnly={Boolean(draft.published)}
          onSaveInsights={async (value) => {
            const updated = await updatePhotoHealthReportInsights(
              bookingId,
              value
            );
            setDraft(updated);
          }}
          onViewPdf={async () => {
            if (!draft.pdf_url) throw new Error("Published PDF is unavailable");
            return fetchAuthenticatedBlob(draft.pdf_url);
          }}
          onPublish={async () => {
            const result = await publishPhotoHealthReport(bookingId);
            toast.success(
              result.status === "preparing"
                ? "Report is being prepared"
                : "Health report published"
            );
            navigate("/groomer/dashboard");
          }}
        />
      </ReportPageShell>
    );
  }

  if (!inspection || showOverview) {
    return (
      <ReportPageShell breadcrumbLabel="Fill health report">
        <div className="mt-6">
          <PhotoHealthOverview
            booking={booking}
            arrival={arrival}
            saving={saving}
            startLabel={
              inspection
                ? "Continue AI photo health inspection"
                : "Start AI photo health inspection"
            }
            onStart={() => void begin()}
          />
        </div>
      </ReportPageShell>
    );
  }

  return (
    <ReportPageShell breadcrumbLabel={breadcrumbLabel}>
      {step <= 5 && stepConfig ? (
        <>
          {isPairedInspection ? (
            <section className="rounded-xl bg-white pb-[14px] pl-[13.995px] pr-[13.995px] pt-[13.995px] shadow-[0px_8px_6px_0px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-3">
                <div className="flex w-full justify-center">
                  <p className="w-[323px] text-[0px] leading-[0] font-comfortaa font-semibold text-[#4A3C2A]">
                    <span className="block text-[16px] leading-[28px]">
                      {pairedAreaName} - After grooming photos
                    </span>
                    <span className="block font-comfortaa text-[12px] font-normal leading-[16px]">
                      Add at least 2 photos of each{" "}
                      {pairedAreaName.toLowerCase()} for AI health inspection
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">
                    {pairedAreaName} photo
                  </p>
                  <div className="rounded-[16px] border border-[#633479] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                    <div className="grid w-full grid-cols-2 gap-x-1 gap-y-6 overflow-visible">
                      {inspection.photos
                        .filter((photo) =>
                          pairedAreas.some((area) => area.area === photo.area)
                        )
                        .map((photo) => (
                          <div
                            key={photo.id}
                            className="relative h-[84px] min-w-0 overflow-visible rounded-[14px] border border-[#D4C9E0]"
                          >
                            <button
                              type="button"
                              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[14px]"
                              onClick={() => setReviewQueue([photo.id])}
                            >
                              <img
                                src={photo.url}
                                alt={photo.original_filename}
                                className="size-full object-cover object-center"
                              />
                            </button>
                            {photo.classification === "ai_scan" ? (
                              <span className="pointer-events-none absolute bottom-[-8px] left-[12px] z-30 rounded-full border border-[#F1C9CC] bg-[#FFF6F6] px-3 py-1 font-comfortaa text-xs text-[#B23A48] shadow-sm">
                                AI Scan
                              </span>
                            ) : null}
                            <button
                              type="button"
                              aria-label={`Remove ${photo.original_filename}`}
                              className="absolute right-[-4px] top-[-4px] z-20 flex size-[20px] cursor-pointer items-center justify-center rounded-[8px] border border-[#4c4c4c] bg-neutral-100 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                              onClick={() => void removePhoto(photo)}
                            >
                              <span className="relative flex size-[10px] items-center justify-center">
                                <span className="absolute h-[1.5px] w-full rotate-45 bg-[#4c4c4c]" />
                                <span className="absolute h-[1.5px] w-full rotate-[-45deg] bg-[#4c4c4c]" />
                              </span>
                            </button>
                          </div>
                        ))}
                      {pairedAreas.map((area) => {
                        return (
                          <div
                            key={area.area}
                            className="relative flex h-[84px] min-w-0"
                          >
                            <button
                              type="button"
                              className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)]"
                              onClick={() =>
                                openFilePicker(
                                  pairedInputRefs.current[area.area]
                                )
                              }
                              aria-label={`Upload ${area.label}`}
                            >
                              <div className="flex h-[29px] w-[28px] items-center justify-center rounded-full bg-[#F0EBF7]">
                                <img
                                  alt=""
                                  src="https://www.figma.com/api/mcp/asset/97e70b58-326c-44e7-aac1-fa2bb74c7fec.svg"
                                  className="size-[20.99px]"
                                />
                              </div>
                              <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">
                                {area.label}
                              </span>
                            </button>
                            <input
                              ref={(element) => {
                                pairedInputRefs.current[area.area] = element;
                              }}
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                              multiple
                              className="hidden"
                              onChange={(event) => {
                                const selected = Array.from(
                                  event.currentTarget.files ?? []
                                );
                                if (selected.length > 0)
                                  void upload(area.area, selected);
                                event.currentTarget.value = "";
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="space-y-5">
              {stepConfig.areas.map((area) => (
                <InspectionAreaSection
                  key={area.area}
                  config={area}
                  photos={inspection.photos.filter(
                    (photo) => photo.area === area.area
                  )}
                  disabled={inspection.locked || saving}
                  error={errors[area.area]}
                  onFilesSelected={(files) => void upload(area.area, files)}
                  onRemove={(photo) => void removePhoto(photo)}
                  onOpen={(photo) => setReviewQueue([photo.id])}
                />
              ))}
            </div>
          )}
          {errors.page ? (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-red-700"
            >
              {errors.page}
            </p>
          ) : null}
          {analysisFailed ? (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-4 text-red-700"
            >
              <p>
                Health report generation failed. Your inspection is saved and
                locked.
              </p>
              <button
                type="button"
                className="mt-3 rounded-full border border-red-700 px-4 py-2"
                onClick={() => {
                  setAnalysisFailed(false);
                  setSubmitting(true);
                  void retryPhotoHealthAnalysis(bookingId)
                    .then(() =>
                      setInspection((current) =>
                        current ? { ...current, status: "analyzing" } : current
                      )
                    )
                    .catch(() => {
                      setSubmitting(false);
                      setAnalysisFailed(true);
                    });
                }}
              >
                Retry generating report
              </button>
            </div>
          ) : null}
          <InspectionStepActions
            disabled={saving}
            nextLabel={
              step === 5 ? "Add Notes & Generate Report" : nextStepLabel
            }
            onPrevious={goToPreviousStep}
            onNext={() => void saveStep(step + 1)}
          />
        </>
      ) : (
        <>
          {step6Phase === "impression" ? (
            <section className="rounded-2xl bg-white p-6 shadow-lg">
              <h1 className="font-comfortaa text-[24px] font-semibold leading-8 text-[#4A3C2A]">
                Overall professional impression
              </h1>
              <p className="mt-2 font-comfortaa text-[14px] leading-5 text-[#4A3C2A]">
                Guide the AI! Select your overall professional impression to
                ensure the most accurate report.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  [
                    "grade_a",
                    "Grade A: Optimal",
                    "Healthy & stable. Routine grooming only.",
                  ],
                  [
                    "grade_b",
                    "Grade B: Minor Care",
                    "Mild issues. Can be improved with targeted grooming/diet.",
                  ],
                  [
                    "grade_c",
                    "Grade C: Attention Needed",
                    "Persistent symptoms. Vet checkup recommended.",
                  ],
                  [
                    "grade_d",
                    "Grade D: High Risk",
                    "Multiple anomalies. Urgent veterinary intervention advised.",
                  ],
                ].map(([value, title, description]) => {
                  const selected = overallProfessionalImpression === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={selected}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${selected ? "border-[#D99C2B] bg-[#FFF7E7]" : "border-[#D4C9E0] bg-white"}`}
                      onClick={() =>
                        setOverallProfessionalImpression(
                          value as PhotoHealthInspectionOut["overall_professional_impression"]
                        )
                      }
                    >
                      <span className="block font-comfortaa text-[15px] font-bold text-[#4A3C2A]">
                        {title}
                      </span>
                      <span className="mt-1 block font-comfortaa text-[12px] leading-[18px] text-[#6B625D]">
                        {description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="space-y-5">
              <section className="rounded-[12px] bg-white px-[13.995px] pb-[14px] pt-[13.995px] shadow-[0px_8px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-3">
                  <h2 className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#4A3C2A]">
                    Note - After grooming
                    <span className="block text-[12px] font-normal leading-[16px]">
                      Add note to health report
                    </span>
                  </h2>
                  <div className="rounded-[14px] border-[1.47px] border-[#633479] bg-white p-[15.47px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]">
                    <label
                      htmlFor="groomer-note"
                      className="block font-comfortaa text-[12px] font-bold uppercase leading-[18px] tracking-[0.96px] text-[#A89BBB]"
                    >
                      Groomer Note
                    </label>
                    <Textarea
                      id="groomer-note"
                      value={currentNote}
                      onChange={(event) => setCurrentNote(event.target.value)}
                      placeholder="Add a note for the health report"
                      className="mt-[6px] h-[62px] resize-none border-0 bg-transparent p-0 font-comfortaa text-[13px] leading-[20.8px] text-[#5A4A6A] placeholder:text-[#A89BBB] focus-visible:ring-0"
                    />
                  </div>
                </div>
              </section>
              <section className="rounded-[12px] bg-[#E5A56E] px-[13.995px] pb-[14px] pt-[13.995px] shadow-[0px_8px_6px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-3">
                  <h2 className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#4A3C2A]">
                    Special instruments or notes
                    <span className="block text-[12px] font-normal leading-[16px]">
                      Only visible to groomers, not visible to client
                    </span>
                  </h2>
                  <div className="rounded-[14px] border-[1.47px] border-[#633479] bg-white p-[15.47px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]">
                    <label
                      htmlFor="partner-note"
                      className="block font-comfortaa text-[12px] font-bold uppercase leading-[18px] tracking-[0.96px] text-[#A89BBB]"
                    >
                      Note for your partner
                    </label>
                    <Textarea
                      id="partner-note"
                      value={handoverNote}
                      onChange={(event) => setHandoverNote(event.target.value)}
                      placeholder="Add a note for your partner"
                      className="mt-[6px] h-[62px] resize-none border-0 bg-transparent p-0 font-comfortaa text-[13px] leading-[20.8px] text-[#5A4A6A] placeholder:text-[#A89BBB] focus-visible:ring-0"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}
          {errors.page ? (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-red-700"
            >
              {errors.page}
            </p>
          ) : null}
          <InspectionStepActions
            disabled={
              saving ||
              submitting ||
              inspection.locked ||
              (step6Phase === "impression" && !overallProfessionalImpression)
            }
            nextLabel={
              step6Phase === "impression"
                ? "Add notes"
                : "All good! Generate Report"
            }
            previousLabel={
              step6Phase === "impression"
                ? "Previous: Posture"
                : "Previous: Summary"
            }
            onPrevious={goToPreviousStep}
            onNext={() =>
              void (step6Phase === "impression" ? continueToNotes() : submit())
            }
          />
        </>
      )}

      <InspectionPhotoReview
        photos={activeAreaPhotos}
        activePhotoId={activeReviewPhoto?.id ?? null}
        config={activeReviewConfig}
        open={Boolean(activeReviewPhoto)}
        onActivePhotoChange={(photoId) => setReviewQueue([photoId])}
        onClose={() => setReviewQueue([])}
        onChange={confirmPhoto}
        onAddPhoto={(files) => {
          if (activeReviewPhoto) void upload(activeReviewPhoto.area, files);
        }}
        observationTags={observationTags}
        onObservationTagsChange={setObservationTags}
        initialPanelSnap={reviewPanelSnap}
        onPanelSnapChange={setReviewPanelSnap}
        petName={
          typeof booking?.pet_snapshot?.name === "string"
            ? booking.pet_snapshot.name
            : "Current pet"
        }
        petBreed={
          typeof booking?.pet_snapshot?.breed === "string"
            ? booking.pet_snapshot.breed
            : undefined
        }
        onProceedToNotes={() => {
          setReviewQueue([]);
          void saveStep(6);
        }}
      />
    </ReportPageShell>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomTextarea, OrangeButton } from "@/components/common";
import { Spinner } from "@/components/common/Spinner";
import AccountContentContainer from "@/components/layout/AccountContentContainer";
import {
  deleteInspectionPhoto,
  getCheckInObservation,
  getGroomerBookingDetail,
  getInspectionPetNotes,
  getPhotoHealthAnalysis,
  getPhotoHealthReportDraft,
  getPublishedPhotoHealthReport,
  fetchAuthenticatedBlob,
  getPhotoHealthInspection,
  savePhotoHealthInspectionProgress,
  retryPhotoHealthAnalysis,
  previewPhotoHealthReportPdf,
  publishPhotoHealthReport,
  startPhotoHealthInspection,
  submitPhotoHealthInspection,
  updateInspectionPhoto,
  updatePhotoHealthReportInsights,
  uploadInspectionPhoto,
  type GroomerPetNoteOut,
  type InspectionArea,
  type InspectionPhotoClassification,
  type InspectionPhotoOut,
  type PhotoHealthInspectionOut,
  type PhotoHealthReportDraftOut,
} from "@/lib/api";
import { InspectionAreaSection } from "@/modules/groomer/components/InspectionAreaSection";
import { InspectionPhotoReview } from "@/modules/groomer/components/InspectionPhotoReview";
import { InspectionTagGroup } from "@/modules/groomer/components/InspectionTagGroup";
import { PhotoHealthReportReview } from "@/modules/groomer/components/PhotoHealthReportReview";
import { PhotoHealthOverview } from "@/modules/groomer/components/PhotoHealthOverview";
import { INSPECTION_STEPS, OBSERVATION_GROUPS } from "@/modules/groomer/photoHealthConfig";

interface InspectionLocalDraft {
  currentStep: number;
  currentNote: string;
  observationTags: string[];
  photos: Array<Pick<InspectionPhotoOut, "id" | "classification" | "finding_hints" | "confirmed">>;
  lastReviewPhotoId: number | null;
  panelSnap: "collapsed" | "default" | "expanded";
}

const inspectionDraftKey = (bookingId: number, petId: number) => `photo-health-draft:${bookingId}:${petId}`;

function getPetCacheId(petSnapshot?: Record<string, unknown>): number | null {
  const value = petSnapshot?.id ?? petSnapshot?.pet_id;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function restoreLocalDraft(inspection: PhotoHealthInspectionOut, draft: InspectionLocalDraft): PhotoHealthInspectionOut {
  const photoDrafts = new Map(draft.photos.map((photo) => [photo.id, photo]));
  return {
    ...inspection,
    current_step: Math.max(1, Math.min(6, draft.currentStep || inspection.current_step)),
    current_note: draft.currentNote,
    observation_tags: draft.observationTags,
    photos: inspection.photos.map((photo) => ({ ...photo, ...photoDrafts.get(photo.id) })),
  };
}

function ReportPageShell({ breadcrumbLabel, children }: { breadcrumbLabel: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#633479] pb-28">
      <AccountContentContainer className="px-4 pb-8 pt-4 sm:px-6">
        <div className="space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 whitespace-nowrap font-comfortaa text-[14px] font-bold leading-[20px] text-white"
        >
          <Link to="/groomer/dashboard" className="transition-colors hover:text-[#FFE4C7]">
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

function InspectionStepActions({
  disabled,
  nextLabel,
  onNext,
  onPrevious,
}: {
  disabled: boolean;
  nextLabel: string;
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
        Previous
      </button>
      <OrangeButton type="button" fullWidth disabled={disabled} onClick={onNext} textSize={14} className="sm:max-w-[228px]">
        {nextLabel}
      </OrangeButton>
    </div>
  );
}

export default function GroomerPhotoHealthInspectionPage() {
  const navigate = useNavigate();
  const bookingId = Number(useParams().bookingId);
  const [inspection, setInspection] = useState<PhotoHealthInspectionOut | null>(null);
  const [booking, setBooking] = useState<Awaited<ReturnType<typeof getGroomerBookingDetail>> | null>(null);
  const [arrival, setArrival] = useState<Awaited<ReturnType<typeof getCheckInObservation>> | null>(null);
  const [notes, setNotes] = useState<GroomerPetNoteOut[]>([]);
  const [internalInstruction, setInternalInstruction] = useState("");
  const [currentNote, setCurrentNote] = useState("");
  const [observationTags, setObservationTags] = useState<string[]>([]);
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [reviewPanelSnap, setReviewPanelSnap] = useState<"collapsed" | "default" | "expanded">("default");
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
  const localDraftKey = Number.isFinite(petId) ? inspectionDraftKey(bookingId, petId as number) : null;

  useEffect(() => {
    if (!Number.isFinite(bookingId)) return;
    Promise.all([
      getGroomerBookingDetail(bookingId),
      getCheckInObservation(bookingId),
      getPhotoHealthInspection(bookingId).then((lookup) => lookup.inspection).catch(() => null),
    ]).then(([bookingData, arrivalData, inspectionData]) => {
      setBooking(bookingData);
      setArrival(arrivalData);
      let restoredInspection = inspectionData;
      if (inspectionData?.status === "draft") {
        try {
          const raw = window.localStorage.getItem(inspectionDraftKey(bookingId, getPetCacheId(bookingData.pet_snapshot) ?? bookingId));
          if (raw) {
            const localDraft = JSON.parse(raw) as InspectionLocalDraft;
            restoredInspection = restoreLocalDraft(inspectionData, localDraft);
            setReviewPanelSnap(localDraft.panelSnap ?? "default");
          }
        } catch {
          // Ignore malformed or unavailable local storage and continue with server state.
        }
      }
      setInspection(restoredInspection);
      if (inspectionData) {
        setCurrentNote(restoredInspection?.current_note ?? inspectionData.current_note);
        setObservationTags(restoredInspection?.observation_tags ?? inspectionData.observation_tags);
        getInspectionPetNotes(bookingId).then((timeline) => {
          setNotes(timeline.notes);
          setInternalInstruction(timeline.internal_service_instruction);
        });
        if (inspectionData.status === "published") {
          getPublishedPhotoHealthReport(bookingId).then(setDraft);
        }
      }
    }).finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!localDraftKey || !inspection || inspection.status !== "draft") return;
    const draft: InspectionLocalDraft = {
      currentStep: inspection.current_step,
      currentNote,
      observationTags,
      photos: inspection.photos.map(({ id, classification, finding_hints, confirmed }) => ({ id, classification, finding_hints, confirmed })),
      lastReviewPhotoId: reviewQueue[0] ?? null,
      panelSnap: reviewPanelSnap,
    };
    window.localStorage.setItem(localDraftKey, JSON.stringify(draft));
  }, [currentNote, inspection, localDraftKey, observationTags, reviewPanelSnap, reviewQueue]);

  useEffect(() => {
    if (!inspectionStatus || !["submitted", "analyzing", "analysis_failed", "review"].includes(inspectionStatus)) return;
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
            setInspection((current) => current ? { ...current, status: "review" } : current);
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
  const breadcrumbLabel = step >= 1 && step <= 5 && stepConfig
    ? `Step ${step} of 6 - ${stepConfig.title}`
    : "Step 6 of 6 - Note (Optional)";
  const nextStepLabel = step >= 1 && step <= 5
    ? `Next: ${(() => {
        const title = (INSPECTION_STEPS[step + 1]?.title ?? "Note").replace(/\s*\(Optional\)$/, "");
        return title.toLowerCase().endsWith("inspection") ? title : `${title} inspection`;
      })()}`
    : "Next";
  const activeReviewPhoto = useMemo(
    () => inspection?.photos.find((photo) => photo.id === reviewQueue[0]) ?? null,
    [inspection?.photos, reviewQueue],
  );
  const activeReviewConfig = stepConfig?.areas.find((area) => area.area === activeReviewPhoto?.area) ?? null;
  const activeAreaPhotos = useMemo(
    () => inspection?.photos.filter((photo) => photo.area === activeReviewPhoto?.area) ?? [],
    [activeReviewPhoto?.area, inspection?.photos],
  );
  const earAreas = step === 2 ? stepConfig?.areas ?? [] : [];
  const earInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      setObservationTags(data.observation_tags);
      const timeline = await getInspectionPetNotes(bookingId);
      setNotes(timeline.notes);
      setInternalInstruction(timeline.internal_service_instruction);
    } finally {
      setSaving(false);
    }
  };

  const goToPreviousStep = () => {
    if (!inspection) return;
    const previousStep = step === 1 ? 1 : step - 1;
    if (step === 1) setShowOverview(true);
    else setInspection((current) => current ? { ...current, current_step: previousStep } : current);
    setErrors({});
  };

  const upload = async (area: InspectionArea, files: File[]) => {
    setErrors((current) => ({ ...current, [area]: "" }));
    const uploaded: InspectionPhotoOut[] = [];
    for (const file of files) {
      try {
        const requestId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${file.name}-${file.lastModified}`;
        uploaded.push(await uploadInspectionPhoto(bookingId, area, file, requestId));
      } catch {
        setErrors((current) => ({ ...current, [area]: "Some photos failed to upload. Accepted photos were kept." }));
      }
    }
    if (uploaded.length > 0) {
      setInspection((current) => current ? { ...current, photos: [...current.photos, ...uploaded] } : current);
      setReviewQueue((current) => [...current, ...uploaded.map((photo) => photo.id)]);
    }
  };

  const confirmPhoto = (photoId: number, classification: InspectionPhotoClassification, findingHints: string[]) => {
    setInspection((current) => current ? {
      ...current,
      photos: current.photos.map((photo) => photo.id === photoId ? {
        ...photo,
        classification,
        finding_hints: findingHints,
        confirmed: true,
      } : photo),
    } : current);
  };

  const removePhoto = async (photo: InspectionPhotoOut) => {
    await deleteInspectionPhoto(bookingId, photo.id);
    setInspection((current) => current ? { ...current, photos: current.photos.filter((item) => item.id !== photo.id) } : current);
  };

  const saveStep = (nextStep: number) => {
    if (!inspection) return;
    if (stepConfig) {
      const missing = stepConfig.areas.filter((area) => !inspection.photos.some((photo) => photo.area === area.area && photo.confirmed));
      if (missing.length > 0) {
        setErrors((current) => ({ ...current, page: `Confirm at least one photo for ${missing.map((item) => item.label).join(", ")}.` }));
        return;
      }
    }
    setInspection((current) => current ? { ...current, current_step: nextStep } : current);
    setErrors({});
  };

  const submit = async () => {
    if (!inspection) return;
    setSubmitting(true);
    try {
      for (const photo of inspection.photos) {
        await updateInspectionPhoto(bookingId, photo.id, {
          classification: photo.classification ?? "normal",
          finding_hints: photo.classification === "ai_scan" ? photo.finding_hints : [],
        });
      }
      await savePhotoHealthInspectionProgress(bookingId, {
        current_step: 6,
        observation_tags: observationTags,
        current_note: currentNote,
      });
      await submitPhotoHealthInspection(bookingId, observationTags);
      if (localDraftKey) window.localStorage.removeItem(localDraftKey);
      setAnalysisFailed(false);
      setInspection((current) => current ? { ...current, status: "analyzing", locked: true } : current);
    } catch {
      setErrors((current) => ({ ...current, page: "Unable to generate the report. Please try again." }));
      setSubmitting(false);
    }
  };

  if (loading) return <ReportPageShell breadcrumbLabel="Fill health report"><div className="flex justify-center py-24"><Spinner size={48} color="#fff" /></div></ReportPageShell>;

  if (draft) {
    return (
      <ReportPageShell breadcrumbLabel={draft.published ? "View health report" : "Review health report"}>
        <PhotoHealthReportReview
          draft={draft}
          readOnly={Boolean(draft.published)}
          onSaveInsights={async (value) => {
            const updated = await updatePhotoHealthReportInsights(bookingId, value);
            setDraft(updated);
          }}
          onPreviewPdf={async () => {
            if (draft.pdf_url) return fetchAuthenticatedBlob(draft.pdf_url);
            const preview = await previewPhotoHealthReportPdf(bookingId);
            return fetchAuthenticatedBlob(preview.url);
          }}
          onPublish={async () => {
            await publishPhotoHealthReport(bookingId);
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
            startLabel={inspection ? "Continue AI photo health inspection" : "Start AI photo health inspection"}
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
          {step === 2 ? (
            <section className="rounded-xl bg-white pb-[14px] pl-[13.995px] pr-[13.995px] pt-[13.995px] shadow-[0px_8px_6px_0px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-3">
                <div className="flex w-full justify-center">
                  <p className="w-[323px] text-[0px] leading-[0] font-comfortaa font-semibold text-[#4A3C2A]">
                    <span className="block text-[16px] leading-[28px]">Ear - After grooming photos</span>
                    <span className="block font-comfortaa text-[12px] font-normal leading-[16px]">Add up to 2 photos for AI health inspection</span>
                  </p>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">Ear photo</p>
                  <div className="rounded-[16px] border border-[#633479] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                    <div className="flex h-[84px] w-full gap-1">
                      {earAreas.map((area) => {
                        const areaPhoto = inspection.photos.find((photo) => photo.area === area.area) ?? null;
                        return (
                          <div
                            key={area.area}
                            className="relative flex min-w-0 flex-1"
                          >
                            {areaPhoto ? (
                              <>
                                <button
                                  type="button"
                                  className="absolute inset-0 overflow-hidden rounded-[14px]"
                                  onClick={() => setReviewQueue([areaPhoto.id])}
                                >
                                  <img
                                    src={areaPhoto.url}
                                    alt={areaPhoto.original_filename}
                                    className="size-full rounded-[14px] object-cover object-center"
                                  />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Remove ${area.label}`}
                                  className="absolute right-[-4px] top-[-4px] z-20 flex size-[20px] cursor-pointer items-center justify-center rounded-[8px] border border-[#4c4c4c] bg-neutral-100 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                                  onClick={() => void removePhoto(areaPhoto)}
                                >
                                  <span className="relative flex size-[10px] items-center justify-center">
                                    <span className="absolute h-[1.5px] w-full rotate-45 bg-[#4c4c4c]" />
                                    <span className="absolute h-[1.5px] w-full rotate-[-45deg] bg-[#4c4c4c]" />
                                  </span>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)]"
                                onClick={() => openFilePicker(earInputRefs.current[area.area])}
                                aria-label={`Upload ${area.label}`}
                              >
                                <div className="flex h-[29px] w-[28px] items-center justify-center rounded-full bg-[#F0EBF7]">
                                  <img alt="" src="https://www.figma.com/api/mcp/asset/97e70b58-326c-44e7-aac1-fa2bb74c7fec.svg" className="size-[20.99px]" />
                                </div>
                                <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">{area.label}</span>
                                <input
                                  ref={(element) => {
                                    earInputRefs.current[area.area] = element;
                                  }}
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                                  multiple={false}
                                  className="hidden"
                                  onChange={(event) => {
                                    const selected = Array.from(event.currentTarget.files ?? []);
                                    if (selected.length > 0) {
                                      void upload(area.area, selected);
                                    }
                                    event.currentTarget.value = "";
                                  }}
                                />
                              </button>
                            )}
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
                  photos={inspection.photos.filter((photo) => photo.area === area.area)}
                  disabled={inspection.locked || saving}
                  error={errors[area.area]}
                  onFilesSelected={(files) => void upload(area.area, files)}
                  onRemove={(photo) => void removePhoto(photo)}
                  onOpen={(photo) => setReviewQueue([photo.id])}
                />
              ))}
              {step === 5 ? OBSERVATION_GROUPS.map((group) => (
                <div key={group.label} className="rounded-2xl bg-[#121212] p-5">
                  <InspectionTagGroup label={group.label} tags={group.tags} selected={observationTags} onChange={setObservationTags} />
                </div>
              )) : null}
            </div>
          )}
          {errors.page ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{errors.page}</p> : null}
          {analysisFailed ? (
            <div role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
              <p>Health report generation failed. Your inspection is saved and locked.</p>
              <button type="button" className="mt-3 rounded-full border border-red-700 px-4 py-2" onClick={() => {
                setAnalysisFailed(false);
                setSubmitting(true);
                void retryPhotoHealthAnalysis(bookingId).then(() => setInspection((current) => current ? { ...current, status: "analyzing" } : current)).catch(() => {
                  setSubmitting(false);
                  setAnalysisFailed(true);
                });
              }}>Retry generating report</button>
            </div>
          ) : null}
          <InspectionStepActions
            disabled={saving}
            nextLabel={step === 5 ? "Add Notes & Generate Report" : nextStepLabel}
            onPrevious={goToPreviousStep}
            onNext={() => saveStep(step + 1)}
          />
        </>
      ) : (
        <>
          <section className="rounded-2xl bg-white p-6">
            <CustomTextarea label="Note - After grooming" value={currentNote} onChange={(event) => setCurrentNote(event.target.value)} showResizeHandle={false} />
          </section>
          <section className="mt-5 rounded-2xl bg-[#D5AF78] p-6">
            <h2 className="font-comfortaa text-xl text-[#4A3C2A]">Special instruments or notes</h2>
            <p className="text-sm text-[#4A3C2A]">Only visible to groomers, not visible to client</p>
            <div className="mt-4 rounded-xl bg-white p-4 text-[#4A3C2A]">{internalInstruction || "No special instructions"}</div>
          </section>
          {notes.length > 0 ? <div className="mt-5 space-y-3">{notes.map((note) => (
            <article key={note.id} className="rounded-2xl bg-white p-5 shadow-lg">
              <p className="text-[#4A3C2A]">{note.body}</p>
              <p className="mt-2 text-xs text-[#8B817F]">{note.author_name} · {new Date(note.created_at).toLocaleDateString()}</p>
            </article>
          ))}</div> : null}
          {errors.page ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{errors.page}</p> : null}
          <InspectionStepActions
            disabled={submitting || inspection.locked}
            nextLabel="All good! Generate Report"
            onPrevious={goToPreviousStep}
            onNext={() => void submit()}
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
        petName={typeof booking?.pet_snapshot?.name === "string" ? booking.pet_snapshot.name : "Current pet"}
        petBreed={typeof booking?.pet_snapshot?.breed === "string" ? booking.pet_snapshot.breed : undefined}
        onProceedToNotes={() => {
          setReviewQueue([]);
          setInspection((current) => current ? { ...current, current_step: 6 } : current);
        }}
      />

      {submitting ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#6E5685]/80" role="status" aria-label="Generating health report">
          <Spinner size={52} color="#7DE0C3" />
        </div>
      ) : null}
    </ReportPageShell>
  );
}

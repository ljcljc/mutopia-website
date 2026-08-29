import { useState } from "react";
import {
  CustomTextarea,
  Icon,
  type IconName,
  OrangeButton,
  PdfPreviewDialog,
} from "@/components/common";
import { usePdfPreview } from "@/components/common/usePdfPreview";
import { ImagePreview } from "@/components/common";
import GroomerAiInsightsEditIcon from "@/assets/icons/icon-groomer-ai-insights-edit.svg";
import GroomerAiInsightsIcon from "@/assets/icons/icon-groomer-ai-insights.svg";
import type {
  BookingDetailOut,
  InspectionPhotoOut,
  PhotoHealthReportDraftOut,
} from "@/lib/api";
import { PhotoHealthBookingPetCard } from "./PhotoHealthBookingPetCard";
import { WellnessSummaryCard } from "./WellnessSummaryCard";

const AREAS = [
  { key: "skin", label: "Skin", sources: ["skin"], iconName: "wellness-skin" },
  {
    key: "ear",
    label: "Ear",
    sources: ["left_ear", "right_ear"],
    iconName: "wellness-ear",
  },
  {
    key: "mouth",
    label: "Mouth",
    sources: ["mouth"],
    iconName: "wellness-mouth",
  },
  {
    key: "eye",
    label: "Eye",
    sources: ["left_eye", "right_eye"],
    iconName: "wellness-eye",
  },
  {
    key: "mobility",
    label: "Mobility",
    sources: ["posture"],
    iconName: "wellness-mobility",
  },
] as const satisfies ReadonlyArray<{
  key: keyof PhotoHealthReportDraftOut["wellness_summary"];
  label: string;
  sources: readonly string[];
  iconName: IconName;
}>;

export function PhotoHealthReportReview({
  draft,
  booking,
  onSaveInsights,
  onViewPdf,
  onPublish,
  readOnly = false,
}: {
  draft: PhotoHealthReportDraftOut;
  booking: BookingDetailOut | null;
  onSaveInsights: (value: string) => Promise<void>;
  onViewPdf: (signal: AbortSignal) => Promise<Blob>;
  onPublish: () => Promise<void>;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(draft.groomer_insights);
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState<InspectionPhotoOut[]>([]);
  const [publishing, setPublishing] = useState(false);
  const { blobUrl: pdfUrl, open: pdfOpen, loading: pdfLoading, openWithBlob: openPdfPreview, close: closePdfPreview } = usePdfPreview();
  const petName = typeof draft.pet.name === "string" ? draft.pet.name : "Pet";
  const preparing = ["retry", "running"].includes(
    draft.pdf_generation_status ?? ""
  );
  const generationFailed = draft.pdf_generation_status === "failed";

  const save = async () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await onSaveInsights(value.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="md:max-w-[calc((100%-1.25rem)/2)]">
        <PhotoHealthBookingPetCard booking={booking} />
      </div>

      <section className="mt-5 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <img
              src={GroomerAiInsightsIcon}
              alt=""
              aria-hidden="true"
              className="size-[17.5px] shrink-0"
            />
            <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#92400E]">
              Groomer &amp; AI Insights
            </h2>
          </div>
          {!editing && !readOnly && !preparing && !generationFailed ? (
            <button
              type="button"
              aria-label="Edit Groomer’s note & AI Insights"
              onClick={() => setEditing(true)}
              className="size-5 shrink-0 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#92400E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF7ED]"
            >
              <img
                src={GroomerAiInsightsEditIcon}
                alt=""
                aria-hidden="true"
                className="size-full"
              />
            </button>
          ) : null}
        </div>
        {editing ? (
          <div className="mt-2 space-y-3">
            <CustomTextarea
              label=""
              aria-label="Groomer & AI Insights"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              showResizeHandle={false}
              error={!value.trim() ? "Insights are required" : undefined}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setValue(draft.groomer_insights);
                  setEditing(false);
                }}
                className="cursor-pointer rounded-full border border-[#633479] px-4 py-3 text-[#633479] transition-colors hover:bg-[rgba(99,52,121,0.16)] active:border-[#2374FF] active:bg-[rgba(99,52,121,0.16)] focus-visible:border-[#2374FF] focus-visible:bg-[rgba(99,52,121,0.16)] focus-visible:outline-none"
              >
                Cancel
              </button>
              <OrangeButton
                type="button"
                fullWidth
                disabled={!value.trim() || saving}
                onClick={() => void save()}
              >
                Save
              </OrangeButton>
            </div>
          </div>
        ) : (
          <p className="mt-2 whitespace-pre-wrap font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#78350F]">
            {draft.groomer_insights}
          </p>
        )}
      </section>

      {preparing ? (
        <p className="mt-5 rounded-xl bg-white/15 px-4 py-3 text-sm text-white">
          Report is being prepared. It will be published automatically when
          ready.
        </p>
      ) : null}
      {generationFailed ? (
        <p className="mt-5 rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm text-[#9F1239]">
          Report preparation failed. You can retry generation now.
        </p>
      ) : null}

      <h2 className="mt-8 font-comfortaa text-[18px] font-bold leading-[27px] text-[#FFF7ED]">
        Wellness Summary
      </h2>
      <div className="mt-4 space-y-2.5">
        {AREAS.map((area) => (
          <WellnessSummaryCard
            key={area.key}
            label={area.label}
            result={draft.wellness_summary[area.key]}
            iconName={area.iconName}
            onViewPhotos={() =>
              setViewing(
                draft.photos.filter((photo) =>
                  (area.sources as readonly string[]).includes(photo.area)
                )
              )
            }
          />
        ))}
      </div>
      {readOnly ? (
        <OrangeButton
          type="button"
          fullWidth
          className="mt-7"
          onClick={() => void openPdfPreview(onViewPdf)}
        >
          View published PDF
        </OrangeButton>
      ) : null}
      {!readOnly ? (
        <OrangeButton
          type="button"
          fullWidth
          disabled={editing || preparing || publishing}
          className="mt-7 !bg-[#00A63E] shadow-[0_4px_6px_rgba(0,166,62,0.3)] hover:!bg-[rgba(0,166,62,0.8)] active:!bg-[rgba(0,166,62,0.8)] focus-visible:!bg-[rgba(0,166,62,0.8)]"
          onClick={() => {
            setPublishing(true);
            void onPublish().finally(() => setPublishing(false));
          }}
        >
          <span className="flex items-center justify-center gap-3 font-comfortaa text-[16px] font-bold leading-6 text-white">
            <Icon name="submit-ai-health-report" size={20} />
          {generationFailed ? "Retry publish" : "Publish report"}
          </span>
        </OrangeButton>
      ) : null}
      <ImagePreview
        images={viewing.map((photo) => photo.url)}
        fileNames={viewing.map(
          (photo) =>
            `${photo.area.replace("_", " ")} — ${photo.original_filename}`
        )}
        open={viewing.length > 0}
        onClose={() => setViewing([])}
      />
      <PdfPreviewDialog
        blobUrl={pdfUrl}
        fileName={`${petName}-health-report.pdf`}
        open={pdfOpen}
        loading={pdfLoading}
        onClose={closePdfPreview}
      />
    </>
  );
}

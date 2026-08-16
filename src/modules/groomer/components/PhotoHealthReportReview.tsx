import { useEffect, useState } from "react";
import { PencilIcon } from "lucide-react";
import { CustomTextarea, OrangeButton, PdfDocumentViewer } from "@/components/common";
import { ImagePreview } from "@/components/common";
import type { InspectionPhotoOut, PhotoHealthReportDraftOut } from "@/lib/api";
import { WellnessSummaryCard } from "./WellnessSummaryCard";

const AREAS = [
  { key: "skin", label: "Skin", sources: ["skin"], icon: "♡" },
  { key: "ear", label: "Ear", sources: ["left_ear", "right_ear"], icon: "♧" },
  { key: "mouth", label: "Mouth", sources: ["mouth"], icon: "♡" },
  { key: "eye", label: "Eye", sources: ["left_eye", "right_eye"], icon: "◉" },
  { key: "mobility", label: "Mobility", sources: ["posture"], icon: "⌁" },
] as const;

export function PhotoHealthReportReview({
  draft,
  onSaveInsights,
  onViewPdf,
  onPublish,
  readOnly = false,
}: {
  draft: PhotoHealthReportDraftOut;
  onSaveInsights: (value: string) => Promise<void>;
  onViewPdf: () => Promise<Blob>;
  onPublish: () => Promise<void>;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(draft.groomer_insights);
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState<InspectionPhotoOut[]>([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const petName = typeof draft.pet.name === "string" ? draft.pet.name : "Pet";
  const preparing = ["retry", "running"].includes(draft.pdf_generation_status ?? "");
  const generationFailed = draft.pdf_generation_status === "failed";

  useEffect(() => () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  const save = async () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await onSaveInsights(value.trim());
      setPdfUrl("");
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border-2 border-[#DCA132] bg-white p-5 shadow-lg">
        <h2 className="font-comfortaa text-xl text-[#4A3C2A]">{petName}</h2>
        <p className="mt-2 text-sm text-[#6B625B]">{draft.appointment.service_name || "Grooming appointment"}</p>
      </section>

      <section className="mt-5 rounded-2xl bg-[#FFF9ED] p-6 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-comfortaa text-xl text-[#7B4A20]">✣ Groomer &amp; AI Insights</h2>
          {!editing && !readOnly && !preparing && !generationFailed ? <button type="button" aria-label="Edit Groomer and AI Insights" onClick={() => setEditing(true)}><PencilIcon /></button> : null}
        </div>
        {editing ? (
          <div className="mt-4 space-y-3">
            <CustomTextarea label="Groomer & AI Insights" value={value} onChange={(event) => setValue(event.target.value)} showResizeHandle={false} error={!value.trim() ? "Insights are required" : undefined} />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setValue(draft.groomer_insights); setEditing(false); }} className="rounded-full border border-[#633479] px-4 py-3 text-[#633479]">Cancel</button>
              <OrangeButton type="button" fullWidth disabled={!value.trim() || saving} onClick={() => void save()}>Save</OrangeButton>
            </div>
          </div>
        ) : <p className="mt-4 leading-7 text-[#6C4D32]">{draft.groomer_insights}</p>}
      </section>

      {preparing ? <p className="mt-5 rounded-xl bg-white/15 px-4 py-3 text-sm text-white">Report is being prepared. It will be published automatically when ready.</p> : null}
      {generationFailed ? <p className="mt-5 rounded-xl bg-[#FFF1F2] px-4 py-3 text-sm text-[#9F1239]">Report preparation failed. Our operations team has been alerted.</p> : null}

      <h2 className="mt-8 font-comfortaa text-2xl text-white">Wellness Summary</h2>
      <div className="mt-5 space-y-4">
        {AREAS.map((area) => (
          <WellnessSummaryCard
            key={area.key}
            label={area.label}
            result={draft.wellness_summary[area.key]}
            icon={area.icon}
            onViewPhotos={() => setViewing(draft.photos.filter((photo) => (area.sources as readonly string[]).includes(photo.area)))}
          />
        ))}
      </div>
      {readOnly ? <OrangeButton type="button" fullWidth className="mt-7" onClick={() => void onViewPdf().then((blob) => {
        setPdfUrl(URL.createObjectURL(blob));
        setPdfOpen(true);
      })}>View published PDF</OrangeButton> : null}
      {!readOnly ? <OrangeButton type="button" fullWidth disabled={editing || preparing || generationFailed || publishing} className="mt-7" onClick={() => {
        setPublishing(true);
        void onPublish().finally(() => setPublishing(false));
      }}>Submit AI health report</OrangeButton> : null}
      <ImagePreview
        images={viewing.map((photo) => photo.url)}
        fileNames={viewing.map((photo) => `${photo.area.replace("_", " ")} — ${photo.original_filename}`)}
        open={viewing.length > 0}
        onClose={() => setViewing([])}
      />
      <PdfDocumentViewer blobUrl={pdfUrl} fileName={`${petName}-health-report.pdf`} open={pdfOpen} onClose={() => setPdfOpen(false)} />
    </>
  );
}

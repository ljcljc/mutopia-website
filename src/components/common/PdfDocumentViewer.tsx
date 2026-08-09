import { useEffect } from "react";

export interface PdfDocumentViewerProps {
  /** Authenticated object URL owned and revoked by the caller. */
  blobUrl: string;
  fileName: string;
  open: boolean;
  onClose: () => void;
}

/** Displays a previously fetched PDF and exposes download/share actions. */
export function PdfDocumentViewer({
  blobUrl,
  fileName,
  open,
  onClose,
}: PdfDocumentViewerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);
  if (!open) return null;
  return (
    <div role="dialog" aria-label="PDF preview" className="fixed inset-0 z-[120] flex flex-col bg-[#24152B]/90 p-3 sm:p-6">
      <div className="mb-3 flex items-center justify-end gap-3">
        {typeof navigator.share === "function" ? <button type="button" onClick={() => void navigator.share({ title: fileName, url: blobUrl })} className="rounded-full bg-white px-4 py-2 text-[#633479]">Share</button> : null}
        <a href={blobUrl} download={fileName} className="rounded-full bg-white px-4 py-2 text-[#633479]">Download</a>
        <button type="button" onClick={onClose} aria-label="Close PDF preview" className="rounded-full bg-white px-4 py-2 text-[#633479]">Close</button>
      </div>
      <iframe title="Health report PDF" src={blobUrl} className="min-h-0 flex-1 rounded-xl bg-white" />
    </div>
  );
}

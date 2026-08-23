import { useEffect } from "react";
import { Spinner } from "./Spinner";

export interface PdfPreviewDialogProps {
  /** Authenticated object URL owned and revoked by the caller. */
  blobUrl?: string;
  fileName: string;
  open: boolean;
  loading?: boolean;
  title?: string;
  onClose: () => void;
}

/** Generic PDF preview modal with download/share actions. */
export function PdfPreviewDialog({
  blobUrl,
  fileName,
  open,
  loading = false,
  title = "PDF preview",
  onClose,
}: PdfPreviewDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-label={title} className="fixed inset-0 z-[120] flex flex-col bg-[#24152B]/90 p-3 sm:p-6">
      <div className="mb-3 flex items-center justify-end gap-2">
        {blobUrl ? <a href={blobUrl} download={fileName} className="cursor-pointer rounded-full bg-white px-4 py-2 text-[#633479]">Download</a> : null}
        <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="cursor-pointer rounded-full bg-white px-4 py-2 text-[#633479]">Close</button>
      </div>
      {loading || !blobUrl ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl bg-white">
          <Spinner size="large" color="#633479" />
        </div>
      ) : (
        <iframe title={title} src={blobUrl} className="min-h-0 flex-1 rounded-xl bg-white" />
      )}
    </div>
  );
}

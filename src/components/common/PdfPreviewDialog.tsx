import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";
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
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "z-[120] overflow-hidden border-0 p-0",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! mx-auto! flex! h-[90vh]! max-h-[90vh]! w-full! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "inset-0! flex! h-screen! max-h-none! w-screen! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-none! bg-[#24152B]/90 p-3! sm:p-6!",
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Preview the health report PDF.</DialogDescription>
        <div className={cn("flex shrink-0 items-center justify-end gap-2", isMobile ? "px-5 pb-3 pt-5" : "mb-3")}>
          {blobUrl ? <a href={blobUrl} download={fileName} className="cursor-pointer rounded-full bg-white px-4 py-2 text-[#633479]">Download</a> : null}
          <button type="button" onClick={onClose} aria-label={`Close ${title}`} className="cursor-pointer rounded-full bg-white px-4 py-2 text-[#633479]">Close</button>
        </div>
        {loading || !blobUrl ? (
          <div className={cn("flex min-h-0 flex-1 items-center justify-center bg-white", isMobile ? "mx-5 mb-5 rounded-xl" : "rounded-xl")}>
            <Spinner size="large" color="#633479" />
          </div>
        ) : (
          <iframe title={title} src={blobUrl} className={cn("min-h-0 flex-1 bg-white", isMobile ? "mb-[max(20px,env(safe-area-inset-bottom))] rounded-xl" : "rounded-xl")} />
        )}
      </DialogContent>
    </Dialog>
  );
}

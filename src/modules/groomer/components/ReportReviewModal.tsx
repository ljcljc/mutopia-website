import { useState } from "react";
import { CustomTextarea } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface ReportReviewModalProps {
  evidenceName: string;
  onClose: () => void;
  onEvidenceChange: (fileName: string) => void;
  onReasonChange: (value: string) => void;
  open: boolean;
  reason: string;
}

export function ReportReviewModal({
  evidenceName,
  onClose,
  onEvidenceChange,
  onReasonChange,
  open,
  reason,
}: ReportReviewModalProps) {
  const isMobile = useIsMobile();
  const [isUploadDragging, setIsUploadDragging] = useState(false);

  const handleEvidenceSelected = (file?: File) => {
    onEvidenceChange(file?.name ?? "");
    setIsUploadDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "overflow-hidden bg-white p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! mx-auto! grid! max-h-[85vh]! w-full! max-w-[393px]! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! grid! w-full! max-w-[393px]! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-none shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <DialogTitle className="sr-only">Report review</DialogTitle>
        <DialogDescription className="sr-only">Submit a review report with a reason and optional evidence.</DialogDescription>

        <div className={cn("flex flex-col gap-4 overflow-y-auto px-5 py-5", isMobile ? "" : "max-h-[85vh]")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">Account &gt; Performance Details</p>
              <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Report review</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-5 shrink-0 items-center justify-center text-[#8B6357] transition-colors hover:text-[#6E4F46]"
              aria-label="Close report review dialog"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">Tell us your experience</p>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Why would you report this review</p>
            </div>
            <CustomTextarea
              label=""
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Share your reasons"
              showResizeHandle={false}
              className="h-[120px] min-h-[120px] rounded-xl px-4 py-3 font-comfortaa text-[12px] leading-[18px] text-[#4A2C55] placeholder:text-[#717182]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Upload evidence (optional)</p>
            <label
              htmlFor="report-review-evidence"
              onDragEnter={() => setIsUploadDragging(true)}
              onDragOver={(event) => {
                event.preventDefault();
                setIsUploadDragging(true);
              }}
              onDragLeave={() => setIsUploadDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                handleEvidenceSelected(event.dataTransfer.files?.[0]);
              }}
              className={cn(
                "flex h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#DE6A07] bg-neutral-50 px-4 text-center shadow-[0px_4px_10px_rgba(0,0,0,0.15)] transition-[background-color,opacity] hover:bg-[#FFF8F1] active:opacity-90",
                isUploadDragging && "bg-[rgba(222,106,7,0.05)]",
              )}
            >
              <span className="flex items-center gap-1 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">
                <Icon name="add-2" className="size-5 text-[#8B6357]" aria-hidden="true" />
                <span>{evidenceName || "Click to upload"}</span>
              </span>
              <span className="mt-1 text-center font-sans text-[12.25px] leading-[17.5px] text-[#A3A3A3]">
                JPG, JPEG, PNG less than 10MB
              </span>
            </label>
              <input
                id="report-review-evidence"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => handleEvidenceSelected(event.target.files?.[0])}
              />
          </div>

          <div className="flex flex-col gap-[10px]">
            <GroomerPrimaryActionButton fullWidth onClick={onClose}>
              Send
            </GroomerPrimaryActionButton>
            <div className="flex h-12 items-center justify-center">
              <GroomerLinkButton onClick={onClose}>
                <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline">Cancel</span>
              </GroomerLinkButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

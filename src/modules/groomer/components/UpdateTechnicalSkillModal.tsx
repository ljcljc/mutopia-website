import { useState } from "react";
import { BrownOutlineButton, CustomTextarea } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";

interface UpdateTechnicalSkillModalProps {
  description: string;
  evidenceName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onDescriptionChange: (value: string) => void;
  onEvidenceChange: (file: File | null) => void;
  onSubmit: () => void;
  open: boolean;
}

export function UpdateTechnicalSkillModal({
  description,
  evidenceName,
  isSubmitting = false,
  onClose,
  onDescriptionChange,
  onEvidenceChange,
  onSubmit,
  open,
}: UpdateTechnicalSkillModalProps) {
  const isMobile = useIsMobile();
  const [isUploadDragging, setIsUploadDragging] = useState(false);

  const handleEvidenceSelected = (file?: File) => {
    onEvidenceChange(file ?? null);
    setIsUploadDragging(false);
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "overflow-hidden border border-[rgba(0,0,0,0.2)] bg-white p-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! mx-auto! grid! max-h-[90vh]! w-full! max-w-none! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))]"
            : "left-1/2! top-1/2! grid! w-[calc(100%-32px)] max-w-[520px]! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-[20px]",
        )}
      >
        <DialogTitle className="sr-only">Update technical skill</DialogTitle>
        <DialogDescription className="sr-only">
          Update your technical skill details and upload supporting evidence.
        </DialogDescription>

        <div className="flex flex-col">
          <div className="flex flex-col gap-2 pt-3">
            <div className="flex items-center justify-between px-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex size-4 items-center justify-center text-[#8B6357] opacity-70 transition-colors hover:text-[#6E4F46]"
                aria-label="Close update technical skill dialog"
              >
                <Icon name="close-arrow" className="size-4" aria-hidden="true" />
              </button>
              <p className="flex-1 text-center font-comfortaa text-[14px] leading-[22.75px] text-[#633479]">
                Update technical skill
              </p>
              <div className="size-4" aria-hidden="true" />
            </div>
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
          </div>

          <div className="flex flex-col gap-5 px-6 pb-8 pt-5">
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">How you optimize your skills</p>
                <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Tell us your updated skills</p>
              </div>
              <CustomTextarea
                label=""
                value={description}
                onChange={(event) => onDescriptionChange(event.target.value)}
                placeholder="Share your experience"
                disabled={isSubmitting}
                showResizeHandle
                className="text-[#4A2C55]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Upload evidence</p>
              <label
                htmlFor="technical-skill-evidence"
                aria-disabled={isSubmitting}
                onDragEnter={() => setIsUploadDragging(true)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsUploadDragging(true);
                }}
                onDragLeave={() => setIsUploadDragging(false)}
                onDrop={(event) => {
                  if (isSubmitting) return;
                  event.preventDefault();
                  handleEvidenceSelected(event.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex min-h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#DE6A07] bg-[#FAFAFA] px-4 py-4 text-center shadow-[0px_4px_5px_rgba(0,0,0,0.15)] transition-[background-color,opacity] hover:bg-[#FFF8F1] active:opacity-90",
                  isSubmitting && "pointer-events-none opacity-60",
                  isUploadDragging && "bg-[rgba(222,106,7,0.05)]",
                )}
              >
                <span className="flex items-center gap-1 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">
                  <Icon name="add-2" className="size-5 text-[#8B6357]" aria-hidden="true" />
                  <span>{evidenceName || "Click to upload"}</span>
                </span>
                <span className="mt-1 font-sans text-[12.25px] leading-[17.5px] text-[#A3A3A3]">
                  JPG, JPEG, PNG less than 10MB
                </span>
              </label>
              <input
                id="technical-skill-evidence"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="sr-only"
                disabled={isSubmitting}
                onChange={(event) => handleEvidenceSelected(event.target.files?.[0])}
              />
            </div>

            <div className="flex items-center justify-end gap-[10px]">
              <BrownOutlineButton
                type="button"
                size="standard"
                disabled={isSubmitting}
                onClick={onClose}
                className="w-[120px] border-[#DE6A07] text-[#DE6A07] hover:bg-[rgba(222,106,7,0.08)]"
              >
                <span className="font-comfortaa text-[14px] font-medium leading-[17.5px]">Cancel</span>
              </BrownOutlineButton>
              <GroomerPrimaryActionButton
                type="button"
                disabled={isSubmitting}
                loading={isSubmitting}
                onClick={onSubmit}
                className="w-[120px]"
              >
                Update
              </GroomerPrimaryActionButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

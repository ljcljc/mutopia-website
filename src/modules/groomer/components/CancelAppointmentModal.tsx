import { useEffect, useState, type FormEvent } from "react";
import { CustomInput, CustomTextarea } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface CancelAppointmentModalProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  open: boolean;
}

export function CancelAppointmentModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  open,
}: CancelAppointmentModalProps) {
  const isMobile = useIsMobile();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isAccidentRelated, setIsAccidentRelated] = useState(true);
  const [evidenceName, setEvidenceName] = useState("");
  const [isUploadDragging, setIsUploadDragging] = useState(false);

  useEffect(() => {
    if (open) return;
    setReason("");
    setDescription("");
    setIsAccidentRelated(true);
    setEvidenceName("");
    setIsUploadDragging(false);
  }, [open]);

  const handleEvidenceSelected = (file?: File) => {
    setEvidenceName(file?.name ?? "");
    setIsUploadDragging(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !isSubmitting && onClose()}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay z-[70]!" : "z-[70]!"}
        className={cn(
          "overflow-hidden border-none bg-white p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! grid! max-h-[88vh]! w-full! max-w-none! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! z-[75]! grid! w-full! max-w-none! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-[12px]! shadow-[0px_8px_6px_rgba(0,0,0,0.10)]",
        )}
      >
        <DialogTitle className="sr-only">Cancel appointment</DialogTitle>
        <DialogDescription className="sr-only">Document the reason for canceling this appointment.</DialogDescription>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col gap-[14px] overflow-y-auto p-[calc(24*var(--px393))] sm:p-6",
            isMobile ? "" : "max-h-[88vh]",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">Cancel appointment</h3>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Document the reason</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex size-5 shrink-0 items-center justify-center text-[#4A5565] transition-colors hover:text-[#4A3C2A] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close cancel appointment dialog"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Reason for cancellation"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Enter your reason"
              disabled={isSubmitting}
            />

            <CustomTextarea
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter more details"
              disabled={isSubmitting}
              className="text-[12.25px] leading-[normal]"
            />

            <label className="flex items-center gap-2">
              <span className="relative flex size-4 shrink-0 items-center justify-center">
                <input
                  type="radio"
                  checked={isAccidentRelated}
                  onChange={() => setIsAccidentRelated(true)}
                  disabled={isSubmitting}
                  className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full border border-[#8B6357] bg-white peer-disabled:opacity-60" />
                <span className="relative size-2 rounded-full bg-[#DE6A07] opacity-0 peer-checked:opacity-100 peer-disabled:opacity-60" />
              </span>
              <span className="font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#4A3C2A]">
                Related to an accident, intervention required
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <div>
                <p className="font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">Upload evidence</p>
                <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Proof of accident</p>
              </div>
              <label
                htmlFor="cancel-appointment-evidence"
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
                  "flex h-[101px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-[1.5px] border-[#DE6A07] bg-[#FAFAFA] px-4 text-center shadow-[0px_4px_5px_rgba(0,0,0,0.15)] transition-[background-color,opacity] hover:bg-[#FFF8F1] active:opacity-90",
                  isUploadDragging && "bg-[rgba(222,106,7,0.05)]",
                  isSubmitting && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="flex items-center gap-1 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">
                  <Icon name="add-2" className="size-5 text-[#8B6357]" aria-hidden="true" />
                  <span>{evidenceName || "Click to upload"}</span>
                </span>
                <span className="mt-2 text-center font-sans text-[12.25px] leading-[17.5px] text-[#A3A3A3]">
                  JPG, JPEG, PNG less than 10MB
                </span>
              </label>
              <input
                id="cancel-appointment-evidence"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                disabled={isSubmitting}
                className="sr-only"
                onChange={(event) => handleEvidenceSelected(event.target.files?.[0])}
              />
            </div>
          </div>

          <div className="flex flex-col gap-[10px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#DE6A07] px-7 font-comfortaa text-[14px] font-medium leading-[17.5px] text-white transition-[opacity,transform] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Spinner size="small" color="white" /> : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-full border-2 border-[#DE6A07] bg-white px-[30px] font-comfortaa text-[14px] font-medium leading-[17.5px] text-[#DE6A07] transition-[opacity,transform] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

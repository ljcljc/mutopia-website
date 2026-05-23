import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Checkbox, CustomInput, CustomTextarea, FileUpload, OrangeButton, type FileUploadItem } from "@/components/common";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";
import { XIcon } from "lucide-react";

export type CancelAppointmentFormData = {
  description: string;
  evidenceFile: File | null;
  interventionRequired: boolean;
  reason: string;
};

interface CancelAppointmentModalProps {
  description?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CancelAppointmentFormData) => Promise<void> | void;
  notice?: string;
  open: boolean;
  submitLabel?: string;
  title?: string;
}

export function CancelAppointmentModal({
  description = "Cancel travel and return this appointment to upcoming.",
  isSubmitting = false,
  notice = "This does not terminate the service. You can start travel again when you are ready.",
  onClose,
  onSubmit,
  open,
  submitLabel = "Submit",
  title = "Cancel appointment",
}: CancelAppointmentModalProps) {
  const isMobile = useIsMobile();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [interventionRequired, setInterventionRequired] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidenceError, setEvidenceError] = useState("");
  const [evidencePreviewUrl, setEvidencePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setReason("");
    setDetails("");
    setInterventionRequired(false);
    setEvidenceFile(null);
    setEvidenceError("");
  }, [open]);

  useEffect(() => {
    if (!interventionRequired) {
      setEvidenceFile(null);
      setEvidenceError("");
    }
  }, [interventionRequired]);

  useEffect(() => {
    if (!evidenceFile) {
      setEvidencePreviewUrl(null);
      return;
    }

    const previewUrl = URL.createObjectURL(evidenceFile);
    setEvidencePreviewUrl(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [evidenceFile]);

  const evidenceUploadItems = useMemo<FileUploadItem[]>(
    () =>
      evidenceFile && evidencePreviewUrl
        ? [
            {
              file: evidenceFile,
              previewUrl: evidencePreviewUrl,
              uploadProgress: 100,
              uploadStatus: "uploaded",
            },
          ]
        : [],
    [evidenceFile, evidencePreviewUrl],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (interventionRequired && !evidenceFile) {
      setEvidenceError("Evidence is required when intervention is requested");
      return;
    }

    await onSubmit({
      description: details.trim(),
      evidenceFile,
      interventionRequired,
      reason: reason.trim(),
    });
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
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col gap-[14px] overflow-y-auto p-[calc(24*var(--px393))] sm:p-6",
            isMobile ? "" : "max-h-[88vh]",
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">{title}</h3>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex size-5 shrink-0 items-center justify-center text-[#4A5565] transition-colors hover:text-[#4A3C2A] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close cancel appointment dialog"
            >
              <XIcon className="size-4 stroke-[1.5]" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CustomInput
              label="Reason for cancellation"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={isSubmitting}
              placeholder="Enter your reason"
            />

            <CustomTextarea
              label="Description (optional)"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              disabled={isSubmitting}
              placeholder="Enter more details"
              showResizeHandle={false}
            />

            <Checkbox
              checked={interventionRequired}
              onCheckedChange={setInterventionRequired}
              disabled={isSubmitting}
              label="Related to an accident, intervention required"
              containerClassName="items-center"
            />

            {interventionRequired ? (
              <div className="flex flex-col gap-2">
                <div>
                  <p className="font-comfortaa text-[14px] leading-[22.75px] text-[#4A3C2A]">Upload evidence</p>
                  <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Proof of accident</p>
                </div>
                <FileUpload
                  accept="image/jpeg,image/jpg,image/png"
                  disabled={isSubmitting}
                  maxFiles={1}
                  multiple={false}
                  showDragHint={false}
                  uploadItems={evidenceUploadItems}
                  onChange={(files) => {
                    setEvidenceFile(files[0] ?? null);
                    setEvidenceError("");
                  }}
                  onRemove={() => {
                    setEvidenceFile(null);
                    setEvidenceError("");
                  }}
                  className="[&_p]:whitespace-normal"
                />
                {evidenceError ? (
                  <p className="font-comfortaa text-[12px] leading-[18px] text-[#DE1507]">{evidenceError}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          {notice ? (
            <p className="rounded-[12px] border border-[#F5CBA7] bg-[#FFF8F1] px-4 py-3 font-comfortaa text-[13px] leading-5 text-[#8B6357]">
              {notice}
            </p>
          ) : null}

          <div className="flex flex-col gap-[10px]">
            <OrangeButton
              type="submit"
              loading={isSubmitting}
              fullWidth
              textSize={14}
            >
              {submitLabel}
            </OrangeButton>
            <OrangeButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              fullWidth
              textSize={14}
            >
              Cancel
            </OrangeButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

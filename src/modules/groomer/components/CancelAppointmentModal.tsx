import { type FormEvent } from "react";
import { Spinner } from "@/components/common/Spinner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface CancelAppointmentModalProps {
  description?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <p className="rounded-[12px] border border-[#F5CBA7] bg-[#FFF8F1] px-4 py-3 font-comfortaa text-[13px] leading-5 text-[#8B6357]">
            {notice}
          </p>

          <div className="flex flex-col gap-[10px]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#DE6A07] px-7 font-comfortaa text-[14px] font-medium leading-[17.5px] text-white transition-[opacity,transform] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Spinner size="small" color="white" /> : submitLabel}
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

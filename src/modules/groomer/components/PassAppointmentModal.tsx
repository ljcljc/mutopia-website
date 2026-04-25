import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface PassAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  contextLabel: string;
  returnLabel: string;
  onConfirm?: () => Promise<void> | void;
  isSubmitting?: boolean;
}

export function PassAppointmentModal({
  open,
  onClose,
  contextLabel,
  returnLabel,
  onConfirm,
  isSubmitting = false,
}: PassAppointmentModalProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay z-[70]!" : "z-[70]!"}
        className={cn(
          "flex flex-col overflow-hidden border-none bg-white p-0 gap-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! flex! max-h-[80vh]! w-full! max-w-[393px]! translate-x-0! translate-y-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! bottom-0! top-auto! z-[75]! flex! max-h-[80vh]! w-full! max-w-[393px]! -translate-x-1/2! translate-y-0! rounded-b-none rounded-t-[24px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <DialogTitle className="sr-only">Pass appointment</DialogTitle>
        <DialogDescription className="sr-only">Confirm passing this appointment to another groomer.</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col bg-white">
          <div className="sticky top-0 z-10 shrink-0 bg-white px-5 pb-4 pt-5">
            <p className="font-comfortaa text-[12px] leading-[18px] text-[#A07D72]">{contextLabel}</p>
            <h3 className="mt-1 font-comfortaa text-[20px] leading-[30px] text-[#4A2C55]">Pass appointment</h3>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            <p className="font-comfortaa text-[14px] leading-[28px] text-[#4A2C55]">
              If you confirm, the appointment will be passed to another groomer and you won&apos;t have access to it anymore.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={onConfirm}
                disabled={isSubmitting}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#06AF3D] px-4 font-comfortaa text-[16px] leading-6 text-white shadow-[0px_8px_18px_rgba(6,175,61,0.22)]"
              >
                {isSubmitting ? "Passing..." : "Pass appointment"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#F08A12] bg-white px-4 font-comfortaa text-[16px] leading-6 text-[#F08A12]"
              >
                {returnLabel}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

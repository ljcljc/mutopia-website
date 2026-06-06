import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface TimeframeSelectorDialogProps {
  open: boolean;
  selectedTimeframe: string;
  timeframeOptions: readonly string[];
  onOpenChange: (open: boolean) => void;
  onSelectTimeframe: (timeframe: string) => void;
  onSelectCustomRange: () => void;
}

export function TimeframeSelectorDialog({
  open,
  selectedTimeframe,
  timeframeOptions,
  onOpenChange,
  onSelectTimeframe,
  onSelectCustomRange,
}: TimeframeSelectorDialogProps) {
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay z-[55]!" : "z-[55]!"}
        className={cn(
          "overflow-hidden bg-white p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-[60]! mx-auto! grid! h-auto! max-h-[calc(432*var(--px393))]! w-full! max-w-none! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! z-[60]! grid! max-h-[min(560px,calc(100vh-48px))]! w-[min(560px,calc(100vw-48px))]! max-w-[560px]! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-[24px] border-0 shadow-[0px_24px_60px_rgba(74,44,85,0.16)]",
        )}
      >
        <DialogTitle className="sr-only">Select Timeframe</DialogTitle>
        <DialogDescription className="sr-only">Choose a revenue breakdown timeframe.</DialogDescription>

        <div
          className={cn(
            "flex justify-between border-b border-[#F3F1EE] bg-white px-[calc(20*var(--px393))] pb-[calc(16*var(--px393))] pt-[calc(20*var(--px393))]",
            isMobile ? "items-start" : "items-center sm:h-[84px] sm:px-6 sm:pb-0 sm:pt-0",
          )}
        >
          <h3 className="font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55] sm:text-[22px] sm:leading-[32px]">Select Timeframe</h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              "flex cursor-pointer items-center justify-center text-[#8B6357] transition-colors hover:text-[#6E4F46]",
              isMobile ? "size-5 shrink-0" : "size-9 rounded-full hover:bg-[#F8F7F1] active:bg-[#F3F1EE]",
            )}
            aria-label="Close timeframe selector"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={cn("min-h-0 overflow-y-auto", isMobile ? "px-0" : "px-6 py-5")}>
          <div className={cn("space-y-2.5", isMobile && "space-y-0", !isMobile && "space-y-3")}>
            {timeframeOptions.map((option) => {
              const isSelected = option === selectedTimeframe;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (option === "Custom range") {
                      onSelectCustomRange();
                      return;
                    }

                    onSelectTimeframe(option);
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/30",
                    isMobile
                      ? "h-[calc(56*var(--px393))] border-b border-[#F5F3F0] px-[calc(20*var(--px393))]"
                      : "h-[56px] rounded-[16px] px-5",
                    isMobile
                      ? isSelected
                        ? "bg-[#DE6A07] px-[calc(16*var(--px393))] text-white hover:bg-[#D56506] active:bg-[#C85F06]"
                        : "bg-transparent text-[#4A2C55] hover:bg-[#F8F7FA] active:bg-[#F1EEF6]"
                      : isSelected
                        ? "bg-[#DE6A07] text-white shadow-[0px_8px_18px_rgba(222,106,7,0.18)]"
                        : "bg-[#FAF9F7] text-[#4A2C55] hover:bg-[#F3F1EE] active:bg-[#ECE7E2]",
                  )}
                >
                  <span className={cn("font-comfortaa text-[14px] leading-[21px]", isSelected ? "font-bold" : isMobile ? "font-normal" : "font-medium")}>
                    {option}
                  </span>
                  {isSelected ? <Icon name="check" className="size-4 text-white" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-[60]! mx-auto! grid! h-auto! max-h-[432px]! w-full! max-w-[393px]! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! z-[60]! grid! max-h-[min(432px,calc(100vh-48px))]! w-full! max-w-[393px]! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-[20px] shadow-[0px_4px_12px_rgba(0,0,0,0.12)]",
        )}
      >
        <DialogTitle className="sr-only">Select Timeframe</DialogTitle>
        <DialogDescription className="sr-only">Choose a revenue breakdown timeframe.</DialogDescription>

        <div className="flex h-[76px] items-center justify-between border-b border-[#F3F1EE] px-5 pt-1">
          <h3 className="font-comfortaa text-[18px] font-bold leading-[27px] text-[#4A2C55]">Select Timeframe</h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-9 items-center justify-center rounded-full text-[#8B6357] transition-colors hover:bg-[#F8F7F1] hover:text-[#6E4F46] active:bg-[#F3F1EE]"
            aria-label="Close timeframe selector"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto px-0">
          <div className={cn("space-y-2.5", isMobile && "space-y-0")}>
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
                    "flex w-full items-center justify-between text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/30",
                    isMobile ? "h-[56px] border-b border-[#F5F3F0] px-5" : "h-[52px] rounded-[12px] px-5",
                    isMobile
                      ? isSelected
                        ? "bg-[#DE6A07] px-4 text-white hover:bg-[#D56506] active:bg-[#C85F06]"
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

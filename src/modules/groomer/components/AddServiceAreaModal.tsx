import { useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface AddServiceAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  options: string[];
  selectedValues?: string[];
  onSubmit: (areaName: string) => void;
  onMobileToggle?: (areaName: string) => void;
}

export default function AddServiceAreaModal({
  open,
  onOpenChange,
  initialValue = "",
  options,
  selectedValues = [],
  onSubmit,
  onMobileToggle,
}: AddServiceAreaModalProps) {
  const isMobile = useIsMobile();
  const normalizedInitialValue = initialValue.trim().toLowerCase();
  const title = "Modify";

  const handleClose = () => onOpenChange(false);

  const selectorOptions = useMemo(() => {
    if (!initialValue) return options;

    const hasInitialValue = options.some((option) => option.toLowerCase() === normalizedInitialValue);
    return hasInitialValue ? options : [initialValue, ...options];
  }, [initialValue, normalizedInitialValue, options]);

  const handleSelect = (areaName: string) => {
    onSubmit(areaName);
    onOpenChange(false);
  };

  const mobileListItems = selectorOptions.map((option) => {
    const isSelected = selectedValues.some((value) => value.toLowerCase() === option.toLowerCase());

    return (
      <button
        key={option}
        type="button"
        onClick={() => onMobileToggle?.(option)}
        className={cn(
          "w-full text-left transition-colors duration-200 focus-visible:outline-none",
          "flex h-[56px] items-center justify-between border-b border-[#F5F3F0] px-5 focus-visible:ring-2 focus-visible:ring-[#DE6A07]/30 focus-visible:ring-inset",
          isSelected
            ? "bg-[#DE6A07] text-white hover:bg-[#D56506] active:bg-[#C85F06]"
            : "bg-white text-[#4A2C55] hover:bg-[#F8F7FA] active:bg-[#F1EEF6]",
        )}
      >
        <span
          className={cn(
            "transition-colors duration-200",
            "font-comfortaa text-[16px] leading-6",
            isSelected ? "font-bold" : "font-normal",
          )}
        >
          {option}
        </span>
        {isSelected ? <Icon name="check" className="size-4 text-white" /> : null}
      </button>
    );
  });

  const desktopListItems = selectorOptions.map((option) => {
    const isSelected = option.toLowerCase() === normalizedInitialValue;

    return (
      <button
        key={option}
        type="button"
        onClick={() => handleSelect(option)}
        className={cn(
          "flex h-[48px] w-full items-center justify-between rounded-[12px] px-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/30",
          isSelected
            ? "bg-[#DE6A07] text-white shadow-[0px_8px_18px_rgba(222,106,7,0.22)]"
            : "bg-[#FAF9F7] text-[#4A2C55] hover:bg-[#F3F1EE] active:bg-[#ECE7E2]",
        )}
      >
        <span className={cn("font-comfortaa text-[14px] leading-[21px]", isSelected ? "font-bold" : "font-medium")}>
          {option}
        </span>
        {isSelected ? <Icon name="check" className="size-4 text-white" /> : null}
      </button>
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "[&>button]:hidden",
          isMobile
            ? "service-area-dialog !top-auto !right-0 !bottom-0 !left-0 !mx-auto !grid !max-h-[60vh] !w-full !max-w-[393px] !translate-x-0 !translate-y-0 !gap-0 overflow-hidden rounded-t-[24px] rounded-b-none border-0 bg-white p-0 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] sm:!max-w-[393px]"
            : "!top-1/2 !left-1/2 !grid !w-full !max-w-[482px] !translate-x-[-50%] !translate-y-[-50%] !gap-0 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]",
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Select a service area for the groomer profile.
        </DialogDescription>

        {isMobile ? (
          <>
            <div className="flex h-[76px] items-center justify-between border-b border-[#F3F1EE] px-5">
              <h2 className="font-comfortaa text-[18px] font-bold leading-[27px] text-[#4A2C55]">{title}</h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex size-9 items-center justify-center rounded-full text-[#8B6357] transition-colors hover:bg-[#F8F7F1]"
                aria-label="Close service area selector"
              >
                <Icon name="close-arrow" className="size-5 text-[#8B6357]" />
              </button>
            </div>

            <div className="overflow-y-auto pb-6">{mobileListItems}</div>
          </>
        ) : (
          <>
            <div className="w-full">
              <div className="relative mb-2 flex items-center px-3 pt-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="z-10 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
                  aria-label="Close service area selector"
                >
                  <Icon name="close-arrow" className="h-4 w-4 text-[#717182]" />
                </button>
                <h2 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#4C4C4C]">
                  {title}
                </h2>
              </div>
              <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <div className="mb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="location" className="h-5 w-5 text-[#DE6A07]" />
                  <p className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Service areas</p>
                </div>
                <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22]">+ Add area</span>
              </div>

              <div className="space-y-3">{desktopListItems}</div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

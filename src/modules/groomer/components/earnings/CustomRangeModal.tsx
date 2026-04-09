import { useState } from "react";
import { Calendar } from "@/components/common/Calendar";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";
import { formatRangeDate } from "./utils";

interface CustomRangeModalProps {
  open: boolean;
  startDate: Date;
  endDate: Date;
  onClose: () => void;
  onConfirm: (nextStartDate: Date, nextEndDate: Date) => void;
}

export function CustomRangeModal({
  open,
  startDate,
  endDate,
  onClose,
  onConfirm,
}: CustomRangeModalProps) {
  const isMobile = useIsMobile();
  const [draftStartDate, setDraftStartDate] = useState(startDate);
  const [draftEndDate, setDraftEndDate] = useState(endDate);
  const [activeField, setActiveField] = useState<"start" | "end">("start");
  const [calendarDate, setCalendarDate] = useState(startDate);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const closeCalendarPickers = () => {
    setShowYearPicker(false);
    setShowMonthPicker(false);
  };

  const handleDateChange = (date: Date) => {
    setCalendarDate(date);

    if (activeField === "start") {
      setDraftStartDate(date);
      if (date > draftEndDate) {
        setDraftEndDate(date);
      }
      setActiveField("end");
      return;
    }

    if (date < draftStartDate) {
      setDraftStartDate(date);
      setDraftEndDate(draftStartDate);
      return;
    }

    setDraftEndDate(date);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay z-[55]!" : "z-[55]!"}
        className={cn(
          "flex flex-col overflow-hidden bg-white p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-60! mx-auto! flex! max-h-[80vh]! w-full! max-w-[393px]! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! z-60! flex! max-h-[80vh]! w-full! max-w-[393px]! -translate-x-1/2! -translate-y-1/2! gap-0! rounded-none shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <DialogTitle className="sr-only">Custom range</DialogTitle>
        <DialogDescription className="sr-only">Select a custom start and end date for earnings breakdown.</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col" onClick={closeCalendarPickers}>
          <div className="sticky top-0 z-10 shrink-0 bg-white px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">Earnings &gt; Revenue breakdown</p>
              <button
                type="button"
                onClick={onClose}
                className="flex size-5 shrink-0 items-center justify-center text-[#8B6357] transition-colors hover:text-[#6E4F46]"
                aria-label="Close custom range dialog"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <div className="flex flex-col gap-4">
              <h3 className="font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Custom range</h3>

              <div className="rounded-[12px] border border-[#BBF7D0] bg-[#F0FDF4] p-3">
                <p className="font-comfortaa text-[14px] font-bold leading-[22px] text-[#4A3C2A]">
                  {activeField === "start" ? "Select start date" : "Select end date"}
                </p>

                <div className="mt-3 rounded-[16px] bg-white px-4 py-3" onClick={(event) => event.stopPropagation()}>
                  <Calendar
                    currentDate={calendarDate}
                    selectedDate={activeField === "start" ? draftStartDate : draftEndDate}
                    onDateChange={handleDateChange}
                    onMonthChange={(year, month) => setCalendarDate(new Date(year, month, 1))}
                    showYearPicker={showYearPicker}
                    showMonthPicker={showMonthPicker}
                    onShowYearPickerChange={setShowYearPicker}
                    onShowMonthPickerChange={setShowMonthPicker}
                    variant="compact"
                    className="shadow-none"
                  />
                </div>

                <div className="mt-3 px-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveField("start");
                      setCalendarDate(draftStartDate);
                    }}
                    className="flex w-full items-center justify-between py-2 text-left"
                  >
                    <span className="font-comfortaa text-[14px] leading-[21px] text-[#6B7280]">Start Date</span>
                    <span className="font-comfortaa text-[16px] font-bold leading-6 text-[#27AE60]">{formatRangeDate(draftStartDate)}</span>
                  </button>
                  <div className="h-px w-full bg-[#9CA3AF]" />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveField("end");
                      setCalendarDate(draftEndDate);
                    }}
                    className="flex w-full items-center justify-between py-2 text-left"
                  >
                    <span className="font-comfortaa text-[14px] leading-[21px] text-[#6B7280]">End Date</span>
                    <span className="font-comfortaa text-[16px] font-bold leading-6 text-[#27AE60]">{formatRangeDate(draftEndDate)}</span>
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onConfirm(draftStartDate, draftEndDate)}
                className="h-12 rounded-[32px] bg-[#00A63E] font-comfortaa text-[15px] font-bold leading-[22.5px] text-white shadow-[0px_4px_12px_rgba(0,166,62,0.3)] transition-colors hover:bg-[#009638] active:bg-[#008730]"
              >
                Confirm
              </button>

              <div className="flex h-12 items-center justify-center">
                <GroomerLinkButton onClick={onClose}>
                  <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline">Cancel</span>
                </GroomerLinkButton>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

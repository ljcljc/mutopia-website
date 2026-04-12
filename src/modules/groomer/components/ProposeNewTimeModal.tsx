import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/common/Calendar";
import { CustomSelect, CustomSelectItem } from "@/components/common/CustomSelect";
import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface ProposeNewTimeModalProps {
  open: boolean;
  onClose: () => void;
  initialServiceSlot?: string;
}

type SelectedTimeEntry = {
  date: string;
  time: string;
};

const MAX_ENTRIES = 6;
const TIME_OPTIONS = [
  {
    value: "Morning AM",
    label: "Morning AM",
    description: "8:00 AM - 12:00 PM",
  },
  {
    value: "Afternoon PM",
    label: "Afternoon PM",
    description: "12:00 PM - 5:00 PM",
  },
] as const;

function getTimeOption(value: string) {
  return TIME_OPTIONS.find((option) => option.value === value);
}

function getTimeSuffix(value: string) {
  return value.includes("AM") ? "AM" : value.includes("PM") ? "PM" : value;
}

function getTimeOptionValue(value: string) {
  return getTimeSuffix(value) === "PM" ? "Afternoon PM" : "Morning AM";
}

function parseServiceSlot(serviceSlot?: string) {
  if (!serviceSlot) return null;

  const match = serviceSlot.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(AM|PM)$/);
  if (!match) return null;

  const [, year, month, day, suffix] = match;

  return {
    date: new Date(Number(year), Number(month) - 1, Number(day)),
    suffix,
  };
}

function getSlotStartTime(date: Date, suffix: string) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    suffix === "PM" ? 12 : 8,
    0,
    0,
    0,
  );
}

function getFutureSlotDate(preferredDate: Date, suffix: string, now: Date) {
  const normalized = new Date(preferredDate.getFullYear(), preferredDate.getMonth(), preferredDate.getDate());
  const slotStart = getSlotStartTime(normalized, suffix);

  if (slotStart.getTime() > now.getTime()) {
    return normalized;
  }

  const fallback = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todaySlotStart = getSlotStartTime(fallback, suffix);

  if (todaySlotStart.getTime() > now.getTime()) {
    return fallback;
  }

  fallback.setDate(fallback.getDate() + 1);
  return fallback;
}

function buildInitialModalState(initialServiceSlot?: string) {
  const now = new Date();
  const parsedSlot = parseServiceSlot(initialServiceSlot);
  const baseSuffix = parsedSlot?.suffix ?? "AM";
  const baseDate = getFutureSlotDate(parsedSlot?.date ?? now, baseSuffix, now);
  const alternateSuffix = baseSuffix === "AM" ? "PM" : "AM";
  const secondDate = getFutureSlotDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 1), alternateSuffix, now);
  const thirdDate = getFutureSlotDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + 2), baseSuffix, now);

  return {
    selectedDate: baseDate,
    currentDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
    selectedEntries: [
      { date: formatDateToISO(baseDate), time: getTimeOptionValue(baseSuffix) },
      { date: formatDateToISO(secondDate), time: getTimeOptionValue(alternateSuffix) },
      { date: formatDateToISO(thirdDate), time: getTimeOptionValue(baseSuffix) },
    ],
    minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    maxDate: new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999),
  };
}

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`);
}

function formatDateForTag(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function formatTimeForTag(time: string): string {
  return getTimeSuffix(getTimeOption(time)?.label ?? time);
}

export function ProposeNewTimeModal({ open, onClose, initialServiceSlot }: ProposeNewTimeModalProps) {
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEntries, setSelectedEntries] = useState<SelectedTimeEntry[]>([]);
  const [pendingTime, setPendingTime] = useState("");
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const closeCalendarPickers = () => {
    setShowYearPicker(false);
    setShowMonthPicker(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const initialState = buildInitialModalState(initialServiceSlot);

    setSelectedDate(initialState.selectedDate);
    setCurrentDate(initialState.currentDate);
    setSelectedEntries(initialState.selectedEntries);
    setPendingTime("");
    closeCalendarPickers();
  }, [initialServiceSlot, open]);

  const remainingSlots = Math.max(0, MAX_ENTRIES - selectedEntries.length);
  const isMaxReached = selectedEntries.length >= MAX_ENTRIES;

  const minDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const maxDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTime = (value: string) => {
    if (!selectedDate || !value || isMaxReached) {
      return;
    }

    const nextEntry = {
      date: formatDateToISO(selectedDate),
      time: value,
    };

    const alreadySelected = selectedEntries.some((entry) => entry.date === nextEntry.date && entry.time === nextEntry.time);

    if (alreadySelected) {
      setPendingTime("");
      return;
    }

    setSelectedEntries((current) => [...current, nextEntry].slice(0, MAX_ENTRIES));
    setPendingTime("");
  };

  const handleRemoveEntry = (entryToRemove: SelectedTimeEntry) => {
    setSelectedEntries((current) =>
      current.filter((entry) => !(entry.date === entryToRemove.date && entry.time === entryToRemove.time)),
    );
  };

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
          "flex flex-col overflow-hidden bg-white p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! flex! max-h-[80vh]! w-full! max-w-[393px]! translate-x-0! translate-y-0! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! bottom-0! top-auto! z-[75]! flex! max-h-[80vh]! w-full! max-w-[393px]! -translate-x-1/2! translate-y-0! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <DialogTitle className="sr-only">Propose new time</DialogTitle>
        <DialogDescription className="sr-only">Choose up to six dates and times to propose a new appointment window.</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col bg-white" onClick={closeCalendarPickers}>
          <div className="sticky top-0 z-10 shrink-0 bg-white px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">Dashboard &gt; BOOKING REQUEST</p>
                <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Propose new time</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-5 shrink-0 items-center justify-center text-[#8B6357] transition-colors hover:text-[#6E4F46]"
                aria-label="Close propose new time dialog"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <div className="rounded-[12px] border border-[#BBF7D0] bg-[#F0FDF4] p-3">
              <p className="font-comfortaa text-[14px] font-bold leading-[22px] text-[#4A3C2A]">Select date and time period</p>
              <p className="mt-1 font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Choose up to 6 dates and time periods</p>

              <div className="mt-3 rounded-[16px] bg-white px-4 py-3" onClick={(event) => event.stopPropagation()}>
                <Calendar
                  currentDate={currentDate}
                  onDateChange={handleDateChange}
                  selectedDate={selectedDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  onMonthChange={(year, month) => setCurrentDate(new Date(year, month, 1))}
                  showYearPicker={showYearPicker}
                  showMonthPicker={showMonthPicker}
                  onShowYearPickerChange={setShowYearPicker}
                  onShowMonthPickerChange={setShowMonthPicker}
                  variant="compact"
                  className="shadow-none"
                />
              </div>

              <div className="mt-3 w-[167px]">
                <p className="mb-2 font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">Available time (multiple)</p>
                <CustomSelect
                  value={pendingTime}
                  displayValue={getTimeOption(pendingTime)?.label}
                  onValueChange={handleAddTime}
                  placeholder="Select time period"
                  className="w-[167px] rounded-[10px] border-[#D9D2E8] text-[12px] text-[#8B6357]"
                >
                  {TIME_OPTIONS.map((timeOption) => (
                    <CustomSelectItem key={timeOption.value} value={timeOption.value}>
                      {timeOption.label}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>

              {selectedEntries.length > 0 ? (
                <>
                  <div className="mt-3 rounded-[8px] border border-[#6AA31C] bg-[#F4FFDE] px-4 py-[6px]">
                    <div className="flex items-start gap-2">
                      <div className="mt-[2px] flex size-3 items-center justify-center rounded-full bg-[#6AA31C]">
                        <Icon name="check" className="size-[8px] text-white" aria-hidden="true" />
                      </div>
                      <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#467900]">
                        {selectedEntries.length} periods selected.
                        <br />
                        {isMaxReached ? "You have reached the maximum available times." : `You can choose ${remainingSlots} more available times.`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedEntries.map((entry) => {
                      const parsedDate = parseISODate(entry.date);
                      const tagLabel = `${formatDateForTag(parsedDate)} ${formatTimeForTag(entry.time)}`;

                      return (
                        <div
                          key={`${entry.date}-${entry.time}`}
                          className="inline-flex h-6 items-center gap-1 rounded-[12px] border border-[#4C4C4C] bg-white pl-[9px] pr-[5px]"
                        >
                          <span className="font-comfortaa text-[14px] font-bold leading-5 text-[#4C4C4C]">{tagLabel}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(entry)}
                            className="flex size-4 items-center justify-center text-[#4C4C4C]"
                            aria-label={`Remove ${tagLabel}`}
                          >
                            <Icon name="close-arrow" className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="h-12 w-full rounded-[32px] bg-[#00A63E] font-comfortaa text-[15px] font-bold leading-[22.5px] text-white shadow-[0px_4px_12px_rgba(0,166,62,0.3)] transition-colors hover:bg-[#009638] active:bg-[#008730]"
              >
                Send new time
              </button>

              <button
                type="button"
                className="mt-[10px] flex h-12 w-full items-center justify-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline underline-offset-[2px]"
              >
                Pass appointment
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

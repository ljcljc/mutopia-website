import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/common/Calendar";
import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";
import {
  ALL_AVAILABLE_TIME_OPTIONS,
  AvailableTimeCombobox,
} from "@/modules/groomer/components/AvailableTimeCombobox";
import type { BookingRequestDecisionTimeOption } from "@/modules/groomer/components/BookingRequestContent";

interface ProposeNewTimeModalProps {
  open: boolean;
  onClose: () => void;
  initialServiceSlot?: string;
  initialServiceSlots?: string[];
  onSubmit?: (timeOptions: BookingRequestDecisionTimeOption[]) => Promise<void> | void;
  onPassAppointment?: () => Promise<void> | void;
  isSubmitting?: boolean;
}

type SelectedTimeEntry = {
  date: string;
  suffix: "AM" | "PM";
  time: string | null;
};

type TimeSuffix = SelectedTimeEntry["suffix"];

const MAX_ENTRIES = 6;

function isPmTime(value: string) {
  const normalized = normalizeTimeInput(value);
  if (!normalized) return false;
  return Number(normalized.split(":")[0]) >= 12;
}

function parseServiceSlot(serviceSlot?: string) {
  if (!serviceSlot) return null;

  const match = serviceSlot.match(/^(\d{4})\.(\d{2})\.(\d{2})\s+(AM|PM)$/);
  if (!match) return null;

  const [, year, month, day, suffix] = match;

  return {
    date: new Date(Number(year), Number(month) - 1, Number(day)),
    suffix: suffix as TimeSuffix,
  };
}

function buildInitialModalState(initialServiceSlots: string[]) {
  const now = new Date();
  const parsedSlots = initialServiceSlots
    .map((slot) => parseServiceSlot(slot))
    .filter((slot): slot is NonNullable<typeof slot> => Boolean(slot))
    .sort((left, right) => left.date.getTime() - right.date.getTime());
  const parsedSlot = parsedSlots[0] ?? null;
  const baseDate = parsedSlot?.date ?? now;

  return {
    selectedDate: baseDate,
    currentDate: new Date(baseDate.getFullYear(), baseDate.getMonth(), 1),
    selectedEntries: parsedSlots.slice(0, MAX_ENTRIES).map((slot) => ({
      date: formatDateToISO(slot.date),
      suffix: slot.suffix,
      time: null,
    })),
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
  const normalized = normalizeTimeInput(time);
  if (!normalized) return time;

  const [hoursText, minutes] = normalized.split(":");
  const hours24 = Number(hoursText);
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${suffix}`;
}

function normalizeTimeInput(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildDecisionTimeOption(entry: SelectedTimeEntry): BookingRequestDecisionTimeOption | null {
  if (!entry.time) return null;

  const normalizedTime = normalizeTimeInput(entry.time);
  if (!normalizedTime) return null;

  return {
    date: entry.date,
    slot: entry.suffix.toLowerCase() as "am" | "pm",
    time: normalizedTime,
  };
}

export function ProposeNewTimeModal({
  open,
  onClose,
  initialServiceSlot,
  initialServiceSlots,
  onSubmit,
  onPassAppointment,
  isSubmitting = false,
}: ProposeNewTimeModalProps) {
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

    const initialState = buildInitialModalState(
      initialServiceSlots?.length ? initialServiceSlots : initialServiceSlot ? [initialServiceSlot] : [],
    );

    setSelectedDate(initialState.selectedDate);
    setCurrentDate(initialState.currentDate);
    setSelectedEntries(initialState.selectedEntries);
    setPendingTime("");
    closeCalendarPickers();
  }, [initialServiceSlot, initialServiceSlots, open]);

  const remainingSlots = Math.max(0, MAX_ENTRIES - selectedEntries.length);
  const isMaxReached = selectedEntries.length >= MAX_ENTRIES;
  const calendarKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

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
    const dateKey = formatDateToISO(date);
    const existingEntry = selectedEntries.find((entry) => entry.date === dateKey && entry.time);
    setPendingTime(existingEntry?.time ?? "");
  };

  const handleAddTime = (value: string) => {
    setPendingTime(value);

    if (!selectedDate || !value) {
      return;
    }

    const normalizedTime = normalizeTimeInput(value);
    if (!normalizedTime) return;

    const nextEntry = {
      date: formatDateToISO(selectedDate),
      suffix: (isPmTime(normalizedTime) ? "PM" : "AM") as TimeSuffix,
      time: normalizedTime,
    };

    const alreadySelected = selectedEntries.some((entry) => entry.date === nextEntry.date && entry.time === nextEntry.time);

    if (alreadySelected) {
      setPendingTime(normalizedTime);
      return;
    }

    setSelectedEntries((current) => {
      const emptyDateEntryIndex = current.findIndex(
        (entry) => entry.date === nextEntry.date && entry.suffix === nextEntry.suffix && !entry.time,
      );
      if (emptyDateEntryIndex !== -1) {
        return current.map((entry, index) => (index === emptyDateEntryIndex ? nextEntry : entry));
      }

      if (current.length >= MAX_ENTRIES) return current;

      return [...current, nextEntry];
    });
    setPendingTime(normalizedTime);
  };

  const handleRemoveEntry = (entryToRemove: SelectedTimeEntry) => {
    setSelectedEntries((current) =>
      current.filter(
        (entry) =>
          !(
            entry.date === entryToRemove.date &&
            entry.suffix === entryToRemove.suffix &&
            entry.time === entryToRemove.time
          ),
      ),
    );
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;

    const timeOptions = selectedEntries
      .map((entry) => buildDecisionTimeOption(entry))
      .filter((entry): entry is BookingRequestDecisionTimeOption => Boolean(entry));

    if (!timeOptions.length) return;
    await onSubmit(timeOptions);
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
                  key={calendarKey}
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
                <AvailableTimeCombobox
                  value={pendingTime}
                  onValueChange={handleAddTime}
                  options={ALL_AVAILABLE_TIME_OPTIONS}
                />
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
                      const tagLabel = entry.time
                        ? `${formatDateForTag(parsedDate)} ${formatTimeForTag(entry.time)}`
                        : `${formatDateForTag(parsedDate)} ${entry.suffix}`;

                      return (
                        <div
                          key={`${entry.date}-${entry.suffix}-${entry.time ?? "pending"}`}
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
                onClick={handleSubmit}
                disabled={isSubmitting || selectedEntries.length === 0}
                className="h-12 w-full rounded-[32px] bg-[#00A63E] font-comfortaa text-[15px] font-bold leading-[22.5px] text-white shadow-[0px_4px_12px_rgba(0,166,62,0.3)] transition-colors hover:bg-[#009638] active:bg-[#008730]"
              >
                {isSubmitting ? "Sending..." : "Send new time"}
              </button>

              <button
                type="button"
                onClick={onPassAppointment}
                disabled={isSubmitting}
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

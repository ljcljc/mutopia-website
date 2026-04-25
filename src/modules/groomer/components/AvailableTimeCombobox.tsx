import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/components/ui/utils";

function formatTimeOption(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildHalfHourOptions(startMinutes: number, endMinutes: number): string[] {
  const options: string[] = [];
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 30) {
    options.push(formatTimeOption(minutes));
  }
  return options;
}

export const AM_TIME_OPTIONS = buildHalfHourOptions(8 * 60, 11 * 60 + 30);
export const PM_TIME_OPTIONS = buildHalfHourOptions(12 * 60, 17 * 60);
export const ALL_AVAILABLE_TIME_OPTIONS = [...AM_TIME_OPTIONS, ...PM_TIME_OPTIONS];

export function getAvailableTimeOptions(slot: string): string[] {
  const normalizedSlot = slot.trim().toUpperCase();
  if (normalizedSlot.endsWith("PM")) return PM_TIME_OPTIONS;
  return AM_TIME_OPTIONS;
}

export function AvailableTimeCombobox({
  value,
  onValueChange,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const filteredOptions = value
    ? options.filter((option) => option.toLowerCase().includes(value.toLowerCase()))
    : options;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative h-9 w-full rounded-[8px] bg-white">
          <input
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") setOpen(false);
            }}
            placeholder="Select or type time"
            className="h-9 w-full rounded-[8px] border border-[#E5E7EB] bg-transparent px-3 pr-8 font-comfortaa text-[12.25px] text-[#4A3C2A] outline-none placeholder:text-[#717182] focus:border-[#2374FF]"
          />
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle available time options"
            className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-[8px]"
          >
            <Icon name="chevron-down" className="h-[12px] w-[12px] text-[#717182]" aria-hidden="true" />
          </button>
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="z-[90] max-h-[220px] w-[167px] touch-pan-y overflow-y-auto overscroll-contain rounded-[8px] border border-[#D6D6D6] bg-white p-1 shadow-md [-webkit-overflow-scrolling:touch]"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onWheel={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onValueChange(option);
                setOpen(false);
              }}
              className={cn(
                "flex h-9 w-full items-center rounded-[4px] px-2 text-left font-comfortaa text-[14px] leading-5 text-[#6B6B6B] hover:bg-amber-50",
                value === option ? "text-[#DE6A07]" : "",
              )}
            >
              {option}
            </button>
          ))
        ) : (
          <div className="px-2 py-2 font-comfortaa text-[12px] text-[#717182]">Type a custom time</div>
        )}
      </PopoverContent>
    </Popover>
  );
}

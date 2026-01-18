import { useEffect } from "react";
import { Icon } from "./Icon";
import { useCalendar, CalendarDay } from "@/hooks/useCalendar";
import { cn } from "@/components/ui/utils";

export interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  yearRange?: { min: number; max: number };
  onMonthChange?: (year: number, month: number) => void;
  allowToggle?: boolean; // 是否允许取消选择（Step5需要，DatePicker不需要）
  className?: string;
  showYearPicker?: boolean;
  showMonthPicker?: boolean;
  onShowYearPickerChange?: (show: boolean) => void;
  onShowMonthPickerChange?: (show: boolean) => void;
}

export function Calendar({
  currentDate,
  onDateChange,
  selectedDate,
  minDate,
  maxDate,
  yearRange,
  onMonthChange,
  allowToggle = false,
  className,
  showYearPicker: controlledShowYearPicker,
  showMonthPicker: controlledShowMonthPicker,
  onShowYearPickerChange,
  onShowMonthPickerChange,
}: CalendarProps) {
  const calendar = useCalendar({
    initialDate: currentDate,
    minDate,
    maxDate,
    yearRange,
    selectedDate,
    onDateChange: (date) => {
      if (allowToggle && selectedDate && 
          date.getDate() === selectedDate.getDate() &&
          date.getMonth() === selectedDate.getMonth() &&
          date.getFullYear() === selectedDate.getFullYear()) {
        // Toggle: if clicking the same date, deselect it
        onDateChange(date);
      } else {
        onDateChange(date);
      }
    },
    onMonthChange,
  });

  // Use controlled or uncontrolled state for pickers
  const showYearPicker = controlledShowYearPicker !== undefined 
    ? controlledShowYearPicker 
    : calendar.showYearPicker;
  const showMonthPicker = controlledShowMonthPicker !== undefined 
    ? controlledShowMonthPicker 
    : calendar.showMonthPicker;

  const setShowYearPicker = (show: boolean) => {
    if (onShowYearPickerChange) {
      onShowYearPickerChange(show);
    } else {
      calendar.setShowYearPicker(show);
    }
  };

  const setShowMonthPicker = (show: boolean) => {
    if (onShowMonthPickerChange) {
      onShowMonthPickerChange(show);
    } else {
      calendar.setShowMonthPicker(show);
    }
  };

  // Close pickers when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsideCalendar = calendar.calendarRef.current?.contains(target);
      
      if (calendar.calendarRef.current && !isInsideCalendar) {
        setShowYearPicker(false);
        setShowMonthPicker(false);
      }
    }

    if (showYearPicker || showMonthPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showYearPicker, showMonthPicker, calendar.calendarRef]);

  const handleDateClick = (dayInfo: CalendarDay) => {
    if (!dayInfo.isCurrentMonth) return;
    if (calendar.isDateDisabled(dayInfo.date)) return;
    
    if (allowToggle && calendar.isDateSelected(dayInfo.date)) {
      // Toggle: deselect
      onDateChange(dayInfo.date);
    } else {
      calendar.handleDateClick(dayInfo.date);
    }
  };

  return (
    <div ref={calendar.calendarRef} className={cn("bg-white content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[16px] shrink-0", className)}>
      {/* Calendar Header */}
      <div className="flex items-center gap-[8px] w-full">
        {/* Year Section - clickable to show picker, with next year arrow */}
        <div className="flex items-center gap-[8px] w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowYearPicker(!showYearPicker);
              setShowMonthPicker(false);
            }}
            className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black text-nowrap tracking-[0.38px] whitespace-pre hover:opacity-80 transition-opacity cursor-pointer"
          >
            {calendar.currentYear}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              calendar.goToNextYear();
            }}
            disabled={!calendar.canGoToNextYear}
            className="flex items-center justify-center h-[16px] w-[8.864px] hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next year"
          >
            <Icon
              name="nav-next"
              aria-label="Next year"
              className="block size-full text-[#DE6A07]"
            />
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Month Section - with navigation arrows and clickable to show picker */}
        <div className="flex items-center gap-[8px]">
          {/* Previous Month Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              calendar.goToPreviousMonth();
            }}
            disabled={!calendar.canGoToPreviousMonth}
            className="flex items-center justify-center h-[16px] w-[8.864px] hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous month"
          >
            <Icon
              name="nav-prev"
              aria-label="Previous month"
              className="block size-full text-[#DE6A07]"
            />
          </button>

          {/* Month - clickable to show picker */}
          <button
            ref={calendar.monthButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setShowMonthPicker(!showMonthPicker);
              setShowYearPicker(false);
            }}
            className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black text-nowrap tracking-[0.38px] whitespace-pre hover:opacity-80 transition-opacity cursor-pointer w-[120px] text-center"
          >
            {calendar.MONTHS[calendar.currentMonth]}
          </button>

          {/* Next Month Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              calendar.goToNextMonth();
            }}
            disabled={!calendar.canGoToNextMonth}
            className="flex items-center justify-center h-[16px] w-[8.864px] hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            <Icon
              name="nav-next"
              aria-label="Next month"
              className="block size-full text-[#DE6A07]"
            />
          </button>
        </div>
      </div>

      {/* Year Picker (Overlay) */}
      {showYearPicker && (
        <div
          ref={calendar.yearScrollRef}
          className="absolute bg-white max-h-[400px] rounded-[8px] top-[16px] left-[16px] w-[68px] z-60 py-[10px] overflow-y-auto shadow-[0px_30px_84px_0px_rgba(19,10,46,0.08),0px_8px_32px_0px_rgba(19,10,46,0.07),0px_3px_14px_0px_rgba(19,10,46,0.03),0px_1px_3px_0px_rgba(19,10,46,0.13)]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db transparent",
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {calendar.yearRangeList.map((year) => {
              const isSelected = year === calendar.currentYear;
              const isDisabled = calendar.isYearDisabled(year);
              return (
                <button
                  key={year}
                  onClick={() => {
                    if (!isDisabled) {
                      calendar.handleYearClick(year);
                      setShowYearPicker(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "box-border content-stretch flex gap-[8px] items-start overflow-clip px-[16px] py-[4px] w-full transition-colors relative cursor-pointer",
                    isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-[#de6a07] cursor-pointer"
                        : "hover:bg-[#f8f7fa] group cursor-pointer"
                  )}
                >
                  <p
                    className={cn(
                      "basis-0 font-['Inter:Semi_Bold',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px]",
                      isSelected
                        ? "text-[#f8f7fa] font-semibold"
                        : "text-[#19181a] font-normal group-hover:text-[#333333] group-hover:font-semibold"
                    )}
                  >
                    {year}
                  </p>
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#de6a07] border-solid inset-0 pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Month Picker (Overlay) */}
      {showMonthPicker && (
        <div
          className="absolute bg-white rounded-[8px] top-[44px] right-0 w-[140px] z-60 shadow-[0px_30px_84px_0px_rgba(19,10,46,0.08),0px_8px_32px_0px_rgba(19,10,46,0.07),0px_3px_14px_0px_rgba(19,10,46,0.03),0px_1px_3px_0px_rgba(19,10,46,0.13)]"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative box-border flex flex-col items-start px-0 py-[8px]">
            {calendar.MONTHS.map((month, index) => {
              const isSelected = index === calendar.currentMonth;
              const isDisabled = calendar.isMonthDisabled(index);
              return (
                <button
                  key={month}
                  onClick={() => {
                    if (!isDisabled) {
                      calendar.handleMonthClick(index);
                      setShowMonthPicker(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={cn(
                    "relative shrink-0 w-full transition-colors",
                    isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : isSelected
                        ? "bg-[#de6a07]"
                        : "hover:bg-[#f8f7fa]"
                  )}
                >
                  <div className="overflow-clip rounded-[inherit] size-full">
                    <div className="box-border content-stretch flex gap-[8px] items-start px-[16px] py-[4px] relative w-full">
                      <p
                        className={cn(
                          "basis-0 font-['Inter:Semi_Bold',sans-serif] grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px]",
                          isSelected
                            ? "text-[#f8f7fa] font-semibold"
                            : "text-[#19181a] font-normal"
                        )}
                      >
                        {month}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#de6a07] border-solid inset-0 pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Days of Week */}
      <div className="content-stretch flex font-['Comfortaa:Medium',sans-serif] font-medium items-center leading-0 relative shrink-0 text-[12px] text-[rgba(60,60,67,0.6)] text-center whitespace-nowrap">
        {calendar.DAYS.map((day) => (
          <div key={day} className="flex flex-col h-[38.286px] justify-center relative shrink-0 w-[46.429px]">
            <p className="leading-[17.5px]">{day}</p>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="content-stretch flex flex-col items-start relative shrink-0">
        {/* Generate 6 rows of 7 days each */}
        {Array.from({ length: 6 }, (_, rowIndex) => {
          const startIndex = rowIndex * 7;
          const rowDays = calendar.calendarDays.slice(startIndex, startIndex + 7);
          
          return (
            <div
              key={`row-${rowIndex}`}
              className={cn(
                "content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-center leading-0 overflow-clip relative shrink-0 text-[16px] text-center w-full",
                rowDays[0]?.isCurrentMonth ? "text-black" : "text-[grey]"
              )}
            >
              {rowDays.map((dayInfo) => {
                const isSelected = dayInfo.isCurrentMonth && calendar.isDateSelected(dayInfo.date);
                const isDisabled = dayInfo.isCurrentMonth && calendar.isDateDisabled(dayInfo.date);
                
                return (
                  <div
                    key={`${dayInfo.isCurrentMonth ? "current" : dayInfo.isNextMonth ? "next" : "prev"}-${dayInfo.day}`}
                    className={cn(
                      "flex flex-col h-[38.286px] justify-center leading-0 relative shrink-0 text-[16px] text-center w-[46.429px]",
                      dayInfo.isCurrentMonth && !isDisabled && "cursor-pointer",
                      isSelected && "bg-[#de6a07] rounded-[8px] text-white",
                      !dayInfo.isCurrentMonth && "text-[grey]",
                      isDisabled && "text-[grey] opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => handleDateClick(dayInfo)}
                  >
                    <p className="leading-[28px] whitespace-pre-wrap font-['Comfortaa:Regular',sans-serif] font-normal">
                      {dayInfo.day}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}


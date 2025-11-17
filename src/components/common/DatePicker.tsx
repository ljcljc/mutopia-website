import { useState, useRef, useEffect, useMemo } from "react";
import iconArrowLeft from "@/assets/icons/icon-arrow-left.svg";
import iconArrowRight from "@/assets/icons/icon-arrow-right.svg";
import iconCalendar from "@/assets/icons/icon-calendar.svg";
import iconAlertError from "@/assets/icons/icon-alert-error.svg";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  minDate?: string; // Format: YYYY-MM-DD or YYYY-MM
  maxDate?: string; // Format: YYYY-MM-DD or YYYY-MM
  mode?: "date" | "month"; // 'date' for full date picker, 'month' for year-month only
  onBlur?: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DatePicker({
  value,
  onChange,
  placeholder,
  label = "Date",
  helperText,
  error,
  minDate = "1900-01-01",
  maxDate,
  mode = "date",
  onBlur,
}: DatePickerProps) {
  // Set default placeholder based on mode
  const defaultPlaceholder = mode === "month" ? "yyyy-mm" : "yyyy-mm-dd";
  const displayPlaceholder = placeholder || defaultPlaceholder;
  const [isOpen, setIsOpen] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthButtonRef = useRef<HTMLButtonElement>(null);
  const hasInitializedRef = useRef(false);

  // Parse date strings to get year and month limits
  const maxDateObj = useMemo(
    () => (maxDate ? new Date(maxDate) : null),
    [maxDate]
  );
  const minDateObj = useMemo(() => new Date(minDate), [minDate]);

  // Set initial calendar view when opening
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      const today = new Date();
      const currentDisplayDate = new Date(currentYear, currentMonth);

      // Parse date constraints
      const maxDateObj = maxDate ? new Date(maxDate) : null;
      const minDateObj = new Date(minDate);

      // Check if current display date is within valid range
      let isInValidRange = true;

      if (maxDateObj) {
        const maxDisplayDate = new Date(
          maxDateObj.getFullYear(),
          maxDateObj.getMonth()
        );
        if (currentDisplayDate > maxDisplayDate) {
          isInValidRange = false;
        }
      }

      if (minDateObj) {
        const minDisplayDate = new Date(
          minDateObj.getFullYear(),
          minDateObj.getMonth()
        );
        if (currentDisplayDate < minDisplayDate) {
          isInValidRange = false;
        }
      }

      // If not in valid range, set default based on constraints
      if (!isInValidRange) {
        // Rule 1: Only maxDate is set (minDate is default "1900-01-01")
        if (maxDateObj && minDate === "1900-01-01") {
          setCurrentYear(maxDateObj.getFullYear());
          setCurrentMonth(maxDateObj.getMonth());
        }
        // Rule 2: Only minDate is set (maxDate is null)
        else if (!maxDateObj && minDate !== "1900-01-01") {
          setCurrentYear(minDateObj.getFullYear());
          setCurrentMonth(minDateObj.getMonth());
        }
        // Rule 3: Both are set or both are default - use today
        else {
          setCurrentYear(today.getFullYear());
          setCurrentMonth(today.getMonth());
        }
      }
    }

    // Reset the flag when picker is closed
    if (!isOpen) {
      hasInitializedRef.current = false;
    }
  }, [isOpen, maxDate, minDate, currentYear, currentMonth]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        const wasOpen = isOpen;
        setIsOpen(false);
        setShowYearPicker(false);
        setShowMonthPicker(false);
        // Call onBlur when calendar closes
        if (wasOpen && onBlur) {
          onBlur();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onBlur]);

  // Generate year range based on min and max dates
  const yearRange = useMemo(() => {
    const minYear = minDateObj.getFullYear();
    const maxYear = maxDateObj
      ? maxDateObj.getFullYear()
      : new Date().getFullYear() + 10;
    const yearCount = maxYear - minYear + 1;
    return Array.from({ length: yearCount }, (_, i) => minYear + i);
  }, [minDateObj, maxDateObj]);

  // Scroll to current year when year picker opens
  useEffect(() => {
    if (showYearPicker && yearScrollRef.current) {
      const currentYearIndex = yearRange.indexOf(currentYear);
      if (currentYearIndex !== -1) {
        // Scroll to center the current year (32px per item height)
        const scrollTop = currentYearIndex * 32 - 184;
        yearScrollRef.current.scrollTop = Math.max(0, scrollTop);
      }
    }
  }, [showYearPicker, currentYear, yearRange]);

  // Get days in month
  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7, so Monday (1) becomes 0
    return day === 0 ? 6 : day - 1;
  }

  // Generate calendar days
  function getCalendarDays() {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

    const days: {
      day: number;
      isCurrentMonth: boolean;
      date: Date;
    }[] = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i),
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(nextYear, nextMonth, i),
      });
    }

    return days;
  }

  function handleDateClick(date: Date) {
    // Don't allow selecting disabled dates
    if (isDateDisabled(date)) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
    setShowYearPicker(false);
    setShowMonthPicker(false);
    // Call onBlur when date is selected
    if (onBlur) {
      onBlur();
    }
  }

  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function handleNextMonth() {
    // Check if we can navigate to next month based on max date
    if (maxDateObj) {
      const maxYear = maxDateObj.getFullYear();
      const maxMonth = maxDateObj.getMonth();

      if (currentMonth === 11) {
        // Don't allow going to next year if we're at max year
        if (currentYear < maxYear) {
          setCurrentMonth(0);
          setCurrentYear(currentYear + 1);
        }
      } else {
        // Don't allow going to next month if we're at max year and max month
        if (
          currentYear < maxYear ||
          (currentYear === maxYear && currentMonth < maxMonth)
        ) {
          setCurrentMonth(currentMonth + 1);
        }
      }
    } else {
      // No max date restriction, navigate normally
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  }

  function handleYearClick(year: number) {
    setCurrentYear(year);
    setShowYearPicker(false);
  }

  function handleMonthClick(monthIndex: number) {
    setCurrentMonth(monthIndex);
    setShowMonthPicker(false);

    // If in month mode, select the month and close the picker
    if (mode === "month") {
      const year = currentYear;
      const month = String(monthIndex + 1).padStart(2, "0");
      onChange(`${year}-${month}`);
      setIsOpen(false);
      // Call onBlur when month is selected in month mode
      if (onBlur) {
        onBlur();
      }
    }
  }

  const calendarDays = getCalendarDays();

  // Parse min and max dates for comparison
  const minDateTime = minDate ? new Date(minDate).setHours(0, 0, 0, 0) : null;
  const maxDateTime = maxDate ? new Date(maxDate).setHours(0, 0, 0, 0) : null;

  // Check if a date is selected
  const selectedDate = value ? new Date(value) : null;
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  // Check if a date is disabled (outside min/max range)
  const isDateDisabled = (date: Date) => {
    const dateTime = date.setHours(0, 0, 0, 0);
    if (minDateTime && dateTime < minDateTime) return true;
    if (maxDateTime && dateTime > maxDateTime) return true;
    return false;
  };

  return (
    <div className="relative w-full" ref={pickerRef}>
      {/* Label */}
      {label && (
        <div
          className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full"
          data-name="Primitive.label"
        >
          <p
            className={`font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre ${error ? "text-[#de1507]" : "text-[#4a3c2a]"}`}
          >
            {label}
          </p>
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            setShowYearPicker(false);
            setShowMonthPicker(false);
          }}
          className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full cursor-pointer"
        >
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                <p
                  className={`basis-0 font-['Comfortaa:Regular',sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[12.25px] ${value ? "text-black" : "text-[#717182]"}`}
                >
                  {value || displayPlaceholder}
                </p>
                {/* Calendar Icon */}
                <div className="h-[25.171px] relative shrink-0 w-[24px] flex items-center justify-center">
                  <img
                    src={iconCalendar}
                    alt="Calendar"
                    className="block size-full"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] ${
              error ? "border-[#de1507]" : "border-gray-200"
            }`}
          />
        </div>
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <div className="absolute bg-white box-border flex flex-col gap-[20px] p-[24px] rounded-[16px] top-[calc(100%+8px)] left-0 z-50 shadow-lg w-full max-w-[373px] border border-[rgba(0,0,0,0.2)] border-solid">
          {/* Year Picker (Overlay) */}
          {showYearPicker && (
            <div
              ref={yearScrollRef}
              className="absolute bg-white h-[400px] rounded-[8px] top-[16px] left-[16px] w-[68px] z-60 overflow-y-auto shadow-[0px_30px_84px_0px_rgba(19,10,46,0.08),0px_8px_32px_0px_rgba(19,10,46,0.07),0px_3px_14px_0px_rgba(19,10,46,0.03),0px_1px_3px_0px_rgba(19,10,46,0.13)]"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db transparent",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-[8px]"
              />

              <div className="relative">
                {yearRange.map((year) => {
                  const isSelected = year === currentYear;
                  const minYear = minDateObj.getFullYear();
                  const maxYear = maxDateObj
                    ? maxDateObj.getFullYear()
                    : new Date().getFullYear() + 10;
                  const isDisabled = year < minYear || year > maxYear;

                  return (
                    <button
                      key={year}
                      onClick={() => !isDisabled && handleYearClick(year)}
                      disabled={isDisabled}
                      className={`box-border content-stretch flex gap-[8px] items-start overflow-clip px-[16px] py-[4px] w-full transition-colors relative ${
                        isDisabled
                          ? "opacity-30 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#de6a07]"
                            : "hover:bg-[#f8f7fa] group"
                      }`}
                    >
                      <p
                        className={`basis-0 font-['Inter:${isSelected ? "Semi_Bold" : "Regular"}',sans-serif] ${
                          isSelected ? "font-semibold" : "font-normal"
                        } grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 ${
                          isSelected
                            ? "text-[#f8f7fa] text-[14px]"
                            : "text-[#19181a] text-[14px] group-hover:text-[#333333] group-hover:text-[13px] group-hover:font-semibold"
                        }`}
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
            <div className="absolute bg-white rounded-[8px] top-[44px] left-[80px] w-[140px] z-60 shadow-[0px_30px_84px_0px_rgba(19,10,46,0.08),0px_8px_32px_0px_rgba(19,10,46,0.07),0px_3px_14px_0px_rgba(19,10,46,0.03),0px_1px_3px_0px_rgba(19,10,46,0.13)]">
              <div
                aria-hidden="true"
                className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]"
              />

              <div className="relative box-border flex flex-col items-start px-0 py-[8px]">
                {MONTHS.map((month, index) => {
                  const isSelected = index === currentMonth;

                  // Check if month should be disabled based on min/max dates
                  let isDisabled = false;
                  if (maxDateObj) {
                    const maxYear = maxDateObj.getFullYear();
                    const maxMonth = maxDateObj.getMonth();
                    if (currentYear === maxYear && index > maxMonth) {
                      isDisabled = true;
                    }
                  }
                  if (minDateObj) {
                    const minYear = minDateObj.getFullYear();
                    const minMonth = minDateObj.getMonth();
                    if (currentYear === minYear && index < minMonth) {
                      isDisabled = true;
                    }
                  }

                  return (
                    <button
                      key={month}
                      onClick={() => !isDisabled && handleMonthClick(index)}
                      disabled={isDisabled}
                      className={`relative shrink-0 w-full transition-colors ${
                        isDisabled
                          ? "opacity-30 cursor-not-allowed"
                          : isSelected
                            ? "bg-[#de6a07]"
                            : "hover:bg-[#f8f7fa]"
                      }`}
                    >
                      <div className="overflow-clip rounded-[inherit] size-full">
                        <div className="box-border content-stretch flex gap-[8px] items-start px-[16px] py-[4px] relative w-full">
                          <p
                            className={`basis-0 font-['Inter:${isSelected ? "Semi_Bold" : "Regular"}',sans-serif] ${
                              isSelected ? "font-semibold" : "font-normal"
                            } grow leading-[24px] min-h-px min-w-px not-italic relative shrink-0 text-[14px] ${
                              isSelected ? "text-[#f8f7fa]" : "text-[#19181a]"
                            }`}
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

          {/* Calendar Content */}
          <div className="flex flex-col gap-[16px] w-full">
            {/* Month/Year Header */}
            <div className="flex items-center gap-[8px] relative">
              {/* Year and Month - clickable to show pickers */}
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black text-nowrap tracking-[0.38px] whitespace-pre hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {currentYear}
                </button>
                <button
                  ref={monthButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black text-nowrap tracking-[0.38px] whitespace-pre hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {MONTH_ABBR[currentMonth]}
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Navigation Arrows */}
              <div className="flex items-center gap-[8px]">
                {/* Previous Month Arrow */}
                <button
                  onClick={handlePrevMonth}
                  className="flex items-center justify-center h-[16px] w-[8.864px] hover:opacity-70 transition-opacity"
                >
                  <img
                    src={iconArrowLeft}
                    alt="Previous month"
                    className="block size-full"
                  />
                </button>

                {/* Next Month Arrow */}
                <button
                  onClick={handleNextMonth}
                  className="flex items-center justify-center h-[16px] w-[8.864px] hover:opacity-70 transition-opacity"
                >
                  <img
                    src={iconArrowRight}
                    alt="Next month"
                    className="block size-full"
                  />
                </button>
              </div>
            </div>

            {/* Days of Week - Only show in date mode */}
            {mode === "date" && (
              <div className="content-stretch flex font-['Comfortaa:Medium',sans-serif] font-medium gap-[23px] items-center leading-0 relative shrink-0 text-[12px] text-[rgba(60,60,67,0.6)] text-center whitespace-nowrap">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="flex flex-col justify-center relative shrink-0"
                  >
                    <p className="leading-[17.5px]">{day}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Calendar Grid - Only show in date mode */}
            {mode === "date" && (
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                {Array.from({ length: 6 }).map((_, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-center leading-0 overflow-clip relative shrink-0 text-[16px] text-center w-full"
                  >
                    {calendarDays
                      .slice(weekIndex * 7, (weekIndex + 1) * 7)
                      .map((dayInfo, dayIndex) => {
                        const selected = isDateSelected(dayInfo.date);
                        const disabled = isDateDisabled(dayInfo.date);
                        const isCurrentMonth = dayInfo.isCurrentMonth;
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`flex flex-col h-[38.286px] justify-center relative shrink-0 w-[46.429px] ${
                              selected
                                ? "bg-[#de6a07] rounded-[8px] gap-[10px] items-center justify-center"
                                : ""
                            }`}
                          >
                            <button
                              onClick={() =>
                                !disabled && handleDateClick(dayInfo.date)
                              }
                              disabled={disabled}
                              className={`flex flex-col h-full justify-center relative shrink-0 w-full ${
                                disabled
                                  ? "text-[#d0d0d0] cursor-not-allowed"
                                  : selected
                                    ? "text-white"
                                    : isCurrentMonth
                                      ? "text-black"
                                      : "text-[grey]"
                              }`}
                            >
                              <p
                                className={`font-['Comfortaa:${selected ? "Bold" : "Regular"}',sans-serif] ${
                                  selected ? "font-bold" : "font-normal"
                                } leading-[28px] whitespace-pre-wrap`}
                              >
                                {dayInfo.day}
                              </p>
                            </button>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            )}

            {/* Month mode instruction - Show when in month mode and no pickers are open */}
            {mode === "month" && !showYearPicker && !showMonthPicker && (
              <div className="flex items-center justify-center py-[24px]">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] text-[#717182] text-center">
                  Click year or month to select
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper text or Error message */}
      {(helperText || error) && (
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 mt-[4px]">
          {error && (
            <img src={iconAlertError} alt="Error" className="size-[14px]" />
          )}
          <p
            className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] ${
              error ? "text-[#de1507]" : "text-[#4c4c4c]"
            }`}
          >
            {error || helperText}
          </p>
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "./Icon";
import { Calendar } from "./Calendar";
import { MONTHS } from "@/constants/calendar";

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
  onBlur?: (value?: string) => void;
}

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
  const popupRef = useRef<HTMLDivElement>(null);
  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthButtonRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  // Parse date strings to get year and month limits
  const maxDateObj = useMemo(
    () => (maxDate ? new Date(maxDate) : null),
    [maxDate]
  );
  const minDateObj = useMemo(() => new Date(minDate), [minDate]);

  // Parse selected date
  const selectedDateObj = useMemo(() => {
    if (!value || mode !== "date") return null;
    try {
      return new Date(value);
    } catch {
      return null;
    }
  }, [value, mode]);

  // Current date for calendar
  const currentDateObj = useMemo(() => {
    if (value && mode === "date") {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch {
        // Fall through to default
      }
    }
    return new Date(currentYear, currentMonth, 1);
  }, [value, mode, currentYear, currentMonth]);

  // Update current year and month when value changes (for month mode)
  useEffect(() => {
    if (value && mode === "month") {
      try {
        const [yearStr, monthStr] = value.split("-");
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1; // month is 0-indexed
        if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
          setCurrentYear(year);
          setCurrentMonth(month);
        }
      } catch (_e) {
        // If parsing fails, keep current values
      }
    }
  }, [value, mode]);

  // Set initial calendar view when opening
  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      const today = new Date();
      
      // If value exists, use it to set current year and month
      if (value) {
        try {
          const [yearStr, monthStr] = value.split("-");
          const year = parseInt(yearStr);
          const month = parseInt(monthStr) - 1; // month is 0-indexed
          if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
            setCurrentYear(year);
            setCurrentMonth(month);
          }
        } catch (_e) {
          // If parsing fails, use current values
        }
      }
      
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
  }, [isOpen, maxDate, minDate, currentYear, currentMonth, value]);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isInsidePicker = pickerRef.current?.contains(target);
      const isInsidePopup = popupRef.current?.contains(target);
      
      if (
        pickerRef.current &&
        !isInsidePicker &&
        !isInsidePopup
      ) {
        const wasOpen = isOpen;
        setIsOpen(false);
        setShowYearPicker(false);
        setShowMonthPicker(false);
        // Call onBlur when calendar closes
        if (wasOpen && onBlur) {
          onBlur(value);
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onBlur, value]);

  // Generate year range based on min and max dates
  // For birthday/date of birth, maxYear should be current year (no future dates)
  // For other use cases, if no maxDate is provided, use current year as default
  const yearRange = useMemo(() => {
    const minYear = minDateObj.getFullYear();
    const maxYear = maxDateObj
      ? maxDateObj.getFullYear()
      : new Date().getFullYear(); // Default to current year, not future
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

  function handlePrevMonth() {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    // Check if we can navigate to previous month based on min date
    if (minDateObj) {
      const minYear = minDateObj.getFullYear();
      const minMonth = minDateObj.getMonth();
      
      if (currentMonth === 0) {
        // Don't allow going to previous year if we're at min year
        if (currentYear > minYear) {
          newMonth = 11;
          newYear = currentYear - 1;
        } else {
          return; // Can't navigate
        }
      } else {
        // Don't allow going to previous month if we're at min year and min month
        if (
          currentYear > minYear ||
          (currentYear === minYear && currentMonth > minMonth)
        ) {
          newMonth = currentMonth - 1;
        } else {
          return; // Can't navigate
        }
      }
    } else {
      // No min date restriction, navigate normally
      if (currentMonth === 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // 在月份模式下，同步更新 value 以反映选中状态变化
    if (mode === "month") {
      const month = String(newMonth + 1).padStart(2, "0");
      const formattedMonth = `${newYear}-${month}`;
      onChange(formattedMonth);
    }
  }

  function handleNextMonth() {
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    // Check if we can navigate to next month based on max date
    if (maxDateObj) {
      const maxYear = maxDateObj.getFullYear();
      const maxMonth = maxDateObj.getMonth();

      if (currentMonth === 11) {
        // Don't allow going to next year if we're at max year
        if (currentYear < maxYear) {
          newMonth = 0;
          newYear = currentYear + 1;
        } else {
          return; // Can't navigate
        }
      } else {
        // Don't allow going to next month if we're at max year and max month
        if (
          currentYear < maxYear ||
          (currentYear === maxYear && currentMonth < maxMonth)
        ) {
          newMonth = currentMonth + 1;
        } else {
          return; // Can't navigate
        }
      }
    } else {
      // No max date restriction, navigate normally
      if (currentMonth === 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    
    // 在月份模式下，同步更新 value 以反映选中状态变化
    if (mode === "month") {
      const month = String(newMonth + 1).padStart(2, "0");
      const formattedMonth = `${newYear}-${month}`;
      onChange(formattedMonth);
    }
  }



  function handleNextYear() {
    const maxYear = maxDateObj ? maxDateObj.getFullYear() : new Date().getFullYear();
    if (currentYear < maxYear) {
      setCurrentYear(currentYear + 1);
    }
  }

  function handleYearClick(year: number) {
    // Validate year is within range before setting
    const minYear = minDateObj.getFullYear();
    const maxYear = maxDateObj ? maxDateObj.getFullYear() : new Date().getFullYear();
    
    if (year >= minYear && year <= maxYear) {
      setCurrentYear(year);
      setShowYearPicker(false);
    }
  }

  function handleMonthClick(monthIndex: number) {
    // If in month mode, select the month and close the picker
    if (mode === "month") {
      // 使用当前显示的年份和选中的月份
      const year = currentYear;
      const month = String(monthIndex + 1).padStart(2, "0");
      const formattedMonth = `${year}-${month}`;
      
      // 调用 onChange 更新值（同步到输入框）
      onChange(formattedMonth);
      
      // 更新当前月份显示
      setCurrentMonth(monthIndex);
      
      // 关闭选择器
      setShowMonthPicker(false);
      setShowYearPicker(false);
      setIsOpen(false);
      
      // Call onBlur when month is selected in month mode
      if (onBlur) {
        onBlur(formattedMonth);
      }
    } else {
      // In date mode, just change the displayed month
      setCurrentMonth(monthIndex);
      setShowMonthPicker(false);
    }
  }

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative w-full">
      {/* Label */}
      {label && (
        <div
          className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full"
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
      <div className="relative w-full" ref={pickerRef}>
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
                  <Icon
                    name="calendar"
                    aria-label="Calendar"
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
        <div 
          ref={popupRef}
          onMouseDown={(e) => {
            // 阻止点击面板内部关闭面板
            e.stopPropagation();
          }}
          onClick={(e) => {
            // 阻止点击面板内部关闭面板
            e.stopPropagation();
          }}
          className={`absolute bg-white box-border flex flex-col gap-[20px] p-[24px] rounded-[16px] top-[calc(100%+8px)] left-0 z-50 shadow-lg border border-[rgba(0,0,0,0.2)] border-solid ${
            mode === "month" ? "w-auto min-w-[320px]" : "w-full max-w-[373px]"
          }`}
        >
          {/* Year Picker (Overlay) - Only show in month mode, not in date mode (Calendar handles it) */}
          {showYearPicker && mode === "month" && (
            <div
              ref={yearScrollRef}
              className="absolute bg-white h-[400px] rounded-[8px] top-[16px] left-[16px] w-[68px] z-[70] overflow-y-auto shadow-[0px_30px_84px_0px_rgba(19,10,46,0.08),0px_8px_32px_0px_rgba(19,10,46,0.07),0px_3px_14px_0px_rgba(19,10,46,0.03),0px_1px_3px_0px_rgba(19,10,46,0.13)]"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db transparent",
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
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
                    : new Date().getFullYear(); // Default to current year, not future
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

          {/* Month Picker (Overlay) - Only show in month mode, not in date mode (Calendar handles it) */}
          {showMonthPicker && mode === "month" && (
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
          <div className="flex flex-col gap-[20px] w-full">
            {/* Use Calendar component for date mode */}
            {mode === "date" ? (
              <Calendar
                currentDate={currentDateObj}
                onDateChange={(date: Date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const formattedDate = `${year}-${month}-${day}`;
                  onChange(formattedDate);
                  setIsOpen(false);
                  setShowYearPicker(false);
                  setShowMonthPicker(false);
                  if (onBlur) {
                    onBlur(formattedDate);
                  }
                }}
                selectedDate={selectedDateObj}
                minDate={minDateObj}
                maxDate={maxDateObj || undefined}
                // Pass yearRange to Calendar to ensure correct year selection range
                // This only affects date mode, month mode uses its own year picker
                yearRange={{
                  min: minDateObj.getFullYear(),
                  max: maxDateObj ? maxDateObj.getFullYear() : new Date().getFullYear()
                }}
                showYearPicker={showYearPicker}
                showMonthPicker={showMonthPicker}
                onShowYearPickerChange={setShowYearPicker}
                onShowMonthPickerChange={setShowMonthPicker}
                className="p-0 gap-[20px]"
              />
            ) : mode === "month" ? (
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid justify-items-start leading-0 relative shrink-0 w-full">
                {/* Year Section */}
                <div className="col-1 content-stretch flex gap-[8px] items-center ml-0 mt-0 relative row-1">
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowYearPicker(!showYearPicker);
                      setShowMonthPicker(false);
                    }}
                    className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black tracking-[0.38px] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {currentYear}
                  </button>
                  {/* Next Year Arrow */}
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextYear();
                    }}
                    className="h-[16px] relative shrink-0 w-[8.864px] hover:opacity-70 transition-opacity cursor-pointer"
                  >
                    <Icon
                      name="nav-next"
                      aria-label="Next year"
                      className="block size-full text-[#de6a07]"
                    />
                  </button>
                </div>

                {/* Month Section with Navigation */}
                <div className="col-1 content-stretch flex gap-[22px] items-center ml-[170.35px] mt-[3.5px] relative row-1">
                  {/* Previous Month Arrow */}
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevMonth();
                    }}
                    disabled={
                      minDateObj
                        ? (currentMonth === 0 && currentYear <= minDateObj.getFullYear()) ||
                          (currentYear === minDateObj.getFullYear() && currentMonth <= minDateObj.getMonth())
                        : false
                    }
                    className="flex items-center justify-center relative shrink-0 rotate-180 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="h-[16px] relative w-[8.864px]">
                      <Icon
                        name="nav-next"
                        aria-label="Previous month"
                        className="block size-full text-[#de6a07]"
                      />
                    </div>
                  </button>

                  {/* Month Name - 不可点击，固定宽度 */}
                  <div
                    ref={monthButtonRef}
                    className="font-['Poppins:Bold',sans-serif] font-bold leading-[24px] not-italic text-[20px] text-black tracking-[0.38px] w-[120px] text-center"
                  >
                    {MONTHS[currentMonth]}
                  </div>

                  {/* Next Month Arrow */}
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextMonth();
                    }}
                    disabled={
                      maxDateObj
                        ? (currentMonth === 11 && currentYear >= maxDateObj.getFullYear()) ||
                          (currentYear === maxDateObj.getFullYear() && currentMonth >= maxDateObj.getMonth())
                        : false
                    }
                    className="flex items-center justify-center relative shrink-0 hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="h-[16px] relative w-[8.864px]">
                      <Icon
                        name="nav-next"
                        aria-label="Next month"
                        className="block size-full text-[#de6a07]"
                      />
                    </div>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Month Grid - Show when in month mode (always show, year picker overlays on top) */}
            {mode === "month" && !showMonthPicker && (
              <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative shrink-0 w-full">
                {/* Row 1: January, February, March */}
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                  {[0, 1, 2].map((monthIndex) => {
                    // 检查是否选中：需要匹配 value 中的年份和月份
                    let isSelected = false;
                    if (value) {
                      try {
                        const [selectedYear, selectedMonth] = value.split("-");
                        isSelected =
                          parseInt(selectedYear) === currentYear &&
                          parseInt(selectedMonth) === monthIndex + 1;
                      } catch (_e) {
                        // 如果解析失败，不选中
                      }
                    }
                    return (
                      <button
                        key={monthIndex}
                        onClick={() => handleMonthClick(monthIndex)}
                        className={`group content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-[24px] py-[12px] relative shrink-0 transition-all duration-200 rounded-[8px] cursor-pointer ${
                          isSelected
                            ? "bg-[#de6a07]"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex flex-col font-['Comfortaa:Bold',sans-serif] font-bold justify-center leading-0 relative shrink-0 text-[14px] text-center whitespace-nowrap">
                          <p
                            className={`leading-[20px] transition-colors ${
                              isSelected
                                ? "text-[#fafafa]"
                                : "text-[#424242] group-hover:text-[#de6a07]"
                            }`}
                          >
                            {MONTHS[monthIndex]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: April, May, June */}
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                  {[3, 4, 5].map((monthIndex) => {
                    let isSelected = false;
                    if (value) {
                      try {
                        const [selectedYear, selectedMonth] = value.split("-");
                        isSelected =
                          parseInt(selectedYear) === currentYear &&
                          parseInt(selectedMonth) === monthIndex + 1;
                      } catch (_e) {
                        // 如果解析失败，不选中
                      }
                    }
                    return (
                      <button
                        key={monthIndex}
                        onClick={() => handleMonthClick(monthIndex)}
                        className={`group content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-[24px] py-[12px] relative shrink-0 transition-all duration-200 rounded-[8px] cursor-pointer ${
                          isSelected
                            ? "bg-[#de6a07]"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex flex-col font-['Comfortaa:Bold',sans-serif] font-bold justify-center leading-0 relative shrink-0 text-[14px] text-center whitespace-nowrap">
                          <p
                            className={`leading-[20px] transition-colors ${
                              isSelected
                                ? "text-[#fafafa]"
                                : "text-[#424242] group-hover:text-[#de6a07]"
                            }`}
                          >
                            {MONTHS[monthIndex]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Row 3: July, August, September */}
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                  {[6, 7, 8].map((monthIndex) => {
                    let isSelected = false;
                    if (value) {
                      try {
                        const [selectedYear, selectedMonth] = value.split("-");
                        isSelected =
                          parseInt(selectedYear) === currentYear &&
                          parseInt(selectedMonth) === monthIndex + 1;
                      } catch (_e) {
                        // 如果解析失败，不选中
                      }
                    }
                    return (
                      <button
                        key={monthIndex}
                        onClick={() => handleMonthClick(monthIndex)}
                        className={`group content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-[24px] py-[12px] relative shrink-0 transition-all duration-200 rounded-[8px] cursor-pointer ${
                          isSelected
                            ? "bg-[#de6a07]"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex flex-col font-['Comfortaa:Bold',sans-serif] font-bold justify-center leading-0 relative shrink-0 text-[14px] text-center whitespace-nowrap">
                          <p
                            className={`leading-[20px] transition-colors ${
                              isSelected
                                ? "text-[#fafafa]"
                                : "text-[#424242] group-hover:text-[#de6a07]"
                            }`}
                          >
                            {MONTHS[monthIndex]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Row 4: October, November, December */}
                <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
                  {[9, 10, 11].map((monthIndex) => {
                    let isSelected = false;
                    if (value) {
                      try {
                        const [selectedYear, selectedMonth] = value.split("-");
                        isSelected =
                          parseInt(selectedYear) === currentYear &&
                          parseInt(selectedMonth) === monthIndex + 1;
                      } catch (_e) {
                        // 如果解析失败，不选中
                      }
                    }
                    return (
                      <button
                        key={monthIndex}
                        onClick={() => handleMonthClick(monthIndex)}
                        className={`group content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-[24px] py-[12px] relative shrink-0 transition-all duration-200 rounded-[8px] cursor-pointer ${
                          isSelected
                            ? "bg-[#de6a07]"
                            : "bg-transparent"
                        }`}
                      >
                        <div className="flex flex-col font-['Comfortaa:Bold',sans-serif] font-bold justify-center leading-0 relative shrink-0 text-[14px] text-center whitespace-nowrap">
                          <p
                            className={`leading-[20px] transition-colors ${
                              isSelected
                                ? "text-[#fafafa]"
                                : "text-[#424242] group-hover:text-[#de6a07]"
                            }`}
                          >
                            {MONTHS[monthIndex]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper text or Error message */}
      {(helperText || error) && (
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 mt-[4px]">
          {error && (
            <Icon name="alert-error" aria-label="Error" className="size-[14px]" />
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

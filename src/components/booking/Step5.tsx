import { useState, useMemo } from "react";
import { OrangeButton } from "@/components/common/OrangeButton";
import { Checkbox } from "@/components/common/Checkbox";
import { Icon } from "@/components/common/Icon";
import { Calendar } from "@/components/common/Calendar";
import { useBookingStore } from "./bookingStore";
import { cn } from "@/components/ui/utils";
import { TIME_PERIODS } from "@/constants/calendar";
import type { TimeSlotIn } from "@/lib/api";

export function Step5() {
  const { previousStep, nextStep, selectedTimeSlots, setSelectedTimeSlots } = useBookingStore();
  const maxTimeSlots = 6;
  const remainingSlots = Math.max(0, maxTimeSlots - selectedTimeSlots.length);
  const isMaxSlotsReached = selectedTimeSlots.length >= maxTimeSlots;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Date range: today to exactly 1 year from today (365 days)
  // This ensures users can only book appointments within one year
  const minDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const maxDate = useMemo(() => {
    // Calculate exactly one year from today
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    // Set to end of day to include the entire last day
    oneYearLater.setHours(23, 59, 59, 999);
    return oneYearLater;
  }, []);

  // Date disabled logic is now handled by Calendar component
  // The Calendar component will disable dates outside the minDate-maxDate range

  // Generate year range for year picker (current year to current year + 1)
  // This limits the year picker to only show years within the booking range
  const yearRange = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const maxYear = maxDate.getFullYear();
    // Ensure we only show years within the one-year booking window
    return { min: currentYear, max: maxYear };
  }, [maxDate]);

  // Format date to ISO string (YYYY-MM-DD)
  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Parse ISO date string to Date
  const parseISODate = (dateString: string): Date => {
    return new Date(dateString + "T00:00:00");
  };

  // Handle date change from Calendar component (with toggle support)
  const handleDateChange = (date: Date) => {
    if (isMaxSlotsReached) return;
    // Toggle: if clicking the same date, deselect it
    if (selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()) {
      setSelectedDate(null);
      // Also remove all time slots for this date
      const dateISO = formatDateToISO(date);
      setSelectedTimeSlots(selectedTimeSlots.filter(
        (slot) => slot.date !== dateISO
      ));
    } else {
      setSelectedDate(date);
    }
  };

  // Toggle time period - generate time slot entries
  const toggleTimePeriod = (periodId: string) => {
    if (!selectedDate) return; // Should be disabled, but double check
    
    const dateISO = formatDateToISO(selectedDate);
    
    // Check if this time slot already exists
    const existingSlot = selectedTimeSlots.find(
      (slot) => slot.date === dateISO && slot.slot === periodId
    );

    if (existingSlot) {
      // Remove the time slot
      setSelectedTimeSlots(selectedTimeSlots.filter(
        (slot) => !(slot.date === dateISO && slot.slot === periodId)
      ));
    } else {
      if (selectedTimeSlots.length >= maxTimeSlots) return;
      // Add new time slot
      const newSlot: TimeSlotIn = {
        date: dateISO,
        slot: periodId,
      };
      setSelectedTimeSlots([...selectedTimeSlots, newSlot]);
    }
  };

  // Remove time slot
  const removeTimeSlot = (dateISO: string, slot: string) => {
    setSelectedTimeSlots(selectedTimeSlots.filter(
      (s) => !(s.date === dateISO && s.slot === slot)
    ));
  };

  // Format date for display in tag (YYYY.MM.DD format)
  const formatDateForTag = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // Check if a time period is selected for the current selected date
  const isTimePeriodSelected = (periodId: string): boolean => {
    if (!selectedDate) return false;
    const dateISO = formatDateToISO(selectedDate);
    return selectedTimeSlots.some(
      (slot) => slot.date === dateISO && slot.slot === periodId
    );
  };

  const handleContinue = () => {
    // Selected time slots are already in bookingStore, no need to save again
    nextStep();
  };

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative w-full">
      {/* Main Content Card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
          {/* Title and Description */}
          <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex h-[24.5px] items-center relative shrink-0 w-full">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                Select date and time period
              </p>
            </div>
            <div className="h-[17.5px] relative shrink-0 w-full">
              <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                Choose multiple dates and time periods to secure your appointment (Max.6)
              </p>
            </div>
          </div>

          {/* Calendar and Time Period Selection */}
          <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
            {/* Calendar */}
            <Calendar
              currentDate={currentDate}
              onDateChange={handleDateChange}
              selectedDate={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
              yearRange={yearRange}
              disabled={isMaxSlotsReached}
              className={isMaxSlotsReached ? "cursor-not-allowed" : undefined}
              onMonthChange={(year, month) => {
                setCurrentDate(new Date(year, month, 1));
              }}
              allowToggle={true}
              showYearPicker={showYearPicker}
              showMonthPicker={showMonthPicker}
              onShowYearPickerChange={setShowYearPicker}
              onShowMonthPickerChange={setShowMonthPicker}
            />

            {/* Time Period Selection */}
            <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0">
              <div className="gap-[14px] grid grid-cols-1 grid-rows-2 h-[186px] pb-0 pt-[24px] px-0 relative shrink-0 w-[343px]">
                {TIME_PERIODS.map((period) => {
                  const isSelected = isTimePeriodSelected(period.id);
                  const isDisabled = !selectedDate || isMaxSlotsReached;
                  
                  return (
                    <div
                      key={period.id}
                      className={cn(
                        "border-2 border-gray-200 border-solid content-stretch flex flex-col items-start p-[16px] relative rounded-[14px] self-start shrink-0 w-[343px] transition-colors",
                        isSelected && "bg-[#fff3e9] border-[#de6a07]",
                        isDisabled && "opacity-50 cursor-not-allowed",
                        !isDisabled && "cursor-pointer"
                      )}
                      onClick={() => !isDisabled && toggleTimePeriod(period.id)}
                    >
                      <div className="content-stretch flex gap-[123.758px] items-start relative shrink-0 w-full">
                        <div className="relative shrink-0">
                          <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[8px] items-start relative">
                            <div className="content-stretch flex h-[21px] items-center relative shrink-0">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => !isDisabled && toggleTimePeriod(period.id)}
                                disabled={isDisabled}
                              />
                            </div>
                            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                              <div className="h-[21px] relative shrink-0 w-[141.891px]">
                                <p className={cn(
                                  "absolute leading-[21px] left-0 text-[14px] text-[#8b6357] top-[0.5px]",
                                  isSelected 
                                    ? "font-['Comfortaa:Bold',sans-serif] font-bold"
                                    : "font-['Comfortaa:Medium',sans-serif] font-medium"
                                )}>
                                  {period.label}
                                </p>
                              </div>
                              <div className="content-stretch flex items-center relative shrink-0 w-full">
                                <p className={cn(
                                  "leading-[17.5px] relative shrink-0 text-[12.25px]",
                                  isSelected
                                    ? "font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a5565]"
                                    : "font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a5565]"
                                )}>
                                  {period.timeRange}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Alert - Selected Time Slots Count */}
              {selectedTimeSlots.length > 0 && (
                <div className="bg-[#f4ffde] border border-[#6aa31c] border-solid content-stretch flex max-w-[343px] h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[8px] shrink-0">
                  <div className="content-stretch flex gap-[8px] items-center relative w-full min-w-0">
                    <Icon
                      name="alert-success"
                      className="relative shrink-0 size-[12px] text-[#6aa31c]"
                    />
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative text-[#467900] text-[10px] whitespace-normal break-words w-full min-w-0">
                      {isMaxSlotsReached
                        ? "Maximum of 6 periods selected, our groomer will confirm by email."
                        : `${selectedTimeSlots.length} period${selectedTimeSlots.length > 1 ? "s" : ""} selected. You can choose ${remainingSlots} more available time${remainingSlots === 1 ? "" : "s"}.`}
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Time Slots List */}
              {selectedTimeSlots.length > 0 && (
                <div className="content-stretch flex flex-wrap gap-[14px] items-start relative shrink-0 w-[343px]">
                  {selectedTimeSlots.map((slot, index) => {
                    const period = TIME_PERIODS.find((p) => p.id === slot.slot);
                    if (!period) return null;
                    
                    // Parse date string to Date for formatting
                    const slotDate = parseISODate(slot.date);
                    
                    // Get AM/PM from period label
                    const periodSuffix = period.label.includes("AM") ? "AM" : "PM";
                    
                    return (
                      <div
                        key={`${slot.date}-${slot.slot}-${index}`}
                        className={cn(
                          "border border-[#4c4c4c] border-solid content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[12px] shrink-0 w-[103px]",
                          isMaxSlotsReached && "cursor-not-allowed"
                        )}
                      >
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#4c4c4c] text-[10px]">
                          {formatDateForTag(slotDate)} {periodSuffix}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTimeSlot(slot.date, slot.slot);
                          }}
                          className="flex items-center justify-center relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                          aria-label={`Remove ${formatDateForTag(slotDate)} ${periodSuffix}`}
                        >
                          <Icon
                            name="close-arrow"
                            className="h-[16px] relative w-[16px] text-[#4c4c4c]"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="content-stretch flex items-start relative shrink-0 w-full">
        <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
          <OrangeButton size="medium" onClick={handleContinue}>
            <div className="flex gap-[4px] items-center">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-white">
                Continue
              </p>
              <Icon
                name="button-arrow"
                aria-label="Arrow"
                className="size-[14px] text-white"
              />
            </div>
          </OrangeButton>
          <OrangeButton
            size="medium"
            variant="outline"
            onClick={previousStep}
          >
            Back
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}

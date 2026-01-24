import { useMemo, useState, useRef } from "react";
import { MONTHS, DAYS } from "@/constants/calendar";

export interface UseCalendarOptions {
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  yearRange?: { min: number; max: number };
  selectedDate?: Date | null;
  onDateChange?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isNextMonth: boolean;
  date: Date;
}

export function useCalendar(options: UseCalendarOptions = {}) {
  const {
    initialDate,
    minDate,
    maxDate,
    yearRange,
    selectedDate,
    onDateChange,
    onMonthChange,
  } = options;

  // Determine initial date based on date range or provided initialDate
  const getInitialDate = (): Date => {
    if (initialDate) {
      // Check if initialDate is within valid range
      if (minDate || maxDate) {
        const dateTime = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()).getTime();
        if (minDate) {
          const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
          if (dateTime < minDateTime) {
            // Use minDate if initialDate is before minDate
            return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
          }
        }
        if (maxDate) {
          const maxDateTime = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();
          if (dateTime > maxDateTime) {
            // Use maxDate if initialDate is after maxDate
            return new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
          }
        }
      }
      return initialDate;
    }
    
    // If no initialDate, determine based on date range
    const today = new Date();
    if (minDate && maxDate) {
      // Both min and max are set - use today if in range, otherwise use closest boundary
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
      const maxDateTime = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();
      
      if (todayTime >= minDateTime && todayTime <= maxDateTime) {
        return today;
      } else if (todayTime < minDateTime) {
        return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      } else {
        return new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
      }
    } else if (minDate) {
      // Only minDate is set - use minDate if today is before it, otherwise use today
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
      return todayTime >= minDateTime ? today : new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    } else if (maxDate) {
      // Only maxDate is set - use maxDate if today is after it, otherwise use today
      const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const maxDateTime = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();
      return todayTime <= maxDateTime ? today : new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    }
    
    // No constraints - use today
    return today;
  };

  const [currentDate, setCurrentDate] = useState(getInitialDate);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const yearScrollRef = useRef<HTMLDivElement>(null);
  const monthButtonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate year range
  const yearRangeList = useMemo(() => {
    if (yearRange) {
      const years: number[] = [];
      for (let i = yearRange.min; i <= yearRange.max; i++) {
        years.push(i);
      }
      return years;
    }
    // Default: current year ± 10 years
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  }, [yearRange]);

  // Note: Year picker scrolling is now handled in Calendar component using scrollIntoView
  // This ensures the selected year button is scrolled into view when the picker opens

  // Check if a date is disabled (outside min/max range)
  const isDateDisabled = (date: Date): boolean => {
    if (!minDate && !maxDate) return false;
    
    const dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    
    if (minDate) {
      const minDateTime = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
      if (dateTime < minDateTime) return true;
    }
    
    if (maxDate) {
      const maxDateTime = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime();
      if (dateTime > maxDateTime) return true;
    }
    
    return false;
  };

  // Check if a date is selected
  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Convert to Monday = 0 format
  const startingDayIndex = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

  // Get previous month's trailing days
  const previousMonth = new Date(currentYear, currentMonth, 0);
  const daysInPreviousMonth = previousMonth.getDate();
  const trailingDays = useMemo(() => {
    const days: number[] = [];
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      days.push(daysInPreviousMonth - i);
    }
    return days;
  }, [startingDayIndex, daysInPreviousMonth]);

  // Generate calendar grid (6 rows × 7 days = 42 cells)
  const calendarDays = useMemo((): CalendarDay[] => {
    const days: CalendarDay[] = [];
    
    // Previous month trailing days
    trailingDays.forEach((day) => {
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({ day, isCurrentMonth: false, isNextMonth: false, date });
    });
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push({ day, isCurrentMonth: true, isNextMonth: false, date });
    }
    
    // Next month leading days (fill remaining cells to 42)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentYear, currentMonth + 1, day);
      days.push({ day, isCurrentMonth: false, isNextMonth: true, date });
    }
    
    return days;
  }, [daysInMonth, trailingDays, currentYear, currentMonth]);

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    
    if (minDate) {
      const minDisplayDate = new Date(minDate.getFullYear(), minDate.getMonth());
      const newDisplayDate = new Date(newDate.getFullYear(), newDate.getMonth());
      
      if (newDisplayDate < minDisplayDate) {
        return; // Don't navigate if out of range
      }
    }
    
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    
    if (maxDate) {
      const maxDisplayDate = new Date(maxDate.getFullYear(), maxDate.getMonth());
      const newDisplayDate = new Date(newDate.getFullYear(), newDate.getMonth());
      
      if (newDisplayDate > maxDisplayDate) {
        return; // Don't navigate if out of range
      }
    }
    
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  // Navigate years
  const goToNextYear = () => {
    const newDate = new Date(currentYear + 1, currentMonth, 1);
    
    if (maxDate) {
      const maxDisplayDate = new Date(maxDate.getFullYear(), maxDate.getMonth());
      const newDisplayDate = new Date(newDate.getFullYear(), newDate.getMonth());
      
      if (newDisplayDate > maxDisplayDate) {
        return; // Don't navigate if out of range
      }
    }
    
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  const goToPreviousYear = () => {
    const newDate = new Date(currentYear - 1, currentMonth, 1);
    if (minDate) {
      const minDisplayDate = new Date(minDate.getFullYear(), minDate.getMonth());
      const newDisplayDate = new Date(newDate.getFullYear(), newDate.getMonth());
      if (newDisplayDate < minDisplayDate) {
        return; // Don't navigate if out of range
      }
    }
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth());
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    onDateChange?.(date);
  };

  // Handle year click
  const handleYearClick = (year: number) => {
    const newDate = new Date(year, currentMonth, 1);
    setCurrentDate(newDate);
    setShowYearPicker(false);
    onMonthChange?.(year, currentMonth);
  };

  // Handle month click
  const handleMonthClick = (month: number) => {
    const newDate = new Date(currentYear, month, 1);
    setCurrentDate(newDate);
    setShowMonthPicker(false);
    onMonthChange?.(currentYear, month);
  };

  // Check if navigation buttons should be disabled
  const canGoToPreviousMonth = useMemo(() => {
    if (!minDate) return true;
    const minDisplayDate = new Date(minDate.getFullYear(), minDate.getMonth());
    const currentDisplayDate = new Date(currentYear, currentMonth);
    return currentDisplayDate > minDisplayDate;
  }, [minDate, currentYear, currentMonth]);

  const canGoToNextMonth = useMemo(() => {
    if (!maxDate) return true;
    const maxDisplayDate = new Date(maxDate.getFullYear(), maxDate.getMonth());
    const currentDisplayDate = new Date(currentYear, currentMonth);
    return currentDisplayDate < maxDisplayDate;
  }, [maxDate, currentYear, currentMonth]);

  const canGoToNextYear = useMemo(() => {
    if (!maxDate) return true;
    return currentYear < maxDate.getFullYear();
  }, [maxDate, currentYear]);

  const canGoToPreviousYear = !minDate || currentYear > minDate.getFullYear();

  // Check if month should be disabled
  const isMonthDisabled = (monthIndex: number): boolean => {
    if (!minDate && !maxDate) return false;
    
    const minYear = minDate?.getFullYear();
    const minMonth = minDate?.getMonth();
    const maxYear = maxDate?.getFullYear();
    const maxMonth = maxDate?.getMonth();
    
    if (minYear !== undefined && minMonth !== undefined) {
      if (currentYear === minYear && monthIndex < minMonth) {
        return true;
      }
    }
    
    if (maxYear !== undefined && maxMonth !== undefined) {
      if (currentYear === maxYear && monthIndex > maxMonth) {
        return true;
      }
    }
    
    return false;
  };

  // Check if year should be disabled
  const isYearDisabled = (year: number): boolean => {
    if (!minDate && !maxDate) return false;
    
    const minYear = minDate?.getFullYear();
    const maxYear = maxDate?.getFullYear();
    
    if (minYear !== undefined && year < minYear) return true;
    if (maxYear !== undefined && year > maxYear) return true;
    
    return false;
  };

  return {
    // State
    currentDate,
    currentMonth,
    currentYear,
    showYearPicker,
    showMonthPicker,
    calendarDays,
    yearRangeList,
    
    // Refs
    yearScrollRef,
    monthButtonRef,
    calendarRef,
    
    // Actions
    setCurrentDate,
    setShowYearPicker,
    setShowMonthPicker,
    goToPreviousMonth,
    goToNextMonth,
    goToPreviousYear,
    goToNextYear,
    handleDateClick,
    handleYearClick,
    handleMonthClick,
    
    // Helpers
    isDateDisabled,
    isDateSelected,
    canGoToPreviousMonth,
    canGoToNextMonth,
    canGoToPreviousYear,
    canGoToNextYear,
    isMonthDisabled,
    isYearDisabled,
    
    // Constants
    MONTHS,
    DAYS,
  };
}

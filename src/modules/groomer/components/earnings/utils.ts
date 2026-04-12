export function formatRangeDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function startOfWeek(date: Date) {
  const nextDate = startOfDay(date);
  const day = nextDate.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + diff);
  return nextDate;
}

function endOfWeek(date: Date) {
  const nextDate = startOfWeek(date);
  nextDate.setDate(nextDate.getDate() + 6);
  return endOfDay(nextDate);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function getDateRangeForTimeframe(timeframe: string, referenceDate = new Date()) {
  const today = startOfDay(referenceDate);

  switch (timeframe) {
    case "Today":
      return {
        startDate: today,
        endDate: endOfDay(today),
      };
    case "This week":
      return {
        startDate: startOfWeek(today),
        endDate: endOfDay(today),
      };
    case "Last week": {
      const currentWeekStart = startOfWeek(today);
      const lastWeekReference = new Date(currentWeekStart);
      lastWeekReference.setDate(lastWeekReference.getDate() - 1);

      return {
        startDate: startOfWeek(lastWeekReference),
        endDate: endOfWeek(lastWeekReference),
      };
    }
    case "This month":
      return {
        startDate: startOfMonth(today),
        endDate: endOfDay(today),
      };
    case "Last month": {
      const lastMonthReference = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      return {
        startDate: startOfMonth(lastMonthReference),
        endDate: endOfMonth(lastMonthReference),
      };
    }
    default:
      return null;
  }
}

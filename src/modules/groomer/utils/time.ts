const API_TIME_PATTERN = /T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/;

function formatHourMinute(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatGroomerTimeLabel(value: string, fallback = ""): string {
  if (!value) return fallback;

  const apiTimeMatch = value.match(API_TIME_PATTERN);
  if (apiTimeMatch) {
    const hour = Number(apiTimeMatch[1]);
    const minute = Number(apiTimeMatch[2]);
    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return formatHourMinute(hour, minute);
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

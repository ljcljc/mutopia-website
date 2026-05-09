function formatHourMinute(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatGroomerTimeLabel(value: string, fallback = ""): string {
  if (!value) return fallback;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return formatHourMinute(parsed.getHours(), parsed.getMinutes());
}

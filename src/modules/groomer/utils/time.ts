function formatHourMinute(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function parseGroomerDateTime(value: string): Date | null {
  if (!value) return null;

  const localMatch = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (localMatch) {
    const [, year, month, day, hour, minute, second] = localMatch;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? 0),
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatGroomerTimeLabel(value: string, fallback = ""): string {
  if (!value) return fallback;

  const parsed = parseGroomerDateTime(value);
  if (!parsed) return value;

  return formatHourMinute(parsed.getHours(), parsed.getMinutes());
}

export function isGroomerDateTimeWithinNextHours(value: string, hours: number, now = new Date()): boolean {
  const parsed = parseGroomerDateTime(value);
  if (!parsed) return false;

  const diffMs = parsed.getTime() - now.getTime();
  return diffMs >= 0 && diffMs <= hours * 60 * 60 * 1000;
}

export function shouldShowStartTravel(value: string, now = new Date()): boolean {
  const parsed = parseGroomerDateTime(value);
  if (!parsed) return false;

  return parsed.getTime() <= now.getTime() || isGroomerDateTimeWithinNextHours(value, 2, now);
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

function parseApiDateTime(value?: string | null): Date | null {
  if (!value) return null;
  if (isLocalDateTimeString(value)) return parseLocalDateTime(value);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isLocalDateTimeString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?$/.test(value.trim());
}

function parseLocalDateTime(value: string): Date | null {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second ?? 0));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseLocalDate(value?: string | null): Date | null {
  if (!value) return null;

  const match = value.trim().match(/^(\d{4})[-.](\d{2})[-.](\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLocalDate(date: Date, separator = "."): string {
  return `${date.getFullYear()}${separator}${pad2(date.getMonth() + 1)}${separator}${pad2(date.getDate())}`;
}

function getStringField(source: object, keys: string[]): string {
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function getPeriodSuffix(slot: string, date?: Date | null): string {
  const normalized = slot.trim().toLowerCase();
  if (normalized === "morning" || normalized === "am") return "AM";
  if (normalized === "afternoon" || normalized === "pm" || normalized === "evening") return "PM";
  if (date) return date.getHours() >= 12 ? "PM" : "AM";
  return normalized ? normalized.toUpperCase() : "";
}

export function formatApiLocalDateTime(value?: string | null, fallback = ""): string {
  if (value && isLocalDateTimeString(value)) {
    const [datePart, timePart] = value.trim().split(/[ T]/);
    return `${datePart} at ${timePart.slice(0, 5)}`;
  }

  const parsed = parseApiDateTime(value);
  if (!parsed) return value || fallback;

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} at ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
}

export function addHoursToApiLocalDateTime(value?: string | null, hours = 1, fallback = ""): string {
  const parsed = parseApiDateTime(value);
  if (!parsed) return fallback;

  parsed.setHours(parsed.getHours() + hours);
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} at ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
}

export function toLocalDateTimeString(date: string, time: string): string {
  return `${date} ${time}`;
}

export function formatLocalDateTimeForApi(date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatPreferredTimeSlotLocal(
  slot: object,
  options: { includeWeekday?: boolean; dateSeparator?: "." | "-" } = {},
): string | null {
  const dateValue = getStringField(slot, ["date"]);
  const slotValue = getStringField(slot, ["slot"]);
  const localValue = getStringField(slot, ["datetime_local", "scheduled_time"]);
  const parsedLocal = localValue && isLocalDateTimeString(localValue) ? parseLocalDateTime(localValue) : null;
  const parsedDate = parsedLocal ?? parseLocalDate(dateValue);

  if (!parsedDate) return null;

  const dateLabel = options.includeWeekday
    ? `${WEEKDAYS[parsedDate.getDay()]}, ${formatLocalDate(parsedDate, options.dateSeparator ?? ".")}`
    : formatLocalDate(parsedDate, options.dateSeparator ?? ".");
  const periodSuffix = parsedLocal ? getPeriodSuffix("", parsedLocal) : getPeriodSuffix(slotValue);

  return periodSuffix ? `${dateLabel} ${periodSuffix}` : dateLabel;
}

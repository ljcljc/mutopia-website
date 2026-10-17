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

function serviceWallTimeInstant(value?: string | null, businessTimeZone?: string | null): Date | null {
  if (!value || !businessTimeZone) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: businessTimeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    });
    const target = Date.UTC(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    let instant = target;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const parts = formatter.formatToParts(new Date(instant));
      const number = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
      const displayed = Date.UTC(number("year"), number("month") - 1, number("day"), number("hour"), number("minute"));
      const difference = target - displayed;
      if (!difference) break;
      instant += difference;
    }
    return new Date(instant);
  } catch {
    return null;
  }
}

export function serviceTimeZoneLabel(value?: string | null, businessTimeZone?: string | null): string {
  const instant = serviceWallTimeInstant(value, businessTimeZone);
  if (!instant || !businessTimeZone) return "";
  const short = new Intl.DateTimeFormat("en-US", { timeZone: businessTimeZone, timeZoneName: "short" })
    .formatToParts(instant).find((part) => part.type === "timeZoneName")?.value ?? businessTimeZone;
  return short;
}

export function formatTimezoneChangeNotice(serviceZone?: string, viewerZone?: string, instantValue?: string): string {
  if (!serviceZone || !viewerZone || !instantValue) return "";
  const instant = new Date(instantValue);
  if (Number.isNaN(instant.getTime())) return "";
  try {
    const offsetMinutes = (zone: string): number | null => {
      const value = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" })
        .formatToParts(instant).find((part) => part.type === "timeZoneName")?.value ?? "";
      const match = value.match(/^GMT(?:(\+|-)(\d{1,2})(?::(\d{2}))?)?$/);
      if (!match) return null;
      return match[1] ? (match[1] === "+" ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3] ?? 0)) : 0;
    };
    const serviceOffset = offsetMinutes(serviceZone);
    const viewerOffset = offsetMinutes(viewerZone);
    if (serviceOffset === null || viewerOffset === null || serviceOffset === viewerOffset) return "";
    const zoneName = new Intl.DateTimeFormat("en-US", { timeZone: serviceZone, timeZoneName: "longGeneric" })
      .formatToParts(instant).find((part) => part.type === "timeZoneName")?.value;
    if (!zoneName) return "";
    const hours = Number((Math.abs(serviceOffset - viewerOffset) / 60).toFixed(2));
    const direction = serviceOffset > viewerOffset ? "+" : "-";
    return `Timezone Change: Next appointment is in ${zoneName} (${direction}${hours} hr).`;
  } catch {
    return "";
  }
}

export function formatApiServiceDateTime(value?: string | null, businessTimeZone?: string | null): string {
  const formatted = formatApiLocalDateTime(value);
  const zone = serviceTimeZoneLabel(value, businessTimeZone);
  return zone && formatted ? `${formatted} ${zone}` : formatted;
}

export function serviceNowParts(businessTimeZone?: string | null, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: businessTimeZone || "America/Vancouver",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(now);
  const number = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return { year: number("year"), month: number("month"), day: number("day"), hour: number("hour"), minute: number("minute") };
}

export function formatLocalDateTimeForApi(date = new Date()): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function getLocalOffsetMinutes(date = new Date()): number {
  return -date.getTimezoneOffset();
}

export function formatNotificationDateTime(value?: string | null, fallback = ""): string {
  const parsed = parseApiDateTime(value);
  if (!parsed) return value || fallback;

  const now = new Date();
  const isCurrentYear = parsed.getFullYear() === now.getFullYear();
  const dateLabel = parsed.toLocaleDateString("en-US", isCurrentYear
    ? { month: "short", day: "numeric" }
    : { year: "numeric", month: "short", day: "numeric" });
  const timeLabel = parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateLabel}, ${timeLabel}`;
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

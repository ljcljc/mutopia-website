function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function parseApiDateTime(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatApiLocalDateTime(value?: string | null, fallback = ""): string {
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

export function toUtcIsoFromLocalDateTime(date: string, time: string): string | null {
  const parsed = new Date(`${date}T${time}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

const CANADIAN_POSTAL_CODE_REGEX = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

export function formatCanadianPostalCodeInput(value: string): string {
  const compact = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
  if (compact.length <= 3) return compact;
  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

export function normalizeCanadianPostalCode(value: string): string {
  const compact = value.replace(/\s+/g, "").toUpperCase();
  if (compact.length !== 6) return value.trim().toUpperCase();
  return `${compact.slice(0, 3)} ${compact.slice(3)}`;
}

export function isValidCanadianPostalCode(value: string): boolean {
  return CANADIAN_POSTAL_CODE_REGEX.test(value.trim());
}

export function getCanadianPostalCodeError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Postal code is required";
  if (!isValidCanadianPostalCode(trimmed)) {
    return "Enter a valid postal code";
  }
  return "";
}

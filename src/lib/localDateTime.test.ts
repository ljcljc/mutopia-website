import { describe, expect, it } from "vitest";
import {
  addHoursToApiLocalDateTime,
  formatApiLocalDateTime,
  formatLocalDateTimeForApi,
  getLocalOffsetMinutes,
  formatPreferredTimeSlotLocal,
} from "./localDateTime";

function expectedLocalLabel(value: string) {
  const parsed = new Date(value);
  const pad2 = (part: number) => String(part).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} at ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
}

describe("local API date time formatting", () => {
  it("formats API UTC instants in the browser local timezone", () => {
    const value = "2026-04-26T01:30:00Z";
    expect(formatApiLocalDateTime(value)).toBe(expectedLocalLabel(value));
  });

  it("adds hours after converting to the local timezone", () => {
    const value = "2026-04-26T01:30:00Z";
    const expected = new Date(value);
    expected.setHours(expected.getHours() + 1);
    expect(addHoursToApiLocalDateTime(value, 1)).toBe(expectedLocalLabel(expected.toISOString()));
  });

  it("formats API local date time strings without timezone conversion", () => {
    expect(formatApiLocalDateTime("2026-05-17 08:00")).toBe("2026-05-17 at 08:00");
    expect(formatApiLocalDateTime("2026-05-17 08:00:30")).toBe("2026-05-17 at 08:00");
  });

  it("formats the browser local date time for API query parameters", () => {
    expect(formatLocalDateTimeForApi(new Date(2026, 4, 24, 0, 6))).toBe("2026-05-24 00:06");
  });

  it("returns the browser local offset in minutes", () => {
    const date = new Date(2026, 4, 24, 0, 6);
    expect(getLocalOffsetMinutes(date)).toBe(-date.getTimezoneOffset());
  });

  it("formats preferred booking slots from local date fields without UTC date shifting", () => {
    expect(formatPreferredTimeSlotLocal({ date: "2026-05-16", slot: "afternoon" }, { includeWeekday: true })).toBe(
      "Saturday, 2026.05.16 PM",
    );
  });

  it("formats preferred booking slots from local date time strings", () => {
    expect(
      formatPreferredTimeSlotLocal({
        date: "2026-05-16",
        slot: "pm",
        datetime_local: "2026-05-16 13:30",
      }),
    ).toBe("2026.05.16 PM");
  });

  it("formats preferred booking slots from local date time strings with seconds", () => {
    expect(
      formatPreferredTimeSlotLocal({
        date: "2026-05-16",
        datetime_local: "2026-05-16 08:30:15",
      }),
    ).toBe("2026.05.16 AM");
  });
});

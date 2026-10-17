import { describe, expect, it } from "vitest";
import {
  addHoursToApiLocalDateTime,
  formatApiLocalDateTime,
  formatNotificationDateTime,
  formatLocalDateTimeForApi,
  getLocalOffsetMinutes,
  formatPreferredTimeSlotLocal,
  formatApiServiceDateTime,
  formatTimezoneChangeNotice,
  serviceNowParts,
} from "./localDateTime";

function expectedLocalLabel(value: string) {
  const parsed = new Date(value);
  const pad2 = (part: number) => String(part).padStart(2, "0");
  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} at ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
}

describe("local API date time formatting", () => {
  it("keeps a Vancouver appointment at 11:00 and uses the date's DST label", () => {
    expect(formatApiServiceDateTime("2026-07-01 11:00", "America/Vancouver")).toBe("2026-07-01 at 11:00 PDT (UTC-7)");
    expect(formatApiServiceDateTime("2026-01-01 11:00", "America/Vancouver")).toBe("2026-01-01 at 11:00 PST (UTC-8)");
  });

  it("calculates today from the service area's timezone", () => {
    expect(serviceNowParts("America/Vancouver", new Date("2026-07-02T03:00:00Z")))
      .toEqual({ year: 2026, month: 7, day: 1, hour: 20, minute: 0 });
  });

  it("uses the appointment date's offset for the cross-timezone notice", () => {
    expect(formatTimezoneChangeNotice("America/Denver", "America/Vancouver", "2026-10-17T20:00:00Z"))
      .toBe("Timezone Change: Next appointment is in Mountain Time (+1 hr).");
    expect(formatTimezoneChangeNotice("America/Denver", "America/Vancouver", "2026-01-17T20:00:00Z"))
      .toBe("Timezone Change: Next appointment is in Mountain Time (+1 hr).");
    expect(formatTimezoneChangeNotice("America/Denver", "America/Edmonton", "2026-10-17T20:00:00Z"))
      .toBe("");
  });

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

  it("formats notification timestamps in the browser local timezone", () => {
    const value = "2026-04-26T01:30:00Z";
    const parsed = new Date(value);
    const now = new Date();
    const expectedDate = parsed.toLocaleDateString("en-US", parsed.getFullYear() === now.getFullYear()
      ? { month: "short", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" });
    const expectedTime = parsed.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    expect(formatNotificationDateTime(value)).toBe(`${expectedDate}, ${expectedTime}`);
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

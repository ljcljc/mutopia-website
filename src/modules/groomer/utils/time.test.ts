import { describe, expect, it } from "vitest";
import {
  formatGroomerTimeLabel,
  isGroomerDateTimeWithinNextHours,
  shouldShowStartTravel,
} from "./time";

describe("formatGroomerTimeLabel", () => {
  it("formats API UTC instants in the browser local timezone", () => {
    const value = "2026-04-26T01:30:00Z";
    const expected = new Date(value);
    const hour = expected.getHours();
    const period = hour >= 12 ? "PM" : "AM";
    expect(formatGroomerTimeLabel(value)).toBe(`${hour % 12 || 12}:30 ${period}`);
  });

  it("keeps invalid values readable", () => {
    expect(formatGroomerTimeLabel("Pending")).toBe("Pending");
  });

  it("formats local date-time strings with seconds", () => {
    expect(formatGroomerTimeLabel("2026-05-16 14:05:30")).toBe("2:05 PM");
  });
});

describe("groomer appointment time windows", () => {
  const now = new Date(2026, 4, 16, 12, 0, 0);

  it("matches appointments within the next 24 hours", () => {
    expect(isGroomerDateTimeWithinNextHours("2026-05-17 11:59", 24, now)).toBe(true);
    expect(isGroomerDateTimeWithinNextHours("2026-05-17 12:01", 24, now)).toBe(false);
  });

  it("shows Start Travel from two hours before the appointment", () => {
    expect(shouldShowStartTravel("2026-05-16 14:00", now)).toBe(true);
    expect(shouldShowStartTravel("2026-05-16 14:01", now)).toBe(false);
  });

  it("keeps past appointments out of next-hours matching but allows Start Travel", () => {
    expect(isGroomerDateTimeWithinNextHours("2026-05-16 11:59", 24, now)).toBe(false);
    expect(shouldShowStartTravel("2026-05-16 11:59", now)).toBe(true);
  });
});

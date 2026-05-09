import { describe, expect, it } from "vitest";
import { formatGroomerTimeLabel } from "./time";

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
});

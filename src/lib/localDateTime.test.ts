import { describe, expect, it } from "vitest";
import { addHoursToApiLocalDateTime, formatApiLocalDateTime, toUtcIsoFromLocalDateTime } from "./localDateTime";

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

  it("converts a selected local date and time to a UTC ISO instant", () => {
    expect(toUtcIsoFromLocalDateTime("2026-04-26", "09:30")).toBe(new Date("2026-04-26T09:30:00").toISOString());
  });
});

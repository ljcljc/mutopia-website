import { describe, expect, it } from "vitest";
import { formatGroomerTimeLabel } from "./time";

describe("formatGroomerTimeLabel", () => {
  it("formats API datetime as wall-clock time without browser timezone conversion", () => {
    expect(formatGroomerTimeLabel("2026-04-26T09:30:00+00:00")).toBe("9:30 AM");
  });

  it("keeps invalid values readable", () => {
    expect(formatGroomerTimeLabel("Pending")).toBe("Pending");
  });
});

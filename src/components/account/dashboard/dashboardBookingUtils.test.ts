import { describe, expect, it, vi } from "vitest";
import type { BookingListOut } from "@/lib/api";
import { isBookingAbnormal, selectCurrentDashboardBooking } from "./dashboardBookingUtils";

function makeBooking(overrides: Partial<BookingListOut>): BookingListOut {
  return {
    id: 1,
    status: "pending",
    pet_name: "Mochi",
    service_name: "Bath",
    scheduled_time: "2026-05-30T10:00:00Z",
    ...overrides,
  };
}

describe("selectCurrentDashboardBooking", () => {
  it("prioritizes the nearest started unfinished booking over a not-started booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "confirmed", scheduled_time: "2026-05-30T09:00:00Z" }),
      makeBooking({ id: 2, status: "in_progress", scheduled_time: "2026-05-30T15:00:00Z" }),
    ]);

    expect(result?.id).toBe(2);

    vi.useRealTimers();
  });

  it("falls back to the nearest not-started booking when no started booking exists", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "confirmed", scheduled_time: "2026-05-31T06:00:00Z" }),
      makeBooking({ id: 2, status: "confirmed", scheduled_time: "2026-05-30T10:00:00Z" }),
      makeBooking({ id: 3, status: "pending", scheduled_time: "2026-05-30T09:00:00Z" }),
    ]);

    expect(result?.id).toBe(3);

    vi.useRealTimers();
  });

  it("returns null when there is no eligible booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "completed" }),
      makeBooking({ id: 2, status: "terminated" }),
      makeBooking({ id: 3, status: "canceled" }),
    ]);

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("excludes an unfinished booking more than 72 hours after its scheduled time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-02T08:01:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "checked_in", scheduled_time: "2026-05-30T08:00:00Z" }),
    ]);

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("keeps a recent pending health report eligible", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "pending_report", scheduled_time: "2026-05-30T10:00:00Z" }),
    ]);

    expect(result?.id).toBe(1);

    vi.useRealTimers();
  });

  it("marks an unfinished booking older than 72 hours as abnormal", () => {
    expect(
      isBookingAbnormal(
        { status: "checked_in", scheduled_time: "2026-05-30T08:00:00Z" },
        new Date("2026-06-02T08:01:00Z"),
      ),
    ).toBe(true);
  });

});

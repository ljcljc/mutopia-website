import { describe, expect, it, vi } from "vitest";
import type { BookingListOut } from "@/lib/api";
import { selectCurrentDashboardBooking } from "./dashboardBookingUtils";

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
  it("prioritizes active in-service statuses over confirmed bookings", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "confirmed", scheduled_time: "2026-05-30T09:00:00Z" }),
      makeBooking({ id: 2, status: "traveling", scheduled_time: "2026-05-30T15:00:00Z" }),
    ]);

    expect(result?.id).toBe(2);

    vi.useRealTimers();
  });

  it("falls back to the nearest confirmed booking when there is no active booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "confirmed", scheduled_time: "2026-05-31T06:00:00Z" }),
      makeBooking({ id: 2, status: "confirmed", scheduled_time: "2026-05-30T10:00:00Z" }),
      makeBooking({ id: 3, status: "pending", scheduled_time: "2026-05-30T09:00:00Z" }),
    ]);

    expect(result?.id).toBe(2);

    vi.useRealTimers();
  });

  it("returns null when there is no active or near confirmed booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "pending" }),
      makeBooking({ id: 2, status: "awaiting_client_confirmation" }),
      makeBooking({ id: 3, status: "confirmed", scheduled_time: "2026-06-02T08:00:00Z" }),
    ]);

    expect(result).toBeNull();

    vi.useRealTimers();
  });
});

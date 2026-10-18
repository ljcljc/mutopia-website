import { describe, expect, it, vi } from "vitest";
import type { BookingListOut } from "@/lib/api";
import { getStatusBadgeConfig, isBookingAbnormal, selectCurrentDashboardBooking } from "./dashboardBookingUtils";

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
  it("shows a pending checkup adjustment as a checked-in current booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const booking = makeBooking({ id: 2, status: "checkup_adjustment_pending", scheduled_time: "2026-05-30T09:00:00Z" });
    expect(selectCurrentDashboardBooking([makeBooking({ id: 1, status: "confirmed" }), booking])?.id).toBe(2);
    expect(getStatusBadgeConfig(booking.status)).toEqual({ label: "Groomer checked in", tone: "purple" });

    vi.useRealTimers();
  });

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

  it("shows the latest finished booking when there is no active booking", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "completed", status_updated_at: "2026-05-29T10:00:00Z" }),
      makeBooking({ id: 2, status: "terminated", status_updated_at: "2026-05-30T07:00:00Z" }),
      makeBooking({ id: 3, status: "canceled", status_updated_at: "2026-05-28T10:00:00Z" }),
    ]);

    expect(result?.id).toBe(2);

    vi.useRealTimers();
  });

  it("prioritizes payment over future bookings and finished bookings", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));

    const result = selectCurrentDashboardBooking([
      makeBooking({ id: 1, status: "completed" }),
      makeBooking({ id: 2, status: "confirmed" }),
      makeBooking({ id: 3, status: "awaiting_payment" }),
    ]);

    expect(result?.id).toBe(3);

    vi.useRealTimers();
  });

  it("uses refund and report facts for the requested Hero labels", () => {
    expect(getStatusBadgeConfig("pending_report")).toEqual({ label: "Service completed", tone: "orange" });
    expect(getStatusBadgeConfig("pending_report", "handover_checkout")).toEqual({ label: "Handover & Checkout", tone: "purple" });
    expect(getStatusBadgeConfig("terminated", null, { refunded_amount: "10.00" }).label).toBe("Service terminated and refunded");
    expect(getStatusBadgeConfig("terminated").label).toBe("Service terminated");
    expect(getStatusBadgeConfig("canceled", null, { refunded_amount: "10.00" }).label).toBe("Service canceled and refunded");
    expect(getStatusBadgeConfig("canceled").label).toBe("Service canceled");
    expect(getStatusBadgeConfig("refunded").label).toBe("Service canceled and refunded");
    expect(getStatusBadgeConfig("completed", "service_completed", { has_health_report: true }).label).toBe("Service completed and report filled");
    expect(getStatusBadgeConfig("completed", "service_completed", { has_health_report: false }).label).toBe("Service completed!");
    expect(getStatusBadgeConfig("reviewed", null, { has_health_report: true }).label).toBe("Service completed and report filled");
    expect(getStatusBadgeConfig("awaiting_payment").label).toBe("Waiting for payment");
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

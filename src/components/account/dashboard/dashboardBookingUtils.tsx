import type { BookingListOut } from "@/lib/api";
import { Icon } from "@/components/common/Icon";

export type BookingStatusTone = "orange" | "green" | "purple" | "outlined";

export function normalizeBookingStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function getStatusBadgeConfig(status: string): { label: string; tone: BookingStatusTone } {
  const normalized = normalizeBookingStatus(status);

  switch (normalized) {
    case "pending":
      return { label: "Waiting for groomer match", tone: "orange" };
    case "awaiting_client_confirmation":
      return { label: "Waiting for your confirmation", tone: "orange" };
    case "confirmed":
      return { label: "Ready for service", tone: "green" };
    case "traveling":
    case "travel_started":
    case "en_route":
    case "on_the_way":
      return { label: "Traveling", tone: "green" };
    case "checked_in":
      return { label: "Groomer checked in", tone: "purple" };
    case "in_progress":
      return { label: "Service started", tone: "purple" };
    case "awaiting_payment":
      return { label: "Waiting for payment", tone: "orange" };
    case "awaiting_final_payment":
      return { label: "Waiting for final payment", tone: "orange" };
    case "pending_report":
      return { label: "Health report pending", tone: "orange" };
    case "completed":
    case "reviewed":
      return { label: "Service completed", tone: "purple" };
    case "terminated":
      return { label: "Service terminated", tone: "outlined" };
    case "canceled":
    case "cancelled":
    case "booking_canceled":
      return { label: "Service canceled", tone: "outlined" };
    case "refunded":
      return { label: "Refunded", tone: "outlined" };
    default:
      return { label: status || "Waiting for groomer match", tone: "orange" };
  }
}

function parseScheduledTime(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isStartedUnfinishedStatus(status: string): boolean {
  return [
    "traveling",
    "travel_started",
    "en_route",
    "on_the_way",
    "checked_in",
    "in_progress",
    "pending_report",
    "awaiting_final_payment",
  ].includes(normalizeBookingStatus(status));
}

function isNotStartedStatus(status: string): boolean {
  return ["awaiting_client_confirmation", "confirmed", "pending"].includes(
    normalizeBookingStatus(status),
  );
}

export function isBookingAbnormal(
  booking: Pick<BookingListOut, "status" | "scheduled_time">,
  now = new Date(),
): boolean {
  const unfinished = isStartedUnfinishedStatus(booking.status) || isNotStartedStatus(booking.status);
  const scheduledTime = parseScheduledTime(booking.scheduled_time);
  if (!unfinished || !scheduledTime || scheduledTime.getTime() >= now.getTime()) return false;

  return now.getTime() - scheduledTime.getTime() > 72 * 60 * 60 * 1000;
}

function getCurrentBookingPriority(booking: BookingListOut, now: Date): number | null {
  if (isBookingAbnormal(booking, now)) return null;

  if (isStartedUnfinishedStatus(booking.status)) return 0;
  if (isNotStartedStatus(booking.status)) return 1;

  return null;
}

export function selectCurrentDashboardBooking(bookings: BookingListOut[]): BookingListOut | null {
  const now = new Date();

  const sorted = bookings
    .filter((booking) => getCurrentBookingPriority(booking, now) !== null)
    .sort((left, right) => {
      const leftPriority = getCurrentBookingPriority(left, now) ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = getCurrentBookingPriority(right, now) ?? Number.MAX_SAFE_INTEGER;

      if (leftPriority !== rightPriority) return leftPriority - rightPriority;

      const leftTime = parseScheduledTime(left.scheduled_time)?.getTime();
      const rightTime = parseScheduledTime(right.scheduled_time)?.getTime();

      const leftDistance = leftTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(leftTime - now.getTime());
      const rightDistance = rightTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(rightTime - now.getTime());

      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      return (leftTime ?? Number.MAX_SAFE_INTEGER) - (rightTime ?? Number.MAX_SAFE_INTEGER);
    });

  return sorted[0] ?? null;
}

export function StatusBadge({ status, scheduledTime }: { status: string; scheduledTime?: string | null }) {
  const abnormal = isBookingAbnormal({ status, scheduled_time: scheduledTime });
  const { label, tone } = abnormal
    ? { label: "Service issue", tone: "outlined" as BookingStatusTone }
    : getStatusBadgeConfig(status);

  if (tone === "green") {
    return (
      <div className="inline-flex w-fit items-center justify-center rounded-[12px] bg-[#DCFCE7] px-[12px] py-[5px]">
        <Icon name="check-green" size={12} className="mr-1 text-[#00A63E]" />
        <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#00A63E]">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "purple") {
    return (
      <div className="inline-flex h-6 w-fit items-center rounded-[12px] bg-[#633479] px-[12px] py-[5px]">
        <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-white">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "outlined") {
    return (
      <div className="inline-flex h-6 w-fit items-center rounded-[12px] border border-[#4C4C4C] bg-white px-[9px] py-[5px]">
        <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4C4C4C]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex h-6 w-fit items-center rounded-[12px] bg-[#DE6A07] px-[12px] py-[5px]">
      <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-white">
        {label}
      </span>
    </div>
  );
}

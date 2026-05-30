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

function isActiveCurrentBookingStatus(status: string): boolean {
  return [
    "traveling",
    "travel_started",
    "en_route",
    "on_the_way",
    "checked_in",
    "in_progress",
    "awaiting_final_payment",
    "completed",
    "reviewed",
  ].includes(normalizeBookingStatus(status));
}

function getCurrentBookingPriority(booking: BookingListOut, now: Date): number | null {
  const normalizedStatus = normalizeBookingStatus(booking.status);
  const scheduledTime = parseScheduledTime(booking.scheduled_time);

  if (isActiveCurrentBookingStatus(normalizedStatus)) return 0;
  if (normalizedStatus !== "confirmed" || !scheduledTime) return null;

  if (scheduledTime.getTime() <= now.getTime()) return 1;

  const within24Hours = scheduledTime.getTime() - now.getTime() <= 24 * 60 * 60 * 1000;
  return within24Hours ? 2 : null;
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

      if (leftPriority === 1 || leftPriority === 2) {
        return (leftTime ?? Number.MAX_SAFE_INTEGER) - (rightTime ?? Number.MAX_SAFE_INTEGER);
      }

      const leftDistance = leftTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(leftTime - now.getTime());
      const rightDistance = rightTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(rightTime - now.getTime());

      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      return (leftTime ?? Number.MAX_SAFE_INTEGER) - (rightTime ?? Number.MAX_SAFE_INTEGER);
    });

  return sorted[0] ?? null;
}

export function StatusBadge({ status }: { status: string }) {
  const { label, tone } = getStatusBadgeConfig(status);

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

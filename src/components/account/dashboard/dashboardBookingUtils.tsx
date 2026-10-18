import type { BookingListOut } from "@/lib/api";
import { Icon } from "@/components/common/Icon";
import { CheckCircleIcon } from "lucide-react";

export type BookingStatusTone = "orange" | "green" | "on_the_way" | "purple" | "outlined";

export function normalizeBookingStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function getStatusBadgeConfig(
  status: string,
  heroStage?: "handover_checkout" | "service_completed" | null,
  booking?: Pick<BookingListOut, "has_health_report" | "refunded_amount">,
): { label: string; tone: BookingStatusTone } {
  const normalized = normalizeBookingStatus(status);
  const hasRefund = Number(booking?.refunded_amount ?? 0) > 0;

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
      return { label: "Groomer is on the way", tone: "on_the_way" };
    case "checked_in":
    case "checkup_adjustment_pending":
      return { label: "Groomer checked in", tone: "purple" };
    case "in_progress":
      return { label: "Service started", tone: "purple" };
    case "awaiting_payment":
      return { label: "Waiting for payment", tone: "orange" };
    case "pending_report":
      if (heroStage === "handover_checkout") return { label: "Handover & Checkout", tone: "purple" };
      return { label: "Service completed", tone: "orange" };
    case "waiting_tip":
      return { label: "Handover & Checkout", tone: "purple" };
    case "completed":
      return { label: booking?.has_health_report ? "Service completed and report filled" : "Service completed!", tone: "purple" };
    case "reviewed":
      return { label: booking?.has_health_report ? "Service completed and report filled" : "Service completed", tone: "purple" };
    case "terminated":
    case "terminated_and_refunded":
      return { label: hasRefund || normalized === "terminated_and_refunded" ? "Service terminated and refunded" : "Service terminated", tone: "outlined" };
    case "canceled":
    case "cancelled":
    case "booking_canceled":
    case "canceled_and_refunded":
    case "cancelled_and_refunded":
      return { label: hasRefund || normalized.includes("refunded") ? "Service canceled and refunded" : "Service canceled", tone: "outlined" };
    case "refunded":
      return { label: "Service canceled and refunded", tone: "outlined" };
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
    "checkup_adjustment_pending",
    "in_progress",
    "pending_report",
  ].includes(normalizeBookingStatus(status));
}

function isNotStartedStatus(status: string): boolean {
  return ["awaiting_client_confirmation", "confirmed", "pending"].includes(
    normalizeBookingStatus(status),
  );
}

export function isBookingAbnormal(
  booking: Pick<BookingListOut, "status" | "scheduled_time"> & Pick<BookingListOut, "scheduled_time_utc">,
  now = new Date(),
): boolean {
  const unfinished = isStartedUnfinishedStatus(booking.status) || isNotStartedStatus(booking.status);
  const scheduledTime = parseScheduledTime(booking.scheduled_time_utc || booking.scheduled_time);
  if (!unfinished || !scheduledTime || scheduledTime.getTime() >= now.getTime()) return false;

  return now.getTime() - scheduledTime.getTime() > 72 * 60 * 60 * 1000;
}

function getCurrentBookingPriority(booking: BookingListOut, now: Date): number | null {
  if (isBookingAbnormal(booking, now)) return null;

  if (isStartedUnfinishedStatus(booking.status)) return 0;
  const status = normalizeBookingStatus(booking.status);
  if (status === "awaiting_payment") return 1;
  if (isNotStartedStatus(status)) return 2;
  if (status === "waiting_tip") return 3;
  if (["completed", "reviewed", "terminated", "terminated_and_refunded", "canceled", "cancelled", "booking_canceled", "canceled_and_refunded", "cancelled_and_refunded", "refunded"].includes(status)) return 4;

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

      if (leftPriority === 4) {
        const leftUpdated = parseScheduledTime(left.status_updated_at || left.scheduled_time_utc || left.scheduled_time)?.getTime() ?? 0;
        const rightUpdated = parseScheduledTime(right.status_updated_at || right.scheduled_time_utc || right.scheduled_time)?.getTime() ?? 0;
        return rightUpdated - leftUpdated || right.id - left.id;
      }

      const leftTime = parseScheduledTime(left.scheduled_time_utc || left.scheduled_time)?.getTime();
      const rightTime = parseScheduledTime(right.scheduled_time_utc || right.scheduled_time)?.getTime();

      const leftDistance = leftTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(leftTime - now.getTime());
      const rightDistance = rightTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(rightTime - now.getTime());

      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      return (leftTime ?? Number.MAX_SAFE_INTEGER) - (rightTime ?? Number.MAX_SAFE_INTEGER);
    });

  return sorted[0] ?? null;
}

export function StatusBadge({
  status,
  heroStage,
  scheduledTime,
  hasHealthReport,
  refundedAmount,
  monochrome = false,
}: {
  status: string;
  heroStage?: "handover_checkout" | "service_completed" | null;
  scheduledTime?: string | null;
  hasHealthReport?: boolean;
  refundedAmount?: number | string;
  monochrome?: boolean;
}) {
  const abnormal = isBookingAbnormal({ status, scheduled_time: scheduledTime });
  const { label, tone } = abnormal
    ? { label: "Service issue", tone: "outlined" as BookingStatusTone }
    : getStatusBadgeConfig(status, heroStage, { has_health_report: hasHealthReport, refunded_amount: refundedAmount });

  if (monochrome && tone === "green") {
    return (
      <div className="inline-flex min-h-6 max-w-full items-center gap-1 rounded-xl bg-[#E8FAE9] px-3 py-1 text-[#427D3E]">
        <CheckCircleIcon className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 break-words font-comfortaa text-[10px] font-bold leading-[14px]">{label}</span>
      </div>
    );
  }

  if (monochrome) {
    return (
      <div className="inline-flex min-h-6 max-w-full items-center gap-1 rounded-xl border border-[#4C4C4C] px-3 py-1 text-[#4C4C4C]">
        {tone === "on_the_way" && <CheckCircleIcon className="size-3.5 shrink-0" aria-hidden="true" />}
        <span className="min-w-0 break-words font-comfortaa text-[10px] font-bold leading-[14px]">{label}</span>
      </div>
    );
  }

  if (tone === "on_the_way") {
    return (
      <div className="inline-flex h-6 w-fit items-center gap-1 rounded-xl bg-[#E8FAE9] px-3 py-1">
        <CheckCircleIcon className="size-3.5 text-[#427D3E]" aria-hidden="true" />
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#427D3E]">
          {label}
        </span>
      </div>
    );
  }

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
      <div className="inline-flex min-h-6 max-w-full items-center rounded-[12px] bg-[#633479] px-[12px] py-[5px]">
        <span className="min-w-0 break-words font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-white">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "outlined") {
    return (
      <div className="inline-flex min-h-6 max-w-full items-center rounded-[12px] border border-[#4C4C4C] bg-white px-[9px] py-[5px]">
        <span className="min-w-0 break-words font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4C4C4C]">
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

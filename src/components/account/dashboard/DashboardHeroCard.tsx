import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { formatApiServiceDateTime } from "@/lib/localDateTime";
import { useAccountStore } from "../accountStore";
import { getBookingDetail } from "@/lib/api";
import { getCheckUpAdjustmentBeforeTax } from "@/lib/bookingPricing";
import { selectCurrentDashboardBooking, StatusBadge } from "./dashboardBookingUtils";

/**
 * 解析地址字符串
 */
function parseAddress(address?: string | null): { line1: string; line2: string } {
  if (!address) return { line1: "-", line2: "" };
  
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return {
      line1: parts[0],
      line2: parts.slice(1).join(", "),
    };
  }
  
  return { line1: address, line2: "" };
}

export default function DashboardHeroCard() {
  const navigate = useNavigate();
  const { upcomingBookings, historyBookings, fetchHistoryBookings } = useAccountStore();
  const hasFetchedHistoryRef = useRef(false);
  const [checkUpAmount, setCheckUpAmount] = useState<{ bookingId: number; amount: number; total: number; status: string } | null>(null);

  useEffect(() => {
    if (hasFetchedHistoryRef.current) return;
    hasFetchedHistoryRef.current = true;
    fetchHistoryBookings().catch((error) => {
      console.error("Error fetching history bookings for hero:", error);
    });
  }, [fetchHistoryBookings]);

  const currentBooking = useMemo(
    () => selectCurrentDashboardBooking([...upcomingBookings, ...historyBookings]),
    [upcomingBookings, historyBookings]
  );
  const currentBookingId = currentBooking?.id;
  const currentBookingStatus = currentBooking?.status;

  useEffect(() => {
    if (currentBookingId === undefined || currentBookingStatus !== "checkup_adjustment_pending") return;
    let active = true;
    getBookingDetail(currentBookingId).then((detail) => {
      const adjustment = detail.adjustments?.find(
        (item) => item.kind === "check_up" && ["pending", "approved", "refund_pending"].includes(item.status),
      );
      if (active && adjustment) {
        setCheckUpAmount({
          bookingId: currentBookingId,
          amount: getCheckUpAdjustmentBeforeTax(adjustment.amount, detail.gst_amount, adjustment.gst_amount),
          total: Number(adjustment.amount),
          status: adjustment.status,
        });
      }
    }).catch((error) => console.error("Failed to load check-in adjustment:", error));
    return () => { active = false; };
  }, [currentBookingId, currentBookingStatus]);

  if (!currentBooking) {
    return null;
  }

  const petName = currentBooking.pet_name || "-";
  const dateTime = formatApiServiceDateTime(currentBooking.scheduled_time, currentBooking.business_timezone);
  const address = parseAddress(currentBooking.address);

  return (
    <div className="rounded-xl bg-[#E2FFE8] p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div
        className="flex cursor-pointer flex-col items-start gap-3 rounded-[14px] border border-[#4A5565] p-[13px] transition-colors duration-200 hover:bg-white/40 sm:flex-row sm:items-center sm:justify-between"
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/account/bookings/${currentBooking.id}`)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            navigate(`/account/bookings/${currentBooking.id}`);
          }
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex max-w-[320px] flex-col gap-2">
            <p className="font-comfortaa font-bold text-[16px] leading-[28px] text-[#8B6357]">
              {petName}
            </p>
            <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
              {dateTime}
            </p>
          </div>
          <div className="flex max-w-[180px] flex-col">
            <p className="font-comfortaa font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
              {address.line1}
            </p>
            {address.line2 && (
              <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
                {address.line2}
              </p>
            )}
          </div>
          {checkUpAmount?.bookingId === currentBooking.id && currentBooking.status === "checkup_adjustment_pending" && (
            <p className="font-comfortaa text-[12.25px] text-[#4A3C2A]">
              Check-in adjustment: {checkUpAmount.amount < 0 ? "Refund" : "To pay"} ${Math.abs(checkUpAmount.amount).toFixed(2)} plus tax = ${Math.abs(checkUpAmount.total).toFixed(2)}
            </p>
          )}
        </div>
        <div className="flex w-full min-w-0 items-center justify-between gap-1.5 sm:ml-3 sm:w-auto sm:shrink-0 sm:justify-start">
          <StatusBadge
            monochrome
            status={currentBooking.status}
            heroStage={currentBooking.hero_stage}
            scheduledTime={currentBooking.scheduled_time_utc || currentBooking.scheduled_time}
            hasHealthReport={currentBooking.has_health_report}
            refundedAmount={currentBooking.refunded_amount}
            adjustmentStatus={checkUpAmount?.bookingId === currentBooking.id ? checkUpAmount.status : undefined}
          />
          <Icon name="nav-next" className="size-4 text-[#99A1AF]" />
        </div>
      </div>
    </div>
  );
}

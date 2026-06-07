import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { formatApiLocalDateTime } from "@/lib/localDateTime";
import { useAccountStore } from "../accountStore";
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
  const { upcomingBookings } = useAccountStore();

  const currentBooking = useMemo(
    () => selectCurrentDashboardBooking(upcomingBookings),
    [upcomingBookings]
  );

  if (!currentBooking) {
    return null;
  }

  const petName = currentBooking.pet_name || "-";
  const dateTime = formatApiLocalDateTime(currentBooking.scheduled_time);
  const address = parseAddress(currentBooking.address);

  return (
    <div className="rounded-xl bg-[#E2FFE8] p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div
        className="flex cursor-pointer items-center justify-between rounded-[14px] border border-[#4A5565] p-[13px] transition-colors duration-200 hover:bg-white/40"
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
          <div className="flex max-w-[180px] flex-col gap-2">
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
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-1.5">
          <StatusBadge status={currentBooking.status} />
          <Icon name="nav-next" className="size-4 text-[#99A1AF]" />
        </div>
      </div>
    </div>
  );
}

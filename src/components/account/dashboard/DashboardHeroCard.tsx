import { useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "../accountStore";

/**
 * 格式化日期时间显示（YYYY-MM-DDTHH:mm:ss -> YYYY-MM-DD at HH:mm）
 */
function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} at ${hours}H`;
  } catch {
    return dateString;
  }
}

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
  const { upcomingBookings } = useAccountStore();

  // 找到最近的 checked in 预约（从 upcoming 中查找）
  const checkedInBooking = useMemo(() => {
    const checkedInBookings = upcomingBookings.filter((booking) => {
      const statusLower = booking.status.toLowerCase();
      return statusLower.includes("checked_in") || statusLower === "checked_in";
    });

    if (checkedInBookings.length === 0) return null;

    // 按 scheduled_time 排序，选择最近的（时间最晚的）
    return checkedInBookings.sort((a, b) => {
      if (!a.scheduled_time) return 1;
      if (!b.scheduled_time) return -1;
      return new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime();
    })[0];
  }, [upcomingBookings]);

  // 如果没有 checked in 的预约，不显示卡片
  if (!checkedInBooking) {
    return null;
  }

  const petName = checkedInBooking.pet_name || "-";
  const dateTime = formatDateTime(checkedInBooking.scheduled_time);
  const address = parseAddress(checkedInBooking.address);

  return (
    <div className="bg-[#E2FFE8] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
      <div className="border border-[#4A5565] rounded-[14px] p-[13px] flex items-center justify-between">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-col gap-[8px] w-[134px]">
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[16px] leading-[28px] text-[#8B6357]">
              {petName}
            </p>
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
              {dateTime}
            </p>
          </div>
          <div className="flex flex-col w-[134px]">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
              {address.line1}
            </p>
            {address.line2 && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
                {address.line2}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-[7px]">
          <div className="border border-[#4C4C4C] rounded-[12px] h-[24px] px-[9px] py-[5px] flex items-center">
            <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4C4C4C]">
              Checked in
            </span>
          </div>
          <Icon name="nav-next" className="size-[16px] text-[#99A1AF]" />
        </div>
      </div>
    </div>
  );
}

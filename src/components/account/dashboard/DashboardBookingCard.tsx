import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "../accountStore";
import type { BookingListOut } from "@/lib/api";

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
 * 解析地址字符串（假设格式为 "address, city, province postal_code" 或类似格式）
 */
function parseAddress(address?: string | null): { line1: string; line2: string } {
  if (!address) return { line1: "-", line2: "" };
  
  // 尝试解析地址格式，如果包含逗号，则分割
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 2) {
    return {
      line1: parts[0],
      line2: parts.slice(1).join(", "),
    };
  }
  
  // 如果没有逗号，整个地址作为第一行
  return { line1: address, line2: "" };
}

/**
 * 判断预约状态显示类型
 */
function getStatusDisplayType(status: string): "ready" | "pending" | "canceled" {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("cancel") || statusLower === "cancelled") {
    return "canceled";
  }
  if (statusLower.includes("ready") || statusLower.includes("confirmed") || statusLower.includes("checked_in")) {
    return "ready";
  }
  return "pending";
}


function StatusBadge({ status }: { status: string }) {
  const displayType = getStatusDisplayType(status);
  
  if (displayType === "ready") {
    return (
      <div className="bg-[#DCFCE7] rounded-[12px] h-[24px] px-[10px] flex items-center justify-center">
        <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#016630]">
          Ready for service
        </span>
      </div>
    );
  }

  if (displayType === "canceled") {
    return (
      <div className="border border-[#4C4C4C] rounded-[12px] h-[24px] px-[9px] py-[5px] flex items-center">
        <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4C4C4C]">
          Service canceled
        </span>
      </div>
    );
  }

  return (
    <div className="border border-[#4C4C4C] rounded-[12px] h-[24px] px-[9px] py-[5px] flex items-center">
      <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4C4C4C]">
        Pending
      </span>
    </div>
  );
}

function BookingItem({ booking }: { booking: BookingListOut }) {
  const navigate = useNavigate();
  const petName = booking.pet_name || "-";
  const serviceName = booking.service_name || "-";
  const serviceType = booking.service_type || "";
  const serviceDisplay = serviceType ? `${serviceName} - ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}` : serviceName;
  const dateTime = formatDateTime(booking.scheduled_time);
  const address = parseAddress(booking.address);

  return (
    <div
      className="border border-[#E5E7EB] rounded-[14px] p-[13px] flex items-center justify-between transition-colors duration-200 hover:bg-[#F9FAFB] cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/account/bookings/${booking.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/account/bookings/${booking.id}`);
        }
      }}
    >
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col gap-[8px] pr-[30px]">
          <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[16px] leading-[28px] text-[#DE6A07]">
            {petName}
          </p>
          <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
            {serviceDisplay} {dateTime}
          </p>
        </div>
        <div className="flex flex-col pr-[30px]">
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
        <StatusBadge status={booking.status} />
        <Icon name="nav-next" className="size-[16px] text-[#99A1AF]" />
      </div>
    </div>
  );
}

export default function DashboardBookingCard() {
  const { upcomingBookings, historyBookings, isLoadingBookings, fetchUpcomingBookings, fetchHistoryBookings } = useAccountStore();
  const hasFetchedUpcomingRef = useRef(false);
  const hasFetchedHistoryRef = useRef(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const upcomingTextRef = useRef<HTMLSpanElement | null>(null);
  const historyTextRef = useRef<HTMLSpanElement | null>(null);
  const upcomingWrapRef = useRef<HTMLSpanElement | null>(null);
  const historyWrapRef = useRef<HTMLSpanElement | null>(null);
  const upcomingMeasureRef = useRef<HTMLSpanElement | null>(null);
  const historyMeasureRef = useRef<HTMLSpanElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState({
    width: 0,
    transform: "translateX(0px)",
    opacity: 0,
  });
  const [tabWidths, setTabWidths] = useState({ upcoming: 0, history: 0 });

  // 组件挂载时加载 upcoming 数据
  useEffect(() => {
    if (!hasFetchedUpcomingRef.current) {
      hasFetchedUpcomingRef.current = true;
      fetchUpcomingBookings().catch((error) => {
        console.error("Error fetching upcoming bookings:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当切换到 history tab 时加载 history 数据
  useEffect(() => {
    if (activeTab === "history" && !hasFetchedHistoryRef.current) {
      hasFetchedHistoryRef.current = true;
      fetchHistoryBookings().catch((error) => {
        console.error("Error fetching history bookings:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // 根据 activeTab 选择对应的预约列表
  const filteredBookings = activeTab === "upcoming" ? upcomingBookings : historyBookings;
  
  // 判断当前 tab 是否正在加载（只在对应列表为空时显示加载状态）
  const isCurrentTabLoading = isLoadingBookings && filteredBookings.length === 0;

  const measureTabWidths = () => {
    const upcomingRect = upcomingMeasureRef.current?.getBoundingClientRect();
    const historyRect = historyMeasureRef.current?.getBoundingClientRect();
    const upcomingLive = upcomingTextRef.current?.getBoundingClientRect();
    const historyLive = historyTextRef.current?.getBoundingClientRect();

    if (!upcomingRect || !historyRect) return;

    const nextWidths = {
      upcoming: Math.ceil(
        Math.max(upcomingRect.width, upcomingLive?.width ?? 0)
      ),
      history: Math.ceil(
        Math.max(historyRect.width, historyLive?.width ?? 0)
      ),
    };

    setTabWidths((prev) =>
      prev.upcoming === nextWidths.upcoming && prev.history === nextWidths.history
        ? prev
        : nextWidths
    );
  };

  const updateUnderline = useCallback(() => {
    const container = tabsRef.current;
    const activeWrap =
      activeTab === "upcoming" ? upcomingWrapRef.current : historyWrapRef.current;

    if (!container || !activeWrap) return;

    const containerRect = container.getBoundingClientRect();
    const wrapRect = activeWrap.getBoundingClientRect();
    const left = Math.round(wrapRect.left - containerRect.left);
    const width = activeTab === "upcoming" ? tabWidths.upcoming : tabWidths.history;

    if (!width) return;

    setUnderlineStyle({
      width,
      transform: `translateX(${left}px)`,
      opacity: 1,
    });
  }, [activeTab, tabWidths]);

  useLayoutEffect(() => {
    measureTabWidths();
  }, []);

  useLayoutEffect(() => {
    updateUnderline();
  }, [updateUnderline]);

  useEffect(() => {
    const handleResize = () => {
      measureTabWidths();
    };
    window.addEventListener("resize", handleResize);

    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureTabWidths();
      });
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
      <div className="flex flex-col gap-[24px]">
        <div ref={tabsRef} className="relative flex items-start pb-[4px] whitespace-nowrap ml-[-20px]">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className="flex flex-col items-end px-[12px] whitespace-nowrap cursor-pointer"
            aria-pressed={activeTab === "upcoming"}
          >
            <span
              ref={upcomingWrapRef}
              className="inline-flex whitespace-nowrap"
              style={{ width: tabWidths.upcoming ? `${tabWidths.upcoming}px` : "auto" }}
            >
              <span
                ref={upcomingTextRef}
                className={`whitespace-nowrap font-['Comfortaa',sans-serif] text-[16px] leading-[28px] ${
                  activeTab === "upcoming"
                    ? "font-bold text-[#4A3C2A]"
                    : "font-normal text-[#4A3C2A]/70"
                }`}
              >
                Upcoming booking
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className="flex flex-col items-end px-[12px] whitespace-nowrap cursor-pointer"
            aria-pressed={activeTab === "history"}
          >
            <span
              ref={historyWrapRef}
              className="inline-flex whitespace-nowrap"
              style={{ width: tabWidths.history ? `${tabWidths.history}px` : "auto" }}
            >
              <span
                ref={historyTextRef}
                className={`whitespace-nowrap font-['Comfortaa',sans-serif] text-[16px] leading-[28px] ${
                  activeTab === "history"
                    ? "font-bold text-[#4A3C2A]"
                    : "font-normal text-[#4A3C2A]/70"
                }`}
              >
                History booking
              </span>
            </span>
          </button>
          <div
            className="absolute bottom-0 h-[2px] bg-[#DE6A07] pointer-events-none transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${underlineStyle.width}px`,
              transform: underlineStyle.transform,
              opacity: underlineStyle.opacity,
            }}
          />

          <div className="absolute left-[-9999px] top-0 opacity-0 pointer-events-none whitespace-nowrap">
            <span
              ref={upcomingMeasureRef}
              className="font-['Comfortaa',sans-serif] font-bold text-[16px] leading-[28px]"
            >
              Upcoming booking
            </span>
            <span
              ref={historyMeasureRef}
              className="font-['Comfortaa',sans-serif] font-bold text-[16px] leading-[28px]"
            >
              History booking
            </span>
          </div>
        </div>
        {isCurrentTabLoading ? (
          <div className="text-[#4A3C2A] text-sm py-4">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-[#4A3C2A] text-sm py-4">
            No {activeTab === "upcoming" ? "upcoming" : "history"} bookings.
          </div>
        ) : (
          <div className="flex flex-col gap-[24px]">
            {filteredBookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

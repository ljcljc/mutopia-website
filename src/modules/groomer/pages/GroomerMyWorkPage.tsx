import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import { BookingRequestContent } from "@/modules/groomer/components/BookingRequestContent";
import { HistoryDetailsModal, type HistoryDetailsAppointment } from "@/modules/groomer/components/HistoryDetailsModal";
import { GroomerUpNextCard, type GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";
import { buildImageUrl, getGroomerHistory, getGroomerSchedule } from "@/lib/api";

type WorkTab = "schedule" | "history";
type CalendarMode = "collapsed" | "week" | "month";

type AppointmentCard = GroomerUpNextAppointment & {
  id: string;
  bookingId: number;
  showStartTravel?: boolean;
};

type CalendarWeekDay = {
  label: string;
  date: string;
  active?: boolean;
  dots?: string[];
};

type CalendarMonthDay = {
  date: string;
  active?: boolean;
  dots?: string[];
};

type AppointmentSection = {
  id: string;
  label: string;
  dateKey: string;
  appointments: AppointmentCard[];
};

type HistoryBadgeTone = "service" | "success" | "warning" | "neutral";

type HistoryBadge = {
  label: string;
  tone: HistoryBadgeTone;
};

type HistoryAppointmentCard = {
  id: string;
  bookingId: number;
  date: string;
  petName: string;
  breed: string;
  amount: string;
  badges: HistoryBadge[];
};

type HistorySection = {
  id: string;
  label: string;
  appointments: HistoryAppointmentCard[];
};

const WEEKDAY_SHORT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const WEEKDAY_FULL_LABELS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;
const MONTH_SHORT_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;
const CALENDAR_DOT_COLOR = "#F59E0B";
const SCHEDULE_PAGE_SIZE = 20;
const HISTORY_PAGE_SIZE = 20;
const SCHEDULE_DAY_OFFSETS = [0, 1] as const;
const DEFAULT_PET_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
    <rect width="96" height="96" rx="48" fill="#F6E8DA"/>
    <circle cx="48" cy="39" r="16" fill="#C58D6A"/>
    <ellipse cx="48" cy="66" rx="22" ry="14" fill="#D9A37D"/>
  </svg>`,
)}`;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getItems(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.map(asRecord);
  const record = asRecord(data);
  if (Array.isArray(record.items)) return record.items.map(asRecord);
  return [];
}

function getString(source: Record<string, unknown>, keys: string[], fallback: string = ""): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getNumber(source: Record<string, unknown>, keys: string[], fallback: number = 0): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function getMondayFirstWeekIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(date.getDate() - getMondayFirstWeekIndex(date));
  return start;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatMonthYear(date: Date) {
  return `${MONTH_SHORT_LABELS[date.getMonth()].charAt(0)}${MONTH_SHORT_LABELS[date.getMonth()].slice(1).toLowerCase()} ${date.getFullYear()}`;
}

function formatScheduleSectionLabel(date: Date, today: Date) {
  const weekday = WEEKDAY_FULL_LABELS[getMondayFirstWeekIndex(date)];
  const month = MONTH_SHORT_LABELS[date.getMonth()];
  const base = `${weekday}, ${month} ${date.getDate()}`;

  if (isSameDay(date, today)) return `TODAY - ${base}`;
  if (isSameDay(date, addDays(today, 1))) return `TOMORROW - ${base}`;
  return base;
}

function formatTimeLabel(value: string): string {
  const parsed = parseDate(value);
  if (!parsed) return value || "--";
  return parsed.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortDate(value: string): string {
  const parsed = parseDate(value);
  if (!parsed) return value || "—";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatMonthSectionLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }).toUpperCase();
}

function formatAmountLabel(source: Record<string, unknown>): string {
  const raw = getString(source, ["amount", "final_amount", "payable_amount", "deposit_amount"]);
  if (!raw) return "—";
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function formatStatusLabel(status: string): string {
  if (!status) return "Unknown";
  return status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getStatusTone(status: string): HistoryBadgeTone {
  const normalized = status.toLowerCase();
  if (normalized.includes("complete") || normalized.includes("confirm") || normalized.includes("success")) return "success";
  if (normalized.includes("pending") || normalized.includes("cancel") || normalized.includes("terminate")) return "warning";
  return "neutral";
}

function buildCalendarWeekDays(today: Date, occupiedDateKeys: Set<string>): CalendarWeekDay[] {
  const startOfWeek = getStartOfWeek(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(startOfWeek, index);
    const dateKey = toDateKey(date);
    return {
      label: WEEKDAY_SHORT_LABELS[index],
      date: String(date.getDate()),
      active: isSameDay(date, today),
      dots: occupiedDateKeys.has(dateKey) ? [CALENDAR_DOT_COLOR] : undefined,
    };
  });
}

function buildMonthCalendarDays(today: Date, occupiedDateKeys: Set<string>): Array<CalendarMonthDay | null> {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const leadingEmptyDays = getMondayFirstWeekIndex(firstDayOfMonth);
  const days: Array<CalendarMonthDay | null> = Array.from({ length: leadingEmptyDays }, () => null);

  for (let day = 1; day <= lastDayOfMonth.getDate(); day += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dateKey = toDateKey(date);

    days.push({
      date: String(day),
      active: isSameDay(date, today),
      dots: occupiedDateKeys.has(dateKey) ? [CALENDAR_DOT_COLOR] : undefined,
    });
  }

  return days;
}

function mapScheduleAppointment(item: Record<string, unknown>, dateKey: string, todayDateKey: string): AppointmentCard {
  const bookingId = getNumber(item, ["id", "booking_id"], 0);
  const petName = getString(item, ["pet_name"], "Pet");
  const avatarUrl = buildImageUrl(getString(item, ["pet_avatar", "avatar", "avatar_url"])) || DEFAULT_PET_AVATAR;
  const serviceName = getString(item, ["service_name"], getString(item, ["service_type"], "Service"));

  return {
    id: String(bookingId || `${dateKey}-${petName}`),
    bookingId,
    petName,
    breed: getString(item, ["pet_breed", "breed"], "Breed"),
    owner: getString(item, ["owner_name"], "Pet owner"),
    avatarUrl,
    address: getString(item, ["service_address", "address"], "Address unavailable"),
    service: serviceName,
    duration: getString(item, ["duration", "duration_text", "estimated_duration"], "Est. duration: --"),
    time: formatTimeLabel(getString(item, ["scheduled_time", "appointment_time", "time"])),
    showStartTravel: dateKey === todayDateKey,
  };
}

function mapHistoryAppointment(item: Record<string, unknown>): HistoryAppointmentCard {
  const bookingId = getNumber(item, ["id", "booking_id"], 0);
  const scheduledTime = getString(item, ["scheduled_time", "created_at"]);
  const serviceLabel = getString(item, ["service_name"], getString(item, ["service_type"], "Service"));
  const statusLabel = formatStatusLabel(getString(item, ["status"], "Unknown"));

  return {
    id: `history-${bookingId || Math.random().toString(36).slice(2)}`,
    bookingId,
    date: formatShortDate(scheduledTime),
    petName: getString(item, ["pet_name"], "Pet"),
    breed: getString(item, ["pet_breed", "breed"], "Breed"),
    amount: formatAmountLabel(item),
    badges: [
      { label: serviceLabel, tone: "service" },
      { label: statusLabel, tone: getStatusTone(statusLabel) },
    ],
  };
}

function groupHistoryAppointments(items: HistoryAppointmentCard[], sourceRecords: Record<string, unknown>[]): HistorySection[] {
  const grouped = new Map<string, HistorySection>();

  items.forEach((appointment, index) => {
    const source = sourceRecords[index] ?? {};
    const parsed = parseDate(getString(source, ["scheduled_time", "created_at"]));
    const label = parsed ? formatMonthSectionLabel(parsed) : "HISTORY";
    const section = grouped.get(label);

    if (section) {
      section.appointments.push(appointment);
      return;
    }

    grouped.set(label, {
      id: `history-section-${label.toLowerCase().replace(/\s+/g, "-")}`,
      label,
      appointments: [appointment],
    });
  });

  return Array.from(grouped.values());
}

function SegmentControl({
  activeTab,
  onChange,
}: {
  activeTab: WorkTab;
  onChange: (tab: WorkTab) => void;
}) {
  return (
    <div className="rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] p-[2px]">
      <div className="grid grid-cols-2 gap-1">
        {[
          { key: "schedule" as const, label: "Schedule" },
          { key: "history" as const, label: "History" },
        ].map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "h-9 rounded-full px-4 font-comfortaa text-[14px] leading-[21px] transition-colors",
                isActive ? "bg-white font-medium text-[#4A2C55]" : "font-medium text-[#F3EAF7]",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateSectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <p className="shrink-0 font-comfortaa text-[12px] font-bold uppercase leading-[18px] tracking-[0.6px] text-[rgba(255,255,255,0.7)]">{label}</p>
      <div className="h-px flex-1 bg-[rgba(255,255,255,0.5)]" />
    </div>
  );
}

function HistorySearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex h-[42px] w-full items-center gap-2 rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.1)] px-[12px]">
      <Icon name="search" className="size-5 shrink-0 text-white" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search past work by pet name..."
        className="w-full bg-transparent font-comfortaa text-[14px] leading-[21px] text-white outline-none placeholder:text-white"
      />
    </label>
  );
}

function HistoryBadgeView({ badge }: { badge: HistoryBadge }) {
  const toneClasses: Record<HistoryBadgeTone, string> = {
    service: "border border-[#4C4C4C] bg-white text-[#4C4C4C]",
    success: "bg-[#DCFCE7] text-[#27AE60]",
    warning: "bg-[rgba(245,158,11,0.1)] text-[#F59E0B]",
    neutral: "bg-[rgba(139,99,87,0.05)] text-[#8B6357]",
  };

  return (
    <div className={cn("inline-flex h-6 items-center gap-1 rounded-full px-2", toneClasses[badge.tone])}>
      {badge.tone === "success" ? <Icon name="check-green" className="size-[14px]" aria-hidden="true" /> : null}
      {badge.tone === "warning" ? <Icon name="clock" className="size-[14px] text-[#F59E0B]" aria-hidden="true" /> : null}
      <span className="font-comfortaa text-[10px] font-bold leading-[14px]">{badge.label}</span>
    </div>
  );
}

function HistoryAppointmentItem({ appointment }: { appointment: HistoryAppointmentCard }) {
  return (
    <article className="rounded-[24px] border border-[rgba(139,99,87,0.05)] bg-white px-[20px] pb-[20px] pt-[20px] shadow-[0px_4px_16px_rgba(139,99,87,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-comfortaa text-[13px] font-bold leading-[19.5px] text-[rgba(139,99,87,0.6)]">{appointment.date}</p>
          <h3 className="mt-1 font-comfortaa text-[18px] font-bold leading-[22.5px] text-[#8B6357]">
            <span className="underline underline-offset-2">{appointment.petName}</span>
            <span className="font-medium text-[rgba(139,99,87,0.6)]">{` (${appointment.breed})`}</span>
          </h3>
        </div>
        <p className="shrink-0 font-comfortaa text-[20px] font-bold leading-[30px] text-[#DE6A07]">{appointment.amount}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {appointment.badges.map((badge) => (
          <HistoryBadgeView key={`${appointment.id}-${badge.label}`} badge={badge} />
        ))}
      </div>
    </article>
  );
}

function CalendarOverviewCard({
  mode,
  monthLabel,
  weekDays,
  monthDays,
  onCollapse,
  onExpandMonth,
  onShowWeek,
}: {
  mode: Exclude<CalendarMode, "collapsed">;
  monthLabel: string;
  weekDays: CalendarWeekDay[];
  monthDays: Array<CalendarMonthDay | null>;
  onCollapse: () => void;
  onExpandMonth: () => void;
  onShowWeek: () => void;
}) {
  return (
    <div className="rounded-[18px] bg-white px-[14px] py-[14px] shadow-[0px_8px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#B56C47]">
          <Icon name="calendar" size={15} aria-hidden="true" />
          <p className="font-comfortaa text-[15px] leading-[22.5px] text-[#B56C47]">{monthLabel}</p>
        </div>
        <button type="button" onClick={onCollapse} className="flex size-6 items-center justify-center">
          <Icon name="chevron-down" size={16} className="text-[#F08A12]" aria-hidden="true" />
        </button>
      </div>

      {mode === "week" ? (
        <>
          <div className="mt-[14px] grid grid-cols-7 gap-y-[10px]">
            {weekDays.map((day) => (
              <div key={day.label} className="flex flex-col items-center">
                <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#C7A297]">{day.label}</span>
                <div
                  className={cn(
                    "mt-[7px] flex size-9 items-center justify-center rounded-full font-comfortaa text-[14px] leading-[21px]",
                    day.active ? "bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] text-white shadow-[0px_8px_14px_rgba(240,138,18,0.28)]" : "text-[#8B6357]",
                  )}
                >
                  {day.date}
                </div>
                <div className="mt-[7px] flex min-h-[8px] items-center gap-1">
                  {day.dots?.map((dotColor, index) => (
                    <span key={`${day.label}-${index}`} className="size-[5px] rounded-full" style={{ backgroundColor: dotColor }} />
                  )) ?? null}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onExpandMonth}
            className="mx-auto mt-[2px] block font-comfortaa text-[13px] leading-[19.5px] text-[#7F5B7A] underline underline-offset-[2px]"
          >
            See all dates
          </button>
        </>
      ) : (
        <>
          <div className="mt-[14px]">
            <div className="grid grid-cols-7 gap-y-2">
              {WEEKDAY_SHORT_LABELS.map((label) => (
                <div key={label} className="flex justify-center">
                  <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#C7A297]">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-[6px] grid grid-cols-7 gap-y-[10px]">
              {monthDays.map((day, index) =>
                day ? (
                  <div key={`${day.date}-${index}`} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full font-comfortaa text-[14px] leading-[21px]",
                        day.active ? "bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] text-white shadow-[0px_8px_14px_rgba(240,138,18,0.28)]" : "text-[#8B6357]",
                      )}
                    >
                      {day.date}
                    </div>
                    <div className="mt-[7px] flex min-h-[8px] items-center gap-1">
                      {day.dots?.map((dotColor, dotIndex) => (
                        <span key={`${day.date}-${dotIndex}`} className="size-[5px] rounded-full" style={{ backgroundColor: dotColor }} />
                      )) ?? null}
                    </div>
                  </div>
                ) : (
                  <div key={`empty-${index}`} />
                ),
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onShowWeek}
            className="mx-auto mt-[10px] block font-comfortaa text-[13px] leading-[19.5px] text-[#7F5B7A] underline underline-offset-[2px]"
          >
            Show week dates
          </button>
        </>
      )}
    </div>
  );
}

function PendingTravelCard({
  appointment,
  isExpanded,
  onToggleExpanded,
}: {
  appointment: AppointmentCard;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}) {
  return (
    <article className="relative overflow-hidden rounded-[14px] bg-[#A86140] px-[18px] pb-5 pt-4 shadow-[0px_10px_18px_rgba(0,0,0,0.16)]">
      <span className="absolute inset-y-0 left-0 w-1 bg-[#F08A12]" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <p className="font-comfortaa text-[18px] font-bold leading-[27px] text-white">{appointment.time}</p>
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-[12px] py-[6px] shadow-[0px_4px_8px_rgba(255,255,255,0.12)]">
          <Icon name="clock" size={12} className="text-[#F08A12]" aria-hidden="true" />
          <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#DE6A07]">Pending</span>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-3 rounded-[16px] bg-white px-[16px] py-[14px] shadow-[0px_4px_16px_rgba(139,99,87,0.06)]">
          <BookingRequestContent
            request={appointment}
            passAppointmentContextLabel="MY WORK > BOOKING REQUEST"
            passAppointmentReturnLabel="Back to my work"
            accessory={
              <button
                type="button"
                onClick={onToggleExpanded}
                aria-expanded={isExpanded}
                aria-label="Collapse pending appointment"
                className="flex size-6 shrink-0 items-center justify-center rounded-full self-start"
              >
                <Icon name="chevron-down" size={14} className="rotate-180 text-[#8B6357]" aria-hidden="true" />
              </button>
            }
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
          aria-label="Expand pending appointment"
          className="mt-3 w-full rounded-[10px] bg-[#F8F7F3] px-3 py-[11px] text-left"
        >
          <div className="flex items-center gap-3">
            <img src={appointment.avatarUrl} alt={appointment.petName} className="size-[50px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">
                {appointment.petName} - {appointment.breed}
              </p>
              <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
                <span aria-hidden="true">• </span>
                Owner: {appointment.owner}
              </p>
              <div className="mt-[7px] inline-flex rounded-full border border-[#DE1507] px-[10px] py-[4px]">
                <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#DE1507]">Moved from schedule</span>
              </div>
            </div>
            <Icon name="chevron-down" size={14} className="text-[#8B6357]" aria-hidden="true" />
          </div>
        </button>
      )}
    </article>
  );
}

function AppointmentItem({
  appointment,
  onCancel,
}: {
  appointment: AppointmentCard;
  onCancel: () => void;
}) {
  return (
    <GroomerUpNextCard
      appointment={appointment}
      footer={
        <>
          {appointment.showStartTravel ? (
            <button
              type="button"
              className="flex h-[38px] w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] font-comfortaa text-[14px] font-bold leading-[21px] text-white shadow-[0px_10px_18px_rgba(240,138,18,0.28)] transition-transform hover:scale-[0.99]"
            >
              Start Travel
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "mx-auto block font-comfortaa text-[12px] leading-[18px] text-[#A07D72] underline underline-offset-[2px]",
              appointment.showStartTravel ? "mt-5" : "mt-0",
            )}
          >
            Cancel appointment
          </button>
        </>
      }
    />
  );
}

function StatusCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[16px] bg-[rgba(255,255,255,0.12)] px-4 py-4 text-white">
      <p className="font-comfortaa text-[16px] font-bold leading-6">{title}</p>
      <p className="mt-2 font-comfortaa text-[13px] leading-5 text-[rgba(255,255,255,0.8)]">{description}</p>
    </div>
  );
}

export default function GroomerMyWorkPage() {
  const today = useMemo(() => new Date(), []);
  const todayDateKey = useMemo(() => toDateKey(today), [today]);
  const [activeTab, setActiveTab] = useState<WorkTab>("schedule");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("collapsed");
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [debouncedHistorySearch, setDebouncedHistorySearch] = useState("");
  const [selectedHistoryAppointment, setSelectedHistoryAppointment] = useState<HistoryDetailsAppointment | null>(null);
  const [pendingAppointmentIds, setPendingAppointmentIds] = useState<string[]>([]);
  const [expandedPendingAppointmentIds, setExpandedPendingAppointmentIds] = useState<string[]>([]);
  const [scheduleSections, setScheduleSections] = useState<AppointmentSection[]>([]);
  const [historySections, setHistorySections] = useState<HistorySection[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedHistorySearch(historySearchValue.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [historySearchValue]);

  useEffect(() => {
    let cancelled = false;

    async function loadSchedule() {
      setIsLoadingSchedule(true);
      setScheduleError("");

      const results = await Promise.allSettled(
        SCHEDULE_DAY_OFFSETS.map(async (offset) => {
          const date = addDays(today, offset);
          const dateKey = toDateKey(date);
          const response = await getGroomerSchedule({
            service_date: dateKey,
            page: 1,
            page_size: SCHEDULE_PAGE_SIZE,
          });

          const appointments = getItems(response).map((item) => mapScheduleAppointment(item, dateKey, todayDateKey));
          return {
            id: `visible-day-${offset}`,
            label: formatScheduleSectionLabel(date, today),
            dateKey,
            appointments,
          } satisfies AppointmentSection;
        }),
      );

      if (cancelled) return;

      const fulfilledSections = results
        .filter((result): result is PromiseFulfilledResult<AppointmentSection> => result.status === "fulfilled")
        .map((result) => result.value);

      setScheduleSections(fulfilledSections);
      setScheduleError(fulfilledSections.length === 0 ? "Failed to load schedule." : "");
      setIsLoadingSchedule(false);
    }

    void loadSchedule();

    return () => {
      cancelled = true;
    };
  }, [today, todayDateKey]);

  useEffect(() => {
    if (activeTab !== "history") return;

    let cancelled = false;

    async function loadHistory() {
      setIsLoadingHistory(true);
      setHistoryError("");

      try {
        const response = await getGroomerHistory({
          pet_name: debouncedHistorySearch || undefined,
          date_to: todayDateKey,
          page: 1,
          page_size: HISTORY_PAGE_SIZE,
        });

        if (cancelled) return;

        const items = getItems(response);
        const sortedItems = [...items].sort((left, right) => {
          const leftTime = parseDate(getString(left, ["scheduled_time", "created_at"]))?.getTime() ?? 0;
          const rightTime = parseDate(getString(right, ["scheduled_time", "created_at"]))?.getTime() ?? 0;
          return rightTime - leftTime;
        });
        const mappedAppointments = sortedItems.map((item) => mapHistoryAppointment(item));

        setHistorySections(groupHistoryAppointments(mappedAppointments, sortedItems));
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load groomer history:", error);
        setHistorySections([]);
        setHistoryError("Failed to load history.");
      } finally {
        if (!cancelled) setIsLoadingHistory(false);
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [activeTab, debouncedHistorySearch, todayDateKey]);

  const occupiedDateKeys = useMemo(
    () => new Set(scheduleSections.filter((section) => section.appointments.length > 0).map((section) => section.dateKey)),
    [scheduleSections],
  );
  const calendarWeekDays = useMemo(() => buildCalendarWeekDays(today, occupiedDateKeys), [occupiedDateKeys, today]);
  const monthCalendarDays = useMemo(() => buildMonthCalendarDays(today, occupiedDateKeys), [occupiedDateKeys, today]);
  const monthLabel = useMemo(() => formatMonthYear(today), [today]);
  const visibleScheduleSections = useMemo(() => scheduleSections, [scheduleSections]);

  const handleTabChange = (tab: WorkTab) => {
    setActiveTab(tab);
    if (tab !== "schedule") setCalendarMode("collapsed");
  };

  const openHistoryDetails = (appointment: HistoryAppointmentCard) => {
    setSelectedHistoryAppointment({
      id: String(appointment.bookingId),
      petName: appointment.petName,
      breed: appointment.breed,
      serviceLabel: appointment.badges[0]?.label,
    });
  };

  const renderScheduleAppointment = (appointment: AppointmentCard) => {
    if (pendingAppointmentIds.includes(appointment.id)) {
      return (
        <PendingTravelCard
          key={appointment.id}
          appointment={appointment}
          isExpanded={expandedPendingAppointmentIds.includes(appointment.id)}
          onToggleExpanded={() =>
            setExpandedPendingAppointmentIds((current) =>
              current.includes(appointment.id) ? current.filter((id) => id !== appointment.id) : [...current, appointment.id],
            )
          }
        />
      );
    }

    return (
      <AppointmentItem
        key={appointment.id}
        appointment={appointment}
        onCancel={() => {
          setPendingAppointmentIds((current) => (current.includes(appointment.id) ? current : [...current, appointment.id]));
          setExpandedPendingAppointmentIds((current) => current.filter((id) => id !== appointment.id));
        }}
      />
    );
  };

  const hasScheduleAppointments = visibleScheduleSections.some((section) => section.appointments.length > 0);
  const hasHistoryAppointments = historySections.some((section) => section.appointments.length > 0);

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-2">
      <div className="space-y-4">
        <SegmentControl activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "schedule" ? (
          calendarMode === "collapsed" ? (
            <button
              type="button"
              onClick={() => {
                setCalendarMode((current) => (current === "collapsed" ? "week" : "collapsed"));
              }}
              className="inline-flex h-9 items-center gap-2 rounded-[12px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 font-comfortaa text-[14px] font-medium leading-[21px] text-white"
            >
              <Icon name="calendar" className="size-4 text-white" aria-hidden="true" />
              <span>My calendar</span>
            </button>
          ) : null
        ) : (
          <HistorySearchField value={historySearchValue} onChange={setHistorySearchValue} />
        )}

        <div className="space-y-5">
          {activeTab === "schedule" && calendarMode !== "collapsed" ? (
            <>
              <CalendarOverviewCard
                mode={calendarMode}
                monthLabel={monthLabel}
                weekDays={calendarWeekDays}
                monthDays={monthCalendarDays}
                onCollapse={() => setCalendarMode("collapsed")}
                onExpandMonth={() => setCalendarMode("month")}
                onShowWeek={() => setCalendarMode("week")}
              />

              {isLoadingSchedule ? <StatusCard title="Loading schedule" description="Fetching today and upcoming bookings." /> : null}
              {!isLoadingSchedule && scheduleError ? <StatusCard title="Schedule unavailable" description={scheduleError} /> : null}
              {!isLoadingSchedule && !scheduleError && !hasScheduleAppointments ? (
                <StatusCard title="No schedule found" description="There are no bookings for today or tomorrow yet." />
              ) : null}

              {!isLoadingSchedule && !scheduleError
                ? visibleScheduleSections.map((section) => (
                    <section key={section.id} className="space-y-4">
                      <DateSectionHeader label={section.label} />
                      {section.appointments.length > 0 ? (
                        <div className="space-y-3">{section.appointments.map(renderScheduleAppointment)}</div>
                      ) : (
                        <StatusCard title="No bookings" description="No appointments are scheduled for this date." />
                      )}
                    </section>
                  ))
                : null}
            </>
          ) : (
            <>
              {activeTab === "history" ? (
                <>
                  {isLoadingHistory ? <StatusCard title="Loading history" description="Fetching completed and past bookings." /> : null}
                  {!isLoadingHistory && historyError ? <StatusCard title="History unavailable" description={historyError} /> : null}
                  {!isLoadingHistory && !historyError && !hasHistoryAppointments ? (
                    <StatusCard title="No history found" description="No past bookings match the current filter." />
                  ) : null}

                  {!isLoadingHistory && !historyError
                    ? historySections.map((section) => (
                        <section key={section.id} className="space-y-4">
                          <DateSectionHeader label={section.label} />
                          {section.appointments.length > 0 ? (
                            <div className="space-y-4">
                              {section.appointments.map((appointment) => (
                                <button
                                  key={appointment.id}
                                  type="button"
                                  onClick={() => openHistoryDetails(appointment)}
                                  className="block w-full text-left transition-transform active:scale-[0.99]"
                                >
                                  <HistoryAppointmentItem appointment={appointment} />
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </section>
                      ))
                    : null}
                </>
              ) : (
                <>
                  {isLoadingSchedule ? <StatusCard title="Loading schedule" description="Fetching today and upcoming bookings." /> : null}
                  {!isLoadingSchedule && scheduleError ? <StatusCard title="Schedule unavailable" description={scheduleError} /> : null}
                  {!isLoadingSchedule && !scheduleError && !hasScheduleAppointments ? (
                    <StatusCard title="No schedule found" description="There are no bookings for today or tomorrow yet." />
                  ) : null}

                  {!isLoadingSchedule && !scheduleError
                    ? visibleScheduleSections.map((section) => (
                        <section key={section.id} className="space-y-4">
                          <DateSectionHeader label={section.label} />
                          {section.appointments.length > 0 ? (
                            <div className="space-y-3">{section.appointments.map(renderScheduleAppointment)}</div>
                          ) : (
                            <StatusCard title="No bookings" description="No appointments are scheduled for this date." />
                          )}
                        </section>
                      ))
                    : null}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <HistoryDetailsModal
        open={selectedHistoryAppointment !== null}
        appointment={selectedHistoryAppointment}
        onClose={() => {
          setSelectedHistoryAppointment(null);
        }}
      />
    </div>
  );
}

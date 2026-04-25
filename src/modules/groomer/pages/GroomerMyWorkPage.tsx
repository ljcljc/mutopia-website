import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/components/ui/utils";
import {
  BookingRequestInteraction,
  type BookingRequestDecisionTimeOption,
} from "@/modules/groomer/components/BookingRequestContent";
import { HistoryDetailsModal, type HistoryDetailsAppointment } from "@/modules/groomer/components/HistoryDetailsModal";
import { GroomerUpNextCard, type GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";
import { useGroomerMyWorkStore } from "@/modules/groomer/stores/myWorkStore";
import { buildImageUrl } from "@/lib/api";
import { HttpError } from "@/lib/http";

type WorkTab = "schedule" | "history";
type CalendarMode = "collapsed" | "week" | "month";
type HistoryBadgeTone = "service" | "success" | "warning" | "neutral";

type CalendarDay = {
  dateKey: string;
  day: string;
  isPast: boolean;
  isToday: boolean;
  isOutsideMonth?: boolean;
  green: boolean;
  yellow: boolean;
};

type PendingJobCard = GroomerUpNextAppointment & {
  id: string;
  bookingId: number;
  invitationId: number;
  proposalSlots: string[];
  expiresInLabel?: string;
};

type UpNextCard = GroomerUpNextAppointment & {
  id: string;
  bookingId: number;
  showStartTravel: boolean;
};

type ScheduleSection = {
  id: string;
  label: string;
  dateKey: string;
  pendingJobs: PendingJobCard[];
  upNext: UpNextCard[];
};

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
const HISTORY_PAGE_SIZE = 20;
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

function getArray(source: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = source[key];
  return Array.isArray(value) ? value.map(asRecord) : [];
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

function getNestedRecord(source: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;
  }
  return {};
}

function parseDateKey(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const dateKey = parseDateKey(value);
  if (dateKey) return dateKey;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

function formatShortDate(value: string): string {
  const parsed = parseDate(value);
  if (!parsed) return value || "-";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMonthSectionLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
}

function formatTimeLabel(value: string): string {
  const parsed = parseDate(value);
  if (!parsed) return value || "--";
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatAmount(value: unknown, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  const raw = typeof value === "number" ? value.toFixed(2) : String(value);
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function formatAmountLabel(source: Record<string, unknown>): string {
  const price = getNestedRecord(source, ["price"]);
  const raw =
    getString(source, ["amount", "final_amount", "payable_amount", "deposit_amount"]) ||
    getString(price, ["final_amount", "paid_total", "payable_amount"]);
  return formatAmount(raw);
}

function formatDurationLabel(source: Record<string, unknown>): string {
  const explicit = getString(source, ["duration", "duration_text", "estimated_duration", "service_time"]);
  if (explicit) return explicit.toLowerCase().includes("duration") || explicit.toLowerCase().includes("est.") ? explicit : `Est. duration: ${explicit}`;
  const minutes = getNumber(source, ["estimated_duration_minutes", "duration_minutes", "service_duration_minutes"]);
  if (minutes > 0) return `Est. duration: ${minutes} minutes`;
  return "Est. duration: --";
}

function formatStatusLabel(status: string): string {
  if (!status) return "Unknown";
  return status
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getStatusTone(label: string): HistoryBadgeTone {
  const normalized = label.toLowerCase();
  if (normalized.includes("complete")) return "success";
  if (normalized.includes("terminate") || normalized.includes("cancel") || normalized.includes("refund")) return "warning";
  return "neutral";
}

function formatPreferredTimeSlotLabel(slot: Record<string, unknown>): string {
  const date = getString(slot, ["date"]);
  const slotName = getString(slot, ["slot"]).toLowerCase();
  if (!date) return "";
  const dateLabel = date.split("-").join(".");
  if (slotName === "morning" || slotName === "am") return `${dateLabel} AM`;
  if (slotName === "afternoon" || slotName === "pm" || slotName === "evening") return `${dateLabel} PM`;
  return slotName ? `${dateLabel} ${slotName}` : dateLabel;
}

function getBookingRequestExpiresInLabel(createdAt: string): string | undefined {
  if (!createdAt) return undefined;
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return undefined;
  const remainingMs = createdTime + 7 * 24 * 60 * 60 * 1000 - Date.now();
  if (remainingMs <= 0) return "Expired";
  if (remainingMs > 24 * 60 * 60 * 1000) return undefined;
  const hours = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
  return `Expire in ${hours} hour${hours === 1 ? "" : "s"}`;
}

function mapPendingJob(item: Record<string, unknown>, dateKey: string): PendingJobCard {
  const bookingId = getNumber(item, ["booking_id", "id"], 0);
  const invitationId = getNumber(item, ["invitation_id"], 0);
  const petName = getString(item, ["pet_name"], "Pet");
  const proposalSlots = getArray(item, "preferred_time_slots").map(formatPreferredTimeSlotLabel).filter(Boolean);

  return {
    id: `pending-${invitationId || bookingId || `${dateKey}-${petName}`}`,
    bookingId,
    invitationId,
    petName,
    breed: getString(item, ["pet_breed", "breed"], "Breed"),
    owner: getString(item, ["owner_name"], "Pet owner"),
    avatarUrl: buildImageUrl(getString(item, ["pet_avatar", "avatar", "avatar_url"])) || DEFAULT_PET_AVATAR,
    address: getString(item, ["service_address", "address"], "Address unavailable"),
    service: getString(item, ["service_name", "service_type"], "Service"),
    duration: formatDurationLabel(item),
    time: "Pending",
    proposalSlots,
    expiresInLabel: getBookingRequestExpiresInLabel(getString(item, ["created_at"])),
  };
}

function mapUpNext(item: Record<string, unknown>, dateKey: string, todayDateKey: string): UpNextCard {
  const bookingId = getNumber(item, ["id", "booking_id"], 0);
  const petName = getString(item, ["pet_name"], "Pet");
  return {
    id: `upnext-${bookingId || `${dateKey}-${petName}`}`,
    bookingId,
    petName,
    breed: getString(item, ["pet_breed", "breed"], "Breed"),
    owner: getString(item, ["owner_name", "user_name"], "Pet owner"),
    avatarUrl: buildImageUrl(getString(item, ["pet_avatar", "avatar", "avatar_url"])) || DEFAULT_PET_AVATAR,
    address: getString(item, ["service_address", "address"], "Address unavailable"),
    service: getString(item, ["service_name", "service_type"], "Service"),
    duration: formatDurationLabel(item),
    time: formatTimeLabel(getString(item, ["scheduled_time", "appointment_time", "time"])),
    showStartTravel: dateKey === todayDateKey,
  };
}

function mapCalendarDays(myWork: Record<string, unknown>, today: Date): CalendarDay[] {
  return getArray(myWork, "calendar").map((item) => {
    const dateKey = getString(item, ["date"]);
    const parsed = parseDateKey(dateKey);
    return {
      dateKey,
      day: parsed ? String(parsed.getDate()) : dateKey.slice(-2),
      isPast: Boolean(item.is_past),
      isToday: Boolean(item.is_today) || (parsed ? isSameDay(parsed, today) : false),
      green: Boolean(item.green),
      yellow: Boolean(item.yellow),
    };
  });
}

function buildMonthCalendarDays(days: CalendarDay[]): Array<CalendarDay | null> {
  const firstDay = days[0] ? parseDateKey(days[0].dateKey) : null;
  const leadingEmptyDays = firstDay ? getMondayFirstWeekIndex(firstDay) : 0;
  return [...Array.from({ length: leadingEmptyDays }, () => null), ...days];
}

function buildWeekCalendarDays(days: CalendarDay[], today: Date): CalendarDay[] {
  const calendarByDateKey = new Map(days.map((day) => [day.dateKey, day]));
  const startOfWeek = getStartOfWeek(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(startOfWeek, index);
    const dateKey = toDateKey(date);
    const calendarDay = calendarByDateKey.get(dateKey);
    if (calendarDay) return calendarDay;

    return {
      dateKey,
      day: String(date.getDate()),
      isPast: date < today && !isSameDay(date, today),
      isToday: isSameDay(date, today),
      isOutsideMonth: true,
      green: false,
      yellow: false,
    };
  });
}

function mapScheduleSections(myWork: Record<string, unknown>, today: Date, todayDateKey: string): ScheduleSection[] {
  return getArray(myWork, "schedule_sections").map((section) => {
    const dateKey = getString(section, ["date"]);
    const date = parseDateKey(dateKey) ?? today;
    return {
      id: `schedule-${dateKey}`,
      label: formatScheduleSectionLabel(date, today),
      dateKey,
      pendingJobs: getArray(section, "pending_jobs").map((item) => mapPendingJob(item, dateKey)),
      upNext: getArray(section, "up_next").map((item) => mapUpNext(item, dateKey, todayDateKey)),
    };
  });
}

function mapHistoryAppointment(item: Record<string, unknown>): HistoryAppointmentCard {
  const bookingId = getNumber(item, ["id", "booking_id"], 0);
  const serviceLabel = getString(item, ["service_name", "service_type"], "Service");
  const statusLabel = getString(item, ["status_label"]) || formatStatusLabel(getString(item, ["status"], "Unknown"));

  return {
    id: `history-${bookingId || Math.random().toString(36).slice(2)}`,
    bookingId,
    date: getString(item, ["date"]) || formatShortDate(getString(item, ["scheduled_time", "created_at"])),
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
    const label = getString(source, ["month"]) || (parsed ? formatMonthSectionLabel(parsed) : "HISTORY");
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

function getInvitationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    const data = error.data && typeof error.data === "object" && !Array.isArray(error.data) ? (error.data as { error?: string }) : null;
    if (typeof data?.error === "string" && data.error.trim()) return data.error.trim();
    if (error.message.trim()) return error.message.trim();
  }
  return fallback;
}

function SegmentControl({ activeTab, onChange }: { activeTab: WorkTab; onChange: (tab: WorkTab) => void }) {
  return (
    <div className="rounded-full border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.04)] p-[2px]">
      <div className="grid grid-cols-2 gap-1">
        {[
          { key: "schedule" as const, label: "Schedule" },
          { key: "history" as const, label: "History" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "h-9 rounded-full px-4 font-comfortaa text-[14px] font-medium leading-[21px] transition-colors",
              activeTab === tab.key ? "bg-white text-[#4A2C55]" : "text-[#F3EAF7]",
            )}
          >
            {tab.label}
          </button>
        ))}
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

function HistorySearchField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
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

function CalendarDots({ day }: { day: CalendarDay }) {
  return (
    <div className="mt-[7px] flex min-h-[8px] items-center gap-[3px]">
      {day.green ? <span className="size-[6px] rounded-full bg-[#27AE60]" /> : null}
      {day.yellow ? <span className="size-[6px] rounded-full bg-[#F59E0B]" /> : null}
    </div>
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
  onDateClick,
  selectedDateKey,
}: {
  mode: Exclude<CalendarMode, "collapsed">;
  monthLabel: string;
  weekDays: CalendarDay[];
  monthDays: Array<CalendarDay | null>;
  onCollapse: () => void;
  onExpandMonth: () => void;
  onShowWeek: () => void;
  onDateClick: (day: CalendarDay) => void;
  selectedDateKey: string;
}) {
  const selectedMonthDay = monthDays.find((day) => day?.dateKey === selectedDateKey);
  const selectedMonthWeekdayIndex = selectedMonthDay ? getMondayFirstWeekIndex(parseDate(selectedMonthDay.dateKey) ?? new Date()) : -1;

  const renderDayButton = (day: CalendarDay) => {
    const isDisabled = day.isPast || day.isOutsideMonth;
    const isSelected = day.dateKey === selectedDateKey;

    return (
      <>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => onDateClick(day)}
          aria-label={`${day.dateKey}, completed ${day.green ? "yes" : "no"}, upcoming ${day.yellow ? "yes" : "no"}`}
          className={cn(
            "flex size-10 items-center justify-center rounded-full font-comfortaa text-[14px] font-bold leading-[21px] transition-transform active:scale-[0.96]",
            isSelected ? "bg-[#DE6A07] text-white shadow-[0px_4px_5px_rgba(222,106,7,0.3)]" : "text-[#8B6357]",
            isDisabled && !isSelected ? "cursor-default opacity-40" : "hover:bg-[#FFF5EC]",
          )}
        >
          {day.day}
        </button>
        <CalendarDots day={day} />
      </>
    );
  };

  return (
    <div className="rounded-[24px] border border-[rgba(139,99,87,0.05)] bg-white px-4 py-3 shadow-[0px_4px_8px_rgba(139,99,87,0.06)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#DE6A07]">
          <Icon name="calendar" size={15} aria-hidden="true" />
          <p className="font-comfortaa text-[16px] font-bold leading-6 text-[#8B6357]">{monthLabel}</p>
        </div>
        <button type="button" onClick={onCollapse} className="flex size-6 items-center justify-center" aria-label="Collapse calendar">
          <Icon name="chevron-down" size={16} className="text-[#F08A12]" aria-hidden="true" />
        </button>
      </div>

      {mode === "week" ? (
        <>
          <div className="mt-[14px] grid grid-cols-7 gap-y-[10px]">
            {weekDays.map((day, index) => (
              <div key={`${day.dateKey}-${index}`} className="flex flex-col items-center">
                <span
                  className={cn(
                    "font-comfortaa text-[12px] font-bold leading-[18px]",
                    day.dateKey === selectedDateKey ? "text-[#DE6A07]" : "text-[rgba(139,99,87,0.5)]",
                  )}
                >
                  {WEEKDAY_SHORT_LABELS[index]}
                </span>
                <div className="mt-[7px] flex flex-col items-center">{renderDayButton(day)}</div>
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
              {WEEKDAY_SHORT_LABELS.map((label, index) => {
                const isSelectedWeekday = selectedMonthWeekdayIndex === index;
                return (
                  <div key={label} className="flex justify-center">
                    <span
                      className={cn(
                        "font-comfortaa text-[12px] font-bold leading-[18px]",
                        isSelectedWeekday ? "text-[#DE6A07]" : "text-[rgba(139,99,87,0.5)]",
                      )}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-[6px] grid grid-cols-7 gap-y-[10px]">
              {monthDays.map((day, index) =>
                day ? (
                  <div key={day.dateKey} className="flex flex-col items-center">
                    {renderDayButton(day)}
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

function BookingRequestCard({
  request,
  onConfirmOriginalTime,
  onProposeNewTime,
  onDecline,
}: {
  request: PendingJobCard;
  onConfirmOriginalTime: (request: PendingJobCard, confirmedTime: BookingRequestDecisionTimeOption) => Promise<void>;
  onProposeNewTime: (request: PendingJobCard, timeOptions: BookingRequestDecisionTimeOption[]) => Promise<void>;
  onDecline: (request: PendingJobCard) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const headerLabel = request.time && request.time !== "Pending" ? request.time : "Booking request";

  return (
    <article className="relative overflow-hidden rounded-[14px] bg-[#A86140] px-[18px] pb-5 pt-4 shadow-[0px_10px_18px_rgba(0,0,0,0.16)]">
      <span className="absolute inset-y-0 left-0 w-[6px] bg-[#DE6A07]" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <p className="font-comfortaa text-[18px] font-bold leading-[27px] text-white">{headerLabel}</p>
        <div className="inline-flex items-center gap-1 rounded-full bg-white px-[12px] py-[6px] shadow-[0px_4px_8px_rgba(255,255,255,0.12)]">
          <Icon name="clock" size={12} className="text-[#F08A12]" aria-hidden="true" />
          <span className="font-comfortaa text-[11px] font-bold leading-[16.5px] text-[#DE6A07]">Pending</span>
        </div>
      </div>

      {isExpanded ? (
        <div className="mt-3 rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_16px_rgba(139,99,87,0.06)]">
          <p className="font-comfortaa text-[12px] leading-[18px] tracking-[0.5px] text-[#8B6357]">BOOKING REQUEST</p>
          <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Confirm appointment</h3>
          <div className="mt-4">
            <BookingRequestInteraction
              request={request}
              expanded={isExpanded}
              onToggleExpanded={() => setIsExpanded((current) => !current)}
              passAppointmentContextLabel="MY WORK > BOOKING REQUEST"
              passAppointmentReturnLabel="Back to my work"
              onConfirmOriginalTime={onConfirmOriginalTime}
              onProposeNewTime={onProposeNewTime}
              onDecline={onDecline}
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-label="Expand booking request"
          className="mt-3 w-full rounded-[10px] bg-[#F8F7F3] px-3 py-[11px] text-left"
        >
          <div className="flex items-center gap-3">
            <img src={request.avatarUrl} alt={request.petName} className="size-[50px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">
                {request.petName} - {request.breed}
              </p>
              <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
                <span aria-hidden="true">• </span>
                Owner: {request.owner}
              </p>
              {request.expiresInLabel ? (
                <div className="mt-[7px] inline-flex rounded-full border border-[#DE1507] px-[10px] py-[4px]">
                  <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#DE1507]">{request.expiresInLabel}</span>
                </div>
              ) : null}
            </div>
            <Icon name="chevron-down" size={14} className="text-[#8B6357]" aria-hidden="true" />
          </div>
        </button>
      )}
    </article>
  );
}

function UpNextAppointmentItem({
  appointment,
  isStartingTravel,
  onStartTravel,
}: {
  appointment: UpNextCard;
  isStartingTravel: boolean;
  onStartTravel: (appointment: UpNextCard) => void;
}) {
  return (
    <GroomerUpNextCard
      appointment={appointment}
      showDuration={false}
      footer={
        <>
          {appointment.showStartTravel ? (
            <button
              type="button"
              onClick={() => onStartTravel(appointment)}
              disabled={isStartingTravel}
              className="flex h-[38px] w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] font-comfortaa text-[14px] font-bold leading-[21px] text-white shadow-[0px_10px_18px_rgba(240,138,18,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isStartingTravel ? "Starting..." : "Start Travel"}
            </button>
          ) : null}
        </>
      }
    />
  );
}

function StatusCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[16px] bg-[rgba(255,255,255,0.12)] px-4 py-4 text-white">
      <p className="font-comfortaa text-[16px] font-bold leading-6">{title}</p>
      <p className="mt-2 font-comfortaa text-[13px] leading-5 text-[rgba(255,255,255,0.8)]">{description}</p>
    </div>
  );
}

function LoadingStateCard({ label }: { label: string }) {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[16px] bg-[rgba(255,255,255,0.12)] px-4 py-5">
      <Spinner size={36} color="#FFFFFF" showTrack trackOpacity={0.22} />
      <p className="font-comfortaa text-[13px] font-medium leading-5 text-[rgba(255,255,255,0.82)]">{label}</p>
    </div>
  );
}

export default function GroomerMyWorkPage() {
  const today = useMemo(() => new Date(), []);
  const todayDateKey = useMemo(() => toDateKey(today), [today]);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [selectedCalendarDateKey, setSelectedCalendarDateKey] = useState(todayDateKey);
  const {
    myWork,
    history,
    selectedHistoryDetail,
    isLoadingMyWork,
    isLoadingHistory,
    isLoadingHistoryDetail,
    isStartingTravel,
    fetchMyWork,
    fetchHistory,
    fetchHistoryDetail,
    clearHistoryDetail,
    decideInvitation,
    startTravel,
  } = useGroomerMyWorkStore();
  const [activeTab, setActiveTab] = useState<WorkTab>("schedule");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("collapsed");
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [debouncedHistorySearch, setDebouncedHistorySearch] = useState("");
  const [selectedHistoryAppointment, setSelectedHistoryAppointment] = useState<HistoryDetailsAppointment | null>(null);
  const [scheduleError, setScheduleError] = useState("");
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    fetchMyWork().catch((error) => {
      console.error("Failed to load groomer my work:", error);
      setScheduleError("Failed to load schedule.");
    });
  }, [fetchMyWork]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedHistorySearch(historySearchValue.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [historySearchValue]);

  useEffect(() => {
    if (activeTab !== "history") return;
    fetchHistory({
      pet_name: debouncedHistorySearch || undefined,
      date_to: todayDateKey,
      page: 1,
      page_size: HISTORY_PAGE_SIZE,
    }).catch((error) => {
      console.error("Failed to load groomer history:", error);
      setHistoryError("Failed to load history.");
    });
  }, [activeTab, debouncedHistorySearch, fetchHistory, todayDateKey]);

  const myWorkRecord = useMemo(() => asRecord(myWork), [myWork]);
  const calendarDays = useMemo(() => mapCalendarDays(myWorkRecord, today), [myWorkRecord, today]);
  const weekCalendarDays = useMemo(() => buildWeekCalendarDays(calendarDays, today), [calendarDays, today]);
  const monthCalendarDays = useMemo(() => buildMonthCalendarDays(calendarDays), [calendarDays]);
  const scheduleSections = useMemo(() => mapScheduleSections(myWorkRecord, today, todayDateKey), [myWorkRecord, today, todayDateKey]);
  const monthLabel = useMemo(() => {
    const month = asRecord(myWorkRecord.month);
    return getString(month, ["label"]) || formatMonthYear(today);
  }, [myWorkRecord, today]);
  const historySections = useMemo(() => {
    const items = getItems(history);
    const mappedAppointments = items.map((item) => mapHistoryAppointment(item));
    return groupHistoryAppointments(mappedAppointments, items);
  }, [history]);

  const hasScheduleContent = scheduleSections.some((section) => section.pendingJobs.length > 0 || section.upNext.length > 0);
  const hasHistoryAppointments = historySections.some((section) => section.appointments.length > 0);

  const handleCalendarDateClick = (day: CalendarDay) => {
    if (day.isPast || day.isOutsideMonth) return;
    setSelectedCalendarDateKey(day.dateKey);
    sectionRefs.current[day.dateKey]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleTabChange = (tab: WorkTab) => {
    setActiveTab(tab);
    if (tab !== "schedule") setCalendarMode("collapsed");
  };

  const refreshMyWorkAfterAction = async () => {
    await fetchMyWork();
  };

  const handleConfirmOriginalTime = async (request: PendingJobCard, confirmedTime: BookingRequestDecisionTimeOption) => {
    if (!request.invitationId) {
      toast.error("Missing booking invitation");
      return;
    }
    try {
      await decideInvitation(request.invitationId, {
        action: "confirm_original_time",
        confirmed_time: confirmedTime,
        note: "",
      });
      toast.success("Appointment confirmed");
      await refreshMyWorkAfterAction();
    } catch (error) {
      console.error("Failed to confirm booking invitation:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to confirm appointment"));
      throw error;
    }
  };

  const handleProposeNewTime = async (request: PendingJobCard, timeOptions: BookingRequestDecisionTimeOption[]) => {
    if (!request.invitationId) {
      toast.error("Missing booking invitation");
      return;
    }
    try {
      await decideInvitation(request.invitationId, {
        action: "propose_new_time",
        time_options: timeOptions,
        note: "",
      });
      toast.success("New time proposed");
      await refreshMyWorkAfterAction();
    } catch (error) {
      console.error("Failed to propose new time:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to propose new time"));
      throw error;
    }
  };

  const handleDeclinePendingJob = async (request: PendingJobCard) => {
    if (!request.invitationId) {
      toast.error("Missing booking invitation");
      return;
    }
    try {
      await decideInvitation(request.invitationId, { action: "decline", note: "" });
      toast.success("Appointment passed");
      await refreshMyWorkAfterAction();
    } catch (error) {
      console.error("Failed to pass booking invitation:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to pass appointment"));
      throw error;
    }
  };

  const handleStartTravel = async (appointment: UpNextCard) => {
    if (!appointment.bookingId || isStartingTravel) return;
    try {
      await startTravel(appointment.bookingId);
      toast.success("Travel started");
      await refreshMyWorkAfterAction();
    } catch (error) {
      console.error("Failed to start travel:", error);
      toast.error("Failed to start travel");
    }
  };

  const openHistoryDetails = async (appointment: HistoryAppointmentCard) => {
    setSelectedHistoryAppointment({
      id: String(appointment.bookingId),
      petName: appointment.petName,
      breed: appointment.breed,
      serviceLabel: appointment.badges[0]?.label,
    });
    if (!appointment.bookingId) return;
    try {
      await fetchHistoryDetail(appointment.bookingId);
    } catch (error) {
      console.error("Failed to load history detail:", error);
      toast.error("Failed to load history details");
    }
  };

  const closeHistoryDetails = () => {
    setSelectedHistoryAppointment(null);
    clearHistoryDetail();
  };

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-2">
      <div className="space-y-4">
        <SegmentControl activeTab={activeTab} onChange={handleTabChange} />

        {activeTab === "schedule" ? (
          calendarMode === "collapsed" ? (
            <button
              type="button"
              onClick={() => setCalendarMode("week")}
              className="inline-flex h-9 items-center gap-2 rounded-[12px] border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.08)] px-4 font-comfortaa text-[14px] font-medium leading-[21px] text-white"
            >
              <Icon name="calendar" className="size-4 text-white" aria-hidden="true" />
              <span>My calendar</span>
            </button>
          ) : (
            <CalendarOverviewCard
              mode={calendarMode}
              monthLabel={monthLabel}
              weekDays={weekCalendarDays}
              monthDays={monthCalendarDays}
              onCollapse={() => setCalendarMode("collapsed")}
              onExpandMonth={() => setCalendarMode("month")}
              onShowWeek={() => setCalendarMode("week")}
              onDateClick={handleCalendarDateClick}
              selectedDateKey={selectedCalendarDateKey}
            />
          )
        ) : (
          <HistorySearchField value={historySearchValue} onChange={setHistorySearchValue} />
        )}

        <div className="space-y-5">
          {activeTab === "schedule" ? (
            <>
              {isLoadingMyWork ? <LoadingStateCard label="Loading schedule..." /> : null}
              {!isLoadingMyWork && scheduleError ? <StatusCard title="Schedule unavailable" description={scheduleError} /> : null}
              {!isLoadingMyWork && !scheduleError && !hasScheduleContent ? (
                <StatusCard title="No schedule found" description="There are no pending jobs or appointments for this month." />
              ) : null}

              {!isLoadingMyWork && !scheduleError
                ? scheduleSections.map((section) => (
                    <section
                      key={section.id}
                      ref={(element) => {
                        sectionRefs.current[section.dateKey] = element;
                      }}
                      className="scroll-mt-4 space-y-4"
                    >
                      <DateSectionHeader label={section.label} />

                      {section.pendingJobs.length > 0 ? (
                        <div className="space-y-3">
                          {section.pendingJobs.map((request) => (
                            <BookingRequestCard
                              key={request.id}
                              request={request}
                              onConfirmOriginalTime={handleConfirmOriginalTime}
                              onProposeNewTime={handleProposeNewTime}
                              onDecline={handleDeclinePendingJob}
                            />
                          ))}
                        </div>
                      ) : null}

                      {section.upNext.length > 0 ? (
                        <div className="space-y-3">
                          {section.upNext.map((appointment) => (
                            <UpNextAppointmentItem
                              key={appointment.id}
                              appointment={appointment}
                              isStartingTravel={isStartingTravel}
                              onStartTravel={handleStartTravel}
                            />
                          ))}
                        </div>
                      ) : null}

                      {section.pendingJobs.length === 0 && section.upNext.length === 0 ? (
                        <StatusCard title="No bookings" description="No jobs or appointments are scheduled for this date." />
                      ) : null}
                    </section>
                  ))
                : null}
            </>
          ) : (
            <>
              {isLoadingHistory ? <LoadingStateCard label="Loading history..." /> : null}
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
                              onClick={() => void openHistoryDetails(appointment)}
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
          )}
        </div>
      </div>

      <HistoryDetailsModal
        open={selectedHistoryAppointment !== null}
        appointment={selectedHistoryAppointment}
        detail={selectedHistoryDetail}
        isLoading={isLoadingHistoryDetail}
        onClose={closeHistoryDetails}
      />
    </div>
  );
}

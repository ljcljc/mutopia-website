import { useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import { BookingRequestContent } from "@/modules/groomer/components/BookingRequestContent";
import { HistoryDetailsModal, type HistoryDetailsAppointment } from "@/modules/groomer/components/HistoryDetailsModal";
import { GroomerUpNextCard, type GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";

type WorkTab = "schedule" | "history";
type CalendarMode = "collapsed" | "week" | "month";

type AppointmentCard = GroomerUpNextAppointment & {
  id: string;
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
  appointments: AppointmentCard[];
};

type HistoryBadgeTone = "service" | "success" | "warning" | "neutral";

type HistoryBadge = {
  label: string;
  tone: HistoryBadgeTone;
};

type HistoryAppointmentCard = {
  id: string;
  date: string;
  petName: string;
  breed: string;
  amount: string;
  badges: HistoryBadge[];
  tip?: string;
  timeline?: string[];
};

type HistorySection = {
  id: string;
  label: string;
  appointments: HistoryAppointmentCard[];
};

type ScheduleMockEntry = AppointmentCard & {
  dayOffset: number;
  dotColors?: string[];
};

const WEEKDAY_SHORT_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const WEEKDAY_FULL_LABELS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"] as const;
const MONTH_SHORT_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;

const scheduleMockEntries: ScheduleMockEntry[] = [
  {
    id: "max",
    dayOffset: 0,
    petName: "Max",
    breed: "Golden retriever",
    avatarUrl: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
    owner: "Emma Johnson",
    address: "565 West 207th Street",
    service: "Full Groom Package",
    duration: "Est. duration: 90 minutes",
    time: "2:00 PM",
    showStartTravel: true,
    dotColors: ["#00A63E", "#59C36A"],
  },
  {
    id: "charlie",
    dayOffset: 0,
    petName: "Charlie",
    breed: "Shih Tzu",
    avatarUrl: "https://placedog.net/160/160?id=7",
    owner: "Jean Johnson",
    address: "320 East 54th Street",
    service: "Bath & Brush",
    duration: "Est. duration: 60 minutes",
    time: "4:30 PM",
    dotColors: ["#F59E0B"],
  },
  {
    id: "bella",
    dayOffset: 1,
    petName: "Bella",
    breed: "Poodle",
    avatarUrl: "https://images.dog.ceo/breeds/poodle-toy/n02113624_9550.jpg",
    owner: "Angela Reed",
    address: "210 Riverside Blvd",
    service: "Bath & Brush",
    duration: "Est. duration: 55 minutes",
    time: "11:00 AM",
    dotColors: ["#00A63E", "#F59E0B"],
  },
  {
    id: "luna",
    dayOffset: 1,
    petName: "Luna",
    breed: "French Bulldog",
    avatarUrl: "https://images.dog.ceo/breeds/bulldog-french/n02108915_5306.jpg",
    owner: "Mia Carter",
    address: "88 Columbus Avenue",
    service: "Bath & Nails",
    duration: "Est. duration: 45 minutes",
    time: "3:15 PM",
    dotColors: ["#59C36A"],
  },
];

function formatMonthYear(date: Date) {
  return `${MONTH_SHORT_LABELS[date.getMonth()].charAt(0)}${MONTH_SHORT_LABELS[date.getMonth()].slice(1).toLowerCase()} ${date.getFullYear()}`;
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

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}

function formatScheduleSectionLabel(date: Date, today: Date) {
  const weekday = WEEKDAY_FULL_LABELS[getMondayFirstWeekIndex(date)];
  const month = MONTH_SHORT_LABELS[date.getMonth()];
  const base = `${weekday}, ${month} ${date.getDate()}`;

  if (isSameDay(date, today)) {
    return `TODAY - ${base}`;
  }

  if (isSameDay(date, addDays(today, 1))) {
    return `TOMORROW - ${base}`;
  }

  return base;
}

function getDotColorsForEntries(entries: ScheduleMockEntry[]) {
  return Array.from(new Set(entries.flatMap((entry) => entry.dotColors ?? [])));
}

function buildCalendarWeekDays(today: Date, entries: ScheduleMockEntry[]): CalendarWeekDay[] {
  const startOfWeek = getStartOfWeek(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(startOfWeek, index);
    const dayEntries = entries.filter((entry) => isSameDay(addDays(today, entry.dayOffset), date));
    const dots = getDotColorsForEntries(dayEntries);

    return {
      label: WEEKDAY_SHORT_LABELS[index],
      date: String(date.getDate()),
      active: isSameDay(date, today),
      dots: dots.length > 0 ? dots : undefined,
    };
  });
}

function buildMonthCalendarDays(today: Date, entries: ScheduleMockEntry[]): Array<CalendarMonthDay | null> {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const leadingEmptyDays = getMondayFirstWeekIndex(firstDayOfMonth);
  const days: Array<CalendarMonthDay | null> = Array.from({ length: leadingEmptyDays }, () => null);

  for (let day = 1; day <= lastDayOfMonth.getDate(); day += 1) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    const dayEntries = entries.filter((entry) => isSameDay(addDays(today, entry.dayOffset), date));
    const dots = getDotColorsForEntries(dayEntries);

    days.push({
      date: String(day),
      active: isSameDay(date, today),
      dots: dots.length > 0 ? dots : undefined,
    });
  }

  return days;
}

function buildVisibleScheduleSections(today: Date, entries: ScheduleMockEntry[]): AppointmentSection[] {
  return [0, 1].map((offset) => {
    const date = addDays(today, offset);
    const dayAppointments = entries
      .filter((entry) => entry.dayOffset === offset)
      .map(({ dayOffset: _dayOffset, dotColors: _dotColors, ...appointment }) => appointment);

    return {
      id: `visible-day-${offset}`,
      label: formatScheduleSectionLabel(date, today),
      appointments: dayAppointments,
    };
  });
}

const historySections: HistorySection[] = [
  {
    id: "history-mar-2026",
    label: "MARCH 2026",
    appointments: [
      {
        id: "history-max",
        date: "Mar 12",
        petName: "Max",
        breed: "Golden Retriever",
        amount: "$105.00",
        timeline: ["Start travel:", "Check in:", "Start service:"],
        badges: [
          { label: "Full Groom", tone: "service" },
          { label: "Confirmed", tone: "success" },
        ],
        tip: "+$20.00 Tip",
      },
      {
        id: "history-bella",
        date: "Mar 12",
        petName: "Bella",
        breed: "Poodle",
        amount: "$85.00",
        badges: [
          { label: "Bath & Brush", tone: "service" },
          { label: "Pending confirmation", tone: "warning" },
        ],
        tip: "+$20.00 Tip",
      },
      {
        id: "history-charlie",
        date: "Mar 9",
        petName: "Charlie",
        breed: "Shih Tzu",
        amount: "$95.00",
        badges: [
          { label: "Full Groom", tone: "service" },
          { label: "Confirmed", tone: "success" },
        ],
        tip: "+$15.00 Tip",
      },
      {
        id: "history-luna",
        date: "Mar 8",
        petName: "Luna",
        breed: "French Bulldog",
        amount: "$65.00",
        badges: [
          { label: "Confirmed Handshake", tone: "success" },
          { label: "Bath & Nails", tone: "neutral" },
        ],
        tip: "+$10.00 Tip",
      },
      {
        id: "history-cooper",
        date: "Mar 7",
        petName: "Cooper",
        breed: "Labrador",
        amount: "$110.00",
        badges: [
          { label: "Confirmed Handshake", tone: "success" },
          { label: "Full Groom", tone: "neutral" },
        ],
      },
    ],
  },
];

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
        placeholder="Search past work by pet name, date..."
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

      {appointment.timeline ? (
        <div className="mt-3 flex flex-col gap-1 font-comfortaa text-[10px] leading-[12px] text-[#4A3C2A]">
          {appointment.timeline.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-3">
        {appointment.badges.map((badge) => (
          <HistoryBadgeView key={`${appointment.id}-${badge.label}`} badge={badge} />
        ))}
      </div>

      {appointment.tip ? (
        <div className="mt-3 inline-flex h-7 items-center gap-[6px] rounded-[12px] border border-[rgba(222,106,7,0.1)] bg-[rgba(222,106,7,0.1)] px-[14px]">
          <Icon name="gift" className="size-[14px] text-[#DE6A07]" aria-hidden="true" />
          <span className="font-comfortaa text-[13px] font-bold leading-[19.5px] text-[#DE6A07]">{appointment.tip}</span>
        </div>
      ) : null}
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
                <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#DE1507]">Expired in 24 hours</span>
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

export default function GroomerMyWorkPage() {
  const today = useMemo(() => new Date(), []);
  const [activeTab, setActiveTab] = useState<WorkTab>("schedule");
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("collapsed");
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [selectedHistoryAppointment, setSelectedHistoryAppointment] = useState<HistoryDetailsAppointment | null>(null);
  const [pendingAppointmentIds, setPendingAppointmentIds] = useState<string[]>([]);
  const [expandedPendingAppointmentIds, setExpandedPendingAppointmentIds] = useState<string[]>([]);
  const calendarWeekDays = useMemo(() => buildCalendarWeekDays(today, scheduleMockEntries), [today]);
  const monthCalendarDays = useMemo(() => buildMonthCalendarDays(today, scheduleMockEntries), [today]);
  const visibleScheduleSections = useMemo(() => buildVisibleScheduleSections(today, scheduleMockEntries), [today]);
  const monthLabel = useMemo(() => formatMonthYear(today), [today]);
  const filteredHistorySections = useMemo(() => {
    const keyword = historySearchValue.trim().toLowerCase();

    if (!keyword) {
      return historySections;
    }

    return historySections.map((section) => ({
      ...section,
      appointments: section.appointments.filter((appointment) =>
        [appointment.petName, appointment.breed, appointment.date].some((field) => field.toLowerCase().includes(keyword)),
      ),
    }));
  }, [historySearchValue]);

  const handleTabChange = (tab: WorkTab) => {
    setActiveTab(tab);
    if (tab !== "schedule") {
      setCalendarMode("collapsed");
    }
  };

  const openHistoryDetails = (appointment: HistoryAppointmentCard) => {
    setSelectedHistoryAppointment({
      id: appointment.id,
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
              <section className="space-y-4">
                <DateSectionHeader label={visibleScheduleSections[0]?.label ?? ""} />
                <div className="space-y-3">
                  {visibleScheduleSections[0]?.appointments.map(renderScheduleAppointment)}
                </div>
              </section>

              {visibleScheduleSections.slice(1).map((section) => (
                <section key={section.id} className="space-y-4">
                  <DateSectionHeader label={section.label} />
                  {section.appointments.length > 0 ? <div className="space-y-3">{section.appointments.map(renderScheduleAppointment)}</div> : null}
                </section>
              ))}
            </>
          ) : (
            <>
              {activeTab === "history"
                ? filteredHistorySections.map((section) => (
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
                : visibleScheduleSections.map((section) => (
                    <section key={section.id} className="space-y-4">
                      <DateSectionHeader label={section.label} />
                      {section.appointments.length > 0 ? (
                        <div className="space-y-3">{section.appointments.map(renderScheduleAppointment)}</div>
                      ) : null}
                    </section>
                  ))}
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

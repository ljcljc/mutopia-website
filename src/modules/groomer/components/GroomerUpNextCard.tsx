import { useEffect, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/common/Icon";
import { formatTimezoneChangeNotice } from "@/lib/localDateTime";

export type GroomerUpNextAppointment = {
  petName: string;
  breed: string;
  owner: string;
  avatarUrl: string;
  address: string;
  service: string;
  duration: string;
  time: string;
  scheduledTime?: string;
  businessTimezone?: string;
  previousBusinessTimezone?: string;
};

function formatTimeLeft(minutesLeft: number): string {
  if (minutesLeft <= 0) return "";
  const days = Math.floor(minutesLeft / 1_440);
  const hours = Math.floor((minutesLeft % 1_440) / 60);
  const minutes = minutesLeft % 60;
  const parts = [
    days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : "",
    hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "",
    minutes > 0 ? `${minutes} min` : "",
  ].filter(Boolean);
  return `${parts.join(" ")} left`;
}

export function GroomerUpNextCard({
  appointment,
  footer,
  eyebrow = "UP NEXT",
  title = "Next appointment",
  timeBadgeTone = "orange",
  serviceIconName = "full-grooming",
  showDuration = true,
  onPetNameClick,
}: {
  appointment: GroomerUpNextAppointment;
  footer?: ReactNode;
  eyebrow?: string;
  title?: string;
  timeBadgeTone?: "orange" | "blue";
  serviceIconName?: IconName;
  showDuration?: boolean;
  onPetNameClick?: () => void;
}) {
  const isBlueTone = timeBadgeTone === "blue";
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const start = appointment.scheduledTime ? Date.parse(appointment.scheduledTime) : NaN;
  const minutesLeft = Number.isNaN(start) ? 0 : Math.ceil((start - now) / 60_000);
  const timeLeft = formatTimeLeft(minutesLeft);
  const timezoneNotice = formatTimezoneChangeNotice(appointment.businessTimezone, appointment.previousBusinessTimezone, appointment.scheduledTime);

  return (
    <article className="rounded-[20px] bg-white px-4 py-5 shadow-[0px_4px_14px_rgba(0,0,0,0.1)] sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-comfortaa text-[11px] leading-[16.5px] tracking-[0.5px] text-[#A07D72]">{eyebrow}</p>
          <h2 className="mt-1 font-comfortaa text-[18px] leading-[27px] text-[#4A2C55]">{title}</h2>
        </div>
        <div className="shrink-0 text-right">
          <div className={isBlueTone ? "rounded-full bg-[#DBEAFE] px-3.5 py-2" : "rounded-full bg-[#FFF5EC] px-3.5 py-2"}>
            <span className={isBlueTone ? "font-comfortaa text-[14px] font-bold leading-[21px] text-[#5B7FE8]" : "font-comfortaa text-[14px] font-bold leading-[21px] text-[#C8842C]"}>
              {appointment.time}
            </span>
          </div>
          {timeLeft ? (
            <p className="mt-1 font-comfortaa text-[11px] leading-4 text-[#4A2C55]">{timeLeft}</p>
          ) : null}
        </div>
      </div>

      {timezoneNotice ? (
        <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-[#D6B944] bg-[#FFFBEA] px-3 py-2 text-[#8B741F]">
          <Icon name="alert-warning" className="size-4 shrink-0" aria-hidden="true" />
          <p className="font-comfortaa text-[11px] leading-4">{timezoneNotice}</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-[14px] bg-[#FAF8F4] px-3 py-3">
        <div className="flex items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-[44px] rounded-full object-cover" />
          <div className="min-w-0">
            {onPetNameClick ? (
              <button
                type="button"
                onClick={onPetNameClick}
                className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55] underline underline-offset-[2px] cursor-pointer"
              >
                {appointment.petName}
              </button>
            ) : (
              <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">{appointment.petName}</p>
            )}
            <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">{appointment.breed}</p>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
              <span aria-hidden="true">• </span>
              Owner: {appointment.owner}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-5">
        <div className="flex items-start gap-2.5">
          <Icon name="location" className="mt-[2px] size-4 text-[#F08A12]" aria-hidden="true" />
          <div>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">ADDRESS</p>
            <p className="mt-0.5 font-comfortaa text-[14px] leading-[21px] text-[#F08A12] underline underline-offset-[2px] cursor-pointer">{appointment.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Icon name={serviceIconName} className="mt-[2px] size-4 text-[#F08A12]" aria-hidden="true" />
          <div>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">SERVICE</p>
            <p className="mt-0.5 font-comfortaa text-[15px] leading-[22.5px] text-[#4A2C55]">{appointment.service}</p>
            {showDuration ? (
              <p className="mt-0.5 font-comfortaa text-[13px] leading-[19.5px] text-[#A07D72]">{appointment.duration}</p>
            ) : null}
          </div>
        </div>
      </div>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </article>
  );
}

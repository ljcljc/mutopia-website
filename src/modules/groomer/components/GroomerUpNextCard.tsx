import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/common/Icon";

export type GroomerUpNextAppointment = {
  petName: string;
  breed: string;
  owner: string;
  avatarUrl: string;
  address: string;
  service: string;
  duration: string;
  time: string;
};

export function GroomerUpNextCard({
  appointment,
  footer,
  timeBadgeTone = "orange",
  serviceIconName = "full-grooming",
  showDuration = true,
}: {
  appointment: GroomerUpNextAppointment;
  footer?: ReactNode;
  timeBadgeTone?: "orange" | "blue";
  serviceIconName?: IconName;
  showDuration?: boolean;
}) {
  const isBlueTone = timeBadgeTone === "blue";

  return (
    <article className="rounded-[16px] bg-white px-4 py-4 shadow-[0px_4px_14px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-comfortaa text-[11px] leading-[16.5px] tracking-[0.5px] text-[#A07D72]">UP NEXT</p>
          <h2 className="mt-1 font-comfortaa text-[18px] leading-[27px] text-[#4A2C55]">Next appointment</h2>
        </div>
        <div className={isBlueTone ? "rounded-full bg-[#DDEBFF] px-3.5 py-[7px]" : "rounded-full bg-[#FFF5EC] px-3.5 py-[7px]"}>
          <span className={isBlueTone ? "font-comfortaa text-[14px] font-bold leading-[21px] text-[#5B7FE8]" : "font-comfortaa text-[14px] font-bold leading-[21px] text-[#F08A12]"}>
            {appointment.time}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] bg-[#FAF8F4] px-3 py-3">
        <div className="flex items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-[44px] rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">{appointment.petName}</p>
            <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">{appointment.breed}</p>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
              <span aria-hidden="true">• </span>
              Owner: {appointment.owner}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <Icon name="location" className="mt-[2px] size-4 text-[#F08A12]" aria-hidden="true" />
          <div>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">ADDRESS</p>
            <p className="mt-0.5 font-comfortaa text-[14px] leading-[21px] text-[#F08A12] underline underline-offset-[2px]">{appointment.address}</p>
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

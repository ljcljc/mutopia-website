import { useState, type ReactNode } from "react";
import { CustomSelect, CustomSelectItem } from "@/components/common/CustomSelect";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";

export type BookingRequestContentData = {
  petName: string;
  breed: string;
  owner: string;
  avatarUrl: string;
  address: string;
  service: string;
  duration: string;
};

type BookingRequestContentProps = {
  request: BookingRequestContentData;
  proposalSlots?: string[];
  accessory?: ReactNode;
  eyebrow?: string;
  title?: string;
  className?: string;
};

const DEFAULT_PROPOSAL_SLOTS = ["2026.05.24 AM", "2026.05.26 PM", "2026.05.29 AM"] as const;
const DEFAULT_TIME_OPTIONS = ["09:00 AM", "10:30 AM", "01:00 PM"] as const;

export function BookingRequestContent({
  request,
  proposalSlots = [...DEFAULT_PROPOSAL_SLOTS],
  accessory,
  eyebrow = "BOOKING REQUEST",
  title = "Confirm appointment",
  className,
}: BookingRequestContentProps) {
  const [selectedProposalSlot, setSelectedProposalSlot] = useState(proposalSlots[0] ?? "");
  const [availableTimeBySlot, setAvailableTimeBySlot] = useState<Record<string, string>>({});

  return (
    <div className={cn(className)}>
      <p className="font-comfortaa text-[11px] leading-[16.5px] tracking-[0.5px] text-[#A07D72]">{eyebrow}</p>
      <h3 className="mt-1 font-comfortaa text-[18px] leading-[27px] text-[#4A2C55]">{title}</h3>

      <div className="mt-4 rounded-[16px] border border-[#E5E7EB] bg-[#FAF9F7] px-3 py-3">
        <div className="rounded-[16px] bg-[#FAF9F7]">
          <div className="flex items-center gap-3">
            <img src={request.avatarUrl} alt={request.petName} className="size-[48px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">
                {request.petName} - {request.breed}
              </p>
              <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
                <span aria-hidden="true">• </span>
                Owner: {request.owner}
              </p>
            </div>
            {accessory}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-2.5">
            <Icon name="location" className="mt-[2px] size-4 text-[#15A34A]" aria-hidden="true" />
            <div>
              <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">ADDRESS</p>
              <p className="mt-0.5 font-comfortaa text-[14px] leading-[21px] text-[#15A34A]">{request.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Icon name="full-grooming" className="mt-[2px] size-4 text-[#15A34A]" aria-hidden="true" />
            <div>
              <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">SERVICE</p>
              <p className="mt-0.5 font-comfortaa text-[15px] leading-[22.5px] text-[#4A2C55]">{request.service}</p>
              <p className="mt-0.5 font-comfortaa text-[13px] leading-[19.5px] text-[#A07D72]">{request.duration}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[14px] border border-[#CDEFD7] bg-[#F3FCF6] px-3 py-3">
          <p className="font-comfortaa text-[12px] leading-[18px] text-[#15A34A]">Specify your available time from one date</p>

          <div className="mt-3 space-y-3">
            {proposalSlots.map((slot) => (
              <div key={slot}>
                <label className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProposalSlot(slot)}
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border",
                      selectedProposalSlot === slot ? "border-[#8B6357]" : "border-[#A8A29E]",
                    )}
                    aria-label={`Select ${slot}`}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        selectedProposalSlot === slot ? "bg-[#F08A12]" : "bg-transparent",
                      )}
                    />
                  </button>
                  <span className="font-comfortaa text-[12px] leading-[18px] text-[#4A2C55]">{slot}</span>
                </label>

                {selectedProposalSlot === slot ? (
                  <div className="mt-2">
                    <p className="font-comfortaa text-[12px] leading-[18px] text-[#4A2C55]">Available time</p>
                    <CustomSelect
                      value={availableTimeBySlot[slot] ?? ""}
                      onValueChange={(value) =>
                        setAvailableTimeBySlot((current) => ({
                          ...current,
                          [slot]: value,
                        }))
                      }
                      placeholder="Select or type time"
                      className="rounded-[10px] border-[#D9D2E8] text-[12px] text-[#8B6357]"
                    >
                      {DEFAULT_TIME_OPTIONS.map((time) => (
                        <CustomSelectItem key={time} value={time}>
                          {time}
                        </CustomSelectItem>
                      ))}
                    </CustomSelect>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#06AF3D] px-4 font-comfortaa text-[16px] font-bold leading-6 text-white shadow-[0px_8px_18px_rgba(6,175,61,0.22)] transition-[transform,filter] duration-150 active:scale-[0.98] active:brightness-95"
          >
            <Icon name="target" className="size-5 text-white" aria-hidden="true" />
            Confirm
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#F08A12] bg-white px-4 font-comfortaa text-[16px] font-bold leading-6 text-[#F08A12] transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-[#FFF7ED]"
          >
            <Icon name="calendar" className="size-5 text-[#F08A12]" aria-hidden="true" />
            Propose new time
          </button>
          <button
            type="button"
            className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357] underline underline-offset-[2px]"
          >
            Pass appointment
          </button>
        </div>
      </div>
    </div>
  );
}

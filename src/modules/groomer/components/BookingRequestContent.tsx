import { useState, type ReactNode } from "react";
import { CustomSelect, CustomSelectItem } from "@/components/common/CustomSelect";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import { PassAppointmentModal } from "@/modules/groomer/components/PassAppointmentModal";
import { ProposeNewTimeModal } from "@/modules/groomer/components/ProposeNewTimeModal";

export type BookingRequestContentData = {
  petName: string;
  breed: string;
  owner: string;
  avatarUrl: string;
  address: string;
  service: string;
  duration: string;
  proposalSlots?: string[];
  expiresInLabel?: string;
};

type BookingRequestContentProps = {
  request: BookingRequestContentData;
  proposalSlots?: string[];
  accessory?: ReactNode;
  expanded?: boolean;
  eyebrow?: string;
  title?: string;
  showHeader?: boolean;
  className?: string;
  passAppointmentContextLabel?: string;
  passAppointmentReturnLabel?: string;
};

const DEFAULT_PROPOSAL_SLOTS = ["2026.05.24 AM", "2026.05.26 PM", "2026.05.29 AM"] as const;
const DEFAULT_TIME_OPTIONS = ["09:00 AM", "10:30 AM", "01:00 PM"] as const;

export function BookingRequestContent({
  request,
  proposalSlots = request.proposalSlots?.length ? request.proposalSlots : [...DEFAULT_PROPOSAL_SLOTS],
  accessory,
  expanded = true,
  eyebrow = "BOOKING REQUEST",
  title = "Confirm appointment",
  showHeader = true,
  className,
  passAppointmentContextLabel = "BOOKING REQUEST",
  passAppointmentReturnLabel = "Go back",
}: BookingRequestContentProps) {
  const [selectedProposalSlot, setSelectedProposalSlot] = useState(proposalSlots[0] ?? "");
  const [availableTimeBySlot, setAvailableTimeBySlot] = useState<Record<string, string>>({});
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const expiryBadgeColor = request.expiresInLabel === "Expired" ? "#DE1507" : "#DE6A07";

  return (
    <div className={cn(className)}>
      {showHeader ? (
        <>
          <p className="font-comfortaa text-[12px] leading-[18px] tracking-[0.5px] text-[#8B6357]">{eyebrow}</p>
          <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">{title}</h3>
        </>
      ) : null}

      <div className={cn("rounded-[16px] border border-[#E5E7EB] bg-[#FAF9F7] px-4 pb-4", showHeader ? "mt-4" : "")}>
        <div className="rounded-[16px] bg-[#FAF9F7] py-3">
          <div className="flex items-center gap-5">
            <img src={request.avatarUrl} alt={request.petName} className="size-[42px] rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-comfortaa text-[14px] leading-[20px] text-[#4A2C55]">
                <span className="font-bold">{request.petName} - </span>
                <span>{request.breed}</span>
              </p>
              <div className="mt-0.5 flex items-center gap-1">
                <span className="size-[6px] rounded-full bg-[#00A63E]" aria-hidden="true" />
                <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#00A63E]">Owner: {request.owner}</p>
              </div>
              {request.expiresInLabel ? (
                <div
                  className="mt-[7px] inline-flex rounded-full border px-[10px] py-[4px]"
                  style={{ borderColor: expiryBadgeColor }}
                >
                  <span
                    className="font-comfortaa text-[11px] leading-[16.5px]"
                    style={{ color: expiryBadgeColor }}
                  >
                    {request.expiresInLabel}
                  </span>
                </div>
              ) : null}
            </div>
            {accessory}
          </div>
        </div>

        {expanded ? (
          <>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-4">
              <div className="flex items-start gap-3">
                <Icon name="location" className="size-[18px] text-[#00A63E]" aria-hidden="true" />
                <div>
                  <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#8B6357]">ADDRESS</p>
                  <p className="mt-1 font-comfortaa text-[14px] font-medium leading-[21px] text-[#00A63E]">{request.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Icon name="calendar" className="mt-[2px] size-[18px] text-[#00A63E]" aria-hidden="true" />
                <div>
                  <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#8B6357]">SERVICE</p>
                  <p className="mt-0.5 font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{request.service}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[12px] border border-[#BBF7D0] bg-[#F0FDF4] p-3">
              <p className="font-comfortaa text-[11px] font-medium leading-[16.5px] text-[#166534]">Specify your available time from one date</p>

              <div className="mt-2 space-y-2.5">
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
                      <span className="font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#4A3C2A]">{slot}</span>
                    </label>

                    {selectedProposalSlot === slot ? (
                      <div className="mt-1">
                        <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">Available time</p>
                        <div className="mt-1 w-[167px]">
                          <CustomSelect
                            value={availableTimeBySlot[slot] ?? ""}
                            onValueChange={(value) =>
                              setAvailableTimeBySlot((current) => ({
                                ...current,
                                [slot]: value,
                              }))
                            }
                            placeholder="Select or type time"
                            className="rounded-[8px] border-[#E5E7EB] text-[12.25px] text-[#717182]"
                          >
                            {DEFAULT_TIME_OPTIONS.map((time) => (
                              <CustomSelectItem key={time} value={time}>
                                {time}
                              </CustomSelectItem>
                            ))}
                          </CustomSelect>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-[10px]">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#00A63E] px-4 font-comfortaa text-[16px] font-bold leading-6 text-white shadow-[0px_4px_12px_rgba(0,166,62,0.3)] transition-[transform,filter] duration-150 active:scale-[0.98] active:brightness-95"
              >
                <Icon name="target" className="size-5 text-white" aria-hidden="true" />
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                className="inline-flex h-12 items-center justify-center gap-[11px] rounded-full border-[1.5px] border-[#F59E0B] bg-white px-4 font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#F59E0B] transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-[#FFF7ED]"
              >
                <Icon name="calendar" className="size-5 text-[#F59E0B]" aria-hidden="true" />
                Propose new time
              </button>
              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
                className="py-[7px] font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline underline-offset-2"
              >
                Pass appointment
              </button>
            </div>
          </>
        ) : null}
      </div>

      <PassAppointmentModal
        open={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        contextLabel={passAppointmentContextLabel}
        returnLabel={passAppointmentReturnLabel}
      />
      <ProposeNewTimeModal
        open={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        initialServiceSlot={selectedProposalSlot || proposalSlots[0]}
      />
    </div>
  );
}

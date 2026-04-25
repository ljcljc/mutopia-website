import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import {
  AvailableTimeCombobox,
  getAvailableTimeOptions,
} from "@/modules/groomer/components/AvailableTimeCombobox";
import { PassAppointmentModal } from "@/modules/groomer/components/PassAppointmentModal";
import { ProposeNewTimeModal } from "@/modules/groomer/components/ProposeNewTimeModal";
import { toast } from "sonner";

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

export type BookingRequestDecisionTimeOption = {
  date: string;
  slot: "am" | "pm";
  time: string;
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
  onConfirmOriginalTime?: (confirmedTime: BookingRequestDecisionTimeOption) => Promise<void> | void;
  onProposeNewTime?: (timeOptions: BookingRequestDecisionTimeOption[]) => Promise<void> | void;
  onDecline?: () => Promise<void> | void;
};

const DEFAULT_PROPOSAL_SLOTS = ["2026.05.24 AM", "2026.05.26 PM", "2026.05.29 AM"] as const;

function normalizeTimeInput(value: string): string | null {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function buildDecisionTimeOption(slot: string, time: string): BookingRequestDecisionTimeOption | null {
  const [dateValue, periodValue] = slot.trim().split(/\s+/);
  const normalizedTime = normalizeTimeInput(time);
  const normalizedPeriod = periodValue?.toLowerCase();

  if (!dateValue || !normalizedTime || (normalizedPeriod !== "am" && normalizedPeriod !== "pm")) return null;

  const selectedHour = Number(normalizedTime.split(":")[0]);
  if (normalizedPeriod === "am" && selectedHour >= 12) return null;
  if (normalizedPeriod === "pm" && selectedHour < 12) return null;

  return {
    date: dateValue.replace(/\./g, "-"),
    slot: normalizedPeriod,
    time: normalizedTime,
  };
}

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
  onConfirmOriginalTime,
  onProposeNewTime,
  onDecline,
}: BookingRequestContentProps) {
  const [selectedProposalSlot, setSelectedProposalSlot] = useState(proposalSlots[0] ?? "");
  const [availableTimeBySlot, setAvailableTimeBySlot] = useState<Record<string, string>>({});
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState<"confirm" | "propose" | "decline" | null>(null);
  const [contentHeight, setContentHeight] = useState<string>(expanded ? "auto" : "0px");
  const collapseContentRef = useRef<HTMLDivElement | null>(null);
  const expiryBadgeColor = request.expiresInLabel === "Expired" ? "#DE1507" : "#DE6A07";

  useEffect(() => {
    const element = collapseContentRef.current;
    if (!element) return;

    const nextHeight = `${element.scrollHeight}px`;

    if (expanded) {
      setContentHeight(nextHeight);
      const timeoutId = window.setTimeout(() => {
        setContentHeight("auto");
      }, 300);
      return () => window.clearTimeout(timeoutId);
    }

    if (contentHeight === "auto") {
      setContentHeight(nextHeight);
      const frameId = window.requestAnimationFrame(() => {
        setContentHeight("0px");
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setContentHeight("0px");
  }, [contentHeight, expanded]);

  useEffect(() => {
    if (!expanded || contentHeight !== "auto") return;
    const element = collapseContentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setContentHeight(`${element.scrollHeight}px`);
      window.requestAnimationFrame(() => {
        setContentHeight("auto");
      });
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, [contentHeight, expanded]);

  const handleConfirmAppointment = async () => {
    if (!onConfirmOriginalTime || !selectedProposalSlot) return;

    const confirmedTime = buildDecisionTimeOption(
      selectedProposalSlot,
      availableTimeBySlot[selectedProposalSlot] ?? "",
    );
    if (!confirmedTime) {
      toast.error("Please choose one valid time within the selected requested slot");
      return;
    }

    setIsSubmittingAction("confirm");
    try {
      await onConfirmOriginalTime(confirmedTime);
    } finally {
      setIsSubmittingAction(null);
    }
  };

  const handleProposeNewTime = async (timeOptions: BookingRequestDecisionTimeOption[]) => {
    if (!onProposeNewTime) return;

    setIsSubmittingAction("propose");
    try {
      await onProposeNewTime(timeOptions);
      setIsProposeModalOpen(false);
    } finally {
      setIsSubmittingAction(null);
    }
  };

  const handleDecline = async () => {
    if (!onDecline) return;

    setIsSubmittingAction("decline");
    try {
      await onDecline();
      setIsPassModalOpen(false);
      setIsProposeModalOpen(false);
    } finally {
      setIsSubmittingAction(null);
    }
  };

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
            <div className="flex min-w-0 flex-1">
              <div className="flex-1">
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
        </div>

        <div
          className={cn(
            "overflow-hidden transition-[height,opacity,margin] duration-300 ease-in-out will-change-[height,opacity]",
            expanded ? "mt-4 opacity-100" : "mt-0 opacity-0",
          )}
          style={{ height: contentHeight }}
        >
          <div
            ref={collapseContentRef}
            className={cn(expanded ? "pointer-events-auto" : "pointer-events-none")}
          >
            <div className="flex flex-wrap gap-x-6 gap-y-4">
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
                    <div className="flex items-center gap-2">
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
                      <button
                        type="button"
                        onClick={() => setSelectedProposalSlot(slot)}
                        className="font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#4A3C2A]"
                      >
                        {slot}
                      </button>
                    </div>

                    {selectedProposalSlot === slot ? (
                      <div className="mt-1">
                        <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">Available time</p>
                        <div className="mt-1 w-[167px]">
                          <AvailableTimeCombobox
                            value={availableTimeBySlot[slot] ?? ""}
                            onValueChange={(value) =>
                              setAvailableTimeBySlot((current) => ({
                                ...current,
                                [slot]: value,
                              }))
                            }
                            options={getAvailableTimeOptions(slot)}
                          />
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
                onClick={handleConfirmAppointment}
                disabled={isSubmittingAction !== null}
                className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#00A63E] px-4 font-comfortaa text-[16px] font-bold leading-6 text-white shadow-[0px_4px_12px_rgba(0,166,62,0.3)] transition-[transform,filter] duration-150 active:scale-[0.98] active:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Icon name="target" className="size-5 text-white" aria-hidden="true" />
                {isSubmittingAction === "confirm" ? "Confirming..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setIsProposeModalOpen(true)}
                disabled={isSubmittingAction !== null}
                className="inline-flex h-12 items-center justify-center gap-[11px] rounded-full border-[1.5px] border-[#F59E0B] bg-white px-4 font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#F59E0B] transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-[#FFF7ED]"
              >
                <Icon name="calendar" className="size-5 text-[#F59E0B]" aria-hidden="true" />
                Propose new time
              </button>
              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
                disabled={isSubmittingAction !== null}
                className="py-[7px] font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline underline-offset-2"
              >
                Pass appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <PassAppointmentModal
        open={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        contextLabel={passAppointmentContextLabel}
        returnLabel={passAppointmentReturnLabel}
        onConfirm={handleDecline}
        isSubmitting={isSubmittingAction === "decline"}
      />
      <ProposeNewTimeModal
        open={isProposeModalOpen}
        onClose={() => setIsProposeModalOpen(false)}
        initialServiceSlot={request.proposalSlots?.includes(selectedProposalSlot) ? selectedProposalSlot : undefined}
        initialServiceSlots={request.proposalSlots ?? []}
        onSubmit={handleProposeNewTime}
        onPassAppointment={handleDecline}
        isSubmitting={isSubmittingAction === "propose" || isSubmittingAction === "decline"}
      />
    </div>
  );
}

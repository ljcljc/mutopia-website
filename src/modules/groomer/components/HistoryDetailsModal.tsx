import { useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/components/ui/use-mobile";
import { cn } from "@/components/ui/utils";

interface HistoryDetailsLineItem {
  label: string;
  amount: string;
}

interface HistoryDetailsTimelineItem {
  label: string;
  value: string;
}

interface HistoryDetailsBreakdown {
  packageLabel: string;
  packageItems: HistoryDetailsLineItem[];
  packageSubtotal: string;
  addOnItems: HistoryDetailsLineItem[];
  addOnSubtotal: string;
  total: string;
}

interface HistoryDetailsContent {
  timeline: HistoryDetailsTimelineItem[];
  breakdown: HistoryDetailsBreakdown;
}

export interface HistoryDetailsAppointment {
  id: string;
  petName: string;
  breed: string;
  serviceLabel?: string;
}

interface HistoryDetailsModalProps {
  appointment: HistoryDetailsAppointment | null;
  onClose: () => void;
  open: boolean;
}

const detailsByAppointmentId: Record<string, HistoryDetailsContent> = {
  "history-max": {
    timeline: [
      { label: "Start travel", value: "1:10 PM" },
      { label: "Check in", value: "1:42 PM" },
      { label: "Start service", value: "1:55 PM" },
      { label: "Complete service", value: "3:28 PM" },
    ],
    breakdown: {
      packageLabel: "Full rooming package",
      packageItems: [
        { label: "Full grooming", amount: "$58.50" },
        { label: "Mobile van service", amount: "$27.00" },
        { label: "Safety insurance", amount: "$11.00" },
      ],
      packageSubtotal: "$96.50",
      addOnItems: [
        { label: "Teeth brushing", amount: "$13.50" },
        { label: "Ear cleaning", amount: "$11.70" },
      ],
      addOnSubtotal: "$25.20",
      total: "$121.70",
    },
  },
};

const fallbackDetails: HistoryDetailsContent = {
  timeline: [
    { label: "Start travel", value: "1:10 PM" },
    { label: "Check in", value: "1:42 PM" },
    { label: "Start service", value: "1:55 PM" },
    { label: "Complete service", value: "3:28 PM" },
  ],
  breakdown: {
    packageLabel: "Full rooming package",
    packageItems: [
      { label: "Full grooming", amount: "$58.50" },
      { label: "Mobile van service", amount: "$27.00" },
      { label: "Safety insurance", amount: "$11.00" },
    ],
    packageSubtotal: "$96.50",
    addOnItems: [
      { label: "Teeth brushing", amount: "$13.50" },
      { label: "Ear cleaning", amount: "$11.70" },
    ],
    addOnSubtotal: "$25.20",
    total: "$121.70",
  },
};

export function HistoryDetailsModal({
  appointment,
  onClose,
  open,
}: HistoryDetailsModalProps) {
  const isMobile = useIsMobile();
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true);

  const details = useMemo(() => {
    if (!appointment) {
      return fallbackDetails;
    }

    return detailsByAppointmentId[appointment.id] ?? fallbackDetails;
  }, [appointment]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "overflow-hidden border-none bg-[#FFF9ED] p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! mx-auto! flex! max-h-[88vh]! w-full! max-w-[393px]! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! flex! max-h-[88vh]! w-full! max-w-[393px]! -translate-x-1/2! -translate-y-1/2! flex-col! gap-0! rounded-none shadow-[0px_4px_12px_rgba(0,0,0,0.08)]",
        )}
      >
        <DialogTitle className="sr-only">History details</DialogTitle>
        <DialogDescription className="sr-only">View history details of the completed appointment.</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="sticky top-0 z-10 shrink-0 bg-[#FFF9ED] px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">History details</p>
              <button
                type="button"
                onClick={onClose}
                className="flex size-5 shrink-0 items-center justify-center text-[#8B6357] transition-colors hover:text-[#6E4F46]"
                aria-label="Close history details dialog"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">
                  {appointment ? `${appointment.petName} (${appointment.breed})` : "History details"}
                </h3>
              </div>

              <div className="space-y-[1px] font-comfortaa text-[16px] leading-[27px] text-[#4A3C2A]">
                {details.timeline.map((item) => (
                  <p key={item.label}>
                    {item.label}: <span className="text-[#6B7280]">{item.value}</span>
                  </p>
                ))}
              </div>
              <section className="rounded-[12px] bg-white px-6 py-6 shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.10)]">
                <button
                  type="button"
                  onClick={() => setIsBreakdownExpanded((current) => !current)}
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">Package and add-on</h4>
                      <Icon
                        name="chevron-down"
                        size={18}
                        className={cn("mt-[5px] shrink-0 text-[#8B6357] transition-transform", isBreakdownExpanded && "rotate-180")}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-[2px] flex items-center justify-between gap-4">
                      <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#6B7280]">Total estimation for the service</p>
                      <span className="shrink-0 font-comfortaa text-[16px] font-bold leading-6 text-[#DE6A07]">{details.breakdown.total}</span>
                    </div>
                  </div>
                </button>

                {isBreakdownExpanded ? (
                  <div className="mt-3">
                    <p className="mb-[2px] font-comfortaa text-[10px] leading-[18px] text-[#8B6357]">{details.breakdown.packageLabel}</p>
                    <div className="space-y-px">
                      {details.breakdown.packageItems.map((item) => (
                        <div key={item.label} className="flex items-end justify-between gap-4">
                          <p className="font-comfortaa text-[12px] leading-5 text-[#4A3C2A]">{item.label}</p>
                          <p className="shrink-0 font-comfortaa text-[12px] leading-5 text-[#4A3C2A]">{item.amount}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 border-t border-[#2F2A26] pt-[7px]">
                      <div className="flex items-end justify-between gap-4">
                        <p className="font-comfortaa text-[13px] font-semibold leading-5 text-[#4A3C2A]">Subtotal</p>
                        <p className="shrink-0 font-comfortaa text-[13px] font-semibold leading-5 text-[#4A3C2A]">{details.breakdown.packageSubtotal}</p>
                      </div>
                    </div>

                    <div className="mt-[2px]">
                      <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">Add-on</p>
                      <div className="mt-[2px] space-y-px">
                        {details.breakdown.addOnItems.map((item) => (
                          <div key={item.label} className="flex items-end justify-between gap-4">
                            <p className="font-comfortaa text-[13px] leading-5 text-[#4A3C2A]">{item.label}</p>
                            <p className="shrink-0 font-comfortaa text-[13px] leading-5 text-[#4A3C2A]">{item.amount}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-[3px] border-t border-[#2F2A26] pt-[7px]">
                      <div className="flex items-end justify-between gap-4">
                        <p className="font-comfortaa text-[13px] font-semibold leading-5 text-[#4A3C2A]">Subtotal</p>
                        <p className="shrink-0 font-comfortaa text-[13px] font-semibold leading-5 text-[#4A3C2A]">{details.breakdown.addOnSubtotal}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

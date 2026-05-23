import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
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
  dateLabel: string;
  timeline: HistoryDetailsTimelineItem[];
  breakdown: HistoryDetailsBreakdown;
  cancellation?: {
    reason: string;
    canceledAt: string;
    refundedAmount: string;
  } | null;
  termination?: {
    reason: string;
    description: string;
    refundedAmount: string;
    resolutionLabel: string;
  } | null;
}

export interface HistoryDetailsAppointment {
  id: string;
  date?: string;
  petName: string;
  breed: string;
  serviceLabel?: string;
}

interface HistoryDetailsModalProps {
  appointment: HistoryDetailsAppointment | null;
  detail?: Record<string, unknown> | null;
  isLoading?: boolean;
  onClose: () => void;
  open: boolean;
}

const detailsByAppointmentId: Record<string, HistoryDetailsContent> = {
  "history-max": {
    dateLabel: "Mar 12",
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

const emptyDetails: HistoryDetailsContent = {
  dateLabel: "",
  timeline: [],
  breakdown: {
    packageLabel: "Package",
    packageItems: [],
    packageSubtotal: "$0",
    addOnItems: [],
    addOnSubtotal: "$0",
    total: "$0",
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getString(source: Record<string, unknown>, keys: string[], fallback: string = ""): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getArray(source: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = source[key];
  return Array.isArray(value) ? value.map(asRecord) : [];
}

function formatAmount(value: unknown, fallback = "$0") {
  if (value === null || value === undefined || value === "") return fallback;
  const raw = typeof value === "number" ? value.toFixed(2) : String(value);
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function formatShortDate(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTimelineTime(value: string): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getCancellationRecord(detail: Record<string, unknown>): Record<string, unknown> {
  return asRecord(detail.cancellation);
}

function getCanceledAt(detail: Record<string, unknown>, timelineRecord: Record<string, unknown>): string {
  const cancellation = getCancellationRecord(detail);
  return (
    getString(timelineRecord, ["canceled", "cancelled", "canceled_at", "cancelled_at", "user_canceled", "groomer_canceled"]) ||
    getString(detail, ["canceled_at", "cancelled_at", "canceled_time", "cancelled_time"]) ||
    getString(cancellation, ["canceled_at", "cancelled_at", "created_at"])
  );
}

function mapSnapshotItems(items: Record<string, unknown>[]): HistoryDetailsLineItem[] {
  return items.map((item, index) => ({
    label: getString(item, ["name", "label", "title"], `Item ${index + 1}`),
    amount: formatAmount(getString(item, ["amount", "price", "total", "subtotal"], "0")),
  }));
}

function getCancellationTimelineItem(
  detail: Record<string, unknown>,
  timelineRecord: Record<string, unknown>,
): HistoryDetailsTimelineItem | null {
  const cancellation = getCancellationRecord(detail);
  const canceledBy = getString(detail, ["canceled_by", "cancelled_by"]) || getString(cancellation, ["canceled_by", "cancelled_by"]);
  const canceledAt = getCanceledAt(detail, timelineRecord);

  if (!canceledAt) return null;

  const normalizedCanceledBy = canceledBy.toLowerCase();
  const label = normalizedCanceledBy.includes("groomer")
    ? "Groomer canceled"
    : normalizedCanceledBy.includes("user") || normalizedCanceledBy.includes("customer")
      ? "User canceled"
      : "Canceled";

  return { label, value: formatTimelineTime(canceledAt) };
}

function getCancellationDetails(
  detail: Record<string, unknown>,
  timelineRecord: Record<string, unknown>,
): HistoryDetailsContent["cancellation"] {
  const cancellation = getCancellationRecord(detail);
  const canceledAt = getCanceledAt(detail, timelineRecord);
  const explicitCancelReason = getString(detail, ["cancel_reason", "cancellation_reason"]);
  const reason =
    explicitCancelReason ||
    getString(cancellation, ["reason", "cancel_reason", "cancellation_reason", "description"]);
  const refundedAmount =
    getString(detail, ["refund_amount", "refunded_amount", "refundable_service_fee"]) ||
    getString(cancellation, ["refund_amount", "refunded_amount", "refundable_service_fee"]);
  const hasCancellationSignal = Object.keys(cancellation).length > 0 || Boolean(canceledAt || explicitCancelReason);

  if (!hasCancellationSignal) return null;

  return {
    reason: reason || "-",
    canceledAt: canceledAt ? formatTimelineTime(canceledAt) : "-",
    refundedAmount: formatAmount(refundedAmount || "0"),
  };
}

function buildDetailsFromApi(detail: Record<string, unknown> | null | undefined): HistoryDetailsContent | null {
  if (!detail || Object.keys(detail).length === 0) return null;

  const timelineRecord = asRecord(detail.timeline);
  const timelineMap: Array<[string, string]> = [
    ["Start travel", "start_travel"],
    ["Check in", "check_in"],
    ["Start service", "start_service"],
    ["Complete service", "complete_service"],
    ["Termination", "termination"],
  ];
  const timeline = timelineMap
    .map(([label, key]) => ({ label, value: getString(timelineRecord, [key]) }))
    .filter((item) => item.value);
  const cancellationTimelineItem = getCancellationTimelineItem(detail, timelineRecord);
  if (cancellationTimelineItem && !timeline.some((item) => item.label === cancellationTimelineItem.label)) {
    timeline.push(cancellationTimelineItem);
  }

  const packageSnapshot = asRecord(detail.package_snapshot);
  const addonSnapshot = detail.addons_snapshot;
  const price = asRecord(detail.price);
  const packageItems = mapSnapshotItems(getArray(packageSnapshot, "items"));
  const addOnItems = Array.isArray(addonSnapshot) ? mapSnapshotItems(addonSnapshot.map(asRecord)) : [];
  const packageAmount = getString(price, ["package_amount", "payable_amount", "final_amount"], "0");
  const addOnsAmount = getString(price, ["addons_amount"], "0");
  const totalAmount = getString(price, ["final_amount", "paid_total", "payable_amount"], "0");
  const termination = asRecord(detail.termination);
  const cancellation = getCancellationDetails(detail, timelineRecord);

  return {
    dateLabel: formatShortDate(getString(detail, ["date", "scheduled_time", "created_at"])),
    timeline,
    breakdown: {
      packageLabel: getString(packageSnapshot, ["name", "label"], getString(detail, ["service_name"], "Package")),
      packageItems: packageItems.length > 0 ? packageItems : [{ label: getString(detail, ["service_name"], "Service"), amount: formatAmount(packageAmount) }],
      packageSubtotal: formatAmount(packageAmount),
      addOnItems,
      addOnSubtotal: formatAmount(addOnsAmount),
      total: formatAmount(totalAmount),
    },
    cancellation,
    termination: Object.keys(termination).length
      ? {
          reason: getString(termination, ["reason"], "-"),
          description: getString(termination, ["description"], "-"),
          refundedAmount: formatAmount(getString(termination, ["refunded_amount"], "0")),
          resolutionLabel: getString(termination, ["resolution_label", "resolution"], "-"),
        }
      : null,
  };
}

export function HistoryDetailsModal({
  appointment,
  detail,
  isLoading = false,
  onClose,
  open,
}: HistoryDetailsModalProps) {
  const isMobile = useIsMobile();
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(true);

  const details = useMemo(() => {
    const apiDetails = buildDetailsFromApi(detail);
    if (apiDetails) {
      return {
        ...apiDetails,
        dateLabel: apiDetails.dateLabel || appointment?.date || "",
      };
    }

    if (!appointment) {
      return emptyDetails;
    }

    const fallbackDetails = detailsByAppointmentId[appointment.id] ?? emptyDetails;
    return {
      ...fallbackDetails,
      dateLabel: fallbackDetails.dateLabel || appointment.date || "",
    };
  }, [appointment, detail]);

  useEffect(() => {
    setIsBreakdownExpanded(!details.termination && !details.cancellation);
  }, [details.cancellation, details.termination]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        overlayClassName={isMobile ? "service-area-dialog-overlay" : undefined}
        className={cn(
          "overflow-hidden border-none bg-[#FFF9ED] p-0 [&>button]:hidden",
          isMobile
            ? "service-area-dialog inset-x-0! bottom-0! top-auto! mx-auto! flex! max-h-[88vh]! w-full! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]"
            : "left-1/2! top-1/2! flex! max-h-[88vh]! w-[393px]! max-w-[calc(100vw-32px)]! -translate-x-1/2! -translate-y-1/2! flex-col! gap-0! rounded-[24px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]",
        )}
      >
        <DialogTitle className="sr-only">History details</DialogTitle>
        <DialogDescription className="sr-only">View history details of the completed appointment.</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="sticky top-0 z-10 shrink-0 bg-[#FFF9ED] px-[calc(20*var(--px393))] pb-[calc(16*var(--px393))] pt-[calc(20*var(--px393))] sm:px-5 sm:pb-4 sm:pt-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">History details</p>
                <h3 className="mt-[4px] truncate font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">
                  {appointment ? `${appointment.petName} (${appointment.breed})` : "History details"}
                </h3>
              </div>
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

          <div className="min-h-0 flex-1 overflow-y-auto px-[calc(20*var(--px393))] pb-[calc(20*var(--px393))] pt-[calc(16*var(--px393))] sm:px-5 sm:pb-5 sm:pt-4">
            <div className="flex flex-col gap-3">
              {isLoading ? (
                <div className="flex min-h-[96px] flex-col items-center justify-center gap-3 rounded-[12px] bg-white px-4 py-4">
                  <Spinner size={32} color="#DE6A07" showTrack trackOpacity={0.22} />
                  <p className="font-comfortaa text-[13px] font-medium leading-5 text-[#8B6357]">Loading details...</p>
                </div>
              ) : (
                <>
                  {details.dateLabel || details.timeline.length > 0 ? (
                    <div className="font-comfortaa">
                      {details.dateLabel ? (
                        <p className="mb-[4px] text-[13px] font-bold leading-5 text-[rgba(139,99,87,0.6)]">{details.dateLabel}</p>
                      ) : null}
                      {details.timeline.map((item) => (
                        <p key={item.label} className="text-[16px] leading-[27px] text-[#4A3C2A]">
                          {item.label}: <span className="text-[#6B7280]">{item.value}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                  {details.termination ? (
                    <section className="border-t border-[#2F2A26] pt-2 font-comfortaa">
                      <div className="space-y-[4px] text-[16px] leading-[23px] text-[#4A3C2A]">
                        <p>Reason of termination: <span className="text-[#6B7280]">{details.termination.reason}</span></p>
                        <p>Description: <span className="text-[#6B7280]">{details.termination.description}</span></p>
                        <p>Refund service fee: <span className="text-[#DE6A07]">{details.termination.refundedAmount}</span></p>
                      </div>
                      {details.termination.resolutionLabel && details.termination.resolutionLabel !== "-" ? (
                        <div className="mt-2 inline-flex h-6 items-center rounded-full bg-[#DCFCE7] px-2 text-[#27AE60]">
                          <Icon name="check-green" className="mr-1 size-[14px]" aria-hidden="true" />
                          <span className="text-[10px] font-bold leading-[14px]">{details.termination.resolutionLabel}</span>
                        </div>
                      ) : null}
                    </section>
                  ) : null}
                  {details.cancellation ? (
                    <section className="border-t border-[#2F2A26] pt-2 font-comfortaa">
                      <div className="space-y-[4px] text-[16px] leading-[23px] text-[#4A3C2A]">
                        <p>Reason of cancellation: <span className="text-[#6B7280]">{details.cancellation.reason}</span></p>
                        <p>Cancellation time: <span className="text-[#6B7280]">{details.cancellation.canceledAt}</span></p>
                        <p>Refund amount: <span className="text-[#DE6A07]">{details.cancellation.refundedAmount}</span></p>
                      </div>
                    </section>
                  ) : null}
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
                            className={cn("mt-[5px] shrink-0 text-[#8B6357] transition-transform", !isBreakdownExpanded && "-rotate-90")}
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
                          {details.breakdown.packageItems.length > 0 ? details.breakdown.packageItems.map((item) => (
                            <div key={item.label} className="flex items-end justify-between gap-4">
                              <p className="font-comfortaa text-[12px] leading-5 text-[#4A3C2A]">{item.label}</p>
                              <p className="shrink-0 font-comfortaa text-[12px] leading-5 text-[#4A3C2A]">{item.amount}</p>
                            </div>
                          )) : (
                            <p className="font-comfortaa text-[13px] leading-5 text-[#6B7280]">No package details</p>
                          )}
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
                            {details.breakdown.addOnItems.length > 0 ? details.breakdown.addOnItems.map((item) => (
                              <div key={item.label} className="flex items-end justify-between gap-4">
                                <p className="font-comfortaa text-[13px] leading-5 text-[#4A3C2A]">{item.label}</p>
                                <p className="shrink-0 font-comfortaa text-[13px] leading-5 text-[#4A3C2A]">{item.amount}</p>
                              </div>
                            )) : (
                              <p className="font-comfortaa text-[13px] leading-5 text-[#6B7280]">No add-ons</p>
                            )}
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
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

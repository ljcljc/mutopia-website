import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountContentContainer from "@/components/layout/AccountContentContainer";
import { CustomInput, CustomRadio, OrangeButton, AccordionChevron, AccordionPanel } from "@/components/common";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "@/components/account/accountStore";
import { useBookingStore } from "@/components/booking/bookingStore";
import { HttpError } from "@/lib/http";
import {
  cancelBooking,
  clientDecideAddOn,
  clientConfirmBookingTime,
  createDepositSession,
  createReview,
  createPetOwnerComplaint,
  createTipSession,
  getCancelQuote,
  getBookingDetail,
  getPaymentSessionRedirectUrl,
  updateReview,
  type AddressOut,
  type BookingDetailOut,
  type CancelQuoteOut,
  type BookingPaymentOut,
  type InvitationDecisionTimeOptionIn,
} from "@/lib/api";
import { toast } from "sonner";
import AddAddressModal from "@/components/account/AddAddressModal";
import ModifyAddressModal from "@/components/account/ModifyAddressModal";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { CheckCircleIcon, StarIcon, XIcon } from "lucide-react";
import {
  formatCouponCategory,
  getGeneralCouponCategory,
  getCouponDisplayName,
  groupCoupons,
} from "@/lib/couponUtils";
import {
  addHoursToApiLocalDateTime,
  formatApiLocalDateTime,
  formatApiServiceDateTime,
  formatPreferredTimeSlotLocal,
  serviceTimeZoneLabel,
  toLocalDateTimeString,
} from "@/lib/localDateTime";
import { getBookingEstimateSummary } from "@/lib/bookingPricing";

function formatAmount(value: number | string | undefined, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return `$${value.toFixed(2)}`;
  const trimmed = String(value).trim();
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

function parseAmount(value: number | string | undefined): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatPaymentKind(kind: string) {
  return kind
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeBookingStatus(status?: string | null) {
  return status?.trim().toLowerCase().replace(/[\s-]+/g, "_") ?? "";
}

function formatServiceTypeLabel(serviceType?: string | null) {
  if (!serviceType) return "";
  return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
}

function formatBookingCode(orderCode?: string | null, bookingId?: number | null) {
  if (orderCode && orderCode.trim()) return orderCode.trim();
  if (bookingId) return `#${bookingId}`;
  return "";
}

function extractTimeLabel(dateTime?: string | null) {
  if (!dateTime) return "";
  const [, timeLabel] = dateTime.split(" at ");
  return timeLabel ?? dateTime;
}

function formatRecommendationMonth(dateTime?: string | null) {
  if (!dateTime) return "Booking for next month";
  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) return "Booking for next month";
  return `Booking for ${parsed.toLocaleString("en-US", { month: "long" })}`;
}

function getHttpErrorMessage(error: unknown) {
  return error instanceof Error ? error.message.toLowerCase() : "";
}

function isPaymentExpiredError(error: unknown) {
  if (!(error instanceof HttpError)) return false;
  const message = getHttpErrorMessage(error);

  return (
    error.status === 409 ||
    message.includes("expired") ||
    message.includes("canceled") ||
    message.includes("cancelled")
  );
}

function isPaidPaymentStatus(status: string) {
  return ["succeeded", "paid"].includes(status.toLowerCase());
}

function isPendingCheckoutStatus(status: string) {
  return ["open", "created", "pending", "requires_confirmation", "requires_action", "processing"].includes(
    status.toLowerCase(),
  );
}

function formatPercentRate(value: number | string | undefined): string {
  const parsed = parseAmount(value);
  if (!Number.isFinite(parsed)) return "0";
  return String(Math.round(parsed * 100));
}

function parseApiLocalDateTimeValue(value?: string | null): Date | null {
  if (!value) return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second ?? 0),
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWithinTwoHoursBefore(dateTime?: string | null) {
  const parsed = parseApiLocalDateTimeValue(dateTime);
  if (!parsed) return false;
  const hoursUntil = (parsed.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntil >= 0 && hoursUntil <= 2;
}

function formatPreferredTimeSlot(slot: Record<string, unknown>): string | null {
  return formatPreferredTimeSlotLocal(slot, { includeWeekday: true });
}

function formatCompactPreferredTimeSlot(slot: Record<string, unknown>): string | null {
  return formatPreferredTimeSlotLocal(slot, { dateSeparator: "-" });
}

type ProposedTimeOption = InvitationDecisionTimeOptionIn & {
  key: string;
  label: string;
};

function formatTimeOptionLabel(option: InvitationDecisionTimeOptionIn, businessTimezone?: string | null): string {
  return `${option.date} at ${option.time} ${serviceTimeZoneLabel(`${option.date} ${option.time}`, businessTimezone)}`.trim();
}

function normalizeProposedTimeOption(option: InvitationDecisionTimeOptionIn, index: number, businessTimezone?: string | null): ProposedTimeOption | null {
  if (!option.date || !option.slot || !option.time) return null;

  return {
    ...option,
    key: `${option.date}-${option.slot}-${option.time}-${index}`,
    label: formatTimeOptionLabel(option, businessTimezone),
  };
}

type DetailBadgeTone = "orange" | "green" | "on_the_way" | "purple" | "brown" | "outlined";

type DetailCardConfig = {
  subtitleIncludesScheduled: boolean;
  progressColor: string;
  progressWidth: number;
  badgeLabel: string;
  badgeTone: DetailBadgeTone;
  nextStep?: string;
  showNextStep: boolean;
  actionKind: "none" | "cancel" | "confirm" | "review" | "comment" | "pay" | "pay_adjustment";
};

function StatusBadge({ label, tone }: { label: string; tone: DetailBadgeTone }) {
  if (tone === "on_the_way") {
    return (
      <div className="inline-flex h-6 w-fit items-center gap-1 rounded-xl bg-[#E8FAE9] px-3 py-1">
        <CheckCircleIcon className="size-3.5 text-[#427D3E]" aria-hidden="true" />
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#427D3E]">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "green") {
    return (
      <div className="inline-flex h-6 w-fit items-center gap-1 rounded-xl bg-[#DCFCE7] px-4 py-1">
        <Icon name="check-green" size={12} className="text-[#00A63E]" />
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#00A63E]">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "purple") {
    return (
      <div className="inline-flex h-6 w-fit items-center rounded-xl bg-[#633479] px-4 py-1">
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-white">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "brown") {
    return (
      <div className="inline-flex h-6 w-fit items-center rounded-xl bg-[#8B6357] px-4 py-1">
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-white">
          {label}
        </span>
      </div>
    );
  }

  if (tone === "outlined") {
    return (
      <div className="inline-flex h-6 w-fit items-center rounded-xl border border-[#8B8B8B] bg-white px-3 py-1">
        <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#4C4C4C]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex h-6 w-fit items-center rounded-xl bg-[#DE6A07] px-3 py-1">
      <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-white">
        {label}
      </span>
    </div>
  );
}

function RatingControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">{label}</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-[#FFF3E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2374ff]"
            aria-label={`${label} ${rating} star${rating === 1 ? "" : "s"}`}
          >
            <StarIcon
              className={`size-5 ${rating <= value ? "fill-[#DE6A07] text-[#DE6A07]" : "fill-none text-[#CFC7BF]"}`}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function getRefundedBadgeLabel(normalizedStatus: string, notes?: string | null) {
  const notesLower = notes?.toLowerCase() ?? "";

  if (
    normalizedStatus.includes("terminated") ||
    notesLower.includes("terminate")
  ) {
    return "Service terminated and refunded";
  }

  if (
    normalizedStatus.includes("cancel") ||
    notesLower.includes("cancel")
  ) {
    return "Service canceled and refunded";
  }

  return "Refunded";
}

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPackageExpanded, setIsPackageExpanded] = useState(true);
  const [isTotalExpanded, setIsTotalExpanded] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelQuote, setCancelQuote] = useState<CancelQuoteOut | null>(null);
  const [isLoadingCancelQuote, setIsLoadingCancelQuote] = useState(false);
  const [cancelQuoteError, setCancelQuoteError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressOverride, setAddressOverride] = useState<AddressOut | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedProposedTimeKey, setSelectedProposedTimeKey] = useState<string>("");
  const [isCardActionLoading, setIsCardActionLoading] = useState(false);
  const [isPayingAdjustment, setIsPayingAdjustment] = useState(false);
  const [isConfirmingProposedTime, setIsConfirmingProposedTime] = useState(false);
  const [isRejectingProposedTime, setIsRejectingProposedTime] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [technicalRating, setTechnicalRating] = useState(5);
  const [attitudeRating, setAttitudeRating] = useState(5);
  const [environmentRating, setEnvironmentRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [complaintContent, setComplaintContent] = useState("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [selectedTipPercent, setSelectedTipPercent] = useState(12);
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [isCreatingTipSession, setIsCreatingTipSession] = useState(false);
  const { addresses, isLoadingAddresses, fetchAddresses } = useAccountStore();
  const loadBookingDetailForEdit = useBookingStore((state) => state.loadBookingDetailForEdit);

  const isForbiddenError = (error: unknown) => error instanceof HttpError && error.status === 403;

  useEffect(() => {
    const id = Number(bookingId);
    if (!id || Number.isNaN(id)) {
      setError("Invalid booking ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    getBookingDetail(id)
      .then((data) => {
        setDetail(data);
      })
      .catch((error) => {
        console.error("Failed to load booking detail:", error);
        setError("Failed to load booking detail. Please try again.");
        toast.error("Failed to load booking detail");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [bookingId]);

  const petSnapshot = (detail?.pet_snapshot as Record<string, unknown> | undefined) ?? {};
  const addressSnapshot = (detail?.address_snapshot as Record<string, unknown> | undefined) ?? {};
  const packageSnapshot = (detail?.package_snapshot as Record<string, unknown> | undefined) ?? {};

  const petName = (petSnapshot.name as string | undefined) ?? "Duke";
  const hasHealthQuestionnaire = Boolean(petSnapshot.health_questionnaire);
  const bookingCode = formatBookingCode(detail?.order_code, detail?.id);
  const serviceName = (packageSnapshot.name as string | undefined) ?? "Full grooming";
  const serviceType =
    (packageSnapshot.service_type as string | undefined) ??
    (packageSnapshot.type as string | undefined) ??
    "Mobile";
  const serviceTypeLabel = formatServiceTypeLabel(serviceType);
  const scheduledDisplay = formatApiServiceDateTime(detail?.scheduled_time, detail?.business_timezone) || "2026-04-03 at 10:00";
  const estimatedCompletionTime = addHoursToApiLocalDateTime(detail?.scheduled_time, 1);
  const estimatedCompletionDisplay = estimatedCompletionTime
    ? `${estimatedCompletionTime} ${serviceTimeZoneLabel(detail?.scheduled_time, detail?.business_timezone)}`.trim()
    : "Estimated completion soon";
  const paymentDueDisplay = formatApiLocalDateTime(detail?.payment_due_at);

  const addressLine1 =
    addressOverride?.address ??
    (addressSnapshot.address as string | undefined) ??
    "100 Vancouver Cres";
  const addressLine2 =
    [
      addressOverride?.city ?? (addressSnapshot.city as string | undefined),
      addressOverride?.province ?? (addressSnapshot.province as string | undefined),
      addressOverride?.postal_code ?? (addressSnapshot.postal_code as string | undefined),
    ]
      .filter(Boolean)
      .join(" ") || "MIRAMICHI NB E1N 2E5";

  const normalizedStatus = normalizeBookingStatus(detail?.status);
  const pendingAdjustment = detail?.adjustments?.find(
    (adjustment) => adjustment.kind === "check_up" && ["pending", "approved", "refund_pending"].includes(normalizeBookingStatus(adjustment.status)) && parseAmount(adjustment.amount) !== 0,
  );
  const isRefundAdjustment = parseAmount(pendingAdjustment?.amount) < 0;
  const isRefundProcessing = normalizeBookingStatus(pendingAdjustment?.status) === "refund_pending";
  const adjustmentDetails = pendingAdjustment?.details;
  const adjustmentLines = (pendingAdjustment?.display_items ?? []).map((item) => ({
    label: item.label,
    amount: parseAmount(item.amount),
  }));
  const adjustmentSubtotal = adjustmentLines.reduce((total, line) => total + line.amount, 0);

  const proposedTimeOptions = useMemo(() => {
    return (
      detail?.time_options
        ?.map((option, index) => normalizeProposedTimeOption(option, index, detail?.business_timezone))
        .filter((option): option is ProposedTimeOption => Boolean(option)) ?? []
    );
  }, [detail?.time_options, detail?.business_timezone]);

  const preferredTimeSlotLabels = useMemo(() => {
    return (
      detail?.preferred_time_slots
        ?.map(formatPreferredTimeSlot)
        .filter((label): label is string => Boolean(label)) ?? []
    );
  }, [detail?.preferred_time_slots]);

  const compactPreferredTimeSlotLabels = useMemo(() => {
    return (
      detail?.preferred_time_slots
        ?.map(formatCompactPreferredTimeSlot)
        .filter((label): label is string => Boolean(label)) ?? []
    );
  }, [detail?.preferred_time_slots]);

  useEffect(() => {
    if (!proposedTimeOptions.length) {
      setSelectedProposedTimeKey("");
      return;
    }
    setSelectedProposedTimeKey((current) =>
      proposedTimeOptions.some((option) => option.key === current) ? current : proposedTimeOptions[0].key,
    );
  }, [proposedTimeOptions]);

  const detailCardConfig = useMemo<DetailCardConfig>(() => {
    switch (normalizedStatus) {
      case "pending":
      case "pending_assignment":
        return {
          subtitleIncludesScheduled: false,
          progressColor: "#DE6A07",
          progressWidth: 43.7,
          badgeLabel: "Waiting for groomer match",
          badgeTone: "orange",
          nextStep: "Waiting for groomer response",
          showNextStep: true,
          actionKind: "cancel",
        };
      case "awaiting_client_confirmation":
        return {
          subtitleIncludesScheduled: false,
          progressColor: "#DE6A07",
          progressWidth: 43.7,
          badgeLabel: "Waiting for your confirmation",
          badgeTone: "orange",
          nextStep: "Confirm for new time proposed in 24 hours",
          showNextStep: true,
          actionKind: "confirm",
        };
      case "confirmed":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#388B5E",
          progressWidth: 74,
          badgeLabel: "Ready for service",
          badgeTone: "green",
          nextStep: `Check in: ${scheduledDisplay}`,
          showNextStep: true,
          actionKind: "cancel",
        };
      case "traveling":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#388B5E",
          progressWidth: 74,
          badgeLabel: "Groomer is on the way",
          badgeTone: "on_the_way",
          nextStep: `Check in: ${scheduledDisplay}`,
          showNextStep: true,
          actionKind: "cancel",
        };
      case "checkup_adjustment_pending":
      case "checked_in":
        if (pendingAdjustment && normalizedStatus === "checkup_adjustment_pending") return {
          subtitleIncludesScheduled: false,
          progressColor: "#DE6A07",
          progressWidth: 83.1,
          badgeLabel: isRefundProcessing ? "Refund processing" : isRefundAdjustment ? "Refund confirmation needed" : "Waiting for payment",
          badgeTone: "orange",
          nextStep: isRefundProcessing ? "Refund is being processed" : "Start grooming",
          showNextStep: true,
          actionKind: isRefundProcessing ? "none" : "pay_adjustment",
        };
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#633479",
          progressWidth: 83.1,
          badgeLabel: "Groomer checked in",
          badgeTone: "purple",
          nextStep: "Service will be started soon",
          showNextStep: true,
          actionKind: "none",
        };
      case "in_progress":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#633479",
          progressWidth: 93.3,
          badgeLabel: "Service started",
          badgeTone: "purple",
          nextStep: `Estimated completion at ${extractTimeLabel(estimatedCompletionDisplay) || "soon"}`,
          showNextStep: true,
          actionKind: "none",
        };
      case "pending_report":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#633479",
          progressWidth: 98.5,
          badgeLabel: detail?.hero_stage === "handover_checkout" ? "Handover & Checkout" : "Service completed",
          badgeTone: "purple",
          nextStep: detail?.hero_stage === "handover_checkout" ? "Review health report and tip your groomer" : "Waiting for health report",
          showNextStep: true,
          actionKind: "review",
        };
      case "completed":
        return {
          subtitleIncludesScheduled: true,
          progressColor: detail?.review ? "#8B6357" : "#633479",
          progressWidth: 98.5,
          badgeLabel: detail?.review ? "Service completed and reviewed" : "Service completed!",
          badgeTone: detail?.review ? "brown" : "purple",
          nextStep: detail?.review ? "Review submitted" : "Pending review",
          showNextStep: !detail?.review,
          // Keep the completed-order action area visible for Receipt even when
          // the separate customer-review window has expired.
          actionKind: "review",
        };
      case "terminated":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#EAB308",
          progressWidth: 98.5,
          badgeLabel: "Service Terminated",
          badgeTone: "outlined",
          nextStep: "Sorry, we’ll contact you shortly.",
          showNextStep: true,
          actionKind: "comment",
        };
      case "canceled":
      case "cancelled":
      case "booking_canceled":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#EAB308",
          progressWidth: 98.5,
          badgeLabel: "Service canceled",
          badgeTone: "outlined",
          showNextStep: false,
          actionKind: "none",
        };
      case "terminated_and_refunded":
      case "canceled_and_refunded":
      case "cancelled_and_refunded":
      case "refunded":
        return {
          subtitleIncludesScheduled: true,
          progressColor: "#EAB308",
          progressWidth: 98.5,
          badgeLabel: getRefundedBadgeLabel(normalizedStatus, detail?.notes),
          badgeTone: "outlined",
          showNextStep: false,
          actionKind: "none",
        };
      case "awaiting_payment":
        return {
          subtitleIncludesScheduled: Boolean(detail?.scheduled_time),
          progressColor: "#DE6A07",
          progressWidth: 37.1,
          badgeLabel: "Waiting for payment",
          badgeTone: "orange",
          nextStep: paymentDueDisplay ? `Pay before ${paymentDueDisplay}` : "Complete payment to continue",
          showNextStep: true,
          actionKind: "pay",
        };
      default:
        return {
          subtitleIncludesScheduled: Boolean(detail?.scheduled_time),
          progressColor: "#DE6A07",
          progressWidth: 43.7,
          badgeLabel: detail?.status || "Waiting for groomer match",
          badgeTone: "orange",
          nextStep: "Waiting for groomer response",
          showNextStep: true,
          actionKind: "none",
        };
    }
  }, [detail?.hero_stage, detail?.notes, detail?.review, detail?.scheduled_time, detail?.status, estimatedCompletionDisplay, isRefundAdjustment, isRefundProcessing, normalizedStatus, paymentDueDisplay, pendingAdjustment, scheduledDisplay]);

  const reviewedDisplay = formatApiLocalDateTime(detail?.review?.created_at);
  const recommendationLabel = formatRecommendationMonth(detail?.scheduled_time);
  const reviewCommentDisplay = detail?.review?.comment?.trim() || "No written review provided.";
  const isHistoryBooking = [
    "completed",
    "terminated",
    "canceled",
    "cancelled",
    "booking_canceled",
    "terminated_and_refunded",
    "canceled_and_refunded",
    "cancelled_and_refunded",
    "refunded",
  ].includes(normalizedStatus);
  const breadcrumbBookingLabel = isHistoryBooking ? "History booking" : "Upcoming booking";
  const serviceSummary = detailCardConfig.subtitleIncludesScheduled
    ? `${serviceName} - ${serviceTypeLabel} ${scheduledDisplay}${reviewedDisplay ? ` - Reviewed ${reviewedDisplay}` : ""}`
    : `${serviceName} - ${serviceTypeLabel}`;
  const rawCanceledReason =
    typeof detail?.cancel_reason === "string" && detail.cancel_reason.trim()
      ? detail.cancel_reason.trim()
      : typeof detail?.notes === "string"
        ? detail.notes.trim()
        : "";
  const canceledReason =
    (normalizedStatus === "canceled" || normalizedStatus === "cancelled" || normalizedStatus === "booking_canceled") &&
    rawCanceledReason
      ? rawCanceledReason.replace(/^cancel\s+reason:\s*/i, "").trim()
      : "";
  const canModifyAddress = normalizedStatus === "pending_assignment";
  const hasCheckedIn = ["checked_in", "checkup_adjustment_pending", "in_progress", "pending_report", "completed", "terminated", "canceled", "refunded"].includes(normalizedStatus);
  
  // 价格信息（需要在 useMemo 之前定义）
  const estimateSummary = getBookingEstimateSummary(detail ?? {});
  const totalEstimation = formatAmount(pendingAdjustment?.quoted_total_amount ?? estimateSummary.finalAmount ?? 0, "$0.00");
  const packageSubtotal = formatAmount(detail?.package_amount, "$0.00");
  const originalTotal = estimateSummary.originalAmount + adjustmentSubtotal;
  const originalTotalFormatted = formatAmount(originalTotal, "$0.00");

  // 从 addons_snapshot 中提取附加服务列表
  const addOnItems = useMemo(() => {
    if (!detail?.addons_snapshot || !Array.isArray(detail.addons_snapshot)) return [];
    
    return detail.addons_snapshot.map((addon) => {
      const addonObj = addon as Record<string, unknown>;
      const name = (addonObj.name as string | undefined) ?? "Add-on service";
      const price = formatAmount(addonObj.price as number | string | undefined, "$0.00");
      return { label: name, amount: price };
    });
  }, [detail?.addons_snapshot]);

  // 计算折扣信息
  const percentOff = estimateSummary.discountPercent;
  const discountAmount = formatAmount(detail?.discount_amount, "$0.00");
  const couponAmount = formatAmount(detail?.coupon_amount, "$0.00");
  const membershipFee = formatAmount(detail?.membership_fee, "$0.00");
  const mobileVanAmount = formatAmount(detail?.mobile_van_service_amount, "$0.00");
  const safetyInsuranceAmount = formatAmount(detail?.safety_insurance_amount, "$0.00");
  const preGstTotal = formatAmount(pendingAdjustment
    ? parseAmount(adjustmentDetails?.pre_gst_total as string | number | undefined) ||
      parseAmount(pendingAdjustment.quoted_total_amount) - parseAmount(pendingAdjustment.gst_amount) - parseAmount(detail?.membership_fee)
    : estimateSummary.preGstAmount ?? 0, "$0.00");
  const refundedAmount = formatAmount(detail?.refunded_amount, "$0.00");

  const packageComponentItems = useMemo(
    () => [
      { label: serviceName, amount: packageSubtotal },
      ...(parseAmount(detail?.mobile_van_service_amount) > 0
        ? [{ label: "Mobile van service", amount: mobileVanAmount }]
        : []),
      ...(parseAmount(detail?.safety_insurance_amount) > 0
        ? [{ label: "Safety insurance", amount: safetyInsuranceAmount }]
        : []),
    ],
    [detail?.mobile_van_service_amount, detail?.safety_insurance_amount, mobileVanAmount, packageSubtotal, safetyInsuranceAmount, serviceName],
  );
  const packageCardAdjustment = pendingAdjustment ?? detail?.adjustments?.find(
    (adjustment) => adjustment.kind === "check_up" && normalizeBookingStatus(adjustment.status) === "paid",
  );
  const settledCardAdjustment = normalizeBookingStatus(packageCardAdjustment?.status) === "paid";
  const originalPackageSnapshot = settledCardAdjustment ? packageCardAdjustment?.details?.original_package_snapshot as Record<string, unknown> | undefined : undefined;
  const originalAddonsSnapshot = settledCardAdjustment ? packageCardAdjustment?.details?.original_addons_snapshot as Array<Record<string, unknown>> | undefined : undefined;
  const packageCardPackageItems = originalPackageSnapshot
    ? [{ ...packageComponentItems[0], amount: formatAmount(originalPackageSnapshot.package_price as string | number | undefined ?? originalPackageSnapshot.price as string | number | undefined, packageSubtotal) }, ...packageComponentItems.slice(1)]
    : packageComponentItems;
  const packageCardAddOnItems = originalAddonsSnapshot
    ? originalAddonsSnapshot.map((addon) => ({ label: String(addon.name ?? "Add-on service"), amount: formatAmount(addon.price as string | number | undefined, "$0.00") }))
    : addOnItems;
  const packageCardAdjustmentLines = (packageCardAdjustment?.display_items ?? []).map((item) => ({ label: item.label, amount: parseAmount(item.amount) }));
  const packageCardAdjustmentSubtotal = packageCardAdjustmentLines.reduce((total, line) => total + line.amount, 0);
  const packageCardManualAmount = parseAmount((originalPackageSnapshot ?? detail?.package_snapshot)?.manual_amount as string | number | undefined);
  const packageAndAddonTotal = formatAmount(
    packageCardPackageItems.reduce((sum, item) => sum + parseAmount(item.amount), 0) +
      packageCardAddOnItems.reduce((sum, item) => sum + parseAmount(item.amount), 0) +
      packageCardManualAmount + packageCardAdjustmentSubtotal,
    "$0.00",
  );

  const receiptLines = useMemo(() => {
    const lines = [
      { label: `${serviceName} package`, amount: packageSubtotal },
      ...(addOnItems.length > 0 ? addOnItems.map((item) => ({ label: item.label, amount: item.amount })) : []),
    ];

    if (membershipFee !== "$0.00") lines.push({ label: "Membership discount", amount: `-${membershipFee}` });
    if (couponAmount !== "$0.00") lines.push({ label: "Coupon discount", amount: `-${couponAmount}` });
    if (discountAmount !== "$0.00") lines.push({ label: "Discount", amount: `-${discountAmount}` });

    return lines;
  }, [addOnItems, couponAmount, discountAmount, membershipFee, packageSubtotal, serviceName]);

  const paidReceiptPayments = useMemo(() => {
    return detail?.payments?.filter((payment) => isPaidPaymentStatus(payment.status)) ?? [];
  }, [detail?.payments]);

  const paidTotal = useMemo(() => {
    const total = paidReceiptPayments.reduce((sum, payment) => sum + parseAmount(payment.amount), 0);
    return formatAmount(total ?? 0, "$0.00");
  }, [paidReceiptPayments]);

  const tipOptions = useMemo(() => {
    const baseAmount = parseAmount(detail?.final_amount);
    return [8, 12, 16, 20].map((percent) => ({
      percent,
      amount: Number(((baseAmount * percent) / 100).toFixed(2)),
    }));
  }, [detail?.final_amount]);

  const selectedPresetTipAmount =
    tipOptions.find((option) => option.percent === selectedTipPercent)?.amount ?? 0;
  const selectedTipAmount = customTipAmount.trim() ? parseAmount(customTipAmount) : selectedPresetTipAmount;
  const pendingTipPayment = useMemo(() => {
    return (
      detail?.payments
        ?.filter((payment) => payment.kind.toLowerCase() === "tip" && isPendingCheckoutStatus(payment.status))
        .reduce<BookingPaymentOut | null>((latest, payment) => {
          return !latest || payment.id > latest.id ? payment : latest;
        }, null) ?? null
    );
  }, [detail?.payments]);
  const canCheckTipPayment = Boolean(pendingTipPayment?.retryable);
  const isTipPaymentProcessing = Boolean(pendingTipPayment && pendingTipPayment.status.toLowerCase() !== "open");

  useEffect(() => {
    if (!pendingTipPayment || (pendingTipPayment.status.toLowerCase() !== "open" && !pendingTipPayment.retryable)) return;
    const amount = parseAmount(pendingTipPayment.amount);
    const matchingOption = tipOptions.find((option) => option.amount === amount);
    if (matchingOption) {
      setSelectedTipPercent(matchingOption.percent);
      setCustomTipAmount("");
    } else {
      setCustomTipAmount(amount.toFixed(2));
    }
  }, [pendingTipPayment, tipOptions]);
  const hasPaidTip = Boolean(
    detail?.tip_status === "succeeded" || detail?.payments?.some((payment) => payment.kind.toLowerCase() === "tip" && isPaidPaymentStatus(payment.status)),
  );
  const isTipDecisionComplete = hasPaidTip || detail?.tip_decision === "declined" || detail?.tip_decision === "system_closed";

  useEffect(() => {
    if (!isModifyOpen) return;
    fetchAddresses();
  }, [isModifyOpen, fetchAddresses]);

  useEffect(() => {
    if (!isModifyOpen) return;
    if (selectedAddressId !== null) return;
    const defaultAddress = addresses.find((address) => address.is_default);
    setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id ?? null);
  }, [isModifyOpen, addresses, selectedAddressId]);

  const handleSaveAddress = () => {
    const selected = addresses.find((address) => address.id === selectedAddressId) || null;
    setAddressOverride(selected);
    setIsModifyOpen(false);
  };

  // 会员和优惠券信息
  const membershipSnapshot = (detail?.membership_snapshot as Record<string, unknown> | undefined) ?? {};
  const couponSnapshot = (detail?.coupon_snapshot as Record<string, unknown> | undefined) ?? {};
  const hasMembership = Object.keys(membershipSnapshot).length > 0;
  const hasCoupon = Object.keys(couponSnapshot).length > 0;
  
  const canCancel = [
    "pending_assignment",
    "awaiting_client_confirmation",
    "confirmed",
    "traveling",
  ].includes(normalizedStatus);
  const showGroomerOnTheWayCancelTag =
    normalizedStatus === "traveling" || isWithinTwoHoursBefore(detail?.scheduled_time_utc || detail?.scheduled_time);
  const cancelFeeRateDisplay = cancelQuote ? formatPercentRate(cancelQuote.fee_rate) : null;
  const isInitialLoading = isLoading && !detail && !error;

  const handleConfirmProposedTime = async () => {
    if (!detail?.id) return;

    const selectedTime = proposedTimeOptions.find((option) => option.key === selectedProposedTimeKey);
    if (!selectedTime) {
      toast.error("Please select a proposed time");
      return;
    }

    setIsConfirmingProposedTime(true);
    try {
      const datetimeLocal = selectedTime.datetime_local ?? toLocalDateTimeString(selectedTime.date, selectedTime.time);
      await clientConfirmBookingTime(detail.id, {
        accept: true,
        selected_time: {
          date: selectedTime.date,
          slot: selectedTime.slot,
          time: selectedTime.time,
          datetime_local: datetimeLocal,
        },
      });
      const updatedDetail = await getBookingDetail(detail.id);
      setDetail(updatedDetail);
      toast.success("Booking confirmed");
    } catch (actionError) {
      console.error("Failed to confirm booking time:", actionError);
      if (isForbiddenError(actionError)) {
        toast.error("You are not allowed to confirm this booking time");
      } else {
        toast.error("Failed to confirm booking time");
      }
    } finally {
      setIsConfirmingProposedTime(false);
    }
  };

  const handleRejectProposedTime = async () => {
    if (!detail?.id) return;

    setIsRejectingProposedTime(true);
    try {
      await clientConfirmBookingTime(detail.id, { accept: false });
      const updatedDetail = await getBookingDetail(detail.id);
      setDetail(updatedDetail);
      toast.success("Proposed time declined");
    } catch (actionError) {
      console.error("Failed to decline booking time:", actionError);
      if (isForbiddenError(actionError)) {
        toast.error("You are not allowed to decline this booking time");
      } else {
        toast.error("Failed to decline booking time");
      }
    } finally {
      setIsRejectingProposedTime(false);
    }
  };

  const handleGoPay = async () => {
    if (!detail?.id) return;

    setIsCardActionLoading(true);
    try {
      const session = await createDepositSession(detail.id);
      // Saved-card direct charge succeeded — no redirect needed
      if (session.status === "succeeded") {
        const updated = await getBookingDetail(detail.id);
        setDetail(updated);
        toast.success("Payment received! Your booking is being processed.");
        setIsCardActionLoading(false);
        return;
      }
      const redirectUrl = getPaymentSessionRedirectUrl(session);
      if (!redirectUrl) {
        throw new Error(`Invalid payment redirect URL: ${session.url}`);
      }
      window.location.assign(redirectUrl);
    } catch (actionError) {
      console.error("Failed to create payment session:", actionError);
      if (isPaymentExpiredError(actionError)) {
        const updatedDetail = await getBookingDetail(detail.id);
        setDetail(updatedDetail);
        toast.error("This booking has expired and was canceled.");
      } else {
        toast.error("Failed to start payment");
      }
      setIsCardActionLoading(false);
    }
  };

  const handlePayAdjustment = async () => {
    if (!detail?.id || !pendingAdjustment) return;
    setIsPayingAdjustment(true);
    try {
      const result = await clientDecideAddOn(detail.id, pendingAdjustment.id, true);
      if (result.status === "payment_required") {
        if (!result.payment_url) throw new Error("Missing adjustment payment URL");
        window.location.assign(result.payment_url);
        return;
      }
      setDetail(await getBookingDetail(detail.id));
      if (result.status === "payment_verification_required") {
        toast.info("Checking the payment result. Please try again shortly.");
      } else if (result.status === "refund_pending") {
        toast.info("Refund is processing. Grooming can start when it succeeds.");
      } else {
        toast.success(isRefundAdjustment ? "Refund confirmed" : "Adjustment payment received");
      }
    } catch (actionError) {
      console.error("Failed to pay booking adjustment:", actionError);
      toast.error("Failed to start adjustment payment");
    } finally {
      setIsPayingAdjustment(false);
    }
  };

  const handleCreateTipSession = async () => {
    if (!detail?.id || isCreatingTipSession) return;

    const amount = canCheckTipPayment && pendingTipPayment ? parseAmount(pendingTipPayment.amount) : selectedTipAmount;
    if (amount < 0) {
      toast.error("Tip amount cannot be negative");
      return;
    }

    setIsCreatingTipSession(true);
    try {
      const session = await createTipSession(detail.id, amount.toFixed(2));
      if (!session) {
        throw new Error("Tip payment returned an empty response");
      }
      if ("tip_decision" in session && session.tip_decision === "declined") {
        setDetail(await getBookingDetail(detail.id));
        toast.success("No tip added");
        setIsCreatingTipSession(false);
        return;
      }
      if ("status" in session && session.status === "succeeded") {
        setDetail(await getBookingDetail(detail.id));
        toast.success("Tip payment received");
        setIsCreatingTipSession(false);
        return;
      }
      if ("status" in session && session.status === "verification_required") {
        setDetail(await getBookingDetail(detail.id));
        toast.info("Checking your tip payment. Please try again shortly.");
        setIsCreatingTipSession(false);
        return;
      }
      if (!("url" in session)) {
        throw new Error("Tip payment did not return a checkout URL");
      }
      const redirectUrl = getPaymentSessionRedirectUrl(session);
      if (!redirectUrl) {
        throw new Error(`Invalid tip payment redirect URL: ${session.url}`);
      }
      window.location.assign(redirectUrl);
    } catch (actionError) {
      console.error("Failed to create tip session:", actionError);
      if (actionError instanceof HttpError && actionError.status === 409) {
        const updatedDetail = await getBookingDetail(detail.id);
        setDetail(updatedDetail);
        if (actionError.message.includes("manual verification")) {
          toast.error("Please contact support to confirm the previous tip payment before trying again.");
        } else if (actionError.message.includes("previous tip")) {
          toast.error("We could not confirm the previous payment status. Please try again shortly.");
        } else {
          toast.error("Tip is not available for this booking");
        }
      } else {
        toast.error("Failed to start tip payment");
      }
      setIsCreatingTipSession(false);
    }
  };

  const handlePendingAction = (message: string) => {
    toast(message);
  };

  const handleOpenReview = () => {
    const review = detail?.review;
    setRating(review?.rating ?? 5);
    setTechnicalRating(review?.technical_rating || review?.rating || 5);
    setAttitudeRating(review?.attitude_rating || review?.rating || 5);
    setEnvironmentRating(review?.environment_rating || review?.rating || 5);
    setReviewComment(review?.comment ?? "");
    setIsReviewOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!detail?.id || isSubmittingReview) return;

    setIsSubmittingReview(true);
    try {
      const payload = {
        rating,
        technical_rating: technicalRating,
        attitude_rating: attitudeRating,
        environment_rating: environmentRating,
        comment: reviewComment.trim(),
      };

      if (detail.review) {
        await updateReview(detail.id, payload);
      } else {
        await createReview(detail.id, payload);
      }

      const updatedDetail = await getBookingDetail(detail.id);
      setDetail(updatedDetail);
      setIsReviewOpen(false);
      toast.success(detail.review ? "Review updated" : "Review submitted");
    } catch (actionError) {
      console.error("Failed to submit review:", actionError);
      if (actionError instanceof HttpError && actionError.status === 409) {
        const updatedDetail = await getBookingDetail(detail.id);
        setDetail(updatedDetail);
        setIsReviewOpen(false);
        toast.error("Review has already been submitted");
      } else {
        toast.error("Failed to submit review");
      }
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!detail?.id || isSubmittingComplaint) return;
    const content = complaintContent.trim();
    if (!content) {
      toast.error("Please share what happened");
      return;
    }
    setIsSubmittingComplaint(true);
    try {
      await createPetOwnerComplaint(detail.id, content);
      const updatedDetail = await getBookingDetail(detail.id);
      setDetail(updatedDetail);
      setIsComplaintOpen(false);
      setComplaintContent("");
      toast.success("Complaint submitted");
    } catch (actionError) {
      if (actionError instanceof HttpError && actionError.status === 409) {
        const updatedDetail = await getBookingDetail(detail.id);
        setDetail(updatedDetail);
        setIsComplaintOpen(false);
        toast.error("A complaint has already been submitted");
      } else {
        toast.error("Failed to submit complaint");
      }
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  const handleEditAwaitingPaymentBooking = () => {
    if (!detail) return;
    loadBookingDetailForEdit(detail);
    navigate("/booking");
  };

  const loadCancelQuote = async (bookingId: number) => {
    setIsLoadingCancelQuote(true);
    setCancelQuoteError(null);
    try {
      const quote = await getCancelQuote(bookingId);
      setCancelQuote(quote);
    } catch (quoteError) {
      console.error("Failed to load cancel quote:", quoteError);
      setCancelQuote(null);
      setCancelQuoteError("Unable to load cancellation fee.");
    } finally {
      setIsLoadingCancelQuote(false);
    }
  };

  const handleCancelDialogOpenChange = (open: boolean) => {
    setIsCancelDialogOpen(open);
    if (!open) {
      setCancelReason("");
      setCancelQuote(null);
      setCancelQuoteError(null);
      return;
    }
    if (detail?.id) void loadCancelQuote(detail.id);
  };
  
  // 处理取消预约
  const handleCancelBooking = async () => {
    if (!detail?.id) return;
    const reason = cancelReason.trim();
    if (!reason) {
      toast.error("Please share your reason for cancellation");
      return;
    }

    setIsCanceling(true);
    try {
      await cancelBooking(detail.id, reason);
      setIsCancelDialogOpen(false);
      setCancelReason("");
      toast.success("Booking canceled successfully");
      // 刷新数据或跳转回 dashboard
      navigate("/account/dashboard");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="flex min-h-full w-full flex-col">
      <AccountContentContainer className="flex-1 px-6 pb-8">
        <div className="flex flex-col gap-5">
          <div className="flex h-[27px] items-center">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 whitespace-nowrap font-comfortaa text-[14px] leading-[20px] font-bold text-[#4A3C2A]"
            >
              <Link to="/account/dashboard" className="hover:text-[#DE6A07] transition-colors">
                Dashboard
              </Link>
              <span aria-hidden="true">{" > "}</span>
              <span>{isInitialLoading ? "Upcoming booking" : `${breadcrumbBookingLabel} - ${petName}`}</span>
            </nav>
          </div>

          {isInitialLoading ? (
            <>
              <div className="rounded-[12px] bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-5">
                  <div className="flex items-end justify-between gap-[14px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
                      <div className="flex items-start justify-between gap-[14px]">
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <Skeleton className="h-7 w-32 rounded-md" />
                          <Skeleton className="h-[18px] w-56 rounded-md" />
                        </div>
                        <Skeleton className="h-3 w-16 rounded-md" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-2 w-full rounded-[8px]" />
                        <Skeleton className="h-6 w-[180px] rounded-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex min-w-[220px] flex-1 flex-col gap-1">
                      <Skeleton className="h-3 w-16 rounded-md" />
                      <Skeleton className="h-4 w-40 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-[136px] rounded-[32px]" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-7 w-48 rounded-md" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-14 rounded-md" />
                      <Skeleton className="h-4 w-full max-w-[240px] rounded-md" />
                      <Skeleton className="h-4 w-full max-w-[180px] rounded-md" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-20 rounded-md" />
                      <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
          <div className="rounded-[12px] bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-5">
              <div className="flex items-end justify-between gap-[14px]">
                <div className="flex min-w-0 flex-1 flex-col gap-[14px]">
                  <div className="flex items-start justify-between gap-[14px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#DE6A07]">
                        {petName}
                      </p>
                      <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px] text-[#4A5565]">
                        {serviceSummary}
                      </p>
                    </div>
                    <p className="font-comfortaa text-[10px] font-normal leading-[12px] text-[#4A3C2A]">
                      {bookingCode}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="relative h-2 w-full rounded-[8px] bg-[#D9D9D9]">
                      <div
                        className="absolute left-0 top-0 h-full rounded-[8px] transition-all duration-300"
                        style={{
                          width: `${detailCardConfig.progressWidth}%`,
                          backgroundColor: detailCardConfig.progressColor,
                        }}
                      />
                    </div>
                    <StatusBadge label={detailCardConfig.badgeLabel} tone={detailCardConfig.badgeTone} />
                  </div>
                </div>
              </div>

              {detailCardConfig.actionKind === "confirm" ? (
                <>
                  {detailCardConfig.showNextStep ? (
                    <div className="flex items-start">
                      <div className="flex min-w-0 flex-1 flex-col gap-1 text-[#4A3C2A]">
                        <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                          Next step
                        </p>
                        <p className="font-comfortaa text-[12px] font-bold leading-[16px]">
                          {detailCardConfig.nextStep}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex w-full flex-wrap items-center gap-2">
                    <div className="flex min-w-[220px] flex-1 flex-col gap-1">
                      <p className="font-comfortaa text-[10px] font-normal leading-[12px] text-[#4A3C2A]">
                        Select new time proposed by groomer
                      </p>
                      <div className="flex flex-col gap-2">
                        {proposedTimeOptions.map((option) => {
                          return (
                            <div key={option.key}>
                              <CustomRadio
                                label={option.label}
                                variant="inline"
                                isSelected={selectedProposedTimeKey === option.key}
                                onClick={() => setSelectedProposedTimeKey(option.key)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <OrangeButton
                      type="button"
                      variant="secondary"
                      size="compact"
                      className="min-w-[100px]"
                      loading={isRejectingProposedTime}
                      disabled={isConfirmingProposedTime || isRejectingProposedTime}
                      onClick={handleRejectProposedTime}
                    >
                      Cancel
                    </OrangeButton>
                    <OrangeButton
                      type="button"
                      variant="primary"
                      size="compact"
                      className="min-w-[100px]"
                      loading={isConfirmingProposedTime}
                      disabled={isConfirmingProposedTime || isRejectingProposedTime}
                      onClick={handleConfirmProposedTime}
                    >
                      Confirm
                    </OrangeButton>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-5">
                  {detailCardConfig.actionKind === "pay" && compactPreferredTimeSlotLabels.length > 0 ? (
                    <div className="flex flex-col gap-1 text-[#4A3C2A]">
                      <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                        Time selected
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className="font-comfortaa text-[12px] font-bold leading-[17.5px]">
                          {compactPreferredTimeSlotLabels.map((label, index) => (
                            <span key={label}>
                              {label}
                              {index < compactPreferredTimeSlotLabels.length - 1 ? " | " : ""}
                            </span>
                          ))}
                        </p>
                        <button
                          type="button"
                          className="flex size-5 cursor-pointer items-center justify-center rounded-full text-[#8B6357] transition-colors hover:bg-[#F9F1E8]"
                          aria-label="Edit booking"
                          onClick={handleEditAwaitingPaymentBooking}
                        >
                          <Icon name="pencil" className="size-4 text-current" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {detailCardConfig.actionKind === "pay_adjustment" ? (
                    <div className="flex flex-col gap-1 text-[#4A3C2A]">
                      <p className="font-comfortaa text-[10px] leading-3">Check-in adjustment</p>
                      {adjustmentLines.map((line, index) => (
                        <p key={`${line.label}-${index}`} className="font-comfortaa text-[12px] leading-4">
                          {line.label} {line.amount < 0 ? "-" : ""}{formatAmount(Math.abs(line.amount), "$0.00")}
                        </p>
                      ))}
                      <p className="border-t border-[#4A3C2A] pt-1 font-comfortaa text-[12px] font-bold leading-4">
                        {isRefundAdjustment ? "Refund" : "Total"}: {formatAmount(Math.abs(parseAmount(pendingAdjustment?.amount)), "$0.00")} including GST
                      </p>
                    </div>
                  ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  {detailCardConfig.showNextStep ? (
                    <div className="flex min-w-[220px] flex-1 flex-col gap-1 text-[#4A3C2A]">
                      <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                        Next step
                      </p>
                      <p className="font-comfortaa text-[12px] font-bold leading-[16px]">
                        {detailCardConfig.nextStep}
                      </p>
                    </div>
                  ) : null}

                  {canceledReason ? (
                    <div className="flex min-w-[220px] flex-1 flex-col gap-1 text-[#4A3C2A]">
                      <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                        Canceled reason
                      </p>
                      <p className="font-comfortaa text-[12px] font-bold leading-[16px] break-words">
                        {canceledReason}
                      </p>
                    </div>
                  ) : null}

                  {detailCardConfig.actionKind === "cancel" ? (
                    <>
                      <OrangeButton
                        type="button"
                        variant="secondary"
                        size="compact"
                        className="min-w-[100px]"
                        onClick={() => handleCancelDialogOpenChange(true)}
                      >
                        Cancel
                      </OrangeButton>
                      {normalizedStatus === "confirmed" && detail?.id && !hasHealthQuestionnaire ? (
                        <OrangeButton
                          type="button"
                          variant="primary"
                          size="compact"
                          textSize={12}
                          className="min-w-[100px]"
                          onClick={() => navigate(`/health-form/${detail.id}`)}
                        >
                          {`Personalize ${petName}'s care`}
                        </OrangeButton>
                      ) : null}
                    </>
                  ) : null}

                  {detailCardConfig.actionKind === "review" ? (
                    <div className="flex w-full flex-col gap-4">
                      {detail?.review && hasPaidTip ? (
                        <div className="flex w-full flex-wrap items-center gap-2">
                          <div className="flex min-w-[220px] flex-1 flex-col gap-1 text-[#4A3C2A]">
                            <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                              Our recommendation
                            </p>
                            <p className="font-comfortaa text-[12px] font-bold leading-[16px]">
                              {recommendationLabel}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <OrangeButton
                              type="button"
                              variant="secondary"
                              size="compact"
                              className="min-w-[136px] bg-white! hover:bg-[#F9F1E8]!"
                              onClick={() => setIsReceiptOpen(true)}
                            >
                              Receipt
                            </OrangeButton>
                            <OrangeButton
                              type="button"
                              variant="secondary"
                              size="compact"
                              className="min-w-[136px] bg-white! hover:bg-[#F9F1E8]!"
                              onClick={() => handlePendingAction("Health report is not available yet")}
                            >
                              Health report
                            </OrangeButton>
                          </div>
                        </div>
                      ) : isTipDecisionComplete ? (
                        <div className="flex w-full flex-wrap items-center justify-end gap-2">
                            <OrangeButton
                              type="button"
                              variant="secondary"
                              size="compact"
                              className="min-w-[136px] bg-white! hover:bg-[#F9F1E8]!"
                              onClick={() => setIsReceiptOpen(true)}
                            >
                              Receipt
                            </OrangeButton>
                            {detail?.can_review !== false ? (
                              <OrangeButton
                                type="button"
                                variant="primary"
                                size="compact"
                                className="min-w-[136px] bg-[#633479]! hover:bg-[#734886]! active:bg-[#734886]! focus-visible:bg-[#734886]!"
                                onClick={handleOpenReview}
                              >
                                Review
                              </OrangeButton>
                            ) : null}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">Tip your groomer?</p>
                          <>
                            <div className="grid grid-cols-2 gap-2">
                              {tipOptions.map((option) => {
                                const isSelected = !customTipAmount.trim() && selectedTipPercent === option.percent;
                                return (
                                  <button
                                    key={option.percent}
                                    type="button"
                                    disabled={isTipPaymentProcessing || isCreatingTipSession}
                                    onClick={() => {
                                      setSelectedTipPercent(option.percent);
                                      setCustomTipAmount("");
                                    }}
                                    className={`flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] border bg-white px-3 font-comfortaa text-[15px] leading-[18px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2374ff] active:bg-white ${
                                      isSelected
                                        ? "border-[#633479] bg-[linear-gradient(166deg,#FFF7ED_0%,#FFFBEB_100%)] font-bold text-[#633479]"
                                        : "border-[0.735px] border-[#D1D5DB] bg-white font-medium text-[#4A2C55] hover:border-[#633479] hover:bg-[#FBFAF7]"
                                    }`}
                                  >
                                    {option.percent}% - {option.amount.toFixed(2)}$
                                  </button>
                                );
                              })}
                            </div>

                            <CustomInput
                              label="Others"
                              type="number"
                              min="0"
                              step="0.01"
                              value={customTipAmount}
                              onChange={(event) => setCustomTipAmount(event.target.value)}
                              disabled={isTipPaymentProcessing || isCreatingTipSession}
                              placeholder="Enter tip"
                              leftElement={<span className="mr-1 font-comfortaa text-[12.25px] text-[#717182]">$</span>}
                              inputClassName="font-normal"
                            />

                            {pendingTipPayment ? (
                              <p className="font-comfortaa text-[11px] font-normal leading-4 text-[#8B6357]">
                                {isTipPaymentProcessing
                                  ? canCheckTipPayment
                                    ? "Your tip payment needs confirmation. Check its status before changing the amount."
                                    : "Your tip payment is processing. The tip entry will update after payment confirmation."
                                  : "Your tip payment was not completed. Continue to checkout or change the tip amount."}
                              </p>
                            ) : null}

                            <OrangeButton
                              type="button"
                              variant="primary"
                              size="compact"
                              fullWidth
                              className="bg-[#8B6357] hover:bg-[#8B6357]/90 active:bg-[#8B6357]/90 focus-visible:bg-[#8B6357]/90"
                              loading={isCreatingTipSession}
                              disabled={isTipPaymentProcessing && !canCheckTipPayment}
                              onClick={handleCreateTipSession}
                            >
                              {canCheckTipPayment ? "Check tip payment" : isTipPaymentProcessing ? "Tip payment processing" : pendingTipPayment ? "Continue tip payment" : "Confirm & release Groomer"}
                            </OrangeButton>
                          </>
                        </div>
                      )}
                    </div>
                  ) : null}

                  {detailCardConfig.actionKind === "comment" ? (
                    <OrangeButton
                      type="button"
                      variant="secondary"
                      size="compact"
                      className="min-w-[100px]"
                      disabled={Boolean(detail?.complaint) || isSubmittingComplaint}
                      onClick={() => setIsComplaintOpen(true)}
                    >
                      {detail?.complaint ? "Complaint submitted" : "Submit a complaint"}
                    </OrangeButton>
                  ) : null}

                  {detailCardConfig.actionKind === "pay" ? (
                    <OrangeButton
                      type="button"
                      variant="primary"
                      size="compact"
                      className="min-w-[100px]"
                      showArrow
                      loading={isCardActionLoading}
                      onClick={handleGoPay}
                    >
                      Go pay
                    </OrangeButton>
                  ) : null}
                  {detailCardConfig.actionKind === "pay_adjustment" ? (
                    <OrangeButton
                      type="button"
                      variant="primary"
                      size="compact"
                      className="min-w-[180px] bg-[#8B6357] hover:bg-[#8B6357]/90"
                      showArrow
                      loading={isPayingAdjustment}
                      onClick={handlePayAdjustment}
                    >
                      {isRefundAdjustment ? "Confirm refund" : "Go pay for adjustment"}
                    </OrangeButton>
                  ) : null}
                </div>
                </div>
              )}

              {isLoading ? (
                <p className="text-[10px] text-[#8B6357]">Loading booking detail...</p>
              ) : error ? (
                <p className="text-[10px] text-red-600">{error}</p>
              ) : null}
            </div>
          </div>

          {detail?.review && detail?.can_review !== false ? (
            <div className="rounded-xl bg-white p-6 shadow-[0px_8px_6px_0px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-2">
                <p className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">
                  Review
                </p>
                <div className="flex items-start">
                  <div className="flex min-w-0 flex-1 flex-col gap-1 font-comfortaa text-[12px] leading-4">
                    {reviewedDisplay ? (
                      <p className="font-bold text-[#4A5565]">{reviewedDisplay}</p>
                    ) : null}
                    <p className="font-normal text-[#4A3C2A]">{reviewCommentDisplay}</p>
                  </div>
                </div>
                <OrangeButton
                  type="button"
                  variant="secondary"
                  size="compact"
                  textSize={12}
                  className="h-7! w-[103px] px-[30px]!"
                  onClick={handleOpenReview}
                >
                  Modify
                </OrangeButton>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-2">
              <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Address and service type
              </p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                    Address
                  </p>
                  <div className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                    <p>{addressLine1}</p>
                    <p>{addressLine2}</p>
                  </div>
                </div>
                <div>
                  <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                    Service type
                  </p>
                  <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                    {serviceType}
                  </p>
                </div>
              </div>
              {canModifyAddress ? (
                <OrangeButton
                  variant="secondary"
                  size="compact"
                  className="w-[103px]"
                  onClick={() => setIsModifyOpen(true)}
                >
                  Modify
                </OrangeButton>
              ) : null}
            </div>
          </div>

          {preferredTimeSlotLabels.length > 0 && detailCardConfig.actionKind !== "pay" ? (
            <div className="rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-2">
                <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                  Date and time period
                </p>
                <div className="flex flex-col gap-1 text-[#4A3C2A]">
                  <p className="font-comfortaa text-[10px] font-normal leading-[12px]">
                    Date and time selected
                  </p>
                  <div className="font-comfortaa text-[12px] font-bold leading-[16px]">
                    {preferredTimeSlotLabels.map((label) => (
                      <p key={label}>{label}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
            </>
          )}

          {isInitialLoading ? (
            <>
              <div className="rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-3.5">
                  <Skeleton className="h-7 w-40 rounded-md" />
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-40 rounded-md" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-7 w-20 rounded-md" />
                      <Skeleton className="size-5 rounded-md" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-28 rounded-md" />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-4 w-36 rounded-md" />
                        <Skeleton className="h-4 w-14 rounded-md" />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-4 w-24 rounded-md" />
                        <Skeleton className="h-4 w-14 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-[#DE6A07] bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-3.5">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-7 w-48 rounded-md" />
                      <Skeleton className="h-4 w-44 rounded-md" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-7 w-20 rounded-md" />
                      <Skeleton className="h-6 w-20 rounded-xl" />
                      <Skeleton className="h-3 w-16 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-3.5">
                  <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                    Package and add-on
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                      Total estimation for the service
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#DE6A07]">
                        {packageAndAddonTotal}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPackageExpanded((value) => !value)}
                        className="flex size-5 cursor-pointer items-center justify-center rounded-[8px] hover:border hover:border-[#8b6357] hover:border-solid transition-colors"
                        aria-expanded={isPackageExpanded}
                        aria-label="Toggle package and add-on details"
                      >
                        <AccordionChevron
                          open={isPackageExpanded}
                          className="size-5 text-[#4A3C2A]"
                        />
                      </button>
                    </div>
                  </div>

                  <AccordionPanel open={isPackageExpanded} contentClassName="flex flex-col gap-3.5">
                      {packageCardPackageItems.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                            {serviceName} package
                          </p>
                          <div className="flex flex-col gap-1">
                            {packageCardPackageItems.map((item, index) => (
                              <div key={`package-${index}`} className="flex items-center justify-between">
                                <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                                  {item.label}
                                </p>
                                <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                                  {item.amount}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="my-1 border-t border-[#E5E7EB]" />
                          <div className="flex items-center justify-between">
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              Subtotal
                            </p>
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {formatAmount(
                                parseAmount(packageCardPackageItems[0]?.amount) +
                                  parseAmount(detail?.mobile_van_service_amount) +
                                  parseAmount(detail?.safety_insurance_amount),
                                "$0.00",
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {packageCardAddOnItems.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                            Add-on
                          </p>
                          <div className="flex flex-col gap-1">
                            {packageCardAddOnItems.map((item, index) => (
                              <div key={`addon-${index}`} className="flex items-center justify-between">
                                <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                                  {item.label}
                                </p>
                                <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                                  {item.amount}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="my-1 border-t border-[#E5E7EB]" />
                          <div className="flex items-center justify-between">
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              Subtotal
                            </p>
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {formatAmount(packageCardAddOnItems.reduce((sum, item) => sum + parseAmount(item.amount), 0), "$0.00")}
                            </p>
                          </div>
                        </div>
                      )}

                      {packageCardManualAmount > 0 && (
                        <div className="flex items-center justify-between font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">
                          <span>Personalization</span>
                          <span>{formatAmount(packageCardManualAmount, "$0.00")}</span>
                        </div>
                      )}

                      {packageCardAdjustment && packageCardAdjustmentLines.length > 0 ? (
                        <div className="flex flex-col gap-1 border-t border-[#E5E7EB] pt-2 text-[#DE6A07]">
                          <p className="font-comfortaa text-[10px] leading-3">Check-in adjustment</p>
                          {packageCardAdjustmentLines.map((line, index) => (
                            <div key={`${line.label}-${index}`} className="flex justify-between gap-3 font-comfortaa text-[12px] font-bold leading-4">
                              <span>{line.label}</span>
                              <span>{line.amount < 0 ? "-" : ""}{formatAmount(Math.abs(line.amount), "$0.00")}</span>
                            </div>
                          ))}
                          <div className="flex justify-between gap-3 border-t border-[#4A3C2A] pt-1 font-comfortaa text-[12px] font-bold leading-4">
                            <span>Subtotal</span>
                            <span>{formatAmount(packageCardAdjustmentSubtotal, "$0.00")}</span>
                          </div>
                        </div>
                      ) : null}

                      {parseAmount(detail?.refunded_amount) > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="font-comfortaa text-[12px] text-[#4A3C2A]">Refunded</span>
                          <span className="font-comfortaa text-[12px] font-bold text-[#16A34A]">-{refundedAmount}</span>
                        </div>
                      )}
                  </AccordionPanel>
                </div>
              </div>

              <div className="rounded-[calc(12*var(--px393))] border-2 border-solid border-[#de6a07] bg-white p-[calc(20*var(--px393))] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] sm:rounded-xl sm:p-6">
                <div className="flex items-start justify-between gap-6">
                  {/* Left side: Title and subtitle */}
                  <div className="flex flex-col gap-1 text-[#4a5565]">
                    <p className="font-comfortaa font-semibold leading-[28px] text-[16px] text-[#4a3c2a]">
                      Total estimation for the service
                    </p>
                    <p className="font-comfortaa font-normal leading-[17.5px] text-[12.25px]">
                      {hasCheckedIn
                        ? "Final price includes check-in adjustment"
                        : "Our groomer will evaluate the final price"}
                    </p>
                  </div>

                  {/* Right side: Price + Accordion */}
                  <div className="flex w-[428px] flex-col items-end gap-1.5">
                    {/* Top row: was + final price + chevron */}
                    <div className="flex items-center justify-end gap-2">
                      {originalTotal > parseAmount(totalEstimation) && (
                        <span className="font-comfortaa font-normal leading-[17.5px] text-[12.25px] text-[#4a3c2a]">
                          was {originalTotalFormatted}
                        </span>
                      )}
                      <p className="font-comfortaa font-bold leading-[24.5px] text-[16px] text-[#de6a07]">
                        {totalEstimation}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsTotalExpanded((value) => !value)}
                        className="flex size-5 cursor-pointer items-center justify-center rounded-[8px] hover:border hover:border-[#8b6357] hover:border-solid transition-colors"
                        aria-expanded={isTotalExpanded}
                        aria-label="Toggle total estimation details"
                      >
                        <AccordionChevron
                          open={isTotalExpanded}
                          className="size-5 text-[#4A3C2A]"
                        />
                      </button>
                    </div>

                    {/* Second row: badge + breakdown + plus tax */}
                    <AccordionPanel open={isTotalExpanded} className="w-full">
                      <div className="flex flex-col items-end gap-0">
                        <div className="flex items-center gap-2">
                          {percentOff > 0 && (
                            <div className="flex h-6 items-center justify-center gap-1 rounded-xl bg-[#dcfce7] px-3 py-1">
                              <CheckCircleIcon className="size-3.5 text-[#27ae60]" aria-hidden="true" />
                              <span className="font-comfortaa font-bold text-[10px] leading-[14px] text-[#27ae60]">
                                {percentOff}% OFF
                              </span>
                            </div>
                          )}
                          <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#DE6A07]">
                            ({preGstTotal}
                            {hasMembership && membershipFee !== "$0.00" && ` + ${membershipFee}`})
                          </p>
                        </div>
                        <p className="font-comfortaa font-bold text-[10px] leading-[14px] text-[#4a5565]">
                          plus tax
                        </p>
                      </div>
                    </AccordionPanel>

                    {/* Divider + 券明细 —— 对齐 Figma：只有券分组，不单独显示 Discount/Membership */}
                    <AccordionPanel open={isTotalExpanded} className="w-full">
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
                        {detail?.used_coupons && detail.used_coupons.length > 0
                            ? (() => {
                              const coupons = detail.used_coupons;
                              const groups = new Map<string, typeof coupons>([
                                ["cash", []],
                                ["invite", []],
                                ["special_gift", []],
                              ]);
                              const { general, special } = groupCoupons(coupons);
                              for (const coupon of general) {
                                groups.get(getGeneralCouponCategory(coupon))!.push(coupon);
                              }
                              groups.get("special_gift")!.push(...special);

                              const rows: React.ReactNode[] = [];
                              for (const [groupKey, list] of groups) {
                                if (list.length === 0) continue;
                                const label = groupKey === "special_gift"
                                  ? "Special gift"
                                  : formatCouponCategory(groupKey, list[0].type);
                                rows.push(
                                  <div key={`cat-${label}`} className="flex items-center justify-between">
                                    <p className="font-comfortaa font-bold text-[12px] leading-[17.5px] text-[#4a3c2a]">
                                      {label}
                                      {list.length > 1 && ` (${list.length} left)`}
                                    </p>
                                  </div>
                                );
                                // 所有券都做子条目（包括第一张）
                                for (const c of list) {
                                  rows.push(
                                    <div key={`coupon-${c.id}`} className="flex items-center justify-between pl-4">
                                      <p className="font-comfortaa text-[12px] leading-[17.5px] text-[#4a3c2a]">
                                        {getCouponDisplayName(c)}
                                      </p>
                                      <p className="font-comfortaa font-bold text-[12px] text-[#4a3c2a]">
                                        -{formatAmount(c.amount, "$0.00")}
                                      </p>
                                    </div>
                                  );
                                }
                              }
                              return rows;
                            })()
                          : /* fallback: 老 booking 没有 used_coupons，用聚合显示 */
                            (hasCoupon && couponAmount !== "$0.00" && (
                              <div className="flex items-center justify-between">
                                <p className="font-comfortaa font-bold text-[12px] leading-[17.5px] text-[#4a3c2a]">
                                  Coupon discount
                                </p>
                                <p className="font-comfortaa font-bold text-[12px] text-[#4a3c2a]">
                                  -{couponAmount}
                                </p>
                              </div>
                            ))}
                      </div>
                    </AccordionPanel>
                  </div>
                </div>
              </div>

              {canCancel && detailCardConfig.actionKind !== "cancel" && detailCardConfig.actionKind !== "confirm" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCancelDialogOpenChange(true)}
                    disabled={isCanceling}
                    className="flex cursor-pointer items-center justify-center gap-2 font-comfortaa text-[12px] leading-[17.5px] text-[#8B6357] transition-colors hover:text-[#DE6A07] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Icon name="trash" size={16} className="text-current" />
                    {isCanceling ? "Canceling..." : "Cancel booking"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </AccountContentContainer>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={handleCancelDialogOpenChange}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border-[rgba(0,0,0,0.2)] px-0 py-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[520px]">
          <div className="flex flex-col gap-4 pb-8 pt-3">
            <AlertDialogHeader className="gap-2 px-3">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100"
                    aria-label="Close cancel booking dialog"
                  >
                    <XIcon className="size-4 stroke-[1.5]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#4C4C4C]">
                  Cancel booking
                </AlertDialogTitle>
                <span className="size-4" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="flex flex-col gap-4 px-6">
              <AlertDialogDescription className="flex flex-col text-[#4A5565]">
                <p className="font-comfortaa text-[14px] font-bold leading-[22px]">
                  Are you sure you want to cancel booking?
                </p>
                <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px]">
                  Share your reason for cancellation, maybe we can help
                </p>
              </AlertDialogDescription>
              <CustomTextarea
                label="Reason for cancellation"
                placeholder="Share your reason"
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                className="text-[#4A5565]"
                helperTextClassName="hidden"
              />
              {showGroomerOnTheWayCancelTag ? (
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-comfortaa text-[14px] font-bold leading-[22px] text-[#4A5565]">
                    Groomer’s status
                  </p>
                  <div className="inline-flex h-6 items-center justify-center gap-1 rounded-xl bg-[#DCFCE7] px-3 py-1">
                    <CheckCircleIcon className="size-3.5 text-[#27AE60]" aria-hidden="true" />
                    <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#27AE60]">
                      Groomer is on the way
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col text-[#4A5565]">
                <p className="font-comfortaa text-[14px] font-bold leading-[22px]">
                  Rule for cancellation
                </p>
                {isLoadingCancelQuote ? (
                  <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px]">
                    Loading cancellation fee...
                  </p>
                ) : cancelQuoteError ? (
                  <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px] text-[#DE1507]">
                    {cancelQuoteError}
                  </p>
                ) : cancelQuote?.can_cancel === false ? (
                  <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px]">
                    This booking can no longer be canceled.
                  </p>
                ) : (
                  <p className="font-comfortaa text-[12.25px] font-normal leading-[17.5px]">
                    You will be charged {cancelFeeRateDisplay ?? "0"}% of the total invoice.
                  </p>
                )}
              </div>
            </div>
            <AlertDialogFooter className="px-6">
              <div className="flex w-full items-center justify-end gap-2.5">
                <AlertDialogPrimitive.Cancel asChild>
                  <OrangeButton
                    variant="outline"
                    size="medium"
                    textSize={14}
                    className="min-w-[136px]"
                  >
                    No, Keep it
                  </OrangeButton>
                </AlertDialogPrimitive.Cancel>
                <OrangeButton
                  variant="primary"
                  size="medium"
                  textSize={14}
                  className="min-w-[177px]"
                  onClick={handleCancelBooking}
                  loading={isCanceling}
                  disabled={!cancelReason.trim() || isLoadingCancelQuote || !cancelQuote || Boolean(cancelQuoteError) || cancelQuote.can_cancel === false}
                >
                  Yes, send request
                </OrangeButton>
              </div>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border-[rgba(0,0,0,0.2)] px-0 py-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[560px]">
          <div className="flex flex-col gap-4 pb-6 pt-3">
            <AlertDialogHeader className="gap-2 px-3">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100"
                    aria-label="Close receipt dialog"
                  >
                    <XIcon className="size-4 stroke-[1.5]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#4C4C4C]">
                  Receipt
                </AlertDialogTitle>
                <span className="size-4" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="flex flex-col gap-4 px-6">
              <AlertDialogDescription className="sr-only">
                Booking receipt for {petName}
              </AlertDialogDescription>
              <div>
                <p className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">{petName}</p>
                <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">{serviceSummary}</p>
                {bookingCode ? (
                  <p className="mt-1 font-comfortaa text-[12px] leading-4 text-[#8B6357]">{bookingCode}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 rounded-[12px] bg-[#FAF8F4] p-4">
                {receiptLines.map((line) => (
                  <div key={`${line.label}-${line.amount}`} className="flex items-center justify-between gap-4">
                    <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">{line.label}</p>
                    <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">{line.amount}</p>
                  </div>
                ))}
                <div className="my-1 border-t border-[#E5E7EB]" />
                <div className="flex items-center justify-between gap-4">
                  <p className="font-comfortaa text-[14px] font-bold leading-5 text-[#4A3C2A]">Total</p>
                  <p className="font-comfortaa text-[14px] font-bold leading-5 text-[#DE6A07]">{totalEstimation}</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-comfortaa text-[12px] leading-4 text-[#4A5565]">Paid</p>
                  <p className="font-comfortaa text-[12px] leading-4 text-[#4A5565]">{paidTotal}</p>
                </div>
              </div>

              {paidReceiptPayments.length ? (
                <div className="flex flex-col gap-2">
                  <p className="font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">Payments</p>
                  {paidReceiptPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between gap-4">
                      <p className="font-comfortaa text-[12px] leading-4 text-[#4A5565]">
                        {formatPaymentKind(payment.kind)} · {payment.status}
                      </p>
                      <p className="font-comfortaa text-[12px] leading-4 text-[#4A5565]">
                        {formatAmount(payment.amount, "$0.00")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <AlertDialogFooter className="px-6">
              <AlertDialogPrimitive.Cancel asChild>
                <OrangeButton variant="primary" size="medium" textSize={14} className="min-w-[136px]">
                  Done
                </OrangeButton>
              </AlertDialogPrimitive.Cancel>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isReviewOpen} onOpenChange={(open) => !isSubmittingReview && setIsReviewOpen(open)}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border-[rgba(0,0,0,0.2)] px-0 py-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[560px]">
          <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto pb-6 pt-3">
            <AlertDialogHeader className="gap-2 px-3">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Close review dialog"
                  >
                    <XIcon className="size-4 stroke-[1.5]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#4C4C4C]">
                  Rating and review
                </AlertDialogTitle>
                <span className="size-4" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="flex flex-col gap-4 px-6">
              <AlertDialogDescription className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                Share your experience with {petName}'s service.
              </AlertDialogDescription>

              <RatingControl label="Overall rating" value={rating} onChange={setRating} />
              <RatingControl label="Technical skill" value={technicalRating} onChange={setTechnicalRating} />
              <RatingControl label="Attitude" value={attitudeRating} onChange={setAttitudeRating} />
              <RatingControl label="Environment" value={environmentRating} onChange={setEnvironmentRating} />

              <CustomTextarea
                label="Comment"
                placeholder="Share more details"
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                className="text-[#4A5565]"
              />
            </div>
            <AlertDialogFooter className="px-6">
              <div className="flex w-full items-center justify-end gap-2.5">
                <AlertDialogPrimitive.Cancel asChild>
                  <OrangeButton
                    variant="outline"
                    size="medium"
                    textSize={14}
                    className="min-w-[120px]"
                    disabled={isSubmittingReview}
                  >
                    Cancel
                  </OrangeButton>
                </AlertDialogPrimitive.Cancel>
                <OrangeButton
                  variant="primary"
                  size="medium"
                  textSize={14}
                  className="min-w-[136px]"
                  loading={isSubmittingReview}
                  onClick={handleSubmitReview}
                >
                  Submit
                </OrangeButton>
              </div>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isComplaintOpen} onOpenChange={(open) => !isSubmittingComplaint && setIsComplaintOpen(open)}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border-[rgba(0,0,0,0.2)] px-0 py-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[560px]">
          <div className="flex max-h-[85vh] flex-col gap-4 overflow-y-auto pb-6 pt-3">
            <AlertDialogHeader className="gap-2 px-3">
              <div className="flex w-full items-center justify-between">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    disabled={isSubmittingComplaint}
                    className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Close complaint dialog"
                  >
                    <XIcon className="size-4 stroke-[1.5]" />
                  </button>
                </AlertDialogPrimitive.Cancel>
                <AlertDialogTitle className="flex-1 text-center font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#4C4C4C]">
                  Submit a complaint
                </AlertDialogTitle>
                <span className="size-4" />
              </div>
            </AlertDialogHeader>
            <div className="h-px bg-[rgba(0,0,0,0.1)]" />
            <div className="flex flex-col gap-4 px-6">
              <AlertDialogDescription className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                Tell us your experience
              </AlertDialogDescription>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                What did you like or dislike?
              </p>
              <CustomTextarea
                label=""
                placeholder="Share your thoughts"
                value={complaintContent}
                onChange={(event) => setComplaintContent(event.target.value)}
                className="text-[#4A5565]"
                disabled={isSubmittingComplaint}
              />
            </div>
            <AlertDialogFooter className="px-6">
              <div className="flex w-full items-center justify-end gap-2.5">
                <AlertDialogPrimitive.Cancel asChild>
                  <OrangeButton variant="outline" size="medium" textSize={14} className="min-w-[120px]" disabled={isSubmittingComplaint}>
                    Cancel
                  </OrangeButton>
                </AlertDialogPrimitive.Cancel>
                <OrangeButton variant="primary" size="medium" textSize={14} className="min-w-[136px]" loading={isSubmittingComplaint} onClick={handleSubmitComplaint}>
                  Submit
                </OrangeButton>
              </div>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <ModifyAddressModal
        open={isModifyOpen}
        onOpenChange={setIsModifyOpen}
        addresses={addresses}
        isLoading={isLoadingAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={(id) => setSelectedAddressId(id)}
        onAddNew={() => setIsAddAddressOpen(true)}
        onSave={handleSaveAddress}
      />

      <AddAddressModal
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        onSuccess={() => fetchAddresses()}
      />
    </div>
  );
}

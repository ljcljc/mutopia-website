import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CustomInput, CustomRadio, OrangeButton } from "@/components/common";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "@/components/account/accountStore";
import { useBookingStore } from "@/components/booking/bookingStore";
import { HttpError } from "@/lib/http";
import {
  cancelBooking,
  clientConfirmBookingTime,
  createDepositSession,
  createReview,
  createTipSession,
  getBookingDetail,
  getPaymentSessionRedirectUrl,
  updateReview,
  type AddressOut,
  type BookingDetailOut,
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
import { StarIcon, XIcon } from "lucide-react";
import {
  addHoursToApiLocalDateTime,
  formatApiLocalDateTime,
  formatPreferredTimeSlotLocal,
  toLocalDateTimeString,
} from "@/lib/localDateTime";

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
  return ["open", "created", "pending", "requires_payment_method", "requires_confirmation", "requires_action", "processing"].includes(
    status.toLowerCase(),
  );
}

function isSameMoneyAmount(left: number, right: number) {
  return Math.round(left * 100) === Math.round(right * 100);
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

function formatTimeOptionLabel(option: InvitationDecisionTimeOptionIn): string {
  return `${option.date} at ${option.time}`;
}

function normalizeProposedTimeOption(option: InvitationDecisionTimeOptionIn, index: number): ProposedTimeOption | null {
  if (!option.date || !option.slot || !option.time) return null;

  return {
    ...option,
    key: `${option.date}-${option.slot}-${option.time}-${index}`,
    label: formatTimeOptionLabel(option),
  };
}

type DetailBadgeTone = "orange" | "green" | "purple" | "brown" | "outlined";

type DetailCardConfig = {
  subtitleIncludesScheduled: boolean;
  progressColor: string;
  progressWidth: number;
  badgeLabel: string;
  badgeTone: DetailBadgeTone;
  nextStep?: string;
  showNextStep: boolean;
  actionKind: "none" | "cancel" | "confirm" | "review" | "comment" | "pay";
};

function StatusBadge({ label, tone }: { label: string; tone: DetailBadgeTone }) {
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
  const [isCanceling, setIsCanceling] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressOverride, setAddressOverride] = useState<AddressOut | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [selectedProposedTimeKey, setSelectedProposedTimeKey] = useState<string>("");
  const [isCardActionLoading, setIsCardActionLoading] = useState(false);
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
  const [selectedTipPercent, setSelectedTipPercent] = useState(12);
  const [customTipAmount, setCustomTipAmount] = useState("");
  const [isTipDeclined, setIsTipDeclined] = useState(false);
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
    setIsTipDeclined(false);
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
  const bookingCode = formatBookingCode(detail?.order_code, detail?.id);
  const serviceName = (packageSnapshot.name as string | undefined) ?? "Full grooming";
  const serviceType =
    (packageSnapshot.service_type as string | undefined) ??
    (packageSnapshot.type as string | undefined) ??
    "Mobile";
  const serviceTypeLabel = formatServiceTypeLabel(serviceType);
  const scheduledDisplay = formatApiLocalDateTime(detail?.scheduled_time) || "2026-04-03 at 10:00";
  const estimatedCompletionDisplay =
    addHoursToApiLocalDateTime(detail?.scheduled_time, 1) || "Estimated completion soon";
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

  const proposedTimeOptions = useMemo(() => {
    return (
      detail?.time_options
        ?.map((option, index) => normalizeProposedTimeOption(option, index))
        .filter((option): option is ProposedTimeOption => Boolean(option)) ?? []
    );
  }, [detail?.time_options]);

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
          badgeLabel: "Traveling",
          badgeTone: "green",
          nextStep: `Check in: ${scheduledDisplay}`,
          showNextStep: true,
          actionKind: "cancel",
        };
      case "checked_in":
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
      case "completed":
        return {
          subtitleIncludesScheduled: true,
          progressColor: detail?.review ? "#8B6357" : "#633479",
          progressWidth: 98.5,
          badgeLabel: detail?.review ? "Service completed and reviewed" : "Service completed",
          badgeTone: detail?.review ? "brown" : "purple",
          nextStep: detail?.review ? "Review submitted" : "Pending review",
          showNextStep: !detail?.review,
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
  }, [detail?.notes, detail?.review, detail?.scheduled_time, detail?.status, estimatedCompletionDisplay, normalizedStatus, paymentDueDisplay, scheduledDisplay]);

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
  
  // 价格信息（需要在 useMemo 之前定义）
  const totalEstimation = formatAmount(detail?.final_amount, "$0.00");
  const packageSubtotal = formatAmount(detail?.package_amount, "$0.00");
  const addOnSubtotal = formatAmount(detail?.addons_amount, "$0.00");
  
  // 从 package_snapshot 中提取套餐详情
  const packageItems = useMemo(() => {
    if (!detail?.package_snapshot) return [];
    
    const pkg = detail.package_snapshot as Record<string, unknown>;
    const items: Array<{ label: string; amount: string }> = [];
    
    // 套餐名称
    if (pkg.name) {
      const packagePrice = formatAmount(pkg.price as number | string | undefined, "$0.00");
      items.push({ label: pkg.name as string, amount: packagePrice });
    }
    
    // 服务类型（如果是 mobile，可能需要显示额外的费用）
    const pkgServiceType = (pkg.service_type as string | undefined) ?? (pkg.type as string | undefined);
    if (pkgServiceType && pkgServiceType.toLowerCase() === "mobile") {
      // 如果有 mobile 服务费用，可以在这里添加
      // 注意：实际费用可能已经在 package_amount 中包含了
    }
    
    return items.length > 0 ? items : [{ label: serviceName, amount: packageSubtotal }];
  }, [detail?.package_snapshot, serviceName, packageSubtotal]);

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
  const discountRate = detail?.discount_rate
    ? (typeof detail.discount_rate === "number" ? detail.discount_rate : parseFloat(String(detail.discount_rate)) || 0)
    : 0;
  const discountAmount = formatAmount(detail?.discount_amount, "$0.00");
  const couponAmount = formatAmount(detail?.coupon_amount, "$0.00");
  const membershipFee = formatAmount(detail?.membership_fee, "$0.00");

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
  const pendingTipAmount = pendingTipPayment ? parseAmount(pendingTipPayment.amount) : 0;
  const isContinuingPendingTip =
    Boolean(pendingTipPayment) && selectedTipAmount > 0 && isSameMoneyAmount(selectedTipAmount, pendingTipAmount);
  const hasPaidTip = Boolean(
    detail?.payments?.some((payment) => payment.kind.toLowerCase() === "tip" && isPaidPaymentStatus(payment.status)),
  );
  const isTipDecisionComplete = hasPaidTip || isTipDeclined;

  useEffect(() => {
    if (!pendingTipPayment || pendingTipAmount <= 0) return;
    const matchingPreset = tipOptions.find((option) => isSameMoneyAmount(option.amount, pendingTipAmount));
    if (matchingPreset) {
      setSelectedTipPercent(matchingPreset.percent);
      setCustomTipAmount("");
      return;
    }
    setCustomTipAmount(pendingTipAmount.toFixed(2));
  }, [pendingTipPayment?.id, pendingTipAmount, tipOptions]);

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

  const handleCreateTipSession = async () => {
    if (!detail?.id || isCreatingTipSession) return;

    const customTipIsZero = customTipAmount.trim() !== "" && isSameMoneyAmount(selectedTipAmount, 0);
    if (customTipIsZero) {
      setIsTipDeclined(true);
      return;
    }

    if (selectedTipAmount < 0 || selectedTipAmount === 0) {
      toast.error("Please choose a tip amount");
      return;
    }

    setIsCreatingTipSession(true);
    try {
      const session = await createTipSession(detail.id, selectedTipAmount.toFixed(2));
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
        toast.error("Tip is not available for this booking");
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

  const handleEditAwaitingPaymentBooking = () => {
    if (!detail) return;
    loadBookingDetailForEdit(detail);
    navigate("/booking");
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
      <div className="mx-auto flex-1 w-full max-w-[944px] px-6 pb-8">
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
                        {proposedTimeOptions.map((option) => (
                          <CustomRadio
                            key={option.key}
                            label={option.label}
                            variant="inline"
                            isSelected={selectedProposedTimeKey === option.key}
                            onClick={() => setSelectedProposedTimeKey(option.key)}
                          />
                        ))}
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
                    <OrangeButton
                      type="button"
                      variant="secondary"
                      size="compact"
                      className="min-w-[100px]"
                      onClick={() => setIsCancelDialogOpen(true)}
                    >
                      Cancel
                    </OrangeButton>
                  ) : null}

                  {detailCardConfig.actionKind === "review" ? (
                    <div className="flex w-full flex-col gap-4">
                      {detail?.review ? (
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
                            <OrangeButton
                              type="button"
                              variant="primary"
                              size="compact"
                              className="min-w-[136px] bg-[#633479]! hover:bg-[#734886]! active:bg-[#734886]! focus-visible:bg-[#734886]!"
                              onClick={handleOpenReview}
                            >
                              Review
                            </OrangeButton>
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
                              disabled={isCreatingTipSession}
                              placeholder="Enter tip"
                              leftElement={<span className="mr-1 font-comfortaa text-[12.25px] text-[#717182]">$</span>}
                              inputClassName="font-normal"
                            />

                            {pendingTipPayment ? (
                              <p className="font-comfortaa text-[11px] font-normal leading-4 text-[#8B6357]">
                                {isContinuingPendingTip
                                  ? "Payment was not completed. You can continue or change the tip amount."
                                  : "Changing the tip amount will start a new payment and cancel the previous one."}
                              </p>
                            ) : null}

                            <OrangeButton
                              type="button"
                              variant="primary"
                              size="compact"
                              fullWidth
                              className="bg-[#8B6357] hover:bg-[#8B6357]/90 active:bg-[#8B6357]/90 focus-visible:bg-[#8B6357]/90"
                              loading={isCreatingTipSession}
                              onClick={handleCreateTipSession}
                            >
                              {isContinuingPendingTip ? "Continue payment" : "Confirm & release Groomer"}
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
                      onClick={() => handlePendingAction("Comment flow is not available yet")}
                    >
                      Comment
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

          {detail?.review ? (
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
                        {totalEstimation}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPackageExpanded((value) => !value)}
                        className="flex size-5 items-center justify-center rounded-lg hover:border hover:border-[#8B6357] transition-colors"
                        aria-expanded={isPackageExpanded}
                        aria-label="Toggle package and add-on details"
                      >
                        <Icon
                          name="chevron-down"
                          className={`size-5 text-[#4A3C2A] transition-transform ${isPackageExpanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {isPackageExpanded ? (
                    <>
                      {packageItems.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                            {serviceName} package
                          </p>
                          <div className="flex flex-col gap-1">
                            {packageItems.map((item, index) => (
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
                              {packageSubtotal}
                            </p>
                          </div>
                        </div>
                      )}

                      {addOnItems.length > 0 && (
                        <div className="flex flex-col gap-1">
                          <p className="font-comfortaa font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                            Add-on
                          </p>
                          <div className="flex flex-col gap-1">
                            {addOnItems.map((item, index) => (
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
                              {addOnSubtotal}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              <div className="rounded-xl border-2 border-[#DE6A07] bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-3.5">
                    <div>
                      <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                        Total estimation for the service
                      </p>
                      <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                        Our groomer will evaluate the final price
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#DE6A07]">
                        {totalEstimation}
                      </p>
                      {discountRate > 0 && (
                        <div className="mt-1 flex items-center justify-end gap-2">
                          <span className="h-6 rounded-xl bg-[#DCFCE7] px-4 py-1 text-[10px] leading-[14px] font-comfortaa font-bold text-[#016630]">
                            {discountRate}% OFF
                          </span>
                        </div>
                      )}
                      <p className="mt-1 font-comfortaa font-bold text-[10px] leading-[14px] text-[#4A5565]">
                        tax included
                      </p>
                    </div>
                  </div>

                  {(hasMembership || hasCoupon || couponAmount !== "$0.00" || discountAmount !== "$0.00") && (
                    <>
                      <div className="border-t border-[#E5E7EB]" />

                      <div className="flex flex-col gap-3">
                        {hasMembership && membershipFee !== "$0.00" && (
                          <div className="flex items-center justify-between">
                            <p className="font-comfortaa font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                              Membership discount
                            </p>
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              -{membershipFee}
                            </p>
                          </div>
                        )}

                        {hasCoupon && couponAmount !== "$0.00" && (
                          <div className="flex items-center justify-between">
                            <p className="font-comfortaa font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                              Coupon discount
                            </p>
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              -{couponAmount}
                            </p>
                          </div>
                        )}

                        {discountAmount !== "$0.00" && (
                          <div className="flex items-center justify-between">
                            <p className="font-comfortaa font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                              Discount
                            </p>
                            <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              -{discountAmount}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {canCancel && detailCardConfig.actionKind !== "cancel" && detailCardConfig.actionKind !== "confirm" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsCancelDialogOpen(true)}
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
      </div>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border-[rgba(0,0,0,0.2)] px-0 py-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[520px]">
          <div className="flex flex-col gap-4 pb-8 pt-3">
            <AlertDialogHeader className="gap-2 px-3">
              <div className="flex items-center justify-between w-full">
                <AlertDialogPrimitive.Cancel asChild>
                  <button
                    type="button"
                    className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-[#4A3C2A] opacity-70 hover:opacity-100"
                    onClick={() => setCancelReason("")}
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
                label=""
                placeholder="Share your reason"
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                className="text-[#4A5565]"
                helperTextClassName="hidden"
                labelClassName="hidden"
              />
            </div>
            <AlertDialogFooter className="px-6">
              <div className="flex w-full items-center justify-end gap-2.5">
                <AlertDialogPrimitive.Cancel asChild>
                  <OrangeButton
                    variant="outline"
                    size="medium"
                    textSize={14}
                    className="min-w-[136px]"
                    onClick={() => setCancelReason("")}
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
                  disabled={!cancelReason.trim()}
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

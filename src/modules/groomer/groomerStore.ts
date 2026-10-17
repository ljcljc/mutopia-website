import { create } from "zustand";
import {
  type AddOnOut,
  buildImageUrl,
  cancelGroomerBooking,
  completeGroomerService,
  getGroomerBookingDetail,
  getGroomerCurrentBooking,
  getGroomerDashboardSummary,
  getGroomerPerformance,
  getGroomerPendingBookingInvitations,
  type GroomerCompleteServiceOut,
  type GroomerCheckUpCheckoutOut,
  groomerPortalCheckIn,
  startGroomerGrooming,
  startGroomerTravel,
  terminateGroomerService,
  type GroomerCancelBookingIn,
  type ReviewSummaryOut,
  type TerminateServiceIn,
} from "@/lib/api";
import type { GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";
import { mapGroomerPerformanceDashboardMetrics } from "@/modules/groomer/utils/performance";
import {
  formatGroomerTimeLabel,
  isGroomerDateTimeWithinNextHours,
  parseGroomerDateTime,
} from "@/modules/groomer/utils/time";
import DEFAULT_PET_AVATAR from "@/assets/icons/icon-pet-avatar-placeholder.svg";
import { formatPreferredTimeSlotLocal, serviceTimeZoneLabel } from "@/lib/localDateTime";
import { getBookingEstimateSummary } from "@/lib/bookingPricing";

export type DashboardAppointment = GroomerUpNextAppointment & {
  id: number | string;
  scheduledTime?: string;
  status?: string;
  weightValue?: string;
  weightUnit?: string;
  serviceId?: number;
  petType?: string;
  addonIds?: number[];
  addonQuantities?: Record<number, number>;
  currentPersonalization?: Record<string, string>;
  phone: string;
  totalEstimate: string;
  originalEstimate?: string;
  savingsLabel?: string;
  estimateBreakdown?: string;
  packageLabel: string;
  packageLines: DashboardAmountLine[];
  packageSubtotal: string;
  addonLines: DashboardAmountLine[];
  addonSubtotal: string;
  priceAdjustmentLines: DashboardAmountLine[];
  pendingCheckUp?: PendingCheckUpSummary | null;
  hasCheckUp?: boolean;
  review?: ReviewSummaryOut | null;
  reportInteractionState?: "awaiting_review" | "awaiting_reply";
  hasPublishedHealthReport?: boolean;
  healthReportPreparationStatus?: "preparing" | "failed";
  invitationId?: number;
  proposalSlots?: string[];
  proposedTimeOptions?: Array<{ date: string; slot: "am" | "pm"; time: string; datetime_local: string }>;
  businessTimezone?: string;
  invitationStatus?: string;
  expiresInLabel?: string;
};

export type DashboardAmountLine = {
  label: string;
  amount?: string;
};

export type PendingCheckUpSummary = {
  amount: string;
  displayItems: DashboardAmountLine[];
  actionLabel: string;
  direction: "charge" | "refund";
  details?: {
    items?: Array<{
      kind?: string;
      amount?: string;
      description?: string;
      details?: Record<string, unknown>;
    }>;
    proposed_final_amount?: string;
    service_id?: number;
    addons?: Array<{ id: number; quantity?: number }>;
    refund_requires_manual?: boolean;
    proposedAddonIds?: number[];
    proposedPersonalization?: Record<string, string>;
    description?: string;
    original_package_snapshot?: Record<string, unknown>;
    original_addons_snapshot?: Record<string, unknown>[];
  };
  statusLabel: string;
  summary: string;
};

export type DashboardGoal = {
  completed: number | null;
  total: number | null;
  ratingCompletedCount: number | null;
  ratingJobCount: number | null;
  completionRate: string;
  remainingAmount: string;
  goalAmount: string;
  currentAmount: string;
  isUnavailable: boolean;
};

export type DashboardMetrics = {
  partnerScore: string;
  rating: string;
};

const EMPTY_GOAL: DashboardGoal = {
  completed: 0,
  total: 0,
  ratingCompletedCount: 0,
  ratingJobCount: 0,
  completionRate: "0%",
  remainingAmount: "$0",
  goalAmount: "$0",
  currentAmount: "$0",
  isUnavailable: false,
};

const UNAVAILABLE_GOAL: DashboardGoal = {
  completed: null,
  total: null,
  ratingCompletedCount: null,
  ratingJobCount: null,
  completionRate: "-",
  remainingAmount: "-",
  goalAmount: "-",
  currentAmount: "-",
  isUnavailable: true,
};

const EMPTY_METRICS: DashboardMetrics = {
  partnerScore: "-",
  rating: "-",
};

const BOOKING_REQUEST_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;
const BOOKING_REQUEST_EXPIRY_WARNING_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;
const CHECK_UP_PERSONALIZATION_LABELS: Record<string, string> = {
  senior_pets: "Senior pets",
  hard_to_handle: "Hard to handle",
  severely_matted: "Severely matted",
  gt_50kg: "> 50kg",
  parking: "Parking",
  others: "Others",
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getString(source: Record<string, unknown>, keys: string[], fallback: string = ""): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getNumber(source: Record<string, unknown>, keys: string[], fallback: number = 0): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return fallback;
}

function getOptionalNumber(source: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function getNestedRecord(source: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }
  return {};
}

function getRecordArray(source: Record<string, unknown>, keys: string[]): Record<string, unknown>[] {
  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) return value.map(asRecord).filter((item) => Object.keys(item).length > 0);
  }
  return [];
}

function getDecisionTimeOptions(source: Record<string, unknown>): Array<{ date: string; slot: "am" | "pm"; time: string; datetime_local: string }> {
  return getRecordArray(source, ["time_options"])
    .map((option) => {
      const date = getString(option, ["date"]);
      const slot = getString(option, ["slot"]).toLowerCase();
      const time = getString(option, ["time"]);
      const datetimeLocal = getString(option, ["datetime_local"]) || (date && time ? `${date} ${time}` : "");
      if (!date || (slot !== "am" && slot !== "pm") || !time) return null;
      return { date, slot, time, datetime_local: datetimeLocal };
    })
    .filter((option): option is { date: string; slot: "am" | "pm"; time: string; datetime_local: string } => Boolean(option));
}

function unwrapAppointmentRecord(raw: unknown): Record<string, unknown> {
  const record = asRecord(raw);
  for (const key of ["booking", "current_booking", "appointment"]) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return asRecord(record[key]);
    }
  }
  return record;
}

function getAppointmentItems(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw.map(unwrapAppointmentRecord).filter((item) => Object.keys(item).length > 0);

  const record = asRecord(raw);
  for (const key of ["items", "bookings", "appointments", "up_next"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.map(unwrapAppointmentRecord).filter((item) => Object.keys(item).length > 0);
    }
  }

  const item = unwrapAppointmentRecord(raw);
  return Object.keys(item).length ? [item] : [];
}

function formatCurrency(value: number | string | undefined, fallback: string = "$0"): string {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = parseAmount(value);
  return parsed === null ? fallback : `$${parsed.toFixed(2)}`;
}

function formatAmount(value: unknown, fallback = "-"): string {
  if (value === undefined || value === null || value === "") return fallback;
  const raw = typeof value === "number" ? value.toFixed(2) : String(value);
  return raw.startsWith("$") ? raw : `$${raw}`;
}

function parseAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function formatBreakdownAmount(value: unknown, fallback = "$0.00"): string {
  const parsed = parseAmount(value);
  return parsed === null ? fallback : `$${parsed.toFixed(2)}`;
}

function formatSignedBreakdownAmount(value: unknown, fallback = "$0.00"): string {
  const parsed = parseAmount(value);
  if (parsed === null) return fallback;
  if (parsed < 0) return `-$${Math.abs(parsed).toFixed(2)}`;
  return `$${parsed.toFixed(2)}`;
}

function sumAmounts(...values: unknown[]): number {
  return values.reduce<number>((total, value) => total + (parseAmount(value) ?? 0), 0);
}

function getAmount(source: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function buildEstimateBreakdown(price: Record<string, unknown>): string | undefined {
  const serviceAmount = getAmount(price, ["pre_gst_total", "payable_amount", "final_amount"]);
  const membershipFee = getAmount(price, ["membership_fee"]);
  const membershipFeeNumber = parseAmount(membershipFee);

  if (serviceAmount === undefined) return undefined;
  if (!membershipFeeNumber || membershipFeeNumber <= 0) return `(${formatAmount(serviceAmount)})`;
  return `(${formatAmount(serviceAmount)} + ${formatAmount(membershipFee)})`;
}

function formatDiscountRate(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function buildSavingsLabel(price: Record<string, unknown>): string | undefined {
  const discountRate = parseAmount(getAmount(price, ["discount_rate"]));
  if (discountRate && discountRate > 0) {
    // discount_rate is the retained-price ratio (0.9 means 90% retained,
    // therefore 10% off), not the percentage already saved.
    const discountPercentage = discountRate < 1 ? (1 - discountRate) * 100 : discountRate;
    return `${formatDiscountRate(discountPercentage)}% OFF`;
  }

  const savingsAmount = sumAmounts(getAmount(price, ["discount_amount"]), getAmount(price, ["coupon_amount"]));
  return savingsAmount > 0 ? `${formatAmount(savingsAmount)} OFF` : undefined;
}

function mapEstimateFromPrice(price: Record<string, unknown>) {
  const estimateSummary = getBookingEstimateSummary(price);
  const serviceSubtotal = estimateSummary.originalAmount;
  const membershipFee = estimateSummary.membershipFee;
  // Booking details use final_amount as the authoritative customer total. Keep
  // the older estimate fields only as compatibility fallbacks for incomplete
  // responses from older endpoints.
  const finalAmount = estimateSummary.finalAmount;
  const explicitEstimate = parseAmount(getAmount(price, ["total_amount", "estimated_total"]));
  const serviceTotal =
    parseAmount(getAmount(price, ["payable_amount", "final_amount"])) ??
    Math.max(
      serviceSubtotal -
        sumAmounts(getAmount(price, ["discount_amount"]), getAmount(price, ["coupon_amount"])),
      0,
    );
  const totalAmount = finalAmount ?? explicitEstimate ?? serviceTotal + membershipFee;

  return {
    totalEstimate: formatAmount(totalAmount),
    originalEstimate:
      serviceSubtotal > 0 && (finalAmount === null || serviceSubtotal > finalAmount)
        ? formatAmount(serviceSubtotal)
        : undefined,
    savingsLabel:
      estimateSummary.discountPercent > 0
        ? `${formatDiscountRate(estimateSummary.discountPercent)}% OFF`
        : buildSavingsLabel(price),
    estimateBreakdown:
      estimateSummary.preGstAmount !== null
        ? `(${formatAmount(estimateSummary.preGstAmount)}${
            estimateSummary.membershipFee > 0
              ? ` + ${formatAmount(estimateSummary.membershipFee)}`
              : ""
          })`
        : buildEstimateBreakdown(price),
  };
}

function mapAmountLines(items: Record<string, unknown>[]): DashboardAmountLine[] {
  return items.reduce<DashboardAmountLine[]>((lines, item) => {
    const label = getString(item, ["name", "label", "service_name"]);
    if (!label || label.toLowerCase() === "package total") return lines;

    const rawAmount = getAmount(item, ["price", "amount", "total"]);
    const amount = parseAmount(rawAmount) === null ? undefined : formatBreakdownAmount(rawAmount);
    lines.push({ label, amount });
    return lines;
  }, []);
}

function getAddonIds(items: Record<string, unknown>[]): number[] {
  return items.reduce<number[]>((ids, item) => {
    const id = getOptionalNumber(item, ["id", "add_on_id", "addon_id"]);
    if (id === null || ids.includes(id)) return ids;
    ids.push(id);
    return ids;
  }, []);
}

function mapPackageAndAddonBreakdown(record: Record<string, unknown>) {
  const packageSnapshot = getNestedRecord(record, ["package_snapshot", "package", "service_detail", "service"]);
  const packageItems = getRecordArray(packageSnapshot, ["items", "package_items"]);
  const packageName = getString(packageSnapshot, ["service_name", "name"], getString(record, ["service_name"], "Package"));
  const packageAmount = getAmount(record, ["package_amount"]) ?? getAmount(packageSnapshot, ["price"]);
  const packageLines = mapAmountLines(packageItems);
  const addonItems = getRecordArray(record, ["addons_snapshot", "addons", "add_ons"]);
  const addonLines = mapAmountLines(addonItems);
  const membershipFee = parseAmount(getAmount(record, ["membership_fee"])) ?? 0;
  const priceAdjustmentLines: DashboardAmountLine[] = [];

  if (membershipFee > 0) {
    priceAdjustmentLines.push({ label: "Membership", amount: formatBreakdownAmount(membershipFee) });
  }

  return {
    packageLabel: `${packageName} package`,
    packageLines: packageLines.length > 0
      ? packageLines
      : [{ label: packageName, amount: formatBreakdownAmount(packageAmount) }],
    packageSubtotal: formatBreakdownAmount(packageAmount),
    addonIds: getAddonIds(addonItems),
    addonQuantities: Object.fromEntries(addonItems.map((item) => [getOptionalNumber(item, ["id", "add_on_id", "addon_id"]), getNumber(item, ["quantity"], 1)]).filter(([id]) => id !== null)) as Record<number, number>,
    addonLines,
    addonSubtotal: formatBreakdownAmount(getAmount(record, ["addons_amount"])),
    priceAdjustmentLines,
  };
}

function normalizeCheckUpPersonalization(
  personalization: Record<string, string>,
): Record<string, string> {
  return Object.entries(personalization).reduce<Record<string, string>>((next, [key, value]) => {
    const normalizedValue = typeof value === "string" ? value.trim() : String(value ?? "").trim();
    if (!normalizedValue) return next;
    next[key] = normalizedValue;
    return next;
  }, {});
}

function buildCheckUpPersonalizationLines(
  personalization: Record<string, string>,
  description: string,
): DashboardAmountLine[] {
  const note = description.trim();

  return Object.entries(normalizeCheckUpPersonalization(personalization)).reduce<DashboardAmountLine[]>((lines, [key, value]) => {
    const amount = parseAmount(value);
    if (amount === null || amount === 0) return lines;

    const baseLabel = CHECK_UP_PERSONALIZATION_LABELS[key] ?? key;
    const label = key === "others" && note ? `${baseLabel} (${note})` : baseLabel;
    lines.push({ label, amount: formatSignedBreakdownAmount(amount) });
    return lines;
  }, []);
}

function buildPendingCheckUpSummary({
  amount,
  summary,
  details,
  status,
}: {
  amount: unknown;
  summary?: string;
  details?: Record<string, unknown>;
  status?: string;
}): PendingCheckUpSummary | null {
  const parsedAmount = parseAmount(amount);
  if (parsedAmount === null || parsedAmount === 0) return null;

  const direction = parsedAmount < 0 ? "refund" : "charge";
  const displayAmount = formatBreakdownAmount(Math.abs(parsedAmount));

  return {
    amount: displayAmount,
    displayItems: Array.isArray(details?.display_items)
      ? details.display_items
          .map((item) => asRecord(item))
          .filter((item) => getString(item, ["label"]) && parseAmount(item.amount) !== null)
          .map((item) => ({
            label: getString(item, ["label"]),
            amount: formatSignedBreakdownAmount(parseAmount(item.amount) ?? 0),
          }))
      : [],
    actionLabel: direction === "refund" ? `Refund ${displayAmount}` : `Go pay ${displayAmount}`,
    direction,
    statusLabel: status === "refund_pending"
      ? details?.refund_requires_manual === true ? "Refund needs support" : "Refund processing"
      : status === "pending"
        ? "Waiting for pet owner confirmation"
        : direction === "refund" ? "Waiting for refund" : "Waiting for payment",
    summary: summary?.trim() || `Check-in adjustment ${direction === "refund" ? "refund" : "payment"} pending`,
    details: details
      ? {
          items: Array.isArray(details.items) ? details.items.filter((item): item is NonNullable<(typeof details.items)[number]> => Boolean(item)) : [],
          proposed_final_amount:
            typeof details.proposed_final_amount === "string" ? details.proposed_final_amount : undefined,
          service_id: getOptionalNumber(details, ["service_id"]) ?? undefined,
          addons: Array.isArray(details.addons)
            ? details.addons.map((item) => ({ id: getNumber(asRecord(item), ["id"], 0), quantity: getNumber(asRecord(item), ["quantity"], 1) })).filter((item) => item.id > 0)
            : undefined,
          refund_requires_manual: details.refund_requires_manual === true,
          proposedAddonIds: Array.isArray(details.addons)
            ? details.addons.map((item) => getOptionalNumber(asRecord(item), ["id"])).filter((id): id is number => id !== null)
            : undefined,
          proposedPersonalization: Array.isArray(details.manual_items)
            ? Object.fromEntries(details.manual_items.map((item) => {
                const entry = asRecord(item);
                return [getString(entry, ["key"]), getString(entry, ["amount"])];
              }).filter(([key]) => key))
            : undefined,
          description: typeof details.description === "string" ? details.description : undefined,
          original_package_snapshot: asRecord(details.original_package_snapshot),
          original_addons_snapshot: Array.isArray(details.original_addons_snapshot)
            ? details.original_addons_snapshot.map((item) => asRecord(item))
            : undefined,
        }
      : undefined,
  };
}

function buildCheckUpAddonLines(addOns: AddOnOut[], selectedAddOnIds: number[]): DashboardAmountLine[] {
  const selectedIdSet = new Set(selectedAddOnIds);
  return addOns.reduce<DashboardAmountLine[]>((lines, addOn) => {
    if (!selectedIdSet.has(addOn.id)) return lines;
    lines.push({
      label: addOn.name,
      amount: formatBreakdownAmount(addOn.price),
    });
    return lines;
  }, []);
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function isActiveDashboardAppointmentStatus(status: string): boolean {
  return [
    "traveling",
    "travel_started",
    "en_route",
    "on_the_way",
    "checked_in",
    "checkup_adjustment_pending",
    "in_progress",
    "pending_report",
    "completed",
    "reviewed",
  ].includes(normalizeStatus(status));
}

function getDashboardAppointmentPriority(record: Record<string, unknown>, now: Date): number | null {
  const status = normalizeStatus(getString(record, ["status"]));
  const scheduledTime = getString(record, ["scheduled_time_utc", "scheduled_time", "appointment_time", "time"]);
  const parsedTime = parseGroomerDateTime(scheduledTime);

  if (isActiveDashboardAppointmentStatus(status)) return 0;
  if (status !== "confirmed" || !parsedTime) return null;
  if (parsedTime.getTime() <= now.getTime()) return 1;
  if (isGroomerDateTimeWithinNextHours(scheduledTime, 24, now)) return 2;
  return null;
}

function formatTimeLabel(value: string): string {
  return formatGroomerTimeLabel(value);
}

function formatDurationLabel(source: Record<string, unknown>): string {
  const explicit = getString(source, [
    "duration",
    "duration_text",
    "estimated_duration",
    "estimated_duration_text",
  ]);
  if (explicit) return explicit.toLowerCase().includes("duration") ? explicit : `Est. duration: ${explicit}`;

  const minutes = getNumber(source, [
    "estimated_duration_minutes",
    "duration_minutes",
    "service_duration_minutes",
  ]);
  if (minutes > 0) return `Est. duration: ${minutes} minutes`;
  return "Est. duration: --";
}

function formatPreferredTimeSlotLabel(slot: Record<string, unknown>): string {
  return formatPreferredTimeSlotLocal(slot) ?? "";
}

function getPreferredTimeSlotLabels(record: Record<string, unknown>): string[] {
  const value = record.preferred_time_slots;
  if (!Array.isArray(value)) return [];
  return value
    .map((slot) => formatPreferredTimeSlotLabel(asRecord(slot)))
    .filter((slot): slot is string => Boolean(slot));
}

function getBookingRequestExpiresInLabel(createdAt: string): string | undefined {
  if (!createdAt) return undefined;
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) return undefined;

  const remainingMs = createdTime + BOOKING_REQUEST_EXPIRES_IN_MS - Date.now();
  if (remainingMs <= 0) return "Expired";
  if (remainingMs > BOOKING_REQUEST_EXPIRY_WARNING_MS) return undefined;

  const remainingHours = Math.max(1, Math.ceil(remainingMs / HOUR_IN_MS));
  return `Expire in ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`;
}

function getPetAvatarUrl(record: Record<string, unknown>, pet: Record<string, unknown> = {}): string {
  return (
    buildImageUrl(getString(record, ["pet_avatar", "avatar", "avatar_url"])) ||
    buildImageUrl(getString(pet, ["avatar", "avatar_url", "pet_avatar"])) ||
    DEFAULT_PET_AVATAR
  );
}

function mapDashboardAppointment(raw: unknown): DashboardAppointment | null {
  const record = unwrapAppointmentRecord(raw);
  if (!Object.keys(record).length) return null;

  const pet = getNestedRecord(record, ["pet", "pet_snapshot"]);
  const service = getNestedRecord(record, ["service_detail", "service", "package", "package_snapshot"]);
  const price = getNestedRecord(record, ["price", "price_snapshot"]);
  const pendingCheckUp = asRecord(record.pending_check_up);
  const scheduledTime = getString(record, ["scheduled_time_utc", "scheduled_time", "appointment_time", "time"]);
  const serviceScheduledTime = getString(record, ["service_scheduled_time", "scheduled_time", "appointment_time", "time"]);
  const estimate = mapEstimateFromPrice({ ...price, ...record });
  const packageAndAddonBreakdown = mapPackageAndAddonBreakdown({ ...price, ...record });
  const packageSnapshot = asRecord(record.package_snapshot);

  const appointmentId =
    getNumber(record, ["id", "booking_id"], Number.NaN) ||
    getString(record, ["id", "booking_id"], "");

  return {
    id: Number.isNaN(Number(appointmentId)) ? String(appointmentId || "") : Number(appointmentId),
    petName: getString(record, ["pet_name"], getString(pet, ["name"], "Pet")),
    breed: getString(record, ["breed", "pet_breed"], getString(pet, ["breed", "pet_breed"], "Breed")),
    owner: getString(record, ["user_name", "owner_name"]),
    avatarUrl: getPetAvatarUrl(record, pet),
    address: getString(record, ["service_address"]),
    phone: getString(record, ["phone", "owner_phone", "user_phone", "contact_phone"]),
    service: getString(record, ["service_name"]),
    duration: formatDurationLabel({ ...service, ...record }),
    time: [formatTimeLabel(serviceScheduledTime), serviceTimeZoneLabel(serviceScheduledTime, getString(record, ["business_timezone"]))]
      .filter(Boolean).join(" "),
    businessTimezone: getString(record, ["business_timezone"]),
    scheduledTime,
    status: getString(record, ["status"]),
    hasCheckUp: record.has_check_up === true,
    hasPublishedHealthReport: record.has_published_health_report === true,
    healthReportPreparationStatus:
      record.health_report_preparation_status === "preparing" || record.health_report_preparation_status === "failed"
        ? record.health_report_preparation_status
        : undefined,
    weightValue: getString(record, ["weight_value", "weight_kg", "weight"], getString(pet, ["weight_value", "weight_kg", "weight"])),
    weightUnit: getString(record, ["weight_unit"], getString(pet, ["weight_unit"])),
    serviceId: getOptionalNumber(record, ["service_id"]) ?? getOptionalNumber(service, ["id", "service_id"]) ?? undefined,
    petType: getString(record, ["pet_type"], getString(pet, ["pet_type"])),
    currentPersonalization: Object.fromEntries(getRecordArray(packageSnapshot, ["manual_items"]).map((item) => [getString(item, ["key"]), getAmount(item, ["amount"])]).filter(([key]) => key)),
    ...estimate,
    ...packageAndAddonBreakdown,
    pendingCheckUp: buildPendingCheckUpSummary({
      amount: getAmount(pendingCheckUp, ["amount"]),
      summary: getString(pendingCheckUp, ["summary"]),
      details: {
        ...asRecord(pendingCheckUp.details),
        proposed_final_amount: getAmount(pendingCheckUp, ["proposed_final_amount", "quoted_total_amount"]) ?? getAmount(asRecord(pendingCheckUp.details), ["quoted_total"]),
      },
      status: getString(pendingCheckUp, ["status"]),
    }),
    estimateBreakdown: getString(record, ["estimate_breakdown"]) || getString(price, ["estimate_breakdown"]) || estimate.estimateBreakdown,
    review: record.review ? (record.review as ReviewSummaryOut) : null,
  };
}

function mapNearestDashboardAppointment(raw: unknown): DashboardAppointment | null {
  const now = new Date();
  const nearestRecord = getAppointmentItems(raw)
    .filter((record) => getDashboardAppointmentPriority(record, now) !== null)
    .sort((a, b) => {
      const aTime = parseGroomerDateTime(getString(a, ["scheduled_time_utc", "scheduled_time", "appointment_time", "time"]))?.getTime();
      const bTime = parseGroomerDateTime(getString(b, ["scheduled_time_utc", "scheduled_time", "appointment_time", "time"]))?.getTime();
      const aPriority = getDashboardAppointmentPriority(a, now) ?? Number.MAX_SAFE_INTEGER;
      const bPriority = getDashboardAppointmentPriority(b, now) ?? Number.MAX_SAFE_INTEGER;
      if (aPriority !== bPriority) return aPriority - bPriority;
      if (aPriority === 1 || aPriority === 2) {
        return (aTime ?? Number.MAX_SAFE_INTEGER) - (bTime ?? Number.MAX_SAFE_INTEGER);
      }
      const aDistance = aTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(aTime - now.getTime());
      const bDistance = bTime === undefined ? Number.MAX_SAFE_INTEGER : Math.abs(bTime - now.getTime());
      if (aDistance !== bDistance) return aDistance - bDistance;
      return (aTime ?? Number.MAX_SAFE_INTEGER) - (bTime ?? Number.MAX_SAFE_INTEGER);
    })[0];

  return nearestRecord ? mapDashboardAppointment(nearestRecord) : null;
}

function mapPendingBookingRequest(raw: unknown): DashboardAppointment | null {
  const record = asRecord(raw);
  if (!Object.keys(record).length) return null;
  const pet = getNestedRecord(record, ["pet", "pet_snapshot"]);

  return {
    id: getNumber(record, ["booking_id"], Number.NaN),
    invitationId: getNumber(record, ["invitation_id"], Number.NaN),
    petName: getString(record, ["pet_name"]),
    breed: getString(record, ["pet_breed"]),
    owner: getString(record, ["owner_name"]),
    avatarUrl: getPetAvatarUrl(record, pet),
    address: getString(record, ["service_address"]),
    phone: getString(record, ["phone", "owner_phone", "user_phone", "contact_phone"]),
    service: getString(record, ["service_name"]),
    duration: formatDurationLabel(record),
    time: "",
    totalEstimate: "-",
    packageLabel: "Package",
    packageLines: [],
    packageSubtotal: "$0.00",
    addonLines: [],
    addonSubtotal: "$0.00",
    priceAdjustmentLines: [],
    proposalSlots: getPreferredTimeSlotLabels(record),
    proposedTimeOptions: getDecisionTimeOptions(record),
    businessTimezone: getString(record, ["business_timezone"]),
    invitationStatus: getString(record, ["invitation_status", "status"]),
    expiresInLabel: getBookingRequestExpiresInLabel(getString(record, ["created_at"])),
  };
}

function getPendingItems(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.map(asRecord);
  const record = asRecord(data);
  if (Array.isArray(record.items)) return record.items.map(asRecord);
  return [];
}

function mapPendingBookingRequests(data: unknown): DashboardAppointment[] {
  return getPendingItems(data)
    .map((item) => mapPendingBookingRequest(item))
    .filter((request): request is DashboardAppointment => Boolean(request));
}

function mapDashboardGoal(summary: Record<string, unknown>): DashboardGoal {
  const completed = getOptionalNumber(summary, [
    "completed_jobs",
    "today_completed_count",
    "jobs_completed",
    "completed",
    "done_jobs",
  ]);
  const total = getOptionalNumber(summary, [
    "daily_goal_jobs",
    "today_booking_count",
    "goal_jobs",
    "daily_goal_total",
    "total",
  ]);
  const goalAmountRaw = getString(summary, [
    "daily_goal_amount",
    "today_potential_gross_amount",
    "goal_amount",
    "target_amount",
  ]);
  const currentAmountRaw = getString(summary, [
    "current_amount",
    "today_current_amount",
    "earned_amount",
    "today_earnings",
  ]);
  const ratingCompletedCount = getOptionalNumber(summary, [
    "rating_completed_count",
    "completed_jobs",
    "today_completed_count",
  ]);
  const ratingJobCount = getOptionalNumber(summary, [
    "rating_job_count",
    "daily_goal_jobs",
    "today_booking_count",
  ]);
  const completionRateRaw = getString(summary, ["completion_rate"]);
  const goalAmountNumber = parseAmount(goalAmountRaw);
  const currentAmountNumber = parseAmount(currentAmountRaw);
  const completionRate = completionRateRaw
    ? `${completionRateRaw.replace(/%$/, "")}%`
    : ratingJobCount && ratingJobCount > 0 && ratingCompletedCount !== undefined && ratingCompletedCount !== null
      ? `${((ratingCompletedCount / ratingJobCount) * 100).toFixed(0)}%`
      : "0%";
  const hasRemainingAmount = goalAmountRaw && currentAmountRaw;
  const remainingAmountNumber =
    hasRemainingAmount && goalAmountNumber !== null && currentAmountNumber !== null
      ? Math.max(Number((goalAmountNumber - currentAmountNumber).toFixed(2)), 0)
      : undefined;

  return {
    completed: completed ?? 0,
    total: total ?? 0,
    ratingCompletedCount: ratingCompletedCount ?? completed ?? 0,
    ratingJobCount: ratingJobCount ?? total ?? 0,
    completionRate,
    remainingAmount: formatCurrency(remainingAmountNumber, "$0"),
    goalAmount: formatCurrency(goalAmountRaw, "$0"),
    currentAmount: formatCurrency(currentAmountRaw, "$0"),
    isUnavailable: false,
  };
}

function mapDashboardMetrics(summary: Record<string, unknown>): DashboardMetrics {
  const partnerScore = getString(summary, ["partner_score", "mutopia_partner_score", "score"], "-");

  return {
    partnerScore: partnerScore.includes("/") ? partnerScore : `${partnerScore}/100`,
    rating: getString(summary, ["rating", "average_rating"], "-"),
  };
}

function resolveDashboardSummaryState(
  summaryResult: PromiseSettledResult<unknown>,
  performanceResult: PromiseSettledResult<unknown>,
): Pick<GroomerDashboardState, "dailyGoal" | "metrics"> {
  if (summaryResult.status === "fulfilled") {
    const summary = asRecord(summaryResult.value);
    return {
      dailyGoal: mapDashboardGoal(summary),
      metrics: performanceResult.status === "fulfilled"
        ? mapGroomerPerformanceDashboardMetrics(performanceResult.value)
        : mapDashboardMetrics(summary),
    };
  }

  console.error("Failed to load groomer dashboard summary:", summaryResult.reason);
  return {
    dailyGoal: UNAVAILABLE_GOAL,
    metrics: performanceResult.status === "fulfilled"
      ? mapGroomerPerformanceDashboardMetrics(performanceResult.value)
      : EMPTY_METRICS,
  };
}

async function enrichDashboardAppointment(nextAppointment: DashboardAppointment | null): Promise<DashboardAppointment | null> {
  const bookingId = Number(nextAppointment?.id);
  if (!nextAppointment || !Number.isFinite(bookingId)) {
    return nextAppointment;
  }

  try {
    const bookingDetail = await getGroomerBookingDetail(bookingId);
    const price = getNestedRecord(asRecord(bookingDetail), ["price", "price_snapshot"]);
    const detailRecord = { ...price, ...asRecord(bookingDetail) };
    const detailAppointment = mapDashboardAppointment(bookingDetail);
    const estimate = mapEstimateFromPrice(detailRecord);
    const originalDetails = nextAppointment.pendingCheckUp?.details;
    const packageAndAddonBreakdown = mapPackageAndAddonBreakdown({
      ...detailRecord,
      package_snapshot: originalDetails?.original_package_snapshot && Object.keys(originalDetails.original_package_snapshot).length
        ? originalDetails.original_package_snapshot
        : detailRecord.package_snapshot,
      addons_snapshot: originalDetails?.original_addons_snapshot ?? detailRecord.addons_snapshot,
    });

    return {
      ...nextAppointment,
      weightValue: detailAppointment?.weightValue || nextAppointment.weightValue,
      weightUnit: detailAppointment?.weightUnit || nextAppointment.weightUnit,
      totalEstimate: estimate.totalEstimate,
      originalEstimate: estimate.originalEstimate ?? nextAppointment.originalEstimate,
      savingsLabel: estimate.savingsLabel ?? nextAppointment.savingsLabel,
      estimateBreakdown: estimate.estimateBreakdown ?? nextAppointment.estimateBreakdown,
      review: detailAppointment?.review ?? nextAppointment.review,
      ...packageAndAddonBreakdown,
    };
  } catch (error) {
    console.error("Failed to load groomer current booking detail:", error);
    return nextAppointment;
  }
}

async function resolveNextAppointmentState(
  currentBookingResult: PromiseSettledResult<unknown>,
): Promise<Pick<GroomerDashboardState, "nextAppointment" | "pendingReports" | "reportInteractions">> {
  if (currentBookingResult.status !== "fulfilled") {
    console.error("Failed to load groomer current booking:", currentBookingResult.reason);
    return { nextAppointment: null, pendingReports: [], reportInteractions: [] };
  }

  const payload = asRecord(currentBookingResult.value);
  const nextAppointment = await enrichDashboardAppointment(mapNearestDashboardAppointment(payload));
  const reportInteractions = getRecordArray(payload, ["report_interactions", "health_report_interactions"])
    .map((record) => mapDashboardAppointment(record))
    .filter((appointment): appointment is DashboardAppointment => Boolean(appointment))
    .map((appointment) => ({
      ...appointment,
      reportInteractionState: appointment.review ? "awaiting_reply" as const : "awaiting_review" as const,
    }));
  const pendingReports = getRecordArray(payload, ["pending_reports"])
    .map((record) => mapDashboardAppointment(record))
    .filter((appointment): appointment is DashboardAppointment => Boolean(appointment));
  return { nextAppointment, pendingReports, reportInteractions };
}

function resolvePendingBookingRequestState(
  pendingResult: PromiseSettledResult<unknown>,
): Pick<GroomerDashboardState, "bookingRequest" | "bookingRequests"> {
  if (pendingResult.status === "fulfilled") {
    const bookingRequests = mapPendingBookingRequests(pendingResult.value);
    return { bookingRequest: bookingRequests[0] ?? null, bookingRequests };
  }

  console.error("Failed to load groomer pending invitations:", pendingResult.reason);
  return { bookingRequest: null, bookingRequests: [] };
}

function updateMatchingNextAppointment(
  current: DashboardAppointment | null,
  bookingId: number,
  updater: (appointment: DashboardAppointment) => DashboardAppointment | null,
): DashboardAppointment | null {
  if (!current || Number(current.id) !== bookingId) {
    return current;
  }

  return updater(current);
}

interface GroomerDashboardState {
  nextAppointment: DashboardAppointment | null;
  pendingReports: DashboardAppointment[];
  reportInteractions: DashboardAppointment[];
  bookingRequest: DashboardAppointment | null;
  bookingRequests: DashboardAppointment[];
  dailyGoal: DashboardGoal;
  metrics: DashboardMetrics;
  isLoadingDashboard: boolean;
  hasLoadedDashboard: boolean;
  isStartingTravel: boolean;
  isCancelingTravel: boolean;
  isCheckingIn: boolean;
  isStartingGrooming: boolean;
  isCompletingService: boolean;
  isTerminatingService: boolean;
  fetchDashboard: () => Promise<void>;
  fetchPendingBookingRequests: () => Promise<void>;
  applyCheckUpCheckoutPreview: (payload: {
    bookingId: number;
    weightValue: string;
    weightUnit: string;
    selectedAddOnIds: number[];
    addOns: AddOnOut[];
    personalization: Record<string, string>;
    description: string;
    result: GroomerCheckUpCheckoutOut;
  }) => void;
  startTravel: (bookingId: number) => Promise<void>;
  cancelTravel: (bookingId: number, data: GroomerCancelBookingIn) => Promise<void>;
  checkIn: (bookingId: number) => Promise<void>;
  startGrooming: (bookingId: number) => Promise<void>;
  completeService: (bookingId: number) => Promise<GroomerCompleteServiceOut>;
  terminateService: (bookingId: number, data: TerminateServiceIn) => Promise<void>;
}

export const useGroomerDashboardStore = create<GroomerDashboardState>((set) => ({
  nextAppointment: null,
  pendingReports: [],
  reportInteractions: [],
  bookingRequest: null,
  bookingRequests: [],
  dailyGoal: EMPTY_GOAL,
  metrics: EMPTY_METRICS,
  isLoadingDashboard: false,
  hasLoadedDashboard: false,
  isStartingTravel: false,
  isCancelingTravel: false,
  isCheckingIn: false,
  isStartingGrooming: false,
  isCompletingService: false,
  isTerminatingService: false,

  fetchDashboard: async () => {
    set({ isLoadingDashboard: true });

    const [summaryResult, performanceResult, currentBookingResult, pendingResult] = await Promise.allSettled([
      getGroomerDashboardSummary(),
      getGroomerPerformance(),
      getGroomerCurrentBooking(),
      getGroomerPendingBookingInvitations(),
    ]);

    set(resolveDashboardSummaryState(summaryResult, performanceResult));

    if (performanceResult.status === "rejected") {
      console.error("Failed to load groomer performance for dashboard metrics:", performanceResult.reason);
    }

    set(await resolveNextAppointmentState(currentBookingResult));
    set(resolvePendingBookingRequestState(pendingResult));

    set({ isLoadingDashboard: false, hasLoadedDashboard: true });
  },

  fetchPendingBookingRequests: async () => {
    try {
      const pendingResponse = await getGroomerPendingBookingInvitations();
      set(resolvePendingBookingRequestState({ status: "fulfilled", value: pendingResponse }));
    } catch (error) {
      console.error("Failed to refresh pending booking requests:", error);
      throw error;
    }
  },

  applyCheckUpCheckoutPreview: ({
    bookingId,
    weightValue,
    weightUnit,
    selectedAddOnIds,
    addOns,
    personalization,
    description,
    result,
  }) => {
    set((state) => ({
      nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, (appointment) => {
        const personalizationLines = buildCheckUpPersonalizationLines(personalization, description);
        const addedAddonLines = buildCheckUpAddonLines(
          addOns,
          selectedAddOnIds.filter((id) => !appointment.addonIds?.includes(id)),
        );
        const displayItems = [...addedAddonLines, ...personalizationLines];
        return {
          ...appointment,
          status: result.status === "client_confirmation_required" ? "checkup_adjustment_pending" : "checked_in",
          hasCheckUp: true,
          weightValue: weightValue || appointment.weightValue,
          weightUnit,
          pendingCheckUp: buildPendingCheckUpSummary({
            amount: result.amount,
            details: {
              display_items: displayItems.map((line) => ({ label: line.label, amount: parseAmount(line.amount) ?? 0 })),
              proposed_final_amount: String(result.final_amount),
              addons: selectedAddOnIds.map((id) => ({ id })),
              manual_items: Object.entries(personalization).map(([key, amount]) => ({ key, amount })),
              description,
            },
            summary: [
              ...displayItems.map((line) => `${line.label} ${line.amount ?? ""}`.trim()),
            ].join(" + "),
          }),
        };
      }),
    }));
  },

  startTravel: async (bookingId: number) => {
    set({ isStartingTravel: true });
    try {
      await startGroomerTravel(bookingId);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, (appointment) => ({
          ...appointment,
          status: "traveling",
        })),
      }));
    } finally {
      set({ isStartingTravel: false });
    }
  },

  cancelTravel: async (bookingId: number, data: GroomerCancelBookingIn) => {
    set({ isCancelingTravel: true });
    try {
      await cancelGroomerBooking(bookingId, data);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, () => null),
      }));
    } finally {
      set({ isCancelingTravel: false });
    }
  },

  checkIn: async (bookingId: number) => {
    set({ isCheckingIn: true });
    try {
      await groomerPortalCheckIn(bookingId);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, (appointment) => ({
          ...appointment,
          status: "checked_in",
          hasCheckUp: false,
        })),
      }));
    } finally {
      set({ isCheckingIn: false });
    }
  },

  startGrooming: async (bookingId: number) => {
    set({ isStartingGrooming: true });
    try {
      await startGroomerGrooming(bookingId);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, (appointment) => ({
          ...appointment,
          status: "in_progress",
        })),
      }));
    } finally {
      set({ isStartingGrooming: false });
    }
  },

  completeService: async (bookingId: number) => {
    set({ isCompletingService: true });
    try {
      const result = await completeGroomerService(bookingId);
      const resultRecord = asRecord(result);
      const nextStatus = getString(resultRecord, ["status"], "completed");
      const totalServiceMinutes = getOptionalNumber(resultRecord, ["total_service_minutes"]);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, (appointment) => ({
          ...appointment,
          status: nextStatus,
          duration: totalServiceMinutes ? `Est. duration: ${totalServiceMinutes} minutes` : appointment.duration,
        })),
      }));
      try {
        const [summaryResult, performanceResult] = await Promise.allSettled([
          getGroomerDashboardSummary(),
          getGroomerPerformance(),
        ]);
        set(resolveDashboardSummaryState(summaryResult, performanceResult));
        if (performanceResult.status === "rejected") {
          console.error("Failed to refresh groomer performance for dashboard metrics:", performanceResult.reason);
        }
      } catch (error) {
        console.error("Failed to refresh groomer dashboard summary:", error);
      }
      return result;
    } finally {
      set({ isCompletingService: false });
    }
  },

  terminateService: async (bookingId: number, data: TerminateServiceIn) => {
    set({ isTerminatingService: true });
    try {
      await terminateGroomerService(bookingId, data);
      set((state) => ({
        nextAppointment: updateMatchingNextAppointment(state.nextAppointment, bookingId, () => null),
      }));
    } finally {
      set({ isTerminatingService: false });
    }
  },
}));

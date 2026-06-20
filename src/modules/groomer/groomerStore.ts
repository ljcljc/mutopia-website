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
import { formatPreferredTimeSlotLocal } from "@/lib/localDateTime";

export type DashboardAppointment = GroomerUpNextAppointment & {
  id: number | string;
  scheduledTime?: string;
  status?: string;
  weightValue?: string;
  weightUnit?: string;
  addonIds?: number[];
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
  review?: ReviewSummaryOut | null;
  invitationId?: number;
  proposalSlots?: string[];
  proposedTimeOptions?: Array<{ date: string; slot: "am" | "pm"; time: string; datetime_local: string }>;
  invitationStatus?: string;
  expiresInLabel?: string;
};

export type DashboardAmountLine = {
  label: string;
  amount?: string;
};

export type PendingCheckUpSummary = {
  amount: string;
  actionLabel: string;
  direction: "charge" | "refund";
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
  extra_large: "> 50kg",
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

function formatNegativeBreakdownAmount(value: unknown): string {
  const parsed = parseAmount(value) ?? 0;
  return parsed > 0 ? `-$${parsed.toFixed(2)}` : "$0.00";
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
  const serviceAmount = getAmount(price, ["payable_amount", "final_amount"]);
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
  if (discountRate && discountRate > 0) return `${formatDiscountRate(discountRate)}% OFF`;

  const savingsAmount = sumAmounts(getAmount(price, ["discount_amount"]), getAmount(price, ["coupon_amount"]));
  return savingsAmount > 0 ? `${formatAmount(savingsAmount)} OFF` : undefined;
}

function mapEstimateFromPrice(price: Record<string, unknown>) {
  const serviceSubtotal = sumAmounts(getAmount(price, ["package_amount"]), getAmount(price, ["addons_amount"]));
  const membershipFee = parseAmount(getAmount(price, ["membership_fee"])) ?? 0;
  const explicitTotal = parseAmount(getAmount(price, ["total_amount", "estimated_total"]));
  const serviceTotal =
    parseAmount(getAmount(price, ["payable_amount", "final_amount"])) ??
    Math.max(
      serviceSubtotal -
        sumAmounts(getAmount(price, ["discount_amount"]), getAmount(price, ["coupon_amount"])),
      0,
    );
  const totalAmount = explicitTotal ?? serviceTotal + membershipFee;

  return {
    totalEstimate: formatAmount(totalAmount),
    originalEstimate: serviceSubtotal > 0 ? formatAmount(serviceSubtotal) : undefined,
    savingsLabel: buildSavingsLabel(price),
    estimateBreakdown: buildEstimateBreakdown(price),
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
  const discountAmount = parseAmount(getAmount(record, ["discount_amount"])) ?? 0;
  const couponAmount = parseAmount(getAmount(record, ["coupon_amount"])) ?? 0;
  const priceAdjustmentLines: DashboardAmountLine[] = [];

  if (membershipFee > 0) {
    priceAdjustmentLines.push({ label: "Membership", amount: formatBreakdownAmount(membershipFee) });
  }
  if (discountAmount > 0) {
    priceAdjustmentLines.push({ label: "Discount", amount: formatNegativeBreakdownAmount(discountAmount) });
  }
  if (couponAmount > 0) {
    priceAdjustmentLines.push({ label: "Coupon", amount: formatNegativeBreakdownAmount(couponAmount) });
  }

  return {
    packageLabel: `${packageName} package`,
    packageLines: packageLines.length > 0
      ? packageLines
      : [{ label: packageName, amount: formatBreakdownAmount(packageAmount) }],
    packageSubtotal: formatBreakdownAmount(packageAmount),
    addonIds: getAddonIds(addonItems),
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
    const normalizedKey = key === "extra_large" ? "gt_50kg" : key;
    next[normalizedKey] = normalizedValue;
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
}: {
  amount: unknown;
  summary?: string;
}): PendingCheckUpSummary | null {
  const parsedAmount = parseAmount(amount);
  if (parsedAmount === null || parsedAmount === 0) return null;

  const direction = parsedAmount < 0 ? "refund" : "charge";
  const displayAmount = formatBreakdownAmount(Math.abs(parsedAmount));

  return {
    amount: displayAmount,
    actionLabel: direction === "refund" ? `Refund ${displayAmount}` : `Go pay ${displayAmount}`,
    direction,
    statusLabel: direction === "refund" ? "Waiting for refund" : "Waiting for payment",
    summary: summary?.trim() || `Check-in adjustment ${direction === "refund" ? "refund" : "payment"} pending`,
  };
}

function getBasePriceAdjustmentLines(lines: DashboardAmountLine[]): DashboardAmountLine[] {
  const staticLabels = new Set(["membership", "discount", "coupon"]);
  return lines.filter((line) => staticLabels.has(line.label.trim().toLowerCase()));
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
    "in_progress",
    "completed",
    "awaiting_final_payment",
    "reviewed",
  ].includes(normalizeStatus(status));
}

function getDashboardAppointmentPriority(record: Record<string, unknown>, now: Date): number | null {
  const status = normalizeStatus(getString(record, ["status"]));
  const scheduledTime = getString(record, ["scheduled_time", "appointment_time", "time"]);
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

function mapDashboardAppointment(raw: unknown): DashboardAppointment | null {
  const record = unwrapAppointmentRecord(raw);
  if (!Object.keys(record).length) return null;

  const pet = getNestedRecord(record, ["pet", "pet_snapshot"]);
  const service = getNestedRecord(record, ["service_detail", "service", "package", "package_snapshot"]);
  const price = getNestedRecord(record, ["price", "price_snapshot"]);
  const pendingCheckUp = asRecord(record.pending_check_up);
  const scheduledTime = getString(record, ["scheduled_time", "appointment_time", "time"]);
  const estimate = mapEstimateFromPrice({ ...price, ...record });
  const packageAndAddonBreakdown = mapPackageAndAddonBreakdown({ ...price, ...record });

  const appointmentId =
    getNumber(record, ["id", "booking_id"], Number.NaN) ||
    getString(record, ["id", "booking_id"], "");

  return {
    id: Number.isNaN(Number(appointmentId)) ? String(appointmentId || "") : Number(appointmentId),
    petName: getString(record, ["pet_name"], getString(pet, ["name"], "Pet")),
    breed: getString(record, ["breed", "pet_breed"], getString(pet, ["breed", "pet_breed"], "Breed")),
    owner: getString(record, ["user_name", "owner_name"]),
    avatarUrl: buildImageUrl(getString(record, ["pet_avatar"])),
    address: getString(record, ["service_address"]),
    phone: getString(record, ["phone", "owner_phone", "user_phone", "contact_phone"]),
    service: getString(record, ["service_name"]),
    duration: formatDurationLabel({ ...service, ...record }),
    time: formatTimeLabel(scheduledTime),
    scheduledTime,
    status: getString(record, ["status"]),
    weightValue: getString(record, ["weight_value", "weight_kg", "weight"], getString(pet, ["weight_value", "weight_kg", "weight"])),
    weightUnit: getString(record, ["weight_unit"], getString(pet, ["weight_unit"])),
    ...estimate,
    ...packageAndAddonBreakdown,
    pendingCheckUp: buildPendingCheckUpSummary({
      amount: getAmount(pendingCheckUp, ["amount"]),
      summary: getString(pendingCheckUp, ["summary"]),
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
      const aTime = parseGroomerDateTime(getString(a, ["scheduled_time", "appointment_time", "time"]))?.getTime();
      const bTime = parseGroomerDateTime(getString(b, ["scheduled_time", "appointment_time", "time"]))?.getTime();
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

  return {
    id: getNumber(record, ["booking_id"], Number.NaN),
    invitationId: getNumber(record, ["invitation_id"], Number.NaN),
    petName: getString(record, ["pet_name"]),
    breed: getString(record, ["pet_breed"]),
    owner: getString(record, ["owner_name"]),
    avatarUrl: buildImageUrl(getString(record, ["pet_avatar"])),
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
    const packageAndAddonBreakdown = mapPackageAndAddonBreakdown(detailRecord);

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
): Promise<Pick<GroomerDashboardState, "nextAppointment">> {
  if (currentBookingResult.status !== "fulfilled") {
    console.error("Failed to load groomer current booking:", currentBookingResult.reason);
    return { nextAppointment: null };
  }

  const nextAppointment = await enrichDashboardAppointment(mapNearestDashboardAppointment(currentBookingResult.value));
  return { nextAppointment };
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
        const addonLines = buildCheckUpAddonLines(addOns, selectedAddOnIds);
        const addonSubtotalAmount = addonLines.reduce<number>((total, line) => total + (parseAmount(line.amount) ?? 0), 0);
        const personalizationLines = buildCheckUpPersonalizationLines(personalization, description);
        const totalEstimateAmount =
          parseAmount(result.final_amount) ??
          sumAmounts(parseAmount(appointment.totalEstimate) ?? 0, result.amount);

        return {
          ...appointment,
          weightValue,
          weightUnit,
          totalEstimate: formatBreakdownAmount(totalEstimateAmount),
          addonIds: selectedAddOnIds,
          addonLines,
          addonSubtotal: formatBreakdownAmount(addonSubtotalAmount),
          pendingCheckUp: buildPendingCheckUpSummary({
            amount: result.amount,
            summary: [
              ...addonLines.map((line) => `${line.label} ${line.amount ?? ""}`.trim()),
              ...personalizationLines.map((line) => `${line.label} ${line.amount ?? ""}`.trim()),
            ].join(" + "),
          }),
          priceAdjustmentLines: [
            ...getBasePriceAdjustmentLines(appointment.priceAdjustmentLines),
            ...personalizationLines,
          ],
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

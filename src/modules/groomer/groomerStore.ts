import { create } from "zustand";
import {
  buildImageUrl,
  cancelGroomerBooking,
  completeGroomerService,
  getGroomerBookingDetail,
  getGroomerCurrentBooking,
  getGroomerDashboardSummary,
  getGroomerPendingBookingInvitations,
  groomerPortalCheckIn,
  startGroomerGrooming,
  startGroomerTravel,
  terminateGroomerService,
  type GroomerCancelBookingIn,
  type TerminateServiceIn,
} from "@/lib/api";
import type { GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";
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

export type DashboardGoal = {
  completed: number | null;
  total: number | null;
  remainingAmount: string;
  goalAmount: string;
  currentAmount: string;
};

export type DashboardMetrics = {
  partnerScore: string;
  rating: string;
};

const EMPTY_GOAL: DashboardGoal = {
  completed: 0,
  total: 0,
  remainingAmount: "$0",
  goalAmount: "$0",
  currentAmount: "$0",
};

const EMPTY_METRICS: DashboardMetrics = {
  partnerScore: "-",
  rating: "-",
};

const BOOKING_REQUEST_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;
const BOOKING_REQUEST_EXPIRY_WARNING_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

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
  if (typeof value === "number") return `$${value}`;
  return value.startsWith("$") ? value : `$${value}`;
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

function mapPackageAndAddonBreakdown(record: Record<string, unknown>) {
  const packageSnapshot = getNestedRecord(record, ["package_snapshot", "package", "service_detail", "service"]);
  const packageItems = getRecordArray(packageSnapshot, ["items", "package_items"]);
  const packageName = getString(packageSnapshot, ["service_name", "name"], getString(record, ["service_name"], "Package"));
  const packageAmount = getAmount(record, ["package_amount"]) ?? getAmount(packageSnapshot, ["price"]);
  const packageLines = mapAmountLines(packageItems);
  const addonLines = mapAmountLines(getRecordArray(record, ["addons_snapshot", "addons", "add_ons"]));
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
    addonLines,
    addonSubtotal: formatBreakdownAmount(getAmount(record, ["addons_amount"])),
    priceAdjustmentLines,
  };
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function isActiveDashboardAppointmentStatus(status: string): boolean {
  return ["traveling", "travel_started", "en_route", "on_the_way", "checked_in", "in_progress"].includes(
    normalizeStatus(status),
  );
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
    ...estimate,
    ...packageAndAddonBreakdown,
    estimateBreakdown: getString(record, ["estimate_breakdown"]) || getString(price, ["estimate_breakdown"]) || estimate.estimateBreakdown,
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
  const completed = getOptionalNumber(summary, ["completed_jobs", "jobs_completed", "completed", "done_jobs"]);
  const total = getOptionalNumber(summary, ["daily_goal_jobs", "goal_jobs", "daily_goal_total", "total"]);
  const goalAmountRaw = getString(summary, ["daily_goal_amount", "goal_amount", "target_amount"]);
  const currentAmountRaw = getString(summary, ["current_amount", "earned_amount", "today_earnings"]);
  const goalAmountNumber = Number(goalAmountRaw.replace(/[^0-9.-]/g, ""));
  const currentAmountNumber = Number(currentAmountRaw.replace(/[^0-9.-]/g, ""));
  const hasRemainingAmount = goalAmountRaw && currentAmountRaw;
  const remainingAmountNumber =
    hasRemainingAmount && Number.isFinite(goalAmountNumber) && Number.isFinite(currentAmountNumber)
      ? Math.max(goalAmountNumber - currentAmountNumber, 0)
      : undefined;

  return {
    completed: completed ?? 0,
    total: total ?? 0,
    remainingAmount: formatCurrency(remainingAmountNumber, "$0"),
    goalAmount: formatCurrency(goalAmountRaw, "$0"),
    currentAmount: formatCurrency(currentAmountRaw, "$0"),
  };
}

function mapDashboardMetrics(summary: Record<string, unknown>): DashboardMetrics {
  const partnerScore = getString(summary, ["partner_score", "mutopia_partner_score", "score"], "-");

  return {
    partnerScore: partnerScore.includes("/") ? partnerScore : `${partnerScore}/100`,
    rating: getString(summary, ["rating", "average_rating"], "-"),
  };
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
  startTravel: (bookingId: number) => Promise<void>;
  cancelTravel: (bookingId: number, data: GroomerCancelBookingIn) => Promise<void>;
  checkIn: (bookingId: number) => Promise<void>;
  startGrooming: (bookingId: number) => Promise<void>;
  completeService: (bookingId: number) => Promise<void>;
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

    const [summaryResult, currentBookingResult, pendingResult] = await Promise.allSettled([
      getGroomerDashboardSummary(),
      getGroomerCurrentBooking(),
      getGroomerPendingBookingInvitations(),
    ]);

    if (summaryResult.status === "fulfilled") {
      const summary = asRecord(summaryResult.value);
      set({
        dailyGoal: mapDashboardGoal(summary),
        metrics: mapDashboardMetrics(summary),
      });
    } else {
      console.error("Failed to load groomer dashboard summary:", summaryResult.reason);
      set({
        dailyGoal: EMPTY_GOAL,
        metrics: EMPTY_METRICS,
      });
    }

    if (currentBookingResult.status === "fulfilled") {
      let nextAppointment = mapNearestDashboardAppointment(currentBookingResult.value);
      const bookingId = Number(nextAppointment?.id);

      if (nextAppointment && Number.isFinite(bookingId)) {
        try {
          const bookingDetail = await getGroomerBookingDetail(bookingId);
          const price = getNestedRecord(asRecord(bookingDetail), ["price", "price_snapshot"]);
          const detailRecord = { ...price, ...asRecord(bookingDetail) };
          const estimate = mapEstimateFromPrice(detailRecord);
          const packageAndAddonBreakdown = mapPackageAndAddonBreakdown(detailRecord);
          nextAppointment = {
            ...nextAppointment,
            totalEstimate: estimate.totalEstimate,
            originalEstimate: estimate.originalEstimate ?? nextAppointment.originalEstimate,
            savingsLabel: estimate.savingsLabel ?? nextAppointment.savingsLabel,
            estimateBreakdown: estimate.estimateBreakdown ?? nextAppointment.estimateBreakdown,
            ...packageAndAddonBreakdown,
          };
        } catch (error) {
          console.error("Failed to load groomer current booking detail:", error);
        }
      }

      set({ nextAppointment });
    } else {
      console.error("Failed to load groomer current booking:", currentBookingResult.reason);
      set({ nextAppointment: null });
    }

    if (pendingResult.status === "fulfilled") {
      const bookingRequests = mapPendingBookingRequests(pendingResult.value);
      set({ bookingRequest: bookingRequests[0] ?? null, bookingRequests });
    } else {
      console.error("Failed to load groomer pending invitations:", pendingResult.reason);
      set({ bookingRequest: null, bookingRequests: [] });
    }

    set({ isLoadingDashboard: false, hasLoadedDashboard: true });
  },

  fetchPendingBookingRequests: async () => {
    const pendingResult = await getGroomerPendingBookingInvitations();
    const bookingRequests = mapPendingBookingRequests(pendingResult);
    set({ bookingRequest: bookingRequests[0] ?? null, bookingRequests });
  },

  startTravel: async (bookingId: number) => {
    set({ isStartingTravel: true });
    try {
      await startGroomerTravel(bookingId);
      set((state) => ({
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? { ...state.nextAppointment, status: "traveling" }
          : state.nextAppointment,
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
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? null
          : state.nextAppointment,
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
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? { ...state.nextAppointment, status: "checked_in" }
          : state.nextAppointment,
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
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? { ...state.nextAppointment, status: "in_progress" }
          : state.nextAppointment,
      }));
    } finally {
      set({ isStartingGrooming: false });
    }
  },

  completeService: async (bookingId: number) => {
    set({ isCompletingService: true });
    try {
      await completeGroomerService(bookingId);
      set((state) => ({
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? null
          : state.nextAppointment,
      }));
    } finally {
      set({ isCompletingService: false });
    }
  },

  terminateService: async (bookingId: number, data: TerminateServiceIn) => {
    set({ isTerminatingService: true });
    try {
      await terminateGroomerService(bookingId, data);
      set((state) => ({
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? null
          : state.nextAppointment,
      }));
    } finally {
      set({ isTerminatingService: false });
    }
  },
}));

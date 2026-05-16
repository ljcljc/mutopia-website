import { create } from "zustand";
import {
  buildImageUrl,
  cancelGroomerTravel,
  getGroomerCurrentBooking,
  getGroomerDashboardSummary,
  getGroomerPendingBookingInvitations,
  groomerPortalCheckIn,
  startGroomerTravel,
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
  invitationId?: number;
  proposalSlots?: string[];
  expiresInLabel?: string;
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

function getAmount(source: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function isTravelActionStatus(status: string): boolean {
  return ["traveling", "travel_started", "en_route", "on_the_way", "checked_in"].includes(normalizeStatus(status));
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
  const totalAmount = getAmount(record, ["final_amount", "payable_amount", "total_amount", "estimated_total"]) ??
    getAmount(price, ["final_amount", "payable_amount", "total_amount", "estimated_total"]);
  const originalAmount = getAmount(record, ["original_amount", "original_total", "subtotal_amount"]) ??
    getAmount(price, ["original_amount", "original_total", "subtotal_amount"]);
  const discountAmount = getAmount(record, ["discount_amount", "coupon_amount", "savings_amount"]) ??
    getAmount(price, ["discount_amount", "coupon_amount", "savings_amount"]);

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
    totalEstimate: formatAmount(totalAmount),
    originalEstimate: originalAmount ? formatAmount(originalAmount) : undefined,
    savingsLabel: discountAmount ? `${formatAmount(discountAmount)} OFF` : undefined,
    estimateBreakdown: getString(record, ["estimate_breakdown"]) || getString(price, ["estimate_breakdown"]),
  };
}

function mapNearestDashboardAppointment(raw: unknown): DashboardAppointment | null {
  const now = new Date();
  const nearestRecord = getAppointmentItems(raw)
    .filter((record) => {
      const status = getString(record, ["status"]);
      const scheduledTime = getString(record, ["scheduled_time", "appointment_time", "time"]);
      return isTravelActionStatus(status) || isGroomerDateTimeWithinNextHours(scheduledTime, 24, now);
    })
    .sort((a, b) => {
      const aTime = parseGroomerDateTime(getString(a, ["scheduled_time", "appointment_time", "time"]))?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = parseGroomerDateTime(getString(b, ["scheduled_time", "appointment_time", "time"]))?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
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
    proposalSlots: getPreferredTimeSlotLabels(record),
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
  fetchDashboard: () => Promise<void>;
  fetchPendingBookingRequests: () => Promise<void>;
  startTravel: (bookingId: number) => Promise<void>;
  cancelTravel: (bookingId: number) => Promise<void>;
  checkIn: (bookingId: number) => Promise<void>;
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
      set({ nextAppointment: mapNearestDashboardAppointment(currentBookingResult.value) });
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

  cancelTravel: async (bookingId: number) => {
    set({ isCancelingTravel: true });
    try {
      await cancelGroomerTravel(bookingId);
      set((state) => ({
        nextAppointment: state.nextAppointment && Number(state.nextAppointment.id) === bookingId
          ? { ...state.nextAppointment, status: "confirmed" }
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
}));

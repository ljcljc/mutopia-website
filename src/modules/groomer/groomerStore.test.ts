import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  buildImageUrl: vi.fn((value: string) => value),
  cancelGroomerTravel: vi.fn(),
  completeGroomerService: vi.fn(),
  getGroomerBookingDetail: vi.fn(),
  getGroomerCurrentBooking: vi.fn(),
  getGroomerDashboardSummary: vi.fn(),
  getGroomerPerformance: vi.fn(),
  getGroomerPendingBookingInvitations: vi.fn(),
  groomerPortalCheckIn: vi.fn(),
  startGroomerGrooming: vi.fn(),
  startGroomerTravel: vi.fn(),
  terminateGroomerService: vi.fn(),
}));

vi.mock("@/lib/api", () => apiMocks);

import { useGroomerDashboardStore } from "./groomerStore";

describe("groomer dashboard current booking selection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 16, 12, 0, 0));
    vi.clearAllMocks();
    useGroomerDashboardStore.setState({
      nextAppointment: null,
      bookingRequest: null,
      bookingRequests: [],
      dailyGoal: {
        completed: 0,
        total: 0,
        ratingCompletedCount: 0,
        ratingJobCount: 0,
        completionRate: "0%",
        remainingAmount: "$0",
        goalAmount: "$0",
        currentAmount: "$0",
        isUnavailable: false,
      },
      metrics: {
        partnerScore: "-",
        rating: "-",
      },
      isLoadingDashboard: false,
      hasLoadedDashboard: false,
      isStartingTravel: false,
      isCancelingTravel: false,
      isCheckingIn: false,
      isStartingGrooming: false,
      isCompletingService: false,
      isTerminatingService: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps a booking awaiting check-up adjustment in the Hero", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
    apiMocks.getGroomerPerformance.mockResolvedValue({});
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({});
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({
      booking: {
        id: 94,
        status: "checkup_adjustment_pending",
        scheduled_time_utc: "2026-05-16T12:00:00Z",
        pet_name: "Mochi",
      },
    });

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      id: 94,
      status: "checkup_adjustment_pending",
    });
  });

  it("keeps an overdue confirmed booking ahead of a closer upcoming confirmed booking", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "88.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {
        customer_rating: "18.00",
      },
      recent_feedback: [],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({});
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({
      items: [
        {
          id: 2,
          status: "confirmed",
          scheduled_time: "2026-05-16 12:05",
          pet_name: "Upcoming",
          service_name: "Bath",
        },
        {
          id: 1,
          status: "confirmed",
          scheduled_time: "2026-05-16 11:50",
          pet_name: "Overdue",
          service_name: "Grooming",
        },
      ],
    });

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      id: 1,
      petName: "Overdue",
      status: "confirmed",
      scheduledTime: "2026-05-16 11:50",
    });
  });

  it("uses performance data as the dashboard metrics source of truth", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({
      partner_score: "73/100",
      rating: "3.2",
    });
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "92.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {
        customer_rating: "18.40",
      },
      recent_feedback: [],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({});
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({});

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().metrics).toEqual({
      partnerScore: "92/100",
      rating: "4.6",
    });
  });

  it("keeps addon ids from booking detail for check-up form prefill", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "88.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {
        customer_rating: "18.00",
      },
      recent_feedback: [],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({
      id: 123,
      status: "checked_in",
      pet_name: "Momo",
      service_name: "Bath",
    });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({
      id: 123,
      status: "checked_in",
      package_amount: "95.00",
      addons_amount: "12.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "107.00",
      deposit_amount: "20.00",
      final_amount: "107.00",
      addons_snapshot: [
        { id: 7, name: "Teeth brushing", price: "12.00" },
      ],
    });

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      id: 123,
      addonIds: [7],
    });
  });

  it("keeps original order lines above a pending check-up adjustment", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
    apiMocks.getGroomerPerformance.mockResolvedValue({});
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({
      id: 94,
      status: "checkup_adjustment_pending",
      pending_check_up: {
        amount: "18.90",
        quoted_total_amount: "118.90",
        details: {
          quoted_total: "118.90",
          display_items: [{ label: "New add-on", amount: "18.00" }],
          addons: [{ id: 1 }, { id: 2 }],
          manual_items: [{ key: "parking", amount: "5.00" }],
          original_package_snapshot: { service_name: "Original service" },
          original_addons_snapshot: [{ id: 1, name: "Original add-on", price: "10.00" }],
        },
      },
    });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({
      id: 94,
      status: "checkup_adjustment_pending",
      package_amount: "90.00",
      addons_amount: "10.00",
      final_amount: "100.00",
      payable_amount: "100.00",
      package_snapshot: { service_name: "Proposed service" },
      addons_snapshot: [{ id: 1, name: "Original add-on", price: "10.00" }, { id: 2, name: "New add-on", price: "18.00" }],
    });

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      totalEstimate: "$100.00",
      packageLabel: "Original service package",
      addonIds: [1],
      addonLines: [{ label: "Original add-on", amount: "$10.00" }],
      pendingCheckUp: {
        displayItems: [{ label: "New add-on", amount: "$18.00" }],
        details: { proposed_final_amount: "118.90", proposedAddonIds: [1, 2], proposedPersonalization: { parking: "5.00" } },
      },
    });
  });

  it("uses final amount when estimate fields disagree with booking details", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "88.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: { customer_rating: "18.00" },
      recent_feedback: [],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({
      id: 456,
      status: "confirmed",
      scheduled_time: "2026-05-16 12:05",
      pet_name: "Momo",
      service_name: "Bath",
      total_amount: "80.96",
      package_amount: "45.96",
      addons_amount: "0.00",
      mobile_van_service_amount: "20.00",
      safety_insurance_amount: "15.00",
      discount_rate: "0.90",
    });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({
      id: 456,
      status: "confirmed",
      package_amount: "45.96",
      addons_amount: "0.00",
      total_amount: "80.96",
      final_amount: "71.25",
      payable_amount: "71.25",
      pre_gst_total: "67.86",
      mobile_van_service_amount: "20.00",
      safety_insurance_amount: "15.00",
      membership_fee: "5.00",
    });

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      id: 456,
      totalEstimate: "$71.25",
      originalEstimate: "$80.96",
      savingsLabel: "10% OFF",
      estimateBreakdown: "($67.86 + $5.00)",
    });
  });

  it("falls back to performance metrics when dashboard summary fails", async () => {
    apiMocks.getGroomerDashboardSummary.mockRejectedValue(new Error("summary failed"));
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "81.20",
      level: "level_b",
      level_label: "Silver Groomer",
      service_fee_rate: "0.20",
      breakdown: {
        customer_rating: "16.00",
      },
      recent_feedback: [],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({ items: [] });
    apiMocks.getGroomerBookingDetail.mockResolvedValue({});
    apiMocks.getGroomerCurrentBooking.mockResolvedValue({});

    await useGroomerDashboardStore.getState().fetchDashboard();

    expect(useGroomerDashboardStore.getState().dailyGoal).toEqual({
      completed: null,
      total: null,
      ratingCompletedCount: null,
      ratingJobCount: null,
      completionRate: "-",
      remainingAmount: "-",
      goalAmount: "-",
      currentAmount: "-",
      isUnavailable: true,
    });
    expect(useGroomerDashboardStore.getState().metrics).toEqual({
      partnerScore: "81/100",
      rating: "4",
    });
  });

  it("reuses dashboard summary resolution when complete service refreshes metrics", async () => {
    useGroomerDashboardStore.setState({
      nextAppointment: {
        id: 123,
        petName: "Momo",
        breed: "Poodle",
        owner: "Emma",
        avatarUrl: "",
        service: "Full grooming",
        time: "12:00 PM",
        address: "1 Main St",
        phone: "1234567890",
        duration: "Est. duration: 30 minutes",
        totalEstimate: "$95.00",
        packageLabel: "Package",
        packageLines: [],
        packageSubtotal: "$95.00",
        addonLines: [],
        addonSubtotal: "$0.00",
        priceAdjustmentLines: [],
      },
    });
    apiMocks.completeGroomerService.mockResolvedValue({
      status: "completed",
      total_service_minutes: 45,
    });
    apiMocks.getGroomerDashboardSummary.mockRejectedValue(new Error("summary failed"));
    apiMocks.getGroomerPerformance.mockResolvedValue({
      score: "90.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {
        customer_rating: "17.60",
      },
      recent_feedback: [],
    });

    await useGroomerDashboardStore.getState().completeService(123);

    expect(useGroomerDashboardStore.getState().nextAppointment).toMatchObject({
      id: 123,
      status: "completed",
      duration: "Est. duration: 45 minutes",
    });
    expect(useGroomerDashboardStore.getState().dailyGoal).toEqual({
      completed: null,
      total: null,
      ratingCompletedCount: null,
      ratingJobCount: null,
      completionRate: "-",
      remainingAmount: "-",
      goalAmount: "-",
      currentAmount: "-",
      isUnavailable: true,
    });
    expect(useGroomerDashboardStore.getState().metrics).toEqual({
      partnerScore: "90/100",
      rating: "4.4",
    });
  });

  it("reuses pending booking request resolution for standalone refresh", async () => {
    apiMocks.getGroomerPendingBookingInvitations.mockResolvedValue({
      items: [
        {
          booking_id: 55,
          status: "pending",
          pet_name: "Coco",
          pet_breed: "Bichon",
          service_name: "Bath",
        },
      ],
    });

    await useGroomerDashboardStore.getState().fetchPendingBookingRequests();

    expect(useGroomerDashboardStore.getState().bookingRequest).toMatchObject({
      id: 55,
      petName: "Coco",
    });
    expect(useGroomerDashboardStore.getState().bookingRequest?.avatarUrl).toContain("data:image/svg+xml");
    expect(useGroomerDashboardStore.getState().bookingRequests).toHaveLength(1);
  });

  it("preserves pending booking requests and rejects when standalone refresh fails", async () => {
    useGroomerDashboardStore.setState({
      bookingRequest: {
        id: 55,
        petName: "Coco",
        breed: "Bichon",
        owner: "Emma",
        avatarUrl: "",
        service: "Bath",
        time: "2:00 PM",
        duration: "Est. duration: 30 minutes",
        address: "1 Main St",
        phone: "1234567890",
        totalEstimate: "$50.00",
        packageLabel: "Package",
        packageLines: [],
        packageSubtotal: "$50.00",
        addonLines: [],
        addonSubtotal: "$0.00",
        priceAdjustmentLines: [],
      },
      bookingRequests: [
        {
          id: 55,
          petName: "Coco",
          breed: "Bichon",
          owner: "Emma",
          avatarUrl: "",
          service: "Bath",
          time: "2:00 PM",
          duration: "Est. duration: 30 minutes",
          address: "1 Main St",
          phone: "1234567890",
          totalEstimate: "$50.00",
          packageLabel: "Package",
          packageLines: [],
          packageSubtotal: "$50.00",
          addonLines: [],
          addonSubtotal: "$0.00",
          priceAdjustmentLines: [],
        },
      ],
    });
    apiMocks.getGroomerPendingBookingInvitations.mockRejectedValue(new Error("pending failed"));

    await expect(useGroomerDashboardStore.getState().fetchPendingBookingRequests()).rejects.toThrow("pending failed");

    expect(useGroomerDashboardStore.getState().bookingRequest).toMatchObject({
      id: 55,
      petName: "Coco",
    });
    expect(useGroomerDashboardStore.getState().bookingRequests).toHaveLength(1);
  });
});

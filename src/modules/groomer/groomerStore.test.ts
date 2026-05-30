import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const apiMocks = vi.hoisted(() => ({
  buildImageUrl: vi.fn((value: string) => value),
  cancelGroomerTravel: vi.fn(),
  completeGroomerService: vi.fn(),
  getGroomerBookingDetail: vi.fn(),
  getGroomerCurrentBooking: vi.fn(),
  getGroomerDashboardSummary: vi.fn(),
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

  it("keeps an overdue confirmed booking ahead of a closer upcoming confirmed booking", async () => {
    apiMocks.getGroomerDashboardSummary.mockResolvedValue({});
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
});

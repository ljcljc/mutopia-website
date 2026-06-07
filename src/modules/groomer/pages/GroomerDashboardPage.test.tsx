import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerDashboardPage from "./GroomerDashboardPage";
import {
  type BookingDetailOut,
  completeGroomerService,
  getAddOns,
  getGroomerBookingDetail,
  getGroomerCurrentBooking,
  getGroomerDashboardSummary,
  getGroomerPerformance,
  getGroomerPendingBookingInvitations,
  submitGroomerCheckUpCheckout,
  submitGroomerHealthReport,
} from "@/lib/api";
import { useGroomerDashboardStore } from "@/modules/groomer/groomerStore";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    buildImageUrl: vi.fn((value: string) => value),
    completeGroomerService: vi.fn(),
    getAddOns: vi.fn(),
    getGroomerBookingDetail: vi.fn(),
    getGroomerCurrentBooking: vi.fn(),
    getGroomerDashboardSummary: vi.fn(),
    getGroomerPerformance: vi.fn(),
    getGroomerPendingBookingInvitations: vi.fn(),
    submitGroomerCheckUpCheckout: vi.fn(),
    submitGroomerHealthReport: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("GroomerDashboardPage complete service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: "92.00",
      level: "level_a",
      level_label: "Gold Groomer",
      service_fee_rate: "0.15",
      breakdown: {
        customer_rating: "18.40",
      },
      recent_feedback: [],
    });
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

  it("calls complete service and updates the dashboard card when the button is clicked", async () => {
    vi.mocked(getGroomerDashboardSummary)
      .mockResolvedValueOnce({
        daily_goal_jobs: 5,
        completed_jobs: 2,
        rating_job_count: 4,
        rating_completed_count: 2,
        completion_rate: "50.00",
        daily_goal_amount: "200.00",
        current_amount: "80.00",
      })
      .mockResolvedValueOnce({
        daily_goal_jobs: 5,
        completed_jobs: 3,
        rating_job_count: 4,
        rating_completed_count: 3,
        completion_rate: "75.00",
        daily_goal_amount: "200.00",
        current_amount: "145.00",
      });
    vi.mocked(getGroomerPendingBookingInvitations).mockResolvedValue([]);
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
      id: 123,
      status: "in_progress",
      package_amount: "95.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "95.00",
      deposit_amount: "20.00",
      final_amount: "95.00",
    } as BookingDetailOut);
    vi.mocked(getGroomerCurrentBooking).mockResolvedValue({
      id: 123,
      status: "in_progress",
      pet_name: "Momo",
      pet_breed: "Poodle",
      service_name: "Full grooming",
    });
    vi.mocked(completeGroomerService).mockResolvedValue({
      ok: true,
      status: "completed",
      total_service_minutes: 45,
    });

    render(
      <MemoryRouter>
        <GroomerDashboardPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("92/100")).toBeInTheDocument();
    expect(screen.getByText("4.6")).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: /complete service/i }));

    await waitFor(() => {
      expect(completeGroomerService).toHaveBeenCalledWith(123);
    });
    expect(await screen.findByText("3 of 5 jobs completed")).toBeInTheDocument();
    expect(screen.getByText("Goal: $200.00 • Current: $145.00")).toBeInTheDocument();
    expect(await screen.findByText("Completed. Waiting for client confirmation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fill report for Momo" })).toBeInTheDocument();
  });

  it("opens and submits the health report form from a completed booking", async () => {
    vi.mocked(getGroomerDashboardSummary).mockResolvedValue({});
    vi.mocked(getGroomerPendingBookingInvitations).mockResolvedValue([]);
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
      id: 123,
      status: "completed",
      package_amount: "95.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "95.00",
      deposit_amount: "20.00",
      final_amount: "95.00",
    } as BookingDetailOut);
    vi.mocked(getGroomerCurrentBooking).mockResolvedValue({
      id: 123,
      status: "completed",
      pet_name: "Momo",
      pet_breed: "Poodle",
      service_name: "Full grooming",
    });
    vi.mocked(submitGroomerHealthReport).mockResolvedValue({ ok: true });

    render(
      <MemoryRouter>
        <GroomerDashboardPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Fill report for Momo" }));
    fireEvent.change(screen.getByPlaceholderText("Enter report summary"), {
      target: { value: "Momo had a smooth grooming session." },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter pet condition"), {
      target: { value: "Healthy coat" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter behavior notes"), {
      target: { value: "Calm" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter recommendations"), {
      target: { value: "Brush weekly" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit report" }));

    await waitFor(() => {
      expect(submitGroomerHealthReport).toHaveBeenCalledWith(123, {
        summary: "Momo had a smooth grooming session.",
        pet_condition: "Healthy coat",
        behavior_notes: "Calm",
        recommendations: "Brush weekly",
      });
    });
  });

  it("shows the reviewed completion card when the booking has a review", async () => {
    vi.mocked(getGroomerDashboardSummary).mockResolvedValue({});
    vi.mocked(getGroomerPendingBookingInvitations).mockResolvedValue([]);
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
      id: 123,
      status: "completed",
      package_amount: "95.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "95.00",
      deposit_amount: "20.00",
      final_amount: "95.00",
      review: {
        id: 9,
        rating: 5,
        comment: "Amazing job! Max looks fantastic and seems so happy. Thank you!",
        tip_amount: "15.00",
        created_at: "2026-05-24T10:00:00Z",
      },
    } as BookingDetailOut);
    vi.mocked(getGroomerCurrentBooking).mockResolvedValue({
      id: 123,
      status: "completed",
      pet_name: "Max",
      pet_breed: "Poodle",
      owner_name: "Emma Johnson",
      service_name: "Full grooming",
    });

    render(
      <MemoryRouter>
        <GroomerDashboardPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Excellent Work!")).toBeInTheDocument();
    expect(screen.getByText("Emma Johnson rated you")).toBeInTheDocument();
    expect(screen.getByText("+ $15.00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fill report for Max" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View next job" })).toBeInTheDocument();
  });

  it("preselects existing add-ons in groomer check up and submits them back", async () => {
    vi.mocked(getGroomerDashboardSummary).mockResolvedValue({});
    vi.mocked(getGroomerPendingBookingInvitations).mockResolvedValue([]);
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
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
        { id: 7, name: "Selected add-on", price: "12.00" },
      ],
    } as BookingDetailOut);
    vi.mocked(getGroomerCurrentBooking).mockResolvedValue({
      id: 123,
      status: "checked_in",
      pet_name: "Momo",
      pet_breed: "Poodle",
      service_name: "Full grooming",
    });
    vi.mocked(getAddOns).mockResolvedValue([
      { id: 1, name: "A", price: "1.00", is_variable: false },
      { id: 2, name: "B", price: "1.00", is_variable: false },
      { id: 3, name: "C", price: "1.00", is_variable: false },
      { id: 4, name: "D", price: "1.00", is_variable: false },
      { id: 5, name: "E", price: "1.00", is_variable: false },
      { id: 6, name: "F", price: "1.00", is_variable: false },
      { id: 7, name: "Selected add-on", price: "12.00", is_variable: false },
    ]);
    vi.mocked(submitGroomerCheckUpCheckout).mockResolvedValue({
      ok: true,
      request_ids: [1],
      amount: "12.00",
      status: "client_confirmation_required",
    });

    render(
      <MemoryRouter>
        <GroomerDashboardPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Modify" }));
    fireEvent.click(await screen.findByRole("button", { name: "Next" }));
    await waitFor(() => {
      expect(screen.getAllByText("Selected add-on").length).toBeGreaterThan(0);
    });
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submitGroomerCheckUpCheckout).toHaveBeenCalledWith(123, expect.objectContaining({
        add_on_ids: [7],
      }));
    });
  });

  it("updates verify package and add-on immediately after check up submit", async () => {
    vi.mocked(getGroomerDashboardSummary).mockResolvedValue({});
    vi.mocked(getGroomerPendingBookingInvitations).mockResolvedValue([]);
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
      id: 123,
      status: "checked_in",
      package_amount: "95.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "95.00",
      deposit_amount: "20.00",
      final_amount: "95.00",
      package_snapshot: {
        service_name: "Full grooming",
      },
    } as BookingDetailOut);
    vi.mocked(getGroomerCurrentBooking).mockResolvedValue({
      id: 123,
      status: "checked_in",
      pet_name: "Momo",
      pet_breed: "Poodle",
      service_name: "Full grooming",
    });
    vi.mocked(getAddOns).mockResolvedValue([
      { id: 8, name: "Special add-on", price: "12.00", is_variable: false },
    ]);
    vi.mocked(submitGroomerCheckUpCheckout).mockResolvedValue({
      ok: true,
      request_ids: [1],
      amount: "20.00",
      status: "client_confirmation_required",
      final_amount: "115.00",
    });

    render(
      <MemoryRouter>
        <GroomerDashboardPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Verify package and add-on")).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Modify" }));
    fireEvent.click(await screen.findByRole("button", { name: "Next" }));
    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.change(screen.getAllByRole("spinbutton")[3], {
      target: { value: "8.00" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(submitGroomerCheckUpCheckout).toHaveBeenCalledWith(123, expect.objectContaining({
        add_on_ids: [8],
        personalization: { gt_50kg: "8.00" },
      }));
    });

    expect(await screen.findByText("$115.00")).toBeInTheDocument();
    expect(screen.getByText("Special add-on")).toBeInTheDocument();
    expect(screen.getByText("> 50kg")).toBeInTheDocument();
  });
});

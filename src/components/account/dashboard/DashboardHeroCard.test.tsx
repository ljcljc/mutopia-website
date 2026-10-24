import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBookingDetail, type BookingListOut, type BookingDetailOut } from "@/lib/api";
import { useAccountStore } from "../accountStore";
import DashboardHeroCard from "./DashboardHeroCard";

vi.mock("@/lib/api", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/api")>(),
  getBookingDetail: vi.fn(),
}));

function makeBooking(overrides: Partial<BookingListOut> = {}): BookingListOut {
  return {
    id: 1,
    status: "pending",
    pet_name: "Mochi",
    service_name: "Bath",
    address: "123 Main St, Vancouver, BC",
    service_type: "mobile",
    scheduled_time: "2026-05-30T10:00:00Z",
    ...overrides,
  };
}

function renderHeroCard() {
  render(
    <MemoryRouter initialEntries={["/account/dashboard"]}>
      <Routes>
        <Route path="/account/dashboard" element={<DashboardHeroCard />} />
        <Route path="/account/bookings/:bookingId" element={<div>Booking detail page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("DashboardHeroCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T08:00:00Z"));
    useAccountStore.setState({
      upcomingBookings: [],
      historyBookings: [],
      isLoadingBookings: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    useAccountStore.setState({
      upcomingBookings: [],
      historyBookings: [],
      isLoadingBookings: false,
    });
  });

  it("renders the active current booking using dashboard priority rules", async () => {
    useAccountStore.setState({
      upcomingBookings: [
        makeBooking({ id: 1, status: "confirmed", pet_name: "Alpha", scheduled_time: "2026-05-30T09:00:00Z" }),
        makeBooking({ id: 2, status: "traveling", pet_name: "Bravo", scheduled_time: "2026-05-30T15:00:00Z" }),
      ],
    });

    renderHeroCard();

    expect(screen.getByText("Bravo")).toBeInTheDocument();
    const badge = screen.getByText("Groomer is on the way").parentElement;
    expect(badge).toHaveClass("border-[#4C4C4C]", "text-[#4C4C4C]");
    expect(badge?.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
  });

  it("navigates to booking detail when clicked", async () => {
    useAccountStore.setState({
      upcomingBookings: [
        makeBooking({ id: 7, status: "checked_in", pet_name: "Coco" }),
      ],
    });

    renderHeroCard();

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Booking detail page")).toBeInTheDocument();
  });

  it("shows Ready for service with a green check badge", () => {
    useAccountStore.setState({ upcomingBookings: [makeBooking({ status: "confirmed" })] });

    renderHeroCard();

    const badge = screen.getByText("Ready for service").parentElement;
    expect(badge).toHaveClass("bg-[#E8FAE9]", "text-[#427D3E]", "rounded-xl");
    expect(badge?.querySelector("svg")).toBeInTheDocument();
  });

  it("shows the pending refund before GST", async () => {
    vi.useRealTimers();
    useAccountStore.setState({ upcomingBookings: [makeBooking({ id: 99, status: "checkup_adjustment_pending", scheduled_time: "2099-05-30T10:00:00Z" })] });
    vi.mocked(getBookingDetail).mockResolvedValue({
      id: 99,
      gst_amount: "8.55",
      adjustments: [{ id: 11, kind: "check_up", status: "pending", amount: "-9.45", gst_amount: "8.10", created_at: "2026-10-24T08:30:00Z" }],
    } as BookingDetailOut);

    renderHeroCard();

    expect(await screen.findByText("Check-in adjustment: Refund $9.00 plus tax = $9.45")).toBeInTheDocument();
  });

  it("shows Refund processing after the refund is confirmed", async () => {
    vi.useRealTimers();
    useAccountStore.setState({ upcomingBookings: [makeBooking({ id: 99, status: "checkup_adjustment_pending", scheduled_time: "2099-05-30T10:00:00Z" })] });
    vi.mocked(getBookingDetail).mockResolvedValue({
      id: 99,
      gst_amount: "8.55",
      adjustments: [{ id: 11, kind: "check_up", status: "refund_pending", amount: "-9.45", gst_amount: "8.10", created_at: "2026-10-24T08:30:00Z" }],
    } as BookingDetailOut);

    renderHeroCard();

    expect(await screen.findByText("Refund processing")).toBeInTheDocument();
    expect(screen.getByText("Check-in adjustment: Refund $9.00 plus tax = $9.45")).toBeInTheDocument();
  });

  it("renders the nearest not-started booking when there is no started booking", () => {
    useAccountStore.setState({
      upcomingBookings: [
        makeBooking({ id: 1, status: "pending" }),
        makeBooking({ id: 2, status: "awaiting_client_confirmation" }),
        makeBooking({ id: 3, status: "confirmed", scheduled_time: "2026-06-05T10:00:00Z" }),
      ],
    });

    render(
      <MemoryRouter>
        <DashboardHeroCard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Mochi")).toBeInTheDocument();
    expect(screen.getByText("Waiting for groomer match").parentElement).toHaveClass("border-[#4C4C4C]", "text-[#4C4C4C]");
  });

  it("renders the latest completed booking from history", () => {
    useAccountStore.setState({
      historyBookings: [
        makeBooking({
          id: 9,
          status: "completed",
          hero_stage: "service_completed",
          pet_name: "Mochi completed",
        }),
      ],
    });

    renderHeroCard();

    expect(screen.getByText("Mochi completed")).toBeInTheDocument();
    expect(screen.getByText("Service completed!")).toBeInTheDocument();
  });

  it("shows Service completed while the health report is pending", () => {
    useAccountStore.setState({
      upcomingBookings: [makeBooking({ status: "pending_report" })],
    });

    renderHeroCard();

    expect(screen.getByText("Service completed")).toBeInTheDocument();
  });

  it.each([
    ["awaiting_payment", undefined, false, "Waiting for payment"],
    ["terminated", undefined, false, "Service terminated"],
    ["terminated", "10.00", false, "Service terminated and refunded"],
    ["canceled", undefined, false, "Service canceled"],
    ["refunded", "10.00", false, "Service canceled and refunded"],
    ["completed", undefined, true, "Service completed and report filled"],
  ])("renders %s with the requested Hero label", (status, refundedAmount, hasHealthReport, label) => {
    const booking = makeBooking({ status, refunded_amount: refundedAmount, has_health_report: hasHealthReport });
    useAccountStore.setState({
      upcomingBookings: status === "awaiting_payment" ? [booking] : [],
      historyBookings: status === "awaiting_payment" ? [] : [booking],
    });

    renderHeroCard();

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

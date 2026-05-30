import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { BookingListOut } from "@/lib/api";
import { useAccountStore } from "../accountStore";
import DashboardHeroCard from "./DashboardHeroCard";

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
    expect(screen.getByText("Traveling")).toBeInTheDocument();
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

  it("does not render when there is no eligible current booking", () => {
    useAccountStore.setState({
      upcomingBookings: [
        makeBooking({ id: 1, status: "pending" }),
        makeBooking({ id: 2, status: "awaiting_client_confirmation" }),
        makeBooking({ id: 3, status: "confirmed", scheduled_time: "2026-06-05T10:00:00Z" }),
      ],
    });

    const { container } = render(
      <MemoryRouter>
        <DashboardHeroCard />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

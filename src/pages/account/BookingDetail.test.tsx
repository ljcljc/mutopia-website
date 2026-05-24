import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookingDetail from "./BookingDetail";
import { clientConfirmBookingTime, createDepositSession, createReview, createTipSession, getBookingDetail, type BookingDetailOut } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { useBookingStore } from "@/components/booking/bookingStore";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    clientConfirmBookingTime: vi.fn(),
    createDepositSession: vi.fn(),
    createReview: vi.fn(),
    createTipSession: vi.fn(),
    getBookingDetail: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

function expectedLocalLabel(value: string) {
  const parsed = new Date(value);
  const pad2 = (part: number) => String(part).padStart(2, "0");

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())} at ${pad2(parsed.getHours())}:${pad2(parsed.getMinutes())}`;
}

function renderBookingDetail(booking: BookingDetailOut) {
  vi.mocked(getBookingDetail).mockResolvedValueOnce(booking);

  render(
    <MemoryRouter initialEntries={[`/account/bookings/${booking.id}`]}>
      <Routes>
        <Route path="/account/bookings/:bookingId" element={<BookingDetail />} />
        <Route path="/booking" element={<div>Booking flow</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function makeCompletedBooking(overrides: Partial<BookingDetailOut> = {}): BookingDetailOut {
  return {
    id: 127,
    order_code: "BT260523PJQ",
    status: "completed",
    scheduled_time: "2026-05-24T08:00:00Z",
    pet_snapshot: { name: "Hugui" },
    package_snapshot: {
      name: "Full grooming",
      service_type: "Mobile",
      price: "95.00",
    },
    address_snapshot: {
      address: "100 Vancouver Cres",
      city: "Miramichi",
      province: "NB",
      postal_code: "E1N 2E5",
    },
    addons_snapshot: [{ name: "Teeth brushing", price: "10.00" }],
    membership_snapshot: {},
    coupon_snapshot: {},
    package_amount: "95.00",
    addons_amount: "10.00",
    membership_fee: "0.00",
    discount_rate: "0",
    discount_amount: "0.00",
    coupon_amount: "0.00",
    payable_amount: "105.00",
    deposit_amount: "20.00",
    final_amount: "105.00",
    payments: [
      { id: 1, kind: "deposit", amount: "20.00", currency: "usd", status: "paid" },
      { id: 2, kind: "final", amount: "85.00", currency: "usd", status: "succeeded" },
    ],
    ...overrides,
  };
}

describe("BookingDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useBookingStore.getState().reset();
  });

  it("shows the selected appointment time for an unpaid booking after the scheduled time has passed", async () => {
    renderBookingDetail({
      id: 123,
      order_code: "ORDER-123",
      status: "awaiting_payment",
      scheduled_time: null,
      payment_due_at: "2026-05-04T10:00:00Z",
      preferred_time_slots: [
        { date: "2026-05-02", slot: "morning" },
        { date: "2026-05-03", slot: "morning" },
        { date: "2026-05-04", slot: "afternoon" },
      ],
      pet_snapshot: { name: "Momo" },
      package_snapshot: {
        name: "Full grooming",
        service_type: "Mobile",
        price: "80.00",
      },
      address_snapshot: {
        address: "100 Vancouver Cres",
        city: "Miramichi",
        province: "NB",
        postal_code: "E1N 2E5",
      },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "80.00",
      deposit_amount: "20.00",
      final_amount: "80.00",
    });

    expect(await screen.findByText("Time selected")).toBeInTheDocument();
    expect(screen.getByText("2026-05-02 AM", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2026-05-03 AM", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("2026-05-04 PM", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Waiting for payment")).toBeInTheDocument();
    expect(screen.getByText(`Pay before ${expectedLocalLabel("2026-05-04T10:00:00Z")}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go pay" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Edit booking" }));

    expect(screen.getByText("Booking flow")).toBeInTheDocument();
    expect(useBookingStore.getState().currentStep).toBe(6);
    expect(useBookingStore.getState().editingBookingId).toBe(123);
    expect(useBookingStore.getState().selectedTimeSlots).toEqual([
      { date: "2026-05-02", slot: "morning" },
      { date: "2026-05-03", slot: "morning" },
      { date: "2026-05-04", slot: "afternoon" },
    ]);
  });

  it("shows the scheduled service time in the summary when a booking has scheduled_time", async () => {
    const scheduledTime = "2026-01-01T10:00:00Z";

    renderBookingDetail({
      id: 124,
      order_code: "ORDER-124",
      status: "awaiting_payment",
      scheduled_time: scheduledTime,
      pet_snapshot: { name: "Momo" },
      package_snapshot: {
        name: "Full grooming",
        service_type: "Mobile",
        price: "80.00",
      },
      address_snapshot: {
        address: "100 Vancouver Cres",
        city: "Miramichi",
        province: "NB",
        postal_code: "E1N 2E5",
      },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "80.00",
      deposit_amount: "20.00",
      final_amount: "80.00",
    });

    expect(
      await screen.findByText(`Full grooming - Mobile ${expectedLocalLabel(scheduledTime)}`),
    ).toBeInTheDocument();
  });

  it("sends the proposed time with a local datetime string when confirming", async () => {
    const initialBooking: BookingDetailOut = {
      id: 126,
      order_code: "ORDER-126",
      status: "awaiting_client_confirmation",
      scheduled_time: null,
      time_options: [
        {
          date: "2026-05-17",
          slot: "am",
          time: "08:00",
          datetime_local: "2026-05-17 08:00",
        },
      ],
      pet_snapshot: { name: "Momo" },
      package_snapshot: {
        name: "Full grooming",
        service_type: "Mobile",
        price: "80.00",
      },
      address_snapshot: {
        address: "100 Vancouver Cres",
        city: "Miramichi",
        province: "NB",
        postal_code: "E1N 2E5",
      },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "80.00",
      deposit_amount: "20.00",
      final_amount: "80.00",
    };

    vi.mocked(getBookingDetail).mockResolvedValue(initialBooking);
    vi.mocked(clientConfirmBookingTime).mockResolvedValue({ ok: true });

    render(
      <MemoryRouter initialEntries={["/account/bookings/126"]}>
        <Routes>
          <Route path="/account/bookings/:bookingId" element={<BookingDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(clientConfirmBookingTime).toHaveBeenCalledWith(126, {
        accept: true,
        selected_time: {
          date: "2026-05-17",
          slot: "am",
          time: "08:00",
          datetime_local: "2026-05-17 08:00",
        },
      });
    });
  });

  it("refreshes the detail when starting payment fails because the booking expired", async () => {
    const initialBooking: BookingDetailOut = {
      id: 125,
      order_code: "ORDER-125",
      status: "awaiting_payment",
      scheduled_time: null,
      pet_snapshot: { name: "Momo" },
      package_snapshot: {
        name: "Full grooming",
        service_type: "Mobile",
        price: "80.00",
      },
      address_snapshot: {
        address: "100 Vancouver Cres",
        city: "Miramichi",
        province: "NB",
        postal_code: "E1N 2E5",
      },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "80.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "80.00",
      deposit_amount: "20.00",
      final_amount: "80.00",
    };
    vi.mocked(getBookingDetail)
      .mockResolvedValueOnce(initialBooking)
      .mockResolvedValueOnce({
        ...initialBooking,
        status: "booking_canceled",
        cancel_reason: "Payment expired after 3 days",
        canceled_by: "system",
      });
    vi.mocked(createDepositSession).mockRejectedValueOnce(
      new HttpError("Booking payment expired", 409, "Conflict"),
    );

    render(
      <MemoryRouter initialEntries={["/account/bookings/125"]}>
        <Routes>
          <Route path="/account/bookings/:bookingId" element={<BookingDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Go pay" }));

    await waitFor(() => {
      expect(screen.getByText("Service canceled")).toBeInTheDocument();
    });
    expect(screen.getByText("Payment expired after 3 days")).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("This booking has expired and was canceled.");
  });

  it("starts tip payment from a completed booking", async () => {
    renderBookingDetail(makeCompletedBooking());
    vi.mocked(createTipSession).mockReturnValue(new Promise(() => {}));

    expect(await screen.findByText("Tip your groomer?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "12% - 12.60$" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Confirm & release Groomer" }));

    await waitFor(() => {
      expect(createTipSession).toHaveBeenCalledWith(127, "12.60");
    });
  });

  it("submits a review for a completed booking", async () => {
    const initialBooking = makeCompletedBooking({
      payments: [
        { id: 1, kind: "deposit", amount: "20.00", currency: "usd", status: "paid" },
        { id: 2, kind: "final", amount: "85.00", currency: "usd", status: "succeeded" },
        { id: 3, kind: "tip", amount: "12.60", currency: "usd", status: "paid" },
      ],
    });
    vi.mocked(getBookingDetail)
      .mockResolvedValueOnce(initialBooking)
      .mockResolvedValueOnce({
        ...initialBooking,
        review: {
          id: 9,
          rating: 5,
          technical_rating: 5,
          attitude_rating: 5,
          environment_rating: 5,
          comment: "Great service",
          created_at: "2026-05-24T10:00:00Z",
        },
      });
    vi.mocked(createReview).mockResolvedValue({ ok: true, review_id: 9 });

    render(
      <MemoryRouter initialEntries={["/account/bookings/127"]}>
        <Routes>
          <Route path="/account/bookings/:bookingId" element={<BookingDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Review" }));
    fireEvent.change(await screen.findByPlaceholderText("Share more details"), {
      target: { value: "Great service" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(createReview).toHaveBeenCalledWith(127, {
        rating: 5,
        technical_rating: 5,
        attitude_rating: 5,
        environment_rating: 5,
        comment: "Great service",
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Review submitted");
  });
});

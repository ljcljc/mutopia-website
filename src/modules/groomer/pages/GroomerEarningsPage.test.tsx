import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerEarningsPage from "./GroomerEarningsPage";
import {
  getGroomerEarningTransactions,
  getGroomerEarningsSummary,
  getGroomerPayoutSummary,
  groomerCashOut,
} from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getGroomerEarningTransactions: vi.fn(),
    getGroomerEarningsSummary: vi.fn(),
    getGroomerPayoutSummary: vi.fn(),
    groomerCashOut: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("GroomerEarningsPage", () => {
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
  });

  it("renders live earnings data", async () => {
    vi.mocked(getGroomerEarningsSummary).mockResolvedValue({
      available: "840.50",
      held: "98.36",
      cashed_out: "1200.00",
      service_amount: "650.00",
      completed_count: 12,
      tip_amount: "140.50",
      tip_count: 8,
    });
    vi.mocked(getGroomerPayoutSummary).mockResolvedValue({
      cash_out_fee_rate: "0.0150",
    });
    vi.mocked(getGroomerEarningTransactions).mockResolvedValue({
      total: 1,
      page: 1,
      page_size: 20,
      items: [
        {
          id: 1,
          kind: "service_earning",
          amount: "85.00",
          booking_id: 42,
          description: "Booking #42 service earning",
          booking: {
            pet_name: "Max",
            service_name: "Full groom",
            package_amount: "85.00",
            addons_amount: "0.00",
            final_amount: "105.00",
            tip_amount: "20.00",
            payment_summary: {
              base_paid_amount: "85.00",
              additional_paid_amount: "0.00",
              refunded_amount: "0.00",
              tip_paid_amount: "20.00",
            },
          },
          available_at: "2026-05-31T00:00:00Z",
          created_at: "2026-05-30T03:30:00Z",
        },
        {
          id: 3,
          kind: "service_earning",
          amount: "17.00",
          booking_id: 42,
          description: "Booking #42 extra service fee",
          booking: {
            pet_name: "Max",
            service_name: "Full groom",
            package_amount: "85.00",
            addons_amount: "17.00",
            final_amount: "122.00",
            tip_amount: "20.00",
            payment_summary: {
              base_paid_amount: "85.00",
              additional_paid_amount: "17.00",
              refunded_amount: "0.00",
              tip_paid_amount: "20.00",
            },
          },
          available_at: "2026-05-31T00:00:00Z",
          created_at: "2026-05-30T03:30:30Z",
        },
        {
          id: 2,
          kind: "tip_earning",
          amount: "20.00",
          booking_id: 42,
          description: "Booking #42 tip",
          booking: {
            pet_name: "Max",
            service_name: "Full groom",
            package_amount: "85.00",
            addons_amount: "0.00",
            final_amount: "105.00",
            tip_amount: "20.00",
            payment_summary: {
              base_paid_amount: "85.00",
              additional_paid_amount: "0.00",
              refunded_amount: "0.00",
              tip_paid_amount: "20.00",
            },
          },
          available_at: "2026-05-31T00:00:00Z",
          created_at: "2026-05-30T03:31:00Z",
        },
      ],
    });

    render(
      <MemoryRouter>
        <GroomerEarningsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("$840.50")).toBeInTheDocument();
    expect(screen.getByText("$98.36 on the way")).toBeInTheDocument();
    expect(screen.getByText("Total cashed out:")).toBeInTheDocument();
    expect(screen.getByText("$650.00")).toBeInTheDocument();
    expect(screen.getByText("12 completed jobs")).toBeInTheDocument();
    expect(screen.getByText("$140.50")).toBeInTheDocument();
    expect(screen.getByText("8 tips received")).toBeInTheDocument();
    expect(screen.getByText("Max - Full groom")).toBeInTheDocument();
    expect(screen.getByText("+$122.00")).toBeInTheDocument();
    expect(screen.getByText("$85.00 + $17.00 extra + $20.00 tip")).toBeInTheDocument();
    expect(screen.queryAllByText("Max - Full groom")).toHaveLength(1);
    expect(screen.getByText("Fee: 1.5%")).toBeInTheDocument();
  });

  it("cashes out and refreshes the page state", async () => {
    vi.mocked(getGroomerEarningsSummary)
      .mockResolvedValueOnce({
        available: "840.50",
        held: "98.36",
        cashed_out: "1200.00",
        service_amount: "650.00",
        completed_count: 12,
        tip_amount: "140.50",
        tip_count: 8,
      })
      .mockResolvedValueOnce({
        available: "0.00",
        held: "98.36",
        cashed_out: "2040.50",
        service_amount: "650.00",
        completed_count: 12,
        tip_amount: "140.50",
        tip_count: 8,
      });
    vi.mocked(getGroomerPayoutSummary)
      .mockResolvedValueOnce({ cash_out_fee_rate: "0.0150" })
      .mockResolvedValueOnce({ cash_out_fee_rate: "0.0150" });
    vi.mocked(getGroomerEarningTransactions)
      .mockResolvedValueOnce({ total: 0, page: 1, page_size: 20, items: [] })
      .mockResolvedValueOnce({
        total: 2,
        page: 1,
        page_size: 20,
        items: [
          {
            id: 2,
            kind: "cash_out",
            amount: "840.50",
            description: "Cash out",
            created_at: "2026-05-30T05:00:00Z",
          },
        ],
      });
    vi.mocked(groomerCashOut).mockResolvedValue({
      ok: true,
      cash_out_request_id: 9,
      amount: "840.50",
      fee_amount: "12.61",
      net_amount: "827.89",
      status: "completed",
    });

    render(
      <MemoryRouter>
        <GroomerEarningsPage />
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: /cash out now/i }));

    await waitFor(() => {
      expect(groomerCashOut).toHaveBeenCalledWith({ amount: "840.50" });
    });
    expect(await screen.findByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText("-$840.50")).toBeInTheDocument();
  });
});

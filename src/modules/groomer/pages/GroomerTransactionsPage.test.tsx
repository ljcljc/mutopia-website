import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerTransactionsPage from "./GroomerTransactionsPage";
import { getGroomerEarningTransactions } from "@/lib/api";

let latestIntersectionCallback: IntersectionObserverCallback | null = null;

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getGroomerEarningTransactions: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("GroomerTransactionsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    latestIntersectionCallback = null;
    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: class IntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          latestIntersectionCallback = callback;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
        root = null;
        rootMargin = "";
        thresholds = [];
      },
    });
  });

  it("loads next page when the sentinel intersects", async () => {
    vi.mocked(getGroomerEarningTransactions)
      .mockResolvedValueOnce({
        total: 25,
        page: 1,
        page_size: 20,
        items: [
          {
            id: 2,
            kind: "tip_earning",
            amount: "12.00",
            booking_id: 40,
            description: "Booking #40 tip",
            booking: {
              pet_name: "Milo",
              service_name: "Grooming & bath",
              package_amount: "65.00",
              addons_amount: "13.00",
              final_amount: "107.00",
              tip_amount: "12.00",
              payment_summary: {
                base_paid_amount: "65.00",
                additional_paid_amount: "0.00",
                refunded_amount: "0.00",
                tip_paid_amount: "12.00",
              },
            },
            created_at: "2026-05-30T03:31:00Z",
            available_at: "2026-06-02T00:00:00Z",
          },
        ],
      })
      .mockResolvedValueOnce({
        total: 25,
        page: 2,
        page_size: 20,
        items: [
          {
            id: 1,
            kind: "service_earning",
            amount: "83.00",
            booking_id: 40,
            description: "Booking #40 service earning",
            booking: {
              pet_name: "Milo",
              service_name: "Grooming & bath",
              package_amount: "65.00",
              addons_amount: "13.00",
              final_amount: "107.00",
              tip_amount: "12.00",
              payment_summary: {
                base_paid_amount: "65.00",
                additional_paid_amount: "13.00",
                refunded_amount: "0.00",
                tip_paid_amount: "12.00",
              },
            },
            created_at: "2026-05-30T03:30:00Z",
            available_at: "2026-06-02T00:00:00Z",
          },
          {
            id: 21,
            kind: "cash_out",
            amount: "40.00",
            description: "Cash out",
            created_at: "2026-05-29T03:30:00Z",
          },
        ],
      });

    render(
      <MemoryRouter>
        <GroomerTransactionsPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Milo - Grooming & bath")).toBeInTheDocument();
    expect(screen.getByText("$12.00 tip")).toBeInTheDocument();
    expect(screen.getByText("+$12.00")).toBeInTheDocument();
    expect(screen.queryAllByText("Milo - Grooming & bath")).toHaveLength(1);
    await waitFor(() => {
      expect(latestIntersectionCallback).not.toBeNull();
    });

    latestIntersectionCallback?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    await waitFor(() => {
      expect(getGroomerEarningTransactions).toHaveBeenNthCalledWith(2, { page: 2, page_size: 20 });
    });
    expect(screen.queryAllByText("Milo - Grooming & bath")).toHaveLength(1);
    expect(screen.getByText("$65.00 + $13.00 extra + $12.00 tip")).toBeInTheDocument();
    expect(screen.getByText("+$95.00")).toBeInTheDocument();
    expect(await screen.findByText("Cash out")).toBeInTheDocument();
    expect(screen.getByText("-$40.00")).toBeInTheDocument();
  });
});

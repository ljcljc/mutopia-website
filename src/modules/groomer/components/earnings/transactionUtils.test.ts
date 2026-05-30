import { describe, expect, it, vi } from "vitest";
import { mapTransactionPage } from "./transactionUtils";

describe("mapTransactionPage", () => {
  it("uses comma-separated labels for both today and non-today items", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-30T12:00:00Z"));

    const result = mapTransactionPage({
      total: 2,
      page: 1,
      page_size: 20,
      items: [
        {
          id: 1,
          kind: "service_earning",
          amount: "10.00",
          booking_id: 10,
          booking: { pet_name: "Milo", service_name: "Bath" },
          created_at: "2026-05-30T03:31:00Z",
        },
        {
          id: 2,
          kind: "cash_out",
          amount: "20.00",
          created_at: "2026-05-24T00:50:00Z",
        },
      ],
    });

    expect(result.items[0]?.subtitle).toMatch(/^Today, \d{1,2}:\d{2} [AP]M$/);
    expect(result.items[1]?.subtitle).toMatch(/^May 24, \d{1,2}:\d{2} [AP]M$/);

    vi.useRealTimers();
  });

  it("builds service detail from payment summary instead of addons amount", () => {
    const result = mapTransactionPage({
      total: 1,
      page: 1,
      page_size: 20,
      items: [
        {
          id: 1,
          kind: "service_earning",
          amount: "28.38",
          booking_id: 10,
          booking: {
            pet_name: "Milo",
            service_name: "Bath",
            package_amount: "33.96",
            addons_amount: "99.00",
            tip_amount: "5.00",
            payment_summary: {
              base_paid_amount: "33.96",
              additional_paid_amount: "10.00",
              refunded_amount: "15.00",
              tip_paid_amount: "5.00",
            },
          },
          created_at: "2026-05-24T00:50:00Z",
        },
      ],
    });

    expect(result.items[0]?.detail).toBe("$33.96 + $10.00 extra - $15.00 refund + $5.00 tip");
  });
});

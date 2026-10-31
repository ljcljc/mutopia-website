import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentMethodCard from "./PaymentMethodCard";
import { getPaymentMethods } from "@/lib/api";

vi.mock("@/lib/api", () => ({ getPaymentMethods: vi.fn() }));

const getMethods = vi.mocked(getPaymentMethods);
const card = (id: number, last4: string, created_at: string) => ({
  id,
  last4,
  created_at,
  brand: "visa",
});

describe("PaymentMethodCard", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads all pages, masks cards and displays newest first without inventing a default", async () => {
    getMethods
      .mockResolvedValueOnce({
        items: [card(2, "5678", "2026-02-01")],
        total: 2,
        page: 1,
        page_size: 100,
      })
      .mockResolvedValueOnce({
        items: [card(1, "1234", "2026-01-01")],
        total: 2,
        page: 2,
        page_size: 100,
      });
    render(<PaymentMethodCard />);
    await screen.findByText("**** **** **** 1234");
    expect(getMethods).toHaveBeenNthCalledWith(2, { page: 2, page_size: 100 });
    const cards = screen.getAllByText(/\*\*\*\* \*\*\*\* \*\*\*\*/);
    expect(cards.map((item) => item.textContent)).toEqual([
      "**** **** **** 5678",
      "**** **** **** 1234",
    ]);
    expect(screen.queryByText("Default")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Modify" })).toBeEnabled();
    expect(
      screen.getAllByRole("button", { name: "Delete payment method" })
    ).toHaveLength(2);
  });

  it("hides the entire card until payment methods finish loading", async () => {
    let resolve!: (
      value: Awaited<ReturnType<typeof getPaymentMethods>>
    ) => void;
    getMethods.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      })
    );
    const { container } = render(<PaymentMethodCard />);
    expect(container).toBeEmptyDOMElement();
    resolve({
      items: [card(1, "1234", "2026-01-01")],
      total: 1,
      page: 1,
      page_size: 100,
    });
    await screen.findByText("**** **** **** 1234");
  });

  it("hides the entire card when no payment methods are saved", async () => {
    const request = Promise.resolve({
      items: [],
      total: 0,
      page: 1,
      page_size: 100,
    });
    getMethods.mockReturnValue(request);
    const { container } = render(<PaymentMethodCard />);
    await act(async () => {
      await request;
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a retryable error instead of hiding a failed request", async () => {
    getMethods.mockRejectedValueOnce(new Error("Unavailable"));
    getMethods.mockResolvedValueOnce({
      items: [card(1, "1234", "2026-01-01")],
      total: 1,
      page: 1,
      page_size: 100,
    });
    render(<PaymentMethodCard />);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load payment methods."
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await screen.findByText("**** **** **** 1234");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";
import { getPaymentSessionRedirectUrl, type PaymentSessionOut } from "./api";

const baseSession: PaymentSessionOut = {
  url: "https://checkout.stripe.com/c/pay/session",
  session_id: "cs_test_123",
  payment_id: 30,
};

describe("getPaymentSessionRedirectUrl", () => {
  it("returns absolute HTTP payment URLs", () => {
    expect(getPaymentSessionRedirectUrl(baseSession)).toBe(
      "https://checkout.stripe.com/c/pay/session",
    );
  });

  it("rejects relative values so they are not treated as app routes", () => {
    expect(getPaymentSessionRedirectUrl({ ...baseSession, url: "30" })).toBeNull();
  });
});

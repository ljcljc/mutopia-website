import { describe, expect, it } from "vitest";
import { calculateBookingDisplayPrice } from "./pricing";

describe("calculateBookingDisplayPrice", () => {
  it("discounts all service components before applying one GST calculation", () => {
    const result = calculateBookingDisplayPrice({
      serviceFee: 58.5,
      addons: 25.2,
      mobileVanService: 27,
      safetyInsurance: 11,
      discountRate: 0.95,
      couponAmount: 0,
    });

    expect(result.preGstTotal).toBe(115.62);
    expect(result.gstAmount).toBe(5.78);
    expect(result.payableTotal).toBe(121.4);
  });

  it("taxes a new membership fee with the service", () => {
    const result = calculateBookingDisplayPrice({
      serviceFee: 100,
      addons: 0,
      mobileVanService: 0,
      safetyInsurance: 0,
      membershipFee: 30,
    });

    expect(result.preGstTotal).toBe(100);
    expect(result.gstAmount).toBe(6.5);
    expect(result.payableTotal).toBe(136.5);
  });

  it("keeps the old tax base when editing a legacy booking", () => {
    const result = calculateBookingDisplayPrice({ serviceFee: 100, addons: 0, mobileVanService: 0, safetyInsurance: 0, membershipFee: 30, taxMembership: false });
    expect(result.gstAmount).toBe(5);
    expect(result.payableTotal).toBe(135);
  });

  it("matches the service, membership, and tax example", () => {
    const result = calculateBookingDisplayPrice({ serviceFee: 104.7, addons: 0, mobileVanService: 0, safetyInsurance: 0, membershipFee: 99 });
    expect(result.gstAmount).toBe(10.19);
    expect(result.payableTotal).toBe(213.89);
  });
});

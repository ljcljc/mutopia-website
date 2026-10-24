import { describe, expect, it } from "vitest";
import {
  formatCouponCategory,
  getCouponDisplayName,
  getCouponType,
  getGeneralCouponCategory,
  groupCoupons,
  selectAppliedBookingCoupons,
} from "./couponUtils";

describe("coupon utils", () => {
  it.each([
    ["invite", undefined, "general"],
    ["cash", undefined, "general"],
    ["gift", "membership_gift", "general"],
    ["invitee_gift", undefined, "general"],
    ["birthday", undefined, "special"],
    ["gift", "gift", "special"],
    ["custom", "custom", "special"],
  ])("classifies %s/%s as %s", (category, type, expected) => {
    expect(getCouponType({ category, type })).toBe(expected);
  });

  it("groups general coupons into cash or invite", () => {
    expect(getGeneralCouponCategory({ category: "gift", type: "membership_gift" })).toBe("cash");
    expect(getGeneralCouponCategory({ category: "invite", type: "invite" })).toBe("invite");
  });

  it("keeps special coupons under one display group", () => {
    const result = groupCoupons([
      { id: 1, category: "custom", type: "custom" },
      { id: 2, category: "birthday", type: "birthday" },
      { id: 3, category: "cash", type: "cash" },
    ]);
    expect(result.special.map((coupon) => coupon.id)).toEqual([1, 2]);
    expect(result.general.map((coupon) => coupon.id)).toEqual([3]);
  });

  it("uses fixed labels for known coupons and metadata only for unknown ones", () => {
    expect(formatCouponCategory("custom", "custom")).toBe("Custom coupon");
    expect(getCouponDisplayName({ category: "custom", type: "custom", template_name: "Late arrival compensation" })).toBe("Custom coupon");
    expect(getCouponDisplayName({ category: "future", type: "future", template_name: "Future coupon" })).toBe("future");
    expect(getCouponDisplayName({ category: "future", template_name: "Future coupon" })).toBe("Future coupon");
  });

  it("uses only one gift credit when a real and virtual gift are selected", () => {
    expect(selectAppliedBookingCoupons([
      { id: -1, category: "cash", type: "cash" },
      { id: 2, category: "gift", type: "gift" },
      { id: 3, category: "birthday", type: "birthday" },
    ]).map((coupon) => coupon.id)).toEqual([2, 3]);
  });
});

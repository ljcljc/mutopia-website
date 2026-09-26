export type CouponLike = {
  id?: number;
  category?: string | null;
  type?: string | null;
  template_name?: string | null;
  notes?: string | null;
};

export type CouponGroupType = "general" | "special";

export function getCouponType(coupon: CouponLike): CouponGroupType {
  if (
    coupon.category === "invite" ||
    coupon.category === "cash" ||
    coupon.type === "invite" ||
    coupon.type === "membership" ||
    coupon.type === "invitee_gift" ||
    coupon.type === "membership_gift" ||
    coupon.category === "invitee_gift"
  ) {
    return "general";
  }
  return "special";
}

export function getGeneralCouponCategory(coupon: CouponLike): "cash" | "invite" {
  return coupon.category === "cash" ||
    coupon.type === "cash" ||
    coupon.type === "membership" ||
    coupon.type === "membership_gift" ||
    coupon.type === "invitee_gift" ||
    coupon.category === "invitee_gift"
    ? "cash"
    : "invite";
}

export function formatCouponCategory(category: string | null | undefined, type?: string | null): string {
  const mapping: Record<string, string> = {
    cash: "Cash credit",
    gift: "Special gift",
    birthday: "Birthday",
    invite: "Invite credit",
    custom: "Custom coupon",
    invitee_gift: "Cash credit",
  };
  return (type && mapping[type]) || mapping[category ?? ""] || category || "Coupon";
}

export function getCouponDisplayName(coupon: CouponLike): string {
  if (coupon.category === "birthday" && coupon.type === "cash") return "Birthday";
  if (coupon.category === "gift" || coupon.category === "custom") {
    if (coupon.notes?.trim()) return coupon.notes;
    if (coupon.type && coupon.type !== "gift" && coupon.type !== "custom") return coupon.type;
    return formatCouponCategory(coupon.category, coupon.type);
  }
  const knownCategory = ["cash", "gift", "birthday", "invite", "custom", "invitee_gift"].includes(coupon.category ?? "");
  if (knownCategory || ["cash", "membership", "invite", "invitee_gift", "membership_gift"].includes(coupon.type ?? "")) {
    return formatCouponCategory(coupon.category, coupon.type);
  }
  return coupon.type || coupon.template_name || "Coupon";
}

export function groupCoupons<T extends CouponLike>(coupons: readonly T[]) {
  const general: T[] = [];
  const special: T[] = [];
  for (const coupon of coupons) {
    (getCouponType(coupon) === "general" ? general : special).push(coupon);
  }
  return { general, special };
}

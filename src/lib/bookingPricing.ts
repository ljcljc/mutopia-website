export type BookingPricingRecord = {
  package_amount?: number | string | null;
  addons_amount?: number | string | null;
  mobile_van_service_amount?: number | string | null;
  safety_insurance_amount?: number | string | null;
  final_amount?: number | string | null;
  pre_gst_total?: number | string | null;
  discount_rate?: number | string | null;
  membership_fee?: number | string | null;
};

export type BookingEstimateSummary = {
  finalAmount: number | null;
  originalAmount: number;
  preGstAmount: number | null;
  discountPercent: number;
  membershipFee: number;
};

function parsePricingAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function sumPricingAmounts(...values: unknown[]): number {
  return values.reduce<number>(
    (total, value) => total + (parsePricingAmount(value) ?? 0),
    0
  );
}

export function getBookingEstimateSummary(
  booking: BookingPricingRecord
): BookingEstimateSummary {
  const finalAmount = parsePricingAmount(booking.final_amount);
  const preGstAmount = parsePricingAmount(booking.pre_gst_total);
  const discountRate = parsePricingAmount(booking.discount_rate) ?? 0;

  return {
    finalAmount,
    originalAmount: sumPricingAmounts(
      booking.package_amount,
      booking.addons_amount,
      booking.mobile_van_service_amount,
      booking.safety_insurance_amount
    ),
    preGstAmount,
    discountPercent:
      discountRate > 0
        ? Math.round(
            (discountRate < 1 ? 1 - discountRate : discountRate) *
              (discountRate < 1 ? 100 : 1)
          )
        : 0,
    membershipFee: parsePricingAmount(booking.membership_fee) ?? 0,
  };
}

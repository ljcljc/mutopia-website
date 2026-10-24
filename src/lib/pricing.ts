import type { ServiceOut } from "./api";

export const isNewMembershipPurchase = (selected: boolean, alreadyMember: boolean) => selected && !alreadyMember;

export interface BookingDisplayPriceInput {
  serviceFee: number;
  addons: number;
  mobileVanService: number;
  safetyInsurance: number;
  discountRate?: number;
  couponAmount?: number;
  membershipFee?: number;
  taxMembership?: boolean;
}

export interface BookingDisplayPrice {
  discountedServiceFee: number;
  discountedAddons: number;
  discountedMobileVanService: number;
  discountedSafetyInsurance: number;
  discountAmount: number;
  couponAmount: number;
  preGstTotal: number;
  gstAmount: number;
  membershipFee: number;
  payableTotal: number;
}

/** Mirrors the backend's unified pre-GST discount and GST calculation for checkout display. */
export function calculateBookingDisplayPrice(input: BookingDisplayPriceInput): BookingDisplayPrice {
  const rate = Math.max(0, Math.min(1, input.discountRate ?? 1));
  const serviceFee = Math.max(0, input.serviceFee);
  const addons = Math.max(0, input.addons);
  const mobileVanService = Math.max(0, input.mobileVanService);
  const safetyInsurance = Math.max(0, input.safetyInsurance);
  const discountedServiceFee = Math.round(serviceFee * rate * 100) / 100;
  const discountedAddons = Math.round(addons * rate * 100) / 100;
  const discountedMobileVanService = Math.round(mobileVanService * rate * 100) / 100;
  const discountedSafetyInsurance = Math.round(safetyInsurance * rate * 100) / 100;
  const couponAmount = Math.min(Math.max(0, input.couponAmount ?? 0), discountedServiceFee);
  const discountAmount = Math.round(
    (serviceFee + addons + mobileVanService + safetyInsurance) * (1 - rate) * 100,
  ) / 100;
  const preGstTotal = Math.max(
    0,
    Math.round(
      (discountedServiceFee + discountedAddons + discountedMobileVanService + discountedSafetyInsurance - couponAmount) * 100,
    ) / 100,
  );
  const membershipFee = Math.max(0, input.membershipFee ?? 0);
  const gstAmount = Math.round((preGstTotal + (input.taxMembership === false ? 0 : membershipFee)) * 0.05 * 100) / 100;
  return {
    discountedServiceFee,
    discountedAddons,
    discountedMobileVanService,
    discountedSafetyInsurance,
    discountAmount,
    couponAmount,
    preGstTotal,
    gstAmount,
    membershipFee,
    payableTotal: Math.round((preGstTotal + gstAmount + membershipFee) * 100) / 100,
  };
}

/**
 * 将体重转换为千克
 * @param weightValue 体重值（字符串）
 * @param unit 体重单位 ("kg" 或 "lbs")
 * @returns 转换后的千克数，如果转换失败返回 null
 */
export function convertWeightToKg(weightValue: string, unit: string): number | null {
  if (!weightValue || !unit) return null;
  const weightNum = parseFloat(weightValue);
  if (isNaN(weightNum)) return null;
  
  if (unit === "lbs") {
    // Convert lbs to kg: 1 lb = 0.453592 kg
    return weightNum * 0.453592;
  } else if (unit === "kg") {
    return weightNum;
  }
  return null;
}

/**
 * 根据用户体重计算服务价格
 * 服务价格统一使用 base_price
 * 
 * @param service 服务对象
 * @param weight 用户填写的体重（字符串）
 * @param weightUnit 体重单位 ("kg" 或 "lbs")
 * @returns 计算后的服务价格
 */
export function getServicePrice(
  service: ServiceOut | undefined,
  weight?: string,
  weightUnit?: string
): number {
  if (!service) return 0;

  void weight;
  void weightUnit;

  return typeof service.base_price === "string"
    ? parseFloat(service.base_price)
    : service.base_price;
}

import type { ServiceOut } from "./api";

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








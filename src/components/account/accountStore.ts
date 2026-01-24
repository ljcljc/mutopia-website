import { create } from "zustand";
import { getAddresses, getMembershipPlans, getMyCoupons } from "@/lib/api";
import type { AddressOut, MembershipPlanOut, CouponOut } from "@/lib/api";

interface AccountState {
  // 地址列表（✅ 已实现接口）
  addresses: AddressOut[];
  isLoadingAddresses: boolean;
  
  // 会员套餐列表（✅ 已实现接口）
  membershipPlans: MembershipPlanOut[];
  isLoadingMembershipPlans: boolean;
  
  // 优惠券列表（✅ 已实现接口）
  coupons: CouponOut[];
  isLoadingCoupons: boolean;
  
  // 支付方式列表（❌ 仅 UI，使用模拟数据）
  paymentMethods: Array<{
    id: number;
    cardNumber: string; // 例如 "8383 **** **** 9288"
    cardType: string; // 例如 "VISA"
    isDefault: boolean;
  }>;
  
  // Actions（仅实现已存在接口）
  fetchAddresses: () => Promise<void>;
  fetchMembershipPlans: () => Promise<void>;
  fetchCoupons: () => Promise<void>;
  
  // 会员相关计算函数
  isCashCoupon: (coupon: CouponOut) => boolean;
  getMembershipExpiryDate: () => string | null;
  getRemainingCashCouponsCount: () => number;
  getCashCouponAmount: () => number | null;
  
  // 推荐码复制功能（✅ 使用 authStore.userInfo.invite_code）
  copyReferralCode: (code: string) => Promise<boolean>;
  
  // 占位 Actions（❌ 仅 UI，不实现逻辑）
  showComingSoonMessage: (feature: string) => void;
}

export const useAccountStore = create<AccountState>((set, get: () => AccountState) => ({
  addresses: [],
  isLoadingAddresses: false,
  membershipPlans: [],
  isLoadingMembershipPlans: false,
  coupons: [],
  isLoadingCoupons: false,
  paymentMethods: [
    {
      id: 1,
      cardNumber: "8383 **** **** 9288",
      cardType: "VISA",
      isDefault: true,
    },
    {
      id: 2,
      cardNumber: "4532 **** **** 5678",
      cardType: "MASTERCARD",
      isDefault: false,
    },
    {
      id: 3,
      cardNumber: "6011 **** **** 9012",
      cardType: "AMEX",
      isDefault: false,
    },
  ],
  
  fetchAddresses: async () => {
    set({ isLoadingAddresses: true });
    try {
      const response = await getAddresses();
      const addresses = response.items;
      set({ addresses, isLoadingAddresses: false });
    } catch (error) {
      console.error("Failed to load addresses:", error);
      set({ addresses: [], isLoadingAddresses: false });
    }
  },
  
  fetchMembershipPlans: async () => {
    set({ isLoadingMembershipPlans: true });
    try {
      const plans = await getMembershipPlans();
      set({ membershipPlans: plans, isLoadingMembershipPlans: false });
    } catch (error) {
      console.error("Failed to load membership plans:", error);
      set({ membershipPlans: [], isLoadingMembershipPlans: false });
    }
  },
  
  fetchCoupons: async () => {
    set({ isLoadingCoupons: true });
    try {
      const response = await getMyCoupons();
      const coupons = response.items;
      set({ coupons, isLoadingCoupons: false });
    } catch (error) {
      console.error("Failed to load coupons:", error);
      set({ coupons: [], isLoadingCoupons: false });
    }
  },
  
  // 判断是否为 cash coupon
  isCashCoupon: (coupon: CouponOut) => {
    return (
      coupon.category === "cash" ||
      coupon.type === "cash" ||
      coupon.type === "membership" ||
      coupon.type === "membership_gift"
    );
  },
  
  // 获取会员过期日期（从 cash coupons 中获取最晚的 expires_at）
  getMembershipExpiryDate: (): string | null => {
    const state = get();
    // Ensure coupons is an array
    if (!Array.isArray(state.coupons)) {
      return null;
    }
    const cashCoupons: CouponOut[] = state.coupons.filter((coupon: CouponOut) => {
      return (
        state.isCashCoupon(coupon) &&
        coupon.status === "active" &&
        coupon.expires_at
      );
    });
    
    if (cashCoupons.length === 0) return null;
    
    // 找出最晚的过期日期
    const latestExpiry: Date | null = cashCoupons.reduce((latest: Date | null, coupon: CouponOut) => {
      if (!coupon.expires_at) return latest;
      const expiryDate = new Date(coupon.expires_at);
      return !latest || expiryDate > latest ? expiryDate : latest;
    }, null);
    
    if (!latestExpiry) return null;
    
    // 格式化为 YYYY-MM-DD
    return latestExpiry.toISOString().split("T")[0];
  },
  
  // 获取剩余优惠券数量
  getRemainingCashCouponsCount: (): number => {
    const state = get();
    // Ensure coupons is an array
    if (!Array.isArray(state.coupons)) {
      return 0;
    }
    return state.coupons.filter((coupon: CouponOut) => {
      return (
        state.isCashCoupon(coupon) &&
        coupon.status === "active"
      );
    }).length;
  },
  
  // 获取 cash coupon 的金额（验证所有金额是否一致）
  getCashCouponAmount: (): number | null => {
    const state = get();
    // Ensure coupons is an array
    if (!Array.isArray(state.coupons)) {
      return null;
    }
    const activeCashCoupons: CouponOut[] = state.coupons.filter((coupon: CouponOut) => {
      return (
        state.isCashCoupon(coupon) &&
        coupon.status === "active"
      );
    });
    
    if (activeCashCoupons.length === 0) return null;
    
    // 获取所有金额并验证是否一致
    const amounts: number[] = activeCashCoupons.map((coupon: CouponOut) => {
      const amount = typeof coupon.amount === "string" 
        ? parseFloat(coupon.amount) 
        : coupon.amount;
      return amount;
    });
    
    // 检查所有金额是否一致
    const firstAmount: number = amounts[0];
    const allSame: boolean = amounts.every((amount: number) => amount === firstAmount);
    
    if (!allSame) {
      throw new Error(`Cash coupon amounts are inconsistent: ${amounts.join(", ")}`);
    }
    
    return firstAmount;
  },
  
  copyReferralCode: async (code: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (error) {
      console.error("Failed to copy referral code:", error);
      return false;
    }
  },
  
  showComingSoonMessage: (feature: string) => {
    // 显示提示信息（可以使用 toast 组件）
    console.log(`功能开发中: ${feature}`);
    // TODO: 集成 toast 组件显示提示
  },
}));

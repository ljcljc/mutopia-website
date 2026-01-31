import { create } from "zustand";
import {
  getAddresses,
  getMembershipPlans,
  getMyCoupons,
  getPets,
  getMyBookings,
  getMembershipInfo,
  getMemorializedPets,
} from "@/lib/api";
import type { AddressOut, MembershipPlanOut, CouponOut, PetOut, BookingListOut, MembershipInfoOut } from "@/lib/api";

interface AccountState {
  // 地址列表（✅ 已实现接口）
  addresses: AddressOut[];
  isLoadingAddresses: boolean;
  
  // 会员套餐列表（✅ 已实现接口）
  membershipPlans: MembershipPlanOut[];
  isLoadingMembershipPlans: boolean;
  
  // 会员信息（✅ 已实现接口）
  membershipInfo: MembershipInfoOut | null;
  isLoadingMembershipInfo: boolean;
  
  // 优惠券列表（✅ 已实现接口）
  coupons: CouponOut[];
  isLoadingCoupons: boolean;
  
  // Cash credit 优惠券列表（✅ 已实现接口）
  cashCoupons: CouponOut[];
  isLoadingCashCoupons: boolean;
  
  // Special offer 优惠券列表（✅ 已实现接口）
  specialCoupons: CouponOut[];
  isLoadingSpecialCoupons: boolean;
  
  // 宠物列表（✅ 已实现接口）
  pets: PetOut[];
  isLoadingPets: boolean;
  
  // 已纪念宠物列表（✅ 已实现接口）
  memorializedPets: PetOut[];
  isLoadingMemorializedPets: boolean;
  
  // 预约列表（✅ 已实现接口）
  upcomingBookings: BookingListOut[];
  historyBookings: BookingListOut[];
  isLoadingBookings: boolean;
  
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
  fetchMembershipInfo: () => Promise<void>;
  fetchCoupons: () => Promise<void>;
  fetchCashCoupons: () => Promise<void>;
  fetchSpecialCoupons: () => Promise<void>;
  fetchPets: () => Promise<void>;
  fetchMemorializedPets: () => Promise<void>;
  fetchUpcomingBookings: () => Promise<void>;
  fetchHistoryBookings: () => Promise<void>;
  
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
  membershipInfo: null,
  isLoadingMembershipInfo: false,
  coupons: [],
  isLoadingCoupons: false,
  cashCoupons: [],
  isLoadingCashCoupons: false,
  specialCoupons: [],
  isLoadingSpecialCoupons: false,
  pets: [],
  isLoadingPets: false,
  memorializedPets: [],
  isLoadingMemorializedPets: false,
  upcomingBookings: [],
  historyBookings: [],
  isLoadingBookings: false,
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
  
  /**
   * 获取会员信息
   * API: GET /api/promotions/membership/info
   */
  fetchMembershipInfo: async () => {
    set({ isLoadingMembershipInfo: true });
    try {
      const info = await getMembershipInfo();
      set({ membershipInfo: info, isLoadingMembershipInfo: false });
    } catch (error) {
      console.error("Failed to load membership info:", error);
      set({ membershipInfo: null, isLoadingMembershipInfo: false });
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
  
  /**
   * 获取 Cash credit 优惠券列表
   * API: GET /api/promotions/coupons?category=cash&page=1&page_size=50
   */
  fetchCashCoupons: async () => {
    set({ isLoadingCashCoupons: true });
    try {
      const response = await getMyCoupons({ category: "cash", page: 1, page_size: 50 });
      const coupons = response.items || [];
      set({ cashCoupons: coupons, isLoadingCashCoupons: false });
    } catch (error) {
      console.error("Failed to load cash coupons:", error);
      set({ cashCoupons: [], isLoadingCashCoupons: false });
    }
  },
  
  /**
   * 获取 Special offer 优惠券列表
   * API: GET /api/promotions/coupons?category=special&page=1&page_size=50
   */
  fetchSpecialCoupons: async () => {
    set({ isLoadingSpecialCoupons: true });
    try {
      const response = await getMyCoupons({ category: "special", page: 1, page_size: 50 });
      const coupons = response.items || [];
      set({ specialCoupons: coupons, isLoadingSpecialCoupons: false });
    } catch (error) {
      console.error("Failed to load special coupons:", error);
      set({ specialCoupons: [], isLoadingSpecialCoupons: false });
    }
  },
  
  fetchPets: async () => {
    set({ isLoadingPets: true });
    try {
      const response = await getPets({ page: 1, page_size: 50 });
      const pets = response.items;
      set({ pets, isLoadingPets: false });
    } catch (error) {
      console.error("Failed to load pets:", error);
      set({ pets: [], isLoadingPets: false });
    }
  },
  
  fetchMemorializedPets: async () => {
    set({ isLoadingMemorializedPets: true });
    try {
      const response = await getMemorializedPets({ page: 1, page_size: 50 });
      const memorializedPets = response.items;
      set({ memorializedPets, isLoadingMemorializedPets: false });
    } catch (error) {
      console.error("Failed to load memorialized pets:", error);
      set({ memorializedPets: [], isLoadingMemorializedPets: false });
    }
  },
  
  /**
   * 获取 upcoming 预约列表
   * API: GET /api/bookings?group=upcoming&page=1&page_size=50
   * 
   * upcoming 包含除 history 以外的所有状态（即非 canceled/completed/refunded 的预约）
   */
  fetchUpcomingBookings: async () => {
    set({ isLoadingBookings: true });
    try {
      const response = await getMyBookings({ group: "upcoming", page: 1, page_size: 50 });
      const bookings = response.items || [];
      console.log("[fetchUpcomingBookings] Loaded", bookings.length, "upcoming bookings:", bookings);
      set({ upcomingBookings: bookings, isLoadingBookings: false });
    } catch (error) {
      console.error("Failed to load upcoming bookings:", error);
      set({ upcomingBookings: [], isLoadingBookings: false });
    }
  },
  
  /**
   * 获取 history 预约列表
   * API: GET /api/bookings?group=history&page=1&page_size=50
   * 
   * history 包含以下状态的预约：canceled/completed/refunded
   */
  fetchHistoryBookings: async () => {
    set({ isLoadingBookings: true });
    try {
      const response = await getMyBookings({ group: "history", page: 1, page_size: 50 });
      const bookings = response.items;
      set({ historyBookings: bookings, isLoadingBookings: false });
    } catch (error) {
      console.error("Failed to load history bookings:", error);
      set({ historyBookings: [], isLoadingBookings: false });
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

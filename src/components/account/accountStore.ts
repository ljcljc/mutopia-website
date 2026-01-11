import { create } from "zustand";
import { getAddresses, getMembershipPlans } from "@/lib/api";
import type { AddressOut, MembershipPlanOut } from "@/lib/api";

interface AccountState {
  // 地址列表（✅ 已实现接口）
  addresses: AddressOut[];
  isLoadingAddresses: boolean;
  
  // 会员套餐列表（✅ 已实现接口）
  membershipPlans: MembershipPlanOut[];
  isLoadingMembershipPlans: boolean;
  
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
  
  // 推荐码复制功能（✅ 使用 authStore.userInfo.invite_code）
  copyReferralCode: (code: string) => Promise<boolean>;
  
  // 占位 Actions（❌ 仅 UI，不实现逻辑）
  showComingSoonMessage: (feature: string) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  addresses: [],
  isLoadingAddresses: false,
  membershipPlans: [],
  isLoadingMembershipPlans: false,
  paymentMethods: [
    {
      id: 1,
      cardNumber: "8383 **** **** 9288",
      cardType: "VISA",
      isDefault: true,
    },
  ],
  
  fetchAddresses: async () => {
    set({ isLoadingAddresses: true });
    try {
      const addresses = await getAddresses();
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

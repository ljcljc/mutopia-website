/**
 * MembershipCard 组件 - 会员卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * 未购买状态: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1558-20411&m=dev
 * 已购买状态: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1594-15731&m=dev
 */

import { useEffect } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { PurpleButton } from "@/components/common";
import { useNavigate } from "react-router-dom";

export default function MembershipCard() {
  const isMember = useAuthStore((state) => state.userInfo?.is_member || false);
  const {
    membershipPlans,
    isLoadingMembershipPlans,
    coupons,
    isLoadingCoupons,
    fetchCoupons,
    getMembershipExpiryDate,
    getRemainingCashCouponsCount,
    getCashCouponAmount,
  } = useAccountStore();
  const navigate = useNavigate();

  // 如果已购买会员，获取优惠券数据
  useEffect(() => {
    if (isMember && coupons.length === 0 && !isLoadingCoupons) {
      fetchCoupons();
    }
  }, [isMember, coupons.length, isLoadingCoupons, fetchCoupons]);

  // 获取第一个会员套餐的权益列表（或使用默认权益）
  const benefits = membershipPlans[0]?.benefits || [
    { content: "30$ instant cash coupons", is_highlight: true, display_order: 1 },
    { content: "10% off additional services", is_highlight: false, display_order: 2 },
    { content: "Priority booking within 3 days", is_highlight: false, display_order: 3 },
    { content: "Free teeth brushing", is_highlight: false, display_order: 4 },
    { content: "Free anal gland expression", is_highlight: false, display_order: 5 },
    { content: "Grooming photo updates", is_highlight: false, display_order: 6 },
  ];

  const handleGoPremium = () => {
    navigate("/booking?membership=true");
  };

  const handleRenewMembership = () => {
    navigate("/booking?membership=true");
  };

  // 已购买状态：计算会员数据
  let expiryDate: string | null = null;
  let remainingCount = 0;
  let couponAmount: number | null = null;

  if (isMember) {
    try {
      expiryDate = getMembershipExpiryDate();
      remainingCount = getRemainingCashCouponsCount();
      couponAmount = getCashCouponAmount();
    } catch (error) {
      console.error("Failed to calculate membership data:", error);
    }
  }

  // 已购买状态 UI
  if (isMember) {
    // 构建权益列表：第一个显示剩余优惠券数量，其他显示正常权益
    const displayBenefits = [...benefits];
    
    // 如果有剩余优惠券，替换第一个权益
    if (remainingCount > 0 && couponAmount !== null) {
      displayBenefits[0] = {
        content: `${remainingCount} x ${couponAmount}$ cash coupons left`,
        is_highlight: true,
        display_order: 1,
      };
    }

    return (
      <div className="bg-white rounded-[12px] border-2 border-[#6D28D9] p-5 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)]">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="logo" className="w-6 h-6 text-[#6D28D9] shrink-0" />
            <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
              Membership
            </h2>
          </div>
          {expiryDate && (
            <div className="flex justify-center">
              <span className="bg-[#DE6A07] text-white px-3 py-1 rounded-full text-xs font-['Comfortaa',sans-serif] font-medium">
                Until {expiryDate}
              </span>
            </div>
          )}
        </div>

        {/* Benefits List */}
        {isLoadingMembershipPlans || isLoadingCoupons ? (
          <div className="text-[#4A3C2A] text-sm py-4">Loading membership benefits...</div>
        ) : (
          <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full mb-6">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
              {displayBenefits.map((benefit: { content: string; is_highlight: boolean; display_order: number }, index: number) => (
                <div
                  key={index}
                  className="content-stretch flex items-start relative shrink-0"
                >
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex flex-col items-start justify-center relative">
                      <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                        <div className="relative shrink-0 size-[16.8px]">
                          <Icon name="check-green" className="block size-full text-[#00A63E]" />
                        </div>
                        <p
                          className={`font-['Comfortaa:Bold',sans-serif] font-bold leading-[17.5px] relative shrink-0 text-[12.25px] whitespace-nowrap ${
                            benefit.is_highlight
                              ? "text-[#de6a07]"
                              : "text-[#364153]"
                          }`}
                        >
                          {benefit.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Renew Membership Button */}
        <div className="w-full pt-[8px]">
          <PurpleButton size="medium" fullWidth onClick={handleRenewMembership}>
            <div className="flex gap-[4px] items-center">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
                Renew Membership
              </p>
              <Icon name="button-arrow" size={14} className="text-white" />
            </div>
          </PurpleButton>
        </div>
      </div>
    );
  }

  // 未购买状态 UI（也作为加载占位）
  return (
    <div className="bg-white rounded-[12px] border-2 border-[#6D28D9] p-5 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="logo" className="w-6 h-6 text-[#6D28D9] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
            Membership
          </h2>
        </div>
        <span className="bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-xs font-['Comfortaa',sans-serif] font-medium">
          Save up to 100%
        </span>
      </div>

      {/* Benefits List */}
      {isLoadingMembershipPlans ? (
        <div className="text-[#4A3C2A] text-sm py-4">Loading membership benefits...</div>
      ) : (
        <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full mb-6">
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
            {benefits.map((benefit: { content: string; is_highlight: boolean; display_order: number }, index: number) => (
              <div
                key={index}
                className="content-stretch flex items-start relative shrink-0"
              >
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex flex-col items-start justify-center relative">
                    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                      <div className="relative shrink-0 size-[16.8px]">
                        <Icon name="check-green" className="block size-full text-[#00A63E]" />
                      </div>
                      <p
                        className={`font-['Comfortaa:Bold',sans-serif] font-bold leading-[17.5px] relative shrink-0 text-[12.25px] whitespace-nowrap ${
                          benefit.is_highlight
                            ? "text-[#de6a07]"
                            : "text-[#364153]"
                        }`}
                      >
                        {benefit.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Go Premium Button */}
      <div className="w-full pt-[8px]">
        <PurpleButton size="medium" fullWidth onClick={handleGoPremium}>
          <div className="flex gap-[4px] items-center">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
              Go premium
            </p>
            <Icon name="button-arrow" size={14} className="text-white" />
          </div>
        </PurpleButton>
      </div>
    </div>
  );
}

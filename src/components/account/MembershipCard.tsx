/**
 * MembershipCard 组件 - 会员卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * 未购买状态: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1558-20411&m=dev
 * 已购买状态: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1594-15731&m=dev
 */

import { useEffect, useRef, useState } from "react";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { PurpleButton } from "@/components/common";
import { createMembershipCheckout } from "@/lib/api";
import { toast } from "sonner";

export default function MembershipCard() {
  const {
    membershipPlans,
    isLoadingMembershipPlans,
    membershipInfo,
    isLoadingMembershipInfo,
    fetchMembershipInfo,
  } = useAccountStore();
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const hasFetchedInfoRef = useRef(false);

  // 拉取 /api/promotions/membership/info，用于展示会员信息（是否会员、到期日、剩余优惠券等）
  useEffect(() => {
    if (hasFetchedInfoRef.current) return;
    hasFetchedInfoRef.current = true;
    fetchMembershipInfo();
  }, [fetchMembershipInfo]);

  // 获取第一个会员套餐的权益列表（或使用默认权益）
  const benefits = membershipPlans[0]?.benefits || [
    { content: "30$ instant cash coupons", is_highlight: true, display_order: 1 },
    { content: "10% off additional services", is_highlight: false, display_order: 2 },
    { content: "Priority booking within 3 days", is_highlight: false, display_order: 3 },
    { content: "Free teeth brushing", is_highlight: false, display_order: 4 },
    { content: "Free anal gland expression", is_highlight: false, display_order: 5 },
    { content: "Grooming photo updates", is_highlight: false, display_order: 6 },
  ];

  /**
   * 处理购买/续费会员
   * 调用 API 创建 Stripe Checkout 会话并跳转
   */
  const handleMembershipCheckout = async () => {
    // 防止重复点击
    if (isProcessingCheckout) return;

    // 检查是否有可用的会员套餐
    if (!membershipPlans || membershipPlans.length === 0) {
      toast.error("No membership plans available. Please try again later.");
      return;
    }

    // 获取第一个会员套餐（通常只有一个）
    const selectedPlan = membershipPlans[0];
    if (!selectedPlan || !selectedPlan.id) {
      toast.error("Invalid membership plan. Please try again.");
      return;
    }

    try {
      setIsProcessingCheckout(true);
      
      // 调用 API 创建会员套餐结账会话
      const checkoutSession = await createMembershipCheckout({
        plan_id: selectedPlan.id,
      });

      console.log("Membership checkout session created:", checkoutSession);

      // 显示成功提示
      toast.success("Redirecting to payment...");

      // 跳转到 Stripe Checkout 页面
      // Stripe 会处理支付并在完成后重定向回成功页面
      window.location.href = checkoutSession.url;
    } catch (error) {
      console.error("Failed to create membership checkout:", error);
      
      // 处理错误信息
      let errorMessage = "Failed to process membership checkout. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === "object" && error !== null && "message" in error) {
        errorMessage = String(error.message) || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  const handleGoPremium = () => {
    handleMembershipCheckout();
  };

  const handleRenewMembership = () => {
    handleMembershipCheckout();
  };

  // 会员展示数据全部来自 /api/promotions/membership/info
  const isMember = membershipInfo?.is_member ?? false;
  const expiryDate: string | null = membershipInfo?.end_at
    ? new Date(membershipInfo.end_at).toISOString().split("T")[0]
    : null;
  const remainingCount = membershipInfo?.gift_coupons_remaining ?? 0;
  // 金额用当前会员套餐的 coupon_amount（与 membership/info 的 plan 一致）
  const firstPlan = membershipPlans[0];
  const couponAmount: number | null =
    firstPlan != null
      ? typeof firstPlan.coupon_amount === "string"
        ? parseFloat(firstPlan.coupon_amount)
        : firstPlan.coupon_amount
      : null;
  const displayAmount = Number.isFinite(couponAmount) ? couponAmount : null;

  // 已购买状态 UI（以 membership/info 的 is_member 为准）
  if (isMember) {
    // 构建权益列表：第一个显示剩余优惠券数量，其他显示正常权益
    const displayBenefits = [...benefits];
    
    // 如果有剩余优惠券，替换第一个权益（数量与金额均来自 membership/info 及套餐）
    if (remainingCount > 0 && displayAmount !== null) {
      displayBenefits[0] = {
        content: `${remainingCount} x ${displayAmount}$ cash coupons left`,
        is_highlight: true,
        display_order: 1,
      };
    } else if (remainingCount > 0) {
      displayBenefits[0] = {
        content: `${remainingCount} gift coupons left`,
        is_highlight: true,
        display_order: 1,
      };
    }

    return (
      <div className="bg-white rounded-[12px] border-2 border-[#754387] sm:border-[#6D28D9] p-[22px] sm:p-5 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)]">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="logo" className="w-6 h-6 text-[#6D28D9] shrink-0" />
            <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-[15.75px] sm:text-lg">
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
        {isLoadingMembershipPlans || isLoadingMembershipInfo ? (
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
          <PurpleButton 
            size="medium" 
            fullWidth 
            onClick={handleRenewMembership}
            disabled={isProcessingCheckout || isLoadingMembershipPlans}
          >
            <div className="flex gap-[4px] items-center">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
                {isProcessingCheckout ? "Processing..." : "Renew Membership"}
              </p>
              {!isProcessingCheckout && (
                <Icon name="button-arrow" size={14} className="text-white" />
              )}
            </div>
          </PurpleButton>
        </div>
      </div>
    );
  }

  // 未购买状态 UI（也作为加载占位）
  return (
      <div className="bg-white rounded-[12px] border-2 border-[#754387] sm:border-[#6D28D9] p-[22px] sm:p-5 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)]">
      {/* Header */}
      <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="logo" className="w-6 h-6 text-[#6D28D9] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-[15.75px] sm:text-lg">
            Membership
          </h2>
        </div>
        <div className="flex justify-center sm:justify-end">
          <span className="bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-[10px] sm:text-xs font-['Comfortaa',sans-serif] font-medium">
            Save up to 100%
          </span>
        </div>
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
        <PurpleButton 
          size="medium" 
          fullWidth 
          onClick={handleGoPremium}
          disabled={isProcessingCheckout || isLoadingMembershipPlans}
        >
          <div className="flex gap-[4px] items-center">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
              {isProcessingCheckout ? "Processing..." : "Go premium"}
            </p>
            {!isProcessingCheckout && (
              <Icon name="button-arrow" size={14} className="text-white" />
            )}
          </div>
        </PurpleButton>
      </div>
    </div>
  );
}

/**
 * MembershipCard 组件 - 会员卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1558-20411&m=dev
 */

import { useAuthStore } from "@/components/auth/authStore";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import { useNavigate } from "react-router-dom";

export default function MembershipCard() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const { membershipPlans, isLoadingMembershipPlans } = useAccountStore();
  const navigate = useNavigate();

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
    // TODO: 跳转到会员订阅页面，路由待确认
    navigate("/booking?membership=true");
  };

  return (
    <div className="bg-white rounded-lg border-2 border-[#6D28D9] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* 使用 premium-quality 图标作为会员图标 */}
          <Icon name="premium-quality" className="w-5 h-5 text-[#6D28D9] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
            Membership
          </h2>
        </div>
        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-['Comfortaa',sans-serif] font-medium">
          Save up to 100%
        </span>
      </div>

      {/* Benefits List */}
      {isLoadingMembershipPlans ? (
        <div className="text-[#4A3C2A] text-sm py-4">Loading membership benefits...</div>
      ) : (
        <ul className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <Icon
                name="check-green"
                className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
              />
              <span
                className={cn(
                  "font-['Comfortaa',sans-serif] font-normal text-sm",
                  benefit.is_highlight
                    ? "text-[#F97316]"
                    : "text-[#4A3C2A]"
                )}
              >
                {benefit.content}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Go Premium Button */}
      <button
        onClick={handleGoPremium}
        className="w-full bg-[#6D28D9] text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 hover:bg-[#6D28D9]/90 transition-colors"
      >
        <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
          Go premium
        </span>
        <Icon name="button-arrow" className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

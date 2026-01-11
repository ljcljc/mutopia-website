/**
 * ShareAndEarnCard 组件 - 分享赚取卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1558-20389&m=dev
 */

import { useState } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";

export default function ShareAndEarnCard() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const { copyReferralCode } = useAccountStore();
  const [copied, setCopied] = useState(false);

  const referralCode = userInfo?.invite_code || "";

  const handleCopy = async () => {
    if (!referralCode) return;
    
    const success = await copyReferralCode(referralCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 如果 userInfo 还未加载，显示加载状态
  if (!userInfo) {
    return (
      <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-7">
        <div className="text-[#4A3C2A] text-sm">Loading...</div>
      </div>
    );
  }

  // 如果没有推荐码，仍然显示卡片但显示提示信息
  if (!referralCode) {
    return (
      <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-7">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-medium text-base text-[#4A3C2A]">
            Share & Earn
          </h2>
        </div>

        {/* Description */}
        <div className="p-7 space-y-6">
          <p className="font-['Comfortaa',sans-serif] font-normal text-sm text-[#4A5565]">
            Invite a friend to book our service and you'll both get{" "}
            <span className="font-bold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
          </p>
          <p className="font-['Comfortaa',sans-serif] font-normal text-sm text-[#4A5565]">
            Your referral code will be available soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-7 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-6 h-6 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-medium text-base text-[#4A3C2A]">
            Share & Earn
          </h2>
        </div>

        {/* Description */}
        <div className="p-7 space-y-6">
          <p className="font-['Comfortaa',sans-serif] font-normal text-sm text-[#4A5565]">
            Invite a friend to book our service and you'll both get{" "}
            <span className="font-bold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
          </p>
          <p className="font-['Comfortaa',sans-serif] font-normal text-sm text-[#4A5565]">
            Copy your unique code below to your friend and enjoy the credit in 3 months.
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-[12px] border border-[#4A3C2A] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <span className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-base">
            {referralCode}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "font-['Comfortaa',sans-serif] font-medium text-sm transition-colors cursor-pointer",
            copied
              ? "text-green-500"
              : "text-[#DE6A07] hover:text-[#DE6A07]/80"
          )}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

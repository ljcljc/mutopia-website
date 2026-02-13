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
      <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-7 sm:p-[22px]">
        <div className="text-[#4A3C2A] text-sm">Loading...</div>
      </div>
    );
  }

  // 如果没有推荐码，仍然显示卡片但显示提示信息
  if (!referralCode) {
    return (
      <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-[20px] sm:p-[22px] flex flex-col gap-[28px]">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-medium text-[15.75px] sm:text-base text-[#4A3C2A]">
            Share & Earn
          </h2>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-6 text-left px-[27px] sm:pb-[27px]">
          <p className="font-['Comfortaa',sans-serif] font-normal text-[14px] sm:text-sm text-[#4A5565] leading-[22.75px]">
            Invite a friend to book our service and you'll both get{" "}
            <span className="font-bold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
          </p>
          <p className="font-['Comfortaa',sans-serif] font-normal text-[14px] sm:text-sm text-[#4A5565] leading-[22.75px]">
            Your referral code will be available soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] border-2 border-[#DE6A07] shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] p-[20px] sm:p-[22px] flex flex-col justify-between gap-[28px]">
      <div className="flex flex-col gap-[28px]">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-6 h-6 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-medium text-[15.75px] sm:text-base text-[#4A3C2A]">
            Share & Earn
          </h2>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-6 text-left px-[27px]">
          <p className="font-['Comfortaa',sans-serif] font-normal text-[14px] sm:text-sm text-[#4A5565] leading-[22.75px]">
            Invite a friend to book our service and you'll both get{" "}
            <span className="font-bold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
          </p>
          <p className="font-['Comfortaa',sans-serif] font-normal text-[14px] sm:text-sm text-[#4A5565] leading-[22.75px]">
            Copy your unique code below to your friend and enjoy the credit in 3 months.
          </p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-[12px] border border-[#8B6357] h-[38px] px-[11.5px] py-px flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <span className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-[12.25px] sm:text-base">
            {referralCode}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "font-['Comfortaa',sans-serif] font-medium text-[14px] sm:text-sm transition-colors cursor-pointer",
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

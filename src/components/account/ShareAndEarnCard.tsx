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
      <div className="bg-white rounded-lg border-2 border-[#DE6A07] p-6">
        <div className="text-[#4A3C2A] text-sm">Loading...</div>
      </div>
    );
  }

  // 如果没有推荐码，仍然显示卡片但显示提示信息
  if (!referralCode) {
    return (
      <div className="bg-white rounded-lg border-2 border-[#DE6A07] p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
            Share & Earn
          </h2>
        </div>

        {/* Description */}
        <div className="mb-6 space-y-2">
          <p className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
            Invite a friend to book our service and you'll both get{" "}
            <span className="font-semibold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
          </p>
          <p className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
            Your referral code will be available soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-[#DE6A07] p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Icon name="gift" className="w-5 h-5 text-[#DE6A07] shrink-0" />
        <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
          Share & Earn
        </h2>
      </div>

      {/* Description */}
      <div className="mb-6 space-y-2">
        <p className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
          Invite a friend to book our service and you'll both get{" "}
          <span className="font-semibold text-[#DE6A07]">$10.00 (2x$5.00) Credit</span>.
        </p>
        <p className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
          Copy your unique code below to your friend and enjoy the credit in 3 months.
        </p>
      </div>

      {/* Referral Code */}
      <div className="bg-white rounded-lg border border-[rgba(0,0,0,0.1)] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="gift" className="w-4 h-4 text-[#DE6A07] shrink-0" />
          <span className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-base">
            {referralCode}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            "font-['Comfortaa',sans-serif] font-medium text-sm px-4 py-2 rounded-lg transition-colors",
            copied
              ? "bg-green-500 text-white"
              : "bg-[#DE6A07] text-white hover:bg-[#DE6A07]/90"
          )}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

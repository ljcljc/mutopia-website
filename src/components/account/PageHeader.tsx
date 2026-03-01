/**
 * PageHeader 组件 - My Account 页面头部
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1417-11252&m=dev
 */

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { OrangeButton } from "@/components/common";
import { useAuthStore } from "@/components/auth/authStore";
import ApplyGroomerModal from "@/components/groomer/ApplyGroomerModal";

export default function PageHeader() {
  const { userInfo } = useAuthStore();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const handleApplyOpen = () => {
    console.log("[ApplyGroomer] open modal");
    setIsApplyOpen(true);
  };

  return (
    <>
      <div className="w-full flex items-center gap-4 mb-6">
        <h1 className="font-['Comfortaa',sans-serif] font-bold text-[#4A3C2A] text-[20px] sm:text-3xl">
          My Account
        </h1>
        <div className="ml-auto flex items-center">
          {userInfo?.is_groomer ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Switch
                id="groomer-account-toggle"
                checked={false}
                onCheckedChange={() => {}} // readonly: 阻止状态改变
                className="cursor-default pointer-events-none" // readonly: 防止交互但保持正常样式
                aria-label="Groomer account toggle"
                aria-readonly="true"
              />
              <Label
                htmlFor="groomer-account-toggle"
                className="font-['Comfortaa',sans-serif] font-bold text-[#8B6357] text-[14px] sm:text-sm cursor-default"
              >
                Groomer account
              </Label>
            </div>
          ) : (
            <OrangeButton
              variant="secondary"
              size="compact"
              showArrow={false}
              type="button"
              onClick={handleApplyOpen}
            >
              Apply as groomer
            </OrangeButton>
          )}
        </div>
      </div>
      <ApplyGroomerModal
        open={isApplyOpen}
        onOpenChange={(open) => {
          console.log("[ApplyGroomer] onOpenChange:", open);
          setIsApplyOpen(open);
        }}
      />
    </>
  );
}

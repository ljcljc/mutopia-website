/**
 * PageHeader 组件 - My Account 页面头部
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1417-11252&m=dev
 */

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function PageHeader() {
  return (
    <div className="w-full flex items-center justify-between mb-6">
      <h1 className="font-['Comfortaa',sans-serif] font-bold text-[#4A3C2A] text-[20px] sm:text-3xl">
        My Account
      </h1>
      
      {/* Groomer Account Toggle */}
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
    </div>
  );
}

/**
 * PaymentMethodCard 组件 - 支付方式管理卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2504-24843&m=dev
 */

import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { InfoEntryRow, SectionCard } from "@/components/account-center";

export default function PaymentMethodCard() {
  const { paymentMethods, showComingSoonMessage } = useAccountStore();

  const handleModify = () => {
    showComingSoonMessage("修改支付方式");
    // TODO: 显示 toast 提示 "功能开发中"
  };

  const handleDelete = () => {
    showComingSoonMessage("删除支付方式");
    // TODO: 显示 toast 提示 "功能开发中"
  };

  return (
    <SectionCard className="rounded-xl border border-[rgba(0,0,0,0.10)] p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:rounded-lg sm:p-6 sm:shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="location" className="h-4 w-4 shrink-0 text-[#DE6A07] sm:h-5 sm:w-5" />
          <h2 className="font-comfortaa text-[14px] font-semibold text-[#4A3C2A] sm:text-lg">
            Payment method
          </h2>
        </div>
        <button
          onClick={handleModify}
          className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07] cursor-pointer"
        >
          <span className="font-comfortaa text-[12px] font-medium sm:text-sm">
            Modify
          </span>
        </button>
      </div>

      {/* Payment Method List */}
      {paymentMethods.length === 0 ? (
        <div className="text-[#4A3C2A] text-sm py-4">
          No payment methods saved yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paymentMethods.map((method) => (
            <InfoEntryRow
              key={method.id}
              primaryText={method.cardNumber}
              secondaryText={method.cardType}
              badgeText={method.isDefault ? "Default" : undefined}
              onDelete={method.isDefault ? undefined : handleDelete}
              deleteAriaLabel="Delete payment method"
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

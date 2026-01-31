/**
 * PaymentMethodCard 组件 - 支付方式管理卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2504-24843&m=dev
 */

import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";

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
    <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="location" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
            Payment method
          </h2>
        </div>
        <button
          onClick={handleModify}
          className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07] cursor-pointer"
        >
          <Icon name="pencil" className="w-4 h-4" />
          <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
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
            <div
              key={method.id}
              className="bg-white rounded-lg border border-[rgba(0,0,0,0.1)] p-4 flex items-center"
            >
              <div className="flex items-start gap-5">
                <div className="flex flex-col gap-1">
                  <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
                    {method.cardNumber}
                  </span>
                  <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-sm">
                    {method.cardType}
                  </span>
                </div>
                {method.isDefault && (
                  <span className="bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-xs font-['Comfortaa',sans-serif] font-medium">
                    Default
                  </span>
                )}
              </div>
              {!method.isDefault && (
                <button
                  onClick={handleDelete}
                  className="ml-auto text-[#4C4C4C] hover:text-red-500 cursor-pointer"
                  aria-label="Delete payment method"
                >
                  <Icon name="trash" className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

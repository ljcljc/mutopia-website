/**
 * AddressesCard 组件 - 地址管理卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1417-11278&m=dev
 */

import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";

export default function AddressesCard() {
  const { addresses, isLoadingAddresses, showComingSoonMessage } = useAccountStore();

  const handleAdd = () => {
    showComingSoonMessage("添加地址");
    // TODO: 显示 toast 提示 "功能开发中"
  };

  const handleDelete = (id: number) => {
    showComingSoonMessage("删除地址");
    // TODO: 显示 toast 提示 "功能开发中"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.10)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="location" className="w-5 h-5 text-[#DE6A07] shrink-0" />
          <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
            Addresses
          </h2>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 text-[#DE6A07] hover:text-[#DE6A07]/80 cursor-pointer"
        >
          <Icon name="add" className="w-4 h-4" />
          <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
            Add
          </span>
        </button>
      </div>

      {/* Address List */}
      {isLoadingAddresses ? (
        <div className="text-[#4A3C2A] text-sm">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-[#4A3C2A] text-sm py-4">
          No addresses saved yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-white rounded-lg border border-[rgba(0,0,0,0.1)] p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
                  {address.address}
                </div>
                <div className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A]/70 text-sm mt-1">
                  {address.city}, {address.province} {address.postal_code}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {address.is_default && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-['Comfortaa',sans-serif] font-medium">
                    Default
                  </span>
                )}
                {!address.is_default && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-[#4A3C2A] hover:text-red-500 cursor-pointer"
                    aria-label="Delete address"
                  >
                    <Icon name="trash" className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

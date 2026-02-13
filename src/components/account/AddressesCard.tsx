/**
 * AddressesCard 组件 - 地址管理卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=1417-11278&m=dev
 */

import { useState } from "react";
import { toast } from "sonner";
import { useAccountStore } from "./accountStore";
import { Icon } from "@/components/common/Icon";
import AddAddressModal from "./AddAddressModal";
import { deleteAddress } from "@/lib/api";

export default function AddressesCard() {
  const { addresses, isLoadingAddresses, fetchAddresses } = useAccountStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    // 刷新地址列表
    fetchAddresses();
  };

  const handleDelete = async (id: number) => {
    if (deletingId === id) return;
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success("Address deleted successfully.");
      await fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[12px] sm:rounded-lg shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:shadow-sm p-[20px] sm:p-6 border border-[rgba(0,0,0,0.10)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-[16px] sm:mb-5">
          <div className="flex items-center gap-2">
            <Icon name="location" className="w-4 h-4 sm:w-5 sm:h-5 text-[#DE6A07] shrink-0" />
            <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-[14px] sm:text-lg">
              Addresses
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer"
          >
            <Icon name="add-2" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-['Comfortaa',sans-serif] font-medium text-[12px] sm:text-sm">
              <span className="sm:hidden">Add new</span>
              <span className="hidden sm:inline">Add</span>
            </span>
          </button>
        </div>

      {/* Address List */}
      {(() => {
        const hasAddresses = Array.isArray(addresses) && addresses.length > 0;
        if (isLoadingAddresses && !hasAddresses) {
          return <div className="text-[#4A3C2A] text-sm">Loading addresses...</div>;
        }
        if (!hasAddresses) {
          return (
            <div className="text-[#4A3C2A] text-sm py-4">
              No addresses saved yet.
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white rounded-[14px] sm:rounded-lg border border-[rgba(0,0,0,0.1)] p-[15px] sm:p-4 flex items-center"
              >
                <div className="flex items-start gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-[12.25px] sm:text-sm">
                      {address.address}
                    </span>
                    <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-[12.25px] sm:text-sm">
                      {address.city}, {address.province} {address.postal_code}
                    </span>
                  </div>
                  {address.is_default && (
                    <span className="bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-['Comfortaa',sans-serif] font-medium">
                      Default
                    </span>
                  )}
                </div>
                {!address.is_default && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="ml-auto text-[#4C4C4C] hover:text-red-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Delete address"
                    disabled={deletingId === address.id}
                  >
                    <Icon name="trash" className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      })()}
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}

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
import { InfoEntryRow, SectionCard } from "@/components/account-center";

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
      <SectionCard className="rounded-xl border border-[rgba(0,0,0,0.10)] p-5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:rounded-lg sm:p-6 sm:shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between sm:mb-5">
          <div className="flex items-center gap-2">
            <Icon name="location" className="h-4 w-4 shrink-0 text-[#DE6A07] sm:h-5 sm:w-5" />
            <h2 className="font-comfortaa text-[14px] font-semibold text-[#4A3C2A] sm:text-lg">
              Addresses
            </h2>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer"
          >
            <Icon name="add-2" className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-comfortaa text-[12px] font-medium sm:text-sm">
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
            <div className="py-4 text-sm text-[#4A3C2A]">
              No addresses saved yet.
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-3">
            {addresses.map((address) => (
              <InfoEntryRow
                key={address.id}
                primaryText={address.address}
                secondaryText={`${address.city}, ${address.province} ${address.postal_code}`}
                badgeText={address.is_default ? "Default" : undefined}
                onDelete={address.is_default ? undefined : () => handleDelete(address.id)}
                deleteDisabled={deletingId === address.id}
                deleteAriaLabel="Delete address"
              />
            ))}
          </div>
        );
      })()}
      </SectionCard>

      {/* Add Address Modal */}
      <AddAddressModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
      />
    </>
  );
}

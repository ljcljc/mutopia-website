import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { AddressOut } from "@/lib/api";

interface ModifyAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: AddressOut[];
  isLoading: boolean;
  selectedAddressId: number | null;
  onSelectAddress: (id: number) => void;
  onAddNew: () => void;
  onSave: () => void;
}

export default function ModifyAddressModal({
  open,
  onOpenChange,
  addresses,
  isLoading,
  selectedAddressId,
  onSelectAddress,
  onAddNew,
  onSave,
}: ModifyAddressModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[20px] px-0 py-0 max-w-[calc(100%-32px)] sm:max-w-[720px]">
        <div className="flex flex-col gap-[16px] pb-[32px] pt-[12px]">
          <AlertDialogHeader className="px-[12px]">
            <div className="relative flex items-center w-full mb-3">
              <AlertDialogPrimitive.Cancel asChild>
                <button
                  type="button"
                  className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-10 p-0 border-0 bg-transparent"
                >
                  <Icon name="close-arrow" className="w-5 h-5 text-[#717182]" />
                </button>
              </AlertDialogPrimitive.Cancel>
              <AlertDialogTitle className="absolute left-1/2 -translate-x-1/2 font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
                Modify address
              </AlertDialogTitle>
            </div>
            <div className="h-px bg-[rgba(0,0,0,0.1)] w-full" />
          </AlertDialogHeader>

          <div className="px-[24px] flex flex-col gap-[16px]">
            <div>
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Tell us your location
              </p>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                This helps us find a groomer near you.
              </p>
            </div>

            <div className="bg-[#EFF6FF] border border-[#BEDBFF] rounded-[8px] px-[16px] py-[8px] flex gap-[8px]">
              <Icon name="alert-info" className="text-[#2374FF] size-[12px]" />
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#193CB8]">
                We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onAddNew}
                className="flex items-center gap-[8px] text-[#8B6357] text-[12px] font-['Comfortaa:Bold',sans-serif] hover:text-[#DE6A07] transition-colors cursor-pointer"
              >
                <Icon name="add-2" size={16} />
                Add new
              </button>
            </div>

            <div className="flex flex-col gap-[8px]">
              {isLoading ? (
                <p className="text-[#8B6357] text-[12px]">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <p className="text-[#8B6357] text-[12px]">No addresses saved yet.</p>
              ) : (
                addresses.map((address) => {
                  const isSelected = address.id === selectedAddressId;
                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => onSelectAddress(address.id)}
                      className={`w-full flex items-center justify-between px-[16px] py-[10px] rounded-[14px] border border-[#E5E7EB] ${
                        isSelected
                          ? "bg-[#F4FFDE] ring-2 ring-[#6AA31C] ring-inset"
                          : "bg-white"
                      }`}
                    >
                      <div className="text-left flex flex-col gap-[4px]">
                        <div className="flex items-center gap-[8px]">
                          <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
                            {address.address}
                          </p>
                          {address.is_default ? (
                            <span className="bg-[#DCFCE7] border border-transparent px-[8px] py-[2px] rounded-[12px] text-[10.5px] text-[#008236] font-['Comfortaa:Medium',sans-serif]">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                          {address.city}, {address.province} {address.postal_code}
                        </p>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        {isSelected ? (
                          <span className="flex items-center justify-center size-[12px] rounded-[6px] bg-[#6AA31C]">
                            <Icon name="check" className="text-white" size={10} />
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <AlertDialogFooter className="px-[24px]">
            <div className="flex items-center justify-end gap-[10px] w-full">
              <AlertDialogPrimitive.Cancel asChild>
                <OrangeButton variant="outline" size="medium" className="w-[120px]">
                  Cancel
                </OrangeButton>
              </AlertDialogPrimitive.Cancel>
              <OrangeButton
                variant="primary"
                size="medium"
                className="w-[120px]"
                onClick={onSave}
              >
                Save
              </OrangeButton>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

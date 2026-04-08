import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
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
      <AlertDialogContent className="max-w-[calc(100%-32px)] rounded-[20px] px-0 py-0 sm:max-w-[720px]">
        <div className="flex flex-col gap-4 pb-8 pt-3">
          <AlertDialogHeader className="px-3">
            <div className="relative mb-3 flex w-full items-center">
              <AlertDialogPrimitive.Cancel asChild>
                <button
                  type="button"
                  className="z-10 cursor-pointer border-0 bg-transparent p-0 opacity-70 transition-opacity hover:opacity-100"
                >
                  <Icon name="close-arrow" className="w-5 h-5 text-[#717182]" />
                </button>
              </AlertDialogPrimitive.Cancel>
              <AlertDialogTitle className="absolute left-1/2 -translate-x-1/2 font-comfortaa font-semibold text-[#4A3C2A] text-lg">
                Modify address
              </AlertDialogTitle>
            </div>
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            <AlertDialogDescription className="sr-only">
              Select an existing address or add a new one, then save it for this booking.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 px-6">
            <div>
              <p className="font-comfortaa font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Tell us your location
              </p>
              <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                This helps us find a groomer near you.
              </p>
            </div>

            <div className="flex gap-2 rounded-lg border border-[#BEDBFF] bg-[#EFF6FF] px-4 py-2">
              <Icon name="alert-info" className="size-3 text-[#2374FF]" />
              <p className="font-comfortaa font-bold text-[12px] leading-[16px] text-[#193CB8]">
                We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={onAddNew}
                className="flex items-center gap-2 font-comfortaa text-[12px] text-[#8B6357] transition-colors hover:text-[#DE6A07] cursor-pointer"
              >
                <Icon name="add-2" size={16} />
                Add new
              </button>
            </div>

            <div className="flex flex-col gap-2">
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
                      className={`flex w-full items-center justify-between rounded-[14px] border border-[#E5E7EB] px-4 py-2.5 ${
                        isSelected
                          ? "bg-[#F4FFDE] ring-2 ring-[#6AA31C] ring-inset"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-comfortaa font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
                            {address.address}
                          </p>
                          {address.is_default ? (
                            <span className="rounded-xl border border-transparent bg-[#DCFCE7] px-2 py-0.5 font-comfortaa text-[10.5px] text-[#008236]">
                              Default
                            </span>
                          ) : null}
                        </div>
                        <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                          {address.city}, {address.province} {address.postal_code}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <span className="flex size-3 items-center justify-center rounded-md bg-[#6AA31C]">
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

          <AlertDialogFooter className="px-6">
            <div className="flex w-full items-center justify-end gap-2.5">
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

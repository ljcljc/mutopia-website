/**
 * AddAddressModal 组件 - 添加地址弹窗
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-20980&m=dev
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { CustomInput } from "@/components/common/CustomInput";
import { Checkbox } from "@/components/common/Checkbox";
import { createAddress, type AddressManageIn } from "@/lib/api";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAddressModalProps) {
  // 表单状态
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [serviceType, setServiceType] = useState<"mobile" | "in_store" | "in_home">("mobile");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  
  // 加载状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 重置表单
  useEffect(() => {
    if (open) {
      setAddress("");
      setCity("");
      setProvince("");
      setPostalCode("");
      setServiceType("mobile");
      setLabel("");
      setIsDefault(false);
    }
  }, [open]);

  const handleCancel = () => {
    onOpenChange(false);
    // 重置表单
    setAddress("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setServiceType("mobile");
    setLabel("");
    setIsDefault(false);
  };

  const handleSubmit = async () => {
    // 基本验证
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!province.trim()) {
      toast.error("Province is required");
      return;
    }
    if (!postalCode.trim()) {
      toast.error("Postal code is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备创建地址数据
      const addressData: AddressManageIn = {
        address: address.trim(),
        city: city.trim(),
        province: province.trim(),
        postal_code: postalCode.trim(),
        service_type: serviceType,
        is_default: isDefault,
        ...(label.trim() ? { label: label.trim() } : {}),
      };

      // 调用 API 创建地址
      await createAddress(addressData);
      
      toast.success("Address added successfully");
      
      // 调用成功回调
      onSuccess?.();
      
      // 关闭弹窗
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating address:", error);
      
      // 优先使用后端返回的错误信息
      const errorMessage = error instanceof HttpError 
        ? error.message 
        : error instanceof Error 
        ? error.message 
        : "Failed to add address. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] px-6 pt-3 pb-6 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] max-w-[400px] [&>button]:hidden">
        <DialogTitle className="sr-only">Add address</DialogTitle>
        <DialogDescription className="sr-only">
          Add a new address for your bookings
        </DialogDescription>

        {/* Header */}
        <div>
          <div className="relative flex items-center mb-3">
            {/* Close Button (左上角) */}
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <Icon name="close-arrow" className="w-5 h-5 text-[#717182]" />
            </button>
            
            {/* Title (居中) */}
            <h2 className="absolute left-1/2 -translate-x-1/2 font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
              Modify address
            </h2>
          </div>
          
          {/* Divider */}
          <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
        </div>

        {/* Content Header - 文字说明 */}
        <div className="flex flex-col">
          <h3 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-base">
            Tell us your location
          </h3>
          <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#717182] text-sm">
            This helps us find a groomer near you.
          </p>
        </div>

        {/* Alert - 服务范围提示 - 与 booking step1 保持一致 */}
        <div className="bg-[#eff6ff] border border-[#bedbff] border-solid relative rounded-[8px]">
          <div className="box-border content-stretch flex items-center overflow-clip px-[16px] py-[8px] relative rounded-[inherit]">
            <div className="content-stretch flex gap-[8px] items-start relative w-full min-w-0">
              {/* Info Icon */}
              <div className="relative shrink-0 size-[12px]">
                <Icon
                  name="alert-info"
                  aria-label="Info"
                  className="block size-full text-[#2374FF]"
                />
              </div>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative text-[#193cb8] text-[10px] whitespace-normal break-words min-w-0">
                We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Address - 与 booking step1 保持一致，带 location icon */}
          <div className="w-full sm:w-[320px]">
            <CustomInput
              label="Address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rightElement={
                <div
                  className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity ml-2"
                  title="Use current location"
                >
                  <Icon
                    name="location"
                    aria-label="Use current location"
                    className="block size-full text-[#de6a07]"
                  />
                </div>
              }
            />
          </div>

          {/* City and Province - 并排显示，与 booking step1 保持一致 */}
          <div className="content-stretch flex flex-col sm:flex-row gap-[12px] sm:gap-[20px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full sm:w-[192px]">
              <CustomInput
                label="City"
                type="text"
                placeholder="Autofilled"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                containerClassName="bg-[#e5e7eb] sm:bg-white"
                borderClassName="border-[#e5e7eb] sm:border-gray-200"
                inputClassName="text-[#717182] sm:text-[#4a3c2a]"
              />
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full sm:w-[95px]">
              <CustomInput
                label="Province"
                type="text"
                placeholder="Autofilled"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                containerClassName="bg-[#e5e7eb] sm:bg-white"
                borderClassName="border-[#e5e7eb] sm:border-gray-200"
                inputClassName="text-[#717182] sm:text-[#4a3c2a]"
              />
            </div>
          </div>

          {/* Post Code - 单独一行，与 booking step1 保持一致 */}
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full sm:w-[192px]">
              <CustomInput
                label="Post code"
                type="text"
                placeholder="Autofilled"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                containerClassName="bg-[#e5e7eb] sm:bg-white"
                borderClassName="border-[#e5e7eb] sm:border-gray-200"
                inputClassName="text-[#717182] sm:text-[#4a3c2a]"
              />
            </div>
          </div>

          {/* Set as default */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isDefault}
              onCheckedChange={setIsDefault}
              id="set-as-default"
            />
            <label
              htmlFor="set-as-default"
              className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a3c2a] text-[14px] cursor-pointer"
            >
              Set as default
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[10px] mt-6">
          <OrangeButton
            variant="outline"
            size="medium"
            className="w-[120px]"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </OrangeButton>
          <OrangeButton
            variant="primary"
            size="medium"
            className="w-[120px]"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Save
          </OrangeButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ModifyPersonalInfoModal 组件 - 修改个人信息弹窗
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-25488&m=dev
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Icon } from "@/components/common/Icon";
import { DatePicker } from "@/components/common/DatePicker";
import { CustomInput } from "@/components/common/CustomInput";
import { Spinner } from "@/components/common/Spinner";
import { useAuthStore } from "@/components/auth/authStore";
import { updateUserInfo, type MeOut } from "@/lib/api";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

interface ModifyPersonalInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userInfo: MeOut | null;
  onSuccess?: () => void;
}

/**
 * 检查生日是否在1年内被修改过
 * 使用 birthday_updated_at 字段判断
 */
function isBirthdayModifiedWithin1Year(userInfo: MeOut | null): {
  isModified: boolean;
  modifiedDate?: string;
  formattedDate?: string;
} {
  if (!userInfo?.birthday_updated_at) {
    return { isModified: false };
  }

  const modifiedDate = new Date(userInfo.birthday_updated_at);
  const now = new Date();
  
  // 计算时间差（毫秒）
  const diffMs = now.getTime() - modifiedDate.getTime();
  // 转换为年（365.25 天/年，考虑闰年）
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  
  // 如果在1年内
  if (diffYears < 1) {
    // 格式化日期：YYYY-MM-DD
    const formattedDate = modifiedDate.toISOString().split("T")[0];
    
    return {
      isModified: true,
      modifiedDate: formattedDate,
      formattedDate: formattedDate, // 使用 yyyy-mm-dd 格式
    };
  }
  
  return { isModified: false };
}

export default function ModifyPersonalInfoModal({
  open,
  onOpenChange,
  userInfo,
  onSuccess,
}: ModifyPersonalInfoModalProps) {
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  
  // 表单状态
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [originalBirthday, setOriginalBirthday] = useState("");
  
  // 生日修改提示状态
  const [showBirthdayWarning, setShowBirthdayWarning] = useState(false);
  const [isBirthdayModified, setIsBirthdayModified] = useState(false);
  const [birthdayModifiedDate, setBirthdayModifiedDate] = useState<string | undefined>();
  
  // 加载状态
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (open && userInfo) {
      setFirstName(userInfo.first_name || "");
      setLastName(userInfo.last_name || "");
      setBirthday(userInfo.birthday || "");
      setOriginalBirthday(userInfo.birthday || "");
      setPhone(userInfo.phone || "");
      
      // 检查生日是否在1年内被修改过
      const birthdayStatus = isBirthdayModifiedWithin1Year(userInfo);
      setIsBirthdayModified(birthdayStatus.isModified);
      setBirthdayModifiedDate(birthdayStatus.formattedDate);
      setShowBirthdayWarning(false);
    }
  }, [open, userInfo]);

  // 监听生日变化，显示提示
  useEffect(() => {
    if (birthday && birthday !== originalBirthday && originalBirthday) {
      setShowBirthdayWarning(true);
    } else {
      setShowBirthdayWarning(false);
    }
  }, [birthday, originalBirthday]);

  const handleCancel = () => {
    onOpenChange(false);
    // 重置表单
    if (userInfo) {
      setFirstName(userInfo.first_name || "");
      setLastName(userInfo.last_name || "");
      setBirthday(userInfo.birthday || "");
      setPhone(userInfo.phone || "");
      setShowBirthdayWarning(false);
    }
  };

  const handleSubmit = async () => {
    if (!userInfo) return;

    // 基本验证
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!birthday) {
      toast.error("Date of birth is required");
      return;
    }

    // 验证年龄（至少18岁）
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      toast.error("You must be at least 18 years old");
      return;
    }

    setIsSubmitting(true);

    try {
      // 准备更新数据
      const updateData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birthday: birthday,
        // phone 字段：如果用户输入了电话号码，则包含在更新数据中
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      };

      // 调用 API 更新用户信息
      const updatedUserInfo = await updateUserInfo(updateData);
      
      // 更新本地状态
      setUserInfo(updatedUserInfo);
      toast.success("Personal information updated successfully");
      
      // 调用成功回调
      onSuccess?.();
      
      // 关闭弹窗
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating personal information:", error);
      
      // 优先使用后端返回的错误信息
      const errorMessage = error instanceof HttpError 
        ? error.message 
        : error instanceof Error 
        ? error.message 
        : "Failed to update personal information. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userInfo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] px-6 pt-3 pb-6 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] max-w-[calc(100%-32px)] sm:max-w-[400px] [&>button]:hidden">
        <DialogTitle className="sr-only">Modify personal information</DialogTitle>
        <DialogDescription className="sr-only">
          Update your personal information including name, birthday, and phone number
        </DialogDescription>

        {/* Header */}
        <div className="mb-6">
          <div className="relative flex items-center mb-3">
            {/* Close Button (左上角) */}
            <button
              onClick={handleCancel}
              className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-10"
              aria-label="Close"
            >
              <Icon name="close-arrow" className="w-5 h-5 text-[#717182]" />
            </button>
            
            {/* Title (居中) */}
            <h2 className="absolute left-1/2 -translate-x-1/2 pl-6 whitespace-nowrap font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
              Modify personal information
            </h2>
          </div>
          
          {/* Divider */}
          <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* First name */}
          <CustomInput
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
          />

          {/* Last name */}
          <CustomInput
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
          />

          {/* Birthday Warning (显示在修改生日时) */}
          {showBirthdayWarning && (
            <div className="flex items-start gap-2 p-3 bg-[#FFF9E6] border border-[#FFD700] rounded-lg">
              <Icon name="alert-warning" className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "#FFD700" }} />
              <p className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
                <span className="font-semibold">Past and scheduled rewards won't change.</span> Your new birthday applies to future rewards only.
              </p>
            </div>
          )}

          {/* Date of birth */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a3c2a] text-[14px]">
                Date of birth
              </label>
              {/* 1年内修改过生日的标签 */}
              {isBirthdayModified && birthdayModifiedDate && (
                <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[#4A3C2A] text-xs font-['Comfortaa',sans-serif]">
                  Modified on {birthdayModifiedDate}
                </span>
              )}
            </div>
            <DatePicker
              value={birthday}
              onChange={setBirthday}
              placeholder="yyyy-mm-dd"
              label="" // 移除默认的 "Date" 标签
              minDate="1900-01-01"
              maxDate={(() => {
                // 最大日期是18年前的今天（和注册时保持一致）
                const today = new Date();
                const maxDate = new Date(
                  today.getFullYear() - 18,
                  today.getMonth(),
                  today.getDate()
                );
                return maxDate.toISOString().split("T")[0];
              })()}
              mode="date"
              helperText="At least 18 years old. Your birthday won't be shared."
              disabled={isBirthdayModified} // 如果1年内修改过，禁用选择器
            />
          </div>

          {/* Email (不可编辑) */}
          <div className="flex flex-col gap-2">
            <label className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a3c2a] text-[14px]">
              Email
            </label>
            <div className="bg-gray-100 h-[36px] rounded-[12px] border border-gray-200 flex items-center px-4">
              <span className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#717182] text-[12.25px]">
                {userInfo.email}
              </span>
            </div>
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#717182] text-xs">
              Please contact us to modify your email.
            </p>
          </div>

          {/* Phone number (Optional) */}
          <CustomInput
            label="Phone number (Optional)"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              // 只允许数字、空格、括号、破折号
              const cleaned = value.replace(/[^\d\s()]/g, "");
              setPhone(cleaned);
            }}
            placeholder="(XXX) XXX - XXXX"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[10px] mt-6">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-[120px] h-[36px] rounded-lg border border-[#DE6A07] bg-white text-[#DE6A07] font-['Comfortaa:Medium',sans-serif] font-medium text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-[120px] h-[36px] rounded-lg bg-[#DE6A07] text-white font-['Comfortaa:Medium',sans-serif] font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative"
          >
            {/* Loading Spinner */}
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="small" color="white" />
              </div>
            )}
            {/* Button Text - invisible when loading */}
            <span className={isSubmitting ? "invisible" : ""}>
              Modify
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

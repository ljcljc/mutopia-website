/**
 * ChangePasswordModal 组件 - 修改密码弹窗
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-20268&m=dev
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/auth/LoginModalContainers";
import { validateResetPasswordForm } from "@/components/auth/authStore";
import { Icon } from "@/components/common/Icon";
import { toast } from "sonner";
import { HttpError } from "@/lib/http";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenForgotPassword?: () => void;
}

// 保存 ChangePasswordModal 状态的接口
interface ChangePasswordState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  currentPasswordError: string;
  newPasswordError: string;
  confirmPasswordError: string;
}

// 使用模块级别的变量保存状态（在组件外部）
let savedState: ChangePasswordState | null = null;

export default function ChangePasswordModal({
  open,
  onOpenChange,
  onOpenForgotPassword,
}: ChangePasswordModalProps) {
  // 从保存的状态恢复，如果没有则使用默认值
  const [currentPassword, setCurrentPassword] = useState(savedState?.currentPassword || "");
  const [newPassword, setNewPassword] = useState(savedState?.newPassword || "");
  const [confirmPassword, setConfirmPassword] = useState(savedState?.confirmPassword || "");
  
  // 密码可见性状态
  const [showCurrentPassword, setShowCurrentPassword] = useState(savedState?.showCurrentPassword || false);
  const [showNewPassword, setShowNewPassword] = useState(savedState?.showNewPassword || false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(savedState?.showConfirmPassword || false);
  
  // 错误状态
  const [currentPasswordError, setCurrentPasswordError] = useState(savedState?.currentPasswordError || "");
  const [newPasswordError, setNewPasswordError] = useState(savedState?.newPasswordError || "");
  const [confirmPasswordError, setConfirmPasswordError] = useState(savedState?.confirmPasswordError || "");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当弹窗打开时，恢复保存的状态
  useEffect(() => {
    if (open && savedState) {
      setCurrentPassword(savedState.currentPassword);
      setNewPassword(savedState.newPassword);
      setConfirmPassword(savedState.confirmPassword);
      setShowCurrentPassword(savedState.showCurrentPassword);
      setShowNewPassword(savedState.showNewPassword);
      setShowConfirmPassword(savedState.showConfirmPassword);
      setCurrentPasswordError(savedState.currentPasswordError);
      setNewPasswordError(savedState.newPasswordError);
      setConfirmPasswordError(savedState.confirmPasswordError);
    }
  }, [open]);

  // 保存当前状态到模块变量
  const saveState = () => {
    savedState = {
      currentPassword,
      newPassword,
      confirmPassword,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,
      currentPasswordError,
      newPasswordError,
      confirmPasswordError,
    };
  };

  const handleCurrentPasswordChange = (value: string) => {
    setCurrentPassword(value);
    setCurrentPasswordError("");
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setNewPasswordError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError("");
  };

  const handleNewPasswordBlur = () => {
    const result = validateResetPasswordForm({
      password: newPassword,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const passwordErr = result.error.issues.find((e) => e.path.includes("password"));
      if (passwordErr) {
        setNewPasswordError(passwordErr.message);
      }
    } else {
      setNewPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    const result = validateResetPasswordForm({
      password: newPassword,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const confirmPasswordErr = result.error.issues.find((e) =>
        e.path.includes("confirmPassword")
      );
      if (confirmPasswordErr) {
        setConfirmPasswordError(confirmPasswordErr.message);
      }
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleCurrentPasswordBlur = () => {
    // 基本验证：检查是否为空
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      return;
    }

    // TODO: 如果需要真正的密码验证，可以在这里调用 API
    // 例如：await verifyCurrentPassword(currentPassword)
    // 目前先清除错误，实际验证会在提交时进行
    // 如果密码不为空，暂时清除错误，实际验证会在提交时进行
    // setCurrentPasswordError("");
  };

  const handleCancel = () => {
    // 重置表单和保存的状态
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    savedState = null; // 清除保存的状态
    onOpenChange(false);
  };

  const handleChange = async () => {
    // 验证当前密码
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      return;
    }

    // 验证新密码和确认密码
    const result = validateResetPasswordForm({
      password: newPassword,
      confirmPassword,
    });

    if (!result.success && result.error) {
      result.error.issues.forEach((err) => {
        if (err.path.includes("password")) {
          setNewPasswordError(err.message);
        }
        if (err.path.includes("confirmPassword")) {
          setConfirmPasswordError(err.message);
        }
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: 调用修改密码 API
      // await changePassword({
      //   current_password: currentPassword,
      //   new_password: newPassword,
      //   confirm_password: confirmPassword,
      // });
      
      // 临时提示
      toast.success("Password changed successfully");
      // 清除保存的状态
      savedState = null;
      handleCancel();
    } catch (error) {
      console.error("Failed to change password:", error);
      
      // 处理原密码错误的情况
      if (error instanceof HttpError) {
        const errorMessage = error.message || "";
        if (error.status === 400 || errorMessage.toLowerCase().includes("current password") || errorMessage.toLowerCase().includes("incorrect")) {
          setCurrentPasswordError("Current password incorrect, please verify");
        } else {
          toast.error(errorMessage || "Failed to change password. Please try again.");
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.toLowerCase().includes("current password") || errorMessage.toLowerCase().includes("incorrect")) {
          setCurrentPasswordError("Current password incorrect, please verify");
        } else {
          toast.error("Failed to change password. Please try again.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] px-6 pt-3 pb-6 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] max-w-[400px] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Change password</DialogTitle>
        <DialogDescription className="sr-only">
          Enter your current password and set a new password
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
            <h2 className="absolute left-1/2 -translate-x-1/2 font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
              Change password
            </h2>
          </div>
          
          {/* Divider */}
          <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
        </div>

        {/* Password Inputs */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Current Password */}
          <div>
            <PasswordInput
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
              onBlur={handleCurrentPasswordBlur}
              showPassword={showCurrentPassword}
              onTogglePassword={() => setShowCurrentPassword(!showCurrentPassword)}
              hasError={!!currentPasswordError}
              label="Current password"
              showLabel={true}
              placeholder="Enter current password"
            />
            {currentPasswordError && (
              <div className="flex flex-col mt-1">
                <div className="flex items-center gap-2">
                  <Icon name="alert-error" className="w-4 h-4 text-[#de1507] shrink-0" />
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[#de1507] text-[12px]">
                    {currentPasswordError}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // 保存当前状态
                    saveState();
                    // 打开 Forgot password 弹窗（会关闭当前弹窗）
                    onOpenForgotPassword?.();
                  }}
                  className="text-[#DE6A07] hover:text-[#DE6A07]/80 font-['Comfortaa:Medium',sans-serif] font-medium text-sm whitespace-nowrap self-end mt-4 cursor-pointer"
                >
                  Forgot password
                </button>
              </div>
            )}
          </div>

          {/* New Password */}
          <div>
            <PasswordInput
              value={newPassword}
              onChange={handleNewPasswordChange}
              onBlur={handleNewPasswordBlur}
              showPassword={showNewPassword}
              onTogglePassword={() => setShowNewPassword(!showNewPassword)}
              hasError={!!newPasswordError}
              label="New password"
              showLabel={true}
              placeholder="Enter new password"
            />
            {newPasswordError && (
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[#de1507] text-[12px] mt-1">
                {newPasswordError}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <PasswordInput
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              hasError={!!confirmPasswordError}
              label="Confirm new password"
              showLabel={true}
              placeholder="Re-enter new password"
            />
            {confirmPasswordError && (
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[#de1507] text-[12px] mt-1">
                {confirmPasswordError}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-[10px]">
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            className="w-[120px] h-[36px] rounded-[32px] border-2 border-[#de6a07] bg-white text-[#de6a07] font-['Comfortaa:Medium',sans-serif] font-medium text-sm hover:bg-[#de6a07]/10 transition-colors"
          >
            Cancel
          </button>
          
          {/* Change Button */}
          <button
            onClick={handleChange}
            disabled={!currentPassword || !newPassword || !confirmPassword || !!currentPasswordError || !!newPasswordError || !!confirmPasswordError || isSubmitting}
            className={`w-[120px] h-[36px] relative rounded-[32px] shrink-0 transition-colors flex items-center justify-center ${
              !currentPassword || !newPassword || !confirmPassword || !!currentPasswordError || !!newPasswordError || !!confirmPasswordError || isSubmitting
                ? "bg-[#de6a07]/50 cursor-not-allowed"
                : "bg-[#de6a07] hover:bg-[#c55f06] cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="font-['Comfortaa:Medium',sans-serif] font-medium text-sm text-white">
                Change
              </span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

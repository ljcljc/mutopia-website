/**
 * PersonalInfoCard 组件 - 个人信息卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-25315&m=dev
 */

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "./accountStore";
import ChangePasswordModal from "./ChangePasswordModal";
import { LoginModal } from "@/components/auth/LoginModal";

/**
 * 获取用户 initials（姓名首字母）
 */
function getUserInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0).toUpperCase() || "";
  const last = lastName?.charAt(0).toUpperCase() || "";
  return first + last || "U";
}

/**
 * 格式化日期显示
 */
function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch {
    return dateString;
  }
}

export default function PersonalInfoCard() {
  const userInfo = useAuthStore((state) => state.userInfo);
  const { showComingSoonMessage } = useAccountStore();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [shouldRestoreChangePassword, setShouldRestoreChangePassword] = useState(false);
  const previousStepRef = useRef<string | null>(null);
  
  const { step, setStep, setEmail } = useAuthStore();

  // 初始化 previousStepRef
  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = step;
    }
  }, [step]);

  // 监听 step 变化，如果从 forgot-password 返回到 password，且需要恢复 Change password
  useEffect(() => {
    const previousStep = previousStepRef.current;
    if (previousStep !== step) {
      // 如果从 forgot-password 返回到 password，且需要恢复 Change password
      if (
        shouldRestoreChangePassword && 
        previousStep === "forgot-password" && 
        step === "password" && 
        isLoginModalOpen
      ) {
        // 从 forgot-password 返回到了 password 步骤
        // 关闭 LoginModal，然后打开 ChangePasswordModal
        setIsLoginModalOpen(false);
        // 使用 requestAnimationFrame 确保在下一帧打开，避免闪烁
        requestAnimationFrame(() => {
          setIsChangePasswordModalOpen(true);
          setShouldRestoreChangePassword(false);
        });
      }
      // 更新 previousStepRef
      previousStepRef.current = step;
    }
  }, [step, shouldRestoreChangePassword, isLoginModalOpen]);

  // 当 LoginModal 打开时，设置到 forgot-password 步骤
  // 参考 auth 模块的做法：直接设置 step，不需要延迟
  useEffect(() => {
    if (isLoginModalOpen && shouldRestoreChangePassword) {
      // 设置邮箱为用户邮箱
      if (userInfo?.email) {
        setEmail(userInfo.email);
      }
      // 更新 previousStepRef 为当前 step
      previousStepRef.current = step;
      // 直接设置 step，不需要延迟（参考 auth 模块的做法）
      setStep("forgot-password");
    }
  }, [isLoginModalOpen, shouldRestoreChangePassword, userInfo?.email, setEmail, setStep, step]);

  if (!userInfo) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.10)]">
        <p className="text-[#4A3C2A]">Loading user information...</p>
      </div>
    );
  }

  const initials = getUserInitials(userInfo.first_name, userInfo.last_name);
  const fullName = [userInfo.first_name, userInfo.last_name].filter(Boolean).join(" ") || userInfo.email.split("@")[0];

  const handleModify = () => {
    showComingSoonMessage("修改个人信息");
    // TODO: 显示 toast 提示 "功能开发中"
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-[rgba(0,0,0,0.10)]">
      <div className="flex items-start gap-6">
        {/* 左侧：头像 */}
        <div className="shrink-0">
          <div className="w-[60px] h-[60px] rounded-full bg-[#8B6357] flex items-center justify-center">
            <span className="text-white font-['Comfortaa',sans-serif] font-semibold text-lg">
              {initials}
            </span>
          </div>
        </div>

        {/* 中间：用户信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
              {fullName}
            </h2>
            {/* Modify 按钮 */}
            <button
              onClick={handleModify}
              className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer"
            >
              <Icon name="pencil" className="w-4 h-4" />
              <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
                Modify
              </span>
            </button>
          </div>

          {/* 信息行 */}
          <div className="flex flex-col gap-2">
            {/* 生日 */}
            {userInfo.birthday && (
              <div className="flex items-center gap-4">
                <Icon name="birthday" className="w-5 h-5 text-[#8B6357] shrink-0" />
                <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-sm">
                  {formatDate(userInfo.birthday)}
                </span>
              </div>
            )}

            {/* 邮箱 */}
            <div className="flex items-center gap-4">
              <Icon name="email" className="w-5 h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-sm">
                {userInfo.email}
              </span>
            </div>

            {/* 电话 - TODO: 从 userInfo 获取，目前 API 可能不包含 */}
            <div className="flex items-center gap-4">
              <Icon name="phone" className="w-5 h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-sm">
                -
              </span>
            </div>

            {/* Change Password 链接 */}
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-4 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer self-start"
            >
              <Icon name="lock" className="w-5 h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
                Change password
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onOpenChange={setIsChangePasswordModalOpen}
        onOpenForgotPassword={() => {
          // 保存当前 step 到 previousStepRef
          previousStepRef.current = step;
          setShouldRestoreChangePassword(true);
          // 先准备好状态（邮箱），这样在打开 LoginModal 时状态已经就绪
          if (userInfo?.email) {
            setEmail(userInfo.email);
          }
          // 关闭 ChangePasswordModal
          setIsChangePasswordModalOpen(false);
          // 使用 requestAnimationFrame 确保在下一帧打开 LoginModal，避免闪烁
          requestAnimationFrame(() => {
            setIsLoginModalOpen(true);
          });
        }}
      />

      {/* Login Modal (for Forgot Password) */}
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <div style={{ display: "none" }} />
      </LoginModal>
    </div>
  );
}

/**
 * PersonalInfoCard 组件 - 个人信息卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-25315&m=dev
 */

import { useState, useEffect } from "react";
import { useAuthStore } from "@/components/auth/authStore";
import { Icon } from "@/components/common/Icon";
import ChangePasswordModal from "./ChangePasswordModal";
import ModifyPersonalInfoModal from "./ModifyPersonalInfoModal";
import { LoginModal } from "@/components/auth/LoginModal";
import { sendPasswordResetCode, getCurrentUser, buildImageUrl } from "@/lib/api";
import { getSendCountFromError } from "@/components/auth/forgotPasswordUtils";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

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
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isModifyPersonalInfoModalOpen, setIsModifyPersonalInfoModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [shouldRestoreChangePassword, setShouldRestoreChangePassword] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null);
  
  // 头像上传 hook
  const {
    isUploading: isUploadingAvatar,
    uploadProgress,
    handleClick: handleAvatarClick,
    inputProps: avatarInputProps,
  } = useAvatarUpload({
    onSuccess: async () => {
      // 上传成功后，标记需要等待图片加载
      // 用户信息会在 hook 内部更新，这里我们等待图片加载完成
    },
  });

  // 监听上传状态变化，当上传完成时，等待图片加载
  useEffect(() => {
    if (isUploadingAvatar) {
      setIsImageLoading(true);
    } else if (!isUploadingAvatar && userInfo?.avatar_url) {
      // 上传完成，设置待加载的头像 URL
      setPendingAvatarUrl(userInfo.avatar_url);
    }
  }, [isUploadingAvatar, userInfo?.avatar_url]);
  
  const { 
    step, 
    setStep, 
    setEmail,
    codeSendCount,
    setCodeSendCount,
    setForgotPasswordEmail,
    setVerificationMode,
    setCodeVerifyFailCount,
    setResetPasswordToken,
    setVerificationCode,
  } = useAuthStore();
  
  const MAX_SEND_COUNT = 5;

  // 参考 auth 模块的逻辑：监听 step 变化，如果从 forgot-password 返回到 password，且需要恢复 change-password
  // 则拦截并设置 step 为 change-password
  useEffect(() => {
    if (step === "password" && shouldRestoreChangePassword && isLoginModalOpen) {
      // 从 forgot-password 返回到 password，但需要返回 change-password
      // 设置 step 为 change-password，触发打开 ChangePasswordModal
      setStep("change-password");
    }
  }, [step, shouldRestoreChangePassword, isLoginModalOpen, setStep]);

  // 监听 step 变化，如果 step 变为 change-password，则打开 ChangePasswordModal
  useEffect(() => {
    if (step === "change-password" && shouldRestoreChangePassword) {
      // 关闭 LoginModal，然后打开 ChangePasswordModal
      setIsLoginModalOpen(false);
      requestAnimationFrame(() => {
        setIsChangePasswordModalOpen(true);
        setShouldRestoreChangePassword(false);
      });
    }
  }, [step, shouldRestoreChangePassword]);


  // 注意：step 的设置现在在 onOpenForgotPassword 回调中完成（发送验证码后）
  // 这个 useEffect 不再需要，因为所有逻辑都在 onOpenForgotPassword 中处理

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
    setIsModifyPersonalInfoModalOpen(true);
  };

  const handleModifySuccess = async () => {
    // 重新获取用户信息以更新显示
    try {
      const updatedUserInfo = await getCurrentUser();
      setUserInfo(updatedUserInfo);
    } catch (error) {
      console.error("Failed to refresh user info:", error);
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true);
  };

  return (
      <div className="bg-white rounded-[12px] sm:rounded-lg shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:shadow-sm p-[20px] sm:p-6 border border-[rgba(0,0,0,0.10)]">
      <div className="flex items-start gap-[14px] sm:gap-6">
        {/* 左侧：头像 */}
        <div className="shrink-0">
          <div 
            className="relative w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] rounded-full bg-[#8B6357] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={handleAvatarClick}
            title="Click to upload avatar"
          >
            {/* 如果有头像 URL，显示图片 */}
            {userInfo.avatar_url ? (
              <img
                src={buildImageUrl(userInfo.avatar_url)}
                alt={fullName}
                className="w-full h-full rounded-full object-cover"
                onLoad={() => {
                  // 图片加载完成
                  if (pendingAvatarUrl === userInfo.avatar_url) {
                    setIsImageLoading(false);
                    setPendingAvatarUrl(null);
                  }
                }}
                onError={(e) => {
                  // 如果图片加载失败，隐藏图片，显示 initials
                  e.currentTarget.style.display = "none";
                  setIsImageLoading(false);
                  setPendingAvatarUrl(null);
                }}
              />
            ) : (
              /* 显示 initials（如果没有头像） */
              <span className="text-white font-['Comfortaa',sans-serif] font-semibold text-[14px] sm:text-lg">
                {initials}
              </span>
            )}

            {/* 上传进度覆盖层（上传时或图片加载中时显示） */}
            {(isUploadingAvatar || isImageLoading) && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="text-white text-xs font-medium">
                  {isUploadingAvatar ? `${uploadProgress}%` : "Loading..."}
                </div>
              </div>
            )}

            {/* 悬停时显示上传提示 */}
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors pointer-events-none">
              <Icon name="pencil" className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* 隐藏的文件输入 - 使用 hook 提供的 inputProps */}
          <input {...avatarInputProps} />
        </div>

        {/* 中间：用户信息 */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-[12px] sm:mb-4">
            <h2 className="font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-[14px] sm:text-lg">
              {fullName}
            </h2>
            {/* Modify 按钮 */}
            <button
              onClick={handleModify}
              className="flex items-center gap-2 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer"
            >
              <Icon name="pencil" className="w-4 h-4" />
              <span className="hidden sm:inline font-['Comfortaa',sans-serif] font-medium text-sm">
                Modify
              </span>
            </button>
          </div>

          {/* 信息行 */}
          <div className="flex flex-col gap-2">
            {/* 生日 */}
            {userInfo.birthday && (
              <div className="flex items-center gap-4">
                <Icon name="birthday" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B6357] shrink-0" />
                <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-[12.25px] sm:text-sm">
                  {formatDate(userInfo.birthday)}
                </span>
              </div>
            )}

            {/* 邮箱 */}
            <div className="flex items-center gap-4">
              <Icon name="email" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A5565] text-[12.25px] sm:text-sm">
                {userInfo.email}
              </span>
            </div>

            {/* 电话 - TODO: 从 userInfo 获取，目前 API 可能不包含 */}
            <div className="flex items-center gap-4">
              <Icon name="phone" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[#4A3C2A] text-[12.25px] sm:text-sm">
                -
              </span>
            </div>

            {/* Change Password 链接 */}
            <button
              onClick={handleChangePassword}
              className="flex items-center gap-4 text-[#8B6357] hover:text-[#DE6A07]/80 cursor-pointer self-start"
            >
              <Icon name="lock" className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-medium text-[12px] sm:text-sm text-[#DE6A07] sm:text-[#8B6357]">
                Change password
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modify Personal Info Modal */}
      <ModifyPersonalInfoModal
        open={isModifyPersonalInfoModalOpen}
        onOpenChange={setIsModifyPersonalInfoModalOpen}
        userInfo={userInfo}
        onSuccess={handleModifySuccess}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordModalOpen}
        onOpenChange={setIsChangePasswordModalOpen}
        onOpenForgotPassword={async () => {
          // 设置标志，表示从 ChangePasswordModal 进入 forgot-password
          setShouldRestoreChangePassword(true);
          
          // 获取用户邮箱
          const userEmail = userInfo?.email;
          if (!userEmail) {
            toast.error("Email not found. Please try again.");
            return;
          }
          
          // 设置邮箱
          setEmail(userEmail);
          
          // 参考 auth 模块的 handleForgotPassword 逻辑
          // 检查 codeSendCount 是否已经达到 MAX_SEND_COUNT
          if (codeSendCount >= MAX_SEND_COUNT) {
            // 已经达到最大发送次数，直接导航到 forgot-password 步骤
            setStep("forgot-password");
            setVerificationMode("forgot-password");
            setForgotPasswordEmail(userEmail);
            setCodeVerifyFailCount(0);
            setResetPasswordToken(null);
            setVerificationCode(["", "", "", "", "", ""]);
            
            // 关闭 ChangePasswordModal
            setIsChangePasswordModalOpen(false);
            // 打开 LoginModal
            requestAnimationFrame(() => {
              setIsLoginModalOpen(true);
            });
            return;
          }
          
          // 发送验证码
          try {
            const response = await sendPasswordResetCode(userEmail);
            // 使用后端返回的 send_count
            setCodeSendCount(response.send_count);
            setForgotPasswordEmail(userEmail);
            setVerificationMode("forgot-password");
            setCodeVerifyFailCount(0);
            setResetPasswordToken(null);
            setVerificationCode(["", "", "", "", "", ""]);
            // 设置 step 为 forgot-password，确保打开 LoginModal 时显示正确的步骤
            setStep("forgot-password");
            
            // 检查是否达到最大发送次数
            if (response.send_count >= MAX_SEND_COUNT) {
              // 不显示成功 toast，因为已经达到限制
            } else {
              toast.success("Verification code sent to your email.");
            }
            
            // 关闭 ChangePasswordModal
            setIsChangePasswordModalOpen(false);
            // 打开 LoginModal（step 已经设置为 forgot-password）
            requestAnimationFrame(() => {
              setIsLoginModalOpen(true);
            });
          } catch (err) {
            console.error("Error sending password reset code:", err);
            
            // 从错误中提取 send_count（如果有）
            const sendCountFromError = getSendCountFromError(err);
            if (sendCountFromError !== null) {
              setCodeSendCount(sendCountFromError);
            }
            
            // 显示错误消息
            if (err instanceof HttpError) {
              toast.error(err.message || "Failed to send verification code.");
            } else {
              toast.error("Failed to send verification code. Please try again.");
            }
            
            // 出错时停留在 ChangePasswordModal，不打开 LoginModal
            // 清除 shouldRestoreChangePassword 标志，因为发送失败
            setShouldRestoreChangePassword(false);
            // ChangePasswordModal 保持打开状态，用户可以重试或取消
          }
        }}
      />

      {/* Login Modal (for Forgot Password) */}
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={(open) => {
          setIsLoginModalOpen(open);
          
          // 如果正在关闭 LoginModal，且需要恢复 ChangePasswordModal
          // 参考 auth 模块：如果 step 是 forgot-password 或 password，且需要恢复 change-password
          // 则设置 step 为 change-password，由 useEffect 处理打开 ChangePasswordModal
          if (!open && shouldRestoreChangePassword) {
            const currentStep = useAuthStore.getState().step;
            if (currentStep === "forgot-password" || currentStep === "password") {
              setStep("change-password");
            }
          }
        }}
      >
        <div style={{ display: "none" }} />
      </LoginModal>
    </div>
  );
}

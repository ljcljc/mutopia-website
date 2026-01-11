/**
 * PersonalInfoCard 组件 - 个人信息卡片
 * 
 * 根据 Figma 设计图 1:1 还原
 * Figma: https://www.figma.com/design/uPtOY1EQwpnZkgAb8YhWMN/Landing_page?node-id=2584-25315&m=dev
 */

import { useAuthStore } from "@/components/auth/authStore";
import { Icon } from "@/components/common/Icon";
import { useNavigate } from "react-router-dom";
import { useAccountStore } from "./accountStore";

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
  const navigate = useNavigate();

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
    // TODO: 跳转到密码重置流程或打开密码重置模态框
    navigate("/account/change-password");
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
              {/* TODO: 使用锁图标，暂时使用 help-circle 占位 */}
              <Icon name="lock" className="w-5 h-5 text-[#8B6357] shrink-0" />
              <span className="font-['Comfortaa',sans-serif] font-medium text-sm">
                Change password
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

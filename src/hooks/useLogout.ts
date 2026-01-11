import { useNavigate } from "react-router-dom";
import { logout as apiLogout } from "@/lib/api";
import { useAuthStore } from "@/components/auth/authStore";
import { toast } from "sonner";

/**
 * Logout Hook
 * 
 * 提供统一的 logout 功能，包括：
 * - API 调用
 * - 状态清理
 * - 消息提示
 * - 页面跳转
 * 
 * @example
 * ```tsx
 * const { handleLogout } = useLogout();
 * 
 * <button onClick={handleLogout}>Logout</button>
 * ```
 */
export function useLogout(redirectTo: string = "/") {
  const navigate = useNavigate();
  const logoutUser = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // 调用 API logout
      await apiLogout();
      // 清理本地认证状态
      await logoutUser();
      // 显示成功消息
      toast.success("Logged out successfully");
      // 跳转到指定页面（默认首页）
      navigate(redirectTo);
    } catch (error) {
      console.error("Logout error:", error);
      // 即使 API 调用失败，也清理本地状态
      await logoutUser();
      // 显示成功消息
      toast.success("Logged out successfully");
      // 跳转到指定页面（默认首页）
      navigate(redirectTo);
    }
  };

  return { handleLogout };
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/components/auth/authStore";

export default function GroomerRouteGuard() {
  const location = useLocation();
  const userInfo = useAuthStore((state) => state.userInfo);

  // 如果用户信息已加载且不是 groomer，回到用户端账户页
  if (userInfo && !userInfo.is_groomer) {
    return <Navigate to="/account/profile" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}


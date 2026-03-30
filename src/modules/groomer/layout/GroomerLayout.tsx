import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/common";
import AccountBottomNav from "@/components/layout/AccountBottomNav";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import GroomerHeader from "@/modules/groomer/components/GroomerHeader";

export default function GroomerLayout() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const userInfo = useAuthStore((state) => state.userInfo);
  const hasAccessToken =
    typeof window !== "undefined" &&
    !!window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!hasAccessToken && !user && !userInfo) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F1] w-full">
      <GroomerHeader />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <AccountBottomNav />
      <ScrollToTop />
      <Toaster />
    </div>
  );
}

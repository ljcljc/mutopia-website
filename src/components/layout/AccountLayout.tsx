import { Navigate, useLocation } from "react-router-dom";
import BaseAccountLayoutShell from "./BaseAccountLayoutShell";
import { AccountSidebar } from "./AccountSidebar";
import HeaderApp from "./HeaderApp";
import Footer from "./Footer";
import AccountBottomNav from "./AccountBottomNav";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export default function AccountLayout() {
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
    <BaseAccountLayoutShell
      rootClassName="bg-[#F9F1E8]"
      contentBackgroundClassName="bg-[#F9F1E8]"
      contentContainerClassName="w-full max-w-[1248px] mx-auto flex flex-1 overflow-hidden gap-6 my-6 lg:my-14"
      sidebar={<AccountSidebar className="hidden lg:block" />}
      header={<HeaderApp />}
      footer={<Footer />}
      footerClassName="hidden md:block"
      bottomNav={<AccountBottomNav />}
      bottomNavClassName="lg:hidden"
      insetClassName="bg-[#F9F1E8] pb-[96px] lg:pb-0"
    />
  );
}

import { Navigate, useLocation } from "react-router-dom";
import BaseAccountLayoutShell from "@/components/layout/BaseAccountLayoutShell";
import AccountBottomNav from "@/components/layout/AccountBottomNav";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import GroomerHeader from "@/modules/groomer/components/GroomerHeader";
import GroomerSidebar from "@/modules/groomer/components/GroomerSidebar";

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
    <BaseAccountLayoutShell
      rootClassName="bg-[#F8F7F1]"
      contentBackgroundClassName="bg-[#633479]"
      contentContainerClassName="w-full sm:w-7xl mx-auto flex flex-1 overflow-hidden gap-6 mt-6 mb-2 sm:mt-14 sm:mb-6"
      sidebar={<GroomerSidebar className="hidden lg:block" />}
      header={<GroomerHeader />}
      footer={<Footer />}
      footerClassName="hidden lg:block"
      bottomNav={<AccountBottomNav />}
      bottomNavClassName="lg:hidden"
      insetClassName="bg-transparent pb-[96px] lg:pb-0"
      contentGrow={false}
    />
  );
}

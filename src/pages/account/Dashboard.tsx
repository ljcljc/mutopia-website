import { useEffect, useRef } from "react";
import { useAccountStore } from "@/components/account/accountStore";
import { useAuthStore } from "@/components/auth/authStore";
import { getCurrentUser } from "@/lib/api";
import MembershipCard from "@/components/account/MembershipCard";
import ShareAndEarnCard from "@/components/account/ShareAndEarnCard";
import DashboardBookingCard from "@/components/account/dashboard/DashboardBookingCard";
import DashboardHeroCard from "@/components/account/dashboard/DashboardHeroCard";
import DashboardMyCreditCard from "@/components/account/dashboard/DashboardMyCreditCard";
import DashboardMyPetsCard from "@/components/account/dashboard/DashboardMyPetsCard";

export default function Dashboard() {
  const { fetchMembershipPlans } = useAccountStore();
  const { userInfo, setUserInfo } = useAuthStore();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    if (!userInfo) {
      getCurrentUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((error) => {
          console.error("Failed to load user info:", error);
        });
    }

    fetchMembershipPlans();
    // Booking 数据由 DashboardBookingCard 和 DashboardHeroCard 组件自己管理
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col">
      <div
        className="mx-auto flex w-full max-w-none flex-1 px-[calc(20*var(--px493))] pb-[calc(20*var(--px493))] sm:max-w-[944px] sm:px-6 sm:pb-8"
        style={{ ["--px493" as never]: "calc(100vw / 493)" }}
      >
        <div className="flex flex-col gap-[calc(16*var(--px493))] sm:gap-5">
          <div className="h-auto sm:h-[27px]">
            <h1 className="font-comfortaa font-bold text-[20px] text-[#4A3C2A]">
              Dashboard
            </h1>
          </div>

          <DashboardHeroCard />
          <DashboardBookingCard />
          <DashboardMyPetsCard />
          <DashboardMyCreditCard />

          <div className="grid grid-cols-1 gap-[calc(20*var(--px493))] md:grid-cols-2 sm:gap-6">
            <ShareAndEarnCard />
            <MembershipCard />
          </div>
        </div>
      </div>
    </div>
  );
}

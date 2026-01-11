import { useEffect, useRef } from "react";
import { useAccountStore } from "@/components/account/accountStore";
import { useAuthStore } from "@/components/auth/authStore";
import { getCurrentUser } from "@/lib/api";
import PageHeader from "@/components/account/PageHeader";
import PersonalInfoCard from "@/components/account/PersonalInfoCard";
import AddressesCard from "@/components/account/AddressesCard";
import PaymentMethodCard from "@/components/account/PaymentMethodCard";
import ShareAndEarnCard from "@/components/account/ShareAndEarnCard";
import MembershipCard from "@/components/account/MembershipCard";

export default function MyAccount() {
  const { fetchAddresses, fetchMembershipPlans } = useAccountStore();
  const { userInfo, setUserInfo } = useAuthStore();
  const hasFetchedRef = useRef(false);

  // 组件挂载时加载数据（只执行一次）
  useEffect(() => {
    // 防止重复请求（包括 React.StrictMode 的双重执行）
    if (hasFetchedRef.current) return;
    
    hasFetchedRef.current = true;

    // 如果 userInfo 不存在，先获取用户信息
    if (!userInfo) {
      getCurrentUser()
        .then((info) => {
          setUserInfo(info);
        })
        .catch((error) => {
          console.error("Failed to load user info:", error);
        });
    }

    // 加载地址和会员套餐数据
    fetchAddresses();
    fetchMembershipPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在组件挂载时执行一次

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 py-8 flex-1">
        {/* Page Header */}
        <PageHeader />

        {/* Personal Information Card */}
        <div className="mb-6">
          <PersonalInfoCard />
        </div>

        {/* Addresses Card */}
        <div className="mb-6">
          <AddressesCard />
        </div>

        {/* Payment Method Card */}
        <div className="mb-6">
          <PaymentMethodCard />
        </div>

        {/* Bottom Cards Section - Share & Earn and Membership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ShareAndEarnCard />
          <MembershipCard />
        </div>
      </div>
    </div>
  );
}

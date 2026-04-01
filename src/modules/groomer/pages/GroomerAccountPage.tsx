import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/common/Icon";
import { useNavigate } from "react-router-dom";
import PersonalInfoCard from "@/components/account/PersonalInfoCard";
import {
  PayoutCard,
  PerformanceBenefitItem,
  SimpleListCard,
  type AccountListRow,
} from "@/components/account-center";

export default function GroomerAccountPage() {
  const navigate = useNavigate();
  const serviceRows: AccountListRow[] = [
    {
      id: "vancouver",
      label: "Vancouver",
      rightIcon: "pencil",
      heightClassName: "h-[48px]",
    },
    {
      id: "richmond",
      label: "Richmond",
      rightIcon: "trash",
      rightIconColor: "text-[#EF4444]",
      heightClassName: "h-[52px]",
    },
  ];

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-1 lg:min-h-0 lg:max-w-[944px] lg:px-0 lg:pb-4 lg:pt-1">
      <div className="mb-4 sm:mb-5 flex items-center justify-between">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">My account</h1>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="groomer-pet-owner-toggle"
            className="cursor-pointer font-comfortaa text-[14px] font-bold leading-[22px] text-[#FFF7ED]"
          >
            Pet owner
          </Label>
          <Switch
            id="groomer-pet-owner-toggle"
            className="data-[state=checked]:border-[#DE6A07] data-[state=checked]:bg-[#DE6A07]"
            checked
            onCheckedChange={(checked) => {
              if (!checked) navigate("/account/profile");
            }}
            aria-label="Switch back to pet owner account"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <PersonalInfoCard mode="groomer" />

        <SimpleListCard
          title="Service areas"
          titleIcon="location"
          actionText="+ Add area"
          rows={serviceRows}
          className="lg:h-[192px]"
        />

        <PayoutCard bankName="TD Bank Checking" bankMask="**** **** **** 5678" className="lg:h-[152px]" />

        <section className="rounded-[20px] border-[1.47px] border-[#4A2C55] bg-white px-5 pb-5 pt-[19px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] lg:h-[332px]">
          <div className="mb-[14px] flex items-center justify-between">
            <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Performance</h2>
            <div className="h-[26px] rounded-full bg-[linear-gradient(180deg,#FFF584_0%,#F0D65A_13.46%,#E0B730_26.92%,#C78A0E_75.96%,#BB7F12_87.98%,#C8A32B_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
              <div className="flex h-full items-center gap-2">
                <Icon name="star" className="size-[12px] text-white" />
                <span className="bg-[linear-gradient(168.31deg,#FFF7ED_0%,#FFFBEB_100%)] bg-clip-text font-comfortaa text-[12px] font-bold leading-[17.5px] text-transparent">
                  Gold groomer
                </span>
              </div>
            </div>
          </div>
          <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">
            Maintain your excellent performance to keep these benefits:
          </p>
          <ul className="mt-3 space-y-3">
            <PerformanceBenefitItem title="80% payout share" description="Higher earnings per job" />
            <PerformanceBenefitItem title="Priority client matching" description="Get bookings first in first 24 hours" />
            <PerformanceBenefitItem title="Free Liability Insurance" description="Full coverage included" />
          </ul>
          <button className="mt-6 h-12 w-full rounded-[32px] border-2 border-[#633479] font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#633479] shadow-[0px_4px_12px_rgba(74,44,85,0.3)] lg:w-[247px]">
            View your performance
          </button>
        </section>
      </div>
    </div>
  );
}

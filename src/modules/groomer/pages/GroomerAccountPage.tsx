import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/common/Icon";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/auth/authStore";

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-[20px] bg-white shadow-[0px_4px_12px_rgba(0,0,0,0.08)] ${className}`}>{children}</section>;
}

function ProfileRow({ icon, value, emphasize = false }: { icon: ReactNode; value: string; emphasize?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-4 items-center justify-center">{icon}</span>
      <span
        className="font-comfortaa text-[12.25px] leading-[17.5px]"
        style={{ color: emphasize ? "#DE6A07" : "#4A5565", fontWeight: emphasize ? 700 : 400 }}
      >
        {value}
      </span>
    </div>
  );
}

function BenefitItem({ title, description }: { title: string; description: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-[1px] flex size-[19.99px] items-center justify-center rounded-full bg-[#DE6A07]">
        <Icon name="check" className="size-[14px] text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{title}</p>
        <p className="font-comfortaa text-[12px] leading-[18px] text-[#6B7280]">{description}</p>
      </div>
    </li>
  );
}

export default function GroomerAccountPage() {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.userInfo);

  const fullName = `${userInfo?.first_name ?? ""} ${userInfo?.last_name ?? ""}`.trim() || "Lei CAO";
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-1">
      <div className="mb-4 flex items-center justify-between">
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

      <div className="space-y-4">
        <SectionCard className="p-5 shadow-[0px_8px_12px_rgba(0,0,0,0.1)]">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-[14px]">
              <div className="flex size-14 items-center justify-center rounded-full bg-[#DE6A07]">
                <span className="font-comfortaa text-[17.5px] font-normal leading-[24.5px] text-white">{initials || "LC"}</span>
              </div>
              <div className="space-y-[7px]">
                <p className="font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#4A3C2A]">{fullName}</p>
                <ProfileRow icon={<Icon name="birthday" className="size-4 text-[#8B6357]" />} value={userInfo?.birthday || "2000-09-07"} />
                <ProfileRow icon={<Icon name="email" className="size-4 text-[#8B6357]" />} value={userInfo?.email || "clxtf1111@gmail.com"} />
                <ProfileRow icon={<Icon name="phone" className="size-4 text-[#8B6357]" />} value={userInfo?.phone || "567 987-0988"} />
                <ProfileRow icon={<Icon name="lock" className="size-4 text-[#8B6357]" />} value="Change password" emphasize />
              </div>
            </div>
            <button type="button" aria-label="Edit profile" className="rounded-[14px] p-1">
              <Icon name="pencil" className="size-6 text-[#DE6A07]" />
            </button>
          </div>
        </SectionCard>

        <SectionCard className="px-5 pb-5 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="location" className="size-5 text-[#DE6A07]" />
              <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Service areas</h2>
            </div>
            <button className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22]">+ Add area</button>
          </div>
          <div className="space-y-3">
            <div className="flex h-[48px] items-center justify-between rounded-xl bg-[#FAF9F7] px-3">
              <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">Vancouver</span>
              <Icon name="pencil" className="size-5 text-[#DE6A07]" />
            </div>
            <div className="flex h-[52px] items-center justify-between rounded-xl bg-[#FAF9F7] px-3">
              <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">Richmond</span>
              <Icon name="trash" className="size-4 text-[#EF4444]" />
            </div>
          </div>
        </SectionCard>

        <SectionCard className="px-5 pb-5 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="account" className="size-5 text-[#DE6A07]" />
              <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Earnings payout</h2>
            </div>
            <button className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22]">
              Modify <span className="text-[12px]">↗</span>
            </button>
          </div>
          <div className="flex h-[72px] items-center gap-3 rounded-xl bg-[#FAF9F7] px-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#DBEAFE]">
              <Icon name="account" className="size-6 text-[#3B82F6]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">TD Bank Checking</p>
              <p className="mt-0.5 font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">**** **** **** 5678</p>
            </div>
            <div className="flex h-[24.49px] items-center gap-1 rounded-full bg-[#D1FAE5] px-[10px]">
              <Icon name="check-green" className="size-3" />
              <span className="font-comfortaa text-[11px] font-medium leading-[16.5px] text-[#065F46]">Verified</span>
            </div>
          </div>
        </SectionCard>

        <section className="rounded-[20px] border-[1.47px] border-[#4A2C55] bg-white px-5 pb-5 pt-[19px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
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
            <BenefitItem title="80% payout share" description="Higher earnings per job" />
            <BenefitItem title="Priority client matching" description="Get bookings first in first 24 hours" />
            <BenefitItem title="Free Liability Insurance" description="Full coverage included" />
          </ul>
          <button className="mt-6 h-12 w-full rounded-[32px] border-2 border-[#633479] font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#633479] shadow-[0px_4px_12px_rgba(74,44,85,0.3)]">
            View your performance
          </button>
        </section>
      </div>
    </div>
  );
}

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/common/Icon";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/components/auth/authStore";

function MetricCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-[20px] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">{label}</p>
      <p className="mt-2 font-comfortaa text-[26px] font-bold leading-[30px] text-[#4A2C55]">{value}</p>
      <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#6B7280]">{caption}</p>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
}: {
  icon: "calendar" | "earning" | "account-2";
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex size-10 items-center justify-center rounded-full bg-[#F6ECDC]">
        <Icon name={icon} className="size-5 text-[#DE6A07]" aria-hidden="true" />
      </div>
      <h2 className="mt-4 font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">{title}</h2>
      <p className="mt-2 font-comfortaa text-[13px] leading-[19px] text-[#6B7280]">{description}</p>
    </div>
  );
}

export default function GroomerDashboardPage() {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.userInfo);

  const firstName = userInfo?.first_name?.trim() || "Lei";

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Label
            htmlFor="groomer-dashboard-pet-owner-toggle"
            className="cursor-pointer font-comfortaa text-[14px] font-bold leading-[22px] text-[#FFF7ED]"
          >
            Pet owner
          </Label>
          <Switch
            id="groomer-dashboard-pet-owner-toggle"
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
        <section className="rounded-[24px] bg-white px-5 py-5 shadow-[0px_8px_12px_rgba(0,0,0,0.1)]">
          <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">Welcome back</p>
          <h2 className="mt-2 font-comfortaa text-[24px] font-bold leading-[30px] text-[#4A2C55]">
            {firstName}, your day is ready.
          </h2>
          <p className="mt-2 font-comfortaa text-[13px] leading-[20px] text-[#6B7280]">
            Review today&apos;s bookings, keep an eye on earnings, and stay on top of account updates from one place.
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard label="Today" value="$480" caption="Projected payout" />
          <MetricCard label="Upcoming" value="6" caption="Scheduled jobs" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <ActionCard
            icon="calendar"
            title="Jobs"
            description="Open your assigned jobs, check appointment timing, and prepare for the next visit."
          />
          <ActionCard
            icon="earning"
            title="Earnings"
            description="Track payout progress, recent transfers, and the jobs contributing to this week&apos;s income."
          />
          <ActionCard
            icon="account-2"
            title="Account"
            description="Manage service areas, payout setup, and your groomer profile details."
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import BaseAccountHeaderShell from "@/components/layout/BaseAccountHeaderShell";

function PartnerLogo() {
  return (
    <div className="flex items-center gap-[10px]">
      <Icon name="logo-mark" className="h-[36.84px] w-[35px] text-[#633479]" aria-hidden="true" />
      <div>
        <p className="font-comfortaa text-[14px] font-bold leading-[17.5px] text-[#633479]">Mutopia Partner</p>
        <p className="font-comfortaa text-[10px] font-normal leading-[15px] text-[#633479]">Christian Colombe</p>
      </div>
    </div>
  );
}

function TodayBadge() {
  const [isAmountVisible, setIsAmountVisible] = useState(false);

  return (
    <div className="flex h-8 w-[122px] items-center justify-center gap-2 rounded-[12px] bg-[#633479] px-2">
      <span className="font-comfortaa text-[12px] font-bold leading-4 text-white">
        Today $ {isAmountVisible ? "0.00" : "***"}
      </span>
      <button
        type="button"
        onClick={() => setIsAmountVisible((current) => !current)}
        className="flex items-center justify-center text-white"
        aria-label={isAmountVisible ? "Hide today's earnings amount" : "Show today's earnings amount"}
      >
        <Icon
          name={isAmountVisible ? "eye-visible" : "eye-invisible"}
          className="size-4 text-white"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default function GroomerHeader() {
  return (
    <BaseAccountHeaderShell
      wrapperClassName="pb-px shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]"
      containerClassName="box-border content-stretch flex h-[63px] items-center justify-between relative shrink-0 w-full px-[20px] sm:px-8 md:px-12 lg:px-[57.5px] xl:px-[80px] 2xl:px-[120px]"
    >
      <PartnerLogo />
      <div className="flex items-center gap-2">
        <TodayBadge />
        <Icon name="notify" className="size-6 text-[#633479]" aria-hidden="true" />
      </div>
    </BaseAccountHeaderShell>
  );
}

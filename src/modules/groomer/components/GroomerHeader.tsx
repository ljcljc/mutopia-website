import { Icon } from "@/components/common/Icon";

function PartnerLogo() {
  return (
    <div className="flex items-center gap-[10px]">
      <Icon name="logo" className="h-[36.84px] w-[35px] text-[#633479]" aria-hidden="true" />
      <div>
        <p className="font-comfortaa text-[14px] font-bold leading-[17.5px] text-[#633479]">Mutopia Partner</p>
        <p className="font-comfortaa text-[10px] font-normal leading-[15px] text-[#633479]">Christian Colombe</p>
      </div>
    </div>
  );
}

function TodayBadge() {
  return (
    <div className="flex h-8 w-[122px] items-center justify-center gap-2 rounded-[12px] bg-[#633479] px-2">
      <span className="font-comfortaa text-[12px] font-bold leading-4 text-white">Today $ ***</span>
      <Icon name="eye-visible" className="size-4 text-white" aria-hidden="true" />
    </div>
  );
}

export default function GroomerHeader() {
  return (
    <header className="sticky top-0 z-50 w-full rounded-b-[21px] border-b border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.95)] pb-px shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex h-[63px] w-full max-w-[393px] items-center justify-between px-5">
        <PartnerLogo />
        <div className="flex items-center gap-2">
          <TodayBadge />
          <Icon name="notify" className="size-6 text-[#8B6357]" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

import { Icon, type IconName } from "@/components/common/Icon";
import SectionCard from "./SectionCard";
import { accountCenterTheme } from "./theme";

interface PayoutCardProps {
  title?: string;
  actionText?: string;
  actionIcon?: IconName;
  bankName: string;
  bankMask: string;
  leftIcon?: IconName;
  statusText?: string;
  className?: string;
}

export default function PayoutCard({
  title = "Earnings payout",
  actionText = "Modify",
  actionIcon = "out-link",
  bankName,
  bankMask,
  leftIcon = "bank",
  statusText = "Verified",
  className = "",
}: PayoutCardProps) {
  return (
    <SectionCard className={`px-5 pb-5 pt-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="credit" className="size-5 text-[#DE6A07]" />
          <h2 className={accountCenterTheme.contentTitleClassName}>{title}</h2>
        </div>
        <button
          className={`${accountCenterTheme.actionTextClassName} ${accountCenterTheme.actionInteractiveClassName} inline-flex items-center gap-1.5`}
        >
          <span>{actionText}</span>
          <Icon name={actionIcon} className="size-[14px]" />
        </button>
      </div>
      <div className="flex h-[72px] items-center gap-3 rounded-xl bg-[#FAF9F7] px-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#DBEAFE]">
          <Icon name={leftIcon} className="size-6 text-[#3B82F6]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{bankName}</p>
          <p className="mt-0.5 font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">{bankMask}</p>
        </div>
        <div className="flex h-[24.49px] items-center gap-1 rounded-full bg-[#D1FAE5] px-[10px]">
          <Icon name="target" className="size-3 text-[#065F46]" />
          <span className="font-comfortaa text-[11px] font-medium leading-[16.5px] text-[#065F46]">{statusText}</span>
        </div>
      </div>
    </SectionCard>
  );
}

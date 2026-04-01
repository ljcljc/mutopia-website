import { Icon, type IconName } from "@/components/common/Icon";
import SectionCard from "./SectionCard";
import type { AccountListRow } from "./types";
import { accountCenterTheme } from "./theme";

interface SimpleListCardProps {
  title: string;
  titleIcon: IconName;
  actionText?: string;
  rows: AccountListRow[];
  className?: string;
}

export default function SimpleListCard({ title, titleIcon, actionText, rows, className = "" }: SimpleListCardProps) {
  return (
    <SectionCard className={`px-5 pb-5 pt-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name={titleIcon} className="size-5 text-[#DE6A07]" />
          <h2 className={accountCenterTheme.contentTitleClassName}>{title}</h2>
        </div>
        {actionText ? <button className={accountCenterTheme.actionTextClassName}>{actionText}</button> : null}
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`flex items-center justify-between rounded-xl bg-[#FAF9F7] px-3 ${row.heightClassName ?? "h-[48px]"}`}
          >
            <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{row.label}</span>
            <Icon name={row.rightIcon} className={`size-5 ${row.rightIconColor ?? "text-[#DE6A07]"}`} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}


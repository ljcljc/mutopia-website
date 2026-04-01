import { Icon, type IconName } from "@/components/common/Icon";
import SectionCard from "./SectionCard";
import type { AccountListRow } from "./types";
import { accountCenterTheme } from "./theme";

interface SimpleListCardProps {
  title: string;
  titleIcon: IconName;
  actionText?: string;
  onActionClick?: () => void;
  actionButtonClassName?: string;
  rows: AccountListRow[];
  onRowClick?: (row: AccountListRow) => void;
  rowClassName?: string;
  className?: string;
}

export default function SimpleListCard({
  title,
  titleIcon,
  actionText,
  onActionClick,
  actionButtonClassName,
  rows,
  onRowClick,
  rowClassName,
  className = "",
}: SimpleListCardProps) {
  return (
    <SectionCard className={`px-5 pb-5 pt-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name={titleIcon} className="size-5 text-[#DE6A07]" />
          <h2 className={accountCenterTheme.contentTitleClassName}>{title}</h2>
        </div>
        {actionText ? (
          <button
            className={`${accountCenterTheme.actionTextClassName} ${actionButtonClassName ?? ""}`}
            type="button"
            onClick={onActionClick}
          >
            {actionText}
          </button>
        ) : null}
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`flex items-center justify-between rounded-xl bg-[#FAF9F7] px-3 transition-colors duration-150 hover:bg-[#F3F2EF] ${onRowClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/40" : ""} ${rowClassName ?? ""} ${row.heightClassName ?? "h-[48px]"}`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            role={onRowClick ? "button" : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onKeyDown={
              onRowClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
          >
            <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{row.label}</span>
            <Icon name={row.rightIcon} className={`size-5 ${row.rightIconColor ?? "text-[#DE6A07]"}`} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

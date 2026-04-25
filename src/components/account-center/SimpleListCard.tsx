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
  onRightIconClick?: (row: AccountListRow) => void;
  rowClassName?: string;
  className?: string;
  emptyText?: string;
}

export default function SimpleListCard({
  title,
  titleIcon,
  actionText,
  onActionClick,
  actionButtonClassName,
  rows,
  onRowClick,
  onRightIconClick,
  rowClassName,
  className = "",
  emptyText,
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
        {rows.length === 0 && emptyText ? (
          <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">{emptyText}</p>
        ) : null}
        {rows.map((row) => {
          const isRowInteractive = Boolean(onRowClick) && row.rowClickable !== false;

          return (
            <div
              key={row.id}
              className={`flex items-center justify-between rounded-xl bg-[#FAF9F7] px-3 transition-colors duration-150 ${isRowInteractive ? "cursor-pointer hover:bg-[#F3F2EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/40" : ""} ${rowClassName ?? ""} ${row.heightClassName ?? "h-[48px]"}`}
              onClick={isRowInteractive ? () => onRowClick?.(row) : undefined}
              role={isRowInteractive ? "button" : undefined}
              tabIndex={isRowInteractive ? 0 : undefined}
              onKeyDown={
                isRowInteractive
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowClick?.(row);
                      }
                    }
                  : undefined
              }
            >
              <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{row.label}</span>
              {row.rightIcon ? (
                onRightIconClick ? (
                  <button
                    type="button"
                    className="flex size-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DE6A07]/40"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRightIconClick(row);
                    }}
                    aria-label={`Remove ${row.label}`}
                  >
                    <Icon
                      name={row.rightIcon}
                      className={`size-5 ${row.rightIconColor ?? "text-[#DE6A07]"} ${row.rightIconClassName ?? ""}`}
                    />
                  </button>
                ) : (
                  <Icon
                    name={row.rightIcon}
                    className={`size-5 ${row.rightIconColor ?? "text-[#DE6A07]"} ${row.rightIconClassName ?? ""}`}
                  />
                )
              ) : null}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

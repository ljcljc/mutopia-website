import { Icon, type IconName } from "@/components/common/Icon";

interface InfoEntryRowProps {
  primaryText: string;
  secondaryText: string;
  badgeText?: string;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deleteAriaLabel?: string;
  deleteIcon?: IconName;
  deleteIconClassName?: string;
}

export default function InfoEntryRow({
  primaryText,
  secondaryText,
  badgeText,
  onDelete,
  deleteDisabled = false,
  deleteAriaLabel = "Delete item",
  deleteIcon = "trash",
  deleteIconClassName = "w-4 h-4 sm:w-5 sm:h-5",
}: InfoEntryRowProps) {
  return (
    <div className="bg-white rounded-[14px] sm:rounded-lg border border-[rgba(0,0,0,0.1)] p-[15px] sm:p-4 flex items-center">
      <div className="flex items-start gap-5">
        <div className="flex flex-col gap-1">
          <span className="font-comfortaa font-normal text-[#4A3C2A] text-[12.25px] sm:text-sm">
            {primaryText}
          </span>
          <span className="font-comfortaa font-normal text-[#4A5565] text-[12.25px] sm:text-sm">
            {secondaryText}
          </span>
        </div>
        {badgeText ? (
          <span className="bg-[#DCFCE7] text-[#008236] px-3 py-1 rounded-full text-[10.5px] sm:text-xs font-comfortaa font-medium">
            {badgeText}
          </span>
        ) : null}
      </div>
      {onDelete ? (
        <button
          onClick={onDelete}
          className="ml-auto text-[#4C4C4C] hover:text-red-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label={deleteAriaLabel}
          disabled={deleteDisabled}
        >
          <Icon name={deleteIcon} className={deleteIconClassName} />
        </button>
      ) : null}
    </div>
  );
}


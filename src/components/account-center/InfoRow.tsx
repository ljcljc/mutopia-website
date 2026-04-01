import { Icon } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";
import type { AccountInfoRowItem } from "./types";

interface InfoRowProps {
  item: AccountInfoRowItem;
  iconClassName?: string;
  valueClassName?: string;
}

export default function InfoRow({
  item,
  iconClassName = "size-4 text-[#8B6357]",
  valueClassName,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="flex size-4 items-center justify-center">
        <Icon name={item.icon} className={iconClassName} />
      </span>
      <span
        className={cn("font-comfortaa text-[12.25px] leading-[17.5px]", valueClassName)}
        style={{ color: item.emphasize ? "#DE6A07" : "#4A5565", fontWeight: item.emphasize ? 700 : 400 }}
      >
        {item.value}
      </span>
    </div>
  );
}

import { Icon } from "@/components/common/Icon";

interface EarningsEmptyStateProps {
  title: string;
  description: string;
}

export function EarningsEmptyState({ title, description }: EarningsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 pb-4 pt-6 text-center">
      <div className="flex size-[56px] items-center justify-center rounded-full bg-[#F5F1EC]">
        <Icon name="clock" size={24} className="text-[#00A63E]" aria-hidden="true" />
      </div>
      <p className="mt-4 font-comfortaa text-[16px] font-medium leading-6 text-[#4A2C55]">{title}</p>
      <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">{description}</p>
    </div>
  );
}

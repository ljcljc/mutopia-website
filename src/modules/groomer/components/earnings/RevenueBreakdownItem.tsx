interface RevenueBreakdownItemProps {
  title: string;
  caption: string;
  amount: string;
  dotClassName: string;
  amountClassName: string;
}

export function RevenueBreakdownItem({
  title,
  caption,
  amount,
  dotClassName,
  amountClassName,
}: RevenueBreakdownItemProps) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#FAF9F7] px-3 py-3">
      <div className="flex items-center gap-3">
        <span className={`size-3 rounded-full ${dotClassName}`} aria-hidden="true" />
        <div>
          <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{title}</p>
          <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#8B6357]">{caption}</p>
        </div>
      </div>

      <p className={`font-comfortaa text-[16px] font-bold leading-6 ${amountClassName}`}>{amount}</p>
    </div>
  );
}

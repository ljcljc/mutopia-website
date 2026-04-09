import { Icon } from "@/components/common/Icon";

interface RecentTransactionItemProps {
  title: string;
  subtitle: string;
  amount: string;
  detail?: string;
  tone: "positive" | "payout";
}

export function RecentTransactionItem({
  title,
  subtitle,
  amount,
  detail,
  tone,
}: RecentTransactionItemProps) {
  const isPayout = tone === "payout";

  return (
    <div
      className={[
        "flex items-center justify-between rounded-r-[12px] px-3 py-3",
        isPayout ? "border-l-[3px] border-l-[#4A2C55] bg-[#FAF9F7]" : "border-l-[3px] border-l-[#27AE60] bg-[#F0FDF4]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {isPayout ? (
          <div className="flex size-10 items-center justify-center rounded-full bg-[#DBEAFE]">
            <Icon name="credit" size={20} className="text-[#3B82F6]" aria-hidden="true" />
          </div>
        ) : null}

        <div>
          <p className="whitespace-pre-line font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{title}</p>
          <p className="mt-0.5 font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">{subtitle}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className={["font-comfortaa text-[18px] font-bold leading-[27px]", isPayout ? "text-[#4A2C55]" : "text-[#27AE60]"].join(" ")}>
          {amount}
        </p>
        {detail ? <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#059669]">{detail}</p> : null}
      </div>
    </div>
  );
}

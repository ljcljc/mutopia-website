import { useState } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { RevenueBreakdownItem } from "@/modules/groomer/components/earnings/RevenueBreakdownItem";
import { RecentTransactionItem } from "@/modules/groomer/components/earnings/RecentTransactionItem";
import { TimeframeSelectorDialog } from "@/modules/groomer/components/earnings/TimeframeSelectorDialog";
import { CustomRangeModal } from "@/modules/groomer/components/earnings/CustomRangeModal";
import { formatRangeDate } from "@/modules/groomer/components/earnings/utils";

const revenueItems = [
  {
    title: "Grooming & bath",
    caption: "12 completed jobs",
    amount: "$650.00",
    dotClassName: "bg-[#4A2C55]",
    amountClassName: "text-[#4A2C55]",
  },
  {
    title: "Client tips",
    caption: "8 tips received",
    amount: "$140.50",
    dotClassName: "bg-[#27AE60]",
    amountClassName: "text-[#27AE60]",
  },
] as const;

const timeframeOptions = ["Today", "This week", "Last week", "This month", "Last month", "Custom range"] as const;

const transactionItems = [
  {
    title: "Max - Full groom",
    subtitle: "Today, 11:30 AM",
    amount: "+$105.00",
    detail: "$85 + $20 tip",
    tone: "positive" as const,
  },
  {
    title: "Bella - Bath & brush",
    subtitle: "Today, 9:00 AM",
    amount: "+$65.00",
    tone: "positive" as const,
  },
  {
    title: "Bi-weekly payout\nTD Bank",
    subtitle: "Feb 23",
    amount: "-$920.00",
    tone: "payout" as const,
  },
  {
    title: "Luna - Full groom",
    subtitle: "Feb 22, 1:15 PM",
    amount: "+$95.00",
    detail: "$85 + $10 tip",
    tone: "positive" as const,
  },
] as const;

function RevenueBreakdownCard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("This week");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customRangeStartDate, setCustomRangeStartDate] = useState(new Date(2025, 2, 4));
  const [customRangeEndDate, setCustomRangeEndDate] = useState(new Date(2025, 10, 5));
  const customRangeLabel = `${formatRangeDate(customRangeStartDate)}-${formatRangeDate(customRangeEndDate)}`;

  return (
    <>
      <section className="rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between">
            <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Revenue breakdown</h2>
            <button
              type="button"
              onClick={() => setIsTimeframeOpen(true)}
              className="inline-flex items-center gap-2 bg-transparent p-0 font-comfortaa text-[14px] font-medium leading-[21px] text-[#DE6A07] transition-colors hover:text-[#C45E06] active:text-[#C45E06]"
            >
              <span>{selectedTimeframe}</span>
              <Icon name="chevron-down" size={16} className="text-current" aria-hidden="true" />
            </button>
          </div>
          {selectedTimeframe === "Custom range" ? (
            <p className="font-comfortaa text-[14px] font-normal leading-[21px] text-[#00A63E] underline decoration-[#00A63E] underline-offset-[2px]">
              {customRangeLabel}
            </p>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {revenueItems.map((item) => (
            <RevenueBreakdownItem key={item.title} {...item} />
          ))}
        </div>
      </section>

      <TimeframeSelectorDialog
        open={isTimeframeOpen}
        selectedTimeframe={selectedTimeframe}
        timeframeOptions={timeframeOptions}
        onOpenChange={setIsTimeframeOpen}
        onSelectTimeframe={(timeframe) => {
          setSelectedTimeframe(timeframe);
          setIsTimeframeOpen(false);
        }}
        onSelectCustomRange={() => {
          setIsTimeframeOpen(false);
          setIsCustomRangeOpen(true);
        }}
      />

      <CustomRangeModal
        open={isCustomRangeOpen}
        startDate={customRangeStartDate}
        endDate={customRangeEndDate}
        onClose={() => setIsCustomRangeOpen(false)}
        onConfirm={(nextStartDate, nextEndDate) => {
          setCustomRangeStartDate(nextStartDate);
          setCustomRangeEndDate(nextEndDate);
          setSelectedTimeframe("Custom range");
          setIsCustomRangeOpen(false);
        }}
      />
    </>
  );
}

function RecentTransactionCard() {
  return (
    <section className="rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between">
        <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Recent transaction</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 bg-transparent p-0 font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22] transition-colors hover:text-[#C96F1E] active:text-[#C96F1E]"
        >
          <span>View All</span>
          <Icon name="button-arrow" size={14} className="text-current" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {transactionItems.map((item) => (
          <RecentTransactionItem key={`${item.title}-${item.subtitle}`} {...item} />
        ))}
      </div>
    </section>
  );
}

export default function GroomerEarningsPage() {
  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-3">
      <div className="space-y-4">
        <header>
          <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Earnings</h1>
        </header>

        <section className="rounded-[20px] bg-white px-6 py-6 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center">
            <p className="font-comfortaa text-[14px] leading-[21px] text-[#6B7280]">Available to cash out</p>
            <p className="mt-2 font-comfortaa text-[40px] font-bold leading-none text-[#27AE60]">$840.50</p>
            <p className="mt-2 font-comfortaa text-[16px] font-bold leading-[19.5px] text-[#8B6357]">$ 98.36 on the way</p>
            <p className="mt-3 text-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357]">
              Next automatic payout:
              <span className="font-medium text-[#4A2C55]"> Monday, Mar 2</span>
            </p>
          </div>

          <OrangeButton
            type="button"
            fullWidth
            className="mt-4 h-12! bg-[linear-gradient(180deg,#E67E22_0%,#F39C12_100%)] hover:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)] active:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)] focus-visible:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)]"
          >
            <span className="flex flex-col items-center text-white">
              <span className="font-comfortaa text-[16px] font-semibold leading-7">$ Cash out now</span>
              <span className="font-comfortaa text-[10px] leading-3">Fee: $1.99</span>
            </span>
          </OrangeButton>
        </section>

        <RevenueBreakdownCard />
        <RecentTransactionCard />
      </div>
    </div>
  );
}

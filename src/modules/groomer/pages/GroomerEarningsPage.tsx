import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrangeButton } from "@/components/common";
import { Spinner } from "@/components/common/Spinner";
import { Icon } from "@/components/common/Icon";
import { RevenueBreakdownItem } from "@/modules/groomer/components/earnings/RevenueBreakdownItem";
import { RecentTransactionItem } from "@/modules/groomer/components/earnings/RecentTransactionItem";
import { TimeframeSelectorDialog } from "@/modules/groomer/components/earnings/TimeframeSelectorDialog";
import { CustomRangeModal } from "@/modules/groomer/components/earnings/CustomRangeModal";
import { EarningsEmptyState } from "@/modules/groomer/components/earnings/EarningsEmptyState";
import { formatRangeDate, getDateRangeForTimeframe } from "@/modules/groomer/components/earnings/utils";
import {
  getGroomerEarningTransactions,
  getGroomerEarningsSummary,
  getGroomerPayoutSummary,
  groomerCashOut,
} from "@/lib/api";
import { formatCurrency, mapTransactionPage, type TransactionItemView } from "@/modules/groomer/components/earnings/transactionUtils";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

const timeframeOptions = ["Today", "This week", "Last week", "This month", "Last month", "Custom range"] as const;

type SummaryData = {
  availableAmount: number;
  heldAmount: number;
  cashedOutAmount: number;
  serviceAmount: number;
  completedCount: number;
  tipAmount: number;
  tipCount: number;
};

type PayoutData = {
  cashOutFeeRate: number;
};

const DEFAULT_SUMMARY: SummaryData = {
  availableAmount: 0,
  heldAmount: 0,
  cashedOutAmount: 0,
  serviceAmount: 0,
  completedCount: 0,
  tipAmount: 0,
  tipCount: 0,
};

const DEFAULT_PAYOUT: PayoutData = {
  cashOutFeeRate: 0.015,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getNumber(source: Record<string, unknown>, key: string, fallback = 0): number {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function formatCashOutCta(value: number): string {
  return value > 0 ? `${formatCurrency(value)} Cash out now` : "$ Cash out now";
}

function formatFeeLabel(rate: number): string {
  return `Fee: ${(rate * 100).toFixed(rate * 100 >= 1 ? 1 : 2).replace(/\.0$/, "")}%`;
}

function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function mapSummary(raw: unknown): SummaryData {
  const record = asRecord(raw);
  return {
    availableAmount: getNumber(record, "available"),
    heldAmount: getNumber(record, "held"),
    cashedOutAmount: getNumber(record, "cashed_out"),
    serviceAmount: getNumber(record, "service_amount"),
    completedCount: getNumber(record, "completed_count"),
    tipAmount: getNumber(record, "tip_amount"),
    tipCount: getNumber(record, "tip_count"),
  };
}

function mapPayout(raw: unknown): PayoutData {
  const record = asRecord(raw);
  return {
    cashOutFeeRate: getNumber(record, "cash_out_fee_rate", DEFAULT_PAYOUT.cashOutFeeRate),
  };
}

function LoadingCard({ label }: { label: string }) {
  return (
    <section className="flex min-h-[160px] items-center justify-center rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={36} color="#DE6A07" showTrack trackOpacity={0.22} />
        <p className="font-comfortaa text-[13px] font-medium leading-5 text-[#8B6357]">{label}</p>
      </div>
    </section>
  );
}

function RevenueBreakdownCard({
  summary,
  selectedTimeframe,
  customRangeStartDate,
  customRangeEndDate,
  isLoading,
  onChangeTimeframe,
  onConfirmCustomRange,
}: {
  summary: SummaryData;
  selectedTimeframe: string;
  customRangeStartDate: Date;
  customRangeEndDate: Date;
  isLoading: boolean;
  onChangeTimeframe: (timeframe: string) => void;
  onConfirmCustomRange: (startDate: Date, endDate: Date) => void;
}) {
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const customRangeLabel = `${formatRangeDate(customRangeStartDate)}-${formatRangeDate(customRangeEndDate)}`;

  const revenueItems = [
    {
      title: "Grooming & bath",
      caption: `${summary.completedCount} completed job${summary.completedCount === 1 ? "" : "s"}`,
      amount: formatCurrency(summary.serviceAmount),
      rawAmount: summary.serviceAmount,
      dotClassName: "bg-[#4A2C55]",
      amountClassName: "text-[#4A2C55]",
    },
    {
      title: "Client tips",
      caption: `${summary.tipCount} tip${summary.tipCount === 1 ? "" : "s"} received`,
      amount: formatCurrency(summary.tipAmount),
      rawAmount: summary.tipAmount,
      dotClassName: "bg-[#27AE60]",
      amountClassName: "text-[#27AE60]",
    },
  ].filter((item) => item.rawAmount > 0);

  return (
    <>
      <section className="rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center justify-between">
            <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Revenue breakdown</h2>
            <button
              type="button"
              onClick={() => setIsTimeframeOpen(true)}
              className="inline-flex cursor-pointer items-center gap-2 bg-transparent p-0 font-comfortaa text-[14px] font-medium leading-[21px] text-[#DE6A07] transition-colors hover:text-[#C45E06] active:text-[#C45E06]"
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

        {isLoading ? (
          <div className="mt-6 flex justify-center">
            <Spinner size={28} color="#DE6A07" showTrack trackOpacity={0.22} />
          </div>
        ) : revenueItems.length > 0 ? (
          <div className="mt-4 space-y-3">
            {revenueItems.map((item) => (
              <RevenueBreakdownItem key={item.title} {...item} />
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <EarningsEmptyState title="No record" description="Select another timeframe" />
          </div>
        )}
      </section>

      <TimeframeSelectorDialog
        open={isTimeframeOpen}
        selectedTimeframe={selectedTimeframe}
        timeframeOptions={timeframeOptions}
        onOpenChange={setIsTimeframeOpen}
        onSelectTimeframe={(timeframe) => {
          onChangeTimeframe(timeframe);
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
          setIsCustomRangeOpen(false);
          onConfirmCustomRange(nextStartDate, nextEndDate);
        }}
      />
    </>
  );
}

function RecentTransactionCard({
  transactions,
  isLoading,
  onViewAll,
}: {
  transactions: TransactionItemView[];
  isLoading: boolean;
  onViewAll: () => void;
}) {
  return (
    <section className="rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Recent transaction</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex cursor-pointer items-center gap-1.5 bg-transparent p-0 font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22] transition-colors hover:text-[#C96F1E] active:text-[#C96F1E]"
        >
          <span>View all</span>
          <Icon name="button-arrow" size={14} className="text-current" aria-hidden="true" />
        </button>
      </div>

      {isLoading ? (
        <div className="mt-6 flex justify-center">
          <Spinner size={28} color="#DE6A07" showTrack trackOpacity={0.22} />
        </div>
      ) : transactions.length > 0 ? (
        <div className="mt-4 space-y-3">
          {transactions.map(({ key, ...item }) => (
            <RecentTransactionItem key={key} {...item} />
          ))}
        </div>
      ) : (
        <div className="mt-2">
          <EarningsEmptyState title="No record" description="Ready to start your work?" />
        </div>
      )}
    </section>
  );
}

export default function GroomerEarningsPage() {
  const navigate = useNavigate();
  const initialRange = getDateRangeForTimeframe("This week")!;
  const [selectedTimeframe, setSelectedTimeframe] = useState("This week");
  const [customRangeStartDate, setCustomRangeStartDate] = useState(initialRange.startDate);
  const [customRangeEndDate, setCustomRangeEndDate] = useState(initialRange.endDate);
  const [summary, setSummary] = useState<SummaryData>(DEFAULT_SUMMARY);
  const [payout, setPayout] = useState<PayoutData>(DEFAULT_PAYOUT);
  const [transactions, setTransactions] = useState<TransactionItemView[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const activeRange = selectedTimeframe === "Custom range"
    ? { startDate: customRangeStartDate, endDate: customRangeEndDate }
    : getDateRangeForTimeframe(selectedTimeframe) ?? { startDate: customRangeStartDate, endDate: customRangeEndDate };

  const loadSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const data = await getGroomerEarningsSummary({
        date_from: formatApiDate(activeRange.startDate),
        date_to: formatApiDate(activeRange.endDate),
      });
      setSummary(mapSummary(data));
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to load earnings summary"));
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTransactions(true);
    try {
      const data = await getGroomerEarningTransactions({ page: 1, page_size: 20 });
      setTransactions(mapTransactionPage(data).items);
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to load transactions"));
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const loadPayout = async () => {
    try {
      const data = await getGroomerPayoutSummary();
      setPayout(mapPayout(data));
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to load payout settings"));
    }
  };

  useEffect(() => {
    void loadSummary();
  }, [selectedTimeframe, customRangeStartDate, customRangeEndDate]);

  useEffect(() => {
    void loadTransactions();
    void loadPayout();
  }, []);

  const handleChangeTimeframe = (timeframe: string) => {
    if (timeframe !== "Custom range") {
      const nextRange = getDateRangeForTimeframe(timeframe);
      if (nextRange) {
        setCustomRangeStartDate(nextRange.startDate);
        setCustomRangeEndDate(nextRange.endDate);
      }
    }
    setSelectedTimeframe(timeframe);
  };

  const handleConfirmCustomRange = (startDate: Date, endDate: Date) => {
    setCustomRangeStartDate(startDate);
    setCustomRangeEndDate(endDate);
    setSelectedTimeframe("Custom range");
  };

  const handleCashOut = async () => {
    if (summary.availableAmount <= 0) return;
    setIsCashingOut(true);
    try {
      const result = await groomerCashOut({ amount: summary.availableAmount.toFixed(2) });
      const record = asRecord(result);
      toast.success(`Cash out submitted: ${formatCurrency(getNumber(record, "net_amount", summary.availableAmount))}`);
      await Promise.all([loadSummary(), loadTransactions(), loadPayout()]);
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Cash out failed"));
    } finally {
      setIsCashingOut(false);
    }
  };

  const isInitialLoading = isLoadingSummary && isLoadingTransactions;

  if (isInitialLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(112*var(--px393))] pt-[calc(8*var(--px393))] sm:px-5 sm:pb-28 sm:pt-2">
        <div className="space-y-4">
          <header>
            <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Earnings</h1>
          </header>
          <LoadingCard label="Loading earnings..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(112*var(--px393))] pt-[calc(8*var(--px393))] sm:px-5 sm:pb-28 sm:pt-2">
      <div className="space-y-4">
        <header>
          <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Earnings</h1>
        </header>

        <section className="rounded-[20px] bg-white px-6 py-6 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center">
            <p className="font-comfortaa text-[14px] leading-[21px] text-[#6B7280]">Available to cash out</p>
            <p className="mt-2 font-comfortaa text-[40px] font-bold leading-none text-[#27AE60]">{formatCurrency(summary.availableAmount)}</p>
            <p className="mt-2 font-comfortaa text-[16px] font-bold leading-[19.5px] text-[#8B6357]">{formatCurrency(summary.heldAmount)} on the way</p>
            <p className="mt-3 text-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357]">
              Total cashed out:
              <span className="font-medium text-[#4A2C55]"> {formatCurrency(summary.cashedOutAmount)}</span>
            </p>
          </div>

          <OrangeButton
            type="button"
            fullWidth
            loading={isCashingOut}
            disabled={summary.availableAmount <= 0}
            onClick={() => void handleCashOut()}
            className="mt-4 h-12! bg-[linear-gradient(180deg,#E67E22_0%,#F39C12_100%)] hover:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)] active:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)] focus-visible:bg-[linear-gradient(180deg,#D8731D_0%,#E28F10_100%)]"
          >
            <span className="flex flex-col items-center text-white">
              <span className="font-comfortaa text-[16px] font-semibold leading-7">{formatCashOutCta(summary.availableAmount)}</span>
              <span className="font-comfortaa text-[10px] leading-3">{formatFeeLabel(payout.cashOutFeeRate)}</span>
            </span>
          </OrangeButton>
        </section>

        <RevenueBreakdownCard
          summary={summary}
          selectedTimeframe={selectedTimeframe}
          customRangeStartDate={customRangeStartDate}
          customRangeEndDate={customRangeEndDate}
          isLoading={isLoadingSummary}
          onChangeTimeframe={handleChangeTimeframe}
          onConfirmCustomRange={handleConfirmCustomRange}
        />
        <RecentTransactionCard
          transactions={transactions}
          isLoading={isLoadingTransactions}
          onViewAll={() => navigate("/groomer/earnings/transactions")}
        />
      </div>
    </div>
  );
}

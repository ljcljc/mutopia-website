import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/common/Spinner";
import { Icon } from "@/components/common/Icon";
import { EarningsEmptyState } from "@/modules/groomer/components/earnings/EarningsEmptyState";
import { RecentTransactionItem } from "@/modules/groomer/components/earnings/RecentTransactionItem";
import { getGroomerEarningTransactions } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { mapTransactionPage, mergeTransactionItems, type TransactionItemView } from "@/modules/groomer/components/earnings/transactionUtils";
import { toast } from "sonner";

const PAGE_SIZE = 20;

function getActionErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function LoadingCard({ label }: { label: string }) {
  return (
    <section className="flex min-h-[200px] items-center justify-center rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={36} color="#DE6A07" showTrack trackOpacity={0.22} />
        <p className="font-comfortaa text-[13px] font-medium leading-5 text-[#8B6357]">{label}</p>
      </div>
    </section>
  );
}

export default function GroomerTransactionsPage() {
  const navigate = useNavigate();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [transactions, setTransactions] = useState<TransactionItemView[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isLoading = isInitialLoading || isLoadingMore;

  const loadPage = async (nextPage: number) => {
    if (isLoadingMore || (nextPage !== 1 && !hasMore)) return;

    if (nextPage === 1) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await getGroomerEarningTransactions({ page: nextPage, page_size: PAGE_SIZE });
      const result = mapTransactionPage(response);
      setTransactions((current) => mergeTransactionItems(nextPage === 1 ? result.items : [...current, ...result.items]));
      setPage(result.page);
      setTotalCount(result.total);
      setHasMore(result.hasMore);
    } catch (error) {
      toast.error(getActionErrorMessage(error, "Failed to load transactions"));
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    void loadPage(1);
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      void loadPage(page + 1);
    }, { rootMargin: "160px 0px" });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, page]);

  const summaryLabel = useMemo(() => {
    if (isInitialLoading) return "";
    if (totalCount === 0) return "No transactions yet";
    return `Showing ${transactions.length} of ${totalCount}`;
  }, [isInitialLoading, totalCount, transactions.length]);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(32*var(--px393))] pt-[calc(8*var(--px393))] sm:px-5 sm:pb-10 sm:pt-2">
      <div className="space-y-4">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/groomer/earnings")}
            className="flex size-10 items-center justify-center rounded-full bg-white/14 text-white transition-colors hover:bg-white/20 sm:hidden"
            aria-label="Back to earnings"
          >
            <Icon name="nav-prev" size={18} className="text-current" aria-hidden="true" />
          </button>
          <div className="sm:hidden">
            <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Transaction</h1>
            {summaryLabel ? (
              <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[rgba(255,255,255,0.78)]">{summaryLabel}</p>
            ) : null}
          </div>
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-2 font-comfortaa text-[20px] font-bold leading-[22px] text-white sm:flex"
          >
            <button
              type="button"
              onClick={() => navigate("/groomer/earnings")}
              className="cursor-pointer transition-opacity hover:opacity-80"
            >
              Earnings
            </button>
            <span aria-hidden="true">&gt;</span>
            <span>Transaction</span>
          </nav>
        </header>

        {isInitialLoading ? (
          <LoadingCard label="Loading transactions..." />
        ) : (
          <section className="rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">All transactions</h2>
                <p className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">
                  {hasMore ? "Scroll to load more transaction records" : "Latest first"}
                </p>
              </div>
            </div>

            {transactions.length > 0 ? (
              <>
                <div className="mt-4 space-y-3">
                  {transactions.map(({ key, ...item }) => (
                    <RecentTransactionItem key={key} {...item} />
                  ))}
                </div>

                <div ref={loadMoreRef} className="flex min-h-12 items-center justify-center pt-4">
                  {isLoadingMore ? (
                    <Spinner size={24} color="#DE6A07" showTrack trackOpacity={0.22} />
                  ) : hasMore ? (
                    <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">Keep scrolling to load more</p>
                  ) : (
                    <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">No more transactions</p>
                  )}
                </div>
              </>
            ) : (
              <div className="mt-2">
                <EarningsEmptyState title="No record" description="Your transaction history will show here." />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

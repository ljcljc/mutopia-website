import { useEffect, useState } from "react";
import { getGroomerPayoutSummary } from "@/lib/api";
import { DEFAULT_GROOMER_PAYOUT_SUMMARY, mapGroomerPayoutSummary, type GroomerPayoutSummary } from "@/modules/groomer/utils/payout";

type UseGroomerPayoutSummaryOptions = {
  onError?: (error: unknown) => void;
};

export function useGroomerPayoutSummary(options: UseGroomerPayoutSummaryOptions = {}) {
  const [payout, setPayout] = useState<GroomerPayoutSummary>(DEFAULT_GROOMER_PAYOUT_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const { onError } = options;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getGroomerPayoutSummary();
        if (!cancelled) {
          setPayout(mapGroomerPayoutSummary(response));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load groomer payout summary:", error);
          onError?.(error);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [onError]);

  return { payout, isLoading, setPayout };
}

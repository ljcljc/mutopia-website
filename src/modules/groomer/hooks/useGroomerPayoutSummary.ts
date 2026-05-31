import { useEffect, useState } from "react";
import { getGroomerPayoutSummary } from "@/lib/api";
import { DEFAULT_GROOMER_PAYOUT_SUMMARY, mapGroomerPayoutSummary, type GroomerPayoutSummary } from "@/modules/groomer/utils/payout";

export function useGroomerPayoutSummary() {
  const [payout, setPayout] = useState<GroomerPayoutSummary>(DEFAULT_GROOMER_PAYOUT_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getGroomerPayoutSummary();
        if (!cancelled) {
          setError(null);
          setPayout(mapGroomerPayoutSummary(response));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load groomer payout summary:", error);
          setError(error);
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
  }, []);

  return { payout, isLoading, error, setPayout };
}

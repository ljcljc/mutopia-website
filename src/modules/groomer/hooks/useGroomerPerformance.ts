import { useEffect, useState } from "react";
import { getGroomerPerformance } from "@/lib/api";
import { mapGroomerPerformanceData, type GroomerPerformanceSummary } from "@/modules/groomer/utils/performance";

type UseGroomerPerformanceOptions = {
  onError?: (error: unknown) => void;
};

export function useGroomerPerformance(options: UseGroomerPerformanceOptions = {}) {
  const [performance, setPerformance] = useState<GroomerPerformanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { onError } = options;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getGroomerPerformance();
        if (!cancelled) {
          setPerformance(mapGroomerPerformanceData(response));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load groomer performance:", error);
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

  return { performance, isLoading, setPerformance };
}

import { useEffect, useState } from "react";
import { getGroomerPerformance } from "@/lib/api";
import { mapGroomerPerformanceData, type GroomerPerformanceSummary } from "@/modules/groomer/utils/performance";

export function useGroomerPerformance() {
  const [performance, setPerformance] = useState<GroomerPerformanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getGroomerPerformance();
        if (!cancelled) {
          setError(null);
          setPerformance(mapGroomerPerformanceData(response));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load groomer performance:", error);
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

  return { performance, isLoading, error, setPerformance };
}

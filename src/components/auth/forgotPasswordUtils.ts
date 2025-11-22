interface ErrorWithData {
  data?: unknown;
}

interface ErrorDataWithSendCount {
  send_count?: unknown;
}

/**
 * Extracts send_count from an error response so we can keep the frontend state
 * in sync with backend rate limiting.
 */
export const getSendCountFromError = (error: unknown): number | null => {
  if (!error || typeof error !== "object") {
    return null;
  }

  const errWithData = error as ErrorWithData;
  const data = errWithData.data;

  if (!data || typeof data !== "object") {
    return null;
  }

  const { send_count: sendCount } = data as ErrorDataWithSendCount;

  if (typeof sendCount === "number") {
    return sendCount;
  }

  if (typeof sendCount === "string") {
    const parsed = Number(sendCount);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
};

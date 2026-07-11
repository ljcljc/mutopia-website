import { useEffect } from "react";
import { create } from "zustand";
import { getMessageUnreadSummary, type MessageScope } from "@/lib/api";

type ScopeState = {
  unreadCount: number;
  hasUnread: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  lastSyncedAt: number | null;
};

type MessageUnreadState = {
  summaries: Record<MessageScope, ScopeState>;
  setLoading: (scope: MessageScope, isLoading: boolean) => void;
  applySummary: (scope: MessageScope, unreadCount: number) => void;
  adjustUnreadCount: (scope: MessageScope, delta: number) => void;
  reset: () => void;
};

const POLL_INTERVAL_MS = 60_000;

const createScopeState = (): ScopeState => ({
  unreadCount: 0,
  hasUnread: false,
  isLoading: false,
  isInitialized: false,
  lastSyncedAt: null,
});

const initialSummaries = (): Record<MessageScope, ScopeState> => ({
  user: createScopeState(),
  groomer: createScopeState(),
  all: createScopeState(),
});

export const useMessageUnreadStore = create<MessageUnreadState>((set) => ({
  summaries: initialSummaries(),
  setLoading: (scope, isLoading) =>
    set((state) => ({
      summaries: {
        ...state.summaries,
        [scope]: {
          ...state.summaries[scope],
          isLoading,
        },
      },
    })),
  applySummary: (scope, unreadCount) =>
    set((state) => ({
      summaries: {
        ...state.summaries,
        [scope]: {
          ...state.summaries[scope],
          unreadCount,
          hasUnread: unreadCount > 0,
          isLoading: false,
          isInitialized: true,
          lastSyncedAt: Date.now(),
        },
      },
    })),
  adjustUnreadCount: (scope, delta) =>
    set((state) => {
      const nextSummaries = { ...state.summaries };
      const updateScope = (targetScope: MessageScope) => {
        const current = nextSummaries[targetScope];
        if (!current.isInitialized) return;
        const unreadCount = Math.max(0, current.unreadCount + delta);
        nextSummaries[targetScope] = {
          ...current,
          unreadCount,
          hasUnread: unreadCount > 0,
          lastSyncedAt: Date.now(),
        };
      };
      updateScope(scope);
      if (scope !== "all") updateScope("all");
      return { summaries: nextSummaries };
    }),
  reset: () => set({ summaries: initialSummaries() }),
}));

const inFlightRequests = new Map<MessageScope, Promise<void>>();
const pollTimers = new Map<MessageScope, number>();
const subscribers = new Map<MessageScope, number>();
let visibilityListenerAttached = false;

async function refreshUnreadSummary(scope: MessageScope): Promise<void> {
  const existingRequest = inFlightRequests.get(scope);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    useMessageUnreadStore.getState().setLoading(scope, true);
    try {
      const summary = await getMessageUnreadSummary({ channel: "in_app", scope });
      useMessageUnreadStore.getState().applySummary(scope, summary.unread_count);
    } catch (error) {
      console.error(`Failed to load unread summary for ${scope}:`, error);
      useMessageUnreadStore.getState().setLoading(scope, false);
    } finally {
      inFlightRequests.delete(scope);
    }
  })();

  inFlightRequests.set(scope, request);
  return request;
}

function startPolling(scope: MessageScope) {
  if (pollTimers.has(scope)) return;
  void refreshUnreadSummary(scope);
  const timerId = window.setInterval(() => {
    void refreshUnreadSummary(scope);
  }, POLL_INTERVAL_MS);
  pollTimers.set(scope, timerId);
}

function stopPolling(scope: MessageScope) {
  const timerId = pollTimers.get(scope);
  if (timerId !== undefined) {
    window.clearInterval(timerId);
    pollTimers.delete(scope);
  }
}

function handleVisibilityChange() {
  if (document.visibilityState !== "visible") return;
  for (const [scope, count] of subscribers.entries()) {
    if (count > 0) void refreshUnreadSummary(scope);
  }
}

function ensureVisibilityListener() {
  if (visibilityListenerAttached || typeof document === "undefined") return;
  document.addEventListener("visibilitychange", handleVisibilityChange);
  visibilityListenerAttached = true;
}

function cleanupVisibilityListener() {
  const hasActiveSubscribers = Array.from(subscribers.values()).some((count) => count > 0);
  if (!hasActiveSubscribers && visibilityListenerAttached && typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    visibilityListenerAttached = false;
  }
}

export function subscribeToUnreadSummary(scope: MessageScope): () => void {
  subscribers.set(scope, (subscribers.get(scope) ?? 0) + 1);
  ensureVisibilityListener();
  startPolling(scope);

  return () => {
    const currentCount = subscribers.get(scope) ?? 0;
    if (currentCount <= 1) {
      subscribers.delete(scope);
      stopPolling(scope);
    } else {
      subscribers.set(scope, currentCount - 1);
    }
    cleanupVisibilityListener();
  };
}

export function useUnreadSummary(scope: MessageScope) {
  const summary = useMessageUnreadStore((state) => state.summaries[scope]);

  useEffect(() => subscribeToUnreadSummary(scope), [scope]);

  return summary;
}

export function adjustUnreadCount(scope: MessageScope, delta: number) {
  useMessageUnreadStore.getState().adjustUnreadCount(scope, delta);
}

export function getUnreadCount(scope: MessageScope): number {
  return useMessageUnreadStore.getState().summaries[scope].unreadCount;
}

export function resetUnreadSummaries() {
  for (const timerId of pollTimers.values()) {
    window.clearInterval(timerId);
  }
  pollTimers.clear();
  subscribers.clear();
  inFlightRequests.clear();
  cleanupVisibilityListener();
  useMessageUnreadStore.getState().reset();
}

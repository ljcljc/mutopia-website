import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Icon, type IconName } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
import { cn } from "@/components/ui/utils";
import { deleteMessage, getMessages, markAllMessagesRead, markMessageRead, type MessageOut, type MessagePageOut } from "@/lib/api";

type NotificationItem = {
  id: number;
  title: string;
  body: ReactNode;
  time: string;
  iconName: IconName;
  iconBg: string;
  iconSize: number;
  showUnreadDot: boolean;
  dotTop: string;
  dotLeft: string;
  showCheck: boolean;
  showClose: boolean;
};

const NOTIFICATIONS_MAX_AGE_MS = 10000;
const NOTIFICATIONS_PAGE_SIZE = 20;
type NotificationsScope = "all" | "groomer";
type NotificationsVariant = "customer" | "groomer";

type NotificationsCacheEntry = {
  lastFetchedAt: number;
  items: MessageOut[];
  total: number;
  nextPage: number;
  hasMore: boolean;
};

const notificationsCache: Record<NotificationsScope, NotificationsCacheEntry> = {
  all: { lastFetchedAt: 0, items: [], total: 0, nextPage: 1, hasMore: true },
  groomer: { lastFetchedAt: 0, items: [], total: 0, nextPage: 1, hasMore: true },
};

const notificationsInFlight: Partial<Record<NotificationsScope, Promise<MessagePageOut> | null>> = {
  all: null,
  groomer: null,
};

const linkClassName = "text-[#DE6A07] underline hover:text-[#C15A05]";

function TimeStamp({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[#9CA3AF]">
      <Icon name="clock" size={12} className="text-[#9CA3AF]" />
      <span className="font-comfortaa text-[10.5px] leading-[14px]">
        {text}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-[#F3F4F6]">
        <Icon name="notification-empty" size={28} className="text-[#9CA3AF]" />
      </div>
      <div className="mt-3.5 text-center">
        <p className="font-comfortaa font-bold text-[14px] leading-[22px] text-[#4A3C2A]">
          No notifications
        </p>
        <p className="font-comfortaa font-normal text-[12.25px] leading-[17.5px] text-[#6A7282]">
          You're all caught up!
        </p>
      </div>
    </div>
  );
}

function getNotificationStyle(type: string): {
  iconName: IconName;
  iconBg: string;
  iconSize: number;
} {
  const normalized = type.toLowerCase();
  if (normalized.includes("confirm")) {
    return { iconName: "notification-confirmed", iconBg: "#DCFCE7", iconSize: 20 };
  }
  if (normalized.includes("reminder")) {
    return { iconName: "notification-reminder", iconBg: "#FEF3C7", iconSize: 20 };
  }
  if (normalized.includes("refer") || normalized.includes("benefit")) {
    return { iconName: "notification-refer", iconBg: "#FEE2E2", iconSize: 16 };
  }
  if (normalized.includes("refund")) {
    return { iconName: "notification-refund", iconBg: "#DBEAFE", iconSize: 20 };
  }
  return { iconName: "notification-refund", iconBg: "#DBEAFE", iconSize: 20 };
}

function buildNotificationBody(message: MessageOut): ReactNode {
  if (message.link_text && message.link_uri) {
    const isCopyReferCode = message.link_text.toLowerCase().includes("copy unique refer code");
    const linkUri = message.link_uri;
    return (
      <>
        {message.content}{" "}
        <a
          href={message.link_uri}
          className={linkClassName}
          onClick={(event) => {
            if (!isCopyReferCode) return;
            event.preventDefault();
            const clipboard = (
              globalThis as unknown as {
                navigator?: { clipboard?: { writeText: (text: string) => Promise<void> } };
              }
            ).navigator?.clipboard;
            if (!clipboard?.writeText) {
              toast.error("Copy failed. Please try again.");
              return;
            }
            clipboard
              .writeText(linkUri)
              .then(() => {
                toast.success("Copied to clipboard");
              })
              .catch(() => {
                toast.error("Copy failed. Please try again.");
              });
          }}
        >
          {message.link_text}
        </a>
      </>
    );
  }
  return message.content;
}

interface NotificationsProps {
  scope?: NotificationsScope;
  variant?: NotificationsVariant;
}

export default function Notifications({
  scope = "all",
  variant = "customer",
}: NotificationsProps) {
  const [messages, setMessages] = useState<MessageOut[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const messagesRef = useRef<MessageOut[]>([]);
  const totalCountRef = useRef(0);
  const nextPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const channel = "in_app" as const;
  const cache = notificationsCache[scope];
  const scopeParam = scope === "groomer" ? "groomer" : undefined;
  const isGroomerVariant = variant === "groomer";

  const syncCache = (items: MessageOut[], total: number, upcomingPage: number, more: boolean) => {
    notificationsCache[scope] = {
      items,
      total,
      nextPage: upcomingPage,
      hasMore: more,
      lastFetchedAt: Date.now(),
    };
  };

  useEffect(() => {
    messagesRef.current = messages;
    totalCountRef.current = totalCount;
    nextPageRef.current = nextPage;
    hasMoreRef.current = hasMore;
  }, [messages, totalCount, nextPage, hasMore]);

  useEffect(() => {
    let isMounted = true;
    const now = Date.now();
    if (now - cache.lastFetchedAt < NOTIFICATIONS_MAX_AGE_MS && (cache.items.length > 0 || cache.total === 0)) {
      setMessages(cache.items);
      setTotalCount(cache.total);
      setNextPage(cache.nextPage);
      setHasMore(cache.hasMore);
      return () => {
        isMounted = false;
      };
    }
    const loadMessages = async () => {
      setIsInitialLoading(true);
      try {
        if (notificationsInFlight[scope]) {
          const response = await notificationsInFlight[scope];
          if (isMounted) {
            setMessages(response.items);
            setTotalCount(response.total);
            setNextPage(response.page + 1);
            setHasMore(response.page * response.page_size < response.total);
          }
          return;
        }
        notificationsInFlight[scope] = (async () => {
          const response = await getMessages({ page: 1, page_size: NOTIFICATIONS_PAGE_SIZE, channel, scope: scopeParam });
          syncCache(response.items, response.total, response.page + 1, response.page * response.page_size < response.total);
          return response;
        })();
        const response = await notificationsInFlight[scope];
        if (isMounted) {
          setMessages(response.items);
          setTotalCount(response.total);
          setNextPage(response.page + 1);
          setHasMore(response.page * response.page_size < response.total);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        if (isMounted) {
          setMessages([]);
          setTotalCount(0);
          setNextPage(1);
          setHasMore(false);
        }
      } finally {
        if (isMounted) setIsInitialLoading(false);
        notificationsInFlight[scope] = null;
      }
    };
    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [cache.hasMore, cache.items, cache.lastFetchedAt, cache.nextPage, cache.total, scope, scopeParam]);

  const loadOlderMessages = async () => {
    if (isLoadingMoreRef.current || !hasMoreRef.current) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const response = await getMessages({
        page: nextPageRef.current,
        page_size: NOTIFICATIONS_PAGE_SIZE,
        channel,
        scope: scopeParam,
      });
      const nextItems = response.items;
      const mergedItems = [...messagesRef.current, ...nextItems];
      const upcomingPage = response.page + 1;
      const more = response.page * response.page_size < response.total;
      setMessages(mergedItems);
      setTotalCount(response.total);
      setNextPage(upcomingPage);
      setHasMore(more);
      syncCache(mergedItems, response.total, upcomingPage, more);
    } catch (error) {
      console.error("Failed to load older messages:", error);
    } finally {
      isLoadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  const handleListScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isInitialLoading || isLoadingMoreRef.current || !hasMoreRef.current) return;
    if (container.scrollTop + container.clientHeight < container.scrollHeight - 120) return;
    void loadOlderMessages();
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleListScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleListScroll);
    };
  }, [isInitialLoading]);

  useEffect(() => {
    if (isInitialLoading) return;
    const container = scrollContainerRef.current;
    if (!container || !hasMore || isLoadingMoreRef.current) return;
    if (container.scrollHeight <= container.clientHeight + 24) {
      void loadOlderMessages();
    }
  }, [messages.length, hasMore, isInitialLoading]);

  const notifications: NotificationItem[] = useMemo(() => {
    return messages.map((message) => {
      const style = getNotificationStyle(message.type);
      return {
        id: message.id,
        title: message.title,
        body: buildNotificationBody(message),
        time: message.sent_at,
        iconName: style.iconName,
        iconBg: style.iconBg,
        iconSize: style.iconSize,
        showUnreadDot: !message.is_read,
        dotTop: "2px",
        dotLeft: "32.5px",
        showCheck: !message.is_read,
        showClose: true,
      };
    });
  }, [messages]);

  const handleMarkAllAsRead = () => {
    markAllMessagesRead({ channel, scope: scopeParam }).then(() => {
      setMessages((prev) => {
        const nextItems = prev.map((item) => ({ ...item, is_read: true }));
        syncCache(nextItems, totalCountRef.current, nextPageRef.current, hasMoreRef.current);
        return nextItems;
      });
    }).catch((error) => {
      console.error("Failed to mark all as read:", error);
    });
  };

  const handleMarkRead = (id: number) => {
    setSwipedId(null);
    markMessageRead(id).then(() => {
      setMessages((prev) => {
        const nextItems = prev.map((item) => (item.id === id ? { ...item, is_read: true } : item));
        syncCache(nextItems, totalCountRef.current, nextPageRef.current, hasMoreRef.current);
        return nextItems;
      });
    }).catch((error) => {
      console.error("Failed to mark message read:", error);
    });
  };

  const handleDelete = async (id: number) => {
    if (deletingId === id) return;
    setSwipedId(null);
    setDeletingId(id);
    try {
      const result = await deleteMessage(id);
      if (result.ok) {
        const nextItems = messagesRef.current.filter((item) => item.id !== id);
        const nextTotal = Math.max(0, totalCountRef.current - 1);
        const more = nextItems.length < nextTotal;
        setMessages(nextItems);
        setTotalCount(nextTotal);
        setHasMore(more);
        syncCache(nextItems, nextTotal, nextPageRef.current, more);
      } else {
        console.error("Failed to delete message: ok=false");
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={cn(
        "flex h-full min-h-0 w-full flex-col overflow-hidden",
        isGroomerVariant
          ? "bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(112*var(--px393))] pt-[calc(8*var(--px393))] sm:px-5 sm:pb-28 sm:pt-2 lg:pb-0"
          : ""
      )}
    >
      <div
        className={cn(
          "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden pb-8 lg:pb-0",
          isGroomerVariant ? "" : "mx-auto max-w-[944px] px-6"
        )}
      >
        <div
          className={cn(
            "mb-5 flex shrink-0 items-center justify-between",
            isGroomerVariant && "sticky top-0 z-10 bg-[#633479]"
          )}
        >
            <h1 className={cn(
              "font-comfortaa text-[20px] font-bold text-[#4A3C2A]",
              isGroomerVariant && "leading-[22px] text-white"
            )}>
              Notifications
            </h1>
            {totalCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className={cn(
                  "group flex cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-3 py-1 text-[#00A63E] hover:border-[#00A63E]",
                  isGroomerVariant && "text-[#6CC04A] hover:border-[#6CC04A]"
                )}
              >
                <Icon name="check-green" size={16} className="text-current" />
                <span className="font-comfortaa font-medium text-[12.25px] leading-[17.5px] text-current">
                  Mark all as read
                </span>
              </button>
            ) : null}
          </div>

          <div
            ref={scrollContainerRef}
            className="flex min-h-0 flex-1 w-full flex-col gap-4 overflow-y-auto pr-1"
          >
            {isInitialLoading ? (
              <div className={cn("text-[#4A3C2A] text-sm py-4", isGroomerVariant && "text-white")}>Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className={cn(
                "w-full rounded-xl border border-[rgba(0,0,0,0.10)] bg-[rgba(255,255,255,0.7)] px-[21px] py-[21px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10),0px_1px_2px_-1px_rgba(0,0,0,0.10)]",
                isGroomerVariant && "border-[rgba(255,255,255,0.18)] bg-white"
              )}>
                <EmptyState />
              </div>
            ) : (
              <>
                {notifications.map((item) => {
                const isRead = messages.find((m) => m.id === item.id)?.is_read ?? true;
                const showReadAction = item.showCheck && !isRead;
                const showDeleteAction = item.showClose;
                const actionWidth = showReadAction || showDeleteAction ? 56 : 0;
                return (
                  <div key={item.id} className="w-full">
                    <div className="hidden rounded-xl border border-[rgba(0,0,0,0.1)] bg-white px-[21px] py-[21px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] sm:block">
                      <div className="flex gap-3.5">
                        <div className="relative size-10">
                          <div
                            className="flex size-10 items-center justify-center rounded-full"
                            style={{ backgroundColor: item.iconBg }}
                          >
                            <Icon name={item.iconName} size={item.iconSize} />
                          </div>
                          {item.showUnreadDot && !isRead && (
                            <span
                              className="absolute size-[7.2px] bg-[#EF4444] rounded-full"
                              style={{ top: item.dotTop, left: item.dotLeft }}
                            />
                          )}
                        </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h2 className="font-comfortaa font-bold text-[14px] leading-[17.5px] text-[#4A3C2A]">
                                  {item.title}
                                </h2>
                                <p className="mt-1 font-comfortaa text-[12.25px] leading-[17.5px] text-[#6A7282]">
                                  {item.body}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5">
                              {item.showCheck && (
                                <button
                                  type="button"
                                  onClick={() => handleMarkRead(item.id)}
                                  className="size-4 cursor-pointer text-[#00A63E] hover:text-[#008A2E]"
                                  aria-label="Mark as read"
                                >
                                  <Icon
                                    name="check-green"
                                    size={16}
                                    className="text-current"
                                  />
                                </button>
                              )}
                              {item.showClose && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  disabled={deletingId === item.id}
                                  className="size-4 cursor-pointer text-[#EF4444] hover:text-[#D1202B]"
                                  aria-label="Dismiss"
                                >
                                  <Icon
                                    name="trash"
                                    size={16}
                                    className="text-current"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="mt-1.5">
                            <TimeStamp text={item.time} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="sm:hidden relative"
                      onTouchStart={(event) => {
                        const touch = event.touches[0];
                        touchStartXRef.current = touch?.clientX ?? 0;
                        touchStartYRef.current = touch?.clientY ?? 0;
                      }}
                      onTouchEnd={(event) => {
                        const touch = event.changedTouches[0];
                        const endX = touch?.clientX ?? 0;
                        const endY = touch?.clientY ?? 0;
                        const deltaX = touchStartXRef.current - endX;
                        const deltaY = Math.abs(touchStartYRef.current - endY);
                        if (deltaX > 30 && deltaX > deltaY) {
                          setSwipedId(item.id);
                          return;
                        }
                        if (deltaX < -20) {
                          setSwipedId(null);
                        }
                      }}
                    >
                      {actionWidth ? (
                        <div
                          className={`absolute right-0 top-2 bottom-2 flex flex-col gap-2 transition-opacity duration-200 ${
                            swipedId === item.id ? "opacity-100" : "opacity-0 pointer-events-none"
                          }`}
                          style={{ width: `${actionWidth}px` }}
                        >
                          {showReadAction ? (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(item.id)}
                              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-[#16A34A] text-[11px] font-semibold text-white"
                            >
                              <Icon name="check-green" size={16} className="text-white" />
                              <span>Read</span>
                            </button>
                          ) : null}
                          {showDeleteAction ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg bg-[#EF4444] text-[11px] font-semibold text-white"
                            >
                              <Icon name="trash" size={16} className="text-white" />
                              <span>Delete</span>
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                      <div
                        className="relative z-10 overflow-hidden rounded-[14px] border border-[rgba(0,0,0,0.08)] bg-white px-2 shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out"
                        style={{
                          transform:
                            swipedId === item.id && actionWidth
                              ? `translateX(-${actionWidth + 8}px)`
                              : "translateX(0px)",
                        }}
                        onClick={() => {
                          if (swipedId === item.id) setSwipedId(null);
                        }}
                      >
                        <div className="flex gap-3 px-2 py-3.5">
                          <div className="relative size-9">
                            <div
                              className="flex size-9 items-center justify-center rounded-full"
                              style={{ backgroundColor: item.iconBg }}
                            >
                              <Icon name={item.iconName} size={item.iconSize} />
                            </div>
                            {item.showUnreadDot && !isRead && (
                              <span
                                className="absolute size-1.5 rounded-full bg-[#EF4444]"
                                style={{ top: "2px", right: "2px" }}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h2 className="font-comfortaa font-bold text-[14px] leading-[18px] text-[#4A3C2A]">
                              {item.title}
                            </h2>
                            <p className="mt-[3px] font-comfortaa text-[12px] leading-[16px] text-[#6A7282]">
                              {item.body}
                            </p>
                            <div className="mt-1.5">
                              <TimeStamp text={item.time} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
                <div className="flex min-h-8 items-center justify-center">
                  {isLoadingMore ? (
                    <div className="flex items-center gap-2 py-1 text-[12px] text-[#8B6357]">
                      <Spinner size={16} color="#DE6A07" showTrack trackOpacity={0.18} />
                      <div>Loading more notifications...</div>
                    </div>
                  ) : hasMore ? (
                    <div className="py-1 text-[12px] text-[#8B6357]">Scroll up to load more</div>
                  ) : (
                    <div className="py-1 text-[12px] text-[#8B6357]">No more notifications</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
  );
}

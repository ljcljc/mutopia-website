import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/common/Icon";
import { deleteMessage, getMessages, markAllMessagesRead, markMessageRead, type MessageOut } from "@/lib/api";

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
let notificationsLastFetchedAt = 0;
let notificationsLastItems: MessageOut[] = [];
let notificationsInFlight: Promise<MessageOut[]> | null = null;

const linkClassName = "text-[#DE6A07] underline hover:text-[#C15A05]";

function TimeStamp({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[7px] text-[#9CA3AF]">
      <Icon name="clock" size={12} className="text-[#9CA3AF]" />
      <span className="font-['Comfortaa:Regular',sans-serif] text-[10.5px] leading-[14px]">
        {text}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-[32px]">
      <div className="bg-[#F3F4F6] rounded-full size-[56px] flex items-center justify-center">
        <Icon name="notification-empty" size={28} className="text-[#9CA3AF]" />
      </div>
      <div className="mt-[14px] text-center">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[22px] text-[#4A3C2A]">
          No notifications
        </p>
        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#6A7282]">
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
    return (
      <>
        {message.content}{" "}
        <a href={message.link_uri} className={linkClassName}>
          {message.link_text}
        </a>
      </>
    );
  }
  return message.content;
}

export default function Notifications() {
  const [messages, setMessages] = useState<MessageOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const channel = "in_app" as const;

  useEffect(() => {
    let isMounted = true;
    const now = Date.now();
    if (now - notificationsLastFetchedAt < NOTIFICATIONS_MAX_AGE_MS && notificationsLastItems.length > 0) {
      setMessages(notificationsLastItems);
      return () => {
        isMounted = false;
      };
    }
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        if (notificationsInFlight) {
          const items = await notificationsInFlight;
          if (isMounted) setMessages(items);
          return;
        }
        notificationsInFlight = (async () => {
          const response = await getMessages({ page: 1, page_size: 50, channel });
          const items = response.items || [];
          notificationsLastItems = items;
          notificationsLastFetchedAt = Date.now();
          return items;
        })();
        const items = await notificationsInFlight;
        if (isMounted) {
          setMessages(items);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        if (isMounted) setMessages([]);
      } finally {
        if (isMounted) setIsLoading(false);
        notificationsInFlight = null;
      }
    };
    loadMessages();
    return () => {
      isMounted = false;
    };
  }, []);

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
    markAllMessagesRead({ channel }).then(() => {
      setMessages((prev) => prev.map((item) => ({ ...item, is_read: true })));
    }).catch((error) => {
      console.error("Failed to mark all as read:", error);
    });
  };

  const handleMarkRead = (id: number) => {
    markMessageRead(id).then(() => {
      setMessages((prev) => prev.map((item) => (item.id === id ? { ...item, is_read: true } : item)));
    }).catch((error) => {
      console.error("Failed to mark message read:", error);
    });
  };

  const handleDelete = async (id: number) => {
    if (deletingId === id) return;
    setDeletingId(id);
    try {
      const result = await deleteMessage(id);
      if (result.ok) {
        setMessages((prev) => prev.filter((item) => item.id !== id));
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
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 pb-8 flex-1">
        <div className="flex flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <h1 className="font-['Comfortaa:Bold',sans-serif] font-bold text-[20px] text-[#4A3C2A]">
              Notifications
            </h1>
            {notifications.length > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="group flex items-center gap-[6px] px-[12px] py-[4px] rounded-[12px] text-[#00A63E] border border-transparent hover:border-[#00A63E] cursor-pointer"
              >
                <Icon name="check-green" size={16} className="text-current" />
                <span className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-current">
                  Mark all as read
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            {isLoading ? (
              <div className="text-[#4A3C2A] text-sm py-4">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="w-full rounded-[12px] border border-[rgba(0,0,0,0.10)] bg-[rgba(255,255,255,0.7)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.10),0px_1px_2px_-1px_rgba(0,0,0,0.10)] px-[21px] py-[21px]">
                <EmptyState />
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = messages.find((m) => m.id === item.id)?.is_read ?? true;
                return (
                  <div
                    key={item.id}
                    className="w-full bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] px-[21px] py-[21px]"
                  >
                  <div className="flex gap-[14px]">
                    <div className="relative size-[40px]">
                      <div
                        className="size-[40px] rounded-full flex items-center justify-center"
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
                          <h2 className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[17.5px] text-[#4A3C2A]">
                            {item.title}
                          </h2>
                          <p className="mt-[4px] font-['Comfortaa:Regular',sans-serif] text-[12.25px] leading-[17.5px] text-[#6A7282]">
                            {item.body}
                          </p>
                        </div>
                        <div className="flex items-center gap-[7px]">
                          {item.showCheck && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(item.id)}
                              className="size-[16px] cursor-pointer text-[#00A63E] hover:text-[#008A2E]"
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
                              className="size-[16px] cursor-pointer text-[#EF4444] hover:text-[#D1202B]"
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
                      <div className="mt-[6px]">
                        <TimeStamp text={item.time} />
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

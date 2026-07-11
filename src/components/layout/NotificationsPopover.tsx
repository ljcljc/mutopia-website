import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMessages, markMessageRead, type MessageOut, type MessageScope } from "@/lib/api";
import { cn } from "@/components/ui/utils";
import { formatNotificationDateTime } from "@/lib/localDateTime";
import { emitNotificationRead } from "@/lib/notificationEvents";
import { adjustUnreadCount, useUnreadSummary } from "@/components/layout/messageUnreadStore";

interface NotificationsPopoverProps {
  scope?: MessageScope;
  navigateTo?: string;
  triggerClassName?: string;
  iconClassName?: string;
}

export default function NotificationsPopover({
  scope = "user",
  navigateTo = "/account/notifications",
  triggerClassName,
  iconClassName,
}: NotificationsPopoverProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MessageOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { hasUnread } = useUnreadSummary(scope);
  const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 640;

  const handleNotificationClick = (item: MessageOut) => {
    if (!item.is_read) {
      setItems((currentItems) => currentItems.map((currentItem) => (
        currentItem.id === item.id ? { ...currentItem, is_read: true } : currentItem
      )));
      adjustUnreadCount(scope, -1);
      emitNotificationRead({ id: item.id, scope });
      void markMessageRead(item.id).catch((error) => {
        console.error("Failed to mark popover notification as read:", error);
        adjustUnreadCount(scope, 1);
        setItems((currentItems) => currentItems.map((currentItem) => (
          currentItem.id === item.id ? { ...currentItem, is_read: false } : currentItem
        )));
      });
    }

    setOpen(false);
    navigate(navigateTo);
  };

  const handleTriggerClick = () => {
    if (!isMobileViewport) return;
    setOpen(false);
    navigate(navigateTo);
  };

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getMessages({ page: 1, page_size: 2, channel: "in_app", scope });
        if (isMounted) setItems(response.items || []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [open, scope]);

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (isMobileViewport) {
          setOpen(false);
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 transition-opacity",
            triggerClassName
          )}
          aria-label="Notifications"
          data-name="notifications"
          onClick={handleTriggerClick}
        >
          {hasUnread ? (
            <span
              data-testid={`notifications-unread-dot-${scope}`}
              className="absolute -right-[2px] -top-[2px] z-10 size-[8px] rounded-full bg-[#EF4444]"
            />
          ) : null}
          <div className="bg-clip-padding border-0 border-transparent border-solid overflow-clip relative rounded-[inherit] size-[20px]">
            <div className="relative size-[20px]" data-name="icon">
              <Icon
                name="notify"
                aria-label="Notifications"
                className={cn("block max-w-none size-full text-[#8b6357]", iconClassName)}
              />
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="bg-white border border-[rgba(0,0,0,0.2)] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-0 w-[320px]"
      >
        <div className="flex flex-col items-start pt-[12px] w-full">
          <div className="w-full px-[12px]">
            <div className="relative flex items-center mb-3">
              <button
                type="button"
                className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer z-10"
                aria-label="Close notifications panel"
                onClick={() => setOpen(false)}
              >
                <Icon name="close-arrow" size={16} className="text-[#717182]" />
              </button>
              <h2 className="absolute left-1/2 -translate-x-1/2 font-comfortaa font-semibold text-[#4A3C2A] text-lg">
                Notifications
              </h2>
            </div>
          </div>
          <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
          <div className="flex flex-col pt-[8px] w-full">
            {isLoading ? (
              <div className="px-[16px] py-[12px] text-[#64748B] text-[12px]">Loading...</div>
            ) : items.length === 0 ? (
              <div className="px-[16px] py-[12px] text-[#64748B] text-[12px]">No notifications</div>
            ) : (
              items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="flex flex-col gap-[4px] h-[64px] pt-[12px] px-[16px] w-full text-left hover:bg-[rgba(0,0,0,0.03)] transition-colors"
                  onClick={() => handleNotificationClick(item)}
                >
                  <div className="flex items-start w-full">
                    <div className="flex flex-1 gap-[4px] items-center">
                      {!item.is_read && (
                        <span className="bg-[#EF4444] border-2 border-white rounded-full size-[10px]" />
                      )}
                      <p className="font-comfortaa font-bold text-[14px] leading-[20px] text-[#0F172B]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <div className="h-[16px] w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748B]">
                      {formatNotificationDateTime(item.sent_at)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

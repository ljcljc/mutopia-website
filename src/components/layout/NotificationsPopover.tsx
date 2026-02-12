import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getMessages, type MessageOut } from "@/lib/api";

export default function NotificationsPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MessageOut[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getMessages({ page: 1, page_size: 2, channel: "in_app" });
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
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Notifications"
          data-name="notifications"
        >
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border overflow-clip relative rounded-[inherit] size-[24px]">
            <div className="absolute inset-[8.33%_16.67%]" data-name="icon">
              <Icon
                name="notify"
                aria-label="Notifications"
                className="block max-w-none size-full text-[#8b6357]"
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
              <h2 className="absolute left-1/2 -translate-x-1/2 font-['Comfortaa',sans-serif] font-semibold text-[#4A3C2A] text-lg">
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
                  onClick={() => {
                    setOpen(false);
                    navigate("/account/notifications");
                  }}
                >
                  <div className="flex items-start w-full">
                    <div className="flex flex-1 gap-[4px] items-center">
                      {!item.is_read && (
                        <span className="bg-[#EF4444] border-2 border-white rounded-full size-[10px]" />
                      )}
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[14px] leading-[20px] text-[#0F172B]">
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <div className="h-[16px] w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[#64748B]">
                      {item.sent_at}
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

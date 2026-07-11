import type { MessageScope } from "./api";

const NOTIFICATION_READ_EVENT = "notification:read";

export type NotificationReadDetail = {
  id: number;
  scope: MessageScope;
};

export function emitNotificationRead(detail: NotificationReadDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<NotificationReadDetail>(NOTIFICATION_READ_EVENT, { detail }));
}

export function onNotificationRead(listener: (detail: NotificationReadDetail) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleEvent = (event: Event) => {
    const customEvent = event as CustomEvent<NotificationReadDetail>;
    if (!customEvent.detail) return;
    listener(customEvent.detail);
  };

  window.addEventListener(NOTIFICATION_READ_EVENT, handleEvent as EventListener);
  return () => {
    window.removeEventListener(NOTIFICATION_READ_EVENT, handleEvent as EventListener);
  };
}

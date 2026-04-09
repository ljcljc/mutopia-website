import { useEffect } from "react";

let lockCount = 0;
let originalBodyOverflow = "";
let originalBodyPaddingRight = "";
let originalHtmlOverflow = "";
let originalHtmlPaddingRight = "";

/**
 * Hook to prevent body scroll and maintain scrollbar space
 * Prevents layout shift when modals/dialogs open
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (!isLocked) {
      body.classList.remove("modal-open");
      document.documentElement.style.removeProperty("--scrollbar-width");
      document.documentElement.style.removeProperty("--scrollbar-track-color");
      return;
    }

    // Calculate scrollbar width
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    if (lockCount === 0) {
      originalBodyOverflow = body.style.overflow;
      originalBodyPaddingRight = body.style.paddingRight;
      originalHtmlOverflow = html.style.overflow;
      originalHtmlPaddingRight = html.style.paddingRight;
    }

    lockCount += 1;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.classList.add("modal-open");

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
      html.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
      document.documentElement.style.setProperty("--scrollbar-track-color", "#f1f1f1");
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount > 0) {
        return;
      }

      body.style.overflow = originalBodyOverflow;
      body.style.paddingRight = originalBodyPaddingRight;
      html.style.overflow = originalHtmlOverflow;
      html.style.paddingRight = originalHtmlPaddingRight;
      body.classList.remove("modal-open");
      document.documentElement.style.removeProperty("--scrollbar-width");
      document.documentElement.style.removeProperty("--scrollbar-track-color");
    };
  }, [isLocked]);
}

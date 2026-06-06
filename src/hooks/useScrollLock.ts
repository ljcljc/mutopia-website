import { useEffect } from "react";

let lockCount = 0;
let originalBodyOverflow = "";
let originalHtmlOverflow = "";

/**
 * Hook to prevent body scroll while relying on global scrollbar-gutter
 * to keep layout width stable when dialogs open.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (!isLocked) {
      body.classList.remove("modal-open");
      return;
    }

    if (lockCount === 0) {
      originalBodyOverflow = body.style.overflow;
      originalHtmlOverflow = html.style.overflow;
    }

    lockCount += 1;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.classList.add("modal-open");

    return () => {
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount > 0) {
        return;
      }

      body.style.overflow = originalBodyOverflow;
      html.style.overflow = originalHtmlOverflow;
      body.classList.remove("modal-open");
    };
  }, [isLocked]);
}

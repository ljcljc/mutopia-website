import { useEffect } from 'react';

/**
 * Hook to prevent body scroll and maintain scrollbar space
 * Prevents layout shift when modals/dialogs open
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (isLocked) {
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - html.clientWidth;

      // Save original styles
      const originalBodyOverflow = body.style.overflow;
      const originalBodyPaddingRight = body.style.paddingRight;
      const originalHtmlOverflow = html.style.overflow;
      const originalHtmlPaddingRight = html.style.paddingRight;

      // Apply styles to prevent layout shift
      body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
      body.classList.add('modal-open');

      // Add padding to compensate for scrollbar width
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
        html.style.paddingRight = `${scrollbarWidth}px`;
        // Store scrollbar width in CSS custom property
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        // Add scrollbar track color for compensation area
        document.documentElement.style.setProperty('--scrollbar-track-color', '#f1f1f1');
      }

      // Cleanup on unmount or when isLocked becomes false
      return () => {
        body.style.overflow = originalBodyOverflow;
        body.style.paddingRight = originalBodyPaddingRight;
        html.style.overflow = originalHtmlOverflow;
        html.style.paddingRight = originalHtmlPaddingRight;
        body.classList.remove('modal-open');
        document.documentElement.style.removeProperty('--scrollbar-width');
        document.documentElement.style.removeProperty('--scrollbar-track-color');
      };
    } else {
      // If not locked, ensure modal class is removed
      body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
      document.documentElement.style.removeProperty('--scrollbar-track-color');
    }
  }, [isLocked]);
}

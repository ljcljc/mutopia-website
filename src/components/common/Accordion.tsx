/**
 * Shared accordion primitives.
 *
 * Animation spec mirrors the Performance Radar card in
 * GroomerPerformancePage: chevron rotates 300ms ease-in-out on the GPU;
 * the panel expands via grid-template-rows 0fr/1fr (300ms ease-out) with a
 * fade/slide inner layer.
 *
 * The panel unmounts after the close transition so a collapsed panel takes
 * no layout space (no phantom flex gaps) and its controls stay out of the
 * tab order.
 */

import { useEffect, useRef, useState, type ReactNode, type TransitionEvent } from "react";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";

export function AccordionChevron({
  open,
  collapsedRotation = 0,
  className,
}: {
  open: boolean;
  /** Resting rotation when collapsed: 0 = pointing down (default), 90 = pointing right. */
  collapsedRotation?: 0 | 90;
  className?: string;
}) {
  return (
    <Icon
      name="chevron-down"
      aria-hidden="true"
      className={cn(
        "origin-center transform-gpu transition-transform duration-300 ease-in-out",
        open
          ? "rotate-180"
          : collapsedRotation === 90
            ? "rotate-90"
            : "rotate-0",
        className,
      )}
    />
  );
}

export function AccordionPanel({
  open,
  id,
  children,
  className,
  contentClassName,
}: {
  open: boolean;
  /** Optional id for aria-controls references. */
  id?: string;
  children: ReactNode;
  /** Class for the outer grid element (e.g. "w-full", open-state margins). */
  className?: string;
  /** Class for the animated inner content wrapper (e.g. "flex justify-center"). */
  contentClassName?: string;
}) {
  // Mount while open or while the open/close transition is still running.
  const [mounted, setMounted] = useState(open);
  // Drives the 0fr/1fr class; flips one frame after mount so the transition runs.
  const [expanded, setExpanded] = useState(open);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Two frames: first paints the mounted 0fr state, second transitions to 1fr.
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setExpanded(true));
      });
    } else {
      setExpanded(false);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [open]);

  if (!mounted) return null;

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    // Child elements run their own transitions; only the grid row on the
    // panel itself marks the collapse as finished.
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "grid-template-rows") return;
    if (!open) setMounted(false);
  };

  return (
    <div
      id={id}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        "grid overflow-hidden transition-[grid-template-rows,margin] duration-300 ease-out",
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
    >
      <div className="min-h-0">
        <div
          className={cn(
            "transition-[opacity,transform] duration-300 ease-out",
            expanded
              ? "pointer-events-auto translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

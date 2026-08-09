import { useEffect, useRef } from "react";
import { cn } from "@/components/ui/utils";

export function InspectionTagGroup({
  label,
  tags,
  selected,
  onChange,
  disabled = false,
}: {
  label: string;
  tags: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef(new Map<string, HTMLButtonElement>());

  const centerChip = (value: string) => {
    if (window.innerWidth >= 768) return;
    const row = rowRef.current;
    const chip = chipRefs.current.get(value);
    if (!row || !chip) return;
    row.scrollTo({
      left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const active = selected[selected.length - 1];
    if (active) centerChip(active);
  }, [selected]);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
    window.requestAnimationFrame(() => centerChip(value));
  };

  return (
    <fieldset disabled={disabled} className="w-full min-w-0 max-w-full space-y-2 overflow-hidden [min-inline-size:0]">
      <legend className="font-comfortaa text-[12px] uppercase tracking-[0.08em] text-[#8B817F]">{label}</legend>
      <div
        ref={rowRef}
        style={{ WebkitOverflowScrolling: "touch" }}
        className={cn(
          "grid w-full min-w-0 max-w-full touch-pan-x auto-cols-max grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain pb-1 md:flex md:touch-auto md:flex-wrap md:overflow-x-visible md:overflow-y-visible",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {tags.map((tag) => {
          const active = selected.includes(tag.value);
          return (
            <button
              key={tag.value}
              ref={(node) => {
                if (node) chipRefs.current.set(tag.value, node);
                else chipRefs.current.delete(tag.value);
              }}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(tag.value)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full border px-4 py-2 font-comfortaa text-[13px] transition-colors disabled:cursor-not-allowed",
                active ? "border-[#DE8A19] text-[#DE8A19]" : "border-[#4B4B4B] text-[#B7B7B7]",
              )}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

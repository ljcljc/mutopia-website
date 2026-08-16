import { Icon, type IconName } from "@/components/common";
import type { PhotoHealthAreaResult } from "@/lib/api";

export function WellnessSummaryCard({
  label,
  result,
  iconName,
  onViewPhotos,
}: {
  label: string;
  result: PhotoHealthAreaResult;
  iconName: IconName;
  onViewPhotos: () => void;
}) {
  const attention = result.status === "attention_needed";
  const statusStyles = attention
    ? {
        iconBackground: "bg-[#FEF3C7]",
        iconForeground: "text-[#F59E0B]",
        pill: "bg-[#FEF3C7] text-[#F59E0B]",
        dot: "bg-[#F59E0B]",
      }
    : {
        iconBackground: "bg-[#D1FAE5]",
        iconForeground: "text-[#059669]",
        pill: "bg-[#D1FAE5] text-[#059669]",
        dot: "bg-[#059669]",
      };

  return (
    <article
      className={`rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.04)] ${attention ? "min-h-[151px]" : "min-h-[124px]"}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${statusStyles.iconBackground}`}
          aria-hidden="true"
        >
          <Icon
            name={iconName}
            className={`size-5 ${statusStyles.iconForeground}`}
          />
        </span>
        <h3 className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#364153]">
          {label}
        </h3>
        <span
          className={`ml-auto inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-comfortaa text-[11px] font-medium leading-[16.5px] ${statusStyles.pill}`}
        >
          <span className={`size-1.5 rounded-full ${statusStyles.dot}`} />
          {attention ? "Attention Needed" : "Normal"}
        </span>
      </div>
      {attention ? (
        <p className="mt-3 text-[12px] leading-[18px] text-black">
          {result.description}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onViewPhotos}
        className="mt-3 flex h-9 w-full cursor-pointer items-center justify-center rounded-full border-2 border-[#8B6357] px-4 font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357] transition-colors hover:bg-[rgba(139,99,87,0.16)] active:border-[#2374FF] active:bg-[rgba(139,99,87,0.16)] focus-visible:border-[#2374FF] focus-visible:bg-[rgba(139,99,87,0.16)] focus-visible:outline-none"
      >
        View {label.toLowerCase()} photo
      </button>
    </article>
  );
}

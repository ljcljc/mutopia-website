import type { ReactNode } from "react";
import type { PhotoHealthAreaResult } from "@/lib/api";

export function WellnessSummaryCard({
  label,
  result,
  icon,
  onViewPhotos,
}: {
  label: string;
  result: PhotoHealthAreaResult;
  icon: ReactNode;
  onViewPhotos: () => void;
}) {
  const attention = result.status === "attention_needed";
  return (
    <article className="rounded-2xl bg-white p-5 shadow-lg">
      <div className="flex items-center gap-3">
        <span className={`flex size-12 items-center justify-center rounded-full ${attention ? "bg-[#FFF3C7] text-[#DCA72C]" : "bg-[#DDF8E7] text-[#58A777]"}`}>{icon}</span>
        <h3 className="font-comfortaa text-lg text-[#4A3C2A]">{label}</h3>
        <span className={`ml-auto rounded-full px-3 py-1 text-xs ${attention ? "bg-[#FFF3C7] text-[#C7921E]" : "bg-[#DDF8E7] text-[#4C9A6C]"}`}>
          • {attention ? "Attention Needed" : "Normal"}
        </span>
      </div>
      {attention ? <p className="mt-4 text-sm leading-6 text-[#4A3C2A]">{result.description}</p> : null}
      <button type="button" onClick={onViewPhotos} className="mt-4 w-full rounded-full border-2 border-[#8A7468] px-4 py-2 font-comfortaa text-sm text-[#6C5A50]">
        View {label.toLowerCase()} photo
      </button>
    </article>
  );
}

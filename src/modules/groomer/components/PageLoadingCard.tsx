import { Spinner } from "@/components/common/Spinner";

export function PageLoadingCard({ label }: { label: string }) {
  return (
    <section className="flex min-h-[160px] items-center justify-center rounded-[20px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={36} color="#DE6A07" showTrack trackOpacity={0.22} />
        <p className="font-comfortaa text-[13px] font-medium leading-5 text-[#8B6357]">
          {label}
        </p>
      </div>
    </section>
  );
}

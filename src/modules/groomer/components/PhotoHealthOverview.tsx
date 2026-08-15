import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { ImagePreview, OrangeButton } from "@/components/common";
import DEFAULT_PET_AVATAR from "@/assets/icons/icon-pet-avatar-placeholder.svg";
import { buildImageUrl, type BookingDetailOut, type CheckInObservationOut } from "@/lib/api";

const BEHAVIOR_LABELS: Record<string, string> = {
  friendly: "Friendly",
  anxious: "Anxious",
  hard_to_handle: "Hard to handle",
  senior_pets: "Senior pets",
};

function text(source: Record<string, unknown> | undefined, key: string, fallback = "-"): string {
  const value = source?.[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function textChain(source: Record<string, unknown> | undefined, keys: string[], fallback = ""): string {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getPetAvatarUrl(booking: BookingDetailOut | null, snapshot: Record<string, unknown> | undefined): string {
  const bookingAvatar = text(booking as unknown as Record<string, unknown> | undefined, "pet_avatar", "");
  if (bookingAvatar) return buildImageUrl(bookingAvatar) || DEFAULT_PET_AVATAR;
  const snapshotAvatar = textChain(snapshot, ["avatar_url", "primary_photo", "pet_avatar", "avatar"]);
  return buildImageUrl(snapshotAvatar) || DEFAULT_PET_AVATAR;
}

export interface PhotoHealthOverviewProps {
  booking: BookingDetailOut | null;
  arrival: CheckInObservationOut | null;
  saving: boolean;
  startLabel: string;
  onStart: () => void;
}

export function PhotoHealthOverview({ booking, arrival, saving, startLabel, onStart }: PhotoHealthOverviewProps) {
  const snapshot = booking?.pet_snapshot;
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const avatar = getPetAvatarUrl(booking, snapshot);
  const scheduledDate = booking?.scheduled_time ? new Date(booking.scheduled_time) : null;
  const scheduled = scheduledDate
    ? `${scheduledDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${scheduledDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    : "Time not provided";
  const service = text(booking?.package_snapshot, "service_name", "Service");
  const behavior = text(snapshot, "behavior", "").trim().toLowerCase();
  const behaviorNeedsAttention = behavior !== "friendly";

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-[12px] border-2 border-[#DE6A07] bg-white px-[22px] py-[14px] shadow-[0px_8px_6px_rgba(0,0,0,0.1)]">
          <div className="flex items-start gap-2">
            <img src={avatar} alt={text(snapshot, "name", "Pet")} className="size-14 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#4A3C2A]">{text(snapshot, "name", "Pet")}</h2>
              <div className="mt-[7px] flex flex-wrap gap-[5px]">
                {[text(snapshot, "breed"), `${text(snapshot, "weight_value")} ${text(snapshot, "weight_unit", "")}`.trim(), text(snapshot, "gender"), text(snapshot, "birthday")]
                  .filter((value) => value !== "-")
                  .map((value) => (
                    <span key={value} className="rounded-full bg-[#EDE8F3] px-[8.75px] py-[3.5px] font-comfortaa text-[11px] font-semibold leading-[16.5px] text-[#7A6090]">
                      {value}
                    </span>
                  ))}
              </div>
              {behavior ? (
                <div className="mt-[7px] flex flex-wrap gap-[5px]">
                  <span
                    className={cn(
                      "flex items-center gap-[5.25px] rounded-full border px-[11.5px] py-[6.25px] font-comfortaa text-[12px] font-bold leading-[18px]",
                      behaviorNeedsAttention
                        ? "border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C]"
                        : "border-[#CDEBD8] bg-[#F3FFF7] text-[#3D8056]",
                    )}
                  >
                    {behaviorNeedsAttention ? <TriangleAlert className="size-[12.25px]" /> : null}
                    {BEHAVIOR_LABELS[behavior] ?? behavior}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-[14px] border-t border-[#F0ECF7] pt-[15px]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-comfortaa text-[10px] font-bold uppercase tracking-[1px] text-[#A89BBB]">Appointment</p>
                <p className="mt-[2px] font-comfortaa text-[13px] font-bold leading-[19.5px] text-[#2D1F3D]">
                  {scheduled} · {service}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-[rgba(74,44,85,0.08)] px-[10.5px] py-[5.25px] font-comfortaa text-[12px] font-bold leading-[18px] text-[#4A2C55]">
                Checked In
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <h2 className="font-comfortaa text-base font-semibold leading-[28px] text-[#4A3C2A]">Before grooming photos</h2>
          <div className="mt-3 rounded-2xl border border-[#DE6A07] bg-[#FAFAFA] p-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)]">
            <div className="flex flex-wrap gap-1">
              {arrival?.photos.map((photo, index) => <button key={photo.id} type="button" className="h-[84px] w-[95px] cursor-pointer overflow-hidden rounded-xl border border-[#D4D4D4]" onClick={() => { setPreviewIndex(index); setPreviewOpen(true); }}><img src={photo.url} alt={photo.original_filename} className="size-full object-cover" /></button>)}
            </div>
          </div>
          <div className="mt-5 rounded-[14px] bg-[linear-gradient(135deg,rgba(255,247,237,1)_0%,rgba(255,251,235,1)_100%)] p-[14px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-comfortaa text-xs font-bold tracking-[0.08em] text-[#A89BBB]">Note - Before grooming</h3>
            <p className="mt-[6px] whitespace-pre-wrap font-comfortaa text-[13px] leading-[20.8px] text-[#5A4A6A]">{arrival?.arrival_note?.trim() || "No note provided"}</p>
          </div>
        </section>
      </div>

      <OrangeButton type="button" fullWidth disabled={saving} onClick={onStart} className="mt-8">{startLabel}</OrangeButton>

      <ImagePreview images={arrival?.photos.map((photo) => photo.url) ?? []} fileNames={arrival?.photos.map((photo) => photo.original_filename) ?? []} currentIndex={previewIndex} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </>
  );
}

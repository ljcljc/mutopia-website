import { useState } from "react";
import { ImagePreview, OrangeButton } from "@/components/common";
import type { BookingDetailOut, CheckInObservationOut } from "@/lib/api";
import { PhotoHealthBookingPetCard } from "./PhotoHealthBookingPetCard";

export interface PhotoHealthOverviewProps {
  booking: BookingDetailOut | null;
  arrival: CheckInObservationOut | null;
  saving: boolean;
  startLabel: string;
  onStart: () => void;
}

export function PhotoHealthOverview({
  booking,
  arrival,
  saving,
  startLabel,
  onStart,
}: PhotoHealthOverviewProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <PhotoHealthBookingPetCard booking={booking} />

        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <h2 className="font-comfortaa text-base font-semibold leading-[28px] text-[#4A3C2A]">
            Before grooming photos
          </h2>
          <div className="mt-3 rounded-2xl border border-[#DE6A07] bg-[#FAFAFA] p-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)]">
            <div className="flex flex-wrap gap-1">
              {arrival?.photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className="h-[84px] w-[95px] cursor-pointer overflow-hidden rounded-xl border border-[#D4D4D4]"
                  onClick={() => {
                    setPreviewIndex(index);
                    setPreviewOpen(true);
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.original_filename}
                    className="size-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 rounded-[14px] bg-[linear-gradient(135deg,rgba(255,247,237,1)_0%,rgba(255,251,235,1)_100%)] p-[14px] shadow-[0px_1px_6px_0px_rgba(0,0,0,0.05)]">
            <h3 className="font-comfortaa text-xs font-bold tracking-[0.08em] text-[#A89BBB]">
              Note - Before grooming
            </h3>
            <p className="mt-[6px] whitespace-pre-wrap font-comfortaa text-[13px] leading-[20.8px] text-[#5A4A6A]">
              {arrival?.arrival_note?.trim() || "No note provided"}
            </p>
          </div>
        </section>
      </div>

      <OrangeButton
        type="button"
        fullWidth
        disabled={saving}
        onClick={onStart}
        className="mt-8"
      >
        {startLabel}
      </OrangeButton>

      <ImagePreview
        images={arrival?.photos.map((photo) => photo.url) ?? []}
        fileNames={
          arrival?.photos.map((photo) => photo.original_filename) ?? []
        }
        currentIndex={previewIndex}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}

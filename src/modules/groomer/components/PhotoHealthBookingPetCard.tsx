import { TriangleAlert } from "lucide-react";
import { cn } from "@/components/ui/utils";
import DEFAULT_PET_AVATAR from "@/assets/icons/icon-pet-avatar-placeholder.svg";
import { buildImageUrl, type BookingDetailOut } from "@/lib/api";

const BEHAVIOR_LABELS: Record<string, string> = {
  normal: "Normal",
  friendly: "Friendly",
  anxious: "Anxious",
  hard_to_handle: "Hard to handle",
  senior_pets: "Senior pets",
};

const BOOKING_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending: "Pending Assignment",
  awaiting_client_confirmation: "Awaiting Client Confirmation",
  confirmed: "Confirmed",
  traveling: "Traveling",
  checked_in: "Checked In",
  in_progress: "In Progress",
  awaiting_payment: "Awaiting Payment",
  awaiting_final_payment: "Awaiting Final Payment",
  completed: "Completed",
  terminated: "Terminated",
  canceled: "Canceled",
  refunded: "Refunded",
};

function text(
  source: Record<string, unknown> | undefined,
  key: string,
  fallback = "-"
): string {
  const value = source?.[key];
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function textChain(
  source: Record<string, unknown> | undefined,
  keys: string[],
  fallback = ""
): string {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function getPetAvatarUrl(
  booking: BookingDetailOut | null,
  snapshot: Record<string, unknown> | undefined
): string {
  const bookingAvatar = text(
    booking as unknown as Record<string, unknown> | undefined,
    "pet_avatar",
    ""
  );
  if (bookingAvatar) return buildImageUrl(bookingAvatar) || DEFAULT_PET_AVATAR;
  return (
    buildImageUrl(
      textChain(snapshot, [
        "avatar_url",
        "primary_photo",
        "pet_avatar",
        "avatar",
      ])
    ) || DEFAULT_PET_AVATAR
  );
}

function getBookingStatusLabel(status?: string): string {
  const normalized =
    status
      ?.trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_") ?? "";
  return (
    BOOKING_STATUS_LABELS[normalized] ??
    status?.trim() ??
    "Booking status unavailable"
  );
}

export function PhotoHealthBookingPetCard({
  booking,
}: {
  booking: BookingDetailOut | null;
}) {
  const snapshot = booking?.pet_snapshot;
  const scheduledDate = booking?.scheduled_time
    ? new Date(booking.scheduled_time)
    : null;
  const scheduled = scheduledDate
    ? `${scheduledDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${scheduledDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`
    : "Time not provided";
  const behavior = text(snapshot, "behavior", "").trim().toLowerCase();
  const behaviorNeedsAttention = behavior !== "normal" && behavior !== "friendly";

  return (
    <section className="rounded-[12px] border-2 border-[#DE6A07] bg-white px-[22px] py-[14px] shadow-[0px_8px_6px_rgba(0,0,0,0.1)]">
      <div className="flex items-start gap-2">
        <img
          src={getPetAvatarUrl(booking, snapshot)}
          alt={text(snapshot, "name", "Pet")}
          className="size-14 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-comfortaa text-[16px] font-semibold leading-[28px] text-[#4A3C2A]">
            {text(snapshot, "name", "Pet")}
          </h2>
          <div className="mt-[7px] flex flex-wrap gap-[5px]">
            {[
              text(snapshot, "breed"),
              `${text(snapshot, "weight_value")} ${text(snapshot, "weight_unit", "")}`.trim(),
              text(snapshot, "gender"),
              text(snapshot, "birthday"),
            ]
              .filter((value) => value !== "-")
              .map((value) => (
                <span
                  key={value}
                  className="rounded-full bg-[#EDE8F3] px-[8.75px] py-[3.5px] font-comfortaa text-[11px] font-semibold leading-[16.5px] text-[#7A6090]"
                >
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
                    : "border-[#CDEBD8] bg-[#F3FFF7] text-[#3D8056]"
                )}
              >
                {behaviorNeedsAttention ? (
                  <TriangleAlert className="size-[12.25px]" />
                ) : null}
                {BEHAVIOR_LABELS[behavior] ?? behavior}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="mt-[14px] border-t border-[#F0ECF7] pt-[15px]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-comfortaa text-[10px] font-bold uppercase tracking-[1px] text-[#A89BBB]">
              Appointment
            </p>
            <p className="mt-[2px] font-comfortaa text-[13px] font-bold leading-[19.5px] text-[#2D1F3D]">
              {scheduled} ·{" "}
              {text(booking?.package_snapshot, "service_name", "Service")}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[rgba(74,44,85,0.08)] px-[10.5px] py-[5.25px] font-comfortaa text-[12px] font-bold leading-[18px] text-[#4A2C55]">
            {getBookingStatusLabel(booking?.status)}
          </span>
        </div>
      </div>
    </section>
  );
}

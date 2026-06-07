import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CommonCheckbox, CustomInput, CustomRadio, CustomSelect, CustomSelectItem, CustomTextarea, OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  BookingRequestInteraction,
  type BookingRequestDecisionTimeOption,
} from "@/modules/groomer/components/BookingRequestContent";
import {
  CancelAppointmentModal,
  type CancelAppointmentFormData,
} from "@/modules/groomer/components/CancelAppointmentModal";
import { GroomerUpNextCard } from "@/modules/groomer/components/GroomerUpNextCard";
import {
  useGroomerDashboardStore,
  type DashboardAppointment,
  type DashboardAmountLine,
  type DashboardGoal,
} from "@/modules/groomer/groomerStore";
import { shouldShowStartTravel } from "@/modules/groomer/utils/time";
import {
  decideGroomerInvitation,
  getAddOns,
  submitGroomerCheckUpCheckout,
  submitGroomerHealthReport,
  type AddOnOut,
  type HealthReportIn,
  type TerminateServiceIn,
} from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { CheckCircleIcon, StarIcon, XIcon } from "lucide-react";

type BookingRequest = DashboardAppointment;
type CheckUpTab = "weight" | "add-ons" | "personalization";
type BookingRequestSuccessAlertKind = "confirm" | "propose";
type TerminateServiceResolution = "owner_approved" | "mutopia_intervention";
type HealthReportFormData = HealthReportIn;

const FALLBACK_ADD_ONS: AddOnOut[] = [
  { id: 1, name: "Teeth brushing", description: "Professional dental cleaning", price: 15, is_variable: false },
  { id: 2, name: "De-shedding treatment", description: "Reduce shedding by up to 80%", price: 10, is_variable: false },
  { id: 3, name: "Anal Gland Expression", description: "Manually emptying the small sacs", price: 12, is_variable: false },
  { id: 4, name: "Pet cologne", description: "Long-lasting fresh scent", price: 8, is_variable: false },
  { id: 5, name: "Paw Treatment", description: "Moisturizing paw balm", price: 18, is_variable: false },
  { id: 6, name: "Flea & Tick", description: "Kills fleas, ticks, larvae and eggs by contact", price: 12, is_variable: false },
];

const PERSONALIZATION_FIELDS = [
  { key: "senior_pets", label: "Senior pets" },
  { key: "hard_to_handle", label: "Hard to handle" },
  { key: "severely_matted", label: "Severely matted" },
  { key: "extra_large", label: "> 50kg" },
  { key: "parking", label: "Parking" },
  { key: "others", label: "Others" },
] as const;

function normalizeStatus(status?: string): string {
  return (status ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function LoadingStateCard() {
  return (
    <div className="flex min-h-[112px] flex-col items-center justify-center gap-3 rounded-[16px] bg-white px-4 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <Spinner size={36} color="#DE6A07" showTrack trackOpacity={0.22} />
      <p className="font-comfortaa text-[13px] font-medium leading-5 text-[#8B6357]">Loading dashboard...</p>
    </div>
  );
}

function AppointmentSummaryCard({
  appointment,
  showStartTravel,
  isStartingTravel,
  onStartTravel,
}: {
  appointment: DashboardAppointment;
  showStartTravel: boolean;
  isStartingTravel: boolean;
  onStartTravel: () => void;
}) {
  return (
    <GroomerUpNextCard
      appointment={appointment}
      timeBadgeTone="blue"
      showDuration={false}
      footer={showStartTravel ? (
        <button
          type="button"
          onClick={onStartTravel}
          disabled={isStartingTravel}
          className="flex h-[38px] w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] font-comfortaa text-[14px] font-bold leading-[21px] text-white shadow-[0px_10px_18px_rgba(240,138,18,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isStartingTravel ? <Spinner size="small" color="white" /> : "Start Travel"}
        </button>
      ) : null}
    />
  );
}

function TravelMapCard({
  appointment,
  isCheckingIn,
  isCancelingTravel,
  onCheckIn,
  onCancelTravel,
}: {
  appointment: DashboardAppointment;
  isCheckingIn: boolean;
  isCancelingTravel: boolean;
  onCheckIn: () => void;
  onCancelTravel: () => void;
}) {
  const isCheckedIn = normalizeStatus(appointment.status) === "checked_in";

  return (
    <article className="rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_14px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-comfortaa text-[11px] leading-[16.5px] tracking-[0.5px] text-[#A07D72]">UP NEXT</p>
          <h2 className="mt-1 font-comfortaa text-[20px] leading-[30px] text-[#4A2C55]">Check In</h2>
        </div>
        <div className="rounded-[12px] bg-[#DBEAFE] px-3.5 py-[7px]">
          <span className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#5B7FE8]">{appointment.time}</span>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] bg-[#FAF8F4] px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-[56px] rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-comfortaa text-[16px] leading-6 text-[#4A2C55]">{appointment.petName}</p>
            <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">{appointment.breed}</p>
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
              <span aria-hidden="true">• </span>
              Owner: {appointment.owner}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-4 h-[145px] overflow-hidden rounded-[12px] bg-[#E8EFE5]">
        <div className="absolute inset-0 opacity-75 [background-image:linear-gradient(0deg,rgba(255,255,255,0.72)_2px,transparent_2px),linear-gradient(90deg,rgba(255,255,255,0.72)_2px,transparent_2px)] [background-size:24px_24px]" />
        <div className="absolute left-[-28px] top-[50px] h-[20px] w-[210px] rotate-[2deg] bg-white/80" />
        <div className="absolute right-[-20px] top-[64px] h-[20px] w-[190px] rotate-[-1deg] bg-white/80" />
        <div className="absolute left-[126px] top-[-20px] h-[190px] w-[70px] bg-white/80" />
        <div className="absolute left-[118px] top-[13px] size-[104px] rounded-full bg-[#D99A36]/22" />
        <div className="absolute left-[153px] top-[48px] flex size-9 items-center justify-center rounded-full bg-[#F08A12] text-white shadow-[0px_8px_16px_rgba(240,138,18,0.25)]">
          <Icon name="location" className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <Icon name="location" className="mt-[2px] size-4 text-[#F08A12]" aria-hidden="true" />
          <div className="min-w-0">
            <p className="font-comfortaa text-[11px] leading-[16.5px] text-[#A07D72]">ADDRESS</p>
            <p className="mt-0.5 font-comfortaa text-[14px] leading-[21px] text-[#F08A12] underline underline-offset-[2px]">{appointment.address}</p>
          </div>
        </div>
        {appointment.phone ? (
          <div className="flex items-center gap-2.5">
            <Icon name="phone" className="size-4 text-[#F08A12]" aria-hidden="true" />
            <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#4A5565] underline underline-offset-[2px]">{appointment.phone}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-[10px] border border-[#BBD3FF] bg-[#EEF6FF] px-3 py-3 text-center">
        <p className="font-comfortaa text-[12px] leading-[18px] text-[#2F5FD4]">
          Are you arrived? Ready to start grooming?
        </p>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onCheckIn}
          disabled={isCheckingIn || isCancelingTravel || isCheckedIn}
          className="flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#3B82F6] font-comfortaa text-[16px] font-bold leading-6 text-white shadow-[0px_10px_18px_rgba(59,130,246,0.28)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isCheckingIn ? (
            <Spinner size="small" color="white" />
          ) : (
            <>
              <Icon name="target" className="size-5" aria-hidden="true" />
              {isCheckedIn ? "Checked in" : "Check in"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancelTravel}
          disabled={isCheckingIn || isCancelingTravel || isCheckedIn}
          className="mt-4 flex w-full items-center justify-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline underline-offset-[3px] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCancelingTravel ? <Spinner size="small" color="#8B6357" /> : "Cancel appointment"}
        </button>
      </div>
    </article>
  );
}

function getStartServiceLabel(service: string): string {
  return service.toLowerCase().includes("bath") ? "Start bathing" : "Start grooming";
}

function getInProgressTitle(service: string, petName: string): string {
  return `${service.toLowerCase().includes("bath") ? "Bathing" : "Grooming"} ${petName}`;
}

function getCompactDurationLabel(duration: string): string {
  const minutes = duration.match(/(\d+)\s*(?:min|minute)/i)?.[1];
  return minutes ? `${minutes} min` : duration.replace(/^Est\. duration:\s*/i, "");
}

function CurrentJobCard({
  appointment,
  isStartingGrooming,
  onStartGrooming,
}: {
  appointment: DashboardAppointment;
  isStartingGrooming: boolean;
  onStartGrooming: () => void;
}) {
  const isInProgress = normalizeStatus(appointment.status) === "in_progress";

  return (
    <article className="rounded-[16px] bg-white p-5 shadow-[0px_4px_6px_rgba(0,0,0,0.08)]">
      <div>
        <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">CURRENT JOB</p>
        <h2 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">
          Checking {appointment.petName}
        </h2>
      </div>

      <div className="mt-4 rounded-[12px] bg-[#FAF9F7] px-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-14 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate font-comfortaa text-[16px] leading-6 text-[#4A2C55]">{appointment.petName}</p>
            <p className="truncate font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357]">{appointment.breed}</p>
            <p className="truncate font-comfortaa text-[11px] leading-[16.5px] text-[#00A63E]">
              <span aria-hidden="true">• </span>
              Owner: {appointment.owner}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartGrooming}
        disabled={isStartingGrooming || isInProgress}
        className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-[#3B82F6] font-comfortaa text-[16px] font-bold leading-6 text-white shadow-[0px_4px_6px_rgba(59,130,246,0.30)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isStartingGrooming ? (
          <Spinner size="small" color="white" />
        ) : (
          <>
            <Icon name="target" className="size-5" aria-hidden="true" />
            {isInProgress ? "Service in progress" : getStartServiceLabel(appointment.service)}
          </>
        )}
      </button>
    </article>
  );
}

function InProgressJobCard({
  appointment,
  isCompletingService,
  onCompleteService,
  onTerminateService,
}: {
  appointment: DashboardAppointment;
  isCompletingService: boolean;
  onCompleteService: () => void;
  onTerminateService: () => void;
}) {
  return (
    <article className="rounded-[16px] bg-[linear-gradient(180deg,#743782_0%,#8A527C_55%,#9A7658_100%)] p-5 shadow-[0px_4px_14px_rgba(0,0,0,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-comfortaa text-[12px] leading-[18px] text-white/70">IN PROGRESS</p>
          <h2 className="mt-1 truncate font-comfortaa text-[20px] leading-[30px] text-white">
            {getInProgressTitle(appointment.service, appointment.petName)}
          </h2>
        </div>
        <div className="shrink-0 rounded-[12px] bg-white/18 px-4 py-2">
          <span className="font-comfortaa text-[20px] font-bold leading-[27px] text-white">
            {getCompactDurationLabel(appointment.duration)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-[12px] bg-white/14 px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-14 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate font-comfortaa text-[16px] leading-6 text-white">{appointment.petName}</p>
            <p className="truncate font-comfortaa text-[13px] leading-[19.5px] text-white/75">
              {appointment.breed} • {appointment.service}
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCompleteService}
        disabled={isCompletingService}
        className="mt-4 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55] shadow-[0px_4px_8px_rgba(0,0,0,0.14)] transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isCompletingService ? (
          <Spinner size="small" color="#4A2C55" />
        ) : (
          <>
            <Icon name="target" className="size-5" aria-hidden="true" />
            Complete service
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onTerminateService}
        className="mx-auto mt-5 flex items-center justify-center font-comfortaa text-[13px] leading-[19.5px] text-white underline underline-offset-[3px]"
      >
        Service Terminated
      </button>
    </article>
  );
}

function CompletedServiceCard({
  appointment,
  onFillReport,
}: {
  appointment: DashboardAppointment;
  onFillReport: () => void;
}) {
  return (
    <article className="rounded-[16px] bg-[linear-gradient(180deg,#633479_0%,#7A4777_52%,#8B6357_100%)] p-5 shadow-[0px_4px_6px_rgba(74,44,85,0.3)]">
      <div className="min-w-0">
        <p className="font-comfortaa text-[12px] leading-[18px] text-white/70">IN PROGRESS</p>
        <h2 className="truncate font-comfortaa text-[20px] font-bold leading-[30px] text-white">
          {getInProgressTitle(appointment.service, appointment.petName)}
        </h2>
      </div>

      <div className="mt-4 rounded-[12px] bg-white/10 px-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-14 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate font-comfortaa text-[16px] leading-6 text-white">{appointment.petName}</p>
            <p className="truncate font-comfortaa text-[13px] leading-[19.5px] text-white/70">
              {appointment.breed} • {appointment.service}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex h-9 items-center gap-2 rounded-[8px] border border-[#6AA31C] bg-[#F4FFDE] px-4">
        <CheckCircleIcon className="size-3 shrink-0 fill-[#6AA31C] text-[#F4FFDE]" aria-hidden="true" />
        <p className="truncate font-comfortaa text-[12px] font-bold leading-4 text-[#467900]">
          Completed. Waiting for client confirmation
        </p>
      </div>

      <OrangeButton
        type="button"
        variant="outline"
        fullWidth
        onClick={onFillReport}
        className="mt-4 border-[#FFF7ED]! text-[#FFF7ED]! hover:bg-white/10! active:bg-white/10! focus-visible:bg-white/10! [&_p]:font-semibold [&_p]:text-[#FFF7ED]!"
      >
        Fill report for {appointment.petName}
      </OrangeButton>
    </article>
  );
}

function parseMoneyValue(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatMoneyValue(value: unknown): string {
  return `$${parseMoneyValue(value).toFixed(2)}`;
}

function ReviewedServiceCard({
  appointment,
  onFillReport,
  onViewNextJob,
}: {
  appointment: DashboardAppointment;
  onFillReport: () => void;
  onViewNextJob: () => void;
}) {
  const review = appointment.review;
  const rating = Math.max(0, Math.min(5, Math.round(review?.rating ?? 0)));
  const tipAmount = parseMoneyValue(review?.tip_amount);
  const hasTip = tipAmount > 0;

  return (
    <article className="rounded-[16px] bg-[linear-gradient(180deg,#DE6A07_0%,#E67E22_100%)] p-5 shadow-[0px_4px_6px_rgba(236,72,153,0.4)]">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-white">
          <StarIcon className="size-8 fill-[#DE6A07] text-[#DE6A07]" aria-hidden="true" />
        </div>
        <h2 className="mt-5 font-comfortaa text-[24px] font-bold leading-9 text-white">Excellent Work!</h2>
        <p className="mt-1 font-comfortaa text-[14px] leading-[21px] text-white/90">
          {appointment.petName}&apos;s grooming is complete.
          <br />
          You have to fill health report.
        </p>
      </div>

      <div className="mt-8 rounded-[12px] bg-white/20 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={appointment.avatarUrl} alt={appointment.petName} className="size-12 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-comfortaa text-[14px] font-medium leading-[21px] text-white">
              {appointment.owner || "Client"} rated you
            </p>
            <div className="mt-1 flex gap-1" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                  key={index}
                  className={`size-4 ${index < rating ? "fill-[#FDE047] text-[#FDE047]" : "fill-white/25 text-white/25"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>

        {review?.comment ? (
          <div className="mt-4 rounded-[8px] bg-white/90 px-[10px] py-[10px]">
            <p className="line-clamp-2 font-comfortaa text-[12px] leading-[18px] text-[#4A2C55]">
              &quot;{review.comment}&quot;
            </p>
          </div>
        ) : null}
      </div>

      {hasTip ? (
        <div className="mt-4 rounded-[12px] bg-[#FFF7ED] px-3 py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-comfortaa text-[12px] leading-[18px] text-[#92400E]">You earned a tip!</p>
              <p className="font-comfortaa text-[20px] font-bold leading-[30px] text-[#E67E22]">
                + {formatMoneyValue(tipAmount)}
              </p>
            </div>
            <span className="text-[32px] leading-[48px]" aria-hidden="true">
              🎉
            </span>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onFillReport}
        className="mt-4 flex h-12 w-full items-center justify-center rounded-full border-2 border-[#FFF7ED] px-7 font-comfortaa text-[16px] font-semibold leading-[17.5px] text-[#FFF7ED] transition-colors hover:bg-white/10"
      >
        Fill report for {appointment.petName}
      </button>
      <button
        type="button"
        onClick={onViewNextJob}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-white px-7 font-comfortaa text-[16px] font-bold leading-6 text-[#DF6E0C] shadow-[0px_10px_8px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.99]"
      >
        View next job
      </button>
    </article>
  );
}

function ServiceTerminationModal({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: TerminateServiceIn) => Promise<void>;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [refundableFee, setRefundableFee] = useState("0");
  const [resolution, setResolution] = useState<TerminateServiceResolution>("owner_approved");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");
    setDescription("");
    setRefundableFee("0");
    setResolution("owner_approved");
    setError("");
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Reason is required");
      return;
    }

    await onSubmit({
      reason: trimmedReason,
      description: description.trim(),
      refundable_service_fee: refundableFee.trim() || "0",
      resolution,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !isSubmitting && onClose()}>
      <DialogContent
        overlayClassName="service-area-dialog-overlay z-[70]!"
        className="service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! flex! max-h-[88vh]! w-full! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] border-0! bg-white! p-0! shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Terminate service</DialogTitle>
        <DialogDescription className="sr-only">Document the reason for terminating this service.</DialogDescription>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-[calc(24*var(--px393))] pb-[max(calc(24*var(--px393)),env(safe-area-inset-bottom))] pt-[calc(24*var(--px393))] sm:px-6 sm:pb-[max(24px,env(safe-area-inset-bottom))] sm:pt-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">Terminate service</h2>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">Document the reason</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex size-5 shrink-0 items-center justify-center text-[#4A5565] transition-colors hover:text-[#4A3C2A] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close terminate service dialog"
            >
              <XIcon className="size-4 stroke-[1.5]" aria-hidden="true" />
            </button>
          </div>

          <CustomInput
            label="Reason of termination"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setError("");
            }}
            disabled={isSubmitting}
            placeholder="Enter your reason"
            error={error}
          />

          <CustomTextarea
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter your note"
            className="text-[#4A3C2A]"
          />

          <CustomInput
            label="Refundable service fee"
            type="number"
            min="0"
            step="0.01"
            value={refundableFee}
            onChange={(event) => setRefundableFee(event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter price"
            leftElement={<span className="mr-1 font-comfortaa text-[12.25px] text-[#717182]">$</span>}
          />

          <div className="flex flex-col items-start gap-3">
            <CustomRadio
              variant="inline"
              label="Reason and refund approved by pet owner"
              isSelected={resolution === "owner_approved"}
              onClick={() => setResolution("owner_approved")}
              disabled={isSubmitting}
            />
            <CustomRadio
              variant="inline"
              label="Mutopia intervention required"
              isSelected={resolution === "mutopia_intervention"}
              onClick={() => setResolution("mutopia_intervention")}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-[10px]">
            <OrangeButton type="submit" fullWidth textSize={14} loading={isSubmitting}>
              Submit
            </OrangeButton>
            <OrangeButton type="button" variant="outline" fullWidth textSize={14} onClick={onClose}>
              Cancel
            </OrangeButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function HealthReportModal({
  open,
  isSubmitting,
  appointment,
  onClose,
  onSubmit,
}: {
  open: boolean;
  isSubmitting: boolean;
  appointment: DashboardAppointment | null;
  onClose: () => void;
  onSubmit: (data: HealthReportFormData) => Promise<void>;
}) {
  const [summary, setSummary] = useState("");
  const [petCondition, setPetCondition] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSummary("");
    setPetCondition("");
    setBehaviorNotes("");
    setRecommendations("");
    setError("");
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedSummary = summary.trim();
    if (!trimmedSummary) {
      setError("Summary is required");
      return;
    }

    await onSubmit({
      summary: trimmedSummary,
      pet_condition: petCondition.trim(),
      behavior_notes: behaviorNotes.trim(),
      recommendations: recommendations.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !isSubmitting && onClose()}>
      <DialogContent
        overlayClassName="service-area-dialog-overlay z-[70]!"
        className="service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! flex! max-h-[88vh]! w-full! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] border-0! bg-white! p-0! shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Health report</DialogTitle>
        <DialogDescription className="sr-only">Fill the grooming health report.</DialogDescription>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 overflow-y-auto px-[calc(24*var(--px393))] pb-[max(calc(24*var(--px393)),env(safe-area-inset-bottom))] pt-[calc(24*var(--px393))] sm:px-6 sm:pb-[max(24px,env(safe-area-inset-bottom))] sm:pt-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">
                Health report{appointment ? ` for ${appointment.petName}` : ""}
              </h2>
              <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                Share condition, behavior, and care recommendations
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex size-5 shrink-0 items-center justify-center text-[#4A5565] transition-colors hover:text-[#4A3C2A] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close health report dialog"
            >
              <XIcon className="size-4 stroke-[1.5]" aria-hidden="true" />
            </button>
          </div>

          <CustomTextarea
            label="Summary"
            value={summary}
            onChange={(event) => {
              setSummary(event.target.value);
              setError("");
            }}
            disabled={isSubmitting}
            placeholder="Enter report summary"
            error={error}
            className="min-h-[92px] text-[#4A3C2A]"
          />
          <CustomInput
            label="Pet condition"
            value={petCondition}
            onChange={(event) => setPetCondition(event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter pet condition"
          />
          <CustomTextarea
            label="Behavior notes"
            value={behaviorNotes}
            onChange={(event) => setBehaviorNotes(event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter behavior notes"
            className="min-h-[82px] text-[#4A3C2A]"
          />
          <CustomTextarea
            label="Recommendations"
            value={recommendations}
            onChange={(event) => setRecommendations(event.target.value)}
            disabled={isSubmitting}
            placeholder="Enter recommendations"
            className="min-h-[82px] text-[#4A3C2A]"
          />

          <div className="flex flex-col gap-[10px]">
            <OrangeButton type="submit" fullWidth textSize={14} loading={isSubmitting}>
              Submit report
            </OrangeButton>
            <OrangeButton type="button" variant="outline" fullWidth textSize={14} onClick={onClose}>
              Cancel
            </OrangeButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TotalEstimationCard({ appointment }: { appointment: DashboardAppointment }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <article className="rounded-[12px] bg-white p-6 shadow-[0px_8px_6px_rgba(0,0,0,0.10)]">
      <div className="flex flex-col gap-3.5">
        <div>
          <h2 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">
            Total estimation for the service
          </h2>
          <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
            Our groomer will evaluate the final price
          </p>
        </div>

        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col items-end">
            <p className="text-right font-comfortaa text-[16px] font-semibold leading-7 text-[#DE6A07]">
              {appointment.originalEstimate ? (
                <span className="font-normal leading-[22.75px] text-[#4A5565]">was {appointment.originalEstimate} </span>
              ) : null}
              {appointment.totalEstimate}
            </p>
            {isExpanded ? (
              <>
                <div className="flex flex-wrap items-end justify-end gap-2">
                  {appointment.savingsLabel ? (
                    <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#DCFCE7] px-3 py-1 font-comfortaa text-[10px] font-bold leading-[14px] text-[#27AE60]">
                      <Icon name="target" className="size-3.5" aria-hidden="true" />
                      {appointment.savingsLabel}
                    </span>
                  ) : null}
                  {appointment.estimateBreakdown ? (
                    <span className="font-comfortaa text-[14px] leading-[22.75px] text-[#DE6A07]">
                      {appointment.estimateBreakdown}
                    </span>
                  ) : null}
                </div>
                <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[#4A5565]">tax included</span>
              </>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded((value) => !value)}
            className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-lg transition-colors hover:border hover:border-[#8B6357]"
            aria-expanded={isExpanded}
            aria-label="Toggle total estimation details"
          >
            <Icon
              name="chevron-down"
              className={`size-5 text-[#8B6357] transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function AmountRow({ line }: { line: DashboardAmountLine }) {
  return (
    <div className="flex items-start justify-between gap-3 font-comfortaa text-[12px] font-bold leading-4 text-[#4A3C2A]">
      <p className="min-w-0 flex-1 break-words">{line.label}</p>
      {line.amount ? <p className="shrink-0 text-right">{line.amount}</p> : null}
    </div>
  );
}

function formatAddOnPrice(value: number | string): string {
  const raw = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(raw)) return String(value).startsWith("$") ? String(value) : `$${value}`;
  return Number.isInteger(raw) ? `$${raw}` : `$${raw.toFixed(2)}`;
}

function normalizeCheckUpWeightUnit(value?: string): string {
  const normalizedValue = value?.trim().toLowerCase();
  if (normalizedValue === "kg") return "kg";
  return "lbs";
}

function CheckUpTabBadge({
  tab,
  activeTab,
  onClick,
}: {
  tab: CheckUpTab;
  activeTab: CheckUpTab;
  onClick: () => void;
}) {
  const labelByTab: Record<CheckUpTab, string> = {
    weight: "Weight",
    "add-ons": "Add-ons",
    personalization: "Personalization",
  };
  const isActive = tab === activeTab;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-6 cursor-pointer items-center gap-1 rounded-xl border px-[9px] py-[5px] font-comfortaa text-[10px] font-bold leading-[14px] ${
        isActive ? "border-[#DE6A07] text-[#DE6A07]" : "border-[#4C4C4C] text-[#4C4C4C]"
      }`}
    >
      {labelByTab[tab]}
      {isActive ? <Icon name="chevron-down" className="size-3 rotate-180 text-current" aria-hidden="true" /> : null}
    </button>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <CustomInput
      label={label}
      type="number"
      min="0"
      step="0.01"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Enter price"
      leftElement={<span className="mr-1 font-comfortaa text-[12.25px] text-[#717182]">$</span>}
    />
  );
}

function buildVisibleAddOns(items: AddOnOut[], selectedIds: number[]): AddOnOut[] {
  const baseItems = items.filter((item) => !item.is_variable);
  const visibleItems = baseItems.slice(0, 6);
  const visibleItemIds = new Set(visibleItems.map((item) => item.id));
  const selectedItems = baseItems.filter((item) => selectedIds.includes(item.id) && !visibleItemIds.has(item.id));
  return [...visibleItems, ...selectedItems];
}

function GroomerCheckUpModal({
  open,
  appointment,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  appointment: DashboardAppointment | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [activeTab, setActiveTab] = useState<CheckUpTab>("weight");
  const [weightValue, setWeightValue] = useState("60");
  const [weightUnit, setWeightUnit] = useState("lbs");
  const [addOns, setAddOns] = useState<AddOnOut[]>(FALLBACK_ADD_ONS);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<number[]>([]);
  const [personalization, setPersonalization] = useState<Record<string, string>>({});
  const [description, setDescription] = useState("");
  const [isApproved, setIsApproved] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActiveTab("weight");
    setWeightValue(appointment?.weightValue || "60");
    setWeightUnit(normalizeCheckUpWeightUnit(appointment?.weightUnit));
    const initialSelectedAddOnIds = appointment?.addonIds ?? [];
    setSelectedAddOnIds(initialSelectedAddOnIds);
    setPersonalization({});
    setDescription("");
    setIsApproved(true);
    setIsSubmitting(false);
    getAddOns()
      .then((items) => {
        const visibleItems = buildVisibleAddOns(items, initialSelectedAddOnIds);
        setAddOns(visibleItems.length > 0 ? visibleItems : FALLBACK_ADD_ONS);
      })
      .catch((error) => {
        console.error("Failed to load add-ons:", error);
        setAddOns(FALLBACK_ADD_ONS);
      });
  }, [appointment?.weightUnit, appointment?.weightValue, open]);

  const toggleAddOn = (id: number, checked: boolean) => {
    setSelectedAddOnIds((current) => checked ? [...new Set([...current, id])] : current.filter((itemId) => itemId !== id));
  };

  const handleNext = async () => {
    if (!appointment?.id) return;

    if (activeTab === "weight") {
      setActiveTab("add-ons");
      return;
    }
    if (activeTab === "add-ons") {
      setActiveTab("personalization");
      return;
    }

    const bookingId = Number(appointment.id);
    if (!Number.isFinite(bookingId)) return;

    setIsSubmitting(true);
    try {
      const result = await submitGroomerCheckUpCheckout(bookingId, {
        weight_value: weightValue,
        weight_unit: weightUnit,
        add_on_ids: selectedAddOnIds,
        personalization,
        description,
      });
      if (result.status === "payment_required") {
        toast.success("Payment request sent to pet owner");
      } else {
        toast.success("No additional payment required");
      }
      onSubmitted();
      onClose();
    } catch (error) {
      console.error("Failed to submit check-up:", error);
      toast.error("Failed to submit check-up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        overlayClassName="service-area-dialog-overlay z-[70]!"
        className="service-area-dialog inset-x-0! bottom-0! top-auto! z-[75]! mx-auto! flex! max-h-[88vh]! w-full! max-w-none! translate-x-0! translate-y-0! flex-col! gap-0! rounded-b-none rounded-t-[calc(24*var(--px393))] border-0! bg-white! p-0! shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] [&>button]:top-[calc(24*var(--px393))] [&>button]:right-[calc(24*var(--px393))] sm:[&>button]:top-6 sm:[&>button]:right-6"
      >
        <DialogTitle className="sr-only">Groomer check up</DialogTitle>
        <DialogDescription className="sr-only">Confirm with pet owner before add extra service.</DialogDescription>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-[calc(24*var(--px393))] pb-[calc(12*var(--px393))] pt-[calc(24*var(--px393))] sm:px-6 sm:pb-3 sm:pt-6">
            <div className="flex flex-col gap-[14px]">
              <div>
                <h2 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">Groomer check up</h2>
                <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
                  Confirm with pet owner before add extra service
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {(["weight", "add-ons", "personalization"] as CheckUpTab[]).map((tab) => (
                  <CheckUpTabBadge key={tab} tab={tab} activeTab={activeTab} onClick={() => setActiveTab(tab)} />
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-[calc(24*var(--px393))] pb-[max(calc(24*var(--px393)),env(safe-area-inset-bottom))] sm:px-6 sm:pb-[max(24px,env(safe-area-inset-bottom))]">
            <div className="flex flex-col gap-[14px]">
              {activeTab === "weight" ? (
                <div className="flex min-h-[130px] flex-col gap-3 rounded-[12px] bg-white p-5 shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)]">
                  <p className="font-comfortaa text-[14px] font-bold leading-5 text-[#DE6A07]">Verify weight with pet owner</p>
                  <div className="flex w-full flex-col items-start gap-2">
                    <div className="flex h-[12.25px] w-full items-center gap-[7px]">
                      <p className="font-comfortaa text-[14px] leading-[22.75px] text-[#4a3c2a]">Weight (lb or kg)</p>
                    </div>
                    <div className="group flex w-full items-start sm:w-[200px]">
                      <div className="relative h-9 flex-1 shrink-0 rounded-bl-[12px] rounded-tl-[12px] bg-white">
                        <div className="flex size-full items-center overflow-clip rounded-[inherit] px-4 py-1">
                          <input
                            type="text"
                            placeholder="Enter weight"
                            value={weightValue}
                            onChange={(event) => setWeightValue(event.target.value)}
                            className="flex-1 border-none bg-transparent font-comfortaa text-[12.25px] text-[#717182] outline-none placeholder:text-[#717182]"
                          />
                        </div>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-bl-[12px] rounded-tl-[12px] border border-solid border-gray-200 transition-colors duration-200 group-hover:border-[#717182] group-focus-within:!border-[#2374ff]"
                        />
                      </div>
                      <div className="shrink-0 opacity-80">
                        <CustomSelect
                          placeholder="Select"
                          value={weightUnit}
                          displayValue={weightUnit === "lbs" ? "lb" : weightUnit}
                          onValueChange={(value) => setWeightUnit(value)}
                          className="w-auto"
                          noLeftRadius
                        >
                          <CustomSelectItem value="kg">kg</CustomSelectItem>
                          <CustomSelectItem value="lbs">lb</CustomSelectItem>
                        </CustomSelect>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "add-ons" ? (
                <div className="flex w-full flex-col items-start gap-5 rounded-[12px] bg-white p-5 shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)]">
                  <div className="flex w-full flex-col items-start gap-1">
                    <p className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4a3c2a]">Most popular add-ons</p>
                    <p className="font-comfortaa text-[12.25px] leading-[17.5px] text-[#4a5565]">Add extra pampering for your furry friend</p>
                  </div>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    {addOns.map((addOn) => (
                      <CommonCheckbox
                        key={addOn.id}
                        name={addOn.name}
                        description={addOn.description ?? undefined}
                        price={formatAddOnPrice(addOn.price)}
                        duration={addOn.service_time || undefined}
                        checked={selectedAddOnIds.includes(addOn.id)}
                        onCheckedChange={(checked) => toggleAddOn(addOn.id, checked)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === "personalization" ? (
                <div className="flex flex-col gap-3">
                  <p className="font-comfortaa text-[14px] font-bold leading-5 text-[#DE6A07]">Personalized service</p>
                  {PERSONALIZATION_FIELDS.map((field) => (
                    <PriceInput
                      key={field.key}
                      label={field.label}
                      value={personalization[field.key] ?? ""}
                      onChange={(value) => setPersonalization((current) => ({ ...current, [field.key]: value }))}
                    />
                  ))}
                  <CustomTextarea
                    label="Description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Enter your note"
                    showResizeHandle={false}
                    className="min-h-[82px]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsApproved((current) => !current)}
                    className="flex items-center gap-2 text-left font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#4A3C2A]"
                  >
                    <span className={`flex size-4 items-center justify-center border ${isApproved ? "border-[#DE6A07] bg-[#DE6A07]" : "border-[#717182] bg-white"}`}>
                      {isApproved ? <Icon name="check" className="size-3 text-white" aria-hidden="true" /> : null}
                    </span>
                    Service and price approved by pet owner
                  </button>
                </div>
              ) : null}

              <div className="flex flex-col gap-[10px]">
                <OrangeButton type="button" fullWidth textSize={14} loading={isSubmitting} onClick={handleNext}>
                  {activeTab === "personalization" ? "Submit" : "Next"}
                </OrangeButton>
                <OrangeButton type="button" variant="outline" fullWidth textSize={14} onClick={onClose}>
                  Cancel
                </OrangeButton>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PackageAndAddonCard({
  appointment,
  onModify,
}: {
  appointment: DashboardAppointment;
  onModify: () => void;
}) {
  const hasAddons = appointment.addonLines.length > 0;

  return (
    <article className="rounded-[12px] bg-white p-6 shadow-[0px_8px_6px_rgba(0,0,0,0.10)]">
      <div className="flex flex-col gap-3">
        <h2 className="font-comfortaa text-[16px] font-semibold leading-7 text-[#4A3C2A]">
          Verify package and add-on
        </h2>

        <div className="flex items-center justify-between gap-3">
          <p className="min-w-0 flex-1 font-comfortaa text-[12.25px] leading-[17.5px] text-[#4A5565]">
            Total estimation for the service
          </p>
          <div className="flex shrink-0 items-start gap-2">
            <p className="text-right font-comfortaa text-[16px] font-semibold leading-7 text-[#DE6A07]">
              {appointment.totalEstimate}
            </p>
            <Icon name="chevron-down" className="mt-1 size-5 rotate-180 text-[#8B6357]" aria-hidden="true" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-comfortaa text-[10px] leading-3 text-[#4A3C2A]">{appointment.packageLabel}</p>
          <div>
            {appointment.packageLines.map((line) => (
              <AmountRow key={`${line.label}-${line.amount}`} line={line} />
            ))}
          </div>
          <div className="border-t border-[#4A3C2A] pt-1">
            <AmountRow line={{ label: "Subtotal", amount: appointment.packageSubtotal }} />
          </div>
        </div>

        {hasAddons ? (
          <div className="flex flex-col gap-1">
            <p className="font-comfortaa text-[10px] leading-3 text-[#4A3C2A]">Add-on</p>
            <div>
              {appointment.addonLines.map((line) => (
                <AmountRow key={`${line.label}-${line.amount}`} line={line} />
              ))}
            </div>
            <div className="border-t border-[#4A3C2A] pt-1">
              <AmountRow line={{ label: "Subtotal", amount: appointment.addonSubtotal }} />
            </div>
          </div>
        ) : null}

        {appointment.priceAdjustmentLines.length > 0 ? (
          <div className="border-t border-[#4A3C2A] pt-1">
            {appointment.priceAdjustmentLines.map((line) => (
              <AmountRow key={`${line.label}-${line.amount}`} line={line} />
            ))}
          </div>
        ) : null}

        <OrangeButton
          type="button"
          variant="secondary"
          size="compact"
          className="mt-1 w-[87px]"
          onClick={onModify}
        >
          Modify
        </OrangeButton>
      </div>
    </article>
  );
}

function BookingRequestItem({
  request,
  onConfirmOriginalTime,
  onProposeNewTime,
  onDecline,
}: {
  request: BookingRequest;
  onConfirmOriginalTime: (
    request: BookingRequest,
    confirmedTime: BookingRequestDecisionTimeOption,
  ) => Promise<void>;
  onProposeNewTime: (
    request: BookingRequest,
    timeOptions: BookingRequestDecisionTimeOption[],
  ) => Promise<void>;
  onDecline: (request: BookingRequest) => Promise<void>;
}) {
  return (
    <BookingRequestInteraction
      request={request}
      passAppointmentContextLabel="DASHBOARD > BOOKING REQUEST"
      passAppointmentReturnLabel="Back to dashboard"
      onConfirmOriginalTime={onConfirmOriginalTime}
      onProposeNewTime={onProposeNewTime}
      onDecline={onDecline}
    />
  );
}

function BookingRequestCard({
  requests,
  onConfirmOriginalTime,
  onProposeNewTime,
  onDecline,
}: {
  requests: BookingRequest[];
  onConfirmOriginalTime: (
    request: BookingRequest,
    confirmedTime: BookingRequestDecisionTimeOption,
  ) => Promise<void>;
  onProposeNewTime: (
    request: BookingRequest,
    timeOptions: BookingRequestDecisionTimeOption[],
  ) => Promise<void>;
  onDecline: (request: BookingRequest) => Promise<void>;
}) {
  return (
    <article className="rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <p className="font-comfortaa text-[12px] leading-[18px] tracking-[0.5px] text-[#8B6357]">BOOKING REQUEST</p>
      <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Confirm appointment</h3>

      <div className="mt-4 flex flex-col gap-4">
        {requests.map((request) => (
          <BookingRequestItem
            key={request.invitationId ?? request.id}
            request={request}
            onConfirmOriginalTime={onConfirmOriginalTime}
            onProposeNewTime={onProposeNewTime}
            onDecline={onDecline}
          />
        ))}
      </div>
    </article>
  );
}

function getInvitationErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    const data =
      error.data && typeof error.data === "object" && !Array.isArray(error.data)
        ? (error.data as { error?: string })
        : null;
    if (typeof data?.error === "string" && data.error.trim()) return data.error.trim();
    if (error.message.trim()) return error.message.trim();
  }

  return fallback;
}

function DailyGoalProgressCard({ dailyGoal }: { dailyGoal: DashboardGoal }) {
  const hasJobProgress = dailyGoal.completed !== null && dailyGoal.total !== null;
  const safeTotal = dailyGoal.total && dailyGoal.total > 0 ? dailyGoal.total : 1;
  const progress = hasJobProgress ? `${Math.min(((dailyGoal.completed ?? 0) / safeTotal) * 100, 100)}%` : "0%";
  const completedLabel = dailyGoal.completed === null ? "-" : String(dailyGoal.completed);
  const totalLabel = dailyGoal.total === null ? "-" : String(dailyGoal.total);

  return (
    <article className="rounded-[16px] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <h2 className="font-comfortaa text-[16px] leading-6 text-[#4A2C55]">Today&apos;s work progress</h2>
      <div className="mt-3 h-[6px] rounded-full bg-[#E5E7EB]">
        <div className="h-full rounded-full bg-[#00A63E]" style={{ width: progress }} />
      </div>
      <div className="mt-3 inline-flex rounded-full bg-[#DCFCE7] px-[10px] py-[2px]">
        <div className="flex items-center gap-1.5">
          <Icon name="target" className="size-4 text-[#16A34A]" aria-hidden="true" />
          <span className="font-comfortaa text-[10px] font-bold leading-[15px] text-[#16A34A]">
            {completedLabel} of {totalLabel} jobs completed
          </span>
        </div>
      </div>
      <div className="mt-3 rounded-[12px] border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#00A63E]">
            <Icon name="star-2" className="size-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#166534]">
              You&apos;re <span className="text-[#00A63E]">{dailyGoal.remainingAmount}</span> away from your daily goal!
            </p>
            <p className="mt-0.5 font-comfortaa text-[10px] leading-[15px] text-[#16A34A]">
              Goal: {dailyGoal.goalAmount} • Current: {dailyGoal.currentAmount}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function DashboardMetricCard({
  icon,
  value,
  label,
}: {
  icon: "logo-mark" | "star-2";
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-[16px] bg-white px-4 py-4 text-center shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <div className="flex justify-center">
        {icon === "logo-mark" ? (
          <Icon name={icon} className="size-10 text-[#633479]" aria-hidden="true" />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-[#FFF5D6]">
            <Icon name={icon} className="size-5 text-[#F59E0B]" aria-hidden="true" />
          </div>
        )}
      </div>
      <p className="mt-3 font-comfortaa text-[22px] leading-[28px] text-[#4A2C55]">{value}</p>
      <p className="mt-1 font-comfortaa text-[11px] leading-[16.5px] text-[#8B6357]">{label}</p>
    </article>
  );
}

function NoUpcomingAppointmentsCard() {
  return (
    <article className="flex h-[213px] flex-col items-center justify-center rounded-[16px] bg-white px-5 shadow-[0px_4px_6px_rgba(0,0,0,0.08)]">
      <div className="flex size-16 items-center justify-center rounded-full bg-[#F3F1EE]">
        <Icon name="clock" className="size-8 text-[#9B6F5F]" aria-hidden="true" />
      </div>
      <p className="mt-5 text-center font-comfortaa text-[18px] font-bold leading-[27px] text-[#4A2C55]">
        No upcoming appointments
      </p>
    </article>
  );
}

function BookingRequestSuccessAlert({
  kind,
  onScheduleClick,
}: {
  kind: BookingRequestSuccessAlertKind;
  onScheduleClick: () => void;
}) {
  const leadingText =
    kind === "confirm"
      ? "Appointment confirmation has been sent. You can verify in "
      : "New times have been proposed and sent. You can verify in ";

  return (
    <div
      role="status"
      className="flex items-center overflow-hidden rounded-[8px] border border-[#6AA31C] bg-[#F4FFDE] px-4 py-2"
    >
      <div className="flex w-full items-start gap-2">
        <span className="mt-0.5 flex size-3 shrink-0 items-center justify-center rounded-full bg-[#6AA31C]">
          <Icon name="check" className="size-2 text-white" aria-hidden="true" />
        </span>
        <p className="min-w-0 flex-1 font-comfortaa text-[12px] font-bold leading-4 text-[#467900]">
          {leadingText}
          <button
            type="button"
            onClick={onScheduleClick}
            className="inline font-comfortaa text-[12px] font-bold leading-4 text-[#467900] underline underline-offset-[2px]"
          >
            Schedule
          </button>
          .
        </p>
      </div>
    </div>
  );
}

export default function GroomerDashboardPage() {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [devTravelStatus, setDevTravelStatus] = useState<"" | "traveling" | "checked_in" | "in_progress">("");
  const [isCancelAppointmentModalOpen, setIsCancelAppointmentModalOpen] = useState(false);
  const [isCheckUpOpen, setIsCheckUpOpen] = useState(false);
  const [isHealthReportOpen, setIsHealthReportOpen] = useState(false);
  const [isSubmittingHealthReport, setIsSubmittingHealthReport] = useState(false);
  const [isTerminateServiceOpen, setIsTerminateServiceOpen] = useState(false);
  const [bookingRequestSuccessAlert, setBookingRequestSuccessAlert] = useState<BookingRequestSuccessAlertKind | null>(null);
  const {
    nextAppointment,
    bookingRequests,
    dailyGoal,
    metrics,
    isLoadingDashboard,
    hasLoadedDashboard,
    isStartingTravel,
    isCancelingTravel,
    isCheckingIn,
    isStartingGrooming,
    isCompletingService,
    isTerminatingService,
    fetchDashboard,
    fetchPendingBookingRequests,
    startTravel,
    cancelTravel,
    checkIn,
    startGrooming,
    completeService,
    terminateService,
  } = useGroomerDashboardStore();

  useEffect(() => {
    fetchDashboard().catch((error) => {
      console.error("Failed to load groomer dashboard:", error);
    });
  }, [fetchDashboard]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!bookingRequestSuccessAlert) return;
    const timeoutId = window.setTimeout(() => setBookingRequestSuccessAlert(null), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [bookingRequestSuccessAlert]);

  const enableDevTravelTest =
    import.meta.env.DEV && new URLSearchParams(window.location.search).get("devTravelTest") === "1";
  const effectiveAppointment = nextAppointment && devTravelStatus
    ? { ...nextAppointment, status: devTravelStatus }
    : nextAppointment;
  const showStartTravel = enableDevTravelTest || (effectiveAppointment?.scheduledTime
    ? shouldShowStartTravel(effectiveAppointment.scheduledTime, now, effectiveAppointment.status)
    : false);
  const normalizedAppointmentStatus = normalizeStatus(effectiveAppointment?.status);
  const showTravelActions = ["traveling", "travel_started", "en_route", "on_the_way", "checked_in"].includes(
    normalizedAppointmentStatus,
  );
  const showCurrentJob = normalizedAppointmentStatus === "checked_in";
  const showInProgressJob = normalizedAppointmentStatus === "in_progress";
  const showCompletedServiceJob = ["completed", "awaiting_final_payment", "reviewed"].includes(normalizedAppointmentStatus);
  const showReviewedServiceJob = showCompletedServiceJob && Boolean(effectiveAppointment?.review);

  const handleStartTravel = async () => {
    if (!effectiveAppointment?.id || isStartingTravel || !showStartTravel) return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("traveling");
        toast.success("Travel started");
        return;
      }
      await startTravel(bookingId);
      toast.success("Travel started");
    } catch (error) {
      console.error("Failed to start travel:", error);
      toast.error("Failed to start travel");
    }
  };

  const handleCancelTravel = async (data: CancelAppointmentFormData) => {
    if (!effectiveAppointment?.id || isCancelingTravel) return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("");
        toast.success("Appointment canceled");
        setIsCancelAppointmentModalOpen(false);
        return;
      }
      await cancelTravel(bookingId, data);
      toast.success("Appointment canceled");
      setIsCancelAppointmentModalOpen(false);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleCheckIn = async () => {
    if (!effectiveAppointment?.id || isCheckingIn) return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("checked_in");
        toast.success("Checked in");
        return;
      }
      await checkIn(bookingId);
      toast.success("Checked in");
    } catch (error) {
      console.error("Failed to check in:", error);
      toast.error("Failed to check in");
    }
  };

  const handleStartGrooming = async () => {
    if (!effectiveAppointment?.id || isStartingGrooming || normalizedAppointmentStatus !== "checked_in") return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("in_progress");
        toast.success("Service started");
        return;
      }
      await startGrooming(bookingId);
      toast.success("Service started");
    } catch (error) {
      console.error("Failed to start grooming:", error);
      toast.error("Failed to start service");
    }
  };

  const handleCompleteService = async () => {
    if (!effectiveAppointment?.id || isCompletingService || normalizedAppointmentStatus !== "in_progress") return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("");
        toast.success("Service completed");
        return;
      }
      await completeService(bookingId);
      toast.success("Service completed");
    } catch (error) {
      console.error("Failed to complete service:", error);
      toast.error("Failed to complete service");
    }
  };

  const handleTerminateService = async (data: TerminateServiceIn) => {
    if (!effectiveAppointment?.id || isTerminatingService || normalizedAppointmentStatus !== "in_progress") return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("");
        setIsTerminateServiceOpen(false);
        toast.success("Service terminated");
        return;
      }
      await terminateService(bookingId, data);
      setIsTerminateServiceOpen(false);
      toast.success("Service terminated");
    } catch (error) {
      console.error("Failed to terminate service:", error);
      toast.error("Failed to terminate service");
    }
  };

  const handleSubmitHealthReport = async (data: HealthReportFormData) => {
    if (!effectiveAppointment?.id || isSubmittingHealthReport) return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    setIsSubmittingHealthReport(true);
    try {
      await submitGroomerHealthReport(bookingId, data);
      setIsHealthReportOpen(false);
      toast.success("Health report submitted");
      fetchDashboard().catch((error) => {
        console.error("Failed to refresh groomer dashboard:", error);
      });
    } catch (error) {
      console.error("Failed to submit health report:", error);
      toast.error("Failed to submit health report");
    } finally {
      setIsSubmittingHealthReport(false);
    }
  };

  const handleConfirmOriginalTime = async (
    request: BookingRequest,
    confirmedTime: BookingRequestDecisionTimeOption,
  ) => {
    if (!request.invitationId || !Number.isFinite(request.invitationId)) {
      toast.error("Missing booking invitation");
      return;
    }

    try {
      await decideGroomerInvitation(request.invitationId, {
        action: "confirm_original_time",
        confirmed_time: confirmedTime,
        note: "",
      });
      setBookingRequestSuccessAlert("confirm");
      fetchPendingBookingRequests().catch((refreshError) => {
        console.error("Failed to refresh pending booking requests:", refreshError);
      });
    } catch (error) {
      console.error("Failed to confirm booking invitation:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to confirm appointment"));
      throw error;
    }
  };

  const handleProposeNewTime = async (
    request: BookingRequest,
    timeOptions: BookingRequestDecisionTimeOption[],
  ) => {
    if (!request.invitationId || !Number.isFinite(request.invitationId)) {
      toast.error("Missing booking invitation");
      return;
    }

    try {
      await decideGroomerInvitation(request.invitationId, {
        action: "propose_new_time",
        time_options: timeOptions,
        note: "",
      });
      setBookingRequestSuccessAlert("propose");
      fetchPendingBookingRequests().catch((refreshError) => {
        console.error("Failed to refresh pending booking requests:", refreshError);
      });
    } catch (error) {
      console.error("Failed to propose new time:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to propose new time"));
      throw error;
    }
  };

  const handleDeclineBookingRequest = async (request: BookingRequest) => {
    if (!request.invitationId || !Number.isFinite(request.invitationId)) {
      toast.error("Missing booking invitation");
      return;
    }

    try {
      await decideGroomerInvitation(request.invitationId, {
        action: "decline",
        note: "",
      });
      toast.success("Appointment passed");
      await fetchPendingBookingRequests();
    } catch (error) {
      console.error("Failed to pass booking invitation:", error);
      toast.error(getInvitationErrorMessage(error, "Failed to pass appointment"));
      throw error;
    }
  };

  const showInitialLoading = isLoadingDashboard && !hasLoadedDashboard;
  const hasUpcomingAppointmentContent = Boolean(nextAppointment) || bookingRequests.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(112*var(--px393))] pt-[calc(8*var(--px393))] sm:px-5 sm:pb-28 sm:pt-2">
      <div className="space-y-3.5">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Dashboard</h1>

        {bookingRequestSuccessAlert ? (
          <BookingRequestSuccessAlert
            kind={bookingRequestSuccessAlert}
            onScheduleClick={() => navigate("/groomer/my-work")}
          />
        ) : null}

        {showInitialLoading ? (
          <LoadingStateCard />
        ) : (
          <>
            {effectiveAppointment && showReviewedServiceJob ? (
              <ReviewedServiceCard
                appointment={effectiveAppointment}
                onFillReport={() => setIsHealthReportOpen(true)}
                onViewNextJob={() => navigate("/groomer/my-work")}
              />
            ) : effectiveAppointment && showCompletedServiceJob ? (
              <CompletedServiceCard
                appointment={effectiveAppointment}
                onFillReport={() => setIsHealthReportOpen(true)}
              />
            ) : effectiveAppointment && showInProgressJob ? (
              <InProgressJobCard
                appointment={effectiveAppointment}
                isCompletingService={isCompletingService}
                onCompleteService={handleCompleteService}
                onTerminateService={() => setIsTerminateServiceOpen(true)}
              />
            ) : effectiveAppointment && showCurrentJob ? (
              <>
                <PackageAndAddonCard appointment={effectiveAppointment} onModify={() => setIsCheckUpOpen(true)} />
                <CurrentJobCard
                  appointment={effectiveAppointment}
                  isStartingGrooming={isStartingGrooming}
                  onStartGrooming={handleStartGrooming}
                />
              </>
            ) : effectiveAppointment && showTravelActions ? (
              <>
                <TravelMapCard
                  appointment={effectiveAppointment}
                  isCheckingIn={isCheckingIn}
                  isCancelingTravel={isCancelingTravel}
                  onCheckIn={handleCheckIn}
                  onCancelTravel={() => setIsCancelAppointmentModalOpen(true)}
                />
                <TotalEstimationCard appointment={effectiveAppointment} />
              </>
            ) : effectiveAppointment ? (
              <AppointmentSummaryCard
                appointment={effectiveAppointment}
                showStartTravel={showStartTravel}
                isStartingTravel={isStartingTravel}
                onStartTravel={handleStartTravel}
              />
            ) : null}

            {bookingRequests.length > 0 ? (
              <BookingRequestCard
                requests={bookingRequests}
                onConfirmOriginalTime={handleConfirmOriginalTime}
                onProposeNewTime={handleProposeNewTime}
                onDecline={handleDeclineBookingRequest}
              />
            ) : null}

            {!hasUpcomingAppointmentContent ? <NoUpcomingAppointmentsCard /> : null}

            <DailyGoalProgressCard dailyGoal={dailyGoal} />

            <div className="grid grid-cols-2 gap-3">
              <DashboardMetricCard icon="logo-mark" value={metrics.partnerScore} label="Mutopia partner score" />
              <DashboardMetricCard icon="star-2" value={metrics.rating} label="Rating" />
            </div>
          </>
        )}
      </div>
      <GroomerCheckUpModal
        open={isCheckUpOpen}
        appointment={effectiveAppointment}
        onClose={() => setIsCheckUpOpen(false)}
        onSubmitted={() => {
          fetchDashboard().catch((error) => {
            console.error("Failed to refresh groomer dashboard:", error);
          });
        }}
      />
      <CancelAppointmentModal
        open={isCancelAppointmentModalOpen}
        isSubmitting={isCancelingTravel}
        onClose={() => setIsCancelAppointmentModalOpen(false)}
        onSubmit={handleCancelTravel}
      />
      <HealthReportModal
        open={isHealthReportOpen}
        isSubmitting={isSubmittingHealthReport}
        appointment={effectiveAppointment}
        onClose={() => setIsHealthReportOpen(false)}
        onSubmit={handleSubmitHealthReport}
      />
      <ServiceTerminationModal
        open={isTerminateServiceOpen}
        isSubmitting={isTerminatingService}
        onClose={() => setIsTerminateServiceOpen(false)}
        onSubmit={handleTerminateService}
      />
    </div>
  );
}

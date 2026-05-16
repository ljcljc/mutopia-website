import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Spinner } from "@/components/common/Spinner";
import {
  BookingRequestInteraction,
  type BookingRequestDecisionTimeOption,
} from "@/modules/groomer/components/BookingRequestContent";
import { GroomerUpNextCard } from "@/modules/groomer/components/GroomerUpNextCard";
import {
  useGroomerDashboardStore,
  type DashboardAppointment,
  type DashboardGoal,
} from "@/modules/groomer/groomerStore";
import { shouldShowStartTravel } from "@/modules/groomer/utils/time";
import { decideGroomerInvitation } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

type BookingRequest = DashboardAppointment;

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

function TotalEstimationCard({ appointment }: { appointment: DashboardAppointment }) {
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
          </div>
          <Icon name="chevron-down" className="mt-1 size-5 rotate-180 text-[#8B6357]" aria-hidden="true" />
        </div>
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
      <h2 className="font-comfortaa text-[16px] leading-6 text-[#4A2C55]">Daily goal progress</h2>
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

export default function GroomerDashboardPage() {
  const [now, setNow] = useState(() => new Date());
  const [devTravelStatus, setDevTravelStatus] = useState<"" | "traveling" | "checked_in">("");
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
    fetchDashboard,
    fetchPendingBookingRequests,
    startTravel,
    cancelTravel,
    checkIn,
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

  const enableDevTravelTest =
    import.meta.env.DEV && new URLSearchParams(window.location.search).get("devTravelTest") === "1";
  const effectiveAppointment = nextAppointment && devTravelStatus
    ? { ...nextAppointment, status: devTravelStatus }
    : nextAppointment;
  const showStartTravel = enableDevTravelTest || (effectiveAppointment?.scheduledTime
    ? shouldShowStartTravel(effectiveAppointment.scheduledTime, now)
    : false);
  const normalizedAppointmentStatus = normalizeStatus(effectiveAppointment?.status);
  const showTravelActions = ["traveling", "travel_started", "en_route", "on_the_way", "checked_in"].includes(
    normalizedAppointmentStatus,
  );

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

  const handleCancelTravel = async () => {
    if (!effectiveAppointment?.id || isCancelingTravel) return;

    const bookingId = Number(effectiveAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      if (enableDevTravelTest) {
        setDevTravelStatus("");
        toast.success("Appointment canceled");
        return;
      }
      await cancelTravel(bookingId);
      toast.success("Appointment canceled");
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
      toast.success("Appointment confirmed");
      await fetchPendingBookingRequests();
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
      toast.success("New time proposed");
      await fetchPendingBookingRequests();
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
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-2">
      <div className="space-y-3.5">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Dashboard</h1>

        {showInitialLoading ? (
          <LoadingStateCard />
        ) : (
          <>
            {effectiveAppointment && showTravelActions ? (
              <>
                <TravelMapCard
                  appointment={effectiveAppointment}
                  isCheckingIn={isCheckingIn}
                  isCancelingTravel={isCancelingTravel}
                  onCheckIn={handleCheckIn}
                  onCancelTravel={handleCancelTravel}
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
    </div>
  );
}

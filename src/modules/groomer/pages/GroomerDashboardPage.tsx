import { useEffect, useState } from "react";
import { Icon } from "@/components/common/Icon";
import {
  BookingRequestContent,
  type BookingRequestDecisionTimeOption,
} from "@/modules/groomer/components/BookingRequestContent";
import { cn } from "@/components/ui/utils";
import { GroomerUpNextCard } from "@/modules/groomer/components/GroomerUpNextCard";
import {
  useGroomerDashboardStore,
  type DashboardAppointment,
  type DashboardGoal,
} from "@/modules/groomer/groomerStore";
import { decideGroomerInvitation } from "@/lib/api";
import { toast } from "sonner";

type BookingRequest = DashboardAppointment;

function AppointmentSummaryCard({
  appointment,
  isStartingTravel,
  onStartTravel,
}: {
  appointment: DashboardAppointment;
  isStartingTravel: boolean;
  onStartTravel: () => void;
}) {
  return (
    <GroomerUpNextCard
      appointment={appointment}
      timeBadgeTone="blue"
      footer={
        <button
          type="button"
          onClick={onStartTravel}
          disabled={isStartingTravel}
          className="flex h-[38px] w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] font-comfortaa text-[14px] font-bold leading-[21px] text-white shadow-[0px_10px_18px_rgba(240,138,18,0.28)] transition-transform active:scale-[0.99]"
        >
          {isStartingTravel ? "Starting..." : "Start Travel"}
        </button>
      }
    />
  );
}

function BookingRequestItem({
  request,
  onConfirm,
}: {
  request: BookingRequest;
  onConfirm: (request: BookingRequest, timeOptions: BookingRequestDecisionTimeOption[]) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <BookingRequestContent
      request={request}
      showHeader={false}
      expanded={isExpanded}
      passAppointmentContextLabel="DASHBOARD > BOOKING REQUEST"
      passAppointmentReturnLabel="Back to dashboard"
      onConfirmAppointment={(timeOption) => onConfirm(request, timeOption)}
      accessory={
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse booking request" : "Expand booking request"}
          className="flex size-6 shrink-0 items-center justify-center rounded-full self-start"
        >
          <Icon
            name="chevron-down"
            className={cn("size-4 text-[#717182]", isExpanded ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>
      }
    />
  );
}

function BookingRequestCard({
  requests,
  onConfirm,
}: {
  requests: BookingRequest[];
  onConfirm: (request: BookingRequest, timeOptions: BookingRequestDecisionTimeOption[]) => Promise<void>;
}) {
  return (
    <article className="rounded-[16px] bg-white px-5 py-5 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
      <p className="font-comfortaa text-[12px] leading-[18px] tracking-[0.5px] text-[#8B6357]">BOOKING REQUEST</p>
      <h3 className="mt-1 font-comfortaa text-[20px] font-bold leading-[30px] text-[#4A2C55]">Confirm appointment</h3>

      <div className="mt-4 flex flex-col gap-4">
        {requests.map((request) => (
          <BookingRequestItem key={request.invitationId ?? request.id} request={request} onConfirm={onConfirm} />
        ))}
      </div>
    </article>
  );
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

export default function GroomerDashboardPage() {
  const {
    nextAppointment,
    bookingRequests,
    dailyGoal,
    metrics,
    isLoadingDashboard,
    hasLoadedDashboard,
    isStartingTravel,
    fetchDashboard,
    startTravel,
  } = useGroomerDashboardStore();

  useEffect(() => {
    fetchDashboard().catch((error) => {
      console.error("Failed to load groomer dashboard:", error);
    });
  }, [fetchDashboard]);

  const handleStartTravel = async () => {
    if (!nextAppointment?.id || isStartingTravel) return;

    const bookingId = Number(nextAppointment.id);
    if (!Number.isFinite(bookingId)) return;

    try {
      await startTravel(bookingId);
      toast.success("Travel started");
    } catch (error) {
      console.error("Failed to start travel:", error);
      toast.error("Failed to start travel");
    }
  };

  const handleConfirmBookingRequest = async (
    request: BookingRequest,
    timeOptions: BookingRequestDecisionTimeOption[],
  ) => {
    if (!request.invitationId || !Number.isFinite(request.invitationId)) {
      toast.error("Missing booking invitation");
      return;
    }

    try {
      await decideGroomerInvitation(request.invitationId, {
        accept: true,
        time_options: timeOptions,
        note: "",
      });
      toast.success("Appointment confirmed");
      await fetchDashboard();
    } catch (error) {
      console.error("Failed to confirm booking invitation:", error);
      toast.error("Failed to confirm appointment");
      throw error;
    }
  };

  const showInitialLoading = isLoadingDashboard && !hasLoadedDashboard;

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-28 pt-2">
      <div className="space-y-3.5">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Dashboard</h1>

        {showInitialLoading ? (
          <div className="rounded-[16px] bg-white px-4 py-4 shadow-[0px_4px_12px_rgba(0,0,0,0.08)]">
            <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {nextAppointment ? (
              <AppointmentSummaryCard
                appointment={nextAppointment}
                isStartingTravel={isStartingTravel}
                onStartTravel={handleStartTravel}
              />
            ) : null}

            {bookingRequests.length > 0 ? (
              <BookingRequestCard requests={bookingRequests} onConfirm={handleConfirmBookingRequest} />
            ) : null}

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

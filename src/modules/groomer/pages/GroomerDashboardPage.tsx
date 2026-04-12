import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { BookingRequestContent } from "@/modules/groomer/components/BookingRequestContent";
import { GroomerUpNextCard, type GroomerUpNextAppointment } from "@/modules/groomer/components/GroomerUpNextCard";

type DashboardAppointment = GroomerUpNextAppointment & {
  id: string;
};

type BookingRequest = DashboardAppointment;

const nextAppointment: DashboardAppointment = {
  id: "next-max",
  petName: "Max",
  breed: "Golden retriever",
  owner: "Emma Johnson",
  avatarUrl: "https://www.figma.com/api/mcp/asset/bfdce912-7cc8-4331-88f4-642b1f2b1b5f",
  address: "565 West 207th Street",
  service: "Full Groom Package",
  duration: "Est. duration: 90 minutes",
  time: "2:00 PM",
};

const bookingRequest: BookingRequest | null = {
  id: "request-max",
  petName: "Max",
  breed: "Golden Retriever",
  owner: "Emma Johnson",
  avatarUrl: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
  address: "565 West 207th Street",
  service: "Full Groom Package",
  duration: "Est. duration: 90 minutes",
  time: "2:00 PM",
};

const dailyGoal = {
  completed: 3,
  total: 5,
  remainingAmount: "$55",
  goalAmount: "$200",
  currentAmount: "$145",
};

function AppointmentSummaryCard({ appointment }: { appointment: DashboardAppointment }) {
  return (
    <GroomerUpNextCard
      appointment={appointment}
      timeBadgeTone="blue"
      footer={
        <button
          type="button"
          className="flex h-[38px] w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,#F7A01B_0%,#F08A12_100%)] font-comfortaa text-[14px] font-bold leading-[21px] text-white shadow-[0px_10px_18px_rgba(240,138,18,0.28)] transition-transform active:scale-[0.99]"
        >
          Start Travel
        </button>
      }
    />
  );
}

function BookingRequestCard({ request }: { request: BookingRequest }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <article className="rounded-[16px] bg-white px-4 py-4 shadow-[0px_4px_14px_rgba(0,0,0,0.1)]">
      {isExpanded ? (
        <BookingRequestContent
          request={request}
          passAppointmentContextLabel="DASHBOARD > BOOKING REQUEST"
          passAppointmentReturnLabel="Back to dashboard"
          accessory={
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-expanded={isExpanded}
              aria-label="Collapse booking request"
              className="flex size-6 shrink-0 items-center justify-center rounded-full self-start"
            >
              <Icon name="chevron-down" className="size-4 rotate-180 text-[#8B6357]" aria-hidden="true" />
            </button>
          }
        />
      ) : (
        <div>
          <p className="font-comfortaa text-[11px] leading-[16.5px] tracking-[0.5px] text-[#A07D72]">BOOKING REQUEST</p>
          <h3 className="mt-1 font-comfortaa text-[18px] leading-[27px] text-[#4A2C55]">Confirm appointment</h3>

          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            aria-expanded={isExpanded}
            aria-label="Expand booking request"
            className="mt-4 w-full rounded-[10px] bg-[#F8F7F3] px-3 py-[11px] text-left"
          >
            <div className="flex items-center gap-3">
              <img src={request.avatarUrl} alt={request.petName} className="size-[50px] rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-comfortaa text-[14px] leading-[21px] text-[#4A2C55]">
                  {request.petName} - {request.breed}
                </p>
                <p className="mt-0.5 font-comfortaa text-[11px] leading-[16.5px] text-[#15A34A]">
                  <span aria-hidden="true">• </span>
                  Owner: {request.owner}
                </p>
                <div className="mt-[7px] inline-flex rounded-full border border-[#DE1507] px-[10px] py-[4px]">
                  <span className="font-comfortaa text-[11px] leading-[16.5px] text-[#DE1507]">Expired in 24 hours</span>
                </div>
              </div>
              <Icon name="chevron-down" size={14} className="text-[#8B6357]" aria-hidden="true" />
            </div>
          </button>
        </div>
      )}
    </article>
  );
}

function DailyGoalProgressCard() {
  const progress = `${(dailyGoal.completed / dailyGoal.total) * 100}%`;

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
            {dailyGoal.completed} of {dailyGoal.total} jobs completed
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
  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-4 pb-28 pt-2">
      <div className="space-y-3.5">
        <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Dashboard</h1>

        <AppointmentSummaryCard appointment={nextAppointment} />

        {bookingRequest ? <BookingRequestCard request={bookingRequest} /> : null}

        <DailyGoalProgressCard />

        <div className="grid grid-cols-2 gap-3">
          <DashboardMetricCard icon="logo-mark" value="89/100" label="Mutopia partner score" />
          <DashboardMetricCard icon="star-2" value="4.9" label="Rating" />
        </div>
      </div>
    </div>
  );
}

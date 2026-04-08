import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, PurpleButton, type FeatureItem } from "@/components/common";
import { useBookingStore } from "@/components/booking/bookingStore";
import { useMemo } from "react";
import { TIME_PERIODS } from "@/constants/calendar";

// Format date to "Friday, 2025.10.31" format
const formatDateWithWeekday = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = weekdays[dateObj.getDay()];
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${weekday}, ${year}.${month}.${day}`;
};

export default function PaymentSuccess() {
  const navigate = useNavigate();
  
  // Get booking data from store (or could fetch from API using bookingId)
  const {
    address,
    city,
    province,
    postCode,
    selectedTimeSlots,
    services,
    serviceId,
    membershipPlans,
  } = useBookingStore();

  // Get selected service
  const selectedService = services.find((s) => s.id === serviceId);
  const serviceName = selectedService?.name || "Full grooming + Teeth brushing";

  // Format date and time slots
  const formattedTimeSlots = useMemo(() => {
    return selectedTimeSlots.map((slot) => {
      const date = new Date(slot.date);
      const formattedDate = formatDateWithWeekday(date);
      const timePeriod = TIME_PERIODS.find((p) => p.id === slot.slot);
      const period = timePeriod?.label.split(" ")[1] || (slot.slot === "morning" ? "AM" : "PM");
      return `${formattedDate} ${period}`;
    });
  }, [selectedTimeSlots]);

  // Calculate savings (mock data for now)
  const savings = 15.5;

  // Get membership plan for upsell
  const membershipPlan = membershipPlans[0]; // Use first plan as default
  const membershipPrice = membershipPlan
    ? typeof membershipPlan.fee === "string"
      ? parseFloat(membershipPlan.fee)
      : membershipPlan.fee
    : 84;
  const membershipOriginalPrice = 99;
  const membershipSavings = membershipOriginalPrice - membershipPrice;

  // Membership features
  const membershipFeatures: FeatureItem[] = [
    { text: "30$ instant cash coupons", isHighlight: true },
    { text: "10% off additional services" },
    { text: "Priority booking" },
    { text: "Free de-shedding treatment" },
    { text: "Premium products upgrade" },
    { text: "Grooming photo updates" },
  ];

  const handleAddMembership = () => {
    // TODO: Navigate to membership purchase or handle membership addition
    console.log("Add membership");
  };

  const handleGoToAccount = () => {
    navigate("/account/dashboard");
  };

  const handleBookAnother = () => {
    navigate("/booking");
  };

  return (
    <div className="relative flex min-h-full w-full flex-col items-center gap-8 bg-[#f9f1e8] px-4 pb-15 pt-10 md:gap-15 md:px-0 md:pt-15 md:pb-25">
      <div className="relative flex w-full max-w-[780px] shrink-0 flex-col items-start gap-8">
        {/* Confirmation Header */}
        <div className="flex w-full flex-col items-center">
          <div className="mb-1 flex size-10 items-center justify-center rounded-[20px] bg-[#6AA31C] md:mb-4 md:size-20 md:rounded-full">
            <Icon name="check" className="size-5 text-white md:size-12" />
          </div>
          <h1 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4C4C4C] md:text-2xl md:font-bold md:text-[#4a3c2a]">
            Appointment confirmed
          </h1>
        </div>

        {/* Appointment Details Card */}
        <div className="w-full rounded-xl bg-white p-6 shadow-lg md:rounded-2xl md:shadow-lg">
          {/* Title and Savings Badge */}
          <div className="mb-5 flex flex-col items-start gap-1 md:mb-5 md:flex-row md:items-start md:justify-between md:gap-0">
            <h2 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4a5565] md:text-xl md:font-bold md:text-[#4a3c2a]">
              {serviceName}
            </h2>
            <div className="flex h-6 items-center rounded-xl bg-[#DCFCE7] px-4 py-1 md:bg-[#D5EDD8] md:px-3 md:py-1">
              <div className="text-[#016630] md:text-[#388E3C] text-[10px] md:text-sm leading-[14px] md:leading-[20px] font-comfortaa md:font-comfortaa font-bold md:font-medium">
                You saved ${savings.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Address and Date/Time */}
          <div className="mb-5 flex flex-col justify-between gap-x-12 gap-y-3 md:mb-5 md:flex-row">
            {/* Address Section */}
            <div className="flex-1">
              <p className="mb-1 font-comfortaa text-[10px] leading-[12px] font-normal text-[#4A3C2A] md:mb-2 md:text-sm md:leading-[20px] md:text-[#6B7280]">
                Address
              </p>
              <div className="font-comfortaa space-y-0.5 text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:space-y-1 md:text-base md:leading-[24px] md:font-normal">
                <p>{address}</p>
                <p>{city} {province} {postCode}</p>
                <p>CANADA</p>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="flex-1">
              <p className="mb-1 font-comfortaa text-[10px] leading-[12px] font-normal text-[#4A3C2A] md:mb-2 md:text-sm md:leading-[20px] md:text-[#6B7280]">
                Date and time selected
              </p>
              <div className="font-comfortaa space-y-0.5 text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:space-y-1 md:text-base md:leading-[24px] md:font-normal">
                {formattedTimeSlots.map((slot, index) => (
                  <p key={index}>{slot}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Next Step Instructions */}
          <div>
            <h3 className="mb-3 font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4a5565] md:mb-4 md:text-xl md:font-bold md:text-[#4A3C2A]">
              Next step
            </h3>
            <ol className="font-comfortaa list-decimal space-y-1 pl-4.5 text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:space-y-2 md:pl-5 md:text-base md:leading-[24px] md:font-normal">
              <li>You will receive a confirmation with the date and time within 48 hours.</li>
              <li>The appointment can be confirmed using the link provided in the email.</li>
            </ol>
          </div>
        </div>

        {/* Membership Upsell Section */}
        {/* {!useMembership && membershipPlan && ( */}
        {(
          <div className="relative w-full overflow-hidden rounded-xl bg-[#633479] p-6 md:rounded-2xl md:p-8">
            {/* Decorative background circles */}
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[74px] left-[46px] top-[116px]" />
            <div className="absolute bg-[rgba(255,255,255,0.35)] opacity-30 rounded-full size-[42px] left-[108px] top-[86px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[60px] right-[15px] bottom-[130px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[118px] right-[143px] bottom-[-10px]" />
            
            <div className="relative z-10">
              <h2 className="mb-4 font-comfortaa text-[16px] leading-[28px] font-semibold text-white md:mb-6 md:text-xl md:font-bold">
                You can still save more*
              </h2>
              
            <div className="w-full rounded-2xl bg-[rgba(255,255,255,0.96)] px-6 py-8 shadow-lg md:mx-auto md:max-w-md md:bg-white md:p-8 md:shadow-lg">
                <div className="flex flex-col gap-6">
                  {/* Title and Price */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-comfortaa text-center text-[20px] leading-[normal] font-bold text-[#633479] md:text-2xl">
                        Premium Plus
                      </p>
                      <p className="font-comfortaa font-bold text-[#633479] text-[24px] md:text-2xl">${membershipPrice}</p>
                      <p className="font-comfortaa font-normal text-[#4a5565] text-[14px] md:text-sm">/year</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <p className="font-comfortaa font-normal text-[#4a5565] text-[14px] md:text-sm line-through">was ${membershipOriginalPrice}/year</p>
                      <div className="flex h-6 items-center rounded-full bg-[#DCFCE7] px-4 py-1">
                        <p className="font-comfortaa font-bold text-[#016630] text-[10px] md:text-xs leading-[14px]">Save ${membershipSavings.toFixed(2)} more</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="flex flex-col gap-3">
                    {membershipFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Icon name="check-green" className="mt-0.5 size-4 shrink-0 text-[#00A63E]" />
                        <p className={`font-comfortaa font-bold text-[12.25px] md:text-sm leading-[17.5px] ${
                          feature.isHighlight ? "text-[#de6a07]" : "text-[#364153]"
                        }`}>
                          {feature.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Membership Button */}
                  <PurpleButton
                    variant="primary"
                    size="medium"
                    className="w-full md:h-12 md:px-7 md:py-3.5"
                    onClick={handleAddMembership}
                  >
                    Add membership
                  </PurpleButton>
                </div>
              </div>

              <p className="mt-4 text-center font-comfortaa text-[10px] leading-[12px] font-normal text-white md:text-sm md:leading-[20px]">
                * The payment will be based on your benefit for last appointment.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex w-full flex-col gap-5 md:flex-row md:justify-between md:gap-4">
          <OrangeButton
            size="medium"
            onClick={handleGoToAccount}
            className="flex w-full items-center gap-2 md:h-12 md:w-auto md:px-7 md:py-3.5"
          >
            Go to My account
          </OrangeButton>

          <PurpleButton
            variant="outlinePurple"
            size="medium" 
            onClick={handleBookAnother}
            className="w-full md:h-12 md:w-auto md:px-7 md:py-3.5"
          >
            Book another Appointment
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

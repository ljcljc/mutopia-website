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
    <div className="box-border content-stretch flex flex-col gap-[32px] md:gap-[60px] items-center pb-[60px] md:pb-[100px] pt-[40px] md:pt-[60px] px-[16px] md:px-0 w-full min-h-full relative bg-[#f9f1e8]">
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full max-w-[780px]">
        {/* Confirmation Header */}
        <div className="flex flex-col items-center w-full">
          <div className="w-[40px] h-[40px] md:w-20 md:h-20 bg-[#6AA31C] rounded-[20px] md:rounded-full flex items-center justify-center mb-[4px] md:mb-4">
            <Icon name="check" className="size-[20px] md:size-12 text-white" />
          </div>
          <h1 className="text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4C4C4C] md:text-2xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:text-[#4a3c2a]">
            Appointment confirmed
          </h1>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-[12px] md:rounded-[16px] p-[24px] md:p-6 md:shadow-lg shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] w-full">
          {/* Title and Savings Badge */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-[4px] md:gap-0 items-start mb-[20px] md:mb-5">
            <h2 className="text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4a5565] md:text-xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:text-[#4a3c2a]">
              {serviceName}
            </h2>
            <div className="bg-[#DCFCE7] md:bg-[#D5EDD8] rounded-[12px] px-[16px] md:px-3 py-[4px] md:py-1 h-[24px] flex items-center">
              <div className="text-[#016630] md:text-[#388E3C] text-[10px] md:text-sm leading-[14px] md:leading-[20px] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Medium',sans-serif] font-bold md:font-medium">
                You saved ${savings.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Address and Date/Time */}
          <div className="flex flex-col md:flex-row justify-between gap-x-12 gap-y-[12px] mb-[20px] md:mb-5">
            {/* Address Section */}
            <div className="flex-1">
              <p className="text-[10px] leading-[12px] md:text-sm md:leading-[20px] font-['Comfortaa:Regular',sans-serif] font-normal text-[#4A3C2A] md:text-[#6B7280] mb-[4px] md:mb-2">
                Address
              </p>
              <div className="text-[#4A3C2A] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Regular',sans-serif] font-bold md:font-normal text-[12px] md:text-base leading-[16px] md:leading-[24px] space-y-[2px] md:space-y-1">
                <p>{address}</p>
                <p>{city} {province} {postCode}</p>
                <p>CANADA</p>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="flex-1">
              <p className="text-[10px] leading-[12px] md:text-sm md:leading-[20px] font-['Comfortaa:Regular',sans-serif] font-normal text-[#4A3C2A] md:text-[#6B7280] mb-[4px] md:mb-2">
                Date and time selected
              </p>
              <div className="text-[#4A3C2A] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Regular',sans-serif] font-bold md:font-normal text-[12px] md:text-base leading-[16px] md:leading-[24px] space-y-[2px] md:space-y-1">
                {formattedTimeSlots.map((slot, index) => (
                  <p key={index}>{slot}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Next Step Instructions */}
          <div>
            <h3 className="text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4a5565] mb-[12px] md:text-xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:text-[#4A3C2A] md:mb-4">
              Next step
            </h3>
            <ol className="list-decimal pl-[18px] md:pl-5 space-y-[4px] md:space-y-2 text-[12px] md:text-base leading-[16px] md:leading-[24px] text-[#4A3C2A] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Regular',sans-serif] font-bold md:font-normal">
              <li>You will receive a confirmation with the date and time within 48 hours.</li>
              <li>The appointment can be confirmed using the link provided in the email.</li>
            </ol>
          </div>
        </div>

        {/* Membership Upsell Section */}
        {/* {!useMembership && membershipPlan && ( */}
        {(
          <div className="bg-[#633479] rounded-[12px] md:rounded-[16px] p-[24px] md:p-8 relative overflow-hidden w-full">
            {/* Decorative background circles */}
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[74px] left-[46px] top-[116px]" />
            <div className="absolute bg-[rgba(255,255,255,0.35)] opacity-30 rounded-full size-[42px] left-[108px] top-[86px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[60px] right-[15px] bottom-[130px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[118px] right-[143px] bottom-[-10px]" />
            
            <div className="relative z-10">
              <h2 className="text-white text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold mb-[16px] md:text-xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:mb-6">
                You can still save more*
              </h2>
              
              <div className="bg-[rgba(255,255,255,0.96)] md:bg-white rounded-[16px] py-[32px] px-6 md:p-8 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] md:shadow-lg w-full md:max-w-md md:mx-auto">
                <div className="flex flex-col gap-6">
                  {/* Title and Price */}
                  <div className="flex flex-col items-center gap-[4px]">
                    <div className="flex items-center gap-2">
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#633479] text-[20px] leading-[normal] text-center md:text-2xl">
                        Premium Plus
                      </p>
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#633479] text-[24px] md:text-2xl">${membershipPrice}</p>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a5565] text-[14px] md:text-sm">/year</p>
                    </div>
                    <div className="flex flex-col items-center gap-[4px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a5565] text-[14px] md:text-sm line-through">was ${membershipOriginalPrice}/year</p>
                      <div className="bg-[#DCFCE7] rounded-full px-[16px] py-[4px] h-[24px] flex items-center">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#016630] text-[10px] md:text-xs leading-[14px]">Save ${membershipSavings.toFixed(2)} more</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="flex flex-col gap-[12px] md:gap-3">
                    {membershipFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Icon name="check-green" className="size-[16px] text-[#00A63E] mt-0.5 shrink-0" />
                        <p className={`font-['Comfortaa:Bold',sans-serif] font-bold text-[12.25px] md:text-sm leading-[17.5px] ${
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
                    className="w-full md:h-[48px] md:px-[28px] md:py-[14px]"
                    onClick={handleAddMembership}
                  >
                    Add membership
                  </PurpleButton>
                </div>
              </div>

              <p className="text-white text-[10px] leading-[12px] md:text-sm md:leading-[20px] font-['Comfortaa:Regular',sans-serif] font-normal mt-[16px] md:mt-4 text-center">
                * The payment will be based on your benefit for last appointment.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex flex-col md:flex-row gap-[20px] md:gap-4 md:justify-between w-full">
          <OrangeButton
            size="medium"
            onClick={handleGoToAccount}
            className="flex items-center gap-2 w-full md:w-auto md:h-[48px] md:px-[28px] md:py-[14px]"
          >
            Go to My account
          </OrangeButton>

          <PurpleButton
            variant="outlinePurple"
            size="medium" 
            onClick={handleBookAnother}
            className="w-full md:w-auto md:h-[48px] md:px-[28px] md:py-[14px]"
          >
            Book another Appointment
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

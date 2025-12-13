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
    navigate("/account");
  };

  const handleBookAnother = () => {
    navigate("/booking");
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-[60px] items-center pb-[100px] pt-[60px] px-0 w-full min-h-full relative bg-[#f9f1e8]">
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-[780px] max-w-[780px]">
        {/* Confirmation Header */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="w-20 h-20 bg-[#6AA31C] rounded-full flex items-center justify-center mb-4">
            <Icon name="check" className="size-12 text-white" />
          </div>
          <h1 className="text-2xl font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">Appointment confirmed</h1>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-[16px] p-6 md:p-8 mb-8 shadow-lg w-full">
          {/* Title and Savings Badge */}
          <div className="flex items-start justify-between mb-5">
            <h2 className="text-xl font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">{serviceName}</h2>
            <div className="bg-[#D5EDD8] rounded-[12px] px-3 py-1">
              <div className="text-[#388E3C] text-sm font-['Comfortaa:Medium',sans-serif] font-medium">You saved ${savings.toFixed(2)}</div>
            </div>
          </div>

          {/* Address and Date/Time */}
          <div className="flex flex-col md:flex-row justify-between gap-x-12 mb-5">
            {/* Address Section */}
            <div className="flex-1">
              <p className="text-sm font-['Comfortaa:Regular',sans-serif] font-normal text-[#6B7280] mb-2">Address</p>
              <div className="text-[#4A3C2A] font-['Comfortaa:Regular',sans-serif] font-normal text-base space-y-1">
                <p>{address}</p>
                <p>{city} {province} {postCode}</p>
                <p>CANADA</p>
              </div>
            </div>

            {/* Date and Time Section */}
            <div className="flex-1">
              <p className="text-sm font-['Comfortaa:Regular',sans-serif] font-normal text-[#6B7280] mb-2">Date and time selected</p>
              <div className="text-[#4A3C2A] font-['Comfortaa:Regular',sans-serif] font-normal text-base space-y-1">
                {formattedTimeSlots.map((slot, index) => (
                  <p key={index}>{slot}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Next Step Instructions */}
          <div className="">
            <h3 className="text-lg md:text-xl font-['Comfortaa:Bold',sans-serif] font-bold text-[#4A3C2A] mb-4">Next step</h3>
            <ol className="list-decimal pl-5 space-y-2 text-base text-[#4A3C2A] font-['Comfortaa:Regular',sans-serif] font-normal">
              <li>You will receive a confirmation with the date and time within 48 hours.</li>
              <li>The appointment can be confirmed using the link provided in the email.</li>
            </ol>
          </div>
        </div>

        {/* Membership Upsell Section */}
        {/* {!useMembership && membershipPlan && ( */}
        {(
          <div className="bg-[#633479] rounded-[16px] p-8 mb-8 relative overflow-hidden w-full">
            {/* Decorative background circles */}
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[74px] left-[46px] top-[116px]" />
            <div className="absolute bg-[rgba(255,255,255,0.35)] opacity-30 rounded-full size-[42px] left-[108px] top-[86px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[60px] right-[15px] bottom-[130px]" />
            <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[118px] right-[143px] bottom-[-10px]" />
            
            <div className="relative z-10">
              <h2 className="text-white text-xl font-['Comfortaa:Bold',sans-serif] font-bold mb-6">You can still save more*</h2>
              
              <div className="bg-white rounded-[16px] p-6 shadow-lg max-w-md mx-auto">
                <div className="flex flex-col gap-6">
                  {/* Title and Price */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#633479] text-2xl">Premium Plus</p>
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#633479] text-2xl">${membershipPrice}</p>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#4a5565] text-sm">/year</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-gray-500 text-sm line-through">was ${membershipOriginalPrice}/year</p>
                      <div className="bg-green-100 rounded-full px-3 py-1">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#016630] text-xs">Save ${membershipSavings.toFixed(2)} more</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features List */}
                  <div className="flex flex-col gap-3">
                    {membershipFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Icon name="check-green" className="size-4 text-[#00A63E] mt-0.5 shrink-0" />
                        <p className={`font-['Comfortaa:Bold',sans-serif] font-bold text-sm leading-[17.5px] ${
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
                    fullWidth
                    onClick={handleAddMembership}
                  >
                    Add membership
                  </PurpleButton>
                </div>
              </div>

              <p className="text-gray-300 text-sm font-['Comfortaa:Regular',sans-serif] font-normal mt-4 text-center">
                * The payment will be based on your benefit for last appointment.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
          <OrangeButton
            size="standard"
            onClick={handleGoToAccount}
            className="flex items-center gap-2"
          >
            <Icon name="button-arrow" className="size-4 rotate-180" />
            <span>Go to My account</span>
          </OrangeButton>

          <PurpleButton
            variant="primary"
            size="standard"
            onClick={handleBookAnother}
          >
            Book another Appointment
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

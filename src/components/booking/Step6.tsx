import { useState, useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, MembershipCard, type FeatureItem } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { cn } from "@/components/ui/utils";
import { TIME_PERIODS } from "@/constants/calendar";
import { buildImageUrl } from "@/lib/api";

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

// Format coat condition for display
const formatCoatCondition = (condition: string): string => {
  const mapping: Record<string, string> = {
    not_matted: "Not matted",
    matted: "Matted",
    severely_matted: "Severely matted",
  };
  return mapping[condition] || condition;
};

// Format behavior for display
const formatBehavior = (behavior: string): string => {
  const mapping: Record<string, string> = {
    friendly: "Friendly",
    anxious: "Anxious",
    hard_to_handle: "Hard to handle",
    senior_pets: "Senior pets",
  };
  return mapping[behavior] || behavior;
};

export function Step6() {
  const {
    address,
    serviceType,
    city,
    province,
    postCode,
    petName,
    breed,
    weight,
    weightUnit,
    coatCondition,
    behavior,
    referenceStyles,
    photoUrls,
    specialNotes,
    serviceId,
    services,
    addOns: selectedAddOns,
    addOnsList,
    membershipPlans,
    useMembership,
    useMembershipDiscount,
    couponType,
    selectedTimeSlots,
    setCurrentStep,
    setCouponType,
    addresses,
    stores,
    selectedAddressId,
    selectedStoreId,
    setUseMembership,
    setMembershipPlanId,
    userInfo,
  } = useBookingStore();

  const [isTotalExpanded, setIsTotalExpanded] = useState(true);

  // Get selected service
  const selectedService = services.find((s) => s.id === serviceId);

  // Calculate prices
  const packagePrice = selectedService
    ? typeof selectedService.base_price === "string"
      ? parseFloat(selectedService.base_price)
      : selectedService.base_price
    : 0;

  // Calculate add-ons price
  const selectedAddOnsDetails = useMemo(() => {
    return selectedAddOns
      .map((addOnId) => {
        const addOn = addOnsList.find((a) => a.id === addOnId);
        if (addOn) {
          let price = typeof addOn.price === "string" ? parseFloat(addOn.price) : addOn.price;
          // If included_in_membership is true and user has membership, price is 0
          if (addOn.included_in_membership === true && useMembership) {
            price = 0;
          }
          return { ...addOn, price };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedAddOns, addOnsList, useMembership]);

  // Get membership plan
  const membershipPlan = membershipPlans.length > 0 ? membershipPlans[0] : null;
  const membershipPrice = membershipPlan
    ? typeof membershipPlan.fee === "string"
      ? parseFloat(membershipPlan.fee)
      : membershipPlan.fee
    : 99;

  // Format membership plan price for display
  const membershipPriceDisplay = membershipPlan
    ? typeof membershipPlan.fee === "string"
      ? `$ ${membershipPlan.fee}`
      : `$ ${membershipPlan.fee}`
    : "$ 99";

  // Format membership plan badge text
  const membershipBadgeText = membershipPlan
    ? (() => {
        const rate = typeof membershipPlan.discount_rate === "string"
          ? parseFloat(membershipPlan.discount_rate)
          : membershipPlan.discount_rate;
        const discountPercentage = (1 - rate) * 100;
        return `Save up to ${discountPercentage.toFixed(0)}%`;
      })()
    : "Save up to 50%";

  // Convert membership plan benefits to FeatureItem format
  const membershipFeatures: FeatureItem[] = useMemo(() => {
    if (membershipPlan?.benefits) {
      return membershipPlan.benefits
        .sort((a, b) => a.display_order - b.display_order)
        .map((benefit) => ({
          text: benefit.content,
          isHighlight: benefit.is_highlight,
        }));
    }
    // Fallback to default features if no plan loaded
    return [
      { text: "30$ instant cash coupons", isHighlight: true },
      { text: "10% off additional services" },
      { text: "Priority booking within 3 days" },
      { text: "Free teeth brushing" },
      { text: "Free anal gland expression" },
      { text: "Grooming photo updates" },
    ];
  }, [membershipPlan]);

  // Get discount rate
  const discountRate = useMemo(() => {
    if (!membershipPlan || !useMembershipDiscount) {
      return 1;
    }
    const rate = typeof membershipPlan.discount_rate === "string"
      ? parseFloat(membershipPlan.discount_rate)
      : membershipPlan.discount_rate;
    return rate;
  }, [membershipPlan, useMembershipDiscount]);

  // Calculate prices with discount
  const addOnsPrice = selectedAddOnsDetails.reduce((total, addOn) => total + addOn.price, 0);
  const originalTotal = packagePrice + addOnsPrice;
  
  const packagePriceWithDiscount = useMembershipDiscount && discountRate < 1
    ? packagePrice * discountRate
    : packagePrice;
  const addOnsPriceWithDiscount = useMembershipDiscount && discountRate < 1
    ? addOnsPrice * discountRate
    : addOnsPrice;
  const subtotalWithDiscount = packagePriceWithDiscount + addOnsPriceWithDiscount;
  
  // Get cash coupon info
  const cashCouponInfo = useMemo(() => {
    if (!membershipPlan) {
      return { count: 5, amount: 5 };
    }
    const count = membershipPlan.coupon_count || 0;
    const amount = typeof membershipPlan.coupon_amount === "string"
      ? parseFloat(membershipPlan.coupon_amount)
      : membershipPlan.coupon_amount;
    return { count, amount };
  }, [membershipPlan]);

  const cashCouponDiscount = couponType !== null ? cashCouponInfo.amount : 0;
  const serviceTotal = subtotalWithDiscount - cashCouponDiscount;
  const finalTotal = useMembership ? serviceTotal + membershipPrice : serviceTotal;
  const totalPriceWithDiscount = serviceTotal;

  // Calculate savings
  const totalSavings = originalTotal - serviceTotal;
  const savingsPercentage = originalTotal > 0 ? Math.round((totalSavings / originalTotal) * 100) : 0;

  // Check if user is a member or purchasing membership
  const isMemberOrPurchasing = useMembership || userInfo?.is_member === true;

  // Get current address or store for display
  const currentAddress = selectedAddressId
    ? addresses.find((addr) => addr.id === selectedAddressId)
    : null;
  const currentStore = selectedStoreId
    ? stores.find((store) => store.id === selectedStoreId)
    : null;

  // Format address for display (two lines: address and city/province/postcode)
  const addressLine1 = currentAddress?.address || currentStore?.address || address || "";
  const addressLine2 = currentAddress
    ? `${currentAddress.city} ${currentAddress.province} ${currentAddress.postal_code}`.trim()
    : currentStore
    ? `${currentStore.city} ${currentStore.province} ${currentStore.postal_code}`.trim()
    : `${city} ${province} ${postCode}`.trim();

  // Format service type
  const serviceTypeDisplay = serviceType === "mobile" ? "Mobile" : "In Store";

  // Handle modify buttons
  const handleModify = (step: number) => {
    setCurrentStep(step);
  };

  // Handle add membership button
  const handleAddMembership = () => {
    if (membershipPlan) {
      setMembershipPlanId(membershipPlan.id);
    }
    setUseMembership(true);
    // Stay on current page and show membership as selected
  };

  // Handle remove membership button
  const handleRemoveMembership = () => {
    setUseMembership(false);
    setMembershipPlanId(null);
  };

  // Handle proceed to payment
  const handleProceedToPayment = () => {
    // TODO: Implement payment flow
    console.log("Proceed to payment");
  };

  // Handle keep for later
  const handleKeepForLater = () => {
    // TODO: Implement save for later functionality
    console.log("Keep for later");
  };

  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative w-full">
      {/* Address and service type card */}
      <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
          Address and service type
        </p>
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
          {/* Address Section */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative shrink-0 text-[#4a3c2a]">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full whitespace-pre-wrap">
              Address
            </p>
            <div className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full whitespace-pre-wrap">
              <p className="mb-0">{addressLine1 || "Not set"}</p>
              <p>{addressLine2 || ""}</p>
            </div>
          </div>
          {/* Service Type Section */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
              Service type
            </p>
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
              {serviceTypeDisplay}
            </p>
          </div>
        </div>
        {/* Modify Button */}
        <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[28px] items-center justify-center px-[22px] relative rounded-[32px] shrink-0">
          <button
            onClick={() => handleModify(1)}
            className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
          >
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
              Modify
            </p>
          </button>
        </div>
      </div>

      {/* Pet Information card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
            Pet Information
          </p>
          {/* Five fields in a row */}
          <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
                Pet name
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
                {petName || "Not set"}
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
                Breed
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
                {breed || "Not set"}
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
                Weight
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
                {weight ? `${weight} ${weightUnit}` : "Not set"}
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
                Coat condition
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
                {coatCondition ? formatCoatCondition(coatCondition) : "Not set"}
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
                Behavior
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
                {behavior ? formatBehavior(behavior) : "Not set"}
              </p>
            </div>
          </div>
          {/* Pet photos - Only show if photos exist */}
          {photoUrls.length > 0 && (
            <>
              {/* Separator line */}
              <div className="h-0 relative shrink-0 w-full">
                <div className="absolute bottom-0 left-0 right-0 -top-px">
                  <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
                </div>
              </div>
              {/* Pet photos */}
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                Pet photos
              </p>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                {photoUrls.slice(0, 3).map((url, index) => {
                  const fullUrl = buildImageUrl(url);
                  return (
                    <div
                      key={index}
                      className="bg-white h-[120px] overflow-clip relative rounded-[8px] shrink-0 w-[144px]"
                    >
                      <img
                        src={fullUrl}
                        alt={`Pet photo ${index + 1}`}
                        className="size-full object-cover"
                        onError={(e) => {
                          console.error("Failed to load pet photo:", fullUrl);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {/* Reference photos - Only show if photos exist */}
          {referenceStyles.length > 0 && (
            <>
              {/* Separator line */}
              <div className="h-0 relative shrink-0 w-full">
                <div className="absolute bottom-0 left-0 right-0 -top-px">
                  <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
                </div>
              </div>
              {/* Reference photos */}
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                Reference photos
              </p>
              <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                {referenceStyles.slice(0, 3).map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="bg-white h-[120px] overflow-clip relative rounded-[8px] shrink-0 w-[144px]"
                    >
                      <img
                        src={previewUrl}
                        alt={`Reference ${index + 1}`}
                        className="size-full object-cover"
                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {/* Separator line */}
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute bottom-0 left-0 right-0 -top-px">
              <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
            </div>
          </div>
          {/* Special instruments or notes */}
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
              Special instruments or notes
            </p>
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full">
              {specialNotes || "None"}
            </p>
          </div>
          {/* Modify Button */}
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[28px] items-center justify-center px-[22px] relative rounded-[32px] shrink-0">
            <button
              onClick={() => handleModify(2)}
              className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
                Modify
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Package and add-on card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Title */}
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
            Package and add-on
          </p>
          
          {/* Total estimation header */}
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
              Total estimation for the service
            </p>
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-[#de6a07]">
                ${totalPriceWithDiscount.toFixed(2)}
              </p>
              <button
                onClick={() => setIsTotalExpanded(!isTotalExpanded)}
                className="flex items-center justify-center relative shrink-0 size-[20px] cursor-pointer hover:border hover:border-[#8b6357] hover:border-solid transition-colors rounded-[8px]"
              >
                <Icon
                  name="chevron-down"
                  className={cn(
                    "size-[20px] text-[#4a3c2a] transition-transform",
                    isTotalExpanded ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
          </div>

          {/* Expanded content */}
          {isTotalExpanded && (
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              {/* Full rooming package items */}
              {selectedService && (
                <>
                  {selectedService.items && selectedService.items.length > 0 ? (
                    <>
                      {selectedService.items
                        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                        .map((item) => {
                          const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                          const itemPriceWithDiscount = useMembershipDiscount && discountRate < 1
                            ? itemPrice * discountRate
                            : itemPrice;
                          return (
                            <div
                              key={item.id}
                              className="content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full"
                            >
                              <p className="relative shrink-0">
                                {item.name}
                              </p>
                              <p className="relative shrink-0">
                                ${itemPriceWithDiscount.toFixed(2)}
                              </p>
                            </div>
                          );
                        })}
                    </>
                  ) : (
                    <div className="content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                      <p className="relative shrink-0">
                        {selectedService.name}
                      </p>
                      <p className="relative shrink-0">
                        ${packagePriceWithDiscount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </>
              )}
              
                {/* Separator line */}
                <div className="h-0 relative shrink-0 w-full">
                  <div className="absolute bottom-0 left-0 right-0 -top-px">
                    <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
                  </div>
                </div>
              
              {/* Package subtotal */}
              <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                <p className="relative shrink-0">
                  Subtotal
                </p>
                <p className="relative shrink-0">
                  ${packagePriceWithDiscount.toFixed(2)}
                </p>
              </div>
              
              {/* Add-on section */}
              {selectedAddOnsDetails.length > 0 && (
                <>
                  {/* Add-on label */}
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                      Add-on
                    </p>
                  </div>
                  
                  {/* Add-on items */}
                  {selectedAddOnsDetails.map((addOn) => {
                    const originalAddOn = addOnsList.find((a) => a.id === addOn.id);
                    const originalPrice = originalAddOn
                      ? typeof originalAddOn.price === "string"
                        ? parseFloat(originalAddOn.price)
                        : originalAddOn.price
                      : addOn.price;
                    return (
                      <div
                        key={addOn.id}
                        className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full"
                      >
                        <p className="relative shrink-0">
                          {addOn.name}
                        </p>
                        <p className="relative shrink-0">
                          ${originalPrice.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                  
                  {/* Separator line */}
                  <div className="h-0 relative shrink-0 w-full">
                    <div className="absolute bottom-0 left-0 right-0 -top-px">
                      <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
                    </div>
                  </div>
                  
                  {/* Add-on subtotal */}
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                    <p className="relative shrink-0">
                      Subtotal
                    </p>
                    <p className="relative shrink-0">
                      ${addOnsPrice.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Modify Button */}
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[28px] items-center justify-center px-[22px] relative rounded-[32px] shrink-0">
            <button
              onClick={() => handleModify(3)}
              className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
                Modify
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Annual membership card */}
      {useMembership && membershipPlan && (
        <div className="bg-[#6e3d81] content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[74px] left-1/2 top-[43px]" style={{ transform: 'translateX(calc(-50% - 30px))' }} />
          <div className="absolute bg-[rgba(255,255,255,0.35)] opacity-30 rounded-full size-[42px] left-1/2 top-[13px]" style={{ transform: 'translateX(calc(-50% + 30px))' }} />
          
          <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full z-10">
            <div className="content-stretch flex items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <p className="flex-[1_0_0] font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-h-px min-w-px relative shrink-0 text-[16px] text-white whitespace-pre-wrap">
                    Annuel membership
                  </p>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] items-center justify-end min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex items-center justify-end relative shrink-0">
                  <div className="border border-solid border-white content-stretch flex h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[12px] shrink-0">
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[10px] text-white">
                      Selected $ {membershipPrice} / year
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="border-2 border-solid border-white content-stretch flex h-[28px] items-center justify-center px-[22px] relative rounded-[32px] shrink-0">
                <button
                  onClick={handleRemoveMembership}
                  className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-white">
                    Remove
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annual membership promotion card - shown when user hasn't selected membership */}
      {!useMembership && membershipPlan && (
        <div className="bg-[#6e3d81] content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[74px] left-[46px] top-[116px]" />
          <div className="absolute bg-[rgba(255,255,255,0.35)] opacity-30 rounded-full size-[42px] left-[108px] top-[86px]" />
          <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[60px] right-[15px] bottom-[130px]" />
          <div className="absolute bg-[rgba(255,255,255,0.15)] opacity-30 rounded-full size-[118px] right-[143px] bottom-[-10px]" />
          
          {/* Title */}
          <div className="content-stretch flex items-start relative shrink-0 w-full mb-[16px] z-10">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-white whitespace-pre-wrap">
              Annuel membership
            </p>
          </div>
          {/* Membership Card - using wrapped variant with transparent background to show outer background */}
          <div className="w-full flex justify-center relative z-10">
            <MembershipCard
              variant="wrapped"
              title={membershipPlan?.name || "Premium Plus"}
              price={membershipPriceDisplay}
              priceUnit="/year"
              badgeText={membershipBadgeText}
              description={membershipPlan?.description || "Our most popular package for complete pet care"}
              features={membershipFeatures}
              buttonText="Add membership"
              showButton={true}
              onButtonClick={handleAddMembership}
              className="w-[364px]"
              headerTitle={undefined}
              headerSubtitle={undefined}
              backgroundColor="transparent"
            />
          </div>
        </div>
      )}

      {/* Date and time period card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
            Date and time period
          </p>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] w-full">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full whitespace-pre-wrap">
              Date and time selected
            </p>
            {selectedTimeSlots.length > 0 ? (
              <div className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full whitespace-pre-wrap">
                {selectedTimeSlots.map((slot, index) => {
                  const period = TIME_PERIODS.find((p) => p.id === slot.slot);
                  const periodSuffix = period?.label.includes("AM") ? "AM" : "PM";
                  const isLast = index === selectedTimeSlots.length - 1;
                  return (
                    <p key={`${slot.date}-${slot.slot}-${index}`} className={isLast ? "" : "mb-0"}>
                      {formatDateWithWeekday(slot.date)} {periodSuffix}{" "}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[12px] w-full whitespace-pre-wrap">
                No time slots selected
              </p>
            )}
          </div>
          {/* Modify Button */}
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[28px] items-center justify-center px-[22px] relative rounded-[32px] shrink-0">
            <button
              onClick={() => handleModify(5)}
              className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
                Modify
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Total estimation card */}
      <div className="bg-white border-2 border-[#de6a07] border-solid content-stretch flex items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        {/* Left side: Title and subtitle */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative shrink-0">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
            Total estimation for the service
          </p>
          <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px]">
            Our groomer will evaluate the final price
          </p>
        </div>

        {/* Right side: Price and coupon options */}
        <div className="content-stretch flex flex-[1_0_0] items-start gap-[8px] min-h-px min-w-px relative shrink-0">
          {/* Left: All content rows */}
          <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 flex-1">
            {/* First row: Price with original price (no strikethrough for members) */}
            <div className="content-stretch flex items-center relative shrink-0">
              {isMemberOrPurchasing && originalTotal > 0 && (
                <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4A5565] text-[12.25px] mr-[8px]">
                  was ${originalTotal.toFixed(2)}
                </span>
              )}
              {!isMemberOrPurchasing && originalTotal > finalTotal && (
                <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] line-through mr-[8px]">
                  was ${originalTotal.toFixed(2)}
                </span>
              )}
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[24.5px] relative shrink-0 text-[#de6a07] text-[16px]">
                ${finalTotal.toFixed(2)}
              </p>
            </div>
            
            {/* Second row: Save badge + Price breakdown (only for members) */}
            {isMemberOrPurchasing && isTotalExpanded && (
              <div className="content-stretch flex flex-col gap-0 items-end relative shrink-0">
                <div className="content-stretch flex items-center gap-[8px] relative shrink-0">
                  {/* Save percentage badge */}
                  {totalSavings > 0 && (
                    <div className="bg-green-100 content-stretch flex h-[24px] items-center justify-center overflow-clip px-[16px] py-[4px] relative rounded-[12px] shrink-0">
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#016630] text-[10px]">
                        Save {savingsPercentage}%
                      </p>
                    </div>
                  )}
                  {/* Price breakdown */}
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#DE6A07] text-[12.25px]">
                    (${serviceTotal.toFixed(2)}{useMembership && ` + $${membershipPrice}`})
                  </p>
                </div>
                {/* Tax included - no gap between price breakdown and tax included */}
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a5565] text-[10px]">
                  tax included
                </p>
              </div>
            )}
            
            {/* Tax included - for non-members */}
            {!isMemberOrPurchasing && isTotalExpanded && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a5565] text-[10px]">
                tax included
              </p>
            )}
          
            {/* Third row and below: Coupon selection - Vertical layout */}
            {cashCouponInfo.count > 0 && isTotalExpanded && (
              <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full mt-[8px]">
              {/* Cash credit option */}
              <label className="content-stretch flex items-center gap-[8px] relative shrink-0 cursor-pointer">
                {/* Custom radio button */}
                <div className="relative shrink-0 size-[16px]">
                  <input
                    type="radio"
                    name="couponType"
                    value="cash"
                    checked={couponType === "cash"}
                    onChange={() => setCouponType("cash")}
                    className="appearance-none absolute inset-0 size-[16px] rounded-full border border-[#D1D5DB] border-solid cursor-pointer checked:border-[#DE6A07] checked:bg-[#DE6A07] checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:size-[6px] checked:after:bg-white checked:after:rounded-full"
                  />
                </div>
                <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                  Cash credit
                </span>
                <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                  -${cashCouponInfo.amount}
                </span>
              </label>
              
              {/* Invite credit option with expired tag on the left */}
              <div className="content-stretch flex items-center gap-[8px] relative shrink-0">
                {/* Expired tag - shown to the left of Invite credit */}
                <div className="bg-white border border-[#D1D5DB] border-solid content-stretch flex h-[20px] items-center justify-center overflow-clip px-[8px] py-[2px] relative rounded-[10px] shrink-0">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#9CA3AF] text-[10px]">
                    Expired In 1 month
                  </p>
                </div>
                <label className="content-stretch flex items-center gap-[8px] relative shrink-0 cursor-pointer">
                  {/* Custom radio button */}
                  <div className="relative shrink-0 size-[16px]">
                    <input
                      type="radio"
                      name="couponType"
                      value="invite"
                      checked={couponType === "invite"}
                      onChange={() => setCouponType("invite")}
                      className="appearance-none absolute inset-0 size-[16px] rounded-full border border-[#D1D5DB] border-solid cursor-pointer checked:border-[#DE6A07] checked:bg-[#DE6A07] checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:size-[6px] checked:after:bg-white checked:after:rounded-full"
                    />
                  </div>
                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                    Invite credit
                  </span>
                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                    -${cashCouponInfo.amount}
                  </span>
                </label>
              </div>
            </div>
            )}
          </div>
          
          {/* Right: Arrow button */}
          <button
            onClick={() => setIsTotalExpanded(!isTotalExpanded)}
            className="flex items-center justify-center relative shrink-0 size-[20px] cursor-pointer hover:border hover:border-[#8b6357] hover:border-solid transition-colors rounded-[8px] self-start"
          >
            <Icon
              name="chevron-down"
              className={cn(
                "size-[20px] text-[#4a3c2a] transition-transform",
                isTotalExpanded ? "rotate-180" : ""
              )}
            />
          </button>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <OrangeButton size="medium" onClick={handleProceedToPayment}>
          <div className="flex gap-[4px] items-center">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-white">
              Proceed to payment
            </p>
            <Icon
              name="button-arrow"
              aria-label="Arrow"
              className="size-[14px] text-white"
            />
          </div>
        </OrangeButton>
        <OrangeButton size="medium" variant="outline" onClick={handleKeepForLater}>
          Keep for later
        </OrangeButton>
      </div>
    </div>
  );
}

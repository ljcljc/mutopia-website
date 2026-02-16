import { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, TertiaryButton, Checkbox, MembershipCard, type FeatureItem } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { cn } from "@/components/ui/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { getServicePrice } from "@/lib/pricing";
import { useAccountStore } from "@/components/account/accountStore";
import { useAuthStore } from "@/components/auth/authStore";

export function Step4() {
  const {
    serviceId,
    services,
    addOns: selectedAddOns,
    addOnsList,
    membershipPlans,
    isLoadingMembershipPlans,
    loadMembershipPlans,
    useMembershipDiscount,
    useCashCoupon,
    cashCouponCount,
    setUseMembership,
    setMembershipPlanId,
    setUseMembershipDiscount,
    setUseCashCoupon,
    previousStep,
    nextStep,
    weight,
    weightUnit,
  } = useBookingStore();
  const { membershipInfo, fetchMembershipInfo, isLoadingMembershipInfo } = useAccountStore();
  const authUserInfo = useAuthStore((state) => state.userInfo);

  // Check if user is a member
  const isMember = authUserInfo?.is_member === true;
  console.log("[Booking Step4] isMember:", isMember);
  console.log("[Booking Step4] userInfo:", authUserInfo);

  // Load membership plans on mount
  const hasLoadedMembershipPlans = useRef(false);
  useEffect(() => {
    if (!hasLoadedMembershipPlans.current) {
      loadMembershipPlans();
      hasLoadedMembershipPlans.current = true;
    }
  }, [loadMembershipPlans]);

  const hasLoadedMembershipInfo = useRef(false);
  useEffect(() => {
    if (!isMember || hasLoadedMembershipInfo.current || isLoadingMembershipInfo) return;
    if (!membershipInfo) {
      fetchMembershipInfo();
      hasLoadedMembershipInfo.current = true;
    }
  }, [fetchMembershipInfo, isMember, isLoadingMembershipInfo, membershipInfo]);

  // Track whether user has interacted with discount checkboxes to avoid overriding later
  const hasInitializedDiscounts = useRef(false);
  const hasDeclinedMembership = !(useMembershipDiscount && useCashCoupon);

  // Set default checked state for membership discounts
  useEffect(() => {
    if (hasInitializedDiscounts.current) return;
    setUseMembershipDiscount(true);
    setUseCashCoupon(true);
    hasInitializedDiscounts.current = true;
  }, [isMember, setUseMembershipDiscount, setUseCashCoupon]);

  const [isPackageExpanded, setIsPackageExpanded] = useState(false);
  const [isAddOnsExpanded, setIsAddOnsExpanded] = useState(false);

  // Calculate prices
  const selectedService = services.find((s) => s.id === serviceId);
  const packagePrice = getServicePrice(selectedService, weight, weightUnit);

  // Calculate add-ons price and get selected add-ons details
  // In Step4, we assume user will be a member, so if included_in_membership is true, price should be 0
  // However, if user has declined membership, restore original prices for included items
  const selectedAddOnsDetails = useMemo(() => {
    return selectedAddOns
      .map((addOnId) => {
        const addOn = addOnsList.find((a) => a.id === addOnId);
        if (addOn) {
          let price = typeof addOn.price === "string" ? parseFloat(addOn.price) : addOn.price;
          // If user has declined membership, don't apply free pricing for included items
          // Otherwise, assume user will be a member, so if included_in_membership is true, price is 0
          if (addOn.included_in_membership === true && !hasDeclinedMembership) {
            price = 0;
          }
          return { ...addOn, price };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedAddOns, addOnsList, hasDeclinedMembership]);

  // Get the first membership plan (or use default if not loaded)
  const membershipPlan = membershipPlans.length > 0 ? membershipPlans[0] : null;

  // Get discount rate from membership plan
  // discount_rate represents the retention rate (e.g., 0.9 means 90% = 9折)
  const discountRate = useMemo(() => {
    if (!membershipPlan || !useMembershipDiscount) {
      return 1; // No discount, 100% of original price
    }
    const rate = typeof membershipPlan.discount_rate === "string"
      ? parseFloat(membershipPlan.discount_rate)
      : membershipPlan.discount_rate;
    // discount_rate is the retention rate (e.g., 0.9 for 9折, 0.1 for 1折)
    return rate;
  }, [membershipPlan, useMembershipDiscount]);

  // Calculate membership discount percentage for display
  // If discount_rate = 0.9 (9折), display "10% off" (100% - 90% = 10%)
  const membershipDiscountPercentage = useMemo(() => {
    if (!membershipPlan) {
      return "10";
    }
    const rate = typeof membershipPlan.discount_rate === "string"
      ? parseFloat(membershipPlan.discount_rate)
      : membershipPlan.discount_rate;
    // Convert retention rate to discount percentage
    // If rate = 0.9 (9折), discount = (1 - 0.9) * 100 = 10%
    const percentage = (1 - rate) * 100;
    return percentage.toFixed(0);
  }, [membershipPlan]);

  // Get cash coupon info from membership plan
  const cashCouponInfo = useMemo(() => {
    if (!membershipPlan) {
      return { count: cashCouponCount || 5, amount: 5 };
    }
    const count = membershipPlan.coupon_count || 0;
    const amount = typeof membershipPlan.coupon_amount === "string"
      ? parseFloat(membershipPlan.coupon_amount)
      : membershipPlan.coupon_amount;
    return { count, amount };
  }, [membershipPlan, cashCouponCount]);

  const addOnsPrice = selectedAddOnsDetails.reduce((total, addOn) => total + addOn.price, 0);
  const originalTotal = packagePrice + addOnsPrice;

  // Calculate discounts
  // discount_rate is the retention rate, so discount amount = original * (1 - discount_rate)
  const cashCouponDiscount = useCashCoupon ? cashCouponInfo.amount : 0;

  // Calculate final prices with membership discount
  // discount_rate is the retention rate (e.g., 0.9 for 9折)
  const packagePriceWithDiscount = useMembershipDiscount && discountRate < 1
    ? packagePrice * discountRate
    : packagePrice;
  const addOnsPriceWithDiscount = useMembershipDiscount && discountRate < 1
    ? addOnsPrice * discountRate
    : addOnsPrice;
  const subtotalWithDiscount = packagePriceWithDiscount + addOnsPriceWithDiscount;
  const finalTotal = subtotalWithDiscount - cashCouponDiscount;

  const handleMembershipDiscountChange = (checked: boolean) => {
    hasInitializedDiscounts.current = true;
    if (checked) {
      setUseMembershipDiscount(true);
      setUseCashCoupon(true);
    } else {
      setUseMembershipDiscount(false);
      setUseCashCoupon(false);
    }
  };

  const handleCashCouponChange = (checked: boolean) => {
    hasInitializedDiscounts.current = true;
    if (checked) {
      setUseMembershipDiscount(true);
      setUseCashCoupon(true);
    } else {
      setUseMembershipDiscount(false);
      setUseCashCoupon(false);
    }
  };

  // Calculate savings
  const totalSavings = originalTotal - finalTotal;

  const handleContinueWithMembership = () => {
    // If user is already a member or has declined membership, don't add membership purchase
    if (isMember || hasDeclinedMembership) {
      setUseMembership(false);
    } else {
      setUseMembership(true);
      // Set membership plan ID if a plan is available
      if (membershipPlan) {
        setMembershipPlanId(membershipPlan.id);
      }
    }
    nextStep();
  };

  const handleNoThanks = () => {
    hasInitializedDiscounts.current = true;
    setUseMembership(false);
    setUseMembershipDiscount(false);
    setUseCashCoupon(false);
  };

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

  // Format membership plan price
  const membershipPrice = membershipPlan
    ? typeof membershipPlan.fee === "string"
      ? `$ ${membershipPlan.fee}`
      : `$ ${membershipPlan.fee}`
    : "$ 99";

  const membershipBadgeText = "More bookings, more savings";
  const memberName = authUserInfo?.first_name || authUserInfo?.email?.split("@")[0] || "there";
  const membershipHeaderTitle = isMember ? `Welcome back ${memberName}` : "Upgrade to annual membership";
  const membershipHeaderSubtitle = "Enjoy year-round savings on every visit";
  const showMembershipPrice = !isMember;
  const membershipExpiryDate = membershipInfo?.end_at
    ? new Date(membershipInfo.end_at).toISOString().split("T")[0]
    : null;
  const membershipTopLabel = isMember && membershipExpiryDate
    ? `Membership until ${membershipExpiryDate}`
    : "Membership (optional but save more)";
  const isMemberEstimation = useMembershipDiscount && discountRate < 1;
  const estimationLabel = isMemberEstimation ? "Estimation for members" : "Estimation for non member";
  const estimationTextColor = isMemberEstimation ? "text-[#633479]" : "text-[#4A5565]";

  return (
    <div className="content-stretch flex flex-col gap-[calc(16*var(--px393))] sm:gap-[32px] items-start relative w-full px-[calc(20*var(--px393))] sm:px-0">
      {/* Mobile Step Header */}
      <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] items-start relative shrink-0 w-full sm:hidden">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold h-[calc(19*var(--px393))] leading-[calc(17.5*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))] text-black w-full whitespace-pre-wrap">
          Book your appointment
        </p>
        <div className="border border-[#4c4c4c] border-solid content-stretch flex h-[calc(24*var(--px393))] items-center justify-center overflow-clip px-[calc(9*var(--px393))] py-[calc(5*var(--px393))] relative rounded-[calc(12*var(--px393))] shrink-0">
          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] relative shrink-0 text-[#4c4c4c] text-[calc(10*var(--px393))]">
            Step 4 of 6
          </p>
        </div>
        <div className="content-stretch flex gap-[calc(12*var(--px393))] items-center relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))]">
            {membershipTopLabel}
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="content-stretch flex flex-col gap-[calc(16*var(--px393))] items-start relative shrink-0 w-full sm:hidden">
        <div className="bg-[#8760a0] content-stretch flex flex-col items-start p-[calc(24*var(--px393))] relative rounded-[calc(12*var(--px393))] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[calc(14*var(--px393))] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[calc(3.5*var(--px393))] items-center relative shrink-0 w-full">
              <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[calc(24.5*var(--px393))] relative shrink-0 text-[calc(15.75*var(--px393))] text-center text-white w-[calc(265*var(--px393))] whitespace-pre-wrap">
                  {membershipHeaderTitle}
                </p>
              </div>
              <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] relative shrink-0 text-[calc(12.25*var(--px393))] text-white">
                  {membershipHeaderSubtitle}
                </p>
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.96)] content-stretch flex flex-col items-center p-[calc(16*var(--px393))] relative rounded-[calc(16*var(--px393))] shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[calc(24*var(--px393))] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[calc(24*var(--px393))] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px py-[calc(12*var(--px393))] relative">
                      <div className="content-stretch flex flex-col gap-[calc(16*var(--px393))] items-center justify-center relative shrink-0 w-full">
                        <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] items-center justify-center relative shrink-0 w-full">
                          <div className="content-stretch flex gap-[calc(12*var(--px393))] items-start justify-center relative shrink-0 text-[#633479] text-[calc(24*var(--px393))]">
                            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-center">
                              {membershipPlan?.name || "Premium Plus"}
                            </p>
                            {showMembershipPrice && (
                              <div className="content-stretch flex items-center relative shrink-0">
                                <div className="content-stretch flex gap-[calc(4*var(--px393))] items-center relative shrink-0">
                                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-center">
                                    {membershipPrice.replace(/\$?\s*(\d+\.?\d*)/, (_, num) => `$ ${Math.floor(parseFloat(num))}`)}
                                  </p>
                                  <div className="content-stretch flex items-center justify-center relative shrink-0">
                                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] relative shrink-0 text-[#4a5565] text-[calc(14*var(--px393))] text-center">
                                      /year
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="content-stretch flex items-center relative shrink-0">
                            <div className="bg-[#dcfce7] content-stretch flex h-[calc(24*var(--px393))] items-center justify-center overflow-clip px-[calc(16*var(--px393))] py-[calc(4*var(--px393))] relative rounded-[calc(12*var(--px393))] shrink-0">
                              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] relative shrink-0 text-[#016630] text-[calc(10*var(--px393))]">
                                {membershipBadgeText}
                              </p>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(22.75*var(--px393))] relative shrink-0 text-[calc(14*var(--px393))] text-[rgba(74,60,42,0.7)] text-center whitespace-pre-line">
                          {membershipPlan?.description || "Our most popular package for complete pet care"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] items-center relative shrink-0 max-w-[calc(320*var(--px393))]">
                      {membershipFeatures.map((feature, index) => (
                        <div key={`${feature.text}-${index}`} className="content-stretch flex gap-[calc(12*var(--px393))] items-start justify-start relative shrink-0 w-full">
                          <div className="relative shrink-0 size-[calc(16.8*var(--px393))]">
                            <Icon name="check-green" className="block size-full text-[#00A63E]" />
                          </div>
                          <p
                            className={cn(
                              "font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(17.5*var(--px393))] relative shrink-0 text-[calc(12.25*var(--px393))]",
                              feature.isHighlight ? "text-[#de6a07]" : "text-[#364153]"
                            )}
                          >
                            {feature.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white content-stretch flex flex-col items-start justify-between p-[calc(24*var(--px393))] relative rounded-[calc(12*var(--px393))] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[calc(24.5*var(--px393))] items-center min-h-px min-w-px relative">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))]">
                    Service price
                  </p>
                </div>
                {totalSavings > 0 && (
                  <div className="bg-[#dcfce7] content-stretch flex h-[calc(24*var(--px393))] items-center justify-center overflow-clip px-[calc(16*var(--px393))] py-[calc(4*var(--px393))] relative rounded-[calc(12*var(--px393))] shrink-0">
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] relative shrink-0 text-[#016630] text-[calc(10*var(--px393))]">
                      Save $ {totalSavings.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <div className="h-[calc(17.5*var(--px393))] relative shrink-0 w-full">
                <p className={cn(
                  "absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] left-0 text-[calc(12.25*var(--px393))] top-[-0.5px]",
                  estimationTextColor
                )}>
                  {estimationLabel}
                </p>
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
              <div
                className="content-stretch flex items-center justify-between relative shrink-0 w-full cursor-pointer"
                onClick={() => setIsPackageExpanded(!isPackageExpanded)}
              >
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))]">
                  Full rooming package
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[calc(20*var(--px393))]">
                  <div className={cn("flex-none", isPackageExpanded ? "rotate-180" : "")}>
                    <Icon name="chevron-down" size="calc(16*var(--px393))" className="text-[#8b6357]" />
                  </div>
                </div>
              </div>
              {isPackageExpanded && (
                <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
                  <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[calc(4*var(--px393))]" />
                  {selectedService && (
                    <>
                      <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[calc(16*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(12*var(--px393))] w-full">
                        <p className="relative shrink-0">
                          {selectedService.name}
                        </p>
                        <p className="relative shrink-0">
                          {useMembershipDiscount && discountRate < 1 ? (
                            <>
                              <span className="line-through text-[#de6a07]">${packagePrice.toFixed(2)}</span>
                              <span> ${packagePriceWithDiscount.toFixed(2)}</span>
                            </>
                          ) : (
                            `$${packagePrice.toFixed(2)}`
                          )}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[calc(4*var(--px393))]" />
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                    <p className="leading-[calc(16*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))]">
                      Subtotal
                    </p>
                    <p className="leading-[calc(16*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))]">
                      {useMembershipDiscount && discountRate < 1 ? (
                        <>
                          <span className="line-through text-[#de6a07]">${packagePrice.toFixed(2)}</span>
                          <span> ${packagePriceWithDiscount.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${packagePrice.toFixed(2)}`
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
              <div
                className="content-stretch flex items-center justify-between relative shrink-0 w-full cursor-pointer"
                onClick={() => setIsAddOnsExpanded(!isAddOnsExpanded)}
              >
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))]">
                  Add-on
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[calc(20*var(--px393))]">
                  <div className={cn("flex-none", isAddOnsExpanded ? "rotate-180" : "")}>
                    <Icon name="chevron-down" size="calc(16*var(--px393))" className="text-[#8b6357]" />
                  </div>
                </div>
              </div>
              {isAddOnsExpanded && (
                <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
                  <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[calc(4*var(--px393))]" />
                  {selectedAddOnsDetails.length > 0 && (
                    <>
                      {selectedAddOnsDetails.map((addOn) => {
                        const originalAddOn = addOnsList.find((a) => a.id === addOn.id);
                        const originalPrice = originalAddOn
                          ? typeof originalAddOn.price === "string"
                            ? parseFloat(originalAddOn.price)
                            : originalAddOn.price
                          : addOn.price;
                        const isIncludedInMembership = addOn.included_in_membership === true;
                        const displayPrice = addOn.price === 0 && !hasDeclinedMembership
                          ? 0
                          : (useMembershipDiscount && discountRate < 1 ? addOn.price * discountRate : addOn.price);
                        return (
                          <div key={addOn.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[calc(16*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(12*var(--px393))] w-full">
                            <p className="relative shrink-0">
                              {addOn.name}
                            </p>
                            <p className="relative shrink-0">
                              {isIncludedInMembership && !hasDeclinedMembership && addOn.price === 0 ? (
                                <>
                                  <span className="line-through text-[#de6a07]">${originalPrice.toFixed(2)}</span>
                                  <span> $0.00</span>
                                </>
                              ) : useMembershipDiscount && discountRate < 1 && !hasDeclinedMembership ? (
                                <>
                                  <span className="line-through text-[#de6a07]">${originalPrice.toFixed(2)}</span>
                                  <span> ${displayPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                `$${displayPrice.toFixed(2)}`
                              )}
                            </p>
                          </div>
                        );
                      })}
                      <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[calc(4*var(--px393))]" />
                    </>
                  )}
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                    <p className="leading-[calc(16*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))]">
                      Subtotal
                    </p>
                    <p className="leading-[calc(16*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))]">
                      {useMembershipDiscount && discountRate < 1 ? (
                        <>
                          <span className="line-through text-[#de6a07]">${addOnsPrice.toFixed(2)}</span>
                          <span> ${addOnsPriceWithDiscount.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${addOnsPrice.toFixed(2)}`
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[calc(4*var(--px393))] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))]">
                  Membership discount
                </p>
              </div>
              <div className="content-stretch flex gap-[calc(12*var(--px393))] items-start relative shrink-0 w-full">
                <Checkbox
                  checked={useMembershipDiscount}
                  onCheckedChange={handleMembershipDiscountChange}
                  label={`Membership ${membershipDiscountPercentage}% off *`}
                  containerClassName="relative shrink-0"
                />
              </div>
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                <Checkbox
                  checked={useCashCoupon}
                  onCheckedChange={handleCashCouponChange}
                  label={`Cash coupon (${cashCouponInfo.count}x$${cashCouponInfo.amount} left)`}
                  containerClassName="relative shrink-0"
                />
                {useCashCoupon && (
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(12*var(--px393))]">
                    -${cashCouponInfo.amount.toFixed(0)}
                  </p>
                )}
              </div>
              <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[calc(4*var(--px393))]" />
            </div>
            <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] items-start relative shrink-0 w-full">
              <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] text-[calc(12*var(--px393))] w-full">
                <p className="leading-[calc(16*var(--px393))] relative shrink-0">
                  Total for this servie
                </p>
                <p className="leading-[0] relative shrink-0 text-[0px]">
                  {(useMembershipDiscount && discountRate < 1) || useCashCoupon ? (
                    <>
                      <span className="[text-decoration-skip-ink:none] decoration-solid leading-[calc(16*var(--px393))] line-through text-[#de6a07]">${originalTotal.toFixed(2)}</span>
                      <span className="leading-[calc(16*var(--px393))]"> {`$${finalTotal.toFixed(2)}`}</span>
                    </>
                  ) : (
                    <span className="leading-[calc(16*var(--px393))]">{`$${originalTotal.toFixed(2)}`}</span>
                  )}
                </p>
              </div>
              <div className="content-stretch flex gap-[calc(4*var(--px393))] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))]">
                  If selected, {membershipPrice} Membership fee will be added later.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-stretch flex flex-col gap-[calc(20*var(--px393))] items-start justify-center relative shrink-0 w-full">
          <OrangeButton
            size="medium"
            variant="primary"
            showArrow={true}
            fullWidth
            textSize={14}
            onClick={handleContinueWithMembership}
          >
            {isMember ? "Continue" : (hasDeclinedMembership ? "Continue without membership" : "Continue with membership")}
          </OrangeButton>
          <OrangeButton
            size="medium"
            variant="outline"
            fullWidth
            textSize={14}
            onClick={previousStep}
          >
            Back
          </OrangeButton>
          {!isMember && !hasDeclinedMembership && (
            <TertiaryButton
              variant="orange"
              onClick={handleNoThanks}
              className="h-[36px] rounded-[12px] w-full"
              fontSize={12}
              borderWidth={1}
            >
              No, continue at regular price
            </TertiaryButton>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex content-stretch flex-col gap-[32px] items-start relative w-full">
        {/* Main Content */}
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full">
        {/* Left: VIP Membership Card */}
        {isLoadingMembershipPlans ? (
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[440px]">
            <div className="bg-[#8760a0] content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-full">
                {/* Header Title and Subtitle Skeleton */}
                <div className="content-stretch flex flex-col gap-[3.5px] h-[45.5px] items-center relative shrink-0 w-full">
                  <Skeleton className="h-[24.5px] w-[280px] bg-white/20" />
                  <Skeleton className="h-[17.5px] w-[240px] bg-white/20" />
                </div>
                {/* Card Content Skeleton */}
                <div className="bg-[rgba(255,255,255,0.96)] content-stretch flex flex-col items-center p-[32px] relative rounded-[16px] shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                      {/* Title and Price Skeleton */}
                      <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                        <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-0 py-[16px] relative shrink-0 max-w-full">
                          <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">
                            <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full">
                              <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0">
                                <Skeleton className="h-[24px] w-[120px] bg-[#633479]/20" />
                                <Skeleton className="h-[24px] w-[60px] bg-[#633479]/20" />
                              </div>
                              <Skeleton className="h-[24px] w-[140px] bg-green-100/50" />
                            </div>
                            <Skeleton className="h-[44px] w-[280px] bg-[rgba(74,60,42,0.1)]" />
                          </div>
                        </div>
                      </div>
                      {/* Features List Skeleton */}
                      <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
                        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="content-stretch flex items-start relative shrink-0">
                              <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                                <Skeleton className="size-[16.8px] rounded bg-[#00A63E]/20" />
                                <Skeleton className="h-[17.5px] w-[180px] bg-[#364153]/20" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MembershipCard
            variant="wrapped"
            title={membershipPlan?.name || "Premium Plus"}
            price={membershipPrice.replace(/\$?\s*(\d+\.?\d*)/, (_, num) => `$ ${Math.floor(parseFloat(num))}`)}
            priceUnit="/year"
            hidePrice={!showMembershipPrice}
            badgeText={membershipBadgeText}
            description={membershipPlan?.description || "Our most popular package for complete pet care"}
            features={membershipFeatures}
            headerTitle={membershipHeaderTitle}
            headerSubtitle={membershipHeaderSubtitle}
            showButton={false}
            className="w-[440px]"
          />
        )}

        {/* Right: Service Price Summary */}
        <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px p-[24px] relative rounded-[12px] self-stretch shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0">
          <div className="content-stretch flex flex-col justify-between items-start relative shrink-0 w-full h-full">
            {/* Top Section: Title, Package, Add-on */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-[1_0_0] h-[24.5px] items-center min-h-px min-w-px relative shrink-0">
                      <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                        Service price
                      </p>
                    </div>
                    {totalSavings > 0 && (
                      <div className="bg-green-100 content-stretch flex h-[24px] items-center justify-center overflow-clip px-[16px] py-[4px] relative rounded-[12px] shrink-0">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#016630] text-[10px]">
                          Save $ {totalSavings.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="h-[17.5px] relative shrink-0 w-full">
                    <p className={cn(
                      "absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[12.25px] top-[-0.5px]",
                      estimationTextColor
                    )}>
                      {estimationLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Full rooming package - Collapsible */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div
                className="content-stretch flex items-center justify-between relative shrink-0 w-full cursor-pointer"
                onClick={() => setIsPackageExpanded(!isPackageExpanded)}
              >
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                  Full rooming package
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[calc(20*var(--px393))]">
                  <div className={cn("flex-none", isPackageExpanded ? "rotate-180" : "")}>
                    <div className={cn(
                      "content-stretch flex items-center justify-center relative rounded-[calc(8*var(--px393))] size-[calc(20*var(--px393))]",
                      "hover:border hover:border-[#8b6357] hover:border-solid transition-colors"
                    )}>
                      <Icon name="chevron-down" size={16} className="text-[#8b6357]" />
                    </div>
                  </div>
                </div>
              </div>
              {isPackageExpanded && (
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                  {selectedService && (
                    <>
                      {/* Service package name */}
                      <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                        <p className="relative shrink-0">
                          {selectedService.name}
                        </p>
                        <p className="relative shrink-0">
                          {useMembershipDiscount && discountRate < 1 ? (
                            <>
                              <span className="line-through text-[#de6a07]">${packagePrice.toFixed(2)}</span>
                              <span> ${packagePriceWithDiscount.toFixed(2)}</span>
                            </>
                          ) : (
                            `$${packagePrice.toFixed(2)}`
                          )}
                        </p>
                      </div>
                      {/* Service items list */}
                      {selectedService.items && selectedService.items.length > 0 && (
                        <>
                          {selectedService.items
                            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                            .map((item) => {
                              const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                              const itemPriceWithDiscount = useMembershipDiscount && discountRate < 1 ? itemPrice * discountRate : itemPrice;
                              return (
                                <div key={item.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                                  <p className="relative shrink-0">
                                    {item.name}
                                  </p>
                                  <p className="relative shrink-0">
                                    {useMembershipDiscount ? (
                                      <>
                                        <span className="line-through text-[#de6a07]">${itemPrice.toFixed(2)}</span>
                                        <span> ${itemPriceWithDiscount.toFixed(2)}</span>
                                      </>
                                    ) : (
                                      `$${itemPrice.toFixed(2)}`
                                    )}
                                  </p>
                                </div>
                              );
                            })}
                        </>
                      )}
                      {/* Separator line */}
                      <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                    </>
                  )}
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      Subtotal
                    </p>
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      {useMembershipDiscount && discountRate < 1 ? (
                        <>
                          <span className="line-through text-[#de6a07]">${packagePrice.toFixed(2)}</span>
                          <span> ${packagePriceWithDiscount.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${packagePrice.toFixed(2)}`
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Add-on - Collapsible */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div
                className="content-stretch flex items-center justify-between relative shrink-0 w-full cursor-pointer"
                onClick={() => setIsAddOnsExpanded(!isAddOnsExpanded)}
              >
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                  Add-on
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[calc(20*var(--px393))]">
                  <div className={cn("flex-none", isAddOnsExpanded ? "rotate-180" : "")}>
                    <div className={cn(
                      "content-stretch flex items-center justify-center relative rounded-[calc(8*var(--px393))] size-[calc(20*var(--px393))]",
                      "hover:border hover:border-[#8b6357] hover:border-solid transition-colors"
                    )}>
                      <Icon name="chevron-down" size={16} className="text-[#8b6357]" />
                    </div>
                  </div>
                </div>
              </div>
              {isAddOnsExpanded && (
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                  {/* Add-ons list */}
                  {selectedAddOnsDetails.length > 0 && (
                    <>
                      {selectedAddOnsDetails.map((addOn) => {
                        // Get original price from addOnsList for display
                        const originalAddOn = addOnsList.find((a) => a.id === addOn.id);
                        const originalPrice = originalAddOn
                          ? typeof originalAddOn.price === "string"
                            ? parseFloat(originalAddOn.price)
                            : originalAddOn.price
                          : addOn.price;
                        // Check if this add-on is included in membership
                        const isIncludedInMembership = addOn.included_in_membership === true;
                        // If user has declined membership, show original price (no free benefit)
                        // Otherwise, if included in membership and price is 0, show as free
                        // Apply discount if membership discount is enabled
                        const displayPrice = addOn.price === 0 && !hasDeclinedMembership
                          ? 0 
                          : (useMembershipDiscount && discountRate < 1 ? addOn.price * discountRate : addOn.price);
                        return (
                          <div key={addOn.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                            <p className="relative shrink-0">
                              {addOn.name}
                            </p>
                            <p className="relative shrink-0">
                              {isIncludedInMembership && !hasDeclinedMembership && addOn.price === 0 ? (
                                // If included in membership and user hasn't declined, show original price (strikethrough) and $0.00
                                <>
                                  <span className="line-through text-[#de6a07]">${originalPrice.toFixed(2)}</span>
                                  <span> $0.00</span>
                                </>
                              ) : useMembershipDiscount && discountRate < 1 && !hasDeclinedMembership ? (
                                // If membership discount is enabled and user hasn't declined, show discount price
                                <>
                                  <span className="line-through text-[#de6a07]">${originalPrice.toFixed(2)}</span>
                                  <span> ${displayPrice.toFixed(2)}</span>
                                </>
                              ) : (
                                // Otherwise show original price (no discount)
                                `$${displayPrice.toFixed(2)}`
                              )}
                            </p>
                          </div>
                        );
                      })}
                      {/* Separator line */}
                      <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                    </>
                  )}
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      Subtotal
                    </p>
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      {useMembershipDiscount && discountRate < 1 ? (
                        <>
                          <span className="line-through text-[#de6a07]">${addOnsPrice.toFixed(2)}</span>
                          <span> ${addOnsPriceWithDiscount.toFixed(2)}</span>
                        </>
                      ) : (
                        `$${addOnsPrice.toFixed(2)}`
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Bottom Section: Membership discount */}
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                    Membership discount
                  </p>
                </div>
                <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                  <Checkbox
                    checked={useMembershipDiscount}
                    onCheckedChange={handleMembershipDiscountChange}
                    label={`Membership ${membershipDiscountPercentage}% off *`}
                    containerClassName="relative shrink-0"
                  />
                </div>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                  <Checkbox
                    checked={useCashCoupon}
                    onCheckedChange={handleCashCouponChange}
                    label={`Cash coupon (${cashCouponInfo.count}x$${cashCouponInfo.amount} left)`}
                    containerClassName="relative shrink-0"
                  />
                  {useCashCoupon && (
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                      -${cashCouponInfo.amount.toFixed(0)}
                    </p>
                  )}
                </div>
                <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                  <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                    Total for this service
                  </p>
                  <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                    {(useMembershipDiscount && discountRate < 1) || useCashCoupon ? (
                      <>
                        <span className="line-through text-[#de6a07]">${originalTotal.toFixed(2)}</span>
                        <span> ${finalTotal.toFixed(2)}</span>
                      </>
                    ) : (
                      `$${originalTotal.toFixed(2)}`
                    )}
                  </p>
                </div>
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[#4a3c2a] text-[10px]">
                    If selected, {membershipPrice} Membership fee will be added later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
        <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
          <OrangeButton
            size="medium"
            variant="primary"
            showArrow={true}
            textSize={14}
            onClick={handleContinueWithMembership}
          >
            {isMember ? "Continue" : (hasDeclinedMembership ? "Continue without membership" : "Continue with membership")}
          </OrangeButton>
          <OrangeButton
            size="medium"
            variant="outline"
            textSize={14}
            onClick={previousStep}
          >
            Back
          </OrangeButton>
        </div>
        {!isMember && !hasDeclinedMembership && (
          <TertiaryButton
            variant="orange"
            onClick={handleNoThanks}
            className="h-[36px] rounded-[12px]"
            fontSize={12}
            borderWidth={1}
          >
            No, continue at regular price
          </TertiaryButton>
        )}
      </div>
      </div>
    </div>
  );
}

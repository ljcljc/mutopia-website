import { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, Checkbox, MembershipCard, type FeatureItem } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { cn } from "@/components/ui/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Step4() {
  const {
    serviceId,
    services,
    addOns: selectedAddOns,
    addOnsList,
    membershipPlans,
    isLoadingMembershipPlans,
    loadMembershipPlans,
    useMembership,
    useMembershipDiscount,
    useCashCoupon,
    cashCouponCount,
    setUseMembership,
    setUseMembershipDiscount,
    setUseCashCoupon,
    previousStep,
    nextStep,
  } = useBookingStore();

  // Load membership plans on mount
  const hasLoadedMembershipPlans = useRef(false);
  useEffect(() => {
    if (!hasLoadedMembershipPlans.current) {
      loadMembershipPlans();
      hasLoadedMembershipPlans.current = true;
    }
  }, [loadMembershipPlans]);

  const [isPackageExpanded, setIsPackageExpanded] = useState(false);
  const [isAddOnsExpanded, setIsAddOnsExpanded] = useState(false);

  // Calculate prices
  const selectedService = services.find((s) => s.id === serviceId);
  const packagePrice = selectedService
    ? typeof selectedService.base_price === "string"
      ? parseFloat(selectedService.base_price)
      : selectedService.base_price
    : 0;

  // Calculate add-ons price and get selected add-ons details
  const selectedAddOnsDetails = useMemo(() => {
    return selectedAddOns
      .map((addOnId) => {
        const addOn = addOnsList.find((a) => a.id === Number(addOnId));
        if (addOn) {
          const price = typeof addOn.price === "string" ? parseFloat(addOn.price) : addOn.price;
          return { ...addOn, price };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedAddOns, addOnsList]);

  const addOnsPrice = selectedAddOnsDetails.reduce((total, addOn) => total + addOn.price, 0);
  const originalTotal = packagePrice + addOnsPrice;

  // Calculate discounts
  const membershipDiscount = useMembershipDiscount ? originalTotal * 0.1 : 0;
  const cashCouponDiscount = useCashCoupon ? 5 : 0; // $5 per coupon
  const totalDiscount = membershipDiscount + cashCouponDiscount;

  // Calculate final prices with membership discount
  const packagePriceWithDiscount = useMembershipDiscount
    ? packagePrice * 0.9
    : packagePrice;
  const addOnsPriceWithDiscount = useMembershipDiscount
    ? addOnsPrice * 0.9
    : addOnsPrice;
  const subtotalWithDiscount = packagePriceWithDiscount + addOnsPriceWithDiscount;
  const finalTotal = subtotalWithDiscount - cashCouponDiscount;

  // Calculate savings
  const totalSavings = originalTotal - finalTotal;

  const handleContinueWithMembership = () => {
    setUseMembership(true);
    nextStep();
  };

  const handleNoThanks = () => {
    setUseMembership(false);
    setUseMembershipDiscount(false);
    setUseCashCoupon(false);
    nextStep();
  };

  // Get the first membership plan (or use default if not loaded)
  const membershipPlan = membershipPlans.length > 0 ? membershipPlans[0] : null;

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

  // Format membership plan badge text
  const membershipBadgeText = membershipPlan
    ? `Save up to ${typeof membershipPlan.discount_rate === "string" ? membershipPlan.discount_rate : (Number(membershipPlan.discount_rate) * 100).toFixed(0)}%`
    : "Save up to 50%";

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative w-full">
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
            price={membershipPrice}
            priceUnit="/year"
            badgeText={membershipBadgeText}
            description={membershipPlan?.description || "Our most popular package for complete pet care"}
            features={membershipFeatures}
            headerTitle="Upgrade to annual membership to save more"
            headerSubtitle="Enjoy year-round savings on every visit"
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
                    <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#633479] text-[12.25px] top-[-0.5px]">
                      Estimation for members
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
                <div className="flex items-center justify-center relative shrink-0 size-[20px]">
                  <div className={cn("flex-none", isPackageExpanded ? "rotate-180" : "")}>
                    <div className={cn(
                      "content-stretch flex items-center justify-center relative rounded-[8px] size-[20px]",
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
                          {useMembershipDiscount ? (
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
                              const itemPriceWithDiscount = useMembershipDiscount ? itemPrice * 0.9 : itemPrice;
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
                      {useMembershipDiscount ? (
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
                <div className="flex items-center justify-center relative shrink-0 size-[20px]">
                  <div className={cn("flex-none", isAddOnsExpanded ? "rotate-180" : "")}>
                    <div className={cn(
                      "content-stretch flex items-center justify-center relative rounded-[8px] size-[20px]",
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
                      {selectedAddOnsDetails.map((addOn) => (
                        <div key={addOn.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                          <p className="relative shrink-0">
                            {addOn.name}
                          </p>
                          <p className="relative shrink-0">
                            {useMembershipDiscount ? (
                              <>
                                <span className="line-through text-[#de6a07]">${addOn.price.toFixed(2)}</span>
                                <span> ${(addOn.price * 0.9).toFixed(2)}</span>
                              </>
                            ) : (
                              `$${addOn.price.toFixed(2)}`
                            )}
                          </p>
                        </div>
                      ))}
                      {/* Separator line */}
                      <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                    </>
                  )}
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between relative shrink-0 text-[#4a3c2a] w-full">
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      Subtotal
                    </p>
                    <p className="leading-[22.75px] relative shrink-0 text-[12px]">
                      {useMembershipDiscount ? (
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
                    onCheckedChange={setUseMembershipDiscount}
                    label="Membership 10% off *"
                    containerClassName="relative shrink-0"
                  />
                </div>
                <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                  <Checkbox
                    checked={useCashCoupon}
                    onCheckedChange={setUseCashCoupon}
                    label={`Cash coupon (${cashCouponCount}x$5 left)`}
                    containerClassName="relative shrink-0"
                  />
                  {useCashCoupon && (
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                      -$5
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
                    {useMembershipDiscount || useCashCoupon ? (
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
                    If selected, $99 Membership fee will be added later.
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
            onClick={handleContinueWithMembership}
          >
            Continue with membership
          </OrangeButton>
          <OrangeButton
            size="medium"
            variant="outline"
            onClick={previousStep}
          >
            Back
          </OrangeButton>
        </div>
        <OrangeButton
          size="medium"
          variant="outline"
          onClick={handleNoThanks}
        >
          No, thanks
        </OrangeButton>
      </div>
    </div>
  );
}

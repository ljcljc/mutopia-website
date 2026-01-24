import { useState, useMemo, useEffect, useRef } from "react";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, MembershipCard, Checkbox, type FeatureItem } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { useAuthStore } from "@/components/auth/authStore";
import { cn } from "@/components/ui/utils";
import { TIME_PERIODS } from "@/constants/calendar";
import { buildImageUrl, submitBooking, createDepositSession, type CouponOut } from "@/lib/api";
import { toast } from "sonner";
import { getServicePrice } from "@/lib/pricing";

// Radio button component matching CustomRadio.tsx
function RadioButton({ isChecked, className }: { isChecked: boolean; className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[16px] mt-[2.5px]", className)}>
      <div className="size-[16px] rounded-full border border-solid transition-colors border-[#717182] bg-white">
        {isChecked && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[8px] rounded-full bg-[#de6a07]" />
        )}
      </div>
    </div>
  );
}

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

// Format coupon expiration date - only show if expires within 1 month
const formatCouponExpiration = (expiresAt: string | null | undefined): string | null => {
  if (!expiresAt) return null;
  try {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Only show expiration if within 1 month (30 days)
    if (diffDays < 0) return null; // Don't show expired
    if (diffDays > 30) return null; // Don't show if more than 30 days
    
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires in 1 day";
    if (diffDays < 7) return `Expires in ${diffDays} days`;
    if (diffDays < 14) return "Expires in 1 week";
    if (diffDays < 21) return "Expires in 2 weeks";
    return "Expires in 1 month";
  } catch {
    return null;
  }
};

// Determine coupon type: general (通用券) or special (特殊节日券)
const getCouponType = (coupon: CouponOut): "general" | "special" => {
  // 通用券：邀请券(invite)、会员券(cash/membership)、邀请礼物券(invitee_gift)、会员礼物券(membership_gift)
  if (
    coupon.category === "invite" || 
    coupon.category === "cash" || 
    coupon.type === "invite" || 
    coupon.type === "membership" ||
    coupon.type === "invitee_gift" ||
    coupon.type === "membership_gift" || // membership_gift should be classified as general coupon
    coupon.category === "invitee_gift"
  ) {
    return "general";
  }
  // 特殊节日券：生日(birthday)和特殊节日(gift/custom)
  // Note: gift category with membership_gift type is already handled above as general
  return "special";
};

// Format coupon category for display
const formatCouponCategory = (category: string, type?: string): string => {
  const mapping: Record<string, string> = {
    cash: "Cash credit",
    gift: "Special gift",
    birthday: "Birthday",
    invite: "Invite credit",
    custom: "Custom coupon",
    invitee_gift: "Cash credit", // invitee_gift should display as Cash credit
  };
  // Check type first, then category
  if (type && mapping[type]) {
    return mapping[type];
  }
  return mapping[category] || category;
};

// Get coupon display name (for special holiday coupons)
const getCouponDisplayName = (coupon: CouponOut): string => {
  if (coupon.category === "birthday" && coupon.type === "cash") {
    return "Birthday";
  }
  if (coupon.category === "gift" || coupon.category === "custom") {
    // For special gift coupons, show a more descriptive name
    // Try notes first, then template name, then type, then category
    if (coupon.notes && coupon.notes.trim()) {
      return coupon.notes;
    }
    // If there's a template_id, we could show template name, but for now use type
    if (coupon.type && coupon.type !== "gift" && coupon.type !== "custom") {
      return coupon.type;
    }
    // Fallback to category formatted name
    return formatCouponCategory(coupon.category, coupon.type);
  }
  return formatCouponCategory(coupon.category, coupon.type);
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
    coupons,
    selectedCouponIds,
    selectedTimeSlots,
    setCurrentStep,
    loadCoupons,
    isLoadingCoupons,
    addresses,
    stores,
    selectedAddressId,
    selectedStoreId,
    setUseMembership,
    setMembershipPlanId,
    userInfo,
    getBookingSubmitPayload,
  } = useBookingStore();

  const [isTotalExpanded, setIsTotalExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is logged in
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = userInfo !== null || user !== null;
  
  // Load coupons when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      console.log("Loading coupons for user...");
      loadCoupons().catch((error) => {
        console.error("Failed to load coupons:", error);
      });
    }
  }, [isLoggedIn, loadCoupons]);

  // Get selected service
  const selectedService = services.find((s) => s.id === serviceId);

  // Calculate prices
  const packagePrice = getServicePrice(selectedService, weight, weightUnit);

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
  
  // Generate virtual Cash credit coupons if user is purchasing membership
  // This applies both when:
  // 1. User is not a member and selects membership
  // 2. User is already a member and selects membership again (renewal)
  const membershipCashCoupons = useMemo(() => {
    if (!useMembership || !membershipPlan) {
      return [];
    }
    const count = membershipPlan.coupon_count || 5;
    const amount = typeof membershipPlan.coupon_amount === "string"
      ? parseFloat(membershipPlan.coupon_amount)
      : membershipPlan.coupon_amount;
    
    // Create virtual coupons with negative IDs to distinguish from real coupons
    const virtualCoupons = Array.from({ length: count }, (_, index) => ({
      id: -(index + 1), // Use negative IDs for virtual coupons
      template_id: 0,
      type: "cash",
      category: "cash",
      apply_scope: "all",
      amount: amount,
      valid_from: null,
      expires_at: null, // Will be set after membership purchase
      status: "pending" as const, // Virtual coupons are pending until membership is purchased
      notes: "Will be available after membership purchase",
    }));
    
    console.log('[Virtual coupons generation]', {
      useMembership,
      isMember: userInfo?.is_member,
      membershipPlanExists: !!membershipPlan,
      virtualCouponsCount: virtualCoupons.length,
      count,
      amount,
    });
    
    return virtualCoupons;
  }, [useMembership, membershipPlan, userInfo?.is_member]);

  // Combine real coupons and virtual membership coupons (avoid duplicates)
  const allCoupons = useMemo(() => {
    // Use a Map to avoid duplicates by ID
    const couponMap = new Map<number, typeof coupons[0]>();
    
    // Add real coupons
    if (Array.isArray(coupons)) {
      coupons.forEach((coupon) => {
        couponMap.set(coupon.id, coupon);
      });
    }
    
    // Add virtual membership coupons (they have negative IDs, so won't conflict)
    membershipCashCoupons.forEach((coupon) => {
      couponMap.set(coupon.id, coupon);
    });
    
    const result = Array.from(couponMap.values());
    console.log('[allCoupons]', {
      realCouponsCount: Array.isArray(coupons) ? coupons.length : 0,
      virtualCouponsCount: membershipCashCoupons.length,
      totalCount: result.length,
      useMembership,
      realCoupons: Array.isArray(coupons) ? coupons.map(c => ({ id: c.id, type: c.type, category: c.category })) : [],
      virtualCoupons: membershipCashCoupons.map(c => ({ id: c.id, type: c.type, category: c.category })),
    });
    return result;
  }, [coupons, membershipCashCoupons, useMembership]);

  // Group coupons by type: general (通用券) and special (特殊节日券)
  const couponGroups = useMemo(() => {
    const generalCoupons: typeof allCoupons = [];
    const specialCoupons: typeof allCoupons = [];
    const seenIds = new Set<number>();
    
    allCoupons
      .filter((coupon) => {
        // Avoid duplicates
        if (seenIds.has(coupon.id)) {
          return false;
        }
        seenIds.add(coupon.id);
        
        // Only include active coupons for real coupons
        // Virtual coupons (id < 0) have status "pending" and should be included
        if (coupon.id < 0) {
          // Virtual coupons are always pending, include them
          return coupon.status === "pending";
        }
        // Real coupons must be active
        return coupon.status === "active";
      })
      .forEach((coupon) => {
        const couponType = getCouponType(coupon);
        console.log('[Coupon classification]', {
          couponId: coupon.id,
          category: coupon.category,
          type: coupon.type,
          status: coupon.status,
          classifiedAs: couponType,
        });
        if (couponType === "general") {
          generalCoupons.push(coupon);
        } else {
          specialCoupons.push(coupon);
        }
      });
    
    // Sort general coupons by expiration date (closest to expire first)
    generalCoupons.sort((a, b) => {
      if (!a.expires_at && !b.expires_at) return 0;
      if (!a.expires_at) return 1;
      if (!b.expires_at) return -1;
      return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
    });
    
    // Group general coupons by category (cash/invite)
    // Only include active real coupons and virtual membership coupons (if membership is selected)
    const generalGroups: Record<string, typeof allCoupons> = {};
    const groupSeenIds = new Set<number>();
    
    // Process real coupons (active, positive IDs)
    generalCoupons
      .filter((coupon) => coupon.id > 0 && coupon.status === "active")
      .forEach((coupon) => {
        // Skip if already added to any group
        if (groupSeenIds.has(coupon.id)) {
          console.warn(`[Duplicate coupon detected] Skipping duplicate real coupon:`, coupon.id);
          return;
        }
        groupSeenIds.add(coupon.id);
        
        const category = (
          coupon.category === "cash" || 
          coupon.type === "cash" || 
          coupon.type === "membership" ||
          coupon.type === "membership_gift" || // membership_gift should be classified as cash category
          coupon.type === "invitee_gift" ||
          coupon.category === "invitee_gift"
        ) ? "cash" : "invite";
        
        if (!generalGroups[category]) {
          generalGroups[category] = [];
        }
        generalGroups[category].push(coupon);
      });
    
    // Process virtual membership coupons (if membership is selected)
    if (useMembership) {
      generalCoupons
        .filter((coupon) => coupon.id < 0 && coupon.status === "pending")
        .forEach((coupon) => {
          // Skip if already added to any group
          if (groupSeenIds.has(coupon.id)) {
            console.warn(`[Duplicate coupon detected] Skipping duplicate virtual coupon:`, coupon.id);
            return;
          }
          groupSeenIds.add(coupon.id);
          
          const category = "cash"; // Virtual membership coupons are always cash
          if (!generalGroups[category]) {
            generalGroups[category] = [];
          }
          generalGroups[category].push(coupon);
        });
    }
    
    // Final deduplication: remove any duplicates that might have slipped through
    Object.keys(generalGroups).forEach((category) => {
      const seen = new Set<number>();
      generalGroups[category] = generalGroups[category].filter((coupon) => {
        if (seen.has(coupon.id)) {
          console.warn(`[Final deduplication] Removing duplicate in ${category} group:`, coupon.id);
          return false;
        }
        seen.add(coupon.id);
        return true;
      });
    });
    
    // Group special coupons by category for radio button groups
    const specialGroups: Record<string, typeof allCoupons> = {};
    specialCoupons.forEach((coupon) => {
      // Birthday coupons go to "birthday" group
      // Other special coupons (gift/custom) go to "special_gift" group
      // But if it's a birthday type coupon, it should go to birthday group
      let groupKey: string;
      if (coupon.category === "birthday" || coupon.type === "birthday") {
        groupKey = "birthday";
      } else {
        groupKey = "special_gift";
      }
      if (!specialGroups[groupKey]) {
        specialGroups[groupKey] = [];
      }
      specialGroups[groupKey].push(coupon);
    });
    
    // Sort special coupons within each group:
    // 1. Expiring soon first (if expires_at exists and is within valid range)
    // 2. Then by valid_from (earliest activation time first)
    Object.keys(specialGroups).forEach((groupKey) => {
      specialGroups[groupKey].sort((a, b) => {
        const now = new Date();
        const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        // Check if coupon expires within one month
        const aExpiresSoon = a.expires_at && new Date(a.expires_at) <= oneMonthFromNow && new Date(a.expires_at) > now;
        const bExpiresSoon = b.expires_at && new Date(b.expires_at) <= oneMonthFromNow && new Date(b.expires_at) > now;
        
        // Priority 1: Expiring soon first
        if (aExpiresSoon && !bExpiresSoon) return -1;
        if (!aExpiresSoon && bExpiresSoon) return 1;
        
        // Priority 2: If both expire soon or both don't, sort by expiration date (soonest first)
        if (aExpiresSoon && bExpiresSoon) {
          if (!a.expires_at && !b.expires_at) return 0;
          if (!a.expires_at) return 1;
          if (!b.expires_at) return -1;
          return new Date(a.expires_at).getTime() - new Date(b.expires_at).getTime();
        }
        
        // Priority 3: If neither expires soon, sort by valid_from (earliest first)
        if (!a.valid_from && !b.valid_from) return 0;
        if (!a.valid_from) return 1;
        if (!b.valid_from) return -1;
        return new Date(a.valid_from).getTime() - new Date(b.valid_from).getTime();
      });
    });
    
    const result = {
      general: generalCoupons,
      generalGroups: Object.entries(generalGroups).map(([category, coupons]) => ({
        category,
        coupons,
      })),
      special: Object.entries(specialGroups).map(([key, coupons]) => ({
        groupKey: key,
        groupName: key === "birthday" ? "Special gift" : "Special gift",
        coupons,
      })),
    };
    
    console.log('[couponGroups]', {
      generalCount: result.general.length,
      generalGroupsCount: result.generalGroups.length,
      specialCount: result.special.length,
      useMembership,
      generalGroups: result.generalGroups.map(g => ({
        category: g.category,
        couponsCount: g.coupons.length,
        couponIds: g.coupons.map(c => ({ id: c.id, status: c.status, type: c.type, category: c.category })),
      })),
      specialGroups: result.special.map(g => ({
        groupKey: g.groupKey,
        couponsCount: g.coupons.length,
        couponIds: g.coupons.map(c => ({ id: c.id, status: c.status, type: c.type, category: c.category })),
      })),
    });
    
    return result;
  }, [allCoupons, useMembership]);


  // Get default selected general coupon (closest to expiration)
  const getDefaultGeneralCoupon = (category: string): number | null => {
    const categoryCoupons = couponGroups.general.filter((c) => {
      if (category === "cash") {
        return (
          c.category === "cash" || 
          c.type === "cash" || 
          c.type === "membership" ||
          c.type === "membership_gift" || // membership_gift should be in cash category
          c.type === "invitee_gift" ||
          c.category === "invitee_gift"
        );
      }
      if (category === "invite") {
        return c.category === "invite" || c.type === "invite";
      }
      return false;
    });
    return categoryCoupons.length > 0 ? categoryCoupons[0].id : null;
  };

  // Track the last coupon data hash to detect when coupons actually change (not just state updates)
  const lastCouponsHashRef = useRef<string>("");

  // Auto-select default coupons (both general and special) when coupons are loaded
  useEffect(() => {
    // Only run if coupons are loaded (not loading and has coupons, or loading finished)
    if (isLoadingCoupons) {
      return; // Wait for coupons to load
    }
    
    // Don't run if no coupons available
    if ((!Array.isArray(coupons) || coupons.length === 0) && couponGroups.general.length === 0 && couponGroups.special.length === 0) {
      return;
    }
    
    // Create a hash of current coupon data to detect actual data changes
    const couponsHash = JSON.stringify({
      generalCount: couponGroups.general.length,
      specialCount: couponGroups.special.length,
      couponIds: Array.isArray(coupons) ? coupons.map(c => c.id).sort() : [],
    });
    
    console.log('[Auto-select check]', {
      isLoadingCoupons,
      couponsCount: Array.isArray(coupons) ? coupons.length : 0,
      generalCount: couponGroups.general.length,
      specialCount: couponGroups.special.length,
      currentHash: couponsHash,
      lastHash: lastCouponsHashRef.current,
      selectedCouponIds,
    });
    
    // Only auto-select when coupon data actually changes (not on every state update)
    if (lastCouponsHashRef.current === couponsHash) {
      console.log('[Auto-select check] Skipping - hash unchanged');
      return;
    }
    
    console.log('[Auto-select check] Hash changed, proceeding with auto-select');
    lastCouponsHashRef.current = couponsHash;
    
    const newSelectedIds = [...selectedCouponIds];
    let hasChanges = false;
    
    // Auto-select general coupons (closest to expiration)
    const cashDefault = getDefaultGeneralCoupon("cash");
    const inviteDefault = getDefaultGeneralCoupon("invite");
    
    if (cashDefault && !newSelectedIds.includes(cashDefault)) {
      newSelectedIds.push(cashDefault);
      hasChanges = true;
    }
    if (inviteDefault && !newSelectedIds.includes(inviteDefault)) {
      newSelectedIds.push(inviteDefault);
      hasChanges = true;
    }
    
    // Auto-select special coupons (special_gift should be checked by default)
    // Only select if the coupon exists and is active
    couponGroups.special.forEach((group) => {
      // Only auto-select for "special_gift" group
      if (group.groupKey === "special_gift" && group.coupons.length > 0) {
        // Find the best active coupon (status === "active")
        const activeCoupons = group.coupons.filter((c) => c.status === "active");
        if (activeCoupons.length > 0) {
          const bestCoupon = activeCoupons[0]; // Already sorted: expiring soon first, then earliest valid_from
          if (bestCoupon && !newSelectedIds.includes(bestCoupon.id)) {
            console.log('[Auto-select Special gift]', {
              bestCouponId: bestCoupon.id,
              status: bestCoupon.status,
              currentSelectedIds: selectedCouponIds,
              newSelectedIds: [...newSelectedIds, bestCoupon.id],
            });
            newSelectedIds.push(bestCoupon.id);
            hasChanges = true;
          }
        } else {
          console.log('[Auto-select Special gift] No active coupons found', {
            totalCoupons: group.coupons.length,
            couponStatuses: group.coupons.map(c => ({ id: c.id, status: c.status })),
          });
        }
      }
    });
    
    if (hasChanges) {
      console.log('[Auto-select coupons] Setting selected coupon IDs:', newSelectedIds);
      const { setSelectedCouponIds } = useBookingStore.getState();
      setSelectedCouponIds(newSelectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingCoupons, Array.isArray(coupons) ? coupons.length : 0, couponGroups.general.length, couponGroups.special.length]); // Re-run when coupons are loaded or change

  // Handle special coupon selection (radio - only one per group)
  const handleSpecialCouponSelect = (couponId: number, groupKey: string) => {
    const { setSelectedCouponIds } = useBookingStore.getState();
    const currentIds = selectedCouponIds;
    
    // Remove other coupons from the same group
    const groupCoupons = couponGroups.special.find((g) => g.groupKey === groupKey)?.coupons || [];
    const otherGroupCouponIds = groupCoupons.map((c) => c.id);
    const filteredIds = currentIds.filter((id) => !otherGroupCouponIds.includes(id));
    
    // Add the selected coupon
    setSelectedCouponIds([...filteredIds, couponId]);
  };

  // Calculate coupon discount from selected coupons
  const couponDiscount = useMemo(() => {
    return selectedCouponIds.reduce((total, couponId) => {
      // Handle both real coupons (positive IDs) and virtual coupons (negative IDs)
      const coupon = allCoupons.find((c) => c.id === couponId);
      // Only count active coupons (real coupons) or pending coupons (virtual coupons)
      if (coupon) {
        const isActive = coupon.id > 0 ? coupon.status === "active" : coupon.status === "pending";
        if (isActive) {
          const amount = typeof coupon.amount === "string" ? parseFloat(coupon.amount) : coupon.amount;
          return total + amount;
        }
      }
      return total;
    }, 0);
  }, [selectedCouponIds, allCoupons]);
  const serviceTotal = subtotalWithDiscount - couponDiscount;
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
  const serviceTypeDisplay =
    serviceType === "mobile"
      ? "Mobile"
      : serviceType === "in_home"
        ? "In home"
        : "In Store";

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
  const handleProceedToPayment = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Get the booking submit payload
      const submitData = getBookingSubmitPayload();
      
      // Print the data to console for debugging
      console.log("=== Booking Submit Data ===");
      console.log(JSON.stringify(submitData, null, 2));
      console.log("===========================");
      
      // Submit the booking
      const booking = await submitBooking(submitData);
      console.log("Booking created:", booking);
      
      // Create deposit payment session (Stripe Checkout)
      const paymentSession = await createDepositSession(booking.id);
      console.log("Payment session created:", paymentSession);
      
      // Redirect to Stripe Checkout page
      // Stripe will handle the payment and redirect back to success page
      window.location.href = paymentSession.url;
      
      toast.success("Redirecting to payment...");
    } catch (error) {
      console.error("Failed to submit booking:", error);
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="content-stretch flex flex-col gap-[calc(16*var(--px393))] sm:gap-[24px] items-start relative w-full px-[calc(20*var(--px393))] sm:px-0">
      {/* Mobile Header */}
      <div className="content-stretch flex flex-col gap-[calc(12*var(--px393))] items-start relative shrink-0 w-full sm:hidden">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold h-[calc(19*var(--px393))] leading-[calc(17.5*var(--px393))] relative shrink-0 text-[calc(12*var(--px393))] text-black w-full whitespace-pre-wrap">
          Book your appointment
        </p>
        <div className="border border-[#4c4c4c] border-solid content-stretch flex h-[calc(24*var(--px393))] items-center justify-center overflow-clip px-[calc(9*var(--px393))] py-[calc(5*var(--px393))] relative rounded-[calc(12*var(--px393))] shrink-0">
          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] relative shrink-0 text-[#4c4c4c] text-[calc(10*var(--px393))]">
            Step 6 of 6
          </p>
        </div>
        <div className="content-stretch flex gap-[calc(12*var(--px393))] items-center relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))]">
            Review
          </p>
        </div>
      </div>

      <div className="content-stretch flex flex-col gap-[calc(32*var(--px393))] sm:gap-[24px] items-start relative w-full">
      {/* Address and service type card */}
      <div className="bg-white content-stretch flex flex-col gap-[8px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] sm:shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
          Address and service type
        </p>
        <div className="content-stretch flex flex-col gap-[12px] sm:flex-row sm:gap-[8px] items-start relative shrink-0 w-full">
          {/* Address Section */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a]">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full whitespace-pre-wrap">
              Address
            </p>
            <div className="font-['Comfortaa:Bold',sans-serif] font-bold flex flex-col relative shrink-0 text-[12px] w-full">
              <p className="leading-[16px] m-0">{addressLine1 || "Not set"}</p>
              {addressLine2 && <p className="leading-[16px] m-0">{addressLine2}</p>}
            </div>
          </div>
          {/* Service Type Section */}
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full">
              Service type
            </p>
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[16px] sm:leading-[22.75px] relative shrink-0 text-[12px] w-full">
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
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold sm:font-['Comfortaa:Medium',sans-serif] sm:font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[#8b6357]">
              Modify
            </p>
          </button>
        </div>
      </div>

      {/* Pet Information card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[calc(24*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[calc(8*var(--px393))] sm:gap-[8px] items-start relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))] sm:text-[16px] w-full whitespace-pre-wrap">
            Pet Information
          </p>
          {/* Five fields - Two rows on mobile, one row on desktop */}
          <div className="content-stretch flex flex-col sm:flex-row gap-[calc(12*var(--px393))] sm:gap-[40px] items-start relative shrink-0 w-full">
            {/* First row: Pet name, Breed, Weight */}
            <div className="content-stretch flex gap-[calc(20*var(--px393))] sm:gap-[40px] items-start relative shrink-0 w-full sm:w-auto">
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap flex-1 sm:flex-none">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
                  Pet name
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
                  {petName || "Not set"}
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap flex-1 sm:flex-none">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
                  Breed
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
                  {breed || "Not set"}
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap flex-1 sm:flex-none">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
                  Weight
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
                  {weight ? `${weight} ${weightUnit}` : "Not set"}
                </p>
              </div>
            </div>
            {/* Second row: Coat condition, Behavior */}
            <div className="content-stretch flex gap-[calc(20*var(--px393))] sm:gap-[40px] items-start relative shrink-0 w-full sm:w-auto">
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap flex-1 sm:flex-none">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
                  Coat condition
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
                  {coatCondition ? formatCoatCondition(coatCondition) : "Not set"}
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap flex-1 sm:flex-none">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
                  Behavior
                </p>
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
                  {behavior ? formatBehavior(behavior) : "Not set"}
                </p>
              </div>
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
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                Pet photos
              </p>
              {/* Mobile: 2 columns per row, Desktop: all in one row */}
              <div className="content-stretch flex flex-wrap sm:flex-nowrap gap-[calc(12*var(--px393))] sm:gap-[12px] items-start relative shrink-0 w-full">
                {photoUrls.slice(0, 3).map((url, index) => {
                  const fullUrl = buildImageUrl(url);
                  return (
                    <div
                      key={index}
                      className="bg-white h-[calc(120*var(--px393))] sm:h-[120px] overflow-clip relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 w-[calc(50%-6*var(--px393))] sm:w-[144px]"
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
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                Reference photos
              </p>
              <div className="content-stretch flex flex-wrap sm:flex-nowrap gap-[calc(12*var(--px393))] sm:gap-[12px] items-start relative shrink-0 w-full">
                {referenceStyles.slice(0, 3).map((file, index) => {
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div
                      key={index}
                      className="bg-white h-[calc(120*var(--px393))] sm:h-[120px] overflow-clip relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 w-[calc(50%-6*var(--px393))] sm:w-[144px]"
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
          <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0 text-[#4a3c2a] whitespace-pre-wrap">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[calc(10*var(--px393))] sm:text-[10px] w-full">
              Special instruments or notes
            </p>
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[12px] w-full">
              {specialNotes || "None"}
            </p>
          </div>
          {/* Modify Button */}
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[calc(28*var(--px393))] sm:h-[28px] items-center justify-center px-[calc(22*var(--px393))] sm:px-[22px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleModify(2)}
              className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[calc(5*var(--px393))] sm:gap-[5px] items-center relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[calc(12*var(--px393))] sm:text-[12px] text-[#8b6357]">
                Modify
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Package and add-on card */}
      <div className="bg-white content-stretch flex flex-col items-start p-[calc(24*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
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
                              className="content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-start justify-between leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full"
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
                    <div className="content-stretch flex font-['Comfortaa:Regular',sans-serif] font-normal items-start justify-between leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
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
              <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
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
                        className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full"
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
                  <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
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
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[calc(28*var(--px393))] sm:h-[28px] items-center justify-center px-[calc(22*var(--px393))] sm:px-[22px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0">
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
        <div className="bg-[#6e3d81] content-stretch flex flex-col items-start p-[calc(24*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full overflow-hidden">
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
              <div className="border-2 border-solid border-white content-stretch flex h-[calc(28*var(--px393))] sm:h-[28px] items-center justify-center px-[calc(22*var(--px393))] sm:px-[22px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0">
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
        <div className="bg-[#6e3d81] content-stretch flex flex-col items-start p-[calc(24*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full overflow-hidden">
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
      <div className="bg-white content-stretch flex flex-col items-start p-[calc(24*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px] w-full whitespace-pre-wrap">
            Date and time period
          </p>
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 text-[#4a3c2a] w-full">
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[12px] relative shrink-0 text-[10px] w-full whitespace-pre-wrap">
              Date and time selected
            </p>
            {selectedTimeSlots.length > 0 ? (
              <div className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[12px] w-full whitespace-pre-wrap">
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
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(16*var(--px393))] sm:leading-[22.75px] relative shrink-0 text-[12px] w-full whitespace-pre-wrap">
                No time slots selected
              </p>
            )}
          </div>
          {/* Modify Button */}
          <div className="border-2 border-[#8b6357] border-solid content-stretch flex h-[calc(28*var(--px393))] sm:h-[28px] items-center justify-center px-[calc(22*var(--px393))] sm:px-[22px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0">
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
      <div className="bg-white border-2 border-[#de6a07] border-solid content-stretch flex flex-col gap-[calc(16*var(--px393))] sm:flex-row sm:gap-[8px] items-start p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        {/* Left side: Title and subtitle */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-start relative shrink-0">
          <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[calc(28*var(--px393))] sm:leading-[28px] relative shrink-0 text-[#4a3c2a] text-[calc(16*var(--px393))] sm:text-[16px]">
            Total estimation for the service
          </p>
          <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[calc(12.25*var(--px393))] sm:text-[12.25px]">
            Our groomer will evaluate the final price
          </p>
        </div>

        {/* Right side: Price and coupon options */}
        <div className="content-stretch flex flex-col sm:flex-row flex-[1_0_0] items-start gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0 w-full">
          {/* Left: All content rows */}
          <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-end relative shrink-0 flex-1 w-full sm:w-auto">
            {/* First row: Price with original price and dropdown button */}
            <div className="content-stretch flex items-center justify-end gap-[calc(8*var(--px393))] sm:gap-0 relative shrink-0 w-full sm:w-auto">
              <div className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-0 relative shrink-0">
                {isMemberOrPurchasing && originalTotal > 0 && (
                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[#4A5565] text-[calc(12.25*var(--px393))] sm:text-[12.25px] mr-0 sm:mr-[8px]">
                    was ${originalTotal.toFixed(2)}
                  </span>
                )}
                {!isMemberOrPurchasing && originalTotal > finalTotal && (
                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[calc(12.25*var(--px393))] sm:text-[12.25px] line-through mr-0 sm:mr-[8px]">
                    was ${originalTotal.toFixed(2)}
                  </span>
                )}
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(24.5*var(--px393))] sm:leading-[24.5px] relative shrink-0 text-[#de6a07] text-[calc(16*var(--px393))] sm:text-[16px]">
                  ${finalTotal.toFixed(2)}
                </p>
              </div>
              {/* Dropdown button - show on mobile when expanded, desktop always */}
              <button
                onClick={() => setIsTotalExpanded(!isTotalExpanded)}
                className={cn(
                  "flex items-center justify-center relative shrink-0 size-[calc(20*var(--px393))] sm:size-[20px] cursor-pointer hover:border hover:border-[#8b6357] hover:border-solid transition-colors rounded-[calc(8*var(--px393))] sm:rounded-[8px]",
                  isTotalExpanded ? "ml-[calc(8*var(--px393))] sm:ml-0" : "ml-[calc(8*var(--px393))] sm:ml-0"
                )}
              >
                <Icon
                  name="chevron-down"
                  className={cn(
                    "size-[calc(20*var(--px393))] sm:size-[20px] text-[#4a3c2a] transition-transform",
                    isTotalExpanded ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>
            
            {/* Second row: Save badge + Price breakdown */}
            {isTotalExpanded && (
              <div className="content-stretch flex flex-col gap-0 items-end relative shrink-0 w-full sm:w-auto">
                <div className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0">
                  {/* Save percentage badge - show when there are savings */}
                  {totalSavings > 0 && savingsPercentage > 0 && (
                    <div className="bg-green-100 content-stretch flex h-[calc(24*var(--px393))] sm:h-[24px] items-center justify-center overflow-clip px-[calc(16*var(--px393))] sm:px-[16px] py-[calc(4*var(--px393))] sm:py-[4px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shrink-0">
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(14*var(--px393))] sm:leading-[14px] relative shrink-0 text-[#016630] text-[calc(10*var(--px393))] sm:text-[10px]">
                        Save {savingsPercentage}%
                      </p>
                    </div>
                  )}
                  {/* Price breakdown */}
                  {isMemberOrPurchasing && (
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[#DE6A07] text-[calc(12.25*var(--px393))] sm:text-[12.25px]">
                      (${serviceTotal.toFixed(2)}{useMembership && ` + $${Math.floor(membershipPrice)}`})
                    </p>
                  )}
                </div>
                {/* Tax included */}
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a5565] text-[calc(10*var(--px393))] sm:text-[10px]">
                  tax included
                </p>
              </div>
            )}
          
            {/* Horizontal divider line - between tax info and coupon options */}
            {isTotalExpanded && (couponGroups.general.length > 0 || couponGroups.special.length > 0) && (
              <div className="h-0 relative shrink-0 w-full">
                <div className="absolute bottom-0 left-0 right-0 -top-px">
                  <div className="bg-[rgba(0,0,0,0.1)] h-px w-full" />
                </div>
              </div>
            )}
          
            {/* Third row and below: Coupon selection - Grouped by type */}
            {isTotalExpanded && (couponGroups.general.length > 0 || couponGroups.special.length > 0) && (
              <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-end relative shrink-0 w-full mt-[calc(8*var(--px393))] sm:mt-[8px]">
                {/* General Coupons (通用券) - Checkbox style, grouped by category */}
                {couponGroups.generalGroups.map((group) => {
                  // Remove duplicates from group.coupons first
                  const uniqueGroupCoupons = group.coupons.filter((coupon, index, self) => 
                    index === self.findIndex((c) => c.id === coupon.id)
                  );
                  
                  // Separate real coupons and virtual membership coupons
                  const realCoupons = uniqueGroupCoupons.filter((c) => c.id > 0 && c.status === "active");
                  
                  // Only include virtual coupons if membership is selected
                  const virtualCoupons = useMembership 
                    ? uniqueGroupCoupons.filter((c) => c.id < 0 && c.status === "pending")
                    : [];
                  
                  // Combine: real coupons first, then virtual coupons
                  const availableCoupons = [...realCoupons, ...virtualCoupons];
                  
                  // Remove duplicates by ID before rendering (double check)
                  const uniqueCoupons = availableCoupons.filter((coupon, index, self) => 
                    index === self.findIndex((c) => c.id === coupon.id)
                  );
                  
                  const remainingCount = uniqueCoupons.length;
                  const categoryText = formatCouponCategory(group.category, uniqueGroupCoupons[0]?.type);
                  
                  // Find the best coupon to use (prefer real coupons, closest to expiration)
                  // If no real coupons, use the first virtual coupon
                  const bestCoupon = realCoupons.length > 0 
                    ? realCoupons[0] // Already sorted by expiration date
                    : virtualCoupons.length > 0
                    ? virtualCoupons[0] // Use first virtual coupon if no real coupons
                    : null;
                  
                  // Check if any coupon from this category is selected
                  const hasSelectedCoupon = uniqueCoupons.some((c) => selectedCouponIds.includes(c.id));
                  
                  // Debug log for Cash credit state
                  console.log('[Cash credit render]', {
                    category: group.category,
                    remainingCount,
                    hasSelectedCoupon,
                    selectedCouponIds,
                    uniqueCoupons: uniqueCoupons.map(c => ({ id: c.id, type: c.type })),
                  });
                  
                  // Get the selected coupon amount (if any)
                  // Check both real coupons (id > 0) and virtual coupons (id < 0)
                  const selectedCoupon = uniqueCoupons.find((c) => selectedCouponIds.includes(c.id));
                  const selectedAmount = selectedCoupon 
                    ? (typeof selectedCoupon.amount === "string" ? parseFloat(selectedCoupon.amount) : selectedCoupon.amount)
                    : null;
                  
                  // Only render if there are available coupons
                  if (remainingCount === 0) return null;
                  
                  // Handle category checkbox toggle
                  const handleCategoryToggle = (checked: boolean) => {
                    console.log('[Cash credit toggle]', {
                      checked,
                      category: group.category,
                      currentSelectedIds: selectedCouponIds,
                      uniqueCoupons: uniqueCoupons.map(c => ({ id: c.id, type: c.type, status: c.status })),
                      bestCouponId: bestCoupon?.id,
                    });
                    
                    const { setSelectedCouponIds } = useBookingStore.getState();
                    const currentIds = [...selectedCouponIds];
                    // Include both real coupons (id > 0) and virtual coupons (id < 0) from this category
                    const categoryCouponIds = uniqueCoupons.map(c => c.id);
                    
                    console.log('[Cash credit toggle] Category coupon IDs:', categoryCouponIds);
                    
                    if (checked) {
                      // Select the best coupon: remove other coupons from this category first, then add the best one
                      if (bestCoupon) {
                        const filteredIds = currentIds.filter((id) => !categoryCouponIds.includes(id));
                        const newIds = [...filteredIds, bestCoupon.id];
                        console.log('[Cash credit toggle] Selecting - filtered IDs:', filteredIds, 'new IDs:', newIds, 'bestCoupon:', bestCoupon);
                        setSelectedCouponIds(newIds);
                      } else {
                        console.warn('[Cash credit toggle] No best coupon available, cannot select');
                      }
                    } else {
                      // Deselect all coupons from this category by removing them from selectedCouponIds
                      const filteredIds = currentIds.filter((id) => !categoryCouponIds.includes(id));
                      console.log('[Cash credit toggle] Deselecting - filtered IDs:', filteredIds);
                      setSelectedCouponIds(filteredIds);
                    }
                    
                    // Log state after update
                    setTimeout(() => {
                      const state = useBookingStore.getState();
                      console.log('[Cash credit toggle] State after update:', state.selectedCouponIds);
                    }, 0);
                  };
                  
                  console.log('[Cash credit render] Rendering checkbox', {
                    checked: hasSelectedCoupon,
                    label: `${categoryText} (${remainingCount} left)`,
                  });
                  
                  return (
                    <div key={group.category} className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <Checkbox
                        checked={hasSelectedCoupon}
                        onCheckedChange={(checked) => {
                          console.log('[Cash credit checkbox] onCheckedChange called', { checked, hasSelectedCoupon });
                          handleCategoryToggle(checked);
                        }}
                        label={`${categoryText} (${remainingCount} left)`}
                        containerClassName="relative shrink-0"
                      />
                      {hasSelectedCoupon && selectedAmount !== null && (
                        <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                          -${selectedAmount.toFixed(2)}
                        </span>
                      )}
                    </div>
                  );
                })}
                
                {/* Special Holiday Coupons (特殊节日券) */}
                {couponGroups.special
                  .filter((group) => {
                    // Filter to only include active coupons
                    const activeCoupons = group.coupons.filter((c) => c.status === "active");
                    
                    // For special_gift group, only show if there are active birthday coupons
                    if (group.groupKey === "special_gift") {
                      const hasActiveBirthdayCoupons = activeCoupons.some(
                        (c) => c.category === "birthday" || c.type === "birthday"
                      );
                      return hasActiveBirthdayCoupons;
                    }
                    // For other groups (birthday), show if there are active coupons
                    return activeCoupons.length > 0;
                  })
                  .map((group) => {
                    // Filter group coupons to only include active ones
                    const activeGroupCoupons = group.coupons.filter((c) => c.status === "active");
                    // Create a new group object with only active coupons
                    const filteredGroup = {
                      ...group,
                      coupons: activeGroupCoupons,
                    };
                  // For "special_gift", use checkbox style (default checked)
                  // For "birthday", use radio button style
                  const isSpecialGift = filteredGroup.groupKey === "special_gift";
                  const hasSelectedCoupon = filteredGroup.coupons.some((c) => selectedCouponIds.includes(c.id));
                  const selectedCoupon = filteredGroup.coupons.find((c) => selectedCouponIds.includes(c.id));
                  const bestCoupon = filteredGroup.coupons[0]; // Already sorted: expiring soon first, then earliest valid_from
                  
                  // Debug log for Special gift state
                  if (isSpecialGift) {
                    console.log('[Special gift render]', {
                      groupKey: group.groupKey,
                      hasSelectedCoupon,
                      selectedCouponIds,
                      groupCoupons: group.coupons.map(c => ({ id: c.id, type: c.type })),
                      bestCouponId: bestCoupon?.id,
                    });
                  }
                  
                  if (isSpecialGift) {
                    // Filter to only show active birthday coupons in special_gift group
                    const birthdayCoupons = filteredGroup.coupons.filter((coupon) => {
                      return (coupon.category === "birthday" || coupon.type === "birthday") && coupon.status === "active";
                    });
                    
                    // If no birthday coupons, don't render this group
                    if (birthdayCoupons.length === 0) {
                      return null;
                    }
                    
                    // Special gift: Checkbox style with nested radio buttons for individual coupons
                    const selectedAmount = selectedCoupon 
                      ? (typeof selectedCoupon.amount === "string" ? parseFloat(selectedCoupon.amount) : selectedCoupon.amount)
                      : null;
                    
                    // Handle Special gift toggle (similar to general coupons)
                    const handleSpecialGiftToggle = (checked: boolean) => {
                      console.log('[Special gift toggle]', {
                        checked,
                        currentSelectedIds: selectedCouponIds,
                        groupCoupons: group.coupons.map(c => ({ id: c.id, type: c.type })),
                        bestCouponId: bestCoupon?.id,
                        hasSelectedCoupon,
                      });
                      
                      const { setSelectedCouponIds } = useBookingStore.getState();
                      const currentIds = [...selectedCouponIds]; // Create a copy
                      const groupCouponIds = filteredGroup.coupons.map((c) => c.id);
                      
                      console.log('[Special gift toggle] Group coupon IDs:', groupCouponIds);
                      
                      // Remove all coupons from this group first
                      const filteredIds = currentIds.filter((id) => !groupCouponIds.includes(id));
                      
                      if (checked && bestCoupon) {
                        // Select the best coupon
                        const newIds = [...filteredIds, bestCoupon.id];
                        console.log('[Special gift toggle] Selecting - filtered IDs:', filteredIds, 'new IDs:', newIds);
                        setSelectedCouponIds(newIds);
                      } else {
                        // Deselect all coupons from this group
                        console.log('[Special gift toggle] Deselecting - filtered IDs:', filteredIds);
                        setSelectedCouponIds(filteredIds);
                      }
                      
                      // Log state after update
                      setTimeout(() => {
                        const state = useBookingStore.getState();
                        console.log('[Special gift toggle] State after update:', state.selectedCouponIds);
                      }, 0);
                    };
                    
                    console.log('[Special gift render] Rendering checkbox with sub-options', {
                      checked: hasSelectedCoupon,
                      label: group.groupName,
                      couponsCount: group.coupons.length,
                      birthdayCouponsCount: birthdayCoupons.length,
                    });
                    
                    return (
                      <div key={filteredGroup.groupKey} className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-full">
                        {/* Group header - Checkbox */}
                        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                          <Checkbox
                            checked={hasSelectedCoupon}
                            onCheckedChange={(checked) => {
                              console.log('[Special gift checkbox] onCheckedChange called', { checked, hasSelectedCoupon });
                              handleSpecialGiftToggle(checked);
                            }}
                            label={filteredGroup.groupName}
                            containerClassName="relative shrink-0"
                          />
                          {hasSelectedCoupon && selectedAmount !== null && (
                            <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                              -${selectedAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {/* Coupons in group - Radio buttons */}
                        {hasSelectedCoupon && (
                          <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-end relative shrink-0 w-full ml-[calc(24*var(--px393))] sm:ml-[24px]">
                            {birthdayCoupons.map((coupon, index) => {
                                const isSelected = selectedCouponIds.includes(coupon.id);
                                const couponAmount = typeof coupon.amount === "string" ? parseFloat(coupon.amount) : coupon.amount;
                                const expirationText = formatCouponExpiration(coupon.expires_at);
                                let displayName = getCouponDisplayName(coupon);
                                
                                // If display name is generic (like "membership_gift" or "Special gift"), 
                                // try to make it more unique by using notes or adding index
                                if (displayName === "membership_gift" || displayName === "Special gift" || displayName === "gift") {
                                  if (coupon.notes && coupon.notes.trim()) {
                                    displayName = coupon.notes;
                                  } else if (coupon.template_id) {
                                    displayName = `Gift #${coupon.template_id}`;
                                  } else {
                                    displayName = `Special gift ${index + 1}`;
                                  }
                                }
                                
                                console.log('[Special gift item]', {
                                  couponId: coupon.id,
                                  displayName,
                                  type: coupon.type,
                                  category: coupon.category,
                                  notes: coupon.notes,
                                  template_id: coupon.template_id,
                                  isBirthday: coupon.category === "birthday" || coupon.type === "birthday",
                                });
                                
                                return (
                                  <div key={coupon.id} className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0">
                                    {/* Expiration tag */}
                                    {expirationText && expirationText !== "Expired" && (
                                      <div className="bg-white border border-[#4C4C4C] border-solid content-stretch flex h-[calc(20*var(--px393))] sm:h-[20px] items-center justify-center overflow-clip px-[calc(8*var(--px393))] sm:px-[8px] py-[calc(2*var(--px393))] sm:py-[2px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shrink-0">
                                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4C4C4C] text-[calc(10*var(--px393))] sm:text-[10px]">
                                          {expirationText}
                                        </p>
                                      </div>
                                    )}
                                    <label className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0 cursor-pointer">
                                      <input
                                        type="radio"
                                        name={`special-coupon-${filteredGroup.groupKey}`}
                                        checked={isSelected}
                                        onChange={() => handleSpecialCouponSelect(coupon.id, filteredGroup.groupKey)}
                                        className="sr-only"
                                      />
                                      <RadioButton isChecked={isSelected} />
                                      <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                                        {displayName}
                                      </span>
                                      <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                                        -${couponAmount.toFixed(2)}
                                      </span>
                                    </label>
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    // Birthday: Radio button style (existing logic)
                    return (
                      <div key={group.groupKey} className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-end relative shrink-0 w-full">
                        {/* Group header */}
                        <div className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0 w-full">
                          <Checkbox
                            checked={hasSelectedCoupon}
                            onCheckedChange={() => {
                              // Toggle all coupons in group (but only one can be selected at a time)
                              const selectedInGroup = group.coupons.find((c) => selectedCouponIds.includes(c.id));
                              if (selectedInGroup) {
                                handleSpecialCouponSelect(selectedInGroup.id, group.groupKey);
                              } else if (group.coupons.length > 0) {
                                handleSpecialCouponSelect(group.coupons[0].id, group.groupKey);
                              }
                            }}
                            label={filteredGroup.groupName}
                            containerClassName="relative shrink-0"
                          />
                        </div>
                        {/* Coupons in group - Radio buttons */}
                        <div className="content-stretch flex flex-col gap-[calc(4*var(--px393))] sm:gap-[4px] items-end relative shrink-0 w-full ml-[calc(24*var(--px393))] sm:ml-[24px]">
                          {group.coupons.map((coupon) => {
                            const isSelected = selectedCouponIds.includes(coupon.id);
                            const couponAmount = typeof coupon.amount === "string" ? parseFloat(coupon.amount) : coupon.amount;
                            const expirationText = formatCouponExpiration(coupon.expires_at);
                            const displayName = getCouponDisplayName(coupon);
                            
                            return (
                              <div key={coupon.id} className="content-stretch flex items-center gap-[8px] relative shrink-0">
                                {/* Expiration tag */}
                                {expirationText && expirationText !== "Expired" && (
                                  <div className="bg-white border border-[#4C4C4C] border-solid content-stretch flex h-[calc(20*var(--px393))] sm:h-[20px] items-center justify-center overflow-clip px-[calc(8*var(--px393))] sm:px-[8px] py-[calc(2*var(--px393))] sm:py-[2px] relative rounded-[calc(12*var(--px393))] sm:rounded-[12px] shrink-0">
                                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4C4C4C] text-[calc(10*var(--px393))] sm:text-[10px]">
                                      {expirationText}
                                    </p>
                                  </div>
                                )}
                                <label className="content-stretch flex items-center gap-[calc(8*var(--px393))] sm:gap-[8px] relative shrink-0 cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`special-coupon-${filteredGroup.groupKey}`}
                                      checked={isSelected}
                                      onChange={() => handleSpecialCouponSelect(coupon.id, filteredGroup.groupKey)}
                                      className="sr-only"
                                    />
                                  <RadioButton isChecked={isSelected} />
                                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                                    {displayName}
                                  </span>
                                  <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[calc(12*var(--px393))] sm:leading-[12px] relative shrink-0 text-[#4a3c2a] text-[calc(10*var(--px393))] sm:text-[10px]">
                                    -${couponAmount.toFixed(2)}
                                  </span>
                                </label>
                </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
          
          {/* Right: Arrow button - Desktop only */}
          <button
            onClick={() => setIsTotalExpanded(!isTotalExpanded)}
            className="hidden sm:flex items-center justify-center relative shrink-0 size-[20px] cursor-pointer hover:border hover:border-[#8b6357] hover:border-solid transition-colors rounded-[8px] self-start"
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
      </div>

      {/* Bottom buttons */}
      <div className="content-stretch flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-[calc(12*var(--px393))] sm:gap-0 relative shrink-0 w-full">
        <OrangeButton size="medium" onClick={handleProceedToPayment} disabled={isSubmitting} loading={isSubmitting} className="w-[220px] sm:w-auto">
          <div className="flex gap-[calc(4*var(--px393))] sm:gap-[4px] items-center">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] text-[calc(14*var(--px393))] sm:text-[14px] text-white">
              Proceed to payment
            </p>
            <Icon
              name="button-arrow"
              aria-label="Arrow"
              className="size-[calc(14*var(--px393))] sm:size-[14px] text-white"
            />
          </div>
        </OrangeButton>
      </div>
    </div>
  );
}

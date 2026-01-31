import { useEffect, useMemo, useState, useRef } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "../accountStore";
import { bindInvitation } from "@/lib/api";
import type { CouponOut } from "@/lib/api";

/** 邀请码校验：非空、6 位、仅数字与大写字母 */
function isValidPromoCode(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length === 6 && /^[A-Z0-9]{6}$/.test(trimmed);
}

function CreditRow({
  title,
  amount,
  subtitle,
  statusText,
  statusColor,
  dotColor,
  faded,
}: {
  title: string;
  amount: string;
  subtitle: string;
  statusText: string;
  statusColor: string;
  dotColor: string;
  faded?: boolean;
}) {
  return (
    <div
      className={`rounded-[12px] border border-[#E5E7EB] p-[16px] flex justify-between ${
        faded ? "bg-[#F3F4F6]" : "bg-white"
      }`}
    >
      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {title}
        </p>
        <div className="flex items-center gap-[6px] mt-[4px]">
          <span className={`text-[12.5px] leading-[17.5px] font-bold font-['Comfortaa:Regular',sans-serif] ${statusColor}`}>
            {statusText}
          </span>
          
          <Icon name="alert-info" className={`size-[12px] ${dotColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex justify-start text-right">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[24px] leading-[21px] text-[#DE6A07]">
          {amount}
        </p>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SpecialOfferCard({
  title,
  subtitle,
  amount,
  expiredText,
  showAlert,
}: {
  title: string;
  subtitle: string;
  amount: string;
  expiredText?: string;
  showAlert?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] p-[16px] flex justify-between bg-white">
      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {title}
        </p>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {subtitle}
        </p>
        {expiredText && (
          <div className="flex items-center gap-[6px] mt-[4px]">
            <span className="text-[12.5px] leading-[17.5px] font-bold font-['Comfortaa:Regular',sans-serif] text-[#DE6A07]">
              {expiredText}
            </span>
            {showAlert ? <Icon name="alert-info" size={12} className="text-[#DE1507]" /> : null}
          </div>
        )}
      </div>
      <div className="flex justify-start text-right">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[24px] leading-[21px] text-[#DE6A07]">
          {amount}
        </p>
      </div>
    </div>
  );
}

// 格式化金额
function formatAmount(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === "") return "$0";
  if (typeof value === "number") return `$${value.toFixed(2)}`;
  const trimmed = String(value).trim();
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

// 格式化日期
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
}

// 判断优惠券状态
function getCouponStatus(coupon: CouponOut): {
  statusText: string;
  statusColor: string;
  dotColor: string;
  faded: boolean;
} {
  const statusLower = coupon.status?.toLowerCase() ?? "";
  const now = new Date();
  const expiresAt = coupon.expires_at ? new Date(coupon.expires_at) : null;
  
  // 已过期（优先检查 status，然后检查 expires_at）
  if (statusLower === "expired" || statusLower === "used" || (expiresAt && expiresAt < now)) {
    return {
      statusText: expiresAt ? `Expired at ${formatDate(coupon.expires_at)}` : "Expired",
      statusColor: "text-[#DE6A07]",
      dotColor: "text-[#DE1507]",
      faded: false,
    };
  }
  
  // 待激活
  if (statusLower === "pending" || statusLower === "inactive") {
    return {
      statusText: "Pending",
      statusColor: "text-[#4A5565]",
      dotColor: "text-[#2374FF]",
      faded: true,
    };
  }
  
  // 有效（有过期日期）
  if (expiresAt) {
    return {
      statusText: `Valid until ${formatDate(coupon.expires_at)}`,
      statusColor: "text-[#4A5565]",
      dotColor: "text-[#2374FF]",
      faded: false,
    };
  }
  
  // 默认（active 状态且无过期日期）
  return {
    statusText: "Active",
    statusColor: "text-[#4A5565]",
    dotColor: "text-[#2374FF]",
    faded: false,
  };
}

export default function DashboardMyCreditCard() {
  const { cashCoupons, specialCoupons, isLoadingCashCoupons, isLoadingSpecialCoupons, fetchCashCoupons, fetchSpecialCoupons } = useAccountStore();
  const [showAllCashCredits, setShowAllCashCredits] = useState(false);
  const [showAllSpecialOffers, setShowAllSpecialOffers] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isBinding, setIsBinding] = useState(false);
  const hasFetchedCashRef = useRef(false);
  const hasFetchedSpecialRef = useRef(false);

  const normalizedPromo = promoCode.trim().toUpperCase();
  const canApplyPromo = isValidPromoCode(normalizedPromo) && !isBinding;

  const handleApplyPromo = async () => {
    if (!canApplyPromo) return;
    setPromoError(null);
    setIsBinding(true);
    try {
      await bindInvitation({ invite_code: normalizedPromo });
      setPromoCode("");
      await Promise.all([fetchCashCoupons(), fetchSpecialCoupons()]);
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err ? String((err as { message: unknown }).message) : "Failed to apply code";
      setPromoError(message);
    } finally {
      setIsBinding(false);
    }
  };

  // 加载 Cash credit 优惠券
  useEffect(() => {
    if (!hasFetchedCashRef.current) {
      hasFetchedCashRef.current = true;
      fetchCashCoupons().catch((error) => {
        console.error("Error fetching cash coupons:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 加载 Special offer 优惠券
  useEffect(() => {
    if (!hasFetchedSpecialRef.current) {
      hasFetchedSpecialRef.current = true;
      fetchSpecialCoupons().catch((error) => {
        console.error("Error fetching special coupons:", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 转换 Cash credit 数据
  const cashCredits = useMemo(() => {
    return cashCoupons.map((coupon) => {
      const status = getCouponStatus(coupon);
      const amount = formatAmount(coupon.amount);
      const title = coupon.template_name || coupon.type || "Cash credit";
      
      return {
        title,
        amount,
        subtitle: "",
        statusText: status.statusText,
        statusColor: status.statusColor,
        dotColor: status.dotColor,
        faded: status.faded,
      };
    });
  }, [cashCoupons]);

  // 转换 Special offer 数据
  const specialOffers = useMemo(() => {
    return specialCoupons.map((coupon) => {
      const amount = formatAmount(coupon.amount);
      const title = coupon.template_name || coupon.type || "Special offer";
      const subtitle = coupon.notes || "";
      const expiresAt = coupon.expires_at;
      const now = new Date();
      const isExpired = expiresAt ? new Date(expiresAt) < now : false;
      
      return {
        title,
        subtitle,
        amount,
        expiredText: expiresAt ? `Expired at ${formatDate(expiresAt)}` : undefined,
        showAlert: isExpired,
      };
    });
  }, [specialCoupons]);

  const cashCreditsToShow = showAllCashCredits ? cashCredits : cashCredits.slice(0, 2);
  const specialOffersToShow = showAllSpecialOffers ? specialOffers : specialOffers.slice(0, 2);
  const shouldShowCashToggle = cashCredits.length > 2;
  const shouldShowSpecialOfferToggle = specialOffers.length > 2;

  return (
    <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
      <div className="flex items-center justify-between mb-[12px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[16px] leading-[24px] text-[#4A3C2A]">
          My credit
        </p>
        <OrangeButton type="button" variant="outline" size="medium">
          <span className="flex items-center gap-[4px]">
            Book with credit
            <Icon name="button-arrow" className="size-[16px] text-[#DE6A07]" />
          </span>
        </OrangeButton>
      </div>

      <div className="mb-[20px]">
        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.5px] text-[#4A5565] mb-[6px]">
          Add promo code
        </p>
        <div className="flex items-center gap-[20px]">
          <input
            className="border border-[#E5E7EB] rounded-[10px] w-[215px] px-[10px] py-[6px] font-['Comfortaa:Regular',sans-serif] text-[12.25px] leading-[17.5px] text-[#4A5565] placeholder:text-[#9CA3AF]"
            placeholder="6 characters, letters & numbers"
            value={promoCode}
            maxLength={6}
            onChange={(e) => {
              const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
              setPromoCode(v);
              if (promoError) setPromoError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && canApplyPromo && handleApplyPromo()}
            aria-invalid={promoCode.length > 0 && !isValidPromoCode(normalizedPromo)}
            aria-describedby={promoError ? "promo-error" : undefined}
          />
          <OrangeButton
            type="button"
            size="compact"
            className="px-[16px]"
            disabled={!canApplyPromo}
            loading={isBinding}
            onClick={handleApplyPromo}
          >
            Apply
          </OrangeButton>
        </div>
        {promoError ? (
          <p id="promo-error" className="mt-[6px] text-[12px] text-[#DE1507] font-['Comfortaa:Regular',sans-serif]">
            {promoError}
          </p>
        ) : promoCode.length > 0 && !isValidPromoCode(normalizedPromo) ? (
          <p className="mt-[6px] text-[12px] text-[#4A5565] font-['Comfortaa:Regular',sans-serif]">
            Code must be 6 characters, letters and numbers only.
          </p>
        ) : null}
      </div>

      <div className="mb-[12px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-bold text-[14px] leading-[20px] text-[#DE6A07] mb-[12px]">
          Cash credit
        </p>
        {isLoadingCashCoupons && cashCredits.length === 0 ? (
          <div className="text-[#4A3C2A] text-sm py-4">Loading cash credits...</div>
        ) : cashCredits.length === 0 ? (
          <div className="text-[#4A3C2A] text-sm py-4">No cash credits available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {cashCreditsToShow.map((credit, index) => (
              <CreditRow
                key={`cash-${index}-${credit.title}-${credit.amount}`}
                title={credit.title}
                amount={credit.amount}
                subtitle={credit.subtitle}
                statusText={credit.statusText}
                statusColor={credit.statusColor}
                dotColor={credit.dotColor}
                faded={credit.faded}
              />
            ))}
          </div>
        )}
      </div>

      {shouldShowCashToggle ? (
        <button
          type="button"
          onClick={() => setShowAllCashCredits((value) => !value)}
          className="w-full flex items-center justify-center gap-[6px] text-[#8B6357] font-bold text-[12px] leading-[17.5px] font-['Comfortaa:Regular',sans-serif] mb-[20px]"
        >
          <Icon
            name="chevron-down"
            size={16}
            className={`text-[#8B6357] transition-transform duration-200 ${showAllCashCredits ? "rotate-180" : "rotate-0"}`}
          />
          {showAllCashCredits ? "Show less cash credits" : "Show all cash credits"}
        </button>
      ) : null}

      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-bold text-[14px] leading-[20px] text-[#DE6A07] mb-[12px]">
          Special offer
        </p>
        {isLoadingSpecialCoupons && specialOffers.length === 0 ? (
          <div className="text-[#4A3C2A] text-sm py-4">Loading special offers...</div>
        ) : specialOffers.length === 0 ? (
          <div className="text-[#4A3C2A] text-sm py-4">No special offers available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {specialOffersToShow.map((offer, index) => (
              <SpecialOfferCard
                key={`special-${index}-${offer.title}-${offer.amount}`}
                title={offer.title}
                subtitle={offer.subtitle}
                amount={offer.amount}
                expiredText={offer.expiredText}
                showAlert={offer.showAlert}
              />
            ))}
          </div>
        )}
      </div>

      {shouldShowSpecialOfferToggle ? (
        <button
          type="button"
          onClick={() => setShowAllSpecialOffers((value) => !value)}
          className="w-full flex items-center justify-center gap-[6px] text-[#8B6357] font-bold text-[12px] leading-[17.5px] font-['Comfortaa:Regular',sans-serif] mt-[20px]"
        >
          <Icon
            name="chevron-down"
            size={16}
            className={`text-[#8B6357] transition-transform duration-200 ${showAllSpecialOffers ? "rotate-180" : "rotate-0"}`}
          />
          {showAllSpecialOffers ? "Show less special offers" : "Show all special offers"}
        </button>
      ) : null}
    </div>
  );
}

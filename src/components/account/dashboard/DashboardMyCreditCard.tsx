import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "../accountStore";
import { bindInvitation } from "@/lib/api";
import type { CouponOut } from "@/lib/api";

/** 邀请码校验：非空、8 位、仅数字与大写字母 */
function isValidPromoCode(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length === 8 && /^[A-Z0-9]{8}$/.test(trimmed);
}

function CreditRow({
  title,
  amount,
  subtitle,
  statusText,
  statusColor,
  dotColor,
  faded,
  showStatusIcon,
  count,
  isPending,
}: {
  title: string;
  amount: string;
  subtitle: string;
  statusText: string;
  statusColor: string;
  dotColor: string;
  faded?: boolean;
  showStatusIcon?: boolean;
  count?: number;
  /** 仅 pending 时金额为 #8B6357 */
  isPending?: boolean;
}) {
  const isCountXAmount = count != null && count > 1;
  const amountColor = isPending ? "text-[#8B6357]" : "text-[#DE6A07]";
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
          {showStatusIcon ? <Icon name="alert-info" className={`size-[12px] ${dotColor.replace('bg-', 'text-')}`} /> : null}
        </div>
      </div>
      <div className="flex justify-start text-right">
        <p className={`font-['Comfortaa:Bold',sans-serif] font-bold text-[24px] leading-[21px] ${amountColor}`}>
          {isCountXAmount ? (
            <>
              <span className={`font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] ${amountColor}`}>{count} x </span>
              {amount}
            </>
          ) : (
            amount
          )}
        </p>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** 与 Cash credit 条目一致：状态、图标、数量 x 金额、faded；仅 pending 时金额 #8B6357 */
function SpecialOfferCard({
  title,
  subtitle,
  amount,
  statusText,
  statusColor,
  dotColor,
  faded,
  showStatusIcon,
  count,
  isPending,
}: {
  title: string;
  subtitle: string;
  amount: string;
  statusText: string;
  statusColor: string;
  dotColor: string;
  faded?: boolean;
  showStatusIcon?: boolean;
  count?: number;
  isPending?: boolean;
}) {
  const isCountXAmount = count != null && count > 1;
  const amountColor = isPending ? "text-[#8B6357]" : "text-[#DE6A07]";
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
          {showStatusIcon ? <Icon name="alert-info" className={`size-[12px] ${dotColor.replace('bg-', 'text-')}`} /> : null}
        </div>
      </div>
      <div className="flex justify-start text-right">
        <p className={`font-['Comfortaa:Bold',sans-serif] font-bold text-[24px] leading-[21px] ${amountColor}`}>
          {isCountXAmount ? (
            <>
              <span className={`font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] ${amountColor}`}>{count} x </span>
              {amount}
            </>
          ) : (
            amount
          )}
        </p>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[21px] text-[#8B6357]">
          {subtitle}
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

// 判断优惠券状态（正常有效时不显示 icon）
function getCouponStatus(coupon: CouponOut): {
  statusText: string;
  statusColor: string;
  dotColor: string;
  faded: boolean;
  showStatusIcon: boolean;
  isPending: boolean;
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
      showStatusIcon: true,
      isPending: false,
    };
  }
  
  // 待激活（Pending 状态：文字与金额 #8B6357，参考 Figma node-id=2509-25554）
  if (statusLower === "pending" || statusLower === "locked") {
    return {
      statusText: "Pending",
      statusColor: "text-[#8B6357]",
      dotColor: "text-[#2374FF]",
      faded: true,
      showStatusIcon: true,
      isPending: true,
    };
  }
  
  // 有效（有过期日期）：剩余不足 30 天显示 "Expires at xxx" + 红色 icon，否则 "Valid until xxx" 不显示 icon
  if (expiresAt) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / msPerDay);
    const lessThan30Days = daysLeft < 30;
    return {
      statusText: lessThan30Days ? `Expires at ${formatDate(coupon.expires_at)}` : `Valid until ${formatDate(coupon.expires_at)}`,
      statusColor: lessThan30Days ? "text-[#DE6A07]" : "text-[#4A5565]",
      dotColor: lessThan30Days ? "text-[#DE1507]" : "text-[#2374FF]",
      faded: false,
      showStatusIcon: lessThan30Days,
      isPending: false,
    };
  }
  
  // 默认（active 状态且无过期日期）：不显示 icon
  return {
    statusText: "Active",
    statusColor: "text-[#4A5565]",
    dotColor: "text-[#2374FF]",
    faded: false,
    showStatusIcon: false,
    isPending: false,
  };
}

export default function DashboardMyCreditCard() {
  const navigate = useNavigate();
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
      const count = coupon.count;
      
      return {
        title,
        amount,
        subtitle: "",
        statusText: status.statusText,
        statusColor: status.statusColor,
        dotColor: status.dotColor,
        faded: status.faded,
        showStatusIcon: status.showStatusIcon,
        count: count != null && count > 0 ? count : undefined,
        isPending: status.isPending,
      };
    });
  }, [cashCoupons]);

  // 转换 Special offer 数据（与 Cash credit 一致：使用 getCouponStatus）
  const specialOffers = useMemo(() => {
    return specialCoupons.map((coupon) => {
      const status = getCouponStatus(coupon);
      const amount = formatAmount(coupon.amount);
      const title = coupon.template_name || coupon.type || "Special offer";
      const subtitle = coupon.notes || "";
      const count = coupon.count;

      return {
        title,
        subtitle,
        amount,
        statusText: status.statusText,
        statusColor: status.statusColor,
        dotColor: status.dotColor,
        faded: status.faded,
        showStatusIcon: status.showStatusIcon,
        count: count != null && count > 0 ? count : undefined,
        isPending: status.isPending,
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
        <OrangeButton
          type="button"
          variant="outline"
          size="medium"
          onClick={() => navigate("/booking")}
        >
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
            placeholder="Enter your code"
            value={promoCode}
            maxLength={8}
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
            Code must be 8 characters, letters and numbers only.
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
                showStatusIcon={credit.showStatusIcon}
                count={credit.count}
                isPending={credit.isPending}
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
                statusText={offer.statusText}
                statusColor={offer.statusColor}
                dotColor={offer.dotColor}
                faded={offer.faded}
                showStatusIcon={offer.showStatusIcon}
                count={offer.count}
                isPending={offer.isPending}
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

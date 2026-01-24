import { useMemo, useState } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";

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

export default function DashboardMyCreditCard() {
  const [showAllCashCredits, setShowAllCashCredits] = useState(false);
  const [showAllSpecialOffers, setShowAllSpecialOffers] = useState(false);

  const cashCredits = useMemo(
    () => [
      {
        title: "Cash credit",
        amount: "$5",
        subtitle: "",
        statusText: "Expired at 2026.03.26",
        statusColor: "text-[#DE6A07]",
        dotColor: "text-[#DE1507]",
        faded: false,
      },
      {
        title: "Invite credit",
        amount: "2 x $5",
        subtitle: "",
        statusText: "Pending",
        statusColor: "text-[#4A5565]",
        dotColor: "text-[#2374FF]",
        faded: true,
      },
      {
        title: "Referral bonus",
        amount: "$3",
        subtitle: "",
        statusText: "Valid until 2026.06.30",
        statusColor: "text-[#4A5565]",
        dotColor: "text-[#2374FF]",
        faded: false,
      },
    ],
    []
  );

  const specialOffers = useMemo(
    () => [
      {
        title: "Mother's day",
        subtitle: "De-shedding treatment",
        amount: "$5",
        expiredText: "Expired at 2026.03.26",
        showAlert: true,
      },
      {
        title: "Birthday treat",
        subtitle: "Paw Treatment",
        amount: "$10",
        expiredText: "Expired at 2026.05.05",
        showAlert: false,
      },
      {
        title: "Summer refresh",
        subtitle: "Bath & brush",
        amount: "$8",
        expiredText: "Expired at 2026.07.12",
        showAlert: false,
      },
    ],
    []
  );

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
            className="border border-[#E5E7EB] rounded-[10px] w-[215px] px-[10px] py-[6px] font-['Comfortaa:Regular',sans-serif] text-[12.25px] leading-[17.5px] text-[#4A5565]"
            placeholder="Enter your code"
          />
          <OrangeButton type="button" size="compact" className="px-[16px]">
            Apply
          </OrangeButton>
        </div>
      </div>

      <div className="mb-[12px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-bold text-[14px] leading-[20px] text-[#DE6A07] mb-[12px]">
          Cash credit
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {cashCreditsToShow.map((credit) => (
            <CreditRow
              key={`${credit.title}-${credit.amount}-${credit.statusText}`}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {specialOffersToShow.map((offer) => (
            <SpecialOfferCard
              key={`${offer.title}-${offer.amount}-${offer.expiredText ?? ""}`}
              title={offer.title}
              subtitle={offer.subtitle}
              amount={offer.amount}
              expiredText={offer.expiredText}
              showAlert={offer.showAlert}
            />
          ))}
        </div>
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

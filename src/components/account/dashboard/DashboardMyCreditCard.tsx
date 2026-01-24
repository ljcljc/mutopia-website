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
      className={`rounded-[12px] border border-[#E5E7EB] p-[12px] flex items-center justify-between ${
        faded ? "bg-[#F3F4F6]" : "bg-white"
      }`}
    >
      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
          {title}
        </p>
        <div className="flex items-center gap-[6px] mt-[2px]">
          <span className={`text-[10px] leading-[14px] font-['Comfortaa:Regular',sans-serif] ${statusColor}`}>
            {statusText}
          </span>
          <span className={`size-[6px] rounded-full ${dotColor}`} />
        </div>
      </div>
      <div className="text-right">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[16px] leading-[21px] text-[#DE6A07]">
          {amount}
        </p>
        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[14px] text-[#4A5565]">
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
    <div className="border border-[#E5E7EB] rounded-[12px] p-[12px] flex items-center justify-between">
      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
          {title}
        </p>
        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[14px] text-[#4A5565]">
          {subtitle}
        </p>
        {expiredText && (
          <div className="flex items-center gap-[6px] mt-[2px]">
            <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#DE6A07]">
              {expiredText}
            </span>
            {showAlert ? <Icon name="alert-error" size={12} className="text-[#DE6A07]" /> : null}
          </div>
        )}
      </div>
      <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[16px] leading-[21px] text-[#DE6A07]">
        {amount}
      </p>
    </div>
  );
}

export default function DashboardMyCreditCard() {
  return (
    <div className="bg-white rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[20px]">
      <div className="flex items-center justify-between mb-[12px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[16px] leading-[24px] text-[#4A3C2A]">
          My credit
        </p>
        <button
          type="button"
          className="border border-[#DE6A07] rounded-full px-[12px] py-[4px] font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#DE6A07]"
        >
          Book with credit
        </button>
      </div>

      <div className="mb-[16px]">
        <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565] mb-[6px]">
          Add promo code
        </p>
        <div className="flex items-center gap-[8px]">
          <input
            className="flex-1 border border-[#E5E7EB] rounded-[10px] px-[10px] py-[6px] font-['Comfortaa:Regular',sans-serif] text-[12.25px] leading-[17.5px] text-[#4A5565]"
            placeholder="Enter your code"
          />
          <button
            type="button"
            className="bg-[#8B6357] rounded-[10px] px-[16px] py-[6px] font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-white"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="mb-[12px]">
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#DE6A07] mb-[8px]">
          Cash credit
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          <CreditRow
            title="Cash credit"
            amount="$5"
            subtitle=""
            statusText="Expired at 2026.03.26"
            statusColor="text-[#DE6A07]"
            dotColor="bg-[#DE6A07]"
          />
          <CreditRow
            title="Invite credit"
            amount="2 x $5"
            subtitle=""
            statusText="Pending"
            statusColor="text-[#4A5565]"
            dotColor="bg-[#2563EB]"
            faded
          />
        </div>
      </div>

      <button type="button" className="flex items-center gap-[6px] text-[#4A5565] text-[10px] leading-[14px] font-['Comfortaa:Regular',sans-serif] mb-[16px]">
        Show all cash credits
        <Icon name="chevron-down" size={12} className="text-[#4A5565]" />
      </button>

      <div>
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#DE6A07] mb-[8px]">
          Special offer
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          <SpecialOfferCard
            title="Mother's day"
            subtitle="De-shedding treatment"
            amount="$5"
            expiredText="Expired at 2026.03.26"
            showAlert
          />
          <SpecialOfferCard
            title="Birthday treat"
            subtitle="Paw Treatment"
            amount="$10"
            expiredText="Expired at 2026.05.05"
          />
        </div>
      </div>
    </div>
  );
}

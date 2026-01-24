const giftIcon = "https://www.figma.com/api/mcp/asset/af894b8b-6be2-4e1b-8e56-de6e8b456840";
const codeIcon = "https://www.figma.com/api/mcp/asset/cf303528-2395-4812-a63f-031eee85eb80";

export default function DashboardShareAndEarnCard() {
  return (
    <div className="bg-white border-2 border-[#DE6A07] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[22px] flex flex-col gap-[28px] w-full">
      <div className="flex items-center gap-[8px]">
        <img alt="" className="size-[24px]" src={giftIcon} />
        <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[15.75px] leading-[24.5px] text-[#4A3C2A]">
          Share & Earn
        </p>
      </div>

      <div className="pl-[27px] flex flex-col gap-[24px] text-[#4A5565]">
        <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px] whitespace-pre-wrap">
          Invite a friend to book our service and you'll both get {""}
          <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[#DE6A07]">
            $10.00 (2x$5.00) Credit
          </span>
          .
        </p>
        <p className="font-['Comfortaa:Regular',sans-serif] text-[14px] leading-[22.75px]">
          Copy your unique code below to your friend and enjoy the credit in 3 months.
        </p>
      </div>

      <div className="border border-[#8B6357] rounded-[12px] h-[38px] px-[11.5px] flex items-center justify-between">
        <div className="flex items-center gap-[7px]">
          <img alt="" className="size-[16px]" src={codeIcon} />
          <span className="font-['Comfortaa:Medium',sans-serif] font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
            LEIBI41
          </span>
        </div>
        <button
          type="button"
          className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#DE6A07]"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

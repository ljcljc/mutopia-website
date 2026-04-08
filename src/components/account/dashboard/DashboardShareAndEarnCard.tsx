const giftIcon = "https://www.figma.com/api/mcp/asset/af894b8b-6be2-4e1b-8e56-de6e8b456840";
const codeIcon = "https://www.figma.com/api/mcp/asset/cf303528-2395-4812-a63f-031eee85eb80";

export default function DashboardShareAndEarnCard() {
  return (
    <div className="flex w-full flex-col gap-7 rounded-xl border-2 border-[#DE6A07] bg-white p-[22px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2">
        <img alt="" className="size-6" src={giftIcon} />
        <p className="font-comfortaa font-medium text-[15.75px] leading-[24.5px] text-[#4A3C2A]">
          Share & Earn
        </p>
      </div>

      <div className="flex flex-col gap-6 pl-[27px] text-[#4A5565]">
        <p className="font-comfortaa text-[14px] leading-[22.75px] whitespace-pre-wrap">
          Invite a friend to book our service and you'll both get {""}
          <span className="font-comfortaa font-bold text-[#DE6A07]">
            $10.00 (2x$5.00) Credit
          </span>
          .
        </p>
        <p className="font-comfortaa text-[14px] leading-[22.75px]">
          Copy your unique code below to your friend and enjoy the credit in 3 months.
        </p>
      </div>

      <div className="flex h-[38px] items-center justify-between rounded-xl border border-[#8B6357] px-[11.5px]">
        <div className="flex items-center gap-[7px]">
          <img alt="" className="size-4" src={codeIcon} />
          <span className="font-comfortaa font-medium text-[12.25px] leading-[17.5px] text-[#4A3C2A]">
            LEIBI41
          </span>
        </div>
        <button
          type="button"
          className="font-comfortaa font-normal text-[14px] leading-[22.75px] text-[#DE6A07]"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

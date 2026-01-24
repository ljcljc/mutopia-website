const membershipIcon = "https://www.figma.com/api/mcp/asset/5d7a0617-415b-4078-a801-621b746d2a11";
const listIconPrimary = "https://www.figma.com/api/mcp/asset/3d3c2dbb-b292-4665-aa10-4dc75caaba77";
const listIconSecondary = "https://www.figma.com/api/mcp/asset/e1d2176e-9c70-442a-a2e9-30e2ebacf4e8";
const listIconTertiary = "https://www.figma.com/api/mcp/asset/edc24f0a-837e-4648-9363-ea40477326cc";
const listIconQuaternary = "https://www.figma.com/api/mcp/asset/a94a8918-202b-4671-84ed-aa77fa9c6d4e";
const buttonArrow = "https://www.figma.com/api/mcp/asset/3995be5f-4662-44bb-9fe2-cf745a3c173d";

const benefits = [
  { icon: listIconPrimary, text: "30$ instant cash coupons", highlight: true },
  { icon: listIconPrimary, text: "10% off additional services", highlight: false },
  { icon: listIconSecondary, text: "Priority booking within 3 days", highlight: false },
  { icon: listIconTertiary, text: "Free teeth brushing", highlight: false },
  { icon: listIconPrimary, text: "Free anal gland expression", highlight: false },
  { icon: listIconQuaternary, text: "Grooming photo updates", highlight: false },
];

export default function DashboardMembershipCard() {
  return (
    <div className="bg-white border-2 border-[#754387] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] p-[22px] flex flex-col gap-[28px] w-full">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <img alt="" className="h-[24px] w-[21px]" src={membershipIcon} />
          <p className="font-['Comfortaa:Medium',sans-serif] font-medium text-[15.75px] leading-[24.5px] text-[#4A3C2A]">
            Membership
          </p>
        </div>
        <div className="flex items-center justify-center">
          <span className="bg-[#DCFCE7] rounded-[12px] px-[16px] py-[4px] font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#016630]">
            Save up to 50%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        {benefits.map((benefit) => (
          <div key={benefit.text} className="flex items-center gap-[12px]">
            <img alt="" className="size-[16.8px]" src={benefit.icon} />
            <p
              className={`font-['Comfortaa:Bold',sans-serif] font-bold text-[12.25px] leading-[17.5px] ${
                benefit.highlight ? "text-[#DE6A07]" : "text-[#364153]"
              }`}
            >
              {benefit.text}
            </p>
          </div>
        ))}
      </div>

      <div className="px-[24px]">
        <button
          type="button"
          className="w-full bg-[#633479] rounded-[32px] h-[36px] flex items-center justify-center gap-[4px]"
        >
          <span className="font-['Comfortaa:Medium',sans-serif] font-medium text-[14px] leading-[17.5px] text-white">
            Go premium
          </span>
          <img alt="" className="size-[14px]" src={buttonArrow} />
        </button>
      </div>
    </div>
  );
}

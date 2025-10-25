import svgPaths from "./svg-1llqn9nffi";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="url(#paint0_linear_14_193)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="url(#paint1_linear_14_193)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_14_193" x1="2.91668" x2="3.15796" y1="7" y2="8.97046">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_14_193" x1="7" x2="13.5333" y1="2.9166" y2="6.18326">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5px] items-center relative">
        <p className="bg-clip-text font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre" style={{ WebkitTextFillColor: "transparent" }}>
          Book Now
        </p>
        <Icon />
      </div>
    </div>
  );
}

export default function ButtonCompactPrincipalOrange() {
  return (
    <div className="bg-[rgba(139,99,87,0.8)] relative rounded-[32px] size-full" data-name="Button compact principal_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#2374ff] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[30px] py-[18px] relative size-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}
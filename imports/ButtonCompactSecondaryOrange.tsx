import svgPaths from "./svg-p4cu9qs3qo";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="var(--stroke-0, #8B6357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="var(--stroke-0, #8B6357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px] text-nowrap whitespace-pre">Book Now</p>
        <Icon />
      </div>
    </div>
  );
}

export default function ButtonCompactSecondaryOrange() {
  return (
    <div className="bg-[rgba(139,99,87,0.2)] relative rounded-[32px] size-full" data-name="Button compact secondary_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#2374ff] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[30px] py-[18px] relative size-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}
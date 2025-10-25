import svgPaths from "./svg-1l4mtpqhh5";

function Checkbox() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Checkbox">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Checkbox">
          <path d="M15.5 0.5V15.5H0.5V0.5H15.5Z" fill="var(--fill-0, #DE6A07)" />
          <path d="M15.5 0.5V15.5H0.5V0.5H15.5Z" stroke="var(--stroke-0, #DE6A07)" />
          <path d={svgPaths.p30de4580} id="Vector 1" stroke="url(#paint0_linear_14_1244)" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_14_1244" x1="2" x2="8.8634" y1="4.25" y2="14.7739">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[86px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[86px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12px] text-nowrap top-[-0.5px] whitespace-pre">Remember me</p>
      </div>
    </div>
  );
}

export default function Label() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full" data-name="Label">
      <Checkbox />
      <Text />
    </div>
  );
}
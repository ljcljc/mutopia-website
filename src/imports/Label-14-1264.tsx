import svgPaths from "./svg-f3aiinaf4t";

function Checkbox() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Checkbox">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Checkbox">
          <rect fill="#2374FF" height="16" width="16" />
          <path d={svgPaths.p30de4580} id="Vector 1" stroke="url(#paint0_linear_14_1271)" strokeWidth="2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_14_1271" x1="2" x2="8.8634" y1="4.25" y2="14.7739">
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
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-full">
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
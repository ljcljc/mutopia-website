import svgPaths from "./svg-pvvyz0d5lt";

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px] text-nowrap whitespace-pre">Password</p>
    </div>
  );
}

function Visible() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Visible">
      <div className="absolute inset-[-2.95%_-5.61%_-2.95%_-5.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 26">
          <g id="Visible">
            <g id="Group 66">
              <path d={svgPaths.p38f0d500} id="Vector 2" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
              <circle cx="13.2152" cy="12.7071" id="Ellipse 2" r="2.94491" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
            </g>
            <path d={svgPaths.p2edf6040} id="Vector 3" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your password</p>
      <Visible />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
          <Frame5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Alert() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d={svgPaths.p26090d00} fill="url(#paint0_linear_17_1949)" id="X" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_17_1949" x1="3" x2="9" y1="3" y2="9">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">Password strength: weak</p>
    </div>
  );
}

function Alert1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d={svgPaths.p26090d00} fill="url(#paint0_linear_17_1949)" id="X" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_17_1949" x1="3" x2="9" y1="3" y2="9">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert1 />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">At least 8 characters</p>
    </div>
  );
}

function Alert2() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d={svgPaths.p26090d00} fill="url(#paint0_linear_17_1949)" id="X" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_17_1949" x1="3" x2="9" y1="3" y2="9">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert2 />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">Contains a number or symbol</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <Frame7 />
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Input />
      <Frame11 />
    </div>
  );
}

export default function InputDefault() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full" data-name="Input_default">
      <PrimitiveLabel />
      <Frame8 />
    </div>
  );
}
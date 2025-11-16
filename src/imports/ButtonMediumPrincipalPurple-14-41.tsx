import svgPaths from "./svg-utjpzrrfgu";

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="var(--stroke-0, #633479)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="var(--stroke-0, #633479)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] relative shrink-0 text-[#633479] text-[14px] text-nowrap whitespace-pre">Book Appointment</p>
        <Icon />
      </div>
    </div>
  );
}

export default function ButtonMediumPrincipalPurple() {
  return (
    <div className="bg-neutral-100 relative rounded-[32px] size-full" data-name="Button medium principal_purple">
      <div aria-hidden="true" className="absolute border-2 border-[#633479] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[30px] py-[18px] relative size-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}
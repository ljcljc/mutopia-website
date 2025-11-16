function Faq() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[227.938px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[227.938px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12px] text-nowrap top-[-0.5px] whitespace-pre">How does mobile grooming work?</p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #2374FF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq />
      <Icon />
    </div>
  );
}

export default function Accordion() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative rounded-[16px] size-full" data-name="Accordion">
      <div aria-hidden="true" className="absolute border border-[#2374ff] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[24px] py-0 relative size-full">
          <PrimitiveButton />
        </div>
      </div>
    </div>
  );
}
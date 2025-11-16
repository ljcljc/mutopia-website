function Button() {
  return (
    <div className="h-[48px] relative rounded-[1.67772e+07px] shrink-0 w-[170px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#de6a07] border-solid inset-0 pointer-events-none rounded-[1.67772e+07px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[48px] items-center justify-center px-[30px] py-[16px] relative w-[170px]">
        <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[24.5px] relative shrink-0 text-[#de6a07] text-[16px] text-nowrap whitespace-pre">View Services</p>
      </div>
    </div>
  );
}

export default function ButtonStandardSecondaryOrange() {
  return (
    <div className="content-stretch flex gap-[14px] items-start relative rounded-[32px] size-full" data-name="Button standard secondary_orange">
      <Button />
    </div>
  );
}
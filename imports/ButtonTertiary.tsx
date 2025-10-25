export default function ButtonTertiary() {
  return (
    <div className="relative rounded-[12px] size-full" data-name="Button tertiary">
      <div aria-hidden="true" className="absolute border border-[#2374ff] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[12px] text-nowrap whitespace-pre">Forgot password</p>
        </div>
      </div>
    </div>
  );
}
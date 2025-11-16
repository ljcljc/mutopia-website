function Checkbox() {
  return (
    <div className="bg-[#2374ff] relative shrink-0 size-[16px]" data-name="Checkbox">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
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
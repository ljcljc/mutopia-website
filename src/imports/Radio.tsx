function Frame20() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Frame 20">
          <rect fill="var(--fill-0, #2374FF)" height="15" rx="7.5" width="15" x="0.5" y="0.5" />
          <rect height="15" rx="7.5" stroke="var(--stroke-0, #717182)" width="15" x="0.5" y="0.5" />
          <circle cx="8" cy="8" fill="var(--fill-0, #DE6A07)" id="Ellipse 5" r="4" />
        </g>
      </svg>
    </div>
  );
}

export default function Radio() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full" data-name="Radio">
      <Frame20 />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px] text-nowrap whitespace-pre">Remember me</p>
    </div>
  );
}
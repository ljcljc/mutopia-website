const imgIcon = "/images/logo.png";

function Icon() {
  return (
    <div className="h-[39px] relative shrink-0 w-[35px]" data-name="Icon">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIcon} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] w-[35px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[34.996px] relative shrink-0 w-[138.304px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.495px] h-[34.996px] items-center relative w-[138.304px]">
        <Icon />
        <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] relative shrink-0 text-[#8b6357] text-[21px] text-nowrap whitespace-pre">Mutopia pet</p>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="h-[23.994px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M12.9972 1L1 12.9972" id="Vector" stroke="var(--stroke-0, #8B6357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99953" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <path d="M1 1L12.9972 12.9972" id="Vector" stroke="var(--stroke-0, #8B6357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99953" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0 size-[23.994px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative size-[23.994px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[62.984px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[62.984px] items-center justify-between pb-px pt-0 px-0 relative w-full">
          <Container />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <div className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[48px] justify-center leading-[0] left-[182.5px] text-[#4a3c2a] text-[14px] text-center top-[24px] translate-x-[-50%] translate-y-[-50%] w-[365px]">
        <p className="leading-[21px]">Services</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <div className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[42px] justify-center leading-[0] left-[182.5px] text-[#4a3c2a] text-[14px] text-center top-[21px] translate-x-[-50%] translate-y-[-50%] w-[365px]">
        <p className="leading-[21px]">Packages</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <div className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[48px] justify-center leading-[0] left-[182.5px] text-[#4a3c2a] text-[14px] text-center top-[24px] translate-x-[-50%] translate-y-[-50%] w-[365px]">
        <p className="leading-[21px]">Why Us</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <div className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[48px] justify-center leading-[0] left-[182.5px] text-[#4a3c2a] text-[14px] text-center top-[24px] translate-x-[-50%] translate-y-[-50%] w-[365px]">
        <p className="leading-[21px]">FAQ</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <div className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[48px] justify-center leading-[0] left-[182.5px] text-[#4a3c2a] text-[14px] text-center top-[24px] translate-x-[-50%] translate-y-[-50%] w-[365px]">
        <p className="leading-[21px]">Contact</p>
      </div>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#f8f7f1] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[0.737px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2.47134e+07px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[11.237px] py-[0.737px] relative w-full">
          <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] text-nowrap whitespace-pre">Apply to Groomer</p>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#8b6357] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[10.5px] py-0 relative w-full">
          <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12.25px] text-nowrap text-white whitespace-pre">Login / Sign Up</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[20px] items-start pb-0 pt-[13.994px] px-0 relative shrink-0 w-full" data-name="Container">
      <Button1 />
      <Button2 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[0.02px] w-[353px]">
      <Frame74 />
      <Container2 />
    </div>
  );
}

function Navigation() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Navigation">
      <Frame75 />
    </div>
  );
}

export default function Header() {
  return (
    <div className="bg-[rgba(255,255,255,0.95)] relative rounded-bl-[21px] rounded-br-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-full" data-name="Header">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[20px] pt-0 px-[20px] relative size-full">
          <Container1 />
          <Navigation />
        </div>
      </div>
    </div>
  );
}

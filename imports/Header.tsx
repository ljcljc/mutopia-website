import imgIcon from "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&crop=center";

function Icon() {
  return (
    <div className="h-[39px] relative shrink-0 w-[35px]" data-name="Icon">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIcon} />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] w-[35px]" />
    </div>
  );
}

function Mutopia() {
  return (
    <div className="h-[28px] relative shrink-0 w-[92.82px]" data-name="Mutopia">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[92.82px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] left-0 text-[#8b6357] text-[21px] text-nowrap top-[-1px] whitespace-pre">Mutopia pet</p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="basis-0 grow h-[35px] min-h-px min-w-px relative shrink-0" data-name="Logo">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[35px] items-center relative w-full">
        <Icon />
        <Mutopia />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[21px] relative shrink-0 w-[53.398px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[53.398px]">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Why Us</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[60.539px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[60.539px]">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Services</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-[68.508px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative w-[68.508px]">
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[#4a3c2a] text-[14px] w-[92px]">Membership</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[29.531px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[29.531px]">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">FAQ</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[58.219px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[58.219px]">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Contact</p>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="h-[21px] relative shrink-0" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[28px] h-[21px] items-center relative">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px] text-nowrap whitespace-pre">Apply as groomer</p>
      </div>
    </div>
  );
}

function ButtonCompactSecondaryOrange() {
  return (
    <div className="h-[28px] relative rounded-[32px] shrink-0 w-[132px]" data-name="Button compact secondary_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#8b6357] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[28px] items-center justify-center px-[30px] py-[18px] relative w-[132px]">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5px] items-center relative">
        <p className="bg-clip-text font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre" style={{ WebkitTextFillColor: "transparent" }}>
          Log in/sign up
        </p>
      </div>
    </div>
  );
}

function ButtonCompactPrincipalOrange() {
  return (
    <div className="bg-[#8b6357] h-[28px] relative rounded-[32px] shrink-0" data-name="Button compact principal_orange">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[28px] items-center justify-center px-[12px] py-[16px] relative">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <div className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0" data-name="Buttons">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[28px] items-center justify-end relative w-full">
        <ButtonCompactSecondaryOrange />
        <ButtonCompactPrincipalOrange />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[63px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[63px] items-center justify-between pl-0 pr-[0.008px] py-0 relative w-full">
          <Logo />
          <Navigation />
          <Buttons />
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <div className="bg-[rgba(255,255,255,0.95)] relative rounded-bl-[21px] rounded-br-[21px] size-full" data-name="Header">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[21px] rounded-br-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <div className="min-w-inherit size-full">
        <div className="box-border content-stretch flex flex-col items-start min-w-inherit pb-px pt-0 px-[57.5px] relative size-full">
          <Container />
        </div>
      </div>
    </div>
  );
}
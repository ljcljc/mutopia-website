import svgPaths from "./svg-w2x3orw39j";
const imgImageWithFallback = "/images/grooming-hero.png";
const imgIcon = "/images/logo.png";

function Container() {
  return (
    <div className="content-stretch flex flex-col font-['Comfortaa:Bold',_sans-serif] font-bold items-start leading-[65.625px] relative shrink-0 text-[56px] text-nowrap whitespace-pre" data-name="Container">
      <p className="relative shrink-0 text-[#8b6357]">
        Premium
        <br aria-hidden="true" />
        Pet Grooming
      </p>
      <p className="relative shrink-0 text-[#de6a07]">Made Simple</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[21px] relative shrink-0 w-[98.352px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[98.352px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[14px] text-[rgba(74,60,42,0.8)] text-nowrap top-[0.5px] whitespace-pre">Easy booking</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0" data-name="Container">
      <Icon />
      <Text />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pda9d200} id="Vector" stroke="var(--stroke-0, #8B6357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[83.164px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[83.164px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[14px] text-[rgba(74,60,42,0.8)] text-nowrap top-[0.5px] whitespace-pre">Pet-friendly</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0" data-name="Container">
      <Icon1 />
      <Text1 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.pa6d0980} id="Vector" stroke="var(--stroke-0, #F0B100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[21px] relative shrink-0 w-[144.234px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[144.234px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[14px] text-[rgba(74,60,42,0.8)] text-nowrap top-[0.5px] whitespace-pre">Professional service</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[7px] items-center relative shrink-0" data-name="Container">
      <Icon2 />
      <Text2 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-start flex flex-wrap gap-[24px] items-start relative shrink-0">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Container />
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[16px] text-[rgba(74,60,42,0.7)] w-[489px]">Transform your furry friend with our professional grooming services. Book online, relax at home, and let our certified groomers come to you.</p>
      <Frame78 />
    </div>
  );
}

function ButtonStandardPrincipalOrange() {
  return (
    <div className="bg-[#de6a07] h-[48px] relative rounded-[32px] shrink-0 w-[209px]" data-name="Button standard principal_orange">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[48px] items-center justify-center px-[28px] py-[14px] relative w-[209px]">
        <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[24.5px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Book Appointment</p>
      </div>
    </div>
  );
}

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

function ButtonStandardSecondaryOrange() {
  return (
    <div className="relative rounded-[32px] shrink-0" data-name="Button standard secondary_orange">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[14px] items-start relative">
        <Button />
      </div>
    </div>
  );
}

function ContainerButtons() {
  return (
    <div className="content-stretch flex gap-[14px] items-start relative shrink-0" data-name="Container_buttons">
      <ButtonStandardPrincipalOrange />
      <ButtonStandardSecondaryOrange />
    </div>
  );
}

function Left() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0" data-name="Left">
      <Frame1 />
      <ContainerButtons />
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="relative size-full" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Kv() {
  return (
    <div className="absolute h-[499.182px] left-[80.98px] top-[-8.32px] w-[360.779px]" data-name="KV">
      <div className="absolute flex inset-[-2.4%_-4.7%] items-center justify-center">
        <div className="flex-none h-[499.182px] rotate-[4deg] w-[360.779px]">
          <ImageWithFallback />
        </div>
      </div>
    </div>
  );
}

function RightImage() {
  return (
    <div className="h-[482.258px] relative shrink-0 w-[497px]" data-name="Right_Image">
      <Kv />
    </div>
  );
}

function Container4() {
  return (
    <div className="box-border content-start flex flex-wrap gap-[78px] items-start justify-between mb-[-72px] relative shrink-0 w-[1064px] z-[2]" data-name="Container">
      <Left />
      <RightImage />
    </div>
  );
}

function Hero() {
  return (
    <div className="absolute box-border content-stretch flex flex-col isolate items-center left-[-748px] pb-[72px] pt-0 px-0 top-[124px]" data-name="Hero">
      <Container4 />
      <div className="flex items-center justify-center mb-[-72px] relative shrink-0 z-[1]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[139px] relative w-[2674px]">
            <div className="absolute bottom-[-0.14%] left-0 right-[-0.01%] top-[-0.18%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2676 141">
                <g id="Vector 1">
                  <path d={svgPaths.p30823500} fill="var(--fill-0, white)" />
                  <path d={svgPaths.p7eb59f0} fill="var(--stroke-0, white)" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
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
        <Icon3 />
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

function Container5() {
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

function Header() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] box-border content-stretch flex flex-col h-[64px] items-start left-0 min-w-[972px] pb-px pt-0 px-[57.5px] rounded-bl-[21px] rounded-br-[21px] top-0 w-[1179px]" data-name="Header">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-bl-[21px] rounded-br-[21px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
      <Container5 />
    </div>
  );
}

export default function Hero1() {
  return (
    <div className="relative size-full" data-name="Hero">
      <Hero />
      <Header />
      <div className="absolute left-[818px] mix-blend-lighten size-[109px] top-[69px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 109 109">
          <g id="Ellipse 1" opacity="0.6" style={{ mixBlendMode: "lighten" }}>
            <circle cx="54.5" cy="54.5" fill="url(#paint0_radial_6_718)" fillOpacity="0.8" r="54.5" />
          </g>
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(54.5 54.5) rotate(90) scale(54.5)" gradientUnits="userSpaceOnUse" id="paint0_radial_6_718" r="1">
              <stop stopColor="white" stopOpacity="0.8" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

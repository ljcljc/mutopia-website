import svgPaths from "./svg-dgzzpqtwle";
import imgImageWithFallback from "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&crop=center";

function Why() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[236px] items-center relative shrink-0 text-center w-full" data-name="Why">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[40px] relative shrink-0 text-[32px] text-[rgba(99,52,121,0.8)] w-full">Why Choose Mutopia?</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[16px] text-[rgba(74,60,42,0.7)] w-full">
        {`We're not just another grooming service. We're pet care specialists who understand that`}
        <br aria-hidden="true" />
        your furry family members deserve the very best.
      </p>
    </div>
  );
}

function ImageWithFallback() {
  return (
    <div className="h-[324px] relative shrink-0 w-[393px]" data-name="ImageWithFallback">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImageWithFallback} />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col h-[324px] items-start left-[2px] overflow-clip rounded-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[-9px]" data-name="Container">
      <ImageWithFallback />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre" data-name="Container">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] relative shrink-0 text-[20px]">100%</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">Verified groomer</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre" data-name="Container">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] relative shrink-0 text-[20px]">Quick</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">Availability</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre" data-name="Container">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] relative shrink-0 text-[20px]">Premium</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">Service</p>
    </div>
  );
}

function Frame85() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-center flex flex-wrap gap-[20px] items-center justify-between px-[36px] py-0 relative w-full">
          <Container1 />
          <Container2 />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute bg-[rgba(99,52,121,0.78)] box-border content-stretch flex flex-col items-start left-[2px] p-[12px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[279px] w-[393px]" data-name="Container">
      <Frame85 />
    </div>
  );
}

function Container5() {
  return (
    <div className="[grid-area:1_/_1] h-[349px] ml-0 mt-0 relative w-[393px]" data-name="Container">
      <Container />
      <Container4 />
    </div>
  );
}

function Img() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Img">
      <Container5 />
      <div className="[grid-area:1_/_1] h-[40px] ml-[331px] mt-[17px] relative w-[46px]" data-name="Vector">
        <div className="absolute inset-[-7.5%_-6.52%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 52 46">
            <path d={svgPaths.p2a986c80} id="Vector" stroke="var(--stroke-0, #633479)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p3f3d8e00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(222,106,7,0.8)] relative rounded-[12px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[21px] relative shrink-0 w-[163.57px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[163.57px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Certified Professionals</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[10.5px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Heading3 />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[68.25px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-[116.5px] text-[14px] text-[rgba(74,60,42,0.7)] text-center top-0 translate-x-[-50%] w-[233px]">All our groomers are certified, insured, and background-checked for your peace of mind.</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Paragraph />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 6V12L16 14" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.pace200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[rgba(222,106,7,0.8)] relative rounded-[12px] shrink-0 size-[42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[21px] relative shrink-0 w-[168.898px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[168.898px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Convenient Scheduling</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[10.5px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Heading4 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[68.25px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-[114.5px] text-[14px] text-[rgba(74,60,42,0.7)] text-center top-0 translate-x-[-50%] w-[229px]">Book appointments online 24/7. We work around your schedule, not the other way around.</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Paragraph1 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-[238px]">
      <Container8 />
      <Container11 />
    </div>
  );
}

function Frame87() {
  return (
    <div className="box-border content-stretch flex gap-[36px] items-center px-[36px] py-0 relative shrink-0">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <div className="h-[36px] relative w-[16px]" data-name="Left">
            <div className="absolute inset-[-1.85%_-2.03%_-1.85%_-4.67%]" style={{ "--stroke-0": "rgba(222, 106, 7, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 38">
                <path d={svgPaths.p1c380980} id="Left" stroke="var(--stroke-0, #DE6A07)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame86 />
      <div className="h-[36px] relative shrink-0 w-[16px]" data-name="Right">
        <div className="absolute inset-[-1.85%_-2.03%_-1.85%_-4.67%]" style={{ "--stroke-0": "rgba(222, 106, 7, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 38">
            <path d={svgPaths.p1c380980} id="Right" stroke="var(--stroke-0, #DE6A07)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-start flex flex-wrap gap-[28px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Frame87 />
    </div>
  );
}

function Content() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-center relative shrink-0" data-name="Content">
      <Img />
      <Container12 />
    </div>
  );
}

function Title() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[28px] h-[236px] items-center left-[30px] px-[28px] py-0 top-[28px] w-[329px]" data-name="Title">
      <Why />
      <Content />
    </div>
  );
}

export default function WhyUs() {
  return (
    <div className="bg-white relative size-full" data-name="WhyUs">
      <Title />
    </div>
  );
}
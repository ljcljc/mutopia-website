import svgPaths from "./svg-68mxca64pe";

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 text-center w-full" data-name="Container">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[40px] min-w-full relative shrink-0 text-[#4a3c2a] text-[32px] w-[min-content]">Frequently Asked Questions</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[16px] text-[rgba(74,60,42,0.7)] w-[265px]">Everything you need to know about our services and how we care for your pets.</p>
    </div>
  );
}

function IconOutlineLayer() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="icon/outline/layer">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon/outline/layer">
          <path d={svgPaths.p1bff4f80} id="Vector" stroke="var(--stroke-0, #6B6B6B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function IconText() {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Icon+text">
      <IconOutlineLayer />
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[12.25px] text-nowrap whitespace-pre">Type to search</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <IconText />
      <div className="h-[6.375px] relative shrink-0 w-[11.25px]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7">
          <path clipRule="evenodd" d={svgPaths.p18f01300} fill="var(--fill-0, #111113)" fillRule="evenodd" id="Union" />
        </svg>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[348px]" data-name="Input">
      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-[348px]">
        <Frame25 />
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="box-border content-stretch flex items-start justify-between px-0 py-[20px] relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] text-nowrap whitespace-pre">
        What happens if I need to cancel or
        <br aria-hidden="true" />
        reschedule?
      </p>
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start px-[22px] py-px relative w-full">
          <PrimitiveButton />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[20px] items-center px-[28px] py-0 relative w-full">
          <Container />
          <Input />
          {[...Array(3).keys()].map((_, i) => (
            <Container1 key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="bg-clip-text font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre" style={{ WebkitTextFillColor: "transparent" }}>
        Name
      </p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your name</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
          <Frame5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function InputDefault() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[348px]" data-name="Input_default">
      <PrimitiveLabel />
      <Input1 />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="bg-clip-text font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre" style={{ WebkitTextFillColor: "transparent" }}>
        Email
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your email</p>
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
          <Frame6 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function InputDefault1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[348px]" data-name="Input_default">
      <PrimitiveLabel1 />
      <Input2 />
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Message</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your message</p>
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-white h-[120px] max-h-[120px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="max-h-inherit overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[120px] items-start max-h-inherit px-[16px] py-[12px] relative w-full">
          <Frame7 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function TextZoneDefault() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[349px]" data-name="Text zone_default">
      <PrimitiveLabel2 />
      <Input3 />
    </div>
  );
}

function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="Text">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[normal] min-w-full relative shrink-0 text-[24px] text-center text-white w-[min-content]">Contact us for more details</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] min-w-full relative shrink-0 text-[14px] text-[rgba(255,255,255,0.9)] text-center w-[min-content]">Our friendly customer service team is here to help you and your pet.</p>
      <InputDefault />
      <InputDefault1 />
      <TextZoneDefault />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] relative shrink-0 text-[#633479] text-[14px] text-nowrap whitespace-pre">Submit</p>
      </div>
    </div>
  );
}

function ButtonMediumPrincipalPurple() {
  return (
    <div className="bg-neutral-100 box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[30px] py-[18px] relative rounded-[32px] shrink-0 w-[209px]" data-name="Button medium principal_purple">
      <div aria-hidden="true" className="absolute border-2 border-[#633479] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <Frame3 />
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 bg-[#633479] grow min-h-px min-w-px relative rounded-tl-[40px] rounded-tr-[40px] shrink-0" data-name="Content">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-center px-[80px] py-[36px] relative w-full">
          <Text />
          <ButtonMediumPrincipalPurple />
        </div>
      </div>
    </div>
  );
}

function Contactus() {
  return (
    <div className="content-start flex flex-wrap gap-0 items-start justify-center relative shrink-0 w-[393px]" data-name="Contactus">
      <Content />
    </div>
  );
}

export default function Frame90() {
  return (
    <div className="content-stretch flex flex-col gap-[60px] items-start relative size-full">
      <Container4 />
      <Contactus />
    </div>
  );
}
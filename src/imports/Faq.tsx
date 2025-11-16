function Heading2() {
  return (
    <div className="h-[35px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[40px] left-[364.84px] text-[#4a3c2a] text-[32px] text-center text-nowrap top-[-0.5px] translate-x-[-50%] whitespace-pre">Frequently Asked Questions</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] left-[364.28px] text-[16px] text-[rgba(74,60,42,0.7)] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Everything you need to know about our services and how we care for your pets.</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Paragraph />
    </div>
  );
}

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
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
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

function Accordion() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[60px] relative rounded-[16px] shrink-0 w-full" data-name="Accordion">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[60px] items-start px-[24px] py-0 relative w-full">
          <PrimitiveButton />
        </div>
      </div>
    </div>
  );
}

function Faq1() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[233.344px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[233.344px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">How far in advance should I book?</p>
      </div>
    </div>
  );
}

function Icon1() {
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

function PrimitiveButton1() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq1 />
      <Icon1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton1 />
        </div>
      </div>
    </div>
  );
}

function Faq2() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[269.148px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[269.148px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">What if my pet is anxious or aggressive?</p>
      </div>
    </div>
  );
}

function Icon2() {
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

function PrimitiveButton2() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq2 />
      <Icon2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton2 />
        </div>
      </div>
    </div>
  );
}

function Faq3() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[273.406px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[273.406px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">Are your groomers insured and bonded?</p>
      </div>
    </div>
  );
}

function Icon3() {
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

function PrimitiveButton3() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq3 />
      <Icon3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton3 />
        </div>
      </div>
    </div>
  );
}

function Faq4() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[196.867px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[196.867px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">What breeds do you service?</p>
      </div>
    </div>
  );
}

function Icon4() {
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

function PrimitiveButton4() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq4 />
      <Icon4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton4 />
        </div>
      </div>
    </div>
  );
}

function Faq5() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[284.906px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[284.906px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">{`What's included in a full grooming service?`}</p>
      </div>
    </div>
  );
}

function Icon5() {
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

function PrimitiveButton5() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq5 />
      <Icon5 />
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton5 />
        </div>
      </div>
    </div>
  );
}

function Faq6() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[311.484px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[311.484px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">Do you provide your own water and electricity?</p>
      </div>
    </div>
  );
}

function Icon6() {
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

function PrimitiveButton6() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq6 />
      <Icon6 />
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton6 />
        </div>
      </div>
    </div>
  );
}

function Faq7() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[321.43px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[321.43px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">What happens if I need to cancel or reschedule?</p>
      </div>
    </div>
  );
}

function Icon7() {
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

function PrimitiveButton7() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq7 />
      <Icon7 />
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton7 />
        </div>
      </div>
    </div>
  );
}

function Faq8() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[287.406px]" data-name="FAQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-[287.406px]">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">How do I become a groomer with Mutopia?</p>
      </div>
    </div>
  );
}

function Icon8() {
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

function PrimitiveButton8() {
  return (
    <div className="box-border content-stretch flex h-[59.5px] items-start justify-between pb-0 pt-[21px] px-0 relative rounded-[12px] shrink-0 w-full" data-name="Primitive.button">
      <Faq8 />
      <Icon8 />
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[rgba(255,255,255,0.8)] h-[61.5px] relative rounded-[21px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[21px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col h-[61.5px] items-start px-[22px] py-px relative w-full">
          <PrimitiveButton8 />
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Primitive.div">
      <Accordion />
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
      <Container6 />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Container9() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[56px] items-center px-[28px] py-0 relative shrink-0 w-[784px]" data-name="Container">
      <Container />
      <PrimitiveDiv />
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

function Input() {
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
      <Input />
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

function Input1() {
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
      <Input1 />
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

function Input2() {
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
      <Input2 />
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
    <div className="content-start flex flex-wrap gap-0 items-start justify-center relative shrink-0 w-[729px]" data-name="Contactus">
      <Content />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Container9 />
      <Contactus />
    </div>
  );
}

export default function Faq9() {
  return (
    <div className="bg-gradient-to-b box-border content-stretch flex flex-col from-[#ffffff] gap-[10px] items-center pb-0 pt-[60px] px-0 relative size-full to-[rgba(255,231,210,0.4)]" data-name="FAQ">
      <Frame17 />
    </div>
  );
}
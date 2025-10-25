import svgPaths from "./svg-3amxjuyfeu";

function Paragraph() {
  return (
    <div className="h-[49px] relative shrink-0 w-[672px]" data-name="Paragraph">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] left-[336.09px] text-[16px] text-[rgba(74,60,42,0.7)] text-center top-[0.5px] translate-x-[-50%] w-[622px]">From basic baths to full spa treatments, we offer everything your pet needs to look and feel their absolute best.</p>
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full" data-name="Title">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[40px] relative shrink-0 text-[#4a3c2a] text-[32px] text-center text-nowrap whitespace-pre">Our Premium Services</p>
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p17b96970} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p19c18f80} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Services() {
  return (
    <div className="bg-[rgba(222,106,7,0.1)] content-stretch flex items-center justify-center relative rounded-[21px] shrink-0 size-[56px]" data-name="Services">
      <Icon />
    </div>
  );
}

function CardTitle() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] left-[145.97px] text-[#4a3c2a] text-[16px] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">{`Bath & Brush`}</p>
    </div>
  );
}

function CardDescription() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-[145.13px] text-[14px] text-[rgba(74,60,42,0.7)] text-center top-[0.5px] translate-x-[-50%] w-[288px]">Refreshing bath with premium products and thorough brushing</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <CardTitle />
      <CardDescription />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Services />
      <Frame19 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_2034)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_2034">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-full">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-0 text-[12.25px] text-[rgba(74,60,42,0.6)] text-nowrap top-[-0.5px] whitespace-pre">1 hour</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[79.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[17.5px] items-center relative w-[79.609px]">
        <Icon1 />
        <Text />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-[83.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24.5px] relative w-[83.18px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[24.5px] left-0 text-[#de6a07] text-[0px] text-nowrap top-[-1px] whitespace-pre">
          <span className="text-[14px]">From</span>
          <span className="text-[17.5px]"> </span>
          <span className="text-[24px]">$65</span>
        </p>
      </div>
    </div>
  );
}

function Services1() {
  return (
    <div className="content-stretch flex h-[24.5px] items-center justify-between relative shrink-0 w-full" data-name="Services">
      <Container />
      <Text1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Includes:</p>
    </div>
  );
}

function Container1() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container1 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Premium shampoo</p>
    </div>
  );
}

function Container2() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem1() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container2 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Conditioning</p>
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem2() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container3 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Thorough brushing</p>
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem3() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container4 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Basic nail trim</p>
    </div>
  );
}

function Container5() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem4() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container5 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Ear check</p>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[3.5px] h-[101.5px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function Services2() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] h-[129.5px] items-start relative shrink-0 w-full" data-name="Services">
      <Heading4 />
      <List />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[276px]">
      <Services1 />
      <Services2 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Frame20 />
      <Frame21 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[14px] text-nowrap whitespace-pre">Book Now</p>
        <Icon2 />
      </div>
    </div>
  );
}

function ButtonMediumSecondaryOrange() {
  return (
    <div className="h-[36px] relative rounded-[32px] shrink-0 w-full" data-name="Button medium secondary_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#de6a07] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[30px] py-[18px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-[23px] top-[23px] w-[290px]">
      <Frame22 />
      <ButtonMediumSecondaryOrange />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white h-[466px] relative rounded-[21px] shrink-0 w-[336px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[21px]" />
      <Frame23 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p245eb100} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M10.8267 10.8267L16 16" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.pbcf2b00} id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.pc9a8c00} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p1eccb1c0} id="Vector_5" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Services3() {
  return (
    <div className="bg-[rgba(222,106,7,0.1)] content-stretch flex items-center justify-center relative rounded-[21px] shrink-0 size-[56px]" data-name="Services">
      <Icon3 />
    </div>
  );
}

function CardTitle1() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] left-[145.97px] text-[#4a3c2a] text-[16px] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Full Grooming</p>
    </div>
  );
}

function CardDescription1() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-[145.13px] text-[14px] text-[rgba(74,60,42,0.7)] text-center top-[0.5px] translate-x-[-50%] w-[288px]">Complete wash, cut, nail trim, and styling for your pet</p>
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <CardTitle1 />
      <CardDescription1 />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Services3 />
      <Frame24 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_2034)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_2034">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-full">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-0 text-[12.25px] text-[rgba(74,60,42,0.6)] text-nowrap top-[-0.5px] whitespace-pre">1.5-2 hours</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[79.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[17.5px] items-center relative w-[79.609px]">
        <Icon4 />
        <Text2 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-[83.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24.5px] relative w-[83.18px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[24.5px] left-0 text-[#de6a07] text-[0px] text-nowrap top-[-1px] whitespace-pre">
          <span className="text-[14px]">From</span>
          <span className="text-[17.5px]"> </span>
          <span className="text-[24px]">$95</span>
        </p>
      </div>
    </div>
  );
}

function Services4() {
  return (
    <div className="content-stretch flex h-[24.5px] items-center justify-between relative shrink-0 w-full" data-name="Services">
      <Container6 />
      <Text3 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Includes:</p>
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem5() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container7 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">{`Bath & dry`}</p>
    </div>
  );
}

function Container8() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem6() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container8 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">{`Haircut & styling`}</p>
    </div>
  );
}

function Container9() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem7() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container9 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Nail trimming</p>
    </div>
  );
}

function Container10() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem8() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container10 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Ear cleaning</p>
    </div>
  );
}

function Container11() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem9() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container11 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Teeth brushing</p>
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[3.5px] h-[101.5px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem5 />
      <ListItem6 />
      <ListItem7 />
      <ListItem8 />
      <ListItem9 />
    </div>
  );
}

function Services5() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] h-[129.5px] items-start relative shrink-0 w-full" data-name="Services">
      <Heading5 />
      <List1 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[276px]">
      <Services4 />
      <Services5 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Book Now</p>
        <Icon5 />
      </div>
    </div>
  );
}

function ButtonMediumPrincipalOrange() {
  return (
    <div className="bg-[#de6a07] h-[36px] relative rounded-[32px] shrink-0 w-full" data-name="Button medium principal_orange">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[28px] py-[16px] relative w-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-[23px] top-[23px] w-[290px]">
      <Frame27 />
      <ButtonMediumPrincipalOrange />
    </div>
  );
}

function Badge() {
  return (
    <div className="absolute bg-[#de6a07] box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center left-[24.5px] overflow-clip px-[16px] py-[4px] rounded-[12px] top-[-12px] w-[103px]" data-name="Badge">
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] relative shrink-0 text-[10px] text-nowrap text-white whitespace-pre">Most Popular</p>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white h-[466px] relative rounded-[21px] shrink-0 w-[336px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[21px]" />
      <Frame28 />
      <Badge />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d={svgPaths.p3bbcf900} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p332d6e00} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p36dcaf80} id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Services6() {
  return (
    <div className="bg-[rgba(222,106,7,0.1)] content-stretch flex items-center justify-center relative rounded-[21px] shrink-0 size-[56px]" data-name="Services">
      <Icon6 />
    </div>
  );
}

function CardTitle2() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-full" data-name="CardTitle">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] left-[145.97px] text-[#4a3c2a] text-[16px] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Express Groom</p>
    </div>
  );
}

function CardDescription2() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="CardDescription">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-[145.13px] text-[14px] text-[rgba(74,60,42,0.7)] text-center top-[0.5px] translate-x-[-50%] w-[288px]">Quick touch-up for pets who need a fast refresh</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <CardTitle2 />
      <CardDescription2 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Services6 />
      <Frame29 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_6_2034)" id="Icon">
          <path d="M8 4V8L10.6667 9.33333" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_6_2034">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 grow h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[17.5px] relative w-full">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-0 text-[12.25px] text-[rgba(74,60,42,0.6)] text-nowrap top-[-0.5px] whitespace-pre">1 hour</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-[79.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7px] h-[17.5px] items-center relative w-[79.609px]">
        <Icon7 />
        <Text4 />
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[24.5px] relative shrink-0 w-[83.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24.5px] relative w-[83.18px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[24.5px] left-0 text-[#de6a07] text-[0px] text-nowrap top-[-1px] whitespace-pre">
          <span className="text-[14px]">From</span>
          <span className="text-[17.5px]"> </span>
          <span className="text-[24px]">$75</span>
        </p>
      </div>
    </div>
  );
}

function Services7() {
  return (
    <div className="content-stretch flex h-[24.5px] items-center justify-between relative shrink-0 w-full" data-name="Services">
      <Container12 />
      <Text5 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Heading 4">
      <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Includes:</p>
    </div>
  );
}

function Container13() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem10() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container13 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">{`Quick wash & dry`}</p>
    </div>
  );
}

function Container14() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem11() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container14 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Brush out</p>
    </div>
  );
}

function Container15() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem12() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container15 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Nail trim</p>
    </div>
  );
}

function Container16() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem13() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container16 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">Sanitary trim</p>
    </div>
  );
}

function Container17() {
  return <div className="absolute bg-[#de6a07] left-0 rounded-[1.67772e+07px] size-[5.25px] top-[6.13px]" data-name="Container" />;
}

function ListItem14() {
  return (
    <div className="h-[17.5px] relative shrink-0 w-full" data-name="List Item">
      <Container17 />
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] text-nowrap top-[-0.5px] whitespace-pre">{`Face & feet groom`}</p>
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[3.5px] h-[101.5px] items-start relative shrink-0 w-full" data-name="List">
      <ListItem10 />
      <ListItem11 />
      <ListItem12 />
      <ListItem13 />
      <ListItem14 />
    </div>
  );
}

function Services8() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] h-[129.5px] items-start relative shrink-0 w-full" data-name="Services">
      <Heading6 />
      <List2 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[276px]">
      <Services7 />
      <Services8 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
      <Frame30 />
      <Frame31 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M2.91668 7H11.0833" id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pd880200} id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[14px] text-nowrap whitespace-pre">Book Now</p>
        <Icon8 />
      </div>
    </div>
  );
}

function ButtonMediumSecondaryOrange1() {
  return (
    <div className="h-[36px] relative rounded-[32px] shrink-0 w-full" data-name="Button medium secondary_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#de6a07] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[30px] py-[18px] relative w-full">
          <Frame4 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-center left-[23px] top-[23px] w-[290px]">
      <Frame32 />
      <ButtonMediumSecondaryOrange1 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white h-[466px] relative rounded-[21px] shrink-0 w-[336px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[21px]" />
      <Frame33 />
    </div>
  );
}

function Package() {
  return (
    <div className="content-start flex flex-wrap gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="package">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="content-stretch flex flex-col gap-[7px] items-center relative shrink-0 text-nowrap w-[493px] whitespace-pre">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[21px]">Additional Services</p>
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[14px] text-[rgba(74,60,42,0.7)] text-center">{`Enhance your pet's grooming experience with our premium add-ons`}</p>
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Nail Painting</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[21px] relative shrink-0 w-[123.875px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[123.875px]">
        <Icon9 />
        <Text6 />
      </div>
    </div>
  );
}

function Text7() {
  return (
    <div className="h-[21px] relative shrink-0 w-[22.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[22.922px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$15</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container18 />
      <Text7 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Teeth Cleaning</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[21px] relative shrink-0 w-[138.586px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[138.586px]">
        <Icon10 />
        <Text8 />
      </div>
    </div>
  );
}

function Text9() {
  return (
    <div className="h-[21px] relative shrink-0 w-[25.695px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[25.695px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$25</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container20 />
      <Text9 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text10() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Flea Treatment</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[21px] relative shrink-0 w-[138.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[138.391px]">
        <Icon11 />
        <Text10 />
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="h-[21px] relative shrink-0 w-[25.07px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[25.07px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$30</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container22 />
      <Text11 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text12() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">De-shedding Treatment</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[21px] relative shrink-0 w-[201.406px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[201.406px]">
        <Icon12 />
        <Text12 />
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="h-[21px] relative shrink-0 w-[25.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[25.813px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$35</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container24 />
      <Text13 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text14() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Aromatherapy Add-on</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[21px] relative shrink-0 w-[192.492px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[192.492px]">
        <Icon13 />
        <Text14 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="h-[21px] relative shrink-0 w-[24.953px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[24.953px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$20</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container26 />
      <Text15 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_6_2041)" id="Icon">
          <path d={svgPaths.p24f38080} id="Vector" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M16.6667 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M18.3333 3.33333H15" id="Vector_3" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2661f400} id="Vector_4" stroke="var(--stroke-0, #DE6A07)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_6_2041">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text16() {
  return (
    <div className="basis-0 grow h-[21px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-full">
        <p className="absolute font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Premium Cologne</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[21px] relative shrink-0 w-[158.227px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[21px] items-center relative w-[158.227px]">
        <Icon14 />
        <Text16 />
      </div>
    </div>
  );
}

function Text17() {
  return (
    <div className="h-[21px] relative shrink-0 w-[22.18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[22.18px]">
        <p className="absolute font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] left-0 text-[#de6a07] text-[14px] text-nowrap top-[0.5px] whitespace-pre">$10</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="box-border content-stretch flex h-[51px] items-center justify-between px-[15px] py-px relative rounded-[14px] shrink-0 w-[320.664px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px]" />
      <Container28 />
      <Text17 />
    </div>
  );
}

function Container30() {
  return (
    <div className="content-start flex flex-wrap gap-[20px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container21 />
      <Container23 />
      <Container25 />
      <Container27 />
      <Container29 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-center relative shrink-0 w-full">
      <Frame83 />
      <Container30 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px] text-nowrap whitespace-pre">{`View All Services & Pricing`}</p>
      </div>
    </div>
  );
}

function ButtonCompactSecondaryOrange() {
  return (
    <div className="h-[28px] relative rounded-[32px] shrink-0 w-[209px]" data-name="Button compact secondary_orange">
      <div aria-hidden="true" className="absolute border-2 border-[#8b6357] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[28px] items-center justify-center px-[30px] py-[18px] relative w-[209px]">
          <Frame5 />
        </div>
      </div>
    </div>
  );
}

function AddsOn() {
  return (
    <div className="bg-white relative rounded-[24px] shrink-0 w-full" data-name="Adds-on">
      <div aria-hidden="true" className="absolute border border-[#de6a07] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-center p-[24px] relative w-full">
          <Frame84 />
          <ButtonCompactSecondaryOrange />
        </div>
      </div>
    </div>
  );
}

export default function Services9() {
  return (
    <div className="bg-[#fdf8f0] relative size-full" data-name="Services">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[56px] items-start p-[56px] relative size-full">
          <Title />
          <Package />
          <AddsOn />
        </div>
      </div>
    </div>
  );
}
import svgPaths from "./svg-cw8zbza4oq";

function Direction() {
  return (
    <div className="relative size-full" data-name="Direction">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 16">
        <g id="Direction">
          <path d={svgPaths.p2ba71d00} fill="var(--fill-0, #717182)" id="Vector 3 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-0 overflow-clip size-[16px] top-[0.5px]" data-name="Icon">
      <div className="absolute bottom-0 flex items-center justify-center left-[22.3%] right-[22.3%] top-0">
        <div className="flex-none h-[15.999px] rotate-[180deg] w-[8.864px]">
          <Direction />
        </div>
      </div>
    </div>
  );
}

function DialogContent() {
  return (
    <div className="absolute left-[-1px] overflow-clip size-px top-[13px]" data-name="DialogContent">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Close</p>
    </div>
  );
}

function PrimitiveButton() {
  return (
    <button className="block cursor-pointer opacity-70 overflow-visible relative shrink-0 size-[16px]" data-name="Primitive.button">
      <Icon />
      <DialogContent />
    </button>
  );
}

function Title() {
  return (
    <div className="relative shrink-0 w-full" data-name="Title">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-0 relative w-full">
          <PrimitiveButton />
          <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[22.75px] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[14px] text-center">Log in</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Primitive.div" />;
}

function Frame68() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 top-0 w-[420px]">
      <Title />
      <PrimitiveDiv />
    </div>
  );
}

function Label() {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Label">
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre">&nbsp;</p>
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <p className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#633479] text-[16px] text-nowrap whitespace-pre">Welcome to Mutopia pet</p>
      <Label />
    </div>
  );
}

function Content() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[4px] items-start left-0 px-[24px] py-0 top-[52px] w-[420px]" data-name="Content">
      <Frame70 />
    </div>
  );
}

function WelcomeToMutopiaPet() {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Welcome to Mutopia pet">
      <Frame68 />
      <Content />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px] text-nowrap whitespace-pre">Password</p>
    </div>
  );
}

function Group66() {
  return (
    <div className="aspect-[34.5/18.1466] relative shrink-0 w-full">
      <div className="absolute inset-[-7.93%_-5.61%_-7.92%_-5.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 15">
          <g id="Group 66">
            <path d={svgPaths.p22db3c80} id="Vector 2" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
            <circle cx="13.8347" cy="7.31189" id="Ellipse 2" r="2.94491" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Visible() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center justify-center relative shrink-0 size-[24px]" data-name="Visible">
      <Group66 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your password</p>
      <Visible />
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
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input_default">
      <PrimitiveLabel />
      <Input />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#717182] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Label">
      <Checkbox1 />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px] text-nowrap whitespace-pre">Remember me</p>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <Label1 />
    </div>
  );
}

function Frame69() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame71 />
    </div>
  );
}

function ButtonTertiary() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0" data-name="Button tertiary">
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[12px] text-nowrap whitespace-pre">Forgot password</p>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <Frame69 />
      <ButtonTertiary />
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <InputDefault />
      <Frame72 />
    </div>
  );
}

function Icon1() {
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

function Frame2() {
  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Log in</p>
        <Icon1 />
      </div>
    </div>
  );
}

function ButtonMediumPrincipalOrange() {
  return (
    <div className="bg-[#de6a07] h-[36px] relative rounded-[32px] shrink-0 w-full" data-name="Button medium principal_orange">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[28px] py-[16px] relative w-full">
          <Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Frame73 />
      <ButtonMediumPrincipalOrange />
    </div>
  );
}

function TabPanel() {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
        <Frame65 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative w-full">
          <TabPanel />
        </div>
      </div>
    </div>
  );
}

export default function ModalLogIn() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[12px] px-0 relative rounded-[20px] size-full" data-name="Modal_log in">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <WelcomeToMutopiaPet />
      <Container />
    </div>
  );
}
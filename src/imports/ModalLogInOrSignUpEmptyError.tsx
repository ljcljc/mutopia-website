import svgPaths from "./svg-jyp8m20y0r";

function Icon() {
  return (
    <div className="relative size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M12 4L4 12" id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M4 4L12 12" id="Vector_2" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Direction() {
  return (
    <div className="relative size-full" data-name="Direction">
      <div className="absolute flex items-center justify-center left-[-3.57px] size-[16px] top-[-0.5px]">
        <div className="flex-none rotate-[180deg]">
          <Icon />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
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
      <Icon1 />
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
          <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[22.75px] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[14px] text-center">Log in or sign up</p>
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
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre"> </p>
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
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#de1507] text-[14px] text-nowrap whitespace-pre">Email</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px]">Enter your email</p>
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
      <div aria-hidden="true" className="absolute border border-[#de1507] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Alert() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d={svgPaths.p12502000} fill="url(#paint0_linear_17_882)" id="!" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_17_882" x1="5.5" x2="7.90061" y1="2.18005" y2="2.55764">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">Email is required.</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Input />
      <Frame6 />
    </div>
  );
}

function InputDefault() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input_default">
      <PrimitiveLabel />
      <Frame4 />
    </div>
  );
}

function Icon2() {
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
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">Continue</p>
        <Icon2 />
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
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
      <InputDefault />
      <ButtonMediumPrincipalOrange />
    </div>
  );
}

function AuthDialog() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="AuthDialog">
      <Frame65 />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 top-[-0.25px] w-[372px]" data-name="Primitive.div" />;
}

function Text() {
  return (
    <div className="absolute bg-white h-[17.5px] left-[153.05px] top-[-8.25px] w-[41.906px]" data-name="Text">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[14px] text-[#717182] text-[12.25px] text-nowrap top-[-0.5px] whitespace-pre">or</p>
    </div>
  );
}

function AuthDialog1() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="AuthDialog">
      <PrimitiveDiv1 />
      <Text />
    </div>
  );
}

function AuthDialog2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="AuthDialog">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_17_671)" id="AuthDialog">
          <path d={svgPaths.p32e125f0} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p2e225e30} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p31d81400} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.pc0f6170} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_17_671">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame60() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[16px] top-[7.75px] w-[315px]">
      <AuthDialog2 />
      <p className="basis-0 font-['Comfortaa:Bold',_sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Continue with Google</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame60 />
    </div>
  );
}

function AuthDialog3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="AuthDialog">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_17_664)" id="AuthDialog">
          <path d={svgPaths.p486f00} fill="var(--fill-0, #1877F2)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_17_664">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame61() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[18px] top-[8.25px] w-[315px]">
      <AuthDialog3 />
      <p className="basis-0 font-['Comfortaa:Bold',_sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Continue with Facebook</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame61 />
    </div>
  );
}

function AuthDialog4() {
  return (
    <div className="content-stretch flex flex-col gap-[10.5px] items-start relative shrink-0 w-full" data-name="AuthDialog">
      <Button />
      <Button1 />
    </div>
  );
}

function TabPanel() {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[28px] items-start relative w-full">
        <AuthDialog />
        <AuthDialog1 />
        <AuthDialog4 />
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

export default function ModalLogInOrSignUpEmptyError() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[12px] px-0 relative rounded-[20px] size-full" data-name="Modal_Log in or sign up_empty error">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <WelcomeToMutopiaPet />
      <Container />
    </div>
  );
}
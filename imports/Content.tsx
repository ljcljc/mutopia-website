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

export default function Content() {
  return (
    <div className="bg-[#633479] relative rounded-tl-[40px] rounded-tr-[40px] size-full" data-name="Content">
      <div className="flex flex-col items-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-center px-[80px] py-[36px] relative size-full">
          <Text />
          <ButtonMediumPrincipalPurple />
        </div>
      </div>
    </div>
  );
}
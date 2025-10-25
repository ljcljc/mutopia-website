import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./ui/dialog";
import svgPaths from "../imports/svg-k47wfeqkxq";
import svgPathsLogin from "../imports/svg-cw8zbza4oq";
import svgPathsPassword from "../imports/svg-pvvyz0d5lt";
import { toast } from "sonner";
import { Spinner } from "./Spinner";
import { Checkbox } from "./Checkbox";
import { useUser } from "./UserContext";
import { ArrowLeft } from "lucide-react";

// Mock API function to check if email is registered
async function checkEmailRegistered(email: string): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock logic: emails containing "test" are considered registered
  // All other emails are considered new users
  return email.toLowerCase().includes("test");
}

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
    <div className="absolute left-0 overflow-clip size-[16px] top-[0.5px] pointer-events-none" data-name="Icon">
      <div className="absolute bottom-0 flex items-center justify-center left-[22.3%] right-[22.3%] top-0">
        <div className="flex-none h-[15.999px] rotate-[180deg] w-[8.864px]">
          <Direction />
        </div>
      </div>
    </div>
  );
}

function DialogContentElement({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute left-[-1px] overflow-clip size-px top-[13px] pointer-events-none" data-name="DialogContent">
      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre">Close</p>
    </div>
  );
}

function PrimitiveButton({ onClose, onBack }: { onClose: () => void; onBack?: () => void }) {
  const handleClick = () => {
    console.log("Close button clicked");
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="block cursor-pointer opacity-70 overflow-visible relative shrink-0 size-[16px] hover:opacity-100 transition-opacity"
      data-name="Primitive.button"
      aria-label={onBack ? "Back" : "Close"}
      type="button"
    >
      {onBack ? (
        <ArrowLeft className="size-[16px] text-[#717182]" strokeWidth={1.16667} />
      ) : (
        <>
          <Icon1 />
          <DialogContentElement onClose={onClose} />
        </>
      )}
    </button>
  );
}

function Title({ onClose, onBack, title }: { onClose: () => void; onBack?: () => void; title: string }) {
  return (
    <div className="relative shrink-0 w-full" data-name="Title">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[12px] py-0 relative w-full">
          <PrimitiveButton onClose={onClose} onBack={onBack} />
          <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[22.75px] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[14px] text-center">{title}</p>
        </div>
      </div>
    </div>
  );
}

function PrimitiveDiv() {
  return <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" data-name="Primitive.div" />;
}

function Frame68({ onClose, onBack, title }: { onClose: () => void; onBack?: () => void; title: string }) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 top-0 w-full">
      <Title onClose={onClose} onBack={onBack} title={title} />
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
    <div className="absolute box-border content-stretch flex flex-col gap-[4px] items-start left-0 px-[24px] py-0 top-[52px] w-full" data-name="Content">
      <Frame70 />
    </div>
  );
}

function WelcomeToMutopiaPet({ onClose, onBack, title = "Log in or sign up" }: { onClose: () => void; onBack?: () => void; title?: string }) {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Welcome to Mutopia pet">
      <Frame68 onClose={onClose} onBack={onBack} title={title} />
      <Content />
    </div>
  );
}

function PrimitiveLabel({ hasError }: { hasError: boolean }) {
  return (
    <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className={`font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre ${hasError ? "text-[#de1507]" : "text-[#4a3c2a]"}`}>Email</p>
    </div>
  );
}

function Frame5({ value, onChange, onEnter, onBlur }: { value: string; onChange: (value: string) => void; onEnter?: () => void; onBlur?: () => void }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  return (
    <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder="Enter your email"
        className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px] placeholder:text-[#717182] bg-transparent border-none outline-none w-full"
      />
    </div>
  );
}

function Input({ value, onChange, onEnter, onBlur, hasError }: { value: string; onChange: (value: string) => void; onEnter?: () => void; onBlur?: () => void; hasError: boolean }) {
  return (
    <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
          <Frame5 value={value} onChange={onChange} onEnter={onEnter} onBlur={onBlur} />
        </div>
      </div>
      <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] ${hasError ? "border-[#de1507]" : "border-gray-200"}`} />
    </div>
  );
}

function Alert() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d="M6.11 8.21005C5.99667 8.21005 5.89667 8.16672 5.81 8.08005C5.73 7.99339 5.69 7.89339 5.69 7.78005V2.62005C5.69 2.49339 5.73 2.39005 5.81 2.31005C5.89667 2.22339 5.99667 2.18005 6.11 2.18005C6.23667 2.18005 6.34 2.22339 6.42 2.31005C6.5 2.39005 6.54 2.49339 6.54 2.62005V7.78005C6.54 7.89339 6.49667 7.99339 6.41 8.08005C6.32333 8.16672 6.22333 8.21005 6.11 8.21005ZM6.11 10.0001C5.94333 10.0001 5.8 9.94005 5.68 9.82005C5.56 9.70005 5.5 9.55672 5.5 9.39005C5.5 9.21005 5.56 9.06005 5.68 8.94005C5.8 8.82005 5.94333 8.76005 6.11 8.76005C6.28333 8.76005 6.43 8.82339 6.55 8.95005C6.67 9.07005 6.73 9.21672 6.73 9.39005C6.73 9.55672 6.67 9.70005 6.55 9.82005C6.43 9.94005 6.28333 10.0001 6.11 10.0001Z" fill="url(#paint0_linear_17_882)" id="!" />
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

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Alert />
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px] text-nowrap whitespace-pre">{message}</p>
    </div>
  );
}

function InputWithError({ value, onChange, onEnter, hasError }: { value: string; onChange: (value: string) => void; onEnter?: () => void; hasError: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Input value={value} onChange={onChange} onEnter={onEnter} hasError={hasError} />
    </div>
  );
}

function InputDefault({ value, onChange, onEnter, onBlur, error }: { value: string; onChange: (value: string) => void; onEnter?: () => void; onBlur?: () => void; error?: string }) {
  const hasError = !!error;
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input_default">
      <PrimitiveLabel hasError={hasError} />
      {error ? (
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <Input value={value} onChange={onChange} onEnter={onEnter} onBlur={onBlur} hasError={hasError} />
          <ErrorMessage message={error} />
        </div>
      ) : (
        <Input value={value} onChange={onChange} onEnter={onEnter} onBlur={onBlur} hasError={hasError} />
      )}
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

function Frame2({ isLoading, text = "Continue" }: { isLoading?: boolean; text?: string }) {
  if (isLoading) {
    return (
      <div className="relative shrink-0">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center justify-center relative">
          <Spinner size="small" color="white" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] items-center relative">
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">{text}</p>
        <Icon2 />
      </div>
    </div>
  );
}

function ButtonMediumPrincipalOrange({ onClick, disabled, isLoading, text }: { onClick: () => void; disabled?: boolean; isLoading?: boolean; text?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-[36px] relative rounded-[32px] shrink-0 w-full transition-colors ${
        disabled
          ? "bg-[#de6a07]/50 cursor-not-allowed"
          : "bg-[#de6a07] hover:bg-[#c55f06] cursor-pointer"
      }`}
      data-name="Button medium principal_orange"
    >
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[28px] py-[16px] relative w-full">
          <Frame2 isLoading={isLoading} text={text} />
        </div>
      </div>
    </button>
  );
}

function Frame65({ email, setEmail, onContinue, onBlur, error, isLoading }: { email: string; setEmail: (value: string) => void; onContinue: () => void; onBlur?: () => void; error?: string; isLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
      <InputDefault value={email} onChange={setEmail} onEnter={onContinue} onBlur={onBlur} error={error} />
      <ButtonMediumPrincipalOrange onClick={onContinue} disabled={isLoading} isLoading={isLoading} />
    </div>
  );
}

function AuthDialog({ email, setEmail, onContinue, onBlur, error, isLoading }: { email: string; setEmail: (value: string) => void; onContinue: () => void; onBlur?: () => void; error?: string; isLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="AuthDialog">
      <Frame65 email={email} setEmail={setEmail} onContinue={onContinue} onBlur={onBlur} error={error} isLoading={isLoading} />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 top-[-0.25px] right-0" data-name="Primitive.div" />;
}

function Text() {
  return (
    <div className="absolute bg-white h-[17.5px] left-1/2 -translate-x-1/2 top-[-8.25px] px-[14px]" data-name="Text">
      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[#717182] text-[12.25px] text-nowrap whitespace-pre">or</p>
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
    <div className="absolute content-stretch flex gap-[12px] items-center left-[16px] right-[16px] top-[7.75px]">
      <AuthDialog2 />
      <p className="basis-0 font-['Comfortaa:Bold',_sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Continue with Google</p>
    </div>
  );
}

function Button({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer"
      data-name="Button"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame60 />
    </button>
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
    <div className="absolute content-stretch flex gap-[12px] items-center left-[18px] right-[18px] top-[8.25px]">
      <AuthDialog3 />
      <p className="basis-0 font-['Comfortaa:Bold',_sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">Continue with Facebook</p>
    </div>
  );
}

function Button1({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer"
      data-name="Button"
    >
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Frame61 />
    </button>
  );
}

function AuthDialog4({ onGoogleClick, onFacebookClick }: { onGoogleClick: () => void; onFacebookClick: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[10.5px] items-start relative shrink-0 w-full" data-name="AuthDialog">
      <Button onClick={onGoogleClick} />
      <Button1 onClick={onFacebookClick} />
    </div>
  );
}

function TabPanel({ email, setEmail, onContinue, onBlur, onGoogleClick, onFacebookClick, error, isLoading }: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  error?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[28px] items-start relative w-full">
        <AuthDialog email={email} setEmail={setEmail} onContinue={onContinue} onBlur={onBlur} error={error} isLoading={isLoading} />
        <AuthDialog1 />
        <AuthDialog4 onGoogleClick={onGoogleClick} onFacebookClick={onFacebookClick} />
      </div>
    </div>
  );
}

function Container({ email, setEmail, onContinue, onBlur, onGoogleClick, onFacebookClick, error, isLoading }: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  error?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative w-full">
          <TabPanel
            email={email}
            setEmail={setEmail}
            onContinue={onContinue}
            onBlur={onBlur}
            onGoogleClick={onGoogleClick}
            onFacebookClick={onFacebookClick}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

// Password input components
function VisibleIcon({ onClick, showPassword }: { onClick: () => void; showPassword: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative shrink-0 size-[24px] cursor-pointer"
      data-name="Visible"
    >
      {showPassword ? (
        <div className="absolute inset-[-2.95%_-5.61%_-2.95%_-5.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 26">
            <g id="Visible">
              <g id="Group 66">
                <path d={svgPathsPassword.p38f0d500} id="Vector 2" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
                <circle cx="13.2152" cy="12.7071" id="Ellipse 2" r="2.94491" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
              </g>
              <path d={svgPathsPassword.p2edf6040} id="Vector 3" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
            </g>
          </svg>
        </div>
      ) : (
        <div className="absolute inset-[-2.95%_-5.61%_-2.95%_-5.75%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 26">
            <g id="Group 66">
              <path d={svgPathsPassword.p38f0d500} id="Vector 2" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
              <circle cx="13.2152" cy="12.7071" id="Ellipse 2" r="2.94491" stroke="var(--stroke-0, #4C4C4C)" strokeWidth="2" />
            </g>
          </svg>
        </div>
      )}
    </button>
  );
}

// Password validation icon components
function ValidationIcon({ isValid }: { isValid: boolean }) {
  if (isValid) {
    return (
      <div className="relative shrink-0 size-[12px]" data-name="Success">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
          <g id="Success">
            <circle cx="6" cy="6" fill="var(--fill-0, #22C55E)" id="Ellipse 3" r="6" />
            <path d="M3.5 6L5.5 8L8.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative shrink-0 size-[12px]" data-name="Alert">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Alert">
          <circle cx="6" cy="6" fill="var(--fill-0, #DE1507)" id="Ellipse 3" r="6" />
          <path d={svgPathsPassword.p26090d00} fill="url(#paint0_linear_17_1949)" id="X" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_17_1949" x1="3" x2="9" y1="3" y2="9">
            <stop stopColor="#FFF7ED" />
            <stop offset="1" stopColor="#FFFBEB" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

interface PasswordValidation {
  hasMinLength: boolean;
  hasNumberOrSymbol: boolean;
  strength: 'weak' | 'medium' | 'strong';
}

function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (hasMinLength && hasNumberOrSymbol) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    if (hasUpperCase && hasLowerCase && password.length >= 12) {
      strength = 'strong';
    } else if (hasUpperCase || hasLowerCase) {
      strength = 'medium';
    }
  }

  return { hasMinLength, hasNumberOrSymbol, strength };
}

function PasswordValidationMessages({ validation }: { validation: PasswordValidation }) {
  const allValid = validation.hasMinLength && validation.hasNumberOrSymbol;

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon isValid={allValid && validation.strength !== 'weak'} />
        <p className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${allValid && validation.strength !== 'weak' ? 'text-[#22C55E]' : 'text-[#de1507]'}`}>
          Password strength: {validation.strength}
        </p>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon isValid={validation.hasMinLength} />
        <p className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${validation.hasMinLength ? 'text-[#22C55E]' : 'text-[#de1507]'}`}>
          At least 8 characters
        </p>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon isValid={validation.hasNumberOrSymbol} />
        <p className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${validation.hasNumberOrSymbol ? 'text-[#22C55E]' : 'text-[#de1507]'}`}>
          Contains a number or symbol
        </p>
      </div>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  onEnter,
  onBlur,
  showPassword,
  onTogglePassword,
  hasError,
  showValidation = false
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onBlur?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  hasError: boolean;
  showValidation?: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  };

  const validation = validatePassword(value);

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input_default">
      <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px] text-nowrap whitespace-pre">Password</p>
      </div>
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
        <div className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                <input
                  type={showPassword ? "text" : "password"}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={onBlur}
                  placeholder="Enter your password"
                  className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px] placeholder:text-[#717182] bg-transparent border-none outline-none w-full"
                />
                <VisibleIcon onClick={onTogglePassword} showPassword={showPassword} />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] ${hasError ? "border-[#de1507]" : "border-gray-200"}`} />
        </div>
        {showValidation && value && <PasswordValidationMessages validation={validation} />}
      </div>
    </div>
  );
}

function PasswordContainer({
  password,
  setPassword,
  onLogin,
  onBlur,
  showPassword,
  onTogglePassword,
  rememberMe,
  setRememberMe,
  onForgotPassword,
  error,
  isLoading,
  isSignUp = false
}: {
  password: string;
  setPassword: (value: string) => void;
  onLogin: () => void;
  onBlur?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onForgotPassword: () => void;
  error?: string;
  isLoading?: boolean;
  isSignUp?: boolean;
}) {
  const hasError = !!error;

  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative w-full">
          <div className="relative shrink-0 w-full" data-name="Tab Panel">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  {error ? (
                    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                      <PasswordInput
                        value={password}
                        onChange={setPassword}
                        onEnter={onLogin}
                        onBlur={onBlur}
                        showPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                        hasError={hasError}
                        showValidation={isSignUp}
                      />
                      <ErrorMessage message={error} />
                    </div>
                  ) : (
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      onEnter={onLogin}
                      onBlur={onBlur}
                      showPassword={showPassword}
                      onTogglePassword={onTogglePassword}
                      hasError={hasError}
                      showValidation={isSignUp}
                    />
                  )}
                  {!isSignUp && (
                    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                            <Checkbox checked={rememberMe} onChange={setRememberMe} />
                            <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px] text-nowrap whitespace-pre">Remember me</p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        data-name="Button tertiary"
                      >
                        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[12px] text-nowrap whitespace-pre">Forgot password</p>
                      </button>
                    </div>
                  )}
                </div>
                <ButtonMediumPrincipalOrange onClick={onLogin} disabled={isLoading} isLoading={isLoading} text={isSignUp ? "Sign up" : "Log in"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type LoginStep = "email" | "password";

function ModalContent({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear error when user types
    if (error) {
      setError("");
    }
  };

  const validateEmail = (email: string): string | null => {
    // Check if empty
    if (!email.trim()) {
      return "Email is required.";
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Enter a valid email.";
    }

    return null;
  };

  // Handle blur event - validate when user leaves the input field
  const handleEmailBlur = () => {
    if (email) {
      const validationError = validateEmail(email);
      if (validationError) {
        setError(validationError);
      }
    }
  };

  const handleContinue = async () => {
    // Validate email
    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if email is registered (mock API call)
    setIsLoading(true);
    try {
      const isRegistered = await checkEmailRegistered(email);

      if (isRegistered) {
        // Email is registered - proceed to password step
        console.log("Email is registered, proceeding to password step");
        setStep("password");
      } else {
        // Email is not registered - navigate to sign up
        console.log("Email is not registered, navigating to sign up");
        toast.info("New user detected. Please complete registration.");
        // TODO: Navigate to sign up flow
        // For now, just close after showing message
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error checking email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError("");
    }
  };

  const handlePasswordBlur = () => {
    if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    }
  };

  const handleLogin = async () => {
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    // Mock API call to verify password
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: password "123456" is correct
      if (password === "123456" || password === "password") {
        toast.success("Login successful!");
        // Extract name from email
        const name = email.split("@")[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        login({
          name: capitalizedName,
          email: email,
        });

        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        setPasswordError("Incorrect password");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error during login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    console.log("Continue with Google");
    toast.success("Redirecting to Google login...");
    // Here you would handle Google authentication
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleFacebookClick = () => {
    console.log("Continue with Facebook");
    toast.success("Redirecting to Facebook login...");
    // Here you would handle Facebook authentication
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast.info("Password reset link would be sent to your email");
    // TODO: Implement forgot password flow
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setPasswordError("");
  };

  const title = step === "email" ? "Log in or sign up" : "Log in";
  const showBackButton = step === "password";

  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[12px] px-0 relative rounded-[20px] w-[420px] max-w-[calc(100vw-32px)]" data-name={step === "email" ? "Modal_Log in or sign up_default" : "Modal_log in"}>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <WelcomeToMutopiaPet
        onClose={onClose}
        onBack={showBackButton ? handleBack : undefined}
        title={title}
      />

      {step === "email" ? (
        <Container
          email={email}
          setEmail={handleEmailChange}
          onContinue={handleContinue}
          onBlur={handleEmailBlur}
          onGoogleClick={handleGoogleClick}
          onFacebookClick={handleFacebookClick}
          error={error}
          isLoading={isLoading}
        />
      ) : (
        <PasswordContainer
          password={password}
          setPassword={handlePasswordChange}
          onLogin={handleLogin}
          onBlur={handlePasswordBlur}
          showPassword={showPassword}
          onTogglePassword={handleTogglePassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onForgotPassword={handleForgotPassword}
          error={passwordError}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

interface LoginModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginModal({ children, open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-fit [&>button]:hidden">
        <DialogTitle className="sr-only">登录或注册</DialogTitle>
        <DialogDescription className="sr-only">
          请输入您的邮箱地址以登录或注册账户
        </DialogDescription>
        <ModalContent onClose={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}

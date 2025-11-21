import { CustomInput } from "@/components/common";
import {
  ButtonMediumPrincipalOrange,
  ErrorMessage,
} from "./LoginModalUI";
import iconGoogle from "@/assets/icons/icon-google.svg";
import iconFacebook from "@/assets/icons/icon-facebook.svg";

// Email form component
export function EmailForm({
  email,
  setEmail,
  onContinue,
  onBlur,
  onFocus,
  error,
  isLoading,
}: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
        <CustomInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onContinue();
            }
          }}
          disabled={isLoading}
          error={error}
          inputMode="email"
          autoComplete="email"
        />
        {error && <ErrorMessage message={error} />}
      </div>
      <ButtonMediumPrincipalOrange
        onClick={onContinue}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
}

export function EmailFormContainer({
  email,
  setEmail,
  onContinue,
  onBlur,
  onFocus,
  error,
  isLoading,
}: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  isLoading?: boolean;
}) {
  return (
    <div
      className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full"
      data-name="AuthDialog"
    >
      <EmailForm
        email={email}
        setEmail={setEmail}
        onContinue={onContinue}
        onBlur={onBlur}
        onFocus={onFocus}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}

// Divider component
export function DividerLine() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 right-0 top-[-0.25px]"
      data-name="Primitive.div"
    />
  );
}

export function DividerText() {
  return (
    <div
      className="absolute bg-white h-[17.5px] left-1/2 -translate-x-1/2 top-[-8.25px] px-[14px]"
      data-name="Text"
    >
      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#717182] text-[12.25px] text-nowrap whitespace-pre">
        or
      </p>
    </div>
  );
}

export function Divider() {
  return (
    <div className="h-px relative shrink-0 w-full" data-name="AuthDialog">
      <DividerLine />
      <DividerText />
    </div>
  );
}

// Social login buttons
export function GoogleIcon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="AuthDialog">
      <img src={iconGoogle} alt="Google" className="block size-full" />
    </div>
  );
}

export function GoogleButtonContent({ isLoading }: { isLoading?: boolean }) {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[16px] right-[16px] top-[7.75px]">
      {isLoading ? (
        <>
          <div className="relative shrink-0 size-[14px] flex items-center justify-center">
            <div className="size-[14px] border-2 border-[#717182] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="basis-0 font-['Comfortaa:Bold',sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">
            Connecting...
          </p>
        </>
      ) : (
        <>
          <GoogleIcon />
          <p className="basis-0 font-['Comfortaa:Bold',sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">
            Continue with Google
          </p>
        </>
      )}
    </div>
  );
}

export function GoogleButton({ 
  onClick, 
  isLoading = false 
}: { 
  onClick: () => void;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]"
      />
      <GoogleButtonContent isLoading={isLoading} />
    </button>
  );
}

export function FacebookIcon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="AuthDialog">
      <img src={iconFacebook} alt="Facebook" className="block size-full" />
    </div>
  );
}

export function FacebookButtonContent() {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center left-[18px] right-[18px] top-[8.25px]">
      <FacebookIcon />
      <p className="basis-0 font-['Comfortaa:Bold',sans-serif] font-bold grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[#717182] text-[14px] text-center">
        Continue with Facebook
      </p>
    </div>
  );
}

export function FacebookButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white h-[36px] relative rounded-[16px] shrink-0 w-full hover:bg-gray-50 transition-colors cursor-pointer"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]"
      />
      <FacebookButtonContent />
    </button>
  );
}

export function SocialLoginButtons({
  onGoogleClick,
  onFacebookClick,
  isGoogleLoading = false,
}: {
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  isGoogleLoading?: boolean;
}) {
  return (
    <div
      className="content-stretch flex flex-col gap-[10.5px] items-start relative shrink-0 w-full"
      data-name="AuthDialog"
    >
      <GoogleButton onClick={onGoogleClick} isLoading={isGoogleLoading} />
      <FacebookButton onClick={onFacebookClick} />
    </div>
  );
}

// Email step content
export function EmailStepContent({
  email,
  setEmail,
  onContinue,
  onBlur,
  onFocus,
  onGoogleClick,
  onFacebookClick,
  error,
  isLoading,
  isGoogleLoading,
}: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  error?: string;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[28px] items-start relative w-full">
        <EmailFormContainer
          email={email}
          setEmail={setEmail}
          onContinue={onContinue}
          onBlur={onBlur}
          onFocus={onFocus}
          error={error}
          isLoading={isLoading}
        />
        <Divider />
        <SocialLoginButtons
          onGoogleClick={onGoogleClick}
          onFacebookClick={onFacebookClick}
          isGoogleLoading={isGoogleLoading}
        />
      </div>
    </div>
  );
}

export function EmailStepContainer({
  email,
  setEmail,
  onContinue,
  onBlur,
  onFocus,
  onGoogleClick,
  onFacebookClick,
  error,
  isLoading,
  isGoogleLoading,
}: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  error?: string;
  isLoading?: boolean;
  isGoogleLoading?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative w-full">
          <EmailStepContent
            email={email}
            setEmail={setEmail}
            onContinue={onContinue}
            onBlur={onBlur}
            onFocus={onFocus}
            onGoogleClick={onGoogleClick}
            onFacebookClick={onFacebookClick}
            error={error}
            isLoading={isLoading}
            isGoogleLoading={isGoogleLoading}
          />
        </div>
      </div>
    </div>
  );
}


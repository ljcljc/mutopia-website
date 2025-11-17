import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Spinner, Checkbox, CustomInput, DatePicker } from "@/components/common";
import { 
  useAuthStore, 
  validateEmail, 
  validateLoginForm, 
  validateSignUpForm 
} from "@/components/auth/authStore";
import { z } from "zod";
import iconCloseArrow from "@/assets/icons/icon-close-arrow.svg";
import iconContinueArrow from "@/assets/icons/icon-continue-arrow.svg";
import iconGoogle from "@/assets/icons/icon-google.svg";
import iconFacebook from "@/assets/icons/icon-facebook.svg";
import iconEyeVisible from "@/assets/icons/icon-eye-visible.svg";
import iconEyeInvisible from "@/assets/icons/icon-eye-invisible.svg";
import iconAlertError from "@/assets/icons/icon-alert-error.svg";
import iconAlertSuccess from "@/assets/icons/icon-alert-success.svg";
import { checkEmailRegistered } from "@/lib/api";
import { HttpError } from "@/lib/http";

function Icon1() {
  return (
    <div className="absolute left-0 overflow-clip size-[16px] top-[0.5px] pointer-events-none" data-name="Icon">
      <img src={iconCloseArrow} alt="Close" className="block size-full rotate-180" />
    </div>
  );
}

function DialogContentElement() {
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
      className="block cursor-pointer opacity-70 overflow-visible relative shrink-0 size-[16px] hover:opacity-100 transition-all duration-200 hover:scale-110"
      data-name="Primitive.button"
      aria-label={onBack ? "Back" : "Close"}
      type="button"
    >
      {onBack ? (
        <img src={iconCloseArrow} alt="Back" className="size-[16px]" />
      ) : (
        <>
          <Icon1 />
          <DialogContentElement />
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
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 right-0 top-0">
      <Title onClose={onClose} onBack={onBack} title={title} />
      <PrimitiveDiv />
    </div>
  );
}

function Label({ showRequired = false }: { showRequired?: boolean }) {
  if (!showRequired) {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Label">
      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre"> </p>
      </div>
    );
  }
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center justify-end min-h-px min-w-px relative shrink-0" data-name="Label">
      <p className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[14px] relative shrink-0 text-[#4a3c2a] text-[10px] text-nowrap whitespace-pre">All fields are required.</p>
    </div>
  );
}

function Frame70({ showRequired = false }: { showRequired?: boolean }) {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
      <p className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#633479] text-[16px] text-nowrap whitespace-pre">Welcome to Mutopia pet</p>
      <Label showRequired={showRequired} />
    </div>
  );
}

function Content({ showRequired = false }: { showRequired?: boolean }) {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-[4px] items-start left-0 right-0 px-[24px] py-0 top-[52px]" data-name="Content">
      <Frame70 showRequired={showRequired} />
    </div>
  );
}

function WelcomeToMutopiaPet({ onClose, onBack, title = "Log in or sign up", showRequired = false }: { onClose: () => void; onBack?: () => void; title?: string; showRequired?: boolean }) {
  return (
    <div className="h-[72px] relative shrink-0 w-full" data-name="Welcome to Mutopia pet">
      <Frame68 onClose={onClose} onBack={onBack} title={title} />
      <Content showRequired={showRequired} />
    </div>
  );
}

function Alert({ type = "error" }: { type?: "error" | "success" }) {
  if (type === "success") {
  return (
      <div className="relative shrink-0 size-[14px]" data-name="Alert">
        <img src={iconAlertSuccess} alt="Success" className="absolute inset-0 size-full" />
      </div>
    );
  }
  
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alert">
      <img src={iconAlertError} alt="Error" className="absolute inset-0 size-full" />
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


function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <img src={iconContinueArrow} alt="Continue" className="block size-full" />
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

function Frame65({ email, setEmail, onContinue, onBlur, onFocus, error, isLoading }: { 
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
      <ButtonMediumPrincipalOrange onClick={onContinue} disabled={isLoading} isLoading={isLoading} />
    </div>
  );
}

function AuthDialog({ email, setEmail, onContinue, onBlur, onFocus, error, isLoading }: { 
  email: string; 
  setEmail: (value: string) => void; 
  onContinue: () => void; 
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string; 
  isLoading?: boolean;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="AuthDialog">
      <Frame65 email={email} setEmail={setEmail} onContinue={onContinue} onBlur={onBlur} onFocus={onFocus} error={error} isLoading={isLoading} />
    </div>
  );
}

function PrimitiveDiv1() {
  return <div className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 right-0 top-[-0.25px]" data-name="Primitive.div" />;
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
      <img src={iconGoogle} alt="Google" className="block size-full" />
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
      <img src={iconFacebook} alt="Facebook" className="block size-full" />
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

function TabPanel({ email, setEmail, onContinue, onBlur, onFocus, onGoogleClick, onFacebookClick, error, isLoading }: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  onGoogleClick: () => void;
  onFacebookClick: () => void;
  error?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full" data-name="Tab Panel">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[28px] items-start relative w-full">
        <AuthDialog email={email} setEmail={setEmail} onContinue={onContinue} onBlur={onBlur} onFocus={onFocus} error={error} isLoading={isLoading} />
        <AuthDialog1 />
        <AuthDialog4 onGoogleClick={onGoogleClick} onFacebookClick={onFacebookClick} />
      </div>
    </div>
  );
}

function Container({ email, setEmail, onContinue, onBlur, onFocus, onGoogleClick, onFacebookClick, error, isLoading }: {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
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
            onFocus={onFocus}
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
      className="relative shrink-0 size-[24px] cursor-pointer flex items-center justify-center"
      data-name="Visible"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      <img 
        src={showPassword ? iconEyeVisible : iconEyeInvisible} 
        alt={showPassword ? "Hide" : "Show"} 
        className="block size-full" 
      />
    </button>
  );
}

// Password validation icon components
function ValidationIcon({ isValid }: { isValid: boolean }) {
  return <Alert type={isValid ? "success" : "error"} />;
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
  onFocus,
  showPassword,
  onTogglePassword,
  hasError,
  isFocused,
  showValidation = false
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  hasError: boolean;
  isFocused?: boolean;
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
                  onFocus={onFocus}
                  placeholder="Enter your password"
                  className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px] placeholder:text-[#717182] bg-transparent border-none outline-none w-full"
                />
                <VisibleIcon onClick={onTogglePassword} showPassword={showPassword} />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] ${
            hasError 
              ? "border-[#de1507]" 
              : isFocused 
              ? "border-[#2374ff]" 
              : "border-gray-200"
          }`} />
        </div>
        {showValidation && value && <PasswordValidationMessages validation={validation} />}
      </div>
    </div>
  );
}

function PasswordContainer({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onLogin,
  onBlur,
  onFocus,
  showPassword,
  onTogglePassword,
  rememberMe,
  setRememberMe,
  onForgotPassword,
  error,
  confirmPasswordError,
  isLoading,
  isFocused,
  isSignUp = false
}: {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (value: string) => void;
  onLogin: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onForgotPassword: () => void;
  error?: string;
  confirmPasswordError?: string;
  isLoading?: boolean;
  isFocused?: boolean;
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
                        onFocus={onFocus}
                        showPassword={showPassword}
                        onTogglePassword={onTogglePassword}
                        hasError={hasError}
                        isFocused={isFocused}
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
                      onFocus={onFocus}
                      showPassword={showPassword}
                      onTogglePassword={onTogglePassword}
                      hasError={hasError}
                      isFocused={isFocused}
                      showValidation={isSignUp}
                    />
                  )}
                  {isSignUp && confirmPassword !== undefined && setConfirmPassword && (
                    <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
                      <CustomInput
                        label="Confirm password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        autoComplete="new-password"
                        error={confirmPasswordError}
                      />
                      {confirmPasswordError && <ErrorMessage message={confirmPasswordError} />}
                    </div>
                  )}
                  {!isSignUp && (
                    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                            <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
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

// SignUpContainer component - 1:1还原Figma设计图
function SignUpContainer({
  firstName,
  lastName,
  birthday,
  address,
  password,
  confirmPassword,
  showPassword,
  optOutMarketing,
  setFirstName,
  setLastName,
  setBirthday,
  setAddress,
  setPassword,
  setConfirmPassword,
  toggleShowPassword,
  setOptOutMarketing,
  onSignUp,
  firstNameError,
  lastNameError,
  birthdayError,
  addressError,
  passwordError,
  confirmPasswordError,
  isLoading,
  isFocused,
  onFocus,
  onBlur,
}: {
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  optOutMarketing: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setBirthday: (value: string) => void;
  setAddress: (value: string) => void;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  toggleShowPassword: () => void;
  setOptOutMarketing: (value: boolean) => void;
  onSignUp: () => void;
  firstNameError?: string;
  lastNameError?: string;
  birthdayError?: string;
  addressError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  isLoading?: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 w-full" data-name="Tab Panel">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {/* First name */}
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <CustomInput
                label="First name"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="given-name"
                error={firstNameError}
              />
              {firstNameError && <ErrorMessage message={firstNameError} />}
            </div>

            {/* Last name */}
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <CustomInput
                label="Last name"
                placeholder="Last name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="family-name"
                error={lastNameError}
              />
              {lastNameError && <ErrorMessage message={lastNameError} />}
            </div>

            {/* Date of birth */}
            <DatePicker
              label="Date of birth"
              placeholder="yyyy-mm-dd"
              value={birthday}
              onChange={setBirthday}
              error={birthdayError}
              helperText={birthdayError ? undefined : "At least 18 years old. Your birthday won't be shared."}
              minDate={(() => {
                const today = new Date();
                const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                return minDate.toISOString().split('T')[0];
              })()}
              maxDate={(() => {
                const today = new Date();
                return today.toISOString().split('T')[0];
              })()}
            />

            {/* Address */}
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <CustomInput
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                autoComplete="street-address"
                error={addressError}
              />
              {addressError && <ErrorMessage message={addressError} />}
            </div>

            {/* Password */}
            <PasswordInput
              value={password}
              onChange={setPassword}
              onEnter={onSignUp}
              onBlur={onBlur}
              onFocus={onFocus}
              showPassword={showPassword}
              onTogglePassword={toggleShowPassword}
              hasError={!!passwordError}
              isFocused={isFocused}
              showValidation={true}
            />
            {passwordError && <ErrorMessage message={passwordError} />}

            {/* Confirm password */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Input_default">
              <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full" data-name="Primitive.label">
                <p className={`font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre ${confirmPasswordError ? "text-[#de1507]" : "text-[#4a3c2a]"}`}>Confirm password</p>
              </div>
              {confirmPasswordError ? (
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <PasswordInput
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    onEnter={onSignUp}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    showPassword={showPassword}
                    onTogglePassword={toggleShowPassword}
                    hasError={!!confirmPasswordError}
                    isFocused={isFocused}
                    showValidation={false}
                  />
                  <ErrorMessage message={confirmPasswordError} />
                </div>
              ) : (
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  onEnter={onSignUp}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  showPassword={showPassword}
                  onTogglePassword={toggleShowPassword}
                  hasError={!!confirmPasswordError}
                  isFocused={isFocused}
                  showValidation={false}
                />
              )}
            </div>

            {/* Terms of Service */}
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Label">
              <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                <span>By selecting Agree and continue, I agree to </span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">Terms of Service</span>
                <span className="text-[#de6a07]">{`, `}</span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">Payments Terms of Service</span>
                <span className="text-[#de6a07]">{`, `}</span>
                <span>and </span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">Privacy Policy</span>
                <span className="text-[#de6a07]">.</span>
              </p>
            </div>

            {/* Agree and continue button */}
            <ButtonMediumPrincipalOrange onClick={onSignUp} disabled={isLoading} isLoading={isLoading} text="Agree and continue" />

            {/* Divider */}
            <div className="h-px relative shrink-0 w-full" data-name="AuthDialog">
              <div className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 top-[-0.25px] w-full" data-name="Primitive.div" />
            </div>

            {/* Marketing opt-out */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Label">
                <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                  {`Mutopia will send you members-only deals, inspiration, `}
                  <br aria-hidden="true" />
                  marketing emails, and push notifications. You can opt out of
                  <br aria-hidden="true" />
                  receiving these at any time in your account settings or
                  <br aria-hidden="true" />
                  directly from the marketing notification.
                </p>
              </div>
              <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full" data-name="Label">
                <div className="cursor-pointer" onClick={() => setOptOutMarketing(!optOutMarketing)}>
                  <Checkbox checked={optOutMarketing} onChange={(e) => setOptOutMarketing(e.target.checked)} />
                </div>
                <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">I don't want to receive marketing messages.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const {
    step,
    email,
    password,
    confirmPassword,
    showPassword,
    rememberMe,
    firstName,
    lastName,
    birthday,
    address,
    optOutMarketing,
    isPasswordFocused,
    emailError,
    passwordError,
    confirmPasswordError,
    firstNameError,
    lastNameError,
    birthdayError,
    addressError,
    isLoading,
    setStep,
    setEmail,
    setPassword,
    setConfirmPassword,
    setRememberMe,
    toggleShowPassword,
    setFirstName,
    setLastName,
    setBirthday,
    setAddress,
    setOptOutMarketing,
    setIsEmailFocused,
    setIsPasswordFocused,
    setEmailError,
    setPasswordError,
    setConfirmPasswordError,
    setFirstNameError,
    setLastNameError,
    setBirthdayError,
    setAddressError,
    setIsLoading,
    reset,
    login,
  } = useAuthStore();

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  // Handle blur event - validate when user leaves the input field
  const handleEmailBlur = () => {
    setIsEmailFocused(false);
    if (email) {
      const result = validateEmail(email);
      if (!result.success && result.error) {
        setEmailError(result.error);
      }
    }
  };

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleContinue = async () => {
    // Step 1: Frontend validation using zod
    const result = validateEmail(email);
    if (!result.success && result.error) {
      setEmailError(result.error);
      return;
    }

    // Step 2: Call API to check if email is registered
    setIsLoading(true);
    setEmailError(""); // Clear any previous errors
    
    try {
      console.log("Checking email:", email);
      const response = await checkEmailRegistered(email);

      // Handle API response
      if (response.exists) {
        // Email is registered - proceed to password step
        console.log("Email is registered, proceeding to password step");
        setStep("password");
        
        // Optional: Show info if verification code was sent
        if (response.code_sent) {
          // Code was sent, but we proceed to password step for login
          // This info might be useful for future features
        }
      } else {
        // Email is not registered - navigate to sign up
        console.log("Email is not registered, navigating to sign up");
        setStep("signup");
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err instanceof HttpError) {
        // Handle HttpError with status code
        const errorStatus = err.status;
        
        // Handle specific HTTP status codes
        if (errorStatus === 400) {
          errorMessage = "Invalid email format. Please check and try again.";
          setEmailError(err.message || errorMessage);
        } else if (errorStatus === 429) {
          errorMessage = "Too many requests. Please wait a moment and try again.";
          toast.error(errorMessage);
        } else if (errorStatus === 500) {
          errorMessage = "Server error. Please try again later.";
          toast.error(errorMessage);
        } else if (errorStatus >= 400 && errorStatus < 500) {
          // Client errors (4xx)
          errorMessage = err.message || "Invalid request. Please check your input.";
          setEmailError(errorMessage);
        } else if (errorStatus === 0) {
          // Network errors (status 0)
          errorMessage = err.message || "Network error. Please check your internet connection.";
          toast.error(errorMessage);
        } else {
          // Other HTTP errors
          errorMessage = err.message || errorMessage;
          toast.error(errorMessage);
        }
      } else if (err instanceof Error) {
        // Handle other Error types
        if (err.message.includes('Network error')) {
          errorMessage = err.message;
          toast.error(errorMessage);
        } else {
          errorMessage = err.message || errorMessage;
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
      
      console.error("Error checking email:", err);
      
      // On error, don't automatically navigate - let user retry
      // Only navigate to signup if it's a clear "email not found" scenario
      // For other errors, stay on email step so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    if (password) {
      if (step === "signup") {
        // For signup, use strong password validation
        const result = validateSignUpForm({ email, password, confirmPassword });
        if (!result.success && result.error) {
          const passwordError = result.error.issues.find((e: z.ZodIssue) => e.path.includes("password"));
          if (passwordError) {
            setPasswordError(passwordError.message);
          }
        }
      } else {
        // For login, use basic password validation
        const result = validateLoginForm({ email, password, rememberMe });
        if (!result.success && result.error) {
          const passwordError = result.error.issues.find((e: z.ZodIssue) => e.path.includes("password"));
          if (passwordError) {
            setPasswordError(passwordError.message);
    }
        }
      }
    }
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handleLogin = async () => {
    // Validate using zod
    const result = validateLoginForm({ email, password, rememberMe });
    if (!result.success && result.error) {
      // Set field-specific errors
      result.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path.includes("email")) {
          setEmailError(err.message);
    }
        if (err.path.includes("password")) {
          setPasswordError(err.message);
        }
      });
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

        const user = {
          name: capitalizedName,
          email: email,
        };

        login(user);

        setTimeout(() => {
          reset();
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

  const handleSignUp = async () => {
    // Validate using zod with all signup fields
    const result = validateSignUpForm({ 
      email, 
      firstName, 
      lastName, 
      birthday, 
      address, 
      password, 
      confirmPassword 
    });
    if (!result.success && result.error) {
      // Set field-specific errors
      result.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path.includes("email")) {
          setEmailError(err.message);
        }
        if (err.path.includes("firstName")) {
          setFirstNameError(err.message);
        }
        if (err.path.includes("lastName")) {
          setLastNameError(err.message);
        }
        if (err.path.includes("birthday")) {
          setBirthdayError(err.message);
        }
        if (err.path.includes("address")) {
          setAddressError(err.message);
        }
        if (err.path.includes("password")) {
          setPasswordError(err.message);
        }
        if (err.path.includes("confirmPassword")) {
          setConfirmPasswordError(err.message);
        }
      });
      return;
    }

    // Mock API call to sign up
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Sign up successful!");
      
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      const user = {
        name: `${capitalizedFirstName} ${capitalizedLastName}`,
        email: email,
      };

      login(user);

      setTimeout(() => {
        reset();
        onClose();
      }, 500);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error during sign up:", err);
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
    toggleShowPassword();
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const title = step === "email" 
    ? "Log in or sign up" 
    : step === "signup" 
    ? "Sign up" 
    : "Log in";
  const showBackButton = step === "password" || step === "signup";

  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start pb-[32px] pt-[12px] px-0 relative rounded-[20px] w-[420px] max-w-[calc(100vw-32px)]" data-name={step === "email" ? "Modal_Log in or sign up_default" : "Modal_log in"}>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <WelcomeToMutopiaPet
        onClose={onClose}
        onBack={showBackButton ? handleBack : undefined}
        title={title}
        showRequired={step === "signup"}
      />

      {step === "email" ? (
        <Container
          email={email}
          setEmail={handleEmailChange}
          onContinue={handleContinue}
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
          onGoogleClick={handleGoogleClick}
          onFacebookClick={handleFacebookClick}
          error={emailError}
          isLoading={isLoading}
        />
      ) : step === "signup" ? (
        <SignUpContainer
          firstName={firstName}
          lastName={lastName}
          birthday={birthday}
          address={address}
          password={password}
          confirmPassword={confirmPassword}
          showPassword={showPassword}
          optOutMarketing={optOutMarketing}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setBirthday={setBirthday}
          setAddress={setAddress}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          toggleShowPassword={toggleShowPassword}
          setOptOutMarketing={setOptOutMarketing}
          onSignUp={handleSignUp}
          firstNameError={firstNameError}
          lastNameError={lastNameError}
          birthdayError={birthdayError}
          addressError={addressError}
          passwordError={passwordError}
          confirmPasswordError={confirmPasswordError}
          isLoading={isLoading}
          isFocused={isPasswordFocused}
          onFocus={handlePasswordFocus}
          onBlur={handlePasswordBlur}
        />
      ) : (
        <PasswordContainer
          password={password}
          setPassword={handlePasswordChange}
          onLogin={handleLogin}
          onBlur={handlePasswordBlur}
          onFocus={handlePasswordFocus}
          showPassword={showPassword}
          onTogglePassword={handleTogglePassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onForgotPassword={handleForgotPassword}
          error={passwordError}
          isLoading={isLoading}
          isFocused={isPasswordFocused}
          isSignUp={false}
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
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-fit [&>button]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%] duration-300">
        <DialogTitle className="sr-only">登录或注册</DialogTitle>
        <DialogDescription className="sr-only">
          请输入您的邮箱地址以登录或注册账户
        </DialogDescription>
        <ModalContent onClose={() => onOpenChange?.(false)} />
      </DialogContent>
    </Dialog>
  );
}


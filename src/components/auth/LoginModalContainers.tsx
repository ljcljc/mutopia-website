import React from "react";
import { Checkbox, CustomInput, DatePicker } from "@/components/common";
import {
  ButtonMediumPrincipalOrange,
  ErrorMessage,
} from "./LoginModalUI";
import {
  validatePassword,
  PasswordValidationMessages,
} from "./LoginModalPasswordValidation";
import iconEyeVisible from "@/assets/icons/icon-eye-visible.svg";
import iconEyeInvisible from "@/assets/icons/icon-eye-invisible.svg";

// Password input components
export function VisibleIcon({
  onClick,
  showPassword,
}: {
  onClick: () => void;
  showPassword: boolean;
}) {
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

// Password input with validation
export function PasswordInput({
  value,
  onChange,
  onEnter,
  onBlur,
  onFocus,
  showPassword,
  onTogglePassword,
  hasError,
  showValidation = false,
  label,
  showLabel = true,
}: {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  hasError: boolean;
  showValidation?: boolean;
  label?: string;
  showLabel?: boolean;
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const validation = validatePassword(value);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div
      className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
      data-name="Input_default"
    >
      {showLabel && (
        <div
          className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full"
          data-name="Primitive.label"
        >
          <p
            className={`font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre ${
              hasError ? "text-[#de1507]" : "text-[#4a3c2a]"
            }`}
          >
            {label || "Password"}
          </p>
        </div>
      )}
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
        <div
          className="bg-white h-[36px] relative rounded-[12px] shrink-0 w-full"
          data-name="Input"
        >
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex h-[36px] items-center px-[16px] py-[4px] relative w-full">
              <div className="basis-0 content-stretch flex grow items-center min-h-px min-w-px relative shrink-0">
                <input
                  type={showPassword ? "text" : "password"}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  placeholder="Enter your password"
                  className="basis-0 font-['Comfortaa:Regular',sans-serif] font-normal grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[12.25px] placeholder:text-[#717182] bg-transparent border-none outline-none w-full"
                />
                <VisibleIcon
                  onClick={onTogglePassword}
                  showPassword={showPassword}
                />
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className={`absolute border border-solid inset-0 pointer-events-none rounded-[12px] ${
              hasError
                ? "border-[#de1507]"
                : isFocused
                  ? "border-[#2374ff]"
                  : "border-gray-200"
            }`}
          />
        </div>
        {showValidation && value && (
          <PasswordValidationMessages validation={validation} />
        )}
      </div>
    </div>
  );
}

// Password container for login
export function PasswordContainer({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onLogin,
  onBlur,
  showPassword,
  onTogglePassword,
  rememberMe,
  setRememberMe,
  onForgotPassword,
  error,
  confirmPasswordError,
  isLoading,
  isSignUp = false,
}: {
  password: string;
  setPassword: (value: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (value: string) => void;
  onLogin: () => void;
  onBlur?: () => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  onForgotPassword: () => void;
  error?: string;
  confirmPasswordError?: string;
  isLoading?: boolean;
  isSignUp?: boolean;
}) {
  const hasError = !!error;

  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative w-full">
          <div className="relative shrink-0 w-full" data-name="Tab Panel">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
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
                  {isSignUp &&
                    confirmPassword !== undefined &&
                    setConfirmPassword && (
                      <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
                        <CustomInput
                          label="Confirm password"
                          type="password"
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
                          autoComplete="new-password"
                          error={confirmPasswordError}
                        />
                        {confirmPasswordError && (
                          <ErrorMessage message={confirmPasswordError} />
                        )}
                      </div>
                    )}
                  {!isSignUp && (
                    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
                      <div className="basis-0 content-stretch flex flex-col gap-[12px] grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                          <div
                            className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full cursor-pointer"
                            onClick={() => setRememberMe(!rememberMe)}
                          >
                            <Checkbox
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px] text-nowrap whitespace-pre">
                              Remember me
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        data-name="Button tertiary"
                      >
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de6a07] text-[12px] text-nowrap whitespace-pre">
                          Forgot password
                        </p>
                      </button>
                    </div>
                  )}
                </div>
                <ButtonMediumPrincipalOrange
                  onClick={onLogin}
                  disabled={isLoading}
                  isLoading={isLoading}
                  text={isSignUp ? "Sign up" : "Log in"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SignUpContainer component
export function SignUpContainer({
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
  onBlur,
  onConfirmPasswordBlur,
  onFirstNameBlur,
  onLastNameBlur,
  onBirthdayBlur,
  onAddressBlur,
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
  onBlur?: () => void;
  onConfirmPasswordBlur?: () => void;
  onFirstNameBlur?: () => void;
  onLastNameBlur?: () => void;
  onBirthdayBlur?: () => void;
  onAddressBlur?: () => void;
}) {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="relative shrink-0 w-full" data-name="Tab Panel">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {/* First name */}
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <CustomInput
                label="First name"
                placeholder="First name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                onBlur={onFirstNameBlur}
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
                onBlur={onLastNameBlur}
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
              onBlur={onBirthdayBlur}
              error={birthdayError}
              helperText={
                birthdayError
                  ? undefined
                  : "At least 18 years old. Your birthday won't be shared."
              }
              minDate="1900-01-01"
              maxDate={(() => {
                const today = new Date();
                // Max date is 18 years ago (user must be at least 18 years old)
                const maxDate = new Date(
                  today.getFullYear() - 18,
                  today.getMonth(),
                  today.getDate()
                );
                return maxDate.toISOString().split("T")[0];
              })()}
            />

            {/* Address */}
            <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
              <CustomInput
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                onBlur={onAddressBlur}
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
              showPassword={showPassword}
              onTogglePassword={toggleShowPassword}
              hasError={!!passwordError}
              showValidation={true}
            />
            {passwordError && <ErrorMessage message={passwordError} />}

            {/* Confirm password */}
            {confirmPasswordError ? (
              <div className="content-stretch flex flex-col gap-[4px] items-start w-full">
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  onEnter={onSignUp}
                  onBlur={onConfirmPasswordBlur}
                  showPassword={showPassword}
                  onTogglePassword={toggleShowPassword}
                  hasError={!!confirmPasswordError}
                  showValidation={false}
                  label="Confirm password"
                />
                <ErrorMessage message={confirmPasswordError} />
              </div>
            ) : (
              <PasswordInput
                value={confirmPassword}
                onChange={setConfirmPassword}
                onEnter={onSignUp}
                onBlur={onConfirmPasswordBlur}
                showPassword={showPassword}
                onTogglePassword={toggleShowPassword}
                hasError={!!confirmPasswordError}
                showValidation={false}
                label="Confirm password"
              />
            )}

            {/* Terms of Service */}
            <div
              className="content-stretch flex gap-[8px] items-start relative w-full"
              data-name="Label"
            >
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[#4a3c2a] text-[12px] whitespace-normal">
                <span>By selecting Agree and continue, I agree to </span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">
                  Terms of Service
                </span>
                <span className="text-[#de6a07]">{`, `}</span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">
                  Payments Terms of Service
                </span>
                <span className="text-[#de6a07]">{`, `}</span>
                <span>and </span>
                <span className="[text-underline-position:from-font] decoration-solid text-[#de6a07] underline">
                  Privacy Policy
                </span>
                <span className="text-[#de6a07]">.</span>
              </p>
            </div>

            {/* Agree and continue button */}
            <ButtonMediumPrincipalOrange
              onClick={onSignUp}
              disabled={isLoading}
              isLoading={isLoading}
              text="Agree and continue"
            />

            {/* Divider */}
            <div
              className="h-px relative shrink-0 w-full"
              data-name="AuthDialog"
            >
              <div
                className="absolute bg-[rgba(0,0,0,0.1)] h-px left-0 top-[-0.25px] w-full"
                data-name="Primitive.div"
              />
            </div>

            {/* Marketing opt-out */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <div
                className="content-stretch flex gap-[8px] items-start relative w-full"
                data-name="Label"
              >
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[#4a3c2a] text-[12px] whitespace-normal">
                  Mutopia will send you members-only deals, inspiration,
                  marketing emails, and push notifications. You can opt out of
                  receiving these at any time in your account settings or
                  directly from the marketing notification.
                </p>
              </div>
              <div
                className="content-stretch flex gap-[8px] items-center relative w-full"
                data-name="Label"
              >
                <Checkbox
                  checked={optOutMarketing}
                  onCheckedChange={setOptOutMarketing}
                  label="I don't want to receive marketing messages."
                  containerClassName="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


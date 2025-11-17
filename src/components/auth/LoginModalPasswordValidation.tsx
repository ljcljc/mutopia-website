import { Alert } from "./LoginModalUI";

// Password validation icon components
export function ValidationIcon({ isValid }: { isValid: boolean }) {
  return <Alert type={isValid ? "success" : "error"} />;
}

export interface PasswordValidation {
  hasMinLength: boolean;
  hasNumberOrSymbol: boolean;
  strength: "weak" | "medium" | "strong";
}

export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength: "weak" | "medium" | "strong" = "weak";
  if (hasMinLength && hasNumberOrSymbol) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    if (hasUpperCase && hasLowerCase && password.length >= 12) {
      strength = "strong";
    } else if (hasUpperCase || hasLowerCase) {
      strength = "medium";
    }
  }

  return { hasMinLength, hasNumberOrSymbol, strength };
}

export function PasswordValidationMessages({
  validation,
}: {
  validation: PasswordValidation;
}) {
  const allValid = validation.hasMinLength && validation.hasNumberOrSymbol;
  const strengthText =
    validation.strength === "weak"
      ? "weak"
      : validation.strength === "medium" || validation.strength === "strong"
        ? "Good"
        : validation.strength;

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon
          isValid={allValid && validation.strength !== "weak"}
        />
        <p
          className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
            allValid && validation.strength !== "weak"
              ? "text-[#22C55E]"
              : "text-[#de1507]"
          }`}
        >
          Password strength: {strengthText}
        </p>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon isValid={validation.hasMinLength} />
        <p
          className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
            validation.hasMinLength ? "text-[#22C55E]" : "text-[#de1507]"
          }`}
        >
          At least 8 characters
        </p>
      </div>
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
        <ValidationIcon isValid={validation.hasNumberOrSymbol} />
        <p
          className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${
            validation.hasNumberOrSymbol ? "text-[#22C55E]" : "text-[#de1507]"
          }`}
        >
          Contains a number or symbol
        </p>
      </div>
    </div>
  );
}


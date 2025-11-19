import { useState, useEffect } from "react";
import { VerificationCodeInput } from "./VerificationCodeInput";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { sendCode, verifyCode } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

interface VerifyEmailContainerProps {
  email: string;
  verificationCode: string[];
  setVerificationCode: (code: string[]) => void;
  onVerify: (vsToken: string) => void;
  onChangeEmail: () => void;
  isLoading?: boolean;
  mode?: "signup" | "login"; // Verification mode
}

export function VerifyEmailContainer({
  email,
  verificationCode,
  setVerificationCode,
  onVerify,
  onChangeEmail,
  isLoading = false,
  mode = "signup",
}: VerifyEmailContainerProps) {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendCode = async () => {
    if (countdown > 0) {
      return; // Don't allow resend during countdown
    }

    setIsResending(true);
    setError("");
    try {
      await sendCode({ email, purpose: mode === "login" ? "login" : "register" });
      setCountdown(60);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message || "Failed to send verification code.");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
      toast.error("Failed to send verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async () => {
    const codeString = verificationCode.join("");
    if (codeString.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    try {
      const result = await verifyCode({
        email,
        code: codeString,
        purpose: mode === "login" ? "login" : "register",
      });

      // For login mode, we don't need vs_token, we'll use the code directly in login API
      // For signup mode, we need vs_token
      if (mode === "login") {
        if (!result.ok) {
          setError("Invalid verification code. Please try again.");
          return;
        }
        // For login, pass empty string as vsToken since we'll use code directly
        onVerify("");
      } else {
        if (!result.ok || !result.vs_token) {
          setError("Invalid verification code. Please try again.");
          return;
        }
        onVerify(result.vs_token);
      }
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message || "Invalid verification code.");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    }
  };

  const isCodeComplete = verificationCode.join("").length === 6;

  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-center relative w-full">
          <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Email label */}
              <div className="content-stretch flex gap-[4px] items-end relative shrink-0 w-full">
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-start justify-end relative text-[#4a3c2a]">
                    <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px]">
                      Enter the 6-digital code sent to
                    </p>
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px]">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] min-w-full relative shrink-0 text-[#de6a07] text-[12px] text-center w-min whitespace-pre-wrap">
                {countdown > 0 ? (
                  <>
                    <span>Expired in </span>
                    <span className="[text-underline-position:from-font] decoration-solid underline">
                      {countdown}
                    </span>
                    <span> secondes</span>
                  </>
                ) : (
                  <span>Code expired</span>
                )}
              </p>

              {/* Verification code input */}
              <VerificationCodeInput
                code={verificationCode}
                onChange={setVerificationCode}
                error={error}
              />

              {/* Error message */}
              {error && (
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#de1507] text-[12px] text-center">
                  {error}
                </p>
              )}

              {/* Change email and Resend code */}
              <div className="box-border content-stretch flex items-start justify-between px-[20px] py-0 relative shrink-0 w-full">
                <button
                  onClick={onChangeEmail}
                  className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                  disabled={isLoading}
                >
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                    Change email
                  </p>
                </button>
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isResending || isLoading}
                  className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                    {isResending ? "Sending..." : "Resend code"}
                  </p>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <ButtonMediumPrincipalOrange
              onClick={handleSubmit}
              disabled={!isCodeComplete || isLoading}
              isLoading={isLoading}
              text="Submit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


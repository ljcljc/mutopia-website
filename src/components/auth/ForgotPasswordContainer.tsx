import { useState, useEffect } from "react";
import { VerificationCodeInput } from "./VerificationCodeInput";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { sendPasswordResetCode, verifyPasswordResetCode } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

interface ForgotPasswordContainerProps {
  email: string;
  verificationCode: string[];
  setVerificationCode: (code: string[]) => void;
  onVerify: (resetToken: string) => void;
  onChangeEmail: () => void;
  isLoading?: boolean;
  codeSendCount: number;
  codeVerifyFailCount: number;
  setCodeSendCount: (count: number) => void;
  setCodeVerifyFailCount: (count: number) => void;
}

export function ForgotPasswordContainer({
  email,
  verificationCode,
  setVerificationCode,
  onVerify,
  onChangeEmail,
  isLoading = false,
  codeSendCount,
  codeVerifyFailCount,
  setCodeSendCount,
  setCodeVerifyFailCount,
}: ForgotPasswordContainerProps) {
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeResent, setCodeResent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_SEND_COUNT = 5;
  const MAX_VERIFY_FAIL_COUNT = 5;

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset countdown when code is resent and clear codeResent when countdown reaches 0
  useEffect(() => {
    if (codeResent) {
      setCountdown(60);
    }
  }, [codeResent]);

  // Clear codeResent state when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && codeResent) {
      setCodeResent(false);
    }
  }, [countdown, codeResent]);

  const handleResendCode = async () => {
    if (countdown > 0 || codeSendCount >= MAX_SEND_COUNT) {
      return;
    }

    setIsResending(true);
    setError("");
    try {
      await sendPasswordResetCode(email);
      setCodeSendCount(codeSendCount + 1);
      // Set codeResent to true to show success state
      setCodeResent(true);
      // Countdown will be reset by useEffect when codeResent becomes true
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
    
    // Check if code is empty
    if (codeString.length !== 6) {
      setError("Enter your code.");
      return;
    }

    // Check if max attempts reached
    if (codeVerifyFailCount >= MAX_VERIFY_FAIL_COUNT) {
      setError("For security reason. Please contact us to reset your password.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await verifyPasswordResetCode({
        email,
        code: codeString,
        purpose: "forgot_password",
      });

      if (!result.ok || !result.vs_token) {
        setCodeVerifyFailCount(codeVerifyFailCount + 1);
        setError("Wrong code. Try again");
        return;
      }

      // Success - reset fail count and proceed
      setCodeVerifyFailCount(0);
      onVerify(result.vs_token);
    } catch (err) {
      setCodeVerifyFailCount(codeVerifyFailCount + 1);
      if (err instanceof HttpError) {
        setError(err.message || "Invalid verification code.");
      } else {
        setError("Invalid verification code. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCodeComplete = verificationCode.join("").length === 6;
  const canResend = countdown === 0 && codeSendCount < MAX_SEND_COUNT && codeVerifyFailCount < MAX_VERIFY_FAIL_COUNT;
  const isMaxAttemptsReached = codeVerifyFailCount >= MAX_VERIFY_FAIL_COUNT;
  const isMaxSendReached = codeSendCount >= MAX_SEND_COUNT;
  const showLastAttemptWarning = codeVerifyFailCount === 4 && codeVerifyFailCount < MAX_VERIFY_FAIL_COUNT;

  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-center relative w-full">
          <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Email label */}
              <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full">
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-start justify-end relative text-[#4a3c2a]">
                    <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px]">
                      Enter the<span>{` 6-digital code sent to`}</span>
                    </p>
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px]">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Countdown or expired message */}
              {isMaxSendReached ? (
                <div className="content-stretch flex font-['Comfortaa:Medium',sans-serif] font-medium gap-[8px] items-end relative shrink-0 w-full">
                  <p className="flex-[1_0_0] leading-[0] min-h-px min-w-px relative shrink-0 text-[#4a3c2a] text-[0px] whitespace-pre-wrap">
                    <span className="leading-[17.5px] text-[12px]">Enter the</span>
                    <span className="leading-[17.5px] text-[12px]">
                      {` 6-digital code sent to`}
                      <br aria-hidden="true" />
                    </span>
                    <span className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] text-[14px]">{email}</span>
                  </p>
                  <p className="leading-[17.5px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.8)]">
                    Code expired.
                  </p>
                </div>
              ) : (
                <p className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] min-w-full relative shrink-0 text-[12px] text-center w-min whitespace-pre-wrap ${
                  error && error.includes("Wrong code") ? "text-[#de1507]" : "text-[#de6a07]"
                }`}>
                  {countdown > 0 ? (
                    <>
                      <span>Expired in </span>
                      <span className="[text-underline-position:from-font] decoration-solid underline">
                        {countdown}
                      </span>
                      <span> secondes</span>
                    </>
                  ) : (
                    <span>Code expired.</span>
                  )}
                </p>
              )}

              {/* Verification code input */}
              {!isMaxSendReached && (
                <>
                  <VerificationCodeInput
                    code={verificationCode}
                    onChange={setVerificationCode}
                    error={error && error.includes("Wrong code") ? error : undefined}
                  />

                  {/* Error message */}
                  {error && (
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      {error.includes("Wrong code") && (
                        <div className="relative shrink-0 size-[12px]">
                          {/* Wrong code icon - red circle with X */}
                          <div className="absolute aspect-[29/29] left-0 right-0 top-0">
                            <div className="bg-[#de1507] rounded-full size-full" />
                          </div>
                          <div className="absolute inset-1/4 text-white text-[8px] flex items-center justify-center">
                            ×
                          </div>
                        </div>
                      )}
                      {error === "Enter your code." && (
                        <div className="relative shrink-0 size-[12px]">
                          {/* Wrong code icon */}
                          <div className="absolute aspect-[29/29] left-0 right-0 top-0">
                            <div className="bg-[#de1507] rounded-full size-full" />
                          </div>
                          <div className="absolute inset-1/4 text-white text-[8px] flex items-center justify-center">
                            ×
                          </div>
                        </div>
                      )}
                      <p className={`font-['Comfortaa:${error === "Enter your code." ? "Medium" : "Regular"}',sans-serif] ${
                        error === "Enter your code." ? "font-medium" : "font-normal"
                      } leading-[17.5px] relative shrink-0 text-[12px] ${
                        error.includes("Wrong code") || error === "Enter your code." ? "text-[#de1507]" : "text-[#de1507]"
                      }`}>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Last attempt warning */}
                  {showLastAttemptWarning && (
                    <div className="bg-[#fffbed] border border-[#e8b600] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full">
                      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="relative shrink-0 size-[12px]">
                            {/* Alert icon */}
                            <div className="absolute h-[16px] left-[-16.67%] right-[-16.67%] top-[-1px]">
                              <div className="absolute bottom-1/4 left-[11.26%] right-[11.26%] top-[6.25%]">
                                <div className="bg-[#e8b600] w-full h-full" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                              </div>
                            </div>
                            <div className="absolute h-[7.82px] left-[5.5px] top-[2.18px] w-[1.23px] text-[#b08a00] text-[10px] font-bold">
                              !
                            </div>
                          </div>
                          <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#b08a00] text-[10px]">
                            1 attempt left. Verify your email adresse and resend code.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Max attempts error */}
                  {isMaxAttemptsReached && (
                    <div className="border border-[#de1507] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full">
                      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                          <div className="relative shrink-0 size-[12px]">
                            {/* Error icon */}
                            <div className="absolute aspect-[29/29] left-0 right-0 top-0">
                              <div className="bg-[#de1507] rounded-full size-full" />
                            </div>
                            <div className="absolute h-[7.82px] left-[5.5px] top-[2.18px] w-[1.23px] text-white text-[10px] font-bold">
                              !
                            </div>
                          </div>
                          <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#de1507] text-[10px]">
                            For security reason. Please contact us to reset your password.
                          </p>
                        </div>
                      </div>
                    </div>
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
                    {codeResent ? (
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0">
                        <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
                          <div className="flex-none rotate-[90deg]">
                            <div className="relative size-[12px]">
                              {/* Success icon - green circle with checkmark */}
                              <div className="absolute aspect-[29/29] left-0 right-0 top-0">
                                <div className="bg-[#6aa31c] rounded-full size-full" />
                              </div>
                              <div className="absolute h-[5.742px] left-[1.75px] top-[3.75px] w-[8.494px] text-white text-[8px] flex items-center justify-center">
                                ✓
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                          Code resent
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleResendCode}
                        disabled={!canResend || isResending || isLoading}
                        className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                          Resend code
                        </p>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* Max send reached - show resend button */}
              {isMaxSendReached && (
                <ButtonMediumPrincipalOrange
                  onClick={handleResendCode}
                  disabled={isResending || isLoading}
                  isLoading={isResending}
                  text="Resend code"
                />
              )}
            </div>

            {/* Submit button */}
            {!isMaxSendReached && (
              <ButtonMediumPrincipalOrange
                onClick={handleSubmit}
                disabled={!isCodeComplete || isLoading || isMaxAttemptsReached || isSubmitting}
                isLoading={isLoading || isSubmitting}
                text={isMaxAttemptsReached ? "Contact" : "Submit"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


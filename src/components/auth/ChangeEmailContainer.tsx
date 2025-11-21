import { useState } from "react";
import React from "react";
import { CustomInput } from "@/components/common/CustomInput";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { sendPasswordResetCode } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { validateEmail } from "./authStore";

interface ChangeEmailContainerProps {
  email: string;
  setEmail: (email: string) => void;
  onContinue: () => void;
  isLoading?: boolean;
  setCodeSendCount: (count: number) => void;
}

export function ChangeEmailContainer({
  email,
  setEmail,
  onContinue,
  isLoading = false,
  setCodeSendCount,
}: ChangeEmailContainerProps) {
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleEmailBlur = () => {
    if (email) {
      const result = validateEmail(email);
      if (!result.success && result.error) {
        setEmailError(result.error);
      }
    }
  };

  const handleContinue = async () => {
    // Validate email
    const result = validateEmail(email);
    if (!result.success && result.error) {
      setEmailError(result.error);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetCode(email);
      setCodeSendCount(1); // First send
      toast.success("Verification code sent to your email.");
      onContinue();
    } catch (err) {
      if (err instanceof HttpError) {
        setEmailError(err.message || "Failed to send verification code.");
      } else {
        setEmailError("Failed to send verification code. Please try again.");
      }
      toast.error("Failed to send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <CustomInput
                label="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Enter your email"
                error={emailError}
                disabled={isLoading}
                type="email"
              />
            </div>
            <ButtonMediumPrincipalOrange
              onClick={handleContinue}
              disabled={!email || !!emailError || isLoading || isSubmitting}
              isLoading={isLoading || isSubmitting}
              text="Continue"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


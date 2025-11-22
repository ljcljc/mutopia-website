import { useState } from "react";
import React from "react";
import { CustomInput } from "@/components/common/CustomInput";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { checkEmailRegistered } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { validateEmail } from "./authStore";

interface ChangeEmailContainerProps {
  email: string;
  setEmail: (email: string) => void;
  onContinue: (isRegistered: boolean) => void;
  isLoading?: boolean;
}

export function ChangeEmailContainer({
  email,
  setEmail,
  onContinue,
  isLoading = false,
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
    // Step 1: Frontend validation
    const result = validateEmail(email);
    if (!result.success && result.error) {
      setEmailError(result.error);
      return;
    }

    // Step 2: Check if email is registered
    setIsSubmitting(true);
    setEmailError(""); // Clear any previous errors

    try {
      const response = await checkEmailRegistered(email);
      
      // Step 3: Navigate based on registration status
      if (response.exists) {
        // Email is registered - navigate to login (password step)
        onContinue(true);
      } else {
        // Email is not registered - navigate to sign up
        onContinue(false);
      }
    } catch (err) {
      // Handle different types of errors
      let errorMessage = "Something went wrong. Please try again.";
      
      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid email address.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Email verification failed. Please try again.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      }
      
      setEmailError(errorMessage);
      toast.error(errorMessage);
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


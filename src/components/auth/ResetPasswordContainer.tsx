import { useState } from "react";
import { PasswordInput } from "./LoginModalContainers";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { resetPassword } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { validateResetPasswordForm } from "./authStore";

interface ResetPasswordContainerProps {
  password: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  onReset: () => void;
  resetToken: string;
  email?: string; // Optional, not used in validation but kept for API compatibility
  isLoading?: boolean;
}

export function ResetPasswordContainer({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  showPassword: _showPassword,
  toggleShowPassword: _toggleShowPassword,
  onReset,
  resetToken,
  email: _email,
  isLoading = false,
}: ResetPasswordContainerProps) {
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  // Independent show/hide state for each password field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError("");
  };

  const handlePasswordBlur = () => {
    const result = validateResetPasswordForm({
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const passwordErr = result.error.issues.find((e) => e.path.includes("password"));
      if (passwordErr) {
        setPasswordError(passwordErr.message);
      }
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    const result = validateResetPasswordForm({
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const confirmPasswordErr = result.error.issues.find((e) =>
        e.path.includes("confirmPassword")
      );
      if (confirmPasswordErr) {
        setConfirmPasswordError(confirmPasswordErr.message);
      }
    } else {
      setConfirmPasswordError("");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async () => {
    // Validate form
    const result = validateResetPasswordForm({
      password,
      confirmPassword,
    });

    if (!result.success && result.error) {
      result.error.issues.forEach((err) => {
        if (err.path.includes("password")) {
          setPasswordError(err.message);
        }
        if (err.path.includes("confirmPassword")) {
          setConfirmPasswordError(err.message);
        }
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({
        vs_token: resetToken,
        password1: password,
        password2: confirmPassword,
      });

      toast.success("Your password is reset. You can log in with this new password.");
      onReset();
    } catch (err) {
      if (err instanceof HttpError) {
        const errorMessage = err.message || "Failed to reset password. Please try again.";
        toast.error(errorMessage);
        if (err.status === 400) {
          setPasswordError(errorMessage);
        }
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-start relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.8)]">
                Reset your password.
              </p>
              <PasswordInput
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                hasError={!!passwordError}
                label="Password"
                showLabel={true}
              />
              {passwordError && (
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px]">
                  {passwordError}
                </p>
              )}
              <PasswordInput
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                hasError={!!confirmPasswordError}
                label="Confirm password"
                showLabel={true}
              />
              {confirmPasswordError && (
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#de1507] text-[12px]">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <ButtonMediumPrincipalOrange
              onClick={handleResetPassword}
              disabled={!password || !confirmPassword || !!passwordError || !!confirmPasswordError || isLoading || isSubmitting}
              isLoading={isLoading || isSubmitting}
              text="Reset password"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";
import {
  useAuthStore,
  validateEmail,
  validateLoginForm,
  validateSignUpForm,
} from "@/components/auth/authStore";
import {
  checkEmailRegistered,
  sendCode,
  registerComplete,
  getCurrentUser,
  loginPasswordCheck,
  sendPasswordResetCode,
} from "@/lib/api";
import { HttpError } from "@/lib/http";
import { WelcomeToMutopiaPet } from "./LoginModalUI";
import { EmailStepContainer } from "./LoginModalForms";
import {
  PasswordContainer,
  SignUpContainer,
} from "./LoginModalContainers";
import { VerifyEmailContainer } from "./VerifyEmailContainer";
import { ForgotPasswordContainer } from "./ForgotPasswordContainer";
import { ChangeEmailContainer } from "./ChangeEmailContainer";
import { ResetPasswordContainer } from "./ResetPasswordContainer";

export function ModalContent({ onClose }: { onClose: () => void }) {
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
    verificationCode,
    verificationMode,
    codeSendCount,
    codeVerifyFailCount,
    resetPasswordToken,
    passwordResetSuccess,
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
    setVerificationCode,
    setVerificationMode,
    setCodeSendCount,
    setCodeVerifyFailCount,
    setResetPasswordToken,
    setPasswordResetSuccess,
    setIsEmailFocused,
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

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const rememberedEmail = localStorage.getItem("remembered_email");
      const rememberedPassword = localStorage.getItem("remembered_password");
      if (rememberedEmail && rememberedPassword) {
        setEmail(rememberedEmail);
        setPassword(rememberedPassword);
        setRememberMe(true);
      }
    } catch (e) {
      console.warn("Failed to load remembered credentials:", e);
    }
  }, [setEmail, setPassword, setRememberMe]);

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
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
          toast.error(errorMessage);
        } else if (errorStatus === 500) {
          errorMessage = "Server error. Please try again later.";
          toast.error(errorMessage);
        } else if (errorStatus >= 400 && errorStatus < 500) {
          // Client errors (4xx)
          errorMessage =
            err.message || "Invalid request. Please check your input.";
          setEmailError(errorMessage);
        } else if (errorStatus === 0) {
          // Network errors (status 0)
          errorMessage =
            err.message ||
            "Network error. Please check your internet connection.";
          toast.error(errorMessage);
        } else {
          // Other HTTP errors
          errorMessage = err.message || errorMessage;
          toast.error(errorMessage);
        }
      } else if (err instanceof Error) {
        // Handle other Error types
        if (err.message.includes("Network error")) {
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
    // If confirm password is already entered, re-validate it when password changes
    if (confirmPassword && step === "signup") {
      if (value !== confirmPassword) {
        setConfirmPasswordError("Password doesn't match");
      } else {
        setConfirmPasswordError("");
      }
    }
  };

  const handlePasswordBlur = () => {
    // Always validate on blur, even if empty (to show required field errors)
    if (step === "signup") {
      // For signup, use strong password validation
      const result = validateSignUpForm({
        email,
        firstName,
        lastName,
        birthday,
        address,
        password,
        confirmPassword,
      });
      if (!result.success && result.error) {
        const passwordError = result.error.issues.find((e: z.ZodIssue) =>
          e.path.includes("password")
        );
        if (passwordError) {
          setPasswordError(passwordError.message);
        } else {
          setPasswordError("");
        }
      } else {
        setPasswordError("");
      }
    } else {
      // For login, use basic password validation
      const result = validateLoginForm({ email, password, rememberMe });
      if (!result.success && result.error) {
        const passwordError = result.error.issues.find((e: z.ZodIssue) =>
          e.path.includes("password")
        );
        if (passwordError) {
          setPasswordError(passwordError.message);
        } else {
          setPasswordError("");
        }
      } else {
        setPasswordError("");
      }
    }
  };

  const handleConfirmPasswordBlur = () => {
    // Always validate on blur, even if empty (to show required field errors)
    const result = validateSignUpForm({
      email,
      firstName,
      lastName,
      birthday,
      address,
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const confirmPasswordError = result.error.issues.find((e: z.ZodIssue) =>
        e.path.includes("confirmPassword")
      );
      if (confirmPasswordError) {
        setConfirmPasswordError(confirmPasswordError.message);
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleFirstNameBlur = () => {
    // Always validate on blur, even if empty (to show required field errors)
    const result = validateSignUpForm({
      email,
      firstName,
      lastName,
      birthday,
      address,
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const firstNameError = result.error.issues.find((e: z.ZodIssue) =>
        e.path.includes("firstName")
      );
      if (firstNameError) {
        setFirstNameError(firstNameError.message);
      } else {
        setFirstNameError("");
      }
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameBlur = () => {
    // Always validate on blur, even if empty (to show required field errors)
    const result = validateSignUpForm({
      email,
      firstName,
      lastName,
      birthday,
      address,
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const lastNameError = result.error.issues.find((e: z.ZodIssue) =>
        e.path.includes("lastName")
      );
      if (lastNameError) {
        setLastNameError(lastNameError.message);
      } else {
        setLastNameError("");
      }
    } else {
      setLastNameError("");
    }
  };

  const handleBirthdayBlur = (value?: string) => {
    // Only validate birthday field, don't validate other fields
    // This prevents triggering validation errors for other fields (like address)
    // when the user is just selecting a date
    try {
      const birthdaySchema = z
        .string()
        .min(1, "Date of birth is required")
        .refine(
          (date) => {
            // Validate date format and age (at least 18 years old)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) return false;
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              return age - 1 >= 18;
            }
            return age >= 18;
          },
          {
            message: "You must be at least 18 years old",
          }
        );

      const birthdayValue = value ?? birthday;
      birthdaySchema.parse(birthdayValue);
      setBirthdayError("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setBirthdayError(error.issues[0]?.message || "Invalid date of birth");
      } else {
        setBirthdayError("");
      }
    }
  };

  const handleAddressBlur = () => {
    // Always validate on blur, even if empty (to show required field errors)
    const result = validateSignUpForm({
      email,
      firstName,
      lastName,
      birthday,
      address,
      password,
      confirmPassword,
    });
    if (!result.success && result.error) {
      const addressError = result.error.issues.find((e: z.ZodIssue) =>
        e.path.includes("address")
      );
      if (addressError) {
        setAddressError(addressError.message);
      } else {
        setAddressError("");
      }
    } else {
      setAddressError("");
    }
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

    // Step 1: Check password
    setIsLoading(true);
    try {
      setPasswordError("");
      const response = await loginPasswordCheck({ email, password });

      if (!response.ok) {
        const errorMessage =
          response.detail || "Incorrect email or password. Please try again.";
        setPasswordError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      // Step 2: Send verification code for login
      try {
        await sendCode({ email, purpose: "login" });
        toast.success("Verification code sent to your email. Please check your inbox.");
      } catch (sendCodeError) {
        // If code was already sent recently, that's okay, continue
        if (sendCodeError instanceof HttpError) {
          if (sendCodeError.status === 400) {
            // Code might have been sent already, continue
            console.log("Verification code may have been sent already");
          } else {
            throw sendCodeError;
          }
        } else {
          throw sendCodeError;
        }
      }

      // Step 3: Navigate to verification email step for login
      setVerificationMode("login");
      setStep("verify-email");
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid email or password.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Unable to log in. Please check your credentials.";
        } else if (err.status === 0) {
          errorMessage = err.message || "Network error. Please try again.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setPasswordError(errorMessage);
      toast.error(errorMessage);
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
      confirmPassword,
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

    setIsLoading(true);
    try {
      // Send verification code
      try {
        await sendCode({ email, purpose: "register" });
        toast.success("Verification code sent to your email. Please check your inbox.");
      } catch (sendCodeError) {
        // If code was already sent recently, that's okay, continue
        if (sendCodeError instanceof HttpError) {
          if (sendCodeError.status === 400) {
            // Code might have been sent already, continue
            console.log("Verification code may have been sent already");
          } else {
            throw sendCodeError;
          }
        } else {
          throw sendCodeError;
        }
      }

      // Navigate to verification email step
      setStep("verify-email");
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid input. Please check your information.";
        } else if (err.status === 409) {
          errorMessage = "Email already registered. Please login instead.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Invalid request. Please check your information.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
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

  const handleForgotPassword = async () => {
    // Navigate to forgot password flow - start with email input
    // Don't reset codeSendCount and codeVerifyFailCount if already in forgot password flow
    // Only reset if starting fresh
    if (step !== "forgot-password" && step !== "change-email" && step !== "reset-password") {
      setCodeSendCount(0);
      setCodeVerifyFailCount(0);
      setResetPasswordToken(null);
      setVerificationCode(["", "", "", "", "", ""]);
      
      // Send verification code immediately when entering forgot password flow
      // Use a separate async operation that doesn't affect the login button state
      // Navigate first, then send code in background
      setStep("forgot-password");
      setVerificationMode("forgot-password");
      
      // Send code after navigation (doesn't affect login button)
      try {
        await sendPasswordResetCode(email);
        setCodeSendCount(1); // First send
        toast.success("Verification code sent to your email.");
      } catch (err) {
        if (err instanceof HttpError) {
          toast.error(err.message || "Failed to send verification code.");
        } else {
          toast.error("Failed to send verification code. Please try again.");
        }
        console.error("Error sending password reset code:", err);
      }
    } else {
      setStep("forgot-password");
      setVerificationMode("forgot-password");
    }
  };

  const handleTogglePassword = () => {
    toggleShowPassword();
  };

  const handleBack = () => {
    if (step === "verify-email") {
      if (verificationMode === "login") {
        setStep("password");
      } else if (verificationMode === "forgot-password") {
        setStep("forgot-password");
      } else {
        setStep("signup");
      }
      // Don't clear verification code when going back, keep user input
    } else if (step === "forgot-password") {
      // From forgot-password, go back to password (login) step
      // This is the entry point from login, so return to login
      setStep("password");
      // Don't clear verification code, keep user input
    } else if (step === "change-email") {
      // From change-email, go back to forgot-password
      setStep("forgot-password");
    } else if (step === "reset-password") {
      setStep("forgot-password");
      // Don't clear password fields, keep user input
    } else if (step === "password") {
      setStep("email");
      // Don't clear password, keep user input (especially if rememberMe is checked)
    } else if (step === "signup") {
      setStep("email");
      // Don't clear signup form data, keep user input
    } else {
      setStep("email");
      // Only clear password when going back to email from other flows
      if (verificationMode !== "login") {
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");
      }
    }
  };

  const handleClose = () => {
    // Clear password reset success flag when closing modal
    if (passwordResetSuccess) {
      setPasswordResetSuccess(false);
    }
    
    // Navigate back to previous step instead of closing modal
    // All state (password, rememberMe, etc.) is preserved when navigating
    if (step === "change-email") {
      // From change-email, go back to forgot-password
      setStep("forgot-password");
    } else if (step === "forgot-password") {
      // From forgot-password, return to password step (log in) and keep all state
      // This handles the case when user came from login step
      setStep("password");
    } else if (step === "reset-password") {
      setStep("forgot-password");
    } else if (step === "verify-email") {
      if (verificationMode === "login") {
        setStep("password");
      } else if (verificationMode === "forgot-password") {
        setStep("forgot-password");
      } else {
        setStep("signup");
      }
    } else if (step === "password") {
      setStep("email");
    } else if (step === "signup") {
      setStep("email");
    } else {
      // Only close modal when in email step
      onClose();
    }
  };

  const handleVerifyEmail = async (vsToken: string) => {
    // For login mode, the login API is already called in VerifyEmailContainer
    // This function is only called for signup mode now
    if (verificationMode === "login") {
      // Login flow is handled in VerifyEmailContainer, so this should not be called
      // But we keep it for compatibility
      return;
    }

    setIsLoading(true);
    try {
      // Signup flow: Complete registration with vs_token
      await registerComplete({
        vs_token: vsToken,
        first_name: firstName,
        last_name: lastName,
        birthday: birthday,
        address: address,
        receive_marketing_message: !optOutMarketing,
        password1: password,
        password2: confirmPassword,
      });

      // Get user information and update state
      const userInfo = await getCurrentUser();
      const user = {
        name: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim(),
        email: userInfo.email,
      };

      login(user);
      toast.success("Sign up successful!");

      setTimeout(() => {
        reset();
        onClose();
      }, 500);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid input. Please check your information.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Invalid request. Please check your information.";
        } else {
          errorMessage = err.message || "Server error. Please try later.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      console.error(`Error during ${verificationMode}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login success callback (called from VerifyEmailContainer)
  const handleLoginSuccess = async () => {
    setIsLoading(true);
    try {
      // Get user information and update state
      const userInfo = await getCurrentUser();
      const user = {
        name: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() || email.split("@")[0],
        email: userInfo.email,
      };

      login(user);
      toast.success("Login successful!");

      // Save password if rememberMe is checked
      if (rememberMe) {
        try {
          localStorage.setItem("remembered_email", email);
          localStorage.setItem("remembered_password", password);
        } catch (e) {
          console.warn("Failed to save remembered credentials:", e);
        }
      } else {
        // Clear remembered credentials if not checked
        try {
          localStorage.removeItem("remembered_email");
          localStorage.removeItem("remembered_password");
        } catch (e) {
          console.warn("Failed to clear remembered credentials:", e);
        }
      }

      setTimeout(() => {
        reset();
        onClose();
      }, 500);
    } catch (err) {
      let errorMessage = "Something went wrong. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid input. Please check your information.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Invalid request. Please check your information.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      console.error("Error during login:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    if (verificationMode === "login") {
      setStep("password");
    } else if (verificationMode === "forgot-password") {
      setStep("change-email");
    } else {
      setStep("signup");
    }
    // Don't clear verification code when changing email, keep user input
  };

  const handleForgotPasswordVerify = (resetToken: string) => {
    setResetPasswordToken(resetToken);
    // Clear password fields when entering reset password step
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setConfirmPasswordError("");
    setStep("reset-password");
  };

  const handleChangeEmailContinue = () => {
    setStep("forgot-password");
  };

  const handleResetPasswordComplete = () => {
    // Reset all state and go back to email step
    reset();
    setStep("email");
    // Set success flag after reset to show alert
    // Alert will persist until modal is closed
    setPasswordResetSuccess(true);
  };

  const title =
    step === "email"
      ? "Log in or sign up"
      : step === "signup"
        ? "Sign up"
        : step === "verify-email"
          ? "Verify your email"
          : step === "forgot-password"
            ? "Forgot password"
            : step === "change-email"
              ? "Change email address"
              : step === "reset-password"
                ? "Reset password"
                : "Log in";
  const showBackButton = step === "password" || step === "signup" || step === "verify-email" || step === "forgot-password" || step === "change-email" || step === "reset-password";

  return (
    <div
      className={`bg-white box-border flex flex-col items-start relative rounded-[20px] w-[420px] max-w-[calc(100vw-32px)] ${
        step === "signup"
          ? "max-h-[90vh] overflow-hidden flex"
          : "content-stretch gap-[16px] pb-[32px] pt-[12px] px-0"
      }`}
      data-name={
        step === "email" ? "Modal_Log in or sign up_default" : "Modal_log in"
      }
    >
      <div
        aria-hidden="true"
        className="absolute border border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      />
      {step === "signup" ? (
        <>
          {/* Fixed header for signup */}
          <div className="shrink-0 pt-[12px] pb-[16px] px-0 w-full">
            <WelcomeToMutopiaPet
              onClose={handleClose}
              onBack={showBackButton ? handleBack : undefined}
              title={title}
              showRequired={step === "signup"}
            />
          </div>
          {/* Scrollable content for signup */}
          <div className="flex-1 overflow-y-auto w-full min-h-0">
            <div className="flex flex-col gap-[16px] items-start pb-[32px] px-0 w-full">
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
                onBlur={handlePasswordBlur}
                onConfirmPasswordBlur={handleConfirmPasswordBlur}
                onFirstNameBlur={handleFirstNameBlur}
                onLastNameBlur={handleLastNameBlur}
                onBirthdayBlur={handleBirthdayBlur}
                onAddressBlur={handleAddressBlur}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-[16px] items-start pb-[32px] pt-[12px] px-0 w-full">
          <WelcomeToMutopiaPet
            onClose={handleClose}
            onBack={showBackButton ? handleBack : undefined}
            title={title}
            showRequired={false}
          />

          {step === "email" ? (
            <>
              {/* Success message after password reset */}
              {passwordResetSuccess && (
                <div className="px-[24px] w-full">
                  <div className="bg-[#f4ffde] border border-[#6aa31c] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full mb-[16px]">
                    <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                        <div className="relative shrink-0 size-[12px]">
                          {/* Success icon - green circle with checkmark */}
                          <div className="absolute aspect-square left-0 right-0 top-0">
                            <div className="bg-[#6aa31c] rounded-full size-full" />
                          </div>
                          <div className="absolute h-[5.742px] left-[1.75px] top-[3.75px] w-[8.494px] text-white text-[8px] flex items-center justify-center">
                            ✓
                          </div>
                        </div>
                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#467900] text-[10px]">
                          Your password is reset. You can log in with this new password.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <EmailStepContainer
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
            </>
          ) : step === "verify-email" ? (
            <VerifyEmailContainer
              email={email}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              onVerify={handleVerifyEmail}
              onChangeEmail={handleChangeEmail}
              isLoading={isLoading}
              mode={verificationMode}
              password={verificationMode === "login" ? password : undefined}
              onLoginSuccess={verificationMode === "login" ? handleLoginSuccess : undefined}
            />
          ) : step === "forgot-password" ? (
            <ForgotPasswordContainer
              email={email}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              onVerify={handleForgotPasswordVerify}
              onChangeEmail={handleChangeEmail}
              isLoading={isLoading}
              codeSendCount={codeSendCount}
              codeVerifyFailCount={codeVerifyFailCount}
              setCodeSendCount={setCodeSendCount}
              setCodeVerifyFailCount={setCodeVerifyFailCount}
            />
          ) : step === "change-email" ? (
            <ChangeEmailContainer
              email={email}
              setEmail={setEmail}
              onContinue={handleChangeEmailContinue}
              isLoading={isLoading}
              setCodeSendCount={setCodeSendCount}
            />
          ) : step === "reset-password" ? (
            <ResetPasswordContainer
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
              onReset={handleResetPasswordComplete}
              resetToken={resetPasswordToken || ""}
              email={email}
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
              isSignUp={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

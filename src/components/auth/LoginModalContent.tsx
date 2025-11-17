import { toast } from "sonner";
import { z } from "zod";
import {
  useAuthStore,
  validateEmail,
  validateLoginForm,
  validateSignUpForm,
} from "@/components/auth/authStore";
import { checkEmailRegistered } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { WelcomeToMutopiaPet } from "./LoginModalUI";
import { Container } from "./LoginModalForms";
import {
  PasswordContainer,
  SignUpContainer,
} from "./LoginModalContainers";

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

  const handleBirthdayBlur = () => {
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
      const birthdayError = result.error.issues.find((e: z.ZodIssue) =>
        e.path.includes("birthday")
      );
      if (birthdayError) {
        setBirthdayError(birthdayError.message);
      } else {
        setBirthdayError("");
      }
    } else {
      setBirthdayError("");
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

    // Mock API call to sign up
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Sign up successful!");

      const capitalizedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const capitalizedLastName =
        lastName.charAt(0).toUpperCase() + lastName.slice(1);

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

  const title =
    step === "email"
      ? "Log in or sign up"
      : step === "signup"
        ? "Sign up"
        : "Log in";
  const showBackButton = step === "password" || step === "signup";

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
              onClose={onClose}
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
            onClose={onClose}
            onBack={showBackButton ? handleBack : undefined}
            title={title}
            showRequired={false}
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


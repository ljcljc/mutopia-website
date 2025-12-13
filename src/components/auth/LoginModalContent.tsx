import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";
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
  socialLogin,
} from "@/lib/api";
import {
  initializeGoogleAuth,
  decodeGoogleIdToken,
  GoogleCredentialResponse,
  GoogleErrorResponse,
} from "@/lib/googleAuth";
import {
  initializeFacebookAuth,
  loginWithFacebook,
  getFacebookUserInfo,
} from "@/lib/facebookAuth";
import { featureFlags, thirdPartyConfig } from "@/lib/env";
import { HttpError } from "@/lib/http";
import {
  saveEncryptedItem,
  getEncryptedItem,
  removeEncryptedItem,
} from "@/lib/encryption";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { WelcomeToMutopiaPet } from "./LoginModalUI";
import { EmailStepContainer } from "./LoginModalForms";
import { Icon } from "@/components/common/Icon";
import {
  PasswordContainer,
  SignUpContainer,
} from "./LoginModalContainers";
import { VerifyEmailContainer } from "./VerifyEmailContainer";
import { ForgotPasswordContainer } from "./ForgotPasswordContainer";
import { ChangeEmailContainer } from "./ChangeEmailContainer";
import { ResetPasswordContainer } from "./ResetPasswordContainer";
import { getSendCountFromError } from "./forgotPasswordUtils";

// Maximum number of times a verification code can be sent
const MAX_SEND_COUNT = 5;

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
    forgotPasswordEmail,
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
    setForgotPasswordEmail,
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

  // Separate loading state for Google login (since it's async and uses popup)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // Separate loading state for Facebook login
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const rememberedEmail = await getEncryptedItem(STORAGE_KEYS.REMEMBERED_EMAIL);
        const rememberedPassword = await getEncryptedItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
        if (rememberedEmail && rememberedPassword) {
          setEmail(rememberedEmail);
          setPassword(rememberedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.warn("Failed to load remembered credentials:", e);
      }
    };
    
    loadRememberedCredentials();
  }, [setEmail, setPassword, setRememberMe]);

  // Initialize Google Auth on mount
  useEffect(() => {
    if (!featureFlags.socialLogin || !thirdPartyConfig.googleClientId) {
      return;
    }

    const initGoogleAuth = async () => {
      try {
        await initializeGoogleAuth(
          handleGoogleCredentialResponse,
          handleGoogleError
        );
      } catch (error) {
        console.warn("Failed to initialize Google Auth:", error);
      }
    };

    initGoogleAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize Facebook Auth on mount
  useEffect(() => {
    if (!featureFlags.socialLogin || !thirdPartyConfig.facebookAppId) {
      return;
    }

    const initFacebookAuth = async () => {
      try {
        await initializeFacebookAuth();
      } catch (error) {
        console.warn("Failed to initialize Facebook Auth:", error);
      }
    };

    initFacebookAuth();
  }, []);

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
      } else {
      // Email is not registered - navigate to sign up
      console.log("Email is not registered, navigating to sign up");
      // Clear password fields when switching to signup to prevent auto-fill from login
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setConfirmPasswordError("");
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

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response: GoogleCredentialResponse) => {
    // Only use isGoogleLoading to avoid affecting Continue button
    // Keep isGoogleLoading true throughout the entire process
    try {
      // Decode the ID token to get user information
      const decodedToken = decodeGoogleIdToken(response.credential);
      
      // Extract user information
      const firstName = decodedToken.given_name || null;
      const lastName = decodedToken.family_name || null;
      const email = decodedToken.email;
      // Google ID token may contain birthdate in YYYY-MM-DD format
      const birthday = decodedToken.birthdate || null;

      // Call social login API (isGoogleLoading is already true from button click)
      await socialLogin({
        provider: "google",
        id_token: response.credential,
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        birthday: birthday,
      });

      // Get user information from backend
      const userInfo = await getCurrentUser();
      const user = {
        name: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() || email.split("@")[0],
        email: userInfo.email,
      };

      // Update auth store
      login(user);
      useAuthStore.getState().setUserInfo(userInfo);
      toast.success("Login successful!");

      // Close modal after a short delay
      setTimeout(() => {
        reset();
        onClose();
      }, 500);
    } catch (err) {
      let errorMessage = "Google login failed. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 0) {
          // 网络连接错误
          errorMessage =
            err.message ||
            "Network error: Unable to connect to the server. Please check your internet connection and try again.";
        } else if (err.status === 400) {
          errorMessage = err.message || "Invalid Google account. Please try again.";
        } else if (err.status === 408) {
          errorMessage = "Request timeout. Please check your internet connection and try again.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Authentication failed. Please try again.";
        } else if (err.status >= 500) {
          errorMessage = err.message || "Server error. Please try again later.";
        } else {
          errorMessage = err.message || "An error occurred. Please try again.";
        }
      } else if (err instanceof Error) {
        // 检查是否是网络相关错误
        if (
          err.message.includes("Network error") ||
          err.message.includes("Connection") ||
          err.message.includes("fetch")
        ) {
          errorMessage =
            "Network error: Unable to connect to the server. Please check your internet connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
      console.error("Error during Google login:", err);
    } finally {
      // Only clear Google loading state, don't touch isLoading
      setIsGoogleLoading(false);
    }
  };

  // Handle Google error response
  const handleGoogleError = (error: GoogleErrorResponse) => {
    console.error("Google authentication error:", error);
    setIsGoogleLoading(false);
    toast.error("Google login was cancelled or failed. Please try again.");
  };

  const handleGoogleClick = () => {
    if (!featureFlags.socialLogin) {
      toast.error("Social login is not enabled.");
      return;
    }

    if (!thirdPartyConfig.googleClientId) {
      toast.error("Google login is not configured.");
      return;
    }

    // Set loading state when user clicks the button
    setIsGoogleLoading(true);

    try {
      // Google Identity Services types
      interface GoogleAccounts {
        id: {
          renderButton: (
            element: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
            }
          ) => void;
        };
      }
      interface GoogleWindow extends Window {
        google?: {
          accounts: GoogleAccounts;
        };
      }
      const google = (window as GoogleWindow).google;
      if (!google || !google.accounts || !google.accounts.id) {
        setIsGoogleLoading(false);
        toast.error("Google authentication is not available. Please refresh the page.");
        return;
      }

      // Debug: Log current origin for troubleshooting
      console.log("[Google Login] Current origin:", window.location.origin);
      console.log("[Google Login] Client ID:", thirdPartyConfig.googleClientId);

      // Use Google OAuth2 flow instead of programmatic button click
      // This avoids issues with DevTools auto-opening
      // Create a temporary visible button that will be clicked by user interaction
      const tempDiv = document.createElement("div");
      tempDiv.id = "google-signin-temp";
      tempDiv.style.position = "fixed";
      tempDiv.style.top = "50%";
      tempDiv.style.left = "50%";
      tempDiv.style.transform = "translate(-50%, -50%)";
      tempDiv.style.zIndex = "10000";
      document.body.appendChild(tempDiv);

      // Render the button (visible but will be auto-clicked)
      google.accounts.id.renderButton(tempDiv, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
      });

      // Use a more reliable method: dispatch a user-initiated event
      // Wait for button to render, then trigger with a proper user event
      setTimeout(() => {
        try {
          const button = tempDiv.querySelector("div[role='button']") as HTMLElement;
          if (button) {
            // Create a proper mouse event that simulates user interaction
            const mouseEvent = new MouseEvent("click", {
              view: window,
              bubbles: true,
              cancelable: true,
              buttons: 1,
            });
            button.dispatchEvent(mouseEvent);
            
            // Clean up immediately after triggering
            setTimeout(() => {
              if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
              }
            }, 100);
          } else {
            throw new Error("Google sign-in button not found");
          }
        } catch (clickError) {
          console.error("Error triggering Google login:", clickError);
          if (tempDiv.parentNode) {
            tempDiv.parentNode.removeChild(tempDiv);
          }
          setIsGoogleLoading(false);
          toast.error("Failed to start Google login. Please try again.");
        }
      }, 300);
    } catch (error) {
      console.error("Error triggering Google login:", error);
      setIsGoogleLoading(false);
      toast.error("Failed to start Google login. Please try again.");
    }
  };

  // Handle Facebook login
  const handleFacebookClick = async () => {
    if (!featureFlags.socialLogin) {
      toast.error("Social login is not enabled.");
      return;
    }

    if (!thirdPartyConfig.facebookAppId) {
      toast.error("Facebook login is not configured.");
      return;
    }

    // Set loading state when user clicks the button
    setIsFacebookLoading(true);

    try {
      // Trigger Facebook login
      const authResponse = await loginWithFacebook();
      
      if (authResponse.status === "connected" && authResponse.authResponse) {
        // Get user information from Facebook
        const userInfo = await getFacebookUserInfo(authResponse.authResponse.accessToken);
        
        // Check if email is a Facebook temporary email (fb_*@users.facebook.com)
        const isTemporaryEmail = userInfo.email && /^fb_\d+@users\.facebook\.com$/.test(userInfo.email);
        
        // Determine email to send: null if temporary email, otherwise use the actual email
        const emailToSend = isTemporaryEmail ? null : (userInfo.email || null);
        
        // Format birthday: Facebook returns MM/DD/YYYY, convert to YYYY-MM-DD if needed
        let birthdayFormatted: string | null = null;
        if (userInfo.birthday) {
          // Facebook birthday format: MM/DD/YYYY or YYYY-MM-DD
          // Check if it's MM/DD/YYYY format and convert to YYYY-MM-DD
          const birthdayMatch = userInfo.birthday.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
          if (birthdayMatch) {
            // Convert MM/DD/YYYY to YYYY-MM-DD
            const [, month, day, year] = birthdayMatch;
            birthdayFormatted = `${year}-${month}-${day}`;
          } else {
            // Already in YYYY-MM-DD format or other format, use as is
            birthdayFormatted = userInfo.birthday;
          }
        }
        
        if (isTemporaryEmail) {
          console.warn("[Facebook Login] Temporary email detected:", userInfo.email);
          // Don't pass email to backend if it's a temporary email
          // Backend should handle this case by using Facebook ID or other identifier
        }
        
        // Call social login API
        await socialLogin({
          provider: "facebook",
          access_token: authResponse.authResponse.accessToken,
          first_name: userInfo.first_name || null,
          last_name: userInfo.last_name || null,
          email: emailToSend,
          birthday: birthdayFormatted,
        });

        // Get user information from backend
        const backendUserInfo = await getCurrentUser();
        
        // Check if backend returned a temporary email
        const backendIsTemporaryEmail = backendUserInfo.email && /^fb_\d+@users\.facebook\.com$/.test(backendUserInfo.email);
        
        if (backendIsTemporaryEmail) {
          console.warn("[Facebook Login] Backend returned temporary email:", backendUserInfo.email);
          // You might want to show a message to the user or handle this case differently
        }
        
        const user = {
          name: `${backendUserInfo.first_name || ""} ${backendUserInfo.last_name || ""}`.trim() || userInfo.name || userInfo.email?.split("@")[0] || "",
          email: backendUserInfo.email,
        };

        // Update auth store
        login(user);
        useAuthStore.getState().setUserInfo(backendUserInfo);
        toast.success("Login successful!");

        // Close modal after a short delay
        setTimeout(() => {
          reset();
          onClose();
        }, 500);
      } else {
        throw new Error("Facebook login was cancelled or failed.");
      }
    } catch (err) {
      let errorMessage = "Facebook login failed. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid Facebook account. Please try again.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Authentication failed. Please try again.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      } else if (err instanceof Error) {
        // Check for specific Facebook errors
        if (err.message.includes("App not active") || err.message.includes("app is not accessible")) {
          errorMessage = "Facebook app is not active. Please check app settings or contact support. If you're a developer, make sure you've added yourself as a test user.";
        } else {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
      console.error("Error during Facebook login:", err);
    } finally {
      // Only clear Facebook loading state, don't touch isLoading
      setIsFacebookLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    console.log("[handleForgotPassword] START", {
      codeSendCount,
      MAX_SEND_COUNT,
      step,
      email,
      forgotPasswordEmail,
      "codeSendCount >= MAX_SEND_COUNT": codeSendCount >= MAX_SEND_COUNT,
    });

    // First, check if codeSendCount is already >= MAX_SEND_COUNT
    // This check must happen BEFORE any other logic to prevent sending code
    if (codeSendCount >= MAX_SEND_COUNT) {
      console.log("[handleForgotPassword] codeSendCount >= MAX_SEND_COUNT, skipping send code", {
        codeSendCount,
        MAX_SEND_COUNT,
      });
      // Navigate to forgot password step without sending code
      // The ForgotPasswordContainer will show the contact interface
      setStep("forgot-password");
      setVerificationMode("forgot-password");
      setForgotPasswordEmail(email);
      // Don't reset codeSendCount, keep it at MAX_SEND_COUNT to show contact interface
      setCodeVerifyFailCount(0);
      setResetPasswordToken(null);
      setVerificationCode(["", "", "", "", "", ""]);
      console.log("[handleForgotPassword] Early return, no code sent");
      return; // Early return to prevent sending code
    }

    console.log("[handleForgotPassword] codeSendCount < MAX_SEND_COUNT, proceeding", {
      codeSendCount,
      MAX_SEND_COUNT,
    });

    // Navigate to forgot password flow - start with email input
    // Don't reset codeSendCount and codeVerifyFailCount if already in forgot password flow
    // Only reset if starting fresh
    if (step !== "forgot-password" && step !== "change-email" && step !== "reset-password") {
      // Check if this is a different email (not null check, actual email comparison)
      // Only reset counts if we're switching to a DIFFERENT email (not null)
      // IMPORTANT: If forgotPasswordEmail is null, it means this is the first time entering the flow,
      // but the backend may already have a record. So we should NOT reset the count.
      // Only reset when explicitly switching to a different email.
      const isNewForgotPasswordEmail = forgotPasswordEmail !== null && forgotPasswordEmail !== email;
      console.log("[handleForgotPassword] Starting fresh", {
        step,
        isNewForgotPasswordEmail,
        forgotPasswordEmail,
        email,
        "willResetCounts": isNewForgotPasswordEmail,
      });

      if (isNewForgotPasswordEmail) {
        console.log("[handleForgotPassword] New email detected, resetting counts");
        // Reset counts when switching to a different email
        setCodeSendCount(0);
        setCodeVerifyFailCount(0);
        setResetPasswordToken(null);
        setVerificationCode(["", "", "", "", "", ""]);
      } else {
        console.log("[handleForgotPassword] Same email or first time, keeping counts", {
          forgotPasswordEmail,
          email,
          currentCodeSendCount: codeSendCount,
        });
      }

      // Double check before sending code (in case codeSendCount was updated)
      // Re-read codeSendCount from store to get the latest value (avoid closure issues)
      const latestCodeSendCount = useAuthStore.getState().codeSendCount;
      console.log("[handleForgotPassword] Before sending code, double check with latest value", {
        closureCodeSendCount: codeSendCount,
        latestCodeSendCount,
        MAX_SEND_COUNT,
        "shouldSend": latestCodeSendCount < MAX_SEND_COUNT,
      });
      
      if (latestCodeSendCount >= MAX_SEND_COUNT) {
        console.log("[handleForgotPassword] Already at max send count, navigate directly without sending", {
          latestCodeSendCount,
          MAX_SEND_COUNT,
        });
        // Already at max, navigate directly to show the error state
        setStep("forgot-password");
        setVerificationMode("forgot-password");
        setForgotPasswordEmail(email);
        return; // Don't send code if count is >= MAX_SEND_COUNT
      }
      
      // Send verification code BEFORE navigation to avoid flashing
      // This ensures the UI shows the correct state immediately when navigating
      console.log("[handleForgotPassword] Calling sendPasswordResetCode API");
      try {
        const response = await sendPasswordResetCode(email);
        console.log("[handleForgotPassword] sendPasswordResetCode success", {
          send_count: response.send_count,
        });
        // Use backend returned send_count instead of frontend calculation
        setCodeSendCount(response.send_count);
        setForgotPasswordEmail(email);
        
        // Navigate after getting the response to avoid flashing
        // This ensures the UI shows the correct state immediately
        setStep("forgot-password");
        setVerificationMode("forgot-password");
        
        // CRITICAL: Check if backend returned send_count >= MAX_SEND_COUNT
        // If so, we should not have sent the code, but since we already did,
        // we need to handle this case properly
        if (response.send_count >= MAX_SEND_COUNT) {
          console.log("[handleForgotPassword] WARNING: Backend returned send_count >= MAX_SEND_COUNT after sending code", {
            send_count: response.send_count,
            MAX_SEND_COUNT,
          });
          // Don't show success toast, as we've reached the limit
          // The ForgotPasswordContainer will show the contact interface based on codeSendCount
        } else {
          toast.success("Verification code sent to your email.");
        }
      } catch (err) {
        console.error("[handleForgotPassword] sendPasswordResetCode error", err);
        const sendCountFromError = getSendCountFromError(err);
        if (sendCountFromError !== null) {
          console.log("[handleForgotPassword] Extracted send_count from error", {
            sendCountFromError,
          });
          setCodeSendCount(sendCountFromError);
          setForgotPasswordEmail(email);
        }

        // Navigate even on error to show the correct state
        setStep("forgot-password");
        setVerificationMode("forgot-password");

        if (err instanceof HttpError) {
          toast.error(err.message || "Failed to send verification code.");
        } else {
          toast.error("Failed to send verification code. Please try again.");
        }
        console.error("Error sending password reset code:", err);
      }
    } else {
      console.log("[handleForgotPassword] Already in forgot password flow, just navigate", {
        step,
      });
      setStep("forgot-password");
      setVerificationMode("forgot-password");
      setForgotPasswordEmail(email);
    }
    
    console.log("[handleForgotPassword] END");
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
        // Clear password fields when going back to signup from verify-email
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");
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
        // Clear password fields when going back to signup from verify-email
        setPassword("");
        setConfirmPassword("");
        setPasswordError("");
        setConfirmPasswordError("");
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

  const handleVerifyEmail = async (_vsToken: string) => {
    // For login mode, the login API is already called in VerifyEmailContainer
    // This function is only called for signup mode now
    if (verificationMode === "login") {
      // Login flow is handled in VerifyEmailContainer, so this should not be called
      // But we keep it for compatibility
      return;
    }

    setIsLoading(true);
    try {
      // Signup flow: Complete registration with email and code
      // Get the verification code from the current state
      const codeString = verificationCode.join("");
      await registerComplete({
        email: email,
        code: codeString,
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
      useAuthStore.getState().setUserInfo(userInfo);
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
      useAuthStore.getState().setUserInfo(userInfo);
      toast.success("Login successful!");

      // Save password if rememberMe is checked
      if (rememberMe) {
        try {
          await saveEncryptedItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
          await saveEncryptedItem(STORAGE_KEYS.REMEMBERED_PASSWORD, password);
        } catch (e) {
          console.warn("Failed to save remembered credentials:", e);
        }
      } else {
        // Clear remembered credentials if not checked
        try {
          removeEncryptedItem(STORAGE_KEYS.REMEMBERED_EMAIL);
          removeEncryptedItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
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
      // Clear password fields when switching to signup to prevent auto-fill from login
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setConfirmPasswordError("");
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

  const handleChangeEmailContinue = (isRegistered: boolean) => {
    if (isRegistered) {
      // Email is registered - navigate to login (password step)
      setStep("password");
    } else {
      // Email is not registered - navigate to sign up
      // Clear password fields when switching to signup to prevent auto-fill from login
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setConfirmPasswordError("");
      setStep("signup");
    }
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
          : "content-stretch gap-[16px] px-0"
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
                          <Icon name="alert-success" aria-label="Success" className="block size-full" />
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
                isGoogleLoading={isGoogleLoading}
                isFacebookLoading={isFacebookLoading}
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
              onClose={onClose}
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

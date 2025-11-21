import { create } from "zustand";
import { emailSchema, loginFormSchema, signUpFormSchema, resetPasswordFormSchema } from "./authSchemas";
import { z } from "zod";
import { clearAuthTokens } from "@/lib/http";
import {
  saveEncryptedItem,
  removeEncryptedItem,
} from "@/lib/encryption";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export type LoginStep = "email" | "password" | "signup" | "verify-email" | "forgot-password" | "change-email" | "reset-password";
export type VerificationMode = "signup" | "login" | "forgot-password";

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  // Step management
  step: LoginStep;
  setStep: (step: LoginStep) => void;

  // Form data
  email: string;
  password: string;
  confirmPassword: string;
  rememberMe: boolean;
  showPassword: boolean;

  // Sign up form data
  firstName: string;
  lastName: string;
  birthday: string;
  address: string;
  optOutMarketing: boolean;

  // Verification code
  verificationCode: string[];
  verificationMode: VerificationMode;
  setVerificationCode: (code: string[]) => void;
  setVerificationMode: (mode: VerificationMode) => void;

  // Forgot password state
  codeSendCount: number; // Number of times code has been sent (max 5)
  codeVerifyFailCount: number; // Number of times code verification failed (max 5)
  setCodeSendCount: (count: number) => void;
  setCodeVerifyFailCount: (count: number) => void;
  resetPasswordToken: string | null; // Token from successful code verification
  setResetPasswordToken: (token: string | null) => void;
  passwordResetSuccess: boolean; // Flag to show success message after password reset
  setPasswordResetSuccess: (success: boolean) => void;

  // Form setters
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setRememberMe: (remember: boolean) => void;
  toggleShowPassword: () => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setBirthday: (birthday: string) => void;
  setAddress: (address: string) => void;
  setOptOutMarketing: (optOut: boolean) => void;

  // UI state
  isEmailFocused: boolean;
  setIsEmailFocused: (focused: boolean) => void;

  // Validation errors
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  firstNameError: string;
  lastNameError: string;
  birthdayError: string;
  addressError: string;
  setEmailError: (error: string) => void;
  setPasswordError: (error: string) => void;
  setConfirmPasswordError: (error: string) => void;
  setFirstNameError: (error: string) => void;
  setLastNameError: (error: string) => void;
  setBirthdayError: (error: string) => void;
  setAddressError: (error: string) => void;
  clearErrors: () => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;

  // Reset function
  reset: () => void;
}

// Load user info from localStorage on initialization (synchronous for initial state)
// Note: This will be called during store initialization, so we need to handle it carefully
// For encrypted data, we'll load it asynchronously after store creation
const loadUserFromStorage = (): User | null => {
  // Return null initially - user info will be loaded asynchronously
  // This prevents blocking store initialization
  return null;
};

const initialState = {
  step: "email" as LoginStep,
  email: "",
  password: "",
  confirmPassword: "",
  rememberMe: false,
  showPassword: false,
  firstName: "",
  lastName: "",
  birthday: "",
  address: "",
  optOutMarketing: false,
  verificationCode: ["", "", "", "", "", ""],
  verificationMode: "signup" as VerificationMode,
  codeSendCount: 0,
  codeVerifyFailCount: 0,
  resetPasswordToken: null as string | null,
  passwordResetSuccess: false,
  isEmailFocused: false,
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
  firstNameError: "",
  lastNameError: "",
  birthdayError: "",
  addressError: "",
  isLoading: false,
  user: loadUserFromStorage(),
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setEmail: (email) => {
    set({ email, emailError: "" });
  },

  setPassword: (password) => {
    set({ password, passwordError: "" });
  },

  setConfirmPassword: (confirmPassword) => {
    set({ confirmPassword, confirmPasswordError: "" });
  },

  setRememberMe: (rememberMe) => set({ rememberMe }),

  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),

  setFirstName: (firstName) => {
    set({ firstName, firstNameError: "" });
  },

  setLastName: (lastName) => {
    set({ lastName, lastNameError: "" });
  },

  setBirthday: (birthday) => {
    set({ birthday, birthdayError: "" });
  },

  setAddress: (address) => {
    set({ address, addressError: "" });
  },

  setOptOutMarketing: (optOutMarketing) => set({ optOutMarketing }),

  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setVerificationMode: (verificationMode) => set({ verificationMode }),

  setCodeSendCount: (codeSendCount) => set({ codeSendCount }),
  setCodeVerifyFailCount: (codeVerifyFailCount) => set({ codeVerifyFailCount }),
  setResetPasswordToken: (resetPasswordToken) => set({ resetPasswordToken }),
  setPasswordResetSuccess: (passwordResetSuccess) => set({ passwordResetSuccess }),

  setIsEmailFocused: (isEmailFocused) => set({ isEmailFocused }),

  setEmailError: (emailError) => set({ emailError }),

  setPasswordError: (passwordError) => set({ passwordError }),

  setConfirmPasswordError: (confirmPasswordError) =>
    set({ confirmPasswordError }),

  setFirstNameError: (firstNameError) => set({ firstNameError }),

  setLastNameError: (lastNameError) => set({ lastNameError }),

  setBirthdayError: (birthdayError) => set({ birthdayError }),

  setAddressError: (addressError) => set({ addressError }),

  clearErrors: () =>
    set({
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      firstNameError: "",
      lastNameError: "",
      birthdayError: "",
      addressError: "",
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => {
    set({ user });
    // Save to localStorage when user is set (encrypted)
    if (user) {
      // Use async save but don't await (fire and forget)
      saveEncryptedItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user)).catch((e: unknown) => {
        console.warn("Failed to save user info to localStorage:", e);
      });
    } else {
      try {
        removeEncryptedItem(STORAGE_KEYS.USER_INFO);
      } catch (e) {
        console.warn("Failed to remove user info from localStorage:", e);
      }
    }
  },

  login: (user) => {
    set({ user });
    // Save to localStorage when user logs in (encrypted)
    // Use async save but don't await (fire and forget)
    saveEncryptedItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user)).catch((e: unknown) => {
      console.warn("Failed to save user info to localStorage:", e);
    });
  },

  logout: async () => {
    await clearAuthTokens();
    set({ user: null });
    // Clear user info from localStorage when user logs out
    try {
      removeEncryptedItem(STORAGE_KEYS.USER_INFO);
    } catch (e) {
      console.warn("Failed to remove user info from localStorage:", e);
    }
  },

  reset: () =>
    set((state) => ({
      ...initialState,
      // Preserve user info when resetting form state
      user: state.user,
      verificationCode: ["", "", "", "", "", ""],
      verificationMode: "signup",
      codeSendCount: 0,
      codeVerifyFailCount: 0,
      resetPasswordToken: null,
      passwordResetSuccess: false,
    })),
}));

// Validation helpers
export const validateEmail = (
  email: string
): { success: boolean; error?: string } => {
  try {
    emailSchema.parse(email);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Invalid email",
      };
    }
    return { success: false, error: "Invalid email" };
  }
};

export const validateLoginForm = (data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): { success: boolean; error?: z.ZodError } => {
  try {
    loginFormSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return { success: false };
  }
};

export const validateSignUpForm = (data: {
  email: string;
  firstName?: string;
  lastName?: string;
  birthday?: string;
  address?: string;
  password: string;
  confirmPassword: string;
}): { success: boolean; error?: z.ZodError } => {
  try {
    signUpFormSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return { success: false };
  }
};

export const validateResetPasswordForm = (data: {
  password: string;
  confirmPassword: string;
}): { success: boolean; error?: z.ZodError } => {
  try {
    resetPasswordFormSchema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    return { success: false };
  }
};

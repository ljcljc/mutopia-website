import { create } from "zustand";
import { emailSchema, loginFormSchema, signUpFormSchema, resetPasswordFormSchema } from "./authSchemas";
import { z } from "zod";
import { clearAuthTokens } from "@/lib/http";
import {
  saveEncryptedItem,
  removeEncryptedItem,
} from "@/lib/encryption";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { type MeOut } from "@/lib/api";

export type LoginStep = "email" | "password" | "signup" | "verify-email" | "forgot-password" | "change-email" | "reset-password" | "change-password";
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
  phone: string;
  birthday: string;
  address: string;
  optOutMarketing: boolean;
  inviteCode: string;

  // Verification code
  verificationCode: string[];
  verificationMode: VerificationMode;
  forgotPasswordEmail: string | null;
  setVerificationCode: (code: string[]) => void;
  setVerificationMode: (mode: VerificationMode) => void;
  setForgotPasswordEmail: (email: string | null) => void;

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
  setPhone: (phone: string) => void;
  setBirthday: (birthday: string) => void;
  setAddress: (address: string) => void;
  setOptOutMarketing: (optOut: boolean) => void;
  setInviteCode: (inviteCode: string) => void;

  // UI state
  isEmailFocused: boolean;
  setIsEmailFocused: (focused: boolean) => void;

  // Validation errors
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
  firstNameError: string;
  lastNameError: string;
  phoneError: string;
  birthdayError: string;
  addressError: string;
  inviteCodeError: string;
  setEmailError: (error: string) => void;
  setPasswordError: (error: string) => void;
  setConfirmPasswordError: (error: string) => void;
  setFirstNameError: (error: string) => void;
  setLastNameError: (error: string) => void;
  setPhoneError: (error: string) => void;
  setBirthdayError: (error: string) => void;
  setAddressError: (error: string) => void;
  setInviteCodeError: (error: string) => void;
  clearErrors: () => void;

  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  
  // User info from API (MeOut)
  userInfo: MeOut | null;
  setUserInfo: (userInfo: MeOut | null) => void;

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
  phone: "",
  birthday: "",
  address: "",
  optOutMarketing: false,
  inviteCode: "",
  verificationCode: ["", "", "", "", "", ""],
  verificationMode: "signup" as VerificationMode,
  codeSendCount: 0,
  codeVerifyFailCount: 0,
  resetPasswordToken: null as string | null,
  passwordResetSuccess: false,
  forgotPasswordEmail: null as string | null,
  isEmailFocused: false,
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
  firstNameError: "",
  lastNameError: "",
  phoneError: "",
  birthdayError: "",
  addressError: "",
  inviteCodeError: "",
  isLoading: false,
  user: loadUserFromStorage(),
  userInfo: null as MeOut | null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setEmail: (email) =>
    set((state) => {
      const updates: Partial<AuthState> = {
        email,
        emailError: "",
      };

      if (
        state.forgotPasswordEmail &&
        state.forgotPasswordEmail !== email
      ) {
        updates.codeSendCount = 0;
        updates.codeVerifyFailCount = 0;
        updates.forgotPasswordEmail = null;
      }

      return updates;
    }),

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

  setPhone: (phone) => {
    set({ phone, phoneError: "" });
  },

  setBirthday: (birthday) => {
    set({ birthday, birthdayError: "" });
  },

  setAddress: (address) => {
    set({ address, addressError: "" });
  },

  setOptOutMarketing: (optOutMarketing) => set({ optOutMarketing }),

  setInviteCode: (inviteCode) => {
    set({ inviteCode, inviteCodeError: "" });
  },

  setVerificationCode: (verificationCode) => set({ verificationCode }),
  setVerificationMode: (verificationMode) => set({ verificationMode }),
  setForgotPasswordEmail: (forgotPasswordEmail) => set({ forgotPasswordEmail }),

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

  setPhoneError: (phoneError) => set({ phoneError }),

  setBirthdayError: (birthdayError) => set({ birthdayError }),

  setAddressError: (addressError) => set({ addressError }),

  setInviteCodeError: (inviteCodeError) => set({ inviteCodeError }),

  clearErrors: () =>
    set({
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      firstNameError: "",
      lastNameError: "",
      phoneError: "",
      birthdayError: "",
      addressError: "",
      inviteCodeError: "",
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setUser: (user) => {
    set({ user });
    // Note: user is derived from userInfo, so we don't persist it separately
    // userInfo is the source of truth and is persisted in setUserInfo
  },

  login: (user) => {
    set({ user });
    // Note: user is derived from userInfo, so we don't persist it separately
    // userInfo is the source of truth and is persisted in setUserInfo
  },

  logout: async () => {
    await clearAuthTokens();
    set({ user: null, userInfo: null });
    // Clear user info from localStorage when user logs out
    try {
      removeEncryptedItem(STORAGE_KEYS.USER_INFO);
    } catch (e) {
      console.warn("Failed to remove user info from localStorage:", e);
    }
    // Note: setUserInfo will also clear localStorage, but we do it here explicitly for clarity
  },

  setUserInfo: (userInfo) => {
    console.log("[AuthStore] setUserInfo:", userInfo);
    set({ userInfo });
    // Persist userInfo to localStorage when set (this is the source of truth)
    if (userInfo) {
      // Use async save but don't await (fire and forget)
      saveEncryptedItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo)).catch((e: unknown) => {
        console.warn("Failed to save userInfo to localStorage:", e);
      });
      // Also update user derived from userInfo
      const user = {
        name: `${userInfo.first_name || ""} ${userInfo.last_name || ""}`.trim() || userInfo.email.split("@")[0],
        email: userInfo.email,
      };
      set({ user });
    } else {
      try {
        removeEncryptedItem(STORAGE_KEYS.USER_INFO);
      } catch (e) {
        console.warn("Failed to remove userInfo from localStorage:", e);
      }
      // Also clear user when userInfo is cleared
      set({ user: null });
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
      forgotPasswordEmail: null,
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
  phone?: string;
  birthday?: string;
  address?: string;
  password: string;
  confirmPassword: string;
  inviteCode?: string;
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

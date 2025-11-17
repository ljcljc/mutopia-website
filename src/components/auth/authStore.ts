import { create } from "zustand";
import { emailSchema, loginFormSchema, signUpFormSchema } from "./authSchemas";
import { z } from "zod";
import { clearAuthTokens } from "@/lib/http";

export type LoginStep = "email" | "password" | "signup";

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
  logout: () => void;

  // Reset function
  reset: () => void;
}

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
  isEmailFocused: false,
  emailError: "",
  passwordError: "",
  confirmPasswordError: "",
  firstNameError: "",
  lastNameError: "",
  birthdayError: "",
  addressError: "",
  isLoading: false,
  user: null as User | null,
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

  setUser: (user) => set({ user }),

  login: (user) => {
    set({ user });
  },

  logout: () => {
    clearAuthTokens();
    set({ user: null });
  },

  reset: () => set(initialState),
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

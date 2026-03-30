import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "./authStore";
import type { MeOut } from "@/lib/api";

const mockUserInfo: MeOut = {
  id: "user-1",
  email: "tester@example.com",
  first_name: "Test",
  last_name: "User",
  receive_marketing_message: false,
  role: "customer",
  is_email_verified: true,
  is_groomer: false,
};

describe("authStore reset", () => {
  beforeEach(() => {
    useAuthStore.setState({
      step: "email",
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
      verificationMode: "signup",
      forgotPasswordEmail: null,
      codeSendCount: 0,
      codeVerifyFailCount: 0,
      resetPasswordToken: null,
      passwordResetSuccess: false,
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
      user: null,
      userInfo: null,
    });
  });

  it("preserves user and userInfo when resetting form state", () => {
    const { setUserInfo, setPassword, setStep, reset } = useAuthStore.getState();

    setUserInfo(mockUserInfo);
    setPassword("temporary-secret");
    setStep("password");

    reset();

    const state = useAuthStore.getState();
    expect(state.userInfo).toEqual(mockUserInfo);
    expect(state.user).toEqual({
      name: "Test User",
      email: "tester@example.com",
    });
    expect(state.password).toBe("");
    expect(state.step).toBe("email");
  });
});

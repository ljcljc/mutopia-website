import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MyAccount from "./MyAccount";
import { useAuthStore } from "@/components/auth/authStore";

vi.mock("@/components/account/accountStore", () => ({
  useAccountStore: () => ({
    fetchAddresses: vi.fn(),
    fetchMembershipPlans: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/components/account/PersonalInfoCard", () => ({
  default: () => <div>Personal info</div>,
}));

vi.mock("@/components/account/AddressesCard", () => ({
  default: () => <div>Addresses</div>,
}));

vi.mock("@/components/account/PaymentMethodCard", () => ({
  default: () => <div>Payment method</div>,
}));

vi.mock("@/components/account/ShareAndEarnCard", () => ({
  default: () => <div>Share card</div>,
}));

vi.mock("@/components/account/MembershipCard", () => ({
  default: () => <div>Membership card</div>,
}));

vi.mock("@/components/groomer/ApplyGroomerModal", () => ({
  default: () => null,
}));

vi.mock("@/components/auth/LoginModal", () => ({
  LoginModal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("MyAccount page header identity switch", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userInfo: {
        id: "user-1",
        email: "user@example.com",
        first_name: "User",
        last_name: "Example",
        receive_marketing_message: false,
        role: "user",
        is_email_verified: true,
        is_member: false,
        is_groomer: true,
      },
      isResolvingUserInfo: false,
    });
  });

  it("renders the groomer switch in the my account header and navigates on toggle", () => {
    render(
      <MemoryRouter initialEntries={["/account/profile"]}>
        <Routes>
          <Route path="/account/profile" element={<MyAccount />} />
          <Route path="/groomer/account" element={<div>Groomer account page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "My Account" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Groomer account toggle" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Groomer account toggle" }));

    expect(screen.getByText("Groomer account page")).toBeInTheDocument();
  });
});

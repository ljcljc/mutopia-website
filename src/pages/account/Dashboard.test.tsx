import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "./Dashboard";
import { useAuthStore } from "@/components/auth/authStore";

vi.mock("@/components/account/accountStore", () => ({
  useAccountStore: () => ({
    fetchMembershipPlans: vi.fn(),
  }),
}));

vi.mock("@/lib/api", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/components/account/dashboard/DashboardHeroCard", () => ({
  default: () => <div>Hero card</div>,
}));

vi.mock("@/components/account/dashboard/DashboardBookingCard", () => ({
  default: () => <div>Booking card</div>,
}));

vi.mock("@/components/account/dashboard/DashboardMyPetsCard", () => ({
  default: () => <div>Pets card</div>,
}));

vi.mock("@/components/account/dashboard/DashboardMyCreditCard", () => ({
  default: () => <div>Credit card</div>,
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

describe("Dashboard page header identity switch", () => {
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
        is_groomer: true,
      },
      isResolvingUserInfo: false,
    });
  });

  it("renders the groomer switch in the dashboard header and navigates on toggle", () => {
    render(
      <MemoryRouter initialEntries={["/account/dashboard"]}>
        <Routes>
          <Route path="/account/dashboard" element={<Dashboard />} />
          <Route path="/groomer/dashboard" element={<div>Groomer dashboard page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Groomer account toggle" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("switch", { name: "Groomer account toggle" }));

    expect(screen.getByText("Groomer dashboard page")).toBeInTheDocument();
  });
});

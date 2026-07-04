import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/components/auth/authStore";
import IdentitySwitchAction from "./IdentitySwitchAction";

vi.mock("@/components/groomer/ApplyGroomerModal", () => ({
  default: ({ open }: { open: boolean }) => (open ? <div>Apply groomer modal</div> : null),
}));

vi.mock("@/components/auth/LoginModal", () => ({
  LoginModal: ({ open, children }: { open: boolean; children: ReactNode }) => (
    <>
      {open ? <div>Login modal</div> : null}
      {children}
    </>
  ),
}));

function renderAction({
  mode,
  targetPath,
}: {
  mode: "customer" | "groomer";
  targetPath: string;
}) {
  render(
    <MemoryRouter initialEntries={["/current"]}>
      <Routes>
        <Route path="/current" element={<IdentitySwitchAction mode={mode} targetPath={targetPath} />} />
        <Route path={targetPath} element={<div>Target page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("IdentitySwitchAction", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userInfo: null,
      isResolvingUserInfo: false,
    });
  });

  it("shows apply as groomer for customer users without groomer identity", () => {
    useAuthStore.setState({
      userInfo: {
        id: "user-1",
        email: "user@example.com",
        first_name: "User",
        last_name: "Example",
        receive_marketing_message: false,
        role: "user",
        is_email_verified: true,
        is_groomer: false,
      },
    });

    renderAction({ mode: "customer", targetPath: "/groomer/account" });

    expect(screen.getByRole("button", { name: "Apply as groomer" })).toBeInTheDocument();
  });

  it("does not flash apply as groomer while user info is still resolving", () => {
    useAuthStore.setState({
      user: {
        name: "User Example",
        email: "user@example.com",
      },
      userInfo: null,
      isResolvingUserInfo: true,
    });

    renderAction({ mode: "customer", targetPath: "/groomer/account" });

    expect(screen.queryByRole("button", { name: "Apply as groomer" })).not.toBeInTheDocument();
  });

  it("navigates to the target groomer page when enabling the customer switch", () => {
    useAuthStore.setState({
      userInfo: {
        id: "user-2",
        email: "user@example.com",
        first_name: "User",
        last_name: "Example",
        receive_marketing_message: false,
        role: "user",
        is_email_verified: true,
        is_groomer: true,
      },
    });

    renderAction({ mode: "customer", targetPath: "/groomer/dashboard" });

    fireEvent.click(screen.getByRole("switch", { name: "Groomer account toggle" }));

    expect(screen.getByText("Target page")).toBeInTheDocument();
  });

  it("navigates to the target pet owner page when disabling the groomer switch", () => {
    renderAction({ mode: "groomer", targetPath: "/account/dashboard" });

    expect(screen.getByRole("switch", { name: "Pet owner toggle" })).toHaveAttribute("aria-checked", "true");
    fireEvent.click(screen.getByRole("switch", { name: "Pet owner toggle" }));

    expect(screen.getByText("Target page")).toBeInTheDocument();
  });
});

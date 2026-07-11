import { render, screen } from "@testing-library/react";
import type { HTMLAttributes, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/components/auth/authStore";
import Header from "./Header";

vi.mock("motion/react", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/components/auth/LoginModal", () => ({
  LoginModal: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/groomer/ApplyGroomerModal", () => ({
  default: () => null,
}));

vi.mock("@/components/layout/NotificationsPopover", () => ({
  default: () => <div>Notifications popover</div>,
}));

vi.mock("@/components/layout/AccountDropdown", () => ({
  default: () => <div>Account dropdown</div>,
}));

vi.mock("@/lib/encryption", () => ({
  getEncryptedItem: vi.fn(() => new Promise(() => {})),
}));

describe("Header", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userInfo: null,
      isResolvingUserInfo: false,
    });
  });

  it("does not flash apply as groomer while logged-in user info is still resolving", () => {
    useAuthStore.setState({
      user: {
        name: "User Example",
        email: "user@example.com",
      },
      userInfo: null,
      isResolvingUserInfo: true,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("button", { name: "Apply as groomer" })).not.toBeInTheDocument();
    expect(screen.getByText("Account dropdown")).toBeInTheDocument();
  });

  it("shows apply as groomer for logged-in non-groomer users after user info resolves", () => {
    useAuthStore.setState({
      user: {
        name: "User Example",
        email: "user@example.com",
      },
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
      isResolvingUserInfo: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: "Apply as groomer" })).toBeInTheDocument();
  });

  it("does not show the mobile apply to groomer entry for groomer users", () => {
    useAuthStore.setState({
      user: {
        name: "Groomer User",
        email: "groomer@example.com",
      },
      userInfo: {
        id: "groomer-1",
        email: "groomer@example.com",
        first_name: "Groomer",
        last_name: "User",
        receive_marketing_message: false,
        role: "groomer",
        is_email_verified: true,
        is_groomer: true,
      },
      isResolvingUserInfo: false,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Apply as groomer")).not.toBeInTheDocument();
  });
});

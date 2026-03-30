import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AccountLayout from "./AccountLayout";
import { useAuthStore } from "@/components/auth/authStore";
import { STORAGE_KEYS } from "@/lib/storageKeys";

vi.mock("./AccountSidebar", () => ({
  AccountSidebar: () => <div>Sidebar</div>,
}));

vi.mock("./HeaderApp", () => ({
  default: () => <div>Header</div>,
}));

vi.mock("./Footer", () => ({
  default: () => <div>Footer</div>,
}));

vi.mock("./AccountBottomNav", () => ({
  default: () => <div>BottomNav</div>,
}));

vi.mock("@/components/common", () => ({
  ScrollToTop: () => null,
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => null,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarInset: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));

describe("AccountLayout guard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({
      user: null,
      userInfo: null,
    });
  });

  it("redirects anonymous users away from account routes before rendering private content", () => {
    render(
      <MemoryRouter initialEntries={["/account/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/account" element={<AccountLayout />}>
            <Route path="dashboard" element={<div>Private Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.queryByText("Private Dashboard")).not.toBeInTheDocument();
  });

  it("renders account content when an access token is present", () => {
    window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, "token");

    render(
      <MemoryRouter initialEntries={["/account/dashboard"]}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/account" element={<AccountLayout />}>
            <Route path="dashboard" element={<div>Private Dashboard</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Private Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import AccountDropdown from "./AccountDropdown";

const handleLogout = vi.fn();

vi.mock("@/hooks/useLogout", () => ({
  useLogout: () => ({
    handleLogout,
  }),
}));

function renderDropdown(isGroomer: boolean, mode: "customer" | "groomer" = "customer") {
  const userInfo = {
    id: "user-1",
    email: "jing184@example.com",
    first_name: "jing184",
    last_name: null,
    receive_marketing_message: false,
    role: isGroomer ? "groomer" : "user",
    is_email_verified: true,
    is_member: true,
    is_groomer: isGroomer,
  } as const;
  const currentPath = mode === "customer" ? "/account/dashboard" : "/groomer/dashboard";
  const targetPath = mode === "customer" ? "/groomer/dashboard" : "/account/dashboard";
  const targetLabel = mode === "customer" ? "Groomer dashboard page" : "Customer dashboard page";

  render(
    <MemoryRouter initialEntries={[currentPath]}>
      <Routes>
        <Route
          path={currentPath}
          element={(
            <AccountDropdown
              userInfo={userInfo}
              mode={mode}
            />
          )}
        />
        <Route path={targetPath} element={<div>{targetLabel}</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

function openDropdown() {
  const trigger = document.querySelector('[data-slot="dropdown-menu-trigger"]');
  if (!(trigger instanceof HTMLElement)) {
    throw new Error("Dropdown trigger not found");
  }
  fireEvent.pointerDown(trigger);
}

describe("AccountDropdown", () => {
  it("shows the groomer switch control for groomer users", () => {
    renderDropdown(true);

    openDropdown();

    expect(screen.getByText("Groomer")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Switch to groomer" })).toHaveAttribute("aria-checked", "false");
  });

  it("navigates to the groomer dashboard from the switch control", () => {
    renderDropdown(true);

    openDropdown();
    fireEvent.click(screen.getByRole("switch", { name: "Switch to groomer" }));

    expect(screen.getByText("Groomer dashboard page")).toBeInTheDocument();
  });

  it("does not show the groomer switch control for non-groomer users", () => {
    renderDropdown(false);

    openDropdown();

    expect(screen.queryByText("Groomer")).not.toBeInTheDocument();
    expect(screen.queryByRole("switch", { name: "Switch to groomer" })).not.toBeInTheDocument();
  });

  it("shows the pet owner switch control in groomer mode", () => {
    renderDropdown(true, "groomer");

    openDropdown();

    expect(screen.getByText("Pet owner")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Switch to pet owner" })).toHaveAttribute("aria-checked", "false");
  });

  it("navigates back to the customer dashboard from the groomer switch control", () => {
    renderDropdown(true, "groomer");

    openDropdown();
    fireEvent.click(screen.getByRole("switch", { name: "Switch to pet owner" }));

    expect(screen.getByText("Customer dashboard page")).toBeInTheDocument();
  });
});

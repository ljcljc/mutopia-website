import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/components/auth/authStore";
import GroomerHeader from "./GroomerHeader";

function renderHeader() {
  render(
    <MemoryRouter initialEntries={["/groomer/dashboard"]}>
      <Routes>
        <Route path="/groomer/dashboard" element={<GroomerHeader />} />
        <Route path="/groomer/notifications" element={<div>Groomer notifications page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GroomerHeader", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      userInfo: null,
    });
  });

  it("shows the current groomer full name when available", () => {
    useAuthStore.setState({
      userInfo: {
        id: "groomer-1",
        email: "groomer@example.com",
        first_name: "Jane",
        last_name: "Doe",
        receive_marketing_message: false,
        role: "groomer",
        is_email_verified: true,
        is_groomer: true,
      },
    });

    renderHeader();

    expect(screen.getByText("Mutopia Partner")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("falls back to the email prefix when the groomer has no saved name", () => {
    useAuthStore.setState({
      userInfo: {
        id: "groomer-2",
        email: "partner@example.com",
        first_name: null,
        last_name: null,
        receive_marketing_message: false,
        role: "groomer",
        is_email_verified: true,
        is_groomer: true,
      },
    });

    renderHeader();

    expect(screen.getByText("partner")).toBeInTheDocument();
  });

  it("navigates to the groomer notifications page when clicking the notification icon", () => {
    renderHeader();

    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));

    expect(screen.getByText("Groomer notifications page")).toBeInTheDocument();
  });
});

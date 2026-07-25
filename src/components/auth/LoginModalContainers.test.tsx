import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PasswordContainer } from "./LoginModalContainers";

describe("PasswordContainer", () => {
  it("keeps the password input focused when its error is cleared", () => {
    const props = {
      password: "wrong-password",
      setPassword: vi.fn(),
      onLogin: vi.fn(),
      showPassword: false,
      onTogglePassword: vi.fn(),
      rememberMe: false,
      setRememberMe: vi.fn(),
      onForgotPassword: vi.fn(),
    };
    const { rerender } = render(
      <PasswordContainer {...props} error="Incorrect password" />,
    );
    const input = screen.getByPlaceholderText("Enter your password");

    input.focus();
    rerender(<PasswordContainer {...props} />);

    expect(document.activeElement).toBe(input);
  });
});

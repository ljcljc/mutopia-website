import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingImage } from "./LoadingImage";

describe("LoadingImage", () => {
  it("shows loading feedback until each image loads", () => {
    const { rerender } = render(<LoadingImage src="/first.jpg" alt="First" />);
    expect(screen.getByRole("img", { name: "First" })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    fireEvent.load(screen.getByRole("img", { name: "First" }));
    expect(screen.getByRole("img", { name: "First" })).toHaveAttribute(
      "aria-busy",
      "false"
    );

    rerender(<LoadingImage src="/second.jpg" alt="Second" />);
    expect(screen.getByRole("img", { name: "Second" })).toHaveAttribute(
      "aria-busy",
      "true"
    );
    fireEvent.load(screen.getByRole("img", { name: "Second" }));
    expect(screen.getByRole("img", { name: "Second" })).toHaveAttribute(
      "aria-busy",
      "false"
    );
  });
});

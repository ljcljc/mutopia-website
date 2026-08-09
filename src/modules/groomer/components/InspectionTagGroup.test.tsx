import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InspectionTagGroup } from "./InspectionTagGroup";

describe("InspectionTagGroup", () => {
  it("renders hint chips in a single horizontal scrolling row", () => {
    const { container } = render(
      <InspectionTagGroup
        label="Skin issues"
        tags={[
          { value: "redness", label: "Redness" },
          { value: "itching", label: "Itching" },
          { value: "odor", label: "Odor" },
          { value: "dry", label: "Dry Patches" },
          { value: "parasites", label: "Parasites" },
        ]}
        selected={["redness"]}
        onChange={vi.fn()}
      />,
    );

    const chipRow = container.querySelector("fieldset > div");
    expect(chipRow).toHaveClass("grid");
    expect(chipRow).toHaveClass("grid-flow-col");
    expect(chipRow).toHaveClass("auto-cols-max");
    expect(chipRow).toHaveClass("overflow-x-scroll");
    expect(chipRow).toHaveClass("touch-pan-x");
    expect(chipRow).toHaveClass("overscroll-x-contain");
    expect(chipRow).toHaveClass("md:flex");
    expect(chipRow).toHaveClass("md:flex-wrap");
    expect(chipRow).toHaveClass("md:overflow-x-visible");
    expect(container.querySelector("fieldset")).toHaveClass("min-w-0");
    expect(container.querySelector("fieldset")).toHaveClass("[min-inline-size:0]");
    expect(container.querySelector("fieldset")).toHaveClass("overflow-hidden");
    expect(screen.getByRole("button", { name: "Redness" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Redness" })).toHaveClass("cursor-pointer");
  });
});

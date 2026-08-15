import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InspectionTagGroup } from "./InspectionTagGroup";

describe("InspectionTagGroup", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });

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
    expect(chipRow).toHaveClass("flex");
    expect(chipRow).toHaveClass("flex-nowrap");
    expect(chipRow).toHaveClass("w-full");
    expect(chipRow).toHaveClass("min-w-0");
    expect(chipRow).toHaveClass("overflow-x-auto");
    expect(chipRow).toHaveClass("touch-pan-x");
    expect(chipRow).toHaveClass("overscroll-x-contain");
    expect(container.querySelector("fieldset")).toHaveClass("min-w-0");
    expect(container.querySelector("fieldset")).toHaveClass("[min-inline-size:0]");
    expect(container.querySelector("fieldset")).toHaveClass("overflow-hidden");
    expect(screen.getByRole("button", { name: "Redness" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Redness" })).toHaveClass("cursor-pointer");
  });

  it("centers a chip on mobile by scrolling the row", () => {
    const { getByRole, container } = render(
      <InspectionTagGroup
        label="Skin issues"
        tags={[
          { value: "redness", label: "Redness" },
          { value: "itching", label: "Itching" },
          { value: "odor", label: "Odor" },
        ]}
        selected={[]}
        onChange={vi.fn()}
      />,
    );

    const chipRow = container.querySelector("fieldset > div") as HTMLDivElement | null;
    const scrollIntoView = vi.fn();

    const button = getByRole("button", { name: "Itching" }) as HTMLButtonElement;
    button.scrollIntoView = scrollIntoView;

    fireEvent.click(button);

    expect(chipRow).toBeTruthy();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "nearest", inline: "center" });
  });

  it("allows dragging the row horizontally", () => {
    const { container } = render(
      <InspectionTagGroup
        label="Skin issues"
        tags={[
          { value: "redness", label: "Redness" },
          { value: "itching", label: "Itching" },
          { value: "odor", label: "Odor" },
        ]}
        selected={[]}
        onChange={vi.fn()}
      />,
    );

    const chipRow = container.querySelector("fieldset > div") as HTMLDivElement | null;
    expect(chipRow).toBeTruthy();
    if (!chipRow) return;
    Object.defineProperty(chipRow, "scrollLeft", { value: 0, writable: true, configurable: true });
    Object.defineProperty(chipRow, "clientWidth", { value: 160, configurable: true });
    chipRow.setPointerCapture = vi.fn();
    chipRow.hasPointerCapture = vi.fn(() => true);
    chipRow.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(chipRow, { button: 0, pointerId: 1, clientX: 120 });
    fireEvent.pointerMove(chipRow, { pointerId: 1, clientX: 80, preventDefault: vi.fn() });
    fireEvent.pointerUp(chipRow, { pointerId: 1 });

    expect(chipRow.scrollLeft).toBeGreaterThan(0);
  });
});

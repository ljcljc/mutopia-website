import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { AccordionPanel } from "./Accordion";

function Harness({ initialOpen = false }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        toggle
      </button>
      <AccordionPanel open={open}>
        <a href="/x">panel content</a>
      </AccordionPanel>
    </div>
  );
}

describe("AccordionPanel", () => {
  it("does not mount content while collapsed", () => {
    render(<Harness />);
    expect(screen.queryByText("panel content")).toBeNull();
  });

  it("mounts content when opened and unmounts after the close transition", () => {
    vi.stubGlobal("requestAnimationFrame", (callback: (time: number) => void) =>
      setTimeout(() => callback(performance.now()), 0) as unknown as number,
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
    );
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(screen.getByText("panel content")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    // jsdom does not run CSS transitions; emulate the browser transitionend
    // that AccordionPanel listens on to finalize collapse.
    const panel = screen.getByText("panel content").closest(".grid");
    expect(panel).not.toBeNull();
    fireEvent(panel as Element, new TransitionEvent("transitionend", { bubbles: true, propertyName: "grid-template-rows" }));
    expect(screen.queryByText("panel content")).toBeNull();

    vi.unstubAllGlobals();
  });

  it("ignores transitionend events bubbling from child elements", () => {
    render(<Harness initialOpen />);

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    const inner = screen.getByText("panel content");
    fireEvent(inner, new TransitionEvent("transitionend", { bubbles: true, propertyName: "opacity" }));
    // Still mounted: the event came from a child, not the panel grid.
    expect(screen.queryByText("panel content")).not.toBeNull();
  });
});

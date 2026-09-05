import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProposeNewTimeModal } from "./ProposeNewTimeModal";

const noInitialTimeOptions: never[] = [];

describe("ProposeNewTimeModal", () => {
  it("does not submit and prompts when no available time is selected", async () => {
    const onSubmit = vi.fn();

    render(
      <ProposeNewTimeModal
        open
        onClose={vi.fn()}
        initialTimeOptions={noInitialTimeOptions}
        onSubmit={onSubmit}
      />,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Send new time" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Please select at least one available time");
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

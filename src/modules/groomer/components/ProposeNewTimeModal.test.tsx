import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProposeNewTimeModal } from "./ProposeNewTimeModal";

const noInitialTimeOptions: never[] = [];

describe("ProposeNewTimeModal", () => {
  it("offers half-hour times from 08:00 through 21:00", async () => {
    render(<ProposeNewTimeModal open onClose={vi.fn()} initialTimeOptions={noInitialTimeOptions} />);

    fireEvent.click(await screen.findByRole("button", { name: "Toggle available time options" }));

    expect(screen.getByRole("button", { name: "08:00" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "20:30" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "21:00" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "07:30" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "21:30" })).not.toBeInTheDocument();
  });

  it("shows every time again after selecting one and highlights the selection", async () => {
    render(<ProposeNewTimeModal open onClose={vi.fn()} initialTimeOptions={noInitialTimeOptions} />);

    fireEvent.click(await screen.findByRole("button", { name: "Toggle available time options" }));
    fireEvent.click(screen.getByRole("button", { name: "08:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Toggle available time options" }));

    expect(screen.getByRole("button", { name: "08:00" })).toHaveClass("bg-amber-50");
    expect(screen.getByRole("button", { name: "21:00" })).toBeInTheDocument();
  });

  it("clears the available time selection when its proposed time is removed", async () => {
    render(<ProposeNewTimeModal open onClose={vi.fn()} initialTimeOptions={noInitialTimeOptions} />);

    fireEvent.click(await screen.findByRole("button", { name: "Toggle available time options" }));
    fireEvent.click(screen.getByRole("button", { name: "08:00" }));
    fireEvent.click(screen.getByRole("button", { name: /Remove .*8:00 AM/ }));

    expect(screen.getByPlaceholderText("Select or type time")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Toggle available time options" }));
    expect(screen.getByRole("button", { name: "08:00" })).not.toHaveClass("bg-amber-50");
  });

  it("keeps customer slots separate and allows different times on the same date", async () => {
    const onSubmit = vi.fn();
    render(
      <ProposeNewTimeModal
        open
        onClose={vi.fn()}
        initialServiceSlots={["2026.10.20 AM", "2026.10.20 PM"]}
        initialTimeOptions={noInitialTimeOptions}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText(/2026.10.20 AM, 2026.10.20 PM/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Toggle available time options" }));
    fireEvent.click(screen.getByRole("button", { name: "08:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Toggle available time options" }));
    fireEvent.click(screen.getByRole("button", { name: "21:00" }));
    fireEvent.click(screen.getByRole("button", { name: "Toggle available time options" }));
    fireEvent.click(screen.getByRole("button", { name: "21:00" }));

    expect(screen.getByRole("button", { name: /Remove .*8:00 AM/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove .*9:00 PM/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Remove/ })).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Toggle available time options" }));
    expect(screen.getByRole("button", { name: "08:00" })).toHaveClass("bg-amber-50");
    expect(screen.getByRole("button", { name: "21:00" })).toHaveClass("bg-amber-50");

    fireEvent.click(screen.getByRole("button", { name: "Send new time" }));
    expect(onSubmit).toHaveBeenCalledWith([
      expect.objectContaining({ time: "08:00", slot: "am" }),
      expect.objectContaining({ time: "21:00", slot: "pm" }),
    ]);
  });

  it("rejects typed times outside the proposed half-hour options", async () => {
    const onSubmit = vi.fn();
    render(<ProposeNewTimeModal open onClose={vi.fn()} initialTimeOptions={noInitialTimeOptions} onSubmit={onSubmit} />);

    fireEvent.change(await screen.findByPlaceholderText("Select or type time"), { target: { value: "07:00" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose a listed time");
    expect(screen.queryByRole("button", { name: /Remove/ })).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Select or type time"), { target: { value: "08:15" } });
    fireEvent.click(screen.getByRole("button", { name: "Send new time" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

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

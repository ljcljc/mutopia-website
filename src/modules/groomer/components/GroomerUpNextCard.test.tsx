import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { GroomerUpNextCard } from "./GroomerUpNextCard";

afterEach(() => vi.useRealTimers());

describe("GroomerUpNextCard", () => {
  it("shows a live countdown from the appointment's UTC instant", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-17T17:00:00Z"));
    render(
      <GroomerUpNextCard appointment={{
        petName: "Hugui", breed: "Affenpinscher", owner: "Owner", avatarUrl: "",
        address: "Vancouver", service: "Grooming", duration: "", time: "11:00 AM PDT (UTC-7)",
        scheduledTime: "2026-10-17T18:00:00Z",
      }} />,
    );

    expect(screen.getByText("1h 0m left")).toBeTruthy();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("59m left")).toBeTruthy();
  });
});

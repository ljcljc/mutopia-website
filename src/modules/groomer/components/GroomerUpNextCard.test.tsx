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
        address: "Vancouver", service: "Grooming", duration: "", time: "11:00 AM PDT",
        scheduledTime: "2026-10-17T18:00:00Z",
      }} />,
    );

    expect(screen.getByText("1 hour left")).toBeTruthy();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText("59 min left")).toBeTruthy();
  });

  it("shows days and hours without abbreviated units", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-17T17:00:00Z"));
    render(
      <GroomerUpNextCard appointment={{
        petName: "Hugui", breed: "Affenpinscher", owner: "Owner", avatarUrl: "",
        address: "Vancouver", service: "Grooming", duration: "", time: "11:00 AM PDT",
        scheduledTime: "2026-10-18T19:05:00Z",
      }} />,
    );

    expect(screen.getByText("1 day 2 hours 5 min left")).toBeTruthy();
  });

  it("compares the current service area with the previous appointment", () => {
    render(
      <GroomerUpNextCard appointment={{
        petName: "Hugui", breed: "Affenpinscher", owner: "Owner", avatarUrl: "",
        address: "Denver", service: "Grooming", duration: "", time: "11:00 AM MDT",
        scheduledTime: "2026-10-17T20:00:00Z",
        businessTimezone: "America/Denver",
        previousBusinessTimezone: "America/Vancouver",
      }} />,
    );

    expect(screen.getByText("Timezone Change: Next appointment is in Mountain Time (+1 hr vs previous appointment).")).toBeTruthy();
  });
});

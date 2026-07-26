import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import Booking from "./Booking";
import { useAuthStore } from "@/components/auth/authStore";
import { useBookingStore } from "@/components/booking/bookingStore";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    getServiceAreaProvinces: vi.fn().mockResolvedValue([]),
    getServiceAreas: vi.fn().mockResolvedValue([]),
    getPetBreeds: vi.fn().mockResolvedValue([]),
  };
});

describe("Booking step 1 validation", () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
    useBookingStore.setState({ currentStep: 1, province: "BC" });
    useAuthStore.setState({ user: null, userInfo: null });
  });

  it("keeps Continue clickable and displays all required errors without advancing", () => {
    render(<Booking />);

    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).not.toBeDisabled();
    fireEvent.click(continueButton);

    expect(screen.getByText("Address is required")).toBeInTheDocument();
    expect(screen.getByText("Select a city")).toBeInTheDocument();
    expect(screen.getByText("Postal code is required")).toBeInTheDocument();
    expect(useBookingStore.getState().currentStep).toBe(1);
  });

  it("shows every required pet-field error and remains on step 2", () => {
    useBookingStore.setState({ currentStep: 2 });
    render(<Booking />);

    fireEvent.click(screen.getAllByRole("button", { name: /^Continue/ })[0]);

    expect(screen.getByText("Pet name is required")).toBeInTheDocument();
    expect(screen.getByText("Breed is required")).toBeInTheDocument();
    expect(screen.getByText("Date of birth is required")).toBeInTheDocument();
    expect(screen.getByText("Gender is required")).toBeInTheDocument();
    expect(screen.getByText("Weight is required")).toBeInTheDocument();
    expect(screen.getByText("Coat condition is required")).toBeInTheDocument();
    expect(screen.getByText("Behavior is required")).toBeInTheDocument();
    expect(screen.getByText("Grooming frequency is required")).toBeInTheDocument();
    expect(useBookingStore.getState().currentStep).toBe(2);
  });

  it("requires a preferred time slot before leaving step 5", () => {
    useBookingStore.setState({ currentStep: 5, selectedTimeSlots: [] });
    render(<Booking />);

    fireEvent.click(screen.getAllByRole("button", { name: /^Continue/ })[0]);

    expect(screen.getAllByText("Select at least one date and time period")[0]).toBeInTheDocument();
    expect(useBookingStore.getState().currentStep).toBe(5);
  });
});

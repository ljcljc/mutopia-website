import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BookingHealthInfo from "./BookingHealthInfo";
import { getBookingDetail, updateBookingHealthInfo } from "@/lib/api";
import { toast } from "sonner";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    getBookingDetail: vi.fn(),
    updateBookingHealthInfo: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("BookingHealthInfo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads booking data and submits the health information form", async () => {
    vi.mocked(getBookingDetail).mockResolvedValue({
      id: 42,
      order_code: "#MUTOP-42",
      status: "checked_in",
      scheduled_time: "2026-07-10 15:00",
      notes: "",
      preferred_time_slots: [],
      time_options: [],
      address_snapshot: {},
      pet_snapshot: {
        name: "Max",
        health_questionnaire: {
          lifestyle: { neighborhoods: ["Burnaby"], groomingIntervalDays: 45 },
          prevention: { restrictions: "" },
          nutrition: {},
          medical: {},
          clinical: {},
        },
      },
      package_snapshot: { service_name: "Full Grooming Package" },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "100.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0.00",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "100.00",
      deposit_amount: "20.00",
      final_amount: "100.00",
      payments: [],
      adjustments: [],
      review: null,
    });
    vi.mocked(updateBookingHealthInfo).mockResolvedValue({ ok: true });

    render(
      <MemoryRouter initialEntries={["/health-form/42"]}>
        <Routes>
          <Route path="/health-form/:bookingId" element={<BookingHealthInfo />} />
          <Route path="/account/bookings/:bookingId" element={<div>Booking detail page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Lifestyle & Environment")).toBeInTheDocument();
    expect(screen.getAllByText("Lifestyle & Environment").length).toBeGreaterThan(0);

    expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Free-roaming indoors" }));
    fireEvent.click(screen.getByRole("button", { name: "Dry" }));
    fireEvent.click(screen.getByRole("button", { name: "Only pet" }));
    fireEvent.click(screen.getByRole("button", { name: "Experienced (3+ yrs)" }));
    fireEvent.click(screen.getByRole("button", { name: "Add more" }));
    fireEvent.change(screen.getByLabelText("Add neighborhood"), { target: { value: "Burnaby" } });
    fireEvent.keyDown(screen.getByLabelText("Add neighborhood"), { key: "Enter" });
    fireEvent.change(screen.getByLabelText("Bathing interval"), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText("Grooming interval"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: "Next: Prevention & Core needs" }));
    expect((await screen.findAllByText("Prevention & Core needs")).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    fireEvent.change(screen.getByLabelText("Important restrictions"), { target: { value: "Sensitive around paws." } });
    fireEvent.click(screen.getByRole("button", { name: "Next: Nutrition & Digestion" }));
    expect(await screen.findByText("Nutrition & Digestion")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dry kibble" }));
    fireEvent.click(screen.getByRole("button", { name: "Next: Clinical History & Behaviors" }));
    expect((await screen.findAllByText("Clinical History & Behaviors")).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Picky eater / Selective appetite" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(updateBookingHealthInfo).toHaveBeenCalledWith(42, {
        questionnaire: expect.objectContaining({
          lifestyle: expect.objectContaining({
            livingArrangement: expect.arrayContaining(["Free-roaming indoors"]),
          }),
          prevention: expect.objectContaining({
            spayedNeutered: true,
            restrictions: "Sensitive around paws.",
          }),
          clinical: expect.objectContaining({
            eatingHabitsAndBehaviors: expect.arrayContaining(["Picky eater / Selective appetite"]),
          }),
        }),
        behavior: "Picky eater / Selective appetite",
        grooming_frequency: "monthly",
        special_notes: "Sensitive around paws.",
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Health information updated.");
  });

  it("shows vaccination history by default, toggles microchip field with spayed or neutered, and supports multiple entries", async () => {
    vi.mocked(getBookingDetail).mockResolvedValue({
      id: 42,
      order_code: "#MUTOP-42",
      status: "confirmed",
      scheduled_time: "2026-07-10 15:00",
      notes: "",
      preferred_time_slots: [],
      time_options: [],
      address_snapshot: {},
      pet_snapshot: {
        name: "Max",
        health_questionnaire: {
          lifestyle: { neighborhoods: ["Burnaby"] },
          prevention: {},
          nutrition: {},
          medical: {},
          clinical: {},
        },
      },
      package_snapshot: { service_name: "Full Grooming Package" },
      addons_snapshot: [],
      membership_snapshot: {},
      coupon_snapshot: {},
      package_amount: "100.00",
      addons_amount: "0.00",
      membership_fee: "0.00",
      discount_rate: "0.00",
      discount_amount: "0.00",
      coupon_amount: "0.00",
      payable_amount: "100.00",
      deposit_amount: "20.00",
      final_amount: "100.00",
      payments: [],
      adjustments: [],
      review: null,
    });

    render(
      <MemoryRouter initialEntries={["/health-form/42"]}>
        <Routes>
          <Route path="/health-form/:bookingId" element={<BookingHealthInfo />} />
        </Routes>
      </MemoryRouter>,
    );

    await screen.findByText("Lifestyle & Environment");

    fireEvent.click(screen.getByRole("button", { name: "Free-roaming indoors" }));
    fireEvent.click(screen.getByRole("button", { name: "Dry" }));
    fireEvent.click(screen.getByRole("button", { name: "Only pet" }));
    fireEvent.click(screen.getByRole("button", { name: "Experienced (3+ yrs)" }));
    fireEvent.click(screen.getByRole("button", { name: "Add more" }));
    fireEvent.change(screen.getByLabelText("Add neighborhood"), { target: { value: "Burnaby" } });
    fireEvent.keyDown(screen.getByLabelText("Add neighborhood"), { key: "Enter" });
    fireEvent.change(screen.getByLabelText("Bathing interval"), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText("Grooming interval"), { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: "Next: Prevention & Core needs" }));

    expect(await screen.findByText("Prevention & Core needs")).toBeInTheDocument();
    expect(screen.getByText("Vaccination history")).toBeInTheDocument();
    expect(screen.queryByLabelText("Microchip number (optional)")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Yes" }));
    expect(screen.getByLabelText("Microchip number (optional)")).toBeInTheDocument();
    const vaccinationSection = screen.getByText("Vaccination history").closest("div.space-y-\\[14px\\].pt-\\[14px\\]") as HTMLElement | null;
    expect(vaccinationSection).not.toBeNull();
    if (!vaccinationSection) {
      throw new Error("Vaccination history section not found");
    }

    fireEvent.change(within(vaccinationSection).getByLabelText("Date:"), { target: { value: "2026-07-01" } });
    fireEvent.change(within(vaccinationSection).getByLabelText("Type:"), { target: { value: "Rabies" } });
    fireEvent.click(screen.getByRole("button", { name: "Add more vaccination" }));

    fireEvent.change(within(vaccinationSection).getByLabelText("Date 2:"), { target: { value: "2026-07-02" } });
    fireEvent.change(within(vaccinationSection).getByLabelText("Type 2:"), { target: { value: "DHPP" } });
    expect(within(vaccinationSection).getByDisplayValue("2026-07-02")).toBeInTheDocument();
    expect(within(vaccinationSection).getByDisplayValue("DHPP")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(screen.queryByLabelText("Microchip number (optional)")).not.toBeInTheDocument();
    expect(screen.getByText("Vaccination history")).toBeInTheDocument();
  });
});

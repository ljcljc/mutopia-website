import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountStore } from "@/components/account/accountStore";
import { useBookingStore } from "@/components/booking/bookingStore";
import { getPetHealthReportPdf, listPetHealthReports, type PetOut } from "@/lib/api";
import MyPets from "./MyPets";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    getPetBreeds: vi.fn().mockResolvedValue([]),
    listPetHealthReports: vi.fn().mockResolvedValue([]),
    getPetHealthReportPdf: vi.fn(),
  };
});

function makePet(overrides: Partial<PetOut> = {}): PetOut {
  return {
    id: 42,
    name: "Max",
    pet_type: "dog",
    breed: "Poodle",
    mixed_breed: false,
    precise_type: null,
    birthday: "2024-01",
    gender: "male",
    weight_value: "12",
    weight_unit: "lbs",
    coat_condition: "not_matted",
    approve_shave: false,
    behavior: "friendly",
    grooming_frequency: "monthly",
    photos: [],
    reference_photos: [],
    photo_ids: [],
    reference_photo_ids: [],
    special_notes: "",
    is_memorialized: false,
    ...overrides,
  };
}

function renderMyPets() {
  render(
    <MemoryRouter initialEntries={["/account/pets"]}>
      <Routes>
        <Route path="/account/pets" element={<MyPets />} />
        <Route path="/booking" element={<div>Booking page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MyPets", () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
    useAccountStore.setState({
      pets: [makePet()],
      isLoadingPets: false,
      petsLastFetchedAt: Date.now(),
      petsFetchPromise: null,
      fetchPets: vi.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    useBookingStore.getState().reset();
    useAccountStore.setState({
      pets: [],
      isLoadingPets: false,
      petsLastFetchedAt: 0,
      petsFetchPromise: null,
      fetchPets: async () => {},
    });
  });

  it("preserves the existing pet id when booking from My Pets", async () => {
    renderMyPets();

    fireEvent.click(await screen.findByRole("button", { name: /book for max/i }));

    await screen.findByText("Booking page");

    await waitFor(() => {
      expect(useBookingStore.getState().selectedPetId).toBe(42);
      expect(useBookingStore.getState().getPetPayload().id).toBe(42);
    });
  });

  it("lists published reports newest-first and opens the selected immutable PDF", async () => {
    vi.mocked(listPetHealthReports).mockResolvedValue([{ id: 8, service_date: "2026-08-01T10:00:00Z", groomer_name: "Alex", service_name: "Full Groom", grade: "B", published_at: "2026-08-01T12:00:00Z" }]);
    vi.mocked(getPetHealthReportPdf).mockResolvedValue(new Blob(["pdf"], { type: "application/pdf" }));
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:report");
    renderMyPets();

    const reportButton = await screen.findByRole("button", { name: /Max.*Updated:.*Ready/i });
    expect(reportButton).toBeInTheDocument();
    fireEvent.click(reportButton);

    await waitFor(() => expect(getPetHealthReportPdf).toHaveBeenCalledWith(42, 8, expect.any(AbortSignal)));
    expect(await screen.findByRole("dialog", { name: "PDF preview" })).toBeInTheDocument();
  });
});

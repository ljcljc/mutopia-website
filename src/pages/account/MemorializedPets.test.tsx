import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountStore } from "@/components/account/accountStore";
import type { PetOut } from "@/lib/api";
import MemorializedPets from "./MemorializedPets";

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    deletePet: vi.fn(),
  };
});

function makeMemorializedPet(overrides: Partial<PetOut> = {}): PetOut {
  return {
    id: 7,
    name: "Milo",
    pet_type: "dog",
    breed: "Poodle",
    mixed_breed: false,
    precise_type: null,
    birthday: "2020-04",
    gender: "male",
    weight_value: "10",
    weight_unit: "lbs",
    coat_condition: "not_matted",
    approve_shave: false,
    behavior: "friendly",
    grooming_frequency: "monthly",
    photos: [],
    reference_photos: [],
    photo_ids: [],
    reference_photo_ids: [],
    special_notes: "Needs gentle handling.",
    primary_photo: null,
    is_memorialized: true,
    ...overrides,
  };
}

describe("MemorializedPets", () => {
  beforeEach(() => {
    useAccountStore.setState({
      memorializedPets: [makeMemorializedPet()],
      isLoadingMemorializedPets: false,
      fetchMemorializedPets: vi.fn().mockResolvedValue(undefined),
    });
  });

  it("renders the selected memorialized pet details", async () => {
    render(
      <MemoryRouter initialEntries={["/account/pets/memorialized"]}>
        <MemorializedPets />
      </MemoryRouter>,
    );

    expect(await screen.findByText("Memorialized pets")).toBeInTheDocument();
    expect(screen.getAllByText("Milo").length).toBeGreaterThan(0);
    expect(screen.getByText("Health report")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete pet/i })).toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddPet from "./AddPet";
import { getPetBreeds } from "@/lib/api";
import { toast } from "sonner";

vi.mock("@/components/common/PetForm", () => ({
  PetForm: ({
    primaryActionLabel,
    onPrimaryAction,
  }: {
    primaryActionLabel: string;
    onPrimaryAction: () => void;
  }) => (
    <div>
      <div>Pet form mock</div>
      <button type="button" onClick={onPrimaryAction}>
        {primaryActionLabel}
      </button>
    </div>
  ),
}));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...actual,
    createPet: vi.fn(),
    getPetBreeds: vi.fn().mockResolvedValue([]),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("AddPet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the add pet page from My Pets flow and blocks empty submit", async () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/account/pets/new", state: { from: "my-pets" } }]}
      >
        <Routes>
          <Route path="/account/pets/new" element={<AddPet />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Pet form mock")).toBeInTheDocument();
    expect(screen.getByText("My pets")).toBeInTheDocument();
    expect(screen.getByText("Add pet")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(toast.error).toHaveBeenCalledWith("Please enter your pet's name.");
    expect(getPetBreeds).toHaveBeenCalled();
  });
});

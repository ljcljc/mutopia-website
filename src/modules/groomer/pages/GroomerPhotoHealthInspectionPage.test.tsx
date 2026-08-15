import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerPhotoHealthInspectionPage from "./GroomerPhotoHealthInspectionPage";
import {
  getCheckInObservation,
  getGroomerBookingDetail,
  getInspectionPetNotes,
  getPhotoHealthInspection,
  savePhotoHealthInspectionProgress,
  startPhotoHealthInspection,
  type PhotoHealthInspectionOut,
} from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    getCheckInObservation: vi.fn(),
    getGroomerBookingDetail: vi.fn(),
    getInspectionPetNotes: vi.fn(),
    getPhotoHealthInspection: vi.fn(),
    startPhotoHealthInspection: vi.fn(),
    savePhotoHealthInspectionProgress: vi.fn(),
    updateInspectionPhoto: vi.fn(),
    uploadInspectionPhoto: vi.fn(),
    deleteInspectionPhoto: vi.fn(),
    submitPhotoHealthInspection: vi.fn(),
  };
});

const inspection: PhotoHealthInspectionOut = {
  id: 9,
  booking_id: 42,
  status: "draft",
  current_step: 1,
  current_note: "",
  observation_tags: [],
  locked: false,
  photos: [],
};

function renderPage() {
  render(
    <MemoryRouter initialEntries={["/groomer/bookings/42/photo-health-inspection"]}>
      <Routes>
        <Route path="/groomer/bookings/:bookingId/photo-health-inspection" element={<GroomerPhotoHealthInspectionPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("GroomerPhotoHealthInspectionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({ id: 42, status: "completed", pet_snapshot: { name: "Max", breed: "Yorkie" } } as never);
    vi.mocked(getCheckInObservation).mockResolvedValue({ arrival_note: "Calm on arrival", photos: [] } as never);
    vi.mocked(getInspectionPetNotes).mockResolvedValue({ notes: [], internal_service_instruction: "Use quiet dryer" });
  });

  it("shows the overview and starts the shared six-step flow", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({ exists: false, inspection: null });
    vi.mocked(startPhotoHealthInspection).mockResolvedValue(inspection);
    renderPage();

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).toHaveTextContent(/Dashboard\s*>\s*Fill health report/);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/groomer/dashboard");
    expect(screen.queryByRole("button", { name: "‹ Dashboard" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Fill health report" })).not.toBeInTheDocument();
    expect(await screen.findByText("Calm on arrival")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start AI photo health inspection" }));

    await waitFor(() => expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      /Dashboard\s*>\s*Step 1 of 6 - Skin inspection/,
    ));
    expect(screen.queryByRole("heading", { name: "Step 1 of 6 - Skin inspection" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByRole("button", { name: "Continue AI photo health inspection" })).toBeInTheDocument();
    expect(startPhotoHealthInspection).toHaveBeenCalledWith(42);
  });

  it("reconstructs the last saved step after reload", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({ exists: true, inspection: { ...inspection, current_step: 3 } });
    renderPage();

    expect(await screen.findByRole("heading", { name: "Mouth - after grooming photos" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      /Dashboard\s*>\s*Step 3 of 6 - Mouth inspection/,
    );
    expect(screen.queryByRole("heading", { name: "Step 3 of 6 - Mouth inspection" })).not.toBeInTheDocument();
    await waitFor(() => expect(getInspectionPetNotes).toHaveBeenCalledWith(42));
  });

  it("labels the optional note step in the breadcrumb", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({ exists: true, inspection: { ...inspection, current_step: 6 } });
    renderPage();

    expect(await screen.findByText("Special instruments or notes")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      /Dashboard\s*>\s*Step 6 of 6 - Note \(Optional\)/,
    );
    expect(screen.queryByRole("heading", { name: "Step 6 of 6 - Note (Optional)" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  });

  it("allows an incomplete step to go back, persists locally, and uses the shared responsive action layout", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({ exists: true, inspection: { ...inspection, current_step: 2 } });
    renderPage();

    expect(await screen.findByText("Ear - After grooming photos")).toBeInTheDocument();
    expect(screen.getByText("Add up to 2 photos for AI health inspection")).toBeInTheDocument();
    expect(screen.getByText("Ear photo")).toBeInTheDocument();
    const previous = screen.getByRole("button", { name: "Previous" });
    const actions = previous.parentElement;
    expect(previous).toHaveClass(
      "sm:max-w-[228px]",
      "cursor-pointer",
      "hover:bg-white/10",
      "active:bg-white/20",
      "focus-visible:ring-2",
      "disabled:pointer-events-none",
    );
    expect(actions).toHaveClass("flex-col", "gap-3", "sm:flex-row", "sm:justify-between");
    fireEvent.click(previous);

    await waitFor(() => expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
      /Dashboard\s*>\s*Step 1 of 6 - Skin inspection/,
    ));
    expect(savePhotoHealthInspectionProgress).not.toHaveBeenCalled();
    await waitFor(() => expect(JSON.parse(window.localStorage.getItem("photo-health-draft:42:42") ?? "{}"))
      .toMatchObject({ currentStep: 1, observationTags: [], currentNote: "" }));
  });
});

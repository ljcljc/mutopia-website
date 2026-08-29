import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerPhotoHealthInspectionPage from "./GroomerPhotoHealthInspectionPage";
import {
  deleteInspectionPhoto,
  getCheckInObservation,
  getGroomerBookingDetail,
  getPhotoHealthAnalysis,
  getPhotoHealthInspection,
  startPhotoHealthInspection,
  uploadInspectionPhoto,
  type PhotoHealthInspectionOut,
} from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    getCheckInObservation: vi.fn(),
    getGroomerBookingDetail: vi.fn(),
    getPhotoHealthAnalysis: vi.fn(),
    getPhotoHealthInspection: vi.fn(),
    startPhotoHealthInspection: vi.fn(),
    updateInspectionPhoto: vi.fn(),
    uploadInspectionPhoto: vi.fn(),
    deleteInspectionPhoto: vi.fn(),
    submitPhotoHealthInspection: vi.fn(),
  };
});

vi.mock("@/lib/imageCompression", () => ({
  compressInspectionImage: vi.fn(async (file: File) => file),
  createInspectionImagePreview: vi.fn(async (file: File) => file),
  createTemporaryPhotoId: vi.fn(() => -1),
}));

const inspection: PhotoHealthInspectionOut = {
  id: 9,
  booking_id: 42,
  status: "draft",
  current_step: 1,
  current_note: "",
  handover_note: "",
  overall_professional_impression: "",
  step6_phase: "impression",
  observation_tags: [],
  locked: false,
  photos: [],
};

function renderPage() {
  render(
    <MemoryRouter
      initialEntries={["/groomer/bookings/42/photo-health-inspection"]}
    >
      <Routes>
        <Route
          path="/groomer/bookings/:bookingId/photo-health-inspection"
          element={<GroomerPhotoHealthInspectionPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe("GroomerPhotoHealthInspectionPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:compressed-photo");
    vi.mocked(getGroomerBookingDetail).mockResolvedValue({
      id: 42,
      status: "completed",
      pet_snapshot: { name: "Max", breed: "Yorkie" },
    } as never);
    vi.mocked(getCheckInObservation).mockResolvedValue({
      arrival_note: "Calm on arrival",
      photos: [],
    } as never);
  });

  it("shows the overview and starts the shared six-step flow", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: false,
      inspection: null,
    });
    vi.mocked(startPhotoHealthInspection).mockResolvedValue(inspection);
    renderPage();

    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).toHaveTextContent(/Dashboard\s*>\s*Fill health report/);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/groomer/dashboard"
    );
    expect(
      screen.queryByRole("button", { name: "‹ Dashboard" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Fill health report" })
    ).not.toBeInTheDocument();
    expect(await screen.findByText("Calm on arrival")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Start AI photo health inspection" })
    );

    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" })
      ).toHaveTextContent(/Dashboard\s*>\s*Step 1 of 6 - Skin inspection/)
    );
    expect(
      screen.queryByRole("heading", { name: "Step 1 of 6 - Skin inspection" })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(
      screen.getByRole("button", {
        name: "Continue AI photo health inspection",
      })
    ).toBeInTheDocument();
    expect(startPhotoHealthInspection).toHaveBeenCalledWith(42);
  });

  it("reconstructs the last saved step after reload", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 3 },
    });
    renderPage();

    expect(
      await screen.findByRole("heading", {
        name: "Mouth - after grooming photos",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toHaveTextContent(/Dashboard\s*>\s*Step 3 of 6 - Mouth inspection/);
    expect(
      screen.queryByRole("heading", { name: "Step 3 of 6 - Mouth inspection" })
    ).not.toBeInTheDocument();
  });

  it("persists an AI Scan classification to the local draft immediately", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        photos: [
          {
            id: 1,
            area: "skin",
            url: "/photo.jpg",
            original_filename: "photo.jpg",
            source_mime_type: "image/jpeg",
            normalized_mime_type: "image/jpeg",
            size_bytes: 1,
            classification: "normal",
            finding_hints: [],
            confirmed: true,
          },
        ],
      },
    });
    renderPage();

    fireEvent.click(await screen.findByRole("img", { name: "photo.jpg" }));
    fireEvent.click(screen.getAllByRole("button", { name: /AI Scan/ })[0]);

    expect(
      JSON.parse(
        window.localStorage.getItem("photo-health-draft:42:42") ?? "{}"
      ).photos
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, classification: "ai_scan" }),
      ])
    );
  });

  it("keeps the review panel open after a newly uploaded photo is auto-confirmed", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection,
    });
    vi.mocked(uploadInspectionPhoto).mockResolvedValue({
      id: 101,
      area: "skin",
      url: "/uploaded-skin.jpg",
      original_filename: "skin.jpg",
      normalized_mime_type: "image/jpeg",
      classification: "normal",
      finding_hints: [],
      confirmed: false,
    });
    renderPage();

    await screen.findByRole("button", { name: "Add Skin photo" });
    const input =
      document.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    fireEvent.change(input!, {
      target: {
        files: [new File(["image"], "skin.jpg", { type: "image/jpeg" })],
      },
    });

    expect(
      await screen.findByRole("dialog", { name: "Skin photo review" })
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("dialog", { name: "Skin photo review" })
      ).toBeInTheDocument()
    );
  });

  it("shows removal feedback while a photo deletion is pending", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        photos: [
          {
            id: 21,
            area: "skin",
            url: "/skin.jpg",
            original_filename: "skin.jpg",
            normalized_mime_type: "image/jpeg",
            classification: "normal",
            finding_hints: [],
            confirmed: true,
          },
        ],
      },
    });
    vi.mocked(deleteInspectionPhoto).mockReturnValue(new Promise(() => {}));
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Remove Skin photo 1" })
    );

    expect(screen.getByText("Removing")).toBeInTheDocument();
  });

  it("requires an overall professional impression before showing the two note fields", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 6 },
    });
    renderPage();

    expect(
      await screen.findByText("Overall professional impression")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toHaveTextContent(/Dashboard\s*>\s*Step 6 of 6 - Summary & notes/);
    expect(
      screen.queryByRole("heading", { name: "Step 6 of 6 - Summary & notes" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add notes" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Previous: Posture" })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Grade B: Minor Care/ })
    );
    fireEvent.click(screen.getByRole("button", { name: "Add notes" }));

    expect(await screen.findByText("Groomer Note")).toBeInTheDocument();
    expect(screen.getByText("Note for your partner")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous: Summary" })
    ).toBeInTheDocument();
    expect(
      JSON.parse(
        window.localStorage.getItem("photo-health-draft:42:42") ?? "{}"
      )
    ).toMatchObject({
      currentStep: 6,
      overallProfessionalImpression: "grade_b",
      step6Phase: "notes",
    });
  });

  it("defaults a legacy Step 6 response without a phase to the impression page", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        current_step: 6,
        step6_phase: undefined,
      } as unknown as PhotoHealthInspectionOut,
    });
    renderPage();

    expect(
      await screen.findByText("Overall professional impression")
    ).toBeInTheDocument();
    expect(screen.queryByText("Note for your partner")).not.toBeInTheDocument();
  });

  it("uses the dedicated full-screen generation state while an existing analysis is running", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        status: "analyzing",
        current_step: 6,
        locked: true,
      },
    });
    vi.mocked(getPhotoHealthAnalysis).mockReturnValue(new Promise(() => {}));
    renderPage();

    const loadingScreen = await screen.findByRole("status", {
      name: "Generating health report",
    });
    expect(loadingScreen).toHaveClass("bg-[#633479]");
    expect(loadingScreen).toHaveTextContent("Generating health report...");
    expect(
      screen.queryByRole("navigation", { name: "Breadcrumb" })
    ).not.toBeInTheDocument();
  });

  it("allows an incomplete step to go back, persists locally, and uses the shared responsive action layout", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 2 },
    });
    renderPage();

    expect(
      await screen.findByText("Ear - After grooming photos")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add at least 2 photos of each ear for AI health inspection"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Ear photo")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Left ear")).toContainHTML("<svg");
    expect(screen.getByLabelText("Upload Right ear")).toContainHTML("<svg");
    const previous = screen.getByRole("button", { name: "Previous" });
    const actions = previous.parentElement;
    expect(previous).toHaveClass(
      "sm:max-w-[228px]",
      "cursor-pointer",
      "hover:bg-white/10",
      "active:bg-white/20",
      "focus-visible:ring-2",
      "disabled:pointer-events-none"
    );
    expect(actions).toHaveClass(
      "flex-col",
      "gap-3",
      "sm:flex-row",
      "sm:justify-between"
    );
    fireEvent.click(previous);

    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" })
      ).toHaveTextContent(/Dashboard\s*>\s*Step 1 of 6 - Skin inspection/)
    );
    await waitFor(() =>
      expect(
        JSON.parse(
          window.localStorage.getItem("photo-health-draft:42:42") ?? "{}"
        )
      ).toMatchObject({ currentStep: 1, observationTags: [], currentNote: "" })
    );
  });

  it("uses the paired upload grid for Step 4 eyes", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 4 },
    });
    renderPage();

    expect(
      await screen.findByText("Eye - After grooming photos")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add at least 2 photos of each eye for AI health inspection"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Left eye")).toContainHTML("<svg");
    expect(screen.getByLabelText("Upload Right eye")).toContainHTML("<svg");
  });
});

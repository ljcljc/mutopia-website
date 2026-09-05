import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GroomerPhotoHealthInspectionPage from "./GroomerPhotoHealthInspectionPage";
import {
  deleteInspectionPhoto,
  getCheckInObservation,
  getGroomerBookingDetail,
  getPhotoHealthAnalysis,
  getPhotoHealthInspection,
  startPhotoHealthInspection,
  submitPhotoHealthInspection,
  updateInspectionPhoto,
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

function renderPage(withDashboard = false) {
  render(
    <MemoryRouter
      initialEntries={["/groomer/bookings/42/photo-health-inspection"]}
    >
      <Routes>
        <Route
          path="/groomer/bookings/:bookingId/photo-health-inspection"
          element={<GroomerPhotoHealthInspectionPage />}
        />
        {withDashboard ? (
          <Route
            path="/groomer/dashboard"
            element={<div>Groomer dashboard</div>}
          />
        ) : null}
      </Routes>
    </MemoryRouter>
  );
}

describe("GroomerPhotoHealthInspectionPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("confirms leaving a step that already has content", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        photos: [
          {
            id: 1,
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
    renderPage(true);

    fireEvent.click(await screen.findByRole("button", { name: "Dashboard" }));
    expect(
      await screen.findByRole("dialog", { name: "Incomplete Health Report" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Keep Editing" }));
    expect(
      screen.queryByRole("dialog", { name: "Incomplete Health Report" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/Skin\s*-\s*after grooming photos/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Leave and defer to End of Day",
      })
    );
    expect(await screen.findByText("Groomer dashboard")).toBeInTheDocument();
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

    await waitFor(() =>
      expect(updateInspectionPhoto).toHaveBeenCalledWith(42, 1, {
        classification: "ai_scan",
        finding_hints: [],
        description: "",
      })
    );
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

  it("allows advancing with an unconfirmed remotely uploaded photo", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        photos: [
          {
            id: 76,
            area: "skin",
            url: "/remote-skin.jpg",
            original_filename: "remote-skin.jpg",
            normalized_mime_type: "image/jpeg",
            classification: null,
            finding_hints: [],
            confirmed: false,
          },
        ],
      },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: /Next: Ear inspection/ })
    );

    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" })
      ).toHaveTextContent(/Step 2 of 6 - Ear inspection/)
    );
    expect(
      screen.queryByRole("dialog", { name: "Skin photo review" })
    ).not.toBeInTheDocument();
  });

  it("shows a description error when an AI Scan photo is missing description", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        photos: [
          {
            id: 78,
            area: "skin",
            url: "/ai-skin.jpg",
            original_filename: "ai-skin.jpg",
            normalized_mime_type: "image/jpeg",
            classification: "ai_scan",
            finding_hints: [],
            confirmed: true,
            description: "",
          },
        ],
      },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: /Next: Ear inspection/ })
    );

    expect(
      await screen.findByText(
        "Add a description for every AI Scan photo before continuing."
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: "Skin photo review" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toHaveTextContent(/Step 1 of 6 - Skin inspection/);
  });

  it("allows Step 5 posture photos without an AI Scan description", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        current_step: 5,
        photos: [
          {
            id: 79,
            area: "posture",
            url: "/posture.jpg",
            original_filename: "posture.jpg",
            normalized_mime_type: "image/jpeg",
            classification: "ai_scan",
            finding_hints: [],
            confirmed: true,
            description: "",
          },
        ],
      },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Add Notes & Generate Report",
      })
    );

    await waitFor(() =>
      expect(
        screen.getByRole("navigation", { name: "Breadcrumb" })
      ).toHaveTextContent(/Step 6 of 6 - Summary & notes/)
    );
    expect(
      screen.queryByText(
        "Add a description for every AI Scan photo before continuing."
      )
    ).not.toBeInTheDocument();
  });

  it("requires a groomer note and skips unconfirmed photo review before final report generation", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        current_step: 6,
        step6_phase: "notes",
        overall_professional_impression: "grade_b",
        photos: [
          {
            id: 77,
            area: "skin",
            url: "/remote-skin.jpg",
            original_filename: "remote-skin.jpg",
            normalized_mime_type: "image/jpeg",
            classification: null,
            finding_hints: [],
            confirmed: false,
          },
        ],
      },
    });
    vi.mocked(submitPhotoHealthInspection).mockResolvedValue({
      job_id: 1,
    } as never);
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "All good! Generate Report" })
    );
    expect(
      await screen.findByText(
        "Groomer Note is required before generating the report."
      )
    ).toBeInTheDocument();
    expect(submitPhotoHealthInspection).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { name: "Skin photo review" })
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Groomer Note *"), {
      target: { value: "Coat looks healthy after grooming." },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "All good! Generate Report" })
    );
    await waitFor(() =>
      expect(submitPhotoHealthInspection).toHaveBeenCalled()
    );
    expect(
      screen.queryByRole("dialog", { name: "Skin photo review" })
    ).not.toBeInTheDocument();
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

  it("keeps a local thumbnail while the uploaded Step 2 ear photo settles", async () => {
    class LoadedImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_url: string) {}
    }
    vi.stubGlobal("Image", LoadedImage);
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 2 },
    });
    vi.mocked(uploadInspectionPhoto).mockResolvedValue({
      id: 102,
      area: "left_ear",
      url: "/uploaded-left-ear.jpg",
      original_filename: "left-ear.jpg",
      normalized_mime_type: "image/jpeg",
      classification: "normal",
      finding_hints: [],
      confirmed: false,
    });
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL");
    renderPage();

    const uploadLeftEar = await screen.findByRole("button", {
      name: "Upload Left ear",
    });
    const input =
      uploadLeftEar.parentElement?.querySelector<HTMLInputElement>(
        'input[type="file"]'
      );
    expect(input).not.toBeNull();
    fireEvent.change(input!, {
      target: {
        files: [new File(["image"], "left-ear.jpg", { type: "image/jpeg" })],
      },
    });

    await waitFor(() => expect(uploadInspectionPhoto).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("img", { name: "left-ear.jpg" })
          .some(
            (image) => image.getAttribute("src") === "blob:compressed-photo"
          )
      ).toBe(true)
    );
    expect(revokeObjectURL).not.toHaveBeenCalledWith("blob:compressed-photo");
    expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
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

  it("requires a Step 6 rating before showing notes and can return to posture", async () => {
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
    expect(
      screen.getByRole("button", { name: "Add notes" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Previous: Posture" })
    ).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Previous: Posture" }));
    await waitFor(() =>
      expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveTextContent(
        /Step 5 of 6 - Posture/
      )
    );
  });

  it("returns from Step 6 notes to the rating summary", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: { ...inspection, current_step: 6 },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: /Grade B: Minor Care/ })
    );
    fireEvent.click(screen.getByRole("button", { name: "Add notes" }));

    expect(await screen.findByText("Groomer Note")).toBeInTheDocument();
    expect(screen.getByText("Note for your partner")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous: Summary" })
    ).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Previous: Summary" }));
    expect(
      await screen.findByText("Overall professional impression")
    ).toBeInTheDocument();
  });

  it("opens Step 6 on rating before notes when advancing from posture", async () => {
    vi.mocked(getPhotoHealthInspection).mockResolvedValue({
      exists: true,
      inspection: {
        ...inspection,
        current_step: 5,
        photos: [
          {
            id: 80,
            area: "posture",
            url: "/posture.jpg",
            original_filename: "posture.jpg",
            normalized_mime_type: "image/jpeg",
            classification: null,
            finding_hints: [],
            confirmed: true,
          },
        ],
      },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Add Notes & Generate Report",
      })
    );
    expect(
      await screen.findByText("Overall professional impression")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Grade B: Minor Care/ }));
    fireEvent.click(screen.getByRole("button", { name: "Add notes" }));
    expect(await screen.findByText("Groomer Note")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Previous: Summary" }));
    expect(
      await screen.findByText("Overall professional impression")
    ).toBeInTheDocument();
  });

  it("defaults a legacy Step 6 response without a phase to the rating page", async () => {
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
    expect(loadingScreen).toHaveTextContent(
      "Generating report.It will take about 1-2 minutes."
    );
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
        "Add at least 1 photo of each ear for AI health inspection"
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
        "Add at least 1 photo of each eye for AI health inspection"
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Left eye")).toContainHTML("<svg");
    expect(screen.getByLabelText("Upload Right eye")).toContainHTML("<svg");
  });
});

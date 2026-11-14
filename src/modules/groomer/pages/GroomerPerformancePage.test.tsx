import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerPerformancePage from "./GroomerPerformancePage";
import { getGroomerPerformance, reportGroomerReview, replyGroomerReview, submitGroomerTechnicalSkillUpdate, uploadGroomerApplyImage } from "@/lib/api";
import { toast } from "sonner";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getGroomerPerformance: vi.fn(),
    replyGroomerReview: vi.fn(),
    reportGroomerReview: vi.fn(),
    uploadGroomerApplyImage: vi.fn(),
    submitGroomerTechnicalSkillUpdate: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

function renderPage(entry = "/groomer/account/performance") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <GroomerPerformancePage />
    </MemoryRouter>,
  );
}

describe("GroomerPerformancePage review actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("submits a reply for the latest feedback", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      punctuality: { on_time_rate: 92, late_arrival_count: 1, latest_late_minutes: 4 },
      recent_feedback: [
        {
          review_id: 18, created_at: new Date().toISOString(),
          booking_id: 501,
          user_name: "Taylor",
          rating: 5,
          comment: "Excellent grooming session.",
        },
      ],
    });
    vi.mocked(replyGroomerReview).mockResolvedValue({ ok: true });

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Reply" }));
    fireEvent.change(screen.getByPlaceholderText("Reply here"), {
      target: { value: "Thanks for the feedback." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(replyGroomerReview).toHaveBeenCalledWith(18, { reply: "Thanks for the feedback." });
    });
    expect(toast.success).toHaveBeenCalledWith("Reply sent");
    expect(await screen.findByText("Your reply")).toBeInTheDocument();
    expect(screen.getByText("Thanks for the feedback.")).toBeInTheDocument();
  });

  it("opens and focuses the requested review instead of the latest one", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      punctuality: { on_time_rate: 92, late_arrival_count: 1, latest_late_minutes: 4 },
      recent_feedback: [
        { review_id: 19, created_at: new Date().toISOString(), booking_id: 502, user_name: "Latest", rating: 5, comment: "Newer review" },
        { review_id: 18, created_at: new Date().toISOString(), booking_id: 501, user_name: "Target", rating: 5, comment: "Target review" },
      ],
    });

    renderPage("/groomer/account/performance?reviewId=18");

    expect(await screen.findByText("Target")).toBeInTheDocument();
    expect(screen.getByText("Latest")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Reply" })).toHaveLength(1);
    expect(screen.getByRole("textbox", { name: "Reply to Target's review" })).toHaveFocus();
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "center" });
  });

  it("shows an existing reply without reopening the editor", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      punctuality: { on_time_rate: 92, late_arrival_count: 1, latest_late_minutes: 4 },
      recent_feedback: [
        { review_id: 18, created_at: new Date().toISOString(), booking_id: 501, user_name: "Target", rating: 5, comment: "Great service", reply: "Thank you!" },
      ],
    });

    renderPage("/groomer/account/performance?reviewId=18");

    expect(await screen.findByText("Thank you!")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "Reply to Target's review" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Report review" })).toBeInTheDocument();
  });

  it("submits a report for the latest feedback", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      punctuality: { on_time_rate: 92, late_arrival_count: 1, latest_late_minutes: 4 },
      recent_feedback: [
        {
          review_id: 21, created_at: new Date().toISOString(),
          booking_id: 502,
          user_name: "Jordan",
          rating: 2,
          comment: "This review should be checked.",
        },
      ],
    });
    vi.mocked(reportGroomerReview).mockResolvedValue({ ok: true });

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Report review" }));
    fireEvent.change(screen.getByPlaceholderText("Share your reasons"), {
      target: { value: "Contains abusive language." },
    });
    const file = new File(["evidence"], "evidence.png", { type: "image/png" });
    const fileInput = document.querySelector("#report-review-evidence") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(reportGroomerReview).toHaveBeenCalledWith(21, {
        why: "Contains abusive language.",
        evidenceFile: file,
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Review reported");
  });

  it("renders an existing groomer reply from the performance payload", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      punctuality: { on_time_rate: 100, late_arrival_count: 0, latest_late_minutes: null },
      recent_feedback: [
        {
          review_id: 22, created_at: new Date().toISOString(),
          booking_id: 503,
          user_name: "Alex",
          rating: 5,
          comment: "Very professional.",
          groomer_reply: "Appreciate your support.",
        },
      ],
    });

    renderPage();

    expect(await screen.findByText("Your reply")).toBeInTheDocument();
    expect(screen.getByText("Appreciate your support.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reply" })).not.toBeInTheDocument();
  });

  it("shows one card per recent review and explains an expired deep link", async () => {
    const recent = new Date().toISOString();
    const expired = new Date(Date.now() - 73 * 60 * 60 * 1000).toISOString();
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92, level_label: "Premium", breakdown: {},
      punctuality: { on_time_rate: 100, late_arrival_count: 0, latest_late_minutes: null },
      recent_feedback: [
        { review_id: 1, booking_id: 1, user_name: "A", rating: 5, comment: "First", created_at: recent },
        { review_id: 2, booking_id: 2, user_name: "B", rating: 4, comment: "Second", created_at: recent },
        { review_id: 3, booking_id: 3, user_name: "C", rating: 3, comment: "Old", created_at: expired },
      ],
    });
    renderPage("/groomer/account/performance?reviewId=3");
    expect(await screen.findByText("Client feedback in 72 hours")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Reply" })).toHaveLength(2);
    expect(screen.queryByText("C")).not.toBeInTheDocument();
    expect(screen.getByText(/outside the last 72 hours/)).toBeInTheDocument();
  });

  it("submits a technical skill update and refreshes the status badge", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: { technical: 19 },
      punctuality: { on_time_rate: 100, late_arrival_count: 0, latest_late_minutes: null },
      technical_skill: {
        certification_title: "Level A (Certified groomer in China)",
        status: "approved",
        status_label: "Profile documents received",
        can_update: true,
        latest_request: null,
      },
      recent_feedback: [],
    });
    vi.mocked(uploadGroomerApplyImage).mockResolvedValue({ id: 17, url: "/media/evidence.png", category: "work_or_cert" });
    vi.mocked(submitGroomerTechnicalSkillUpdate).mockResolvedValue({
      ok: true,
      technical_skill: {
        certification_title: "Level A (Certified groomer in China)",
        status: "pending",
        status_label: "Your request is under review",
        can_update: true,
        latest_request: {
          id: 99,
          status: "pending",
          description: "I completed advanced grooming workshops.",
          reviewer_notes: "",
          evidence_image_id: 17,
          submitted_at: "2026-05-31T00:00:00Z",
          reviewed_at: null,
        },
      },
    });

    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Update" }));
    await screen.findByText("How you optimize your skills");
    fireEvent.change(screen.getByPlaceholderText("Share your experience"), {
      target: { value: "I completed advanced grooming workshops." },
    });
    const file = new File(["evidence"], "skill-proof.png", { type: "image/png" });
    const fileInput = document.querySelector("#technical-skill-evidence") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    const updateButtons = screen.getAllByRole("button", { name: "Update" });
    fireEvent.click(updateButtons[updateButtons.length - 1] as HTMLElement);

    await waitFor(() => {
      expect(uploadGroomerApplyImage).toHaveBeenCalledWith(file, "work_or_cert");
      expect(submitGroomerTechnicalSkillUpdate).toHaveBeenCalledWith({
        description: "I completed advanced grooming workshops.",
        evidence_image_id: 17,
      });
    });
    expect(toast.success).toHaveBeenCalledWith("Technical skill update submitted");
    expect(await screen.findByText("Your request is under review")).toBeInTheDocument();
  });

  it("renders punctuality from real API fields instead of score mapping", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: { reliability: 16 },
      punctuality: { on_time_rate: 92, late_arrival_count: 1, latest_late_minutes: 4 },
      recent_feedback: [],
    });

    renderPage();

    expect(await screen.findByText("92% On-time")).toBeInTheDocument();
    expect(screen.getByText("1 Late arrival (4 mins)")).toBeInTheDocument();
    expect(screen.getByText("16")).toBeInTheDocument();
  });
});

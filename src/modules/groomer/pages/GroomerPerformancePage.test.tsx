import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GroomerPerformancePage from "./GroomerPerformancePage";
import { getGroomerPerformance, reportGroomerReview, replyGroomerReview } from "@/lib/api";
import { toast } from "sonner";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getGroomerPerformance: vi.fn(),
    replyGroomerReview: vi.fn(),
    reportGroomerReview: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

function renderPage() {
  return render(
    <MemoryRouter>
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
      recent_feedback: [
        {
          review_id: 18,
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

  it("submits a report for the latest feedback", async () => {
    vi.mocked(getGroomerPerformance).mockResolvedValue({
      score: 92,
      level_label: "Premium",
      breakdown: {},
      recent_feedback: [
        {
          review_id: 21,
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
      recent_feedback: [
        {
          review_id: 22,
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
});

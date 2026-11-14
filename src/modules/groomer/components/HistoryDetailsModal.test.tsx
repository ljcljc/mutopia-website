import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HistoryDetailsModal } from "./HistoryDetailsModal";
import { replyGroomerReview } from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/api")>(),
  replyGroomerReview: vi.fn(),
  reportGroomerReview: vi.fn(),
}));

describe("HistoryDetailsModal review", () => {
  beforeEach(() => vi.clearAllMocks());

  it("hides the review card when this booking has no review", () => {
    render(<HistoryDetailsModal open onClose={vi.fn()} appointment={{ id: "42", petName: "Max", breed: "Poodle" }} detail={{ id: 42, review: null }} />);
    expect(screen.queryByRole("button", { name: "Report review" })).not.toBeInTheDocument();
  });

  it("uses initials when the client has no avatar", () => {
    render(<HistoryDetailsModal open onClose={vi.fn()} appointment={{ id: "42", petName: "Max", breed: "Poodle" }} detail={{
      id: 42, user_name: "Taylor", review: { id: 7, rating: 5, comment: "Great visit" },
    }} />);
    expect(screen.getByRole("img", { name: "Taylor avatar placeholder" })).toHaveTextContent("T");
  });

  it("shows the booking review regardless of age and updates its reply", async () => {
    vi.mocked(replyGroomerReview).mockResolvedValue({ ok: true });
    render(<HistoryDetailsModal open onClose={vi.fn()} appointment={{ id: "42", petName: "Max", breed: "Poodle" }} detail={{
      id: 42,
      user_name: "Taylor",
      review: { id: 7, rating: 5, comment: "Great visit", avatar_url: "/media/users/12/avatar/photo.jpg", created_at: "2020-01-01T00:00:00Z" },
    }} />);

    expect(screen.getByText("Taylor")).toBeInTheDocument();
    const avatar = screen.getByRole("img", { name: "Taylor" });
    expect(avatar).toHaveAttribute("src", "/media/users/12/avatar/photo.jpg");
    fireEvent.error(avatar);
    expect(screen.getByRole("img", { name: "Taylor avatar placeholder" })).toHaveTextContent("T");
    expect(screen.getByText('"Great visit"')).toBeInTheDocument();
    expect(screen.queryByText("Client feedback in 72 hours")).not.toBeInTheDocument();
    const replyButton = screen.getByRole("button", { name: "Reply" });
    expect(replyButton.querySelector("svg path")).toHaveAttribute("d", "M6 5L3 8L6 11M3.5 8H9.25C11.3211 8 13 9.67893 13 11.75V12");
    expect(screen.getByRole("button", { name: "Report review" }).firstElementChild).toHaveClass("underline", "text-[#8B6357]");
    fireEvent.click(replyButton);
    expect(screen.getByRole("button", { name: "Send" })).toHaveClass("h-[48px]", "w-full");
    expect(screen.getByRole("button", { name: "Cancel" }).firstElementChild).toHaveClass("font-comfortaa", "text-[13px]", "text-[#8B6357]", "underline");
    fireEvent.change(screen.getByRole("textbox", { name: "Reply to Taylor's review" }), { target: { value: "Thank you" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(replyGroomerReview).toHaveBeenCalledWith(7, { reply: "Thank you" }));
    expect(await screen.findByText("Thank you")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Report review" }));
    expect(screen.getByPlaceholderText("Share your reasons")).toBeInTheDocument();
  });
});

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Notifications from "./Notifications";
import { getMessages } from "@/lib/api";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();
  return {
    ...actual,
    deleteMessage: vi.fn(),
    getMessages: vi.fn(),
    markAllMessagesRead: vi.fn(),
    markMessageRead: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

describe("Notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMessages).mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      page_size: 20,
    });
  });

  it("renders the empty customer notifications state", async () => {
    const { container } = render(<Notifications />);

    expect(await screen.findByText("Notifications")).toBeInTheDocument();
    expect(await screen.findByText("No notifications")).toBeInTheDocument();
    await waitFor(() => {
      expect(getMessages).toHaveBeenCalledWith(
        expect.objectContaining({ scope: "user" }),
      );
    });
    expect(container.textContent).toContain("You're all caught up!");
  });

  it("renders the groomer notifications variant", async () => {
    const { container } = render(<Notifications scope="groomer" variant="groomer" />);

    expect(await screen.findByText("Notifications")).toBeInTheDocument();
    await waitFor(() => {
      expect(getMessages).toHaveBeenCalledWith(
        expect.objectContaining({ scope: "groomer" }),
      );
    });
    expect(container.textContent).toContain("No notifications");
  });
});

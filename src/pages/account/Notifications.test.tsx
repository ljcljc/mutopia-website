import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Notifications from "./Notifications";
import { getMessages, markMessageRead, type MessageOut, type MessageScope } from "@/lib/api";

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
  let now = 10_000_000_000_000;

  beforeEach(() => {
    vi.clearAllMocks();
    now += 20_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
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

  it.each([
    ["user", 0], ["user", 1], ["groomer", 0], ["groomer", 1],
  ] as [MessageScope, number][])("marks a %s notification read from link %i and navigates", async (scope, linkIndex) => {
    const message: MessageOut = {
      id: scope === "user" ? 101 : 102,
      channel: "in_app",
      type: "updates",
      title: "Booking update",
      content: "Open your booking",
      link_text: "View booking",
      link_uri: "/account/bookings/123",
      sent_at: "2026-10-25T00:00:00Z",
      is_read: false,
    };
    vi.mocked(getMessages).mockResolvedValue({ items: [message], total: 1, page: 1, page_size: 20 });
    vi.mocked(markMessageRead).mockResolvedValue({ ok: true });

    render(
      <MemoryRouter initialEntries={["/notifications"]}>
        <Routes>
          <Route path="/notifications" element={<Notifications scope={scope} variant={scope === "groomer" ? "groomer" : "customer"} />} />
          <Route path="/account/bookings/123" element={<><div>Booking detail</div><Link to="/notifications">Back</Link></>} />
        </Routes>
      </MemoryRouter>,
    );
    const links = await screen.findAllByRole("link", { name: "View booking" });
    fireEvent.click(screen.getAllByText("Booking update")[linkIndex]);
    expect(markMessageRead).not.toHaveBeenCalled();
    fireEvent.click(links[linkIndex]);

    expect(markMessageRead).toHaveBeenCalledExactlyOnceWith(message.id);
    expect(await screen.findByText("Booking detail")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "Back" }));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Mark as read" })).not.toBeInTheDocument());
  });

  it("does not mark the copy link as read", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    vi.mocked(getMessages).mockResolvedValue({
      items: [{
        id: 103,
        channel: "in_app",
        type: "referral",
        title: "Referral code",
        content: "Share it",
        link_text: "Copy unique refer code",
        link_uri: "ABC123",
        sent_at: "2026-10-25T00:00:00Z",
        is_read: false,
      }],
      total: 1,
      page: 1,
      page_size: 20,
    });

    render(
      <MemoryRouter initialEntries={["/notifications"]}>
        <Routes>
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/ABC123" element={<div>Unexpected navigation</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click((await screen.findAllByRole("link", { name: "Copy unique refer code" }))[0]);

    expect(markMessageRead).not.toHaveBeenCalled();
    expect(writeText).toHaveBeenCalledExactlyOnceWith("ABC123");
    expect(screen.getAllByText("Referral code")).toHaveLength(2);
    expect(screen.queryByText("Unexpected navigation")).not.toBeInTheDocument();
    if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
    else Reflect.deleteProperty(navigator, "clipboard");
  });
});

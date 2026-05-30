import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BookingRequestInteraction, type BookingRequestContentData } from "./BookingRequestContent";

vi.mock("@/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api")>();

  return {
    ...actual,
    getGroomerScheduleNearestConflict: vi.fn(),
  };
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const proposedRequest: BookingRequestContentData = {
  petName: "Hugui",
  breed: "Affenpinscher",
  owner: "jing184 ren",
  avatarUrl: "/images/logo.png",
  address: "601 Tolmie St, Vancouver, BC, V6B 5A1",
  service: "Premium bath",
  duration: "1 hour",
  invitationStatus: "accepted",
  proposedTimeOptions: [
    {
      date: "2026-05-30",
      slot: "pm",
      time: "17:00",
      datetime_local: "2026-05-30 17:00",
    },
    {
      date: "2026-05-31",
      slot: "am",
      time: "08:00",
      datetime_local: "2026-05-31 08:00",
    },
  ],
};

describe("BookingRequestInteraction", () => {
  beforeEach(() => {
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("does not show modify actions after proposing times to the pet owner", () => {
    render(
      <BookingRequestInteraction
        request={proposedRequest}
        expanded
        passAppointmentContextLabel="BOOKING REQUEST"
        passAppointmentReturnLabel="Go back"
        onConfirmOriginalTime={vi.fn()}
        onProposeNewTime={vi.fn()}
        onDecline={vi.fn()}
      />,
    );

    expect(screen.getByText("Waiting for pet owner confirmation")).toBeInTheDocument();
    expect(screen.getByText("2026.05.30 5:00 PM")).toBeInTheDocument();
    expect(screen.getByText("2026.05.31 8:00 AM")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Modify confirmed appointment" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Propose new time" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pass appointment" })).toBeInTheDocument();
  });
});

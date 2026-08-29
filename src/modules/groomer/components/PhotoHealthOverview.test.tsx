import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BookingDetailOut, CheckInObservationOut } from "@/lib/api";
import { PhotoHealthOverview } from "./PhotoHealthOverview";

const booking = {
  id: 71,
  status: "checked_in",
  scheduled_time: "2026-08-09T02:30:00Z",
  pet_snapshot: {
    name: "Max",
    breed: "Yorkie",
    behavior: "hard_to_handle",
    pet_avatar: "/media/max.jpg",
  },
  package_snapshot: { service_name: "Full Groom" },
  package_amount: 0,
  addons_amount: 0,
  membership_fee: 0,
  discount_rate: 0,
  discount_amount: 0,
  coupon_amount: 0,
  payable_amount: 0,
  deposit_amount: 0,
  final_amount: 0,
} satisfies BookingDetailOut;

const arrival: CheckInObservationOut = {
  id: 8,
  arrival_note: "",
  locked: true,
  photos: [
    {
      id: 10,
      url: "/media/before-one.jpg",
      original_filename: "before-one.jpg",
      source_mime_type: "image/jpeg",
      normalized_mime_type: "image/jpeg",
      size_bytes: 1024,
    },
    {
      id: 11,
      url: "/media/before-two.jpg",
      original_filename: "before-two.jpg",
      source_mime_type: "image/jpeg",
      normalized_mime_type: "image/jpeg",
      size_bytes: 2048,
    },
  ],
};

describe("PhotoHealthOverview", () => {
  it("renders the booking snapshot behavior as read-only", () => {
    render(
      <PhotoHealthOverview
        booking={booking}
        arrival={arrival}
        saving={false}
        startLabel="Start inspection"
        onStart={vi.fn()}
      />
    );

    expect(screen.getByText("Hard to handle")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Max" })).toHaveClass("size-14");
    expect(screen.getByRole("img", { name: "Max" })).toHaveAttribute(
      "src",
      expect.stringContaining("/media/max.jpg")
    );
    expect(
      screen.getByText(/Aug 9, 10:30 AM · Full Groom/)
    ).toBeInTheDocument();
    expect(screen.getByText("Checked In")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit/i })
    ).not.toBeInTheDocument();
  });

  it("uses the green normal styling for a normal pet", () => {
    render(
      <PhotoHealthOverview
        booking={{
          ...booking,
          pet_snapshot: { ...booking.pet_snapshot, behavior: "normal" },
        }}
        arrival={arrival}
        saving={false}
        startLabel="Start inspection"
        onStart={vi.fn()}
      />
    );

    expect(screen.getByText("Normal")).toHaveClass("border-[#CDEBD8]");
    expect(screen.getByText("Normal")).toHaveClass("bg-[#F3FFF7]");
    expect(screen.getByText("Normal")).toHaveClass("text-[#3D8056]");
  });

  it("opens the shared read-only preview at the clicked photo", () => {
    render(
      <PhotoHealthOverview
        booking={booking}
        arrival={arrival}
        saving={false}
        startLabel="Start inspection"
        onStart={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "before-two.jpg" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete|remove|upload|replace/i })
    ).not.toBeInTheDocument();
  });

  it("does not render the optional note module when the note is empty", () => {
    render(
      <PhotoHealthOverview
        booking={booking}
        arrival={arrival}
        saving={false}
        startLabel="Start inspection"
        onStart={vi.fn()}
      />
    );

    expect(screen.queryByText("Note - Before grooming")).not.toBeInTheDocument();
    expect(screen.queryByText("No note provided")).not.toBeInTheDocument();
  });

  it("uses the same pet avatar fallback chain as the groomer request cards", () => {
    render(
      <PhotoHealthOverview
        booking={{
          ...booking,
          pet_avatar: "",
          pet_snapshot: {
            ...booking.pet_snapshot,
            primary_photo: "/media/max-primary.jpg",
          },
        }}
        arrival={arrival}
        saving={false}
        startLabel="Start inspection"
        onStart={vi.fn()}
      />
    );

    expect(screen.getByRole("img", { name: "Max" })).toHaveAttribute(
      "src",
      expect.stringContaining("/media/max-primary.jpg")
    );
  });
});

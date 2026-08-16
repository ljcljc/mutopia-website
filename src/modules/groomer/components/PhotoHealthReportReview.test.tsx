import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BookingDetailOut, PhotoHealthReportDraftOut } from "@/lib/api";
import { PhotoHealthReportReview } from "./PhotoHealthReportReview";

const normal = { status: "normal", description: "No issue observed." } as const;

const draft: PhotoHealthReportDraftOut = {
  id: 1,
  booking_id: 42,
  pet: { name: "Max" },
  appointment: { service_name: "Full Groom", status: "completed" },
  original_insights: "Max appears comfortable.",
  groomer_insights: "Max appears comfortable.",
  wellness_summary: {
    skin: normal,
    ear: normal,
    mouth: normal,
    eye: normal,
    mobility: normal,
  },
  source_version: 1,
  previewed_source_version: null,
  photos: [],
};

const booking = {
  id: 42,
  status: "completed",
  scheduled_time: "2026-08-09T02:30:00Z",
  pet_snapshot: {
    name: "Max",
    breed: "Yorkie",
    behavior: "friendly",
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

describe("PhotoHealthReportReview", () => {
  it("starts with report content instead of a duplicate page heading", () => {
    render(
      <PhotoHealthReportReview
        draft={draft}
        booking={booking}
        onSaveInsights={vi.fn()}
        onViewPdf={vi.fn()}
        onPublish={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("heading", { name: "Review health report" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Max" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Max" })).toHaveAttribute(
      "src",
      expect.stringContaining("/media/max.jpg")
    );
    expect(screen.getByText("Friendly")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("allows a failed PDF generation to be retried", () => {
    render(
      <PhotoHealthReportReview
        draft={{ ...draft, pdf_generation_status: "failed" }}
        booking={booking}
        onSaveInsights={vi.fn()}
        onViewPdf={vi.fn()}
        onPublish={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(
      screen.getByRole("button", { name: "Retry AI health report" })
    ).toBeEnabled();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { PhotoHealthReportDraftOut } from "@/lib/api";
import { PhotoHealthReportReview } from "./PhotoHealthReportReview";

const normal = { status: "normal", description: "No issue observed." } as const;

const draft: PhotoHealthReportDraftOut = {
  id: 1,
  booking_id: 42,
  pet: { name: "Max" },
  appointment: { service_name: "Full Groom", status: "completed" },
  original_insights: "Max appears comfortable.",
  groomer_insights: "Max appears comfortable.",
  wellness_summary: { skin: normal, ear: normal, mouth: normal, eye: normal, mobility: normal },
  source_version: 1,
  previewed_source_version: null,
  photos: [],
};

describe("PhotoHealthReportReview", () => {
  it("starts with report content instead of a duplicate page heading", () => {
    render(
      <PhotoHealthReportReview
        draft={draft}
        onSaveInsights={vi.fn()}
        onViewPdf={vi.fn()}
        onPublish={vi.fn()}
      />,
    );

    expect(screen.queryByRole("heading", { name: "Review health report" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Max" })).toBeInTheDocument();
  });
});

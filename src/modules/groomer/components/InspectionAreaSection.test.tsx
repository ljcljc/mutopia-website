import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { InspectionPhotoOut } from "@/lib/api";
import { InspectionAreaSection } from "./InspectionAreaSection";

describe("InspectionAreaSection", () => {
  it("opens the inspection review when an uploaded thumbnail is clicked", () => {
    const onOpen = vi.fn();
    const photo: InspectionPhotoOut = {
      id: 7,
      area: "skin",
      url: "/skin.jpg",
      original_filename: "skin.jpg",
      normalized_mime_type: "image/jpeg",
      classification: "ai_scan",
      finding_hints: [],
      confirmed: true,
    };

    render(
      <InspectionAreaSection
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        photos={[photo]}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByAltText("skin.jpg").parentElement as HTMLElement);
    expect(onOpen).toHaveBeenCalledWith(photo);
    expect(screen.getByText("AI Scan")).toBeInTheDocument();
    expect(screen.getByText("Skin photo - Before grooming photos")).toBeInTheDocument();
    expect(screen.getByText("Add photo")).toBeInTheDocument();
    expect(screen.getByAltText("skin.jpg").closest(".flex-wrap")).toBeInTheDocument();
  });
});

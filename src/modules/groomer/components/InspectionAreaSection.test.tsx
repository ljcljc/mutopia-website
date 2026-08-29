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
      />
    );

    fireEvent.click(
      screen.getByAltText("skin.jpg").parentElement as HTMLElement
    );
    expect(onOpen).toHaveBeenCalledWith(photo);
    expect(screen.getByText("AI Scan")).toBeInTheDocument();
    expect(
      screen.getByText("Skin - after grooming photos")
    ).toBeInTheDocument();
    expect(screen.getByText("Skin photo")).toBeInTheDocument();
    expect(screen.getAllByText("Add photo")).toHaveLength(1);
    expect(
      screen.getByText("Add up to 2 photos for AI health inspection")
    ).toBeInTheDocument();
  });

  it("shows the ear side badge for ear uploads", () => {
    const photo: InspectionPhotoOut = {
      id: 8,
      area: "left_ear",
      url: "/left-ear.jpg",
      original_filename: "left-ear.jpg",
      normalized_mime_type: "image/jpeg",
      classification: "normal",
      finding_hints: [],
      confirmed: true,
    };

    render(
      <InspectionAreaSection
        config={{ area: "left_ear", label: "Left ear", hints: [] }}
        photos={[photo]}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    expect(screen.getByAltText("left-ear.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload Right ear")).toBeInTheDocument();
  });

  it("renders mouth as a single inspection upload card", () => {
    render(
      <InspectionAreaSection
        config={{ area: "mouth", label: "Mouth photo", hints: [] }}
        photos={[]}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Upload Mouth area")).toBeInTheDocument();
    expect(screen.getAllByText("Add photo")).toHaveLength(1);
  });

  it("opens the file picker from Add photo after a mouth photo is present", () => {
    const photo: InspectionPhotoOut = {
      id: 9,
      area: "mouth",
      url: "/mouth.jpg",
      original_filename: "mouth.jpg",
      normalized_mime_type: "image/jpeg",
      classification: "normal",
      finding_hints: [],
      confirmed: true,
    };
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

    render(
      <InspectionAreaSection
        config={{ area: "mouth", label: "Mouth photo", hints: [] }}
        photos={[photo]}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Add Mouth photo"));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("renders a second mouth photo in the Add photo card", () => {
    const photos: InspectionPhotoOut[] = [
      {
        id: 10,
        area: "mouth",
        url: "/mouth-1.jpg",
        original_filename: "mouth-1.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "normal",
        finding_hints: [],
        confirmed: true,
      },
      {
        id: 11,
        area: "mouth",
        url: "/mouth-2.jpg",
        original_filename: "mouth-2.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "ai_scan",
        finding_hints: [],
        confirmed: true,
      },
    ];

    render(
      <InspectionAreaSection
        config={{ area: "mouth", label: "Mouth photo", hints: [] }}
        photos={photos}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    expect(screen.getByAltText("mouth-1.jpg")).toBeInTheDocument();
    expect(screen.getByAltText("mouth-2.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Mouth photo")).toBeInTheDocument();
  });

  it("shows the AI Scan tag only for mouth photos selected for analysis", () => {
    const photos: InspectionPhotoOut[] = [
      {
        id: 12,
        area: "mouth",
        url: "/mouth-ai.jpg",
        original_filename: "mouth-ai.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "ai_scan",
        finding_hints: [],
        confirmed: true,
      },
      {
        id: 13,
        area: "mouth",
        url: "/mouth-normal.jpg",
        original_filename: "mouth-normal.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "normal",
        finding_hints: [],
        confirmed: true,
      },
      {
        id: 14,
        area: "mouth",
        url: "/mouth-normal-2.jpg",
        original_filename: "mouth-normal-2.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "normal",
        finding_hints: [],
        confirmed: true,
      },
    ];

    render(
      <InspectionAreaSection
        config={{ area: "mouth", label: "Mouth photo", hints: [] }}
        photos={photos}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    expect(screen.getAllByText("AI Scan")).toHaveLength(1);
  });

  it("renders Posture as a cumulative storage-only upload card", () => {
    const photos: InspectionPhotoOut[] = [
      {
        id: 15,
        area: "posture",
        url: "/posture-1.jpg",
        original_filename: "posture-1.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "ai_scan",
        finding_hints: [],
        confirmed: true,
      },
      {
        id: 16,
        area: "posture",
        url: "/posture-2.jpg",
        original_filename: "posture-2.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "normal",
        finding_hints: [],
        confirmed: true,
      },
      {
        id: 17,
        area: "posture",
        url: "/posture-3.jpg",
        original_filename: "posture-3.jpg",
        normalized_mime_type: "image/jpeg",
        classification: "normal",
        finding_hints: [],
        confirmed: true,
      },
    ];

    render(
      <InspectionAreaSection
        config={{ area: "posture", label: "Posture photo", hints: [] }}
        photos={photos}
        onFilesSelected={vi.fn()}
        onRemove={vi.fn()}
        onOpen={vi.fn()}
      />
    );

    expect(
      screen.getByText("Posture - after grooming photos")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Help to complete health report")
    ).toBeInTheDocument();
    expect(screen.getByAltText("posture-3.jpg")).toBeInTheDocument();
    expect(screen.getByLabelText("Add Posture photo")).toBeInTheDocument();
    expect(screen.queryByText("AI Scan")).not.toBeInTheDocument();
  });
});

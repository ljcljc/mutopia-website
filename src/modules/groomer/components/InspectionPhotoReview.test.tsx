import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InspectionPhotoReview } from "./InspectionPhotoReview";
import type { InspectionPhotoOut } from "@/lib/api";
import { toast } from "sonner";

vi.mock("sonner", () => ({ toast: vi.fn() }));

const photo = (
  overrides: Partial<InspectionPhotoOut> = {}
): InspectionPhotoOut => ({
  id: 1,
  area: "skin",
  url: "/skin.jpg",
  original_filename: "skin.jpg",
  normalized_mime_type: "image/jpeg",
  classification: "normal",
  finding_hints: [],
  confirmed: false,
  ...overrides,
});

describe("InspectionPhotoReview", () => {
  it("updates AI classification immediately with optional finding hints", async () => {
    const onChange = vi.fn();
    render(
      <InspectionPhotoReview
        photos={[photo()]}
        activePhotoId={1}
        config={{
          area: "skin",
          label: "Skin photo",
          hints: [{ value: "redness", label: "Redness" }],
        }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={onChange}
        onAddPhoto={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Skin photo review" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /AI Scan/ })[0]);
    expect(
      screen.getAllByRole("button", { name: /Normal/ })[0]
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getAllByRole("button", { name: /AI Scan/ })[0]
    ).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getAllByRole("button", { name: "Redness" })[0]);

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(1, "ai_scan", ["redness"])
    );
  });

  it("uses the approved posture preview actions", async () => {
    const onClose = vi.fn();
    const onProceedToNotes = vi.fn();
    const onChange = vi.fn();
    render(
      <InspectionPhotoReview
        photos={[photo({ area: "posture" })]}
        activePhotoId={1}
        config={{ area: "posture", label: "Posture photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={onClose}
        onChange={onChange}
        onAddPhoto={vi.fn()}
        observationTags={[]}
        onObservationTagsChange={vi.fn()}
        onProceedToNotes={onProceedToNotes}
      />
    );

    expect(
      screen.getAllByRole("heading", {
        name: "Almost done! How was Current pet today?",
      })
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Tap unusual behaviours to help generate AI report.")
    ).toHaveLength(2);
    expect(
      screen.getAllByRole("button", { name: "Paw licking" })[0]
    ).toHaveClass("text-[13px]");

    fireEvent.click(
      screen.getAllByRole("button", { name: "Next - Add notes" })[0]
    );

    await waitFor(() => expect(onProceedToNotes).toHaveBeenCalled());
    expect(onChange).toHaveBeenCalledWith(1, "normal", []);
  });

  it("uses the summary label when posture observations are selected", () => {
    render(
      <InspectionPhotoReview
        photos={[photo({ area: "posture", confirmed: true })]}
        activePhotoId={1}
        config={{ area: "posture", label: "Posture photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
        observationTags={["paw_licking"]}
        onObservationTagsChange={vi.fn()}
        onProceedToNotes={vi.fn()}
      />
    );

    expect(
      screen.getAllByRole("button", { name: "Next - Summary & notes" })
    ).toHaveLength(2);
  });

  it("cycles through photos in the current area", () => {
    const onActivePhotoChange = vi.fn();
    render(
      <InspectionPhotoReview
        photos={[photo(), photo({ id: 2, url: "/skin-2.jpg" })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={onActivePhotoChange}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(onActivePhotoChange).toHaveBeenCalledWith(2);
  });

  it("switches to a photo when its pagination dot is clicked", () => {
    const onActivePhotoChange = vi.fn();
    render(
      <InspectionPhotoReview
        photos={[photo(), photo({ id: 2, url: "/skin-2.jpg" })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={onActivePhotoChange}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );

    const secondDot = screen.getByRole("button", { name: "Go to photo 2" });
    fireEvent.pointerDown(secondDot, { clientX: 120, clientY: 120 });
    fireEvent.pointerUp(secondDot, { clientX: 120, clientY: 120 });
    fireEvent.click(secondDot);
    expect(onActivePhotoChange).toHaveBeenCalledWith(2);
  });

  it("shows the preview area tag only for left and right ear or eye photos", () => {
    const baseProps = {
      activePhotoId: 1,
      open: true,
      onActivePhotoChange: vi.fn(),
      onClose: vi.fn(),
      onChange: vi.fn(),
      onAddPhoto: vi.fn(),
    };
    const { rerender } = render(
      <InspectionPhotoReview
        {...baseProps}
        photos={[photo()]}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
      />
    );

    expect(screen.queryByText("1. Skin")).not.toBeInTheDocument();

    rerender(
      <InspectionPhotoReview
        {...baseProps}
        photos={[photo({ area: "left_ear" })]}
        config={{ area: "left_ear", label: "Left ear", hints: [] }}
      />
    );

    expect(screen.getByText("1. Left ear")).toBeInTheDocument();
  });

  it("prevents text selection from the mobile panel drag handle", () => {
    render(
      <InspectionPhotoReview
        photos={[photo({ confirmed: true })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );
    expect(screen.getAllByText("Any skin issue?")[1].parentElement).toHaveClass(
      "select-none"
    );
  });

  it("keeps the image viewport height tied to the dragged panel height", () => {
    render(
      <InspectionPhotoReview
        photos={[photo({ confirmed: true })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );

    const panelTitle = screen.getAllByText("Any skin issue?")[1];
    const panelHandle = panelTitle.parentElement as HTMLDivElement;
    const viewport = document.querySelector('[style*="--review-panel-height"]');
    expect(viewport).toHaveClass("h-[calc(100dvh-var(--review-panel-height))]");

    panelHandle.setPointerCapture = vi.fn();
    vi.spyOn(
      panelHandle.parentElement!,
      "getBoundingClientRect"
    ).mockReturnValue({ height: 300 } as DOMRect);
    fireEvent.pointerDown(panelHandle, { clientY: 500, pointerId: 1 });
    fireEvent.pointerMove(panelHandle, { clientY: 400, pointerId: 1 });

    expect(viewport).toHaveStyle({ "--review-panel-height": "400px" });
    expect(panelHandle.parentElement).toHaveClass("transition-none");
  });

  it("transitions the image viewport with the panel after snap", () => {
    render(
      <InspectionPhotoReview
        photos={[photo({ confirmed: true })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );

    const panelTitle = screen.getAllByText("Any skin issue?")[1];
    const panelHandle = panelTitle.parentElement as HTMLDivElement;
    const panel = panelHandle.parentElement as HTMLElement;
    const viewport = document.querySelector('[style*="--review-panel-height"]');
    panelHandle.setPointerCapture = vi.fn();
    vi.spyOn(panel, "getBoundingClientRect").mockReturnValue({
      height: 300,
    } as DOMRect);

    fireEvent.pointerDown(panelHandle, { clientY: 500, pointerId: 1 });
    fireEvent.pointerUp(panelHandle, { clientY: 400, pointerId: 1 });

    expect(viewport).toHaveClass("transition-[height]");
    expect(viewport).toHaveClass("duration-200");
    expect(panel).toHaveClass("transition-[height]");
    expect(panel).toHaveClass("duration-200");
  });

  it("anchors the close action to the right on mobile", () => {
    render(
      <InspectionPhotoReview
        photos={[photo({ confirmed: true })]}
        activePhotoId={1}
        config={{ area: "skin", label: "Skin photo", hints: [] }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={vi.fn()}
        onAddPhoto={vi.fn()}
      />
    );
    expect(
      screen.getByRole("button", { name: "Close photo review" })
    ).toHaveClass("absolute");
    expect(
      screen.getByRole("button", { name: "Close photo review" })
    ).toHaveClass("rounded-full");
  });

  it("keeps a third photo unchanged and shows a toast when the AI limit is reached", () => {
    const onChange = vi.fn();
    render(
      <InspectionPhotoReview
        photos={[
          photo({ id: 1, classification: "ai_scan", confirmed: true }),
          photo({ id: 2, classification: "ai_scan", confirmed: true }),
          photo({ id: 3, classification: "normal", confirmed: true }),
        ]}
        activePhotoId={3}
        config={{
          area: "skin",
          label: "Skin photo",
          hints: [{ value: "redness", label: "Redness" }],
        }}
        open
        onActivePhotoChange={vi.fn()}
        onClose={vi.fn()}
        onChange={onChange}
        onAddPhoto={vi.fn()}
      />
    );

    fireEvent.click(screen.getAllByRole("button", { name: /AI Scan/ })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "Redness" })[0]);

    expect(toast).toHaveBeenCalledWith(
      "You can select up to 2 photos for AI Scan."
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});

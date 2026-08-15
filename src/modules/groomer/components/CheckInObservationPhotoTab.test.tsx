import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CheckInObservationPhotoTab } from "./CheckInObservationPhotoTab";

describe("CheckInObservationPhotoTab", () => {
  it("accepts a batch of supported photos and edits the optional arrival note", () => {
    const onFilesSelected = vi.fn();
    const onNoteChange = vi.fn();

    render(
      <CheckInObservationPhotoTab
        items={[]}
        note=""
        onFilesSelected={onFilesSelected}
        onNoteChange={onNoteChange}
        onRemove={vi.fn()}
      />,
    );

    const input = screen.getByLabelText("Upload before service photos") as HTMLInputElement;
    expect(input.multiple).toBe(true);
    expect(input.accept).toContain("image/heic");

    const files = [
      new File(["one"], "one.jpg", { type: "image/jpeg" }),
      new File(["two"], "two.heic", { type: "image/heic" }),
    ];
    fireEvent.change(input, { target: { files } });
    expect(onFilesSelected).toHaveBeenCalledWith(files);

    fireEvent.change(screen.getByPlaceholderText("Describe your pet's condition on arrival"), {
      target: { value: "Calm on arrival" },
    });
    expect(onNoteChange).toHaveBeenCalledWith("Calm on arrival");
  });

  it("does not automatically preview a newly successful upload", () => {
    const props = {
      note: "",
      onFilesSelected: vi.fn(),
      onNoteChange: vi.fn(),
      onRemove: vi.fn(),
    };
    const { rerender } = render(<CheckInObservationPhotoTab {...props} items={[]} />);
    const file = new File(["one"], "arrival.jpg", { type: "image/jpeg" });

    rerender(
      <CheckInObservationPhotoTab
        {...props}
        items={[{
          file,
          previewUrl: "/media/arrival.jpg",
          photoId: 9,
          uploadStatus: "uploaded",
          uploadProgress: 100,
        }]}
      />,
    );

    expect(screen.getByRole("img", { name: "arrival.jpg" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Image Preview: arrival.jpg" })).not.toBeInTheDocument();
  });
});

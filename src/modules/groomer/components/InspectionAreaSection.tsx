import { FileUpload, type FileUploadItem } from "@/components/common";
import type { InspectionPhotoOut } from "@/lib/api";
import type { InspectionAreaConfig } from "@/modules/groomer/photoHealthConfig";

export function InspectionAreaSection({
  config,
  photos,
  disabled,
  error,
  onFilesSelected,
  onRemove,
  onOpen,
}: {
  config: InspectionAreaConfig;
  photos: InspectionPhotoOut[];
  disabled?: boolean;
  error?: string;
  onFilesSelected: (files: File[]) => void;
  onRemove: (photo: InspectionPhotoOut) => void;
  onOpen: (photo: InspectionPhotoOut) => void;
}) {
  const items: FileUploadItem[] = photos.map((photo) => ({
    file: new File([], photo.original_filename || `${photo.area}.jpg`, { type: photo.normalized_mime_type || "image/jpeg" }),
    previewUrl: photo.url,
    serverUrl: photo.url,
    photoId: photo.id,
    uploadStatus: "uploaded",
    uploadProgress: 100,
    badge: photo.classification === "ai_scan" ? "AI Scan" : undefined,
  }));

  const areaName = config.label.replace(/ photo$/i, "");

  return (
    <section className="rounded-xl bg-white p-3.5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center">
          <h2 className="font-comfortaa text-base font-semibold leading-[28px] text-[#4A3C2A]">{areaName} - after grooming photos</h2>
          <span className="font-comfortaa text-xs leading-4 text-[#4A3C2A]">Add up to 2 photos for AI health inspection</span>
        </div>
        <div className="flex flex-col">
          <p className="font-comfortaa text-sm leading-[22.75px] text-[#4A3C2A]">{config.label}</p>
          <div className="mt-2">
            <FileUpload
              layout="inspection"
              inputAriaLabel={`Upload ${config.label}`}
              accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
              multiple={config.area !== "posture"}
              maxFiles={config.area === "posture" ? 2 : undefined}
              maxSizeMB={10}
              disabled={disabled}
              uploadItems={items}
              onFilesAdded={onFilesSelected}
              onRemove={(index) => onRemove(photos[index])}
              onPreviewItem={(index) => {
                const photo = photos[index];
                if (photo) onOpen(photo);
              }}
              fileTypeHint="JPG, JPEG, PNG, HEIC, or HEIF — up to 10MB each"
            />
          </div>
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

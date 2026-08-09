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
    <section className="rounded-2xl bg-white p-5 shadow-lg">
      <h2 className="font-comfortaa text-xl text-[#4A3C2A]">{areaName} - After grooming photos</h2>
      <p className="font-comfortaa text-sm text-[#6B625B]">Add photos for AI health inspection</p>
      <h3 className="mb-2 mt-5 font-comfortaa text-base text-[#4A3C2A]">{config.label}</h3>
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
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </section>
  );
}

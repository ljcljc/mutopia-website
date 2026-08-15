import { useRef } from "react";
import { FileUpload, Icon, type FileUploadItem } from "@/components/common";
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
  const earInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const openFilePicker = (input: HTMLInputElement | null) => {
    if (!input || input.disabled) return;
    input.click();
  };
  const items: FileUploadItem[] = photos.map((photo) => ({
    file: new File([], photo.original_filename || `${photo.area}.jpg`, { type: photo.normalized_mime_type || "image/jpeg" }),
    previewUrl: photo.url,
    serverUrl: photo.url,
    photoId: photo.id,
    uploadStatus: "uploaded",
    uploadProgress: 100,
    badge: photo.classification === "ai_scan"
      ? "AI Scan"
      : photo.area === "left_ear"
        ? "Left ear"
        : photo.area === "right_ear"
          ? "Right ear"
          : undefined,
  }));

  const areaName = config.label.replace(/ photo$/i, "");
  const isEarSection = config.area === "left_ear" || config.area === "right_ear";
  const isMouthSection = config.area === "mouth";
  const slots = isEarSection ? ["left_ear", "right_ear"] as const : [];

  // The second mouth slot remains available after the first photo replaces its card.
  const renderMouthInput = () => (
    <input
      ref={(element) => {
        earInputRefs.current.mouth = element;
      }}
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
      multiple={false}
      className="hidden"
      onChange={(event) => {
        const selected = Array.from(event.currentTarget.files ?? []);
        if (selected.length > 0) {
          onFilesSelected(selected);
        }
        event.currentTarget.value = "";
      }}
    />
  );

  const renderEarSlot = (slotArea: "left_ear" | "right_ear") => {
    const areaPhoto = photos.find((photo) => photo.area === slotArea) ?? null;
    const label = slotArea === "left_ear" ? "Left ear" : "Right ear";
    return (
      <div key={slotArea} className="relative h-[84px] min-w-0 flex-1 overflow-visible rounded-[14px] border border-[#D4C9E0]">
        {areaPhoto ? (
          <>
            <button
              type="button"
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[14px]"
              onClick={() => onOpen(areaPhoto)}
            >
              <img
                src={areaPhoto.url}
                alt={areaPhoto.original_filename}
                className="absolute inset-0 size-full max-w-none pointer-events-none rounded-[14px] object-cover object-top"
              />
            </button>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              className="absolute right-[-4px] top-[-4px] z-20 flex size-[20px] cursor-pointer items-center justify-center rounded-[8px] border border-[#4c4c4c] bg-neutral-100 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
              onClick={() => void onRemove(areaPhoto)}
            >
              <span className="relative flex size-[10px] items-center justify-center">
                <span className="absolute h-[1.5px] w-full rotate-45 bg-[#4c4c4c]" />
                <span className="absolute h-[1.5px] w-full rotate-[-45deg] bg-[#4c4c4c]" />
              </span>
            </button>
            <div className="pointer-events-none absolute bottom-[-8px] left-[12px] z-30 flex items-center gap-1 rounded-full border border-[#F1C9CC] bg-[#FFF6F6] px-3 py-1 font-comfortaa text-xs text-[#B23A48] shadow-sm">
              <Icon name="alert-ai-scan" className="size-[13px]" />
              {label}
            </div>
          </>
        ) : (
          <button
            type="button"
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)]"
            onClick={() => openFilePicker(earInputRefs.current[slotArea])}
            aria-label={`Upload ${label}`}
          >
            <div className="flex h-[29px] w-[28px] items-center justify-center rounded-full bg-[#F0EBF7]">
              <Icon name="add-inspection" className="block size-[28px]" />
            </div>
            <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">{label}</span>
            <input
              ref={(element) => {
                earInputRefs.current[slotArea] = element;
              }}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
              multiple={false}
              className="hidden"
              onChange={(event) => {
                const selected = Array.from(event.currentTarget.files ?? []);
                if (selected.length > 0) {
                  onFilesSelected(selected);
                }
                event.currentTarget.value = "";
              }}
            />
          </button>
        )}
      </div>
    );
  };

  const renderMouthSlot = (mouthPhoto: InspectionPhotoOut | null, index: number) => {
    const label = "Mouth area";
    return (
      <div className="relative h-[84px] min-w-0 flex-1 overflow-visible rounded-[14px]">
        {mouthPhoto ? (
          <>
            <button
              type="button"
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[14px]"
              onClick={() => onOpen(mouthPhoto)}
            >
              <img
                src={mouthPhoto.url}
                alt={mouthPhoto.original_filename}
                className="absolute inset-0 size-full max-w-none pointer-events-none rounded-[14px] object-cover object-center"
              />
            </button>
            <button
              type="button"
              aria-label={`Remove Mouth photo ${index + 1}`}
              className="absolute right-[-4px] top-[-4px] z-20 flex size-[20px] cursor-pointer items-center justify-center rounded-[8px] border border-[#4c4c4c] bg-neutral-100 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
              onClick={() => void onRemove(mouthPhoto)}
            >
              <span className="relative flex size-[10px] items-center justify-center">
                <span className="absolute h-[1.5px] w-full rotate-45 bg-[#4c4c4c]" />
                <span className="absolute h-[1.5px] w-full rotate-[-45deg] bg-[#4c4c4c]" />
              </span>
            </button>
            {mouthPhoto.classification === "ai_scan" ? (
              <div className="pointer-events-none absolute bottom-[-8px] left-[12px] z-30 flex items-center gap-1 rounded-full border border-[#F1C9CC] bg-[#FFF6F6] px-3 py-1 font-comfortaa text-xs text-[#B23A48] shadow-sm">
                <Icon name="alert-ai-scan" className="size-[13px]" />
                AI Scan
              </div>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)]"
            onClick={() => openFilePicker(earInputRefs.current.mouth)}
            aria-label="Upload Mouth area"
          >
            <div className="flex h-[29px] w-[28px] items-center justify-center rounded-full bg-[#F0EBF7]">
              <Icon name="add-inspection" className="block size-[28px]" />
            </div>
            <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">{label}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="rounded-xl bg-white p-3.5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center">
          <h2 className="font-comfortaa text-base font-semibold leading-[28px] text-[#4A3C2A]">{areaName} - after grooming photos</h2>
          <span className="font-comfortaa text-xs leading-4 text-[#4A3C2A]">Add photos for AI health inspection</span>
        </div>
        <div className="flex flex-col">
          <p className="font-comfortaa text-sm leading-[22.75px] text-[#4A3C2A]">{config.label}</p>
          <div className="mt-2">
            {isEarSection ? (
              <div className="relative flex w-full flex-col items-center justify-center rounded-[16px] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                <div className="flex h-[84px] w-full gap-1 overflow-visible">
                  {slots.map((slotArea) => renderEarSlot(slotArea))}
                </div>
              </div>
            ) : isMouthSection ? (
              <div className="relative flex w-full flex-col items-center justify-center rounded-[16px] border border-[#633479] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                <div className="grid w-full grid-cols-2 gap-x-1 gap-y-4 overflow-visible">
                  {renderMouthSlot(photos[0] ?? null, 0)}
                  {photos.slice(1).map((photo, index) => renderMouthSlot(photo, index + 1))}
                  <button
                    type="button"
                    className="relative flex h-[84px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#de6a07]"
                    onClick={() => openFilePicker(earInputRefs.current.mouth)}
                    aria-label="Add Mouth photo"
                  >
                    <div className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-[#F0EBF7]">
                      <Icon name="add-inspection" className="block size-[28px]" />
                    </div>
                    <span className="text-center font-comfortaa text-xs font-medium leading-[18px] text-[#633479]">Add photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <FileUpload
                layout="inspection"
                inputAriaLabel={`Upload ${config.label}`}
                accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                multiple={config.area !== "posture"}
                maxFiles={config.area === "posture" ? 2 : config.area === "mouth" ? 1 : undefined}
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
            )}
          </div>
        </div>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {isMouthSection ? renderMouthInput() : null}
    </section>
  );
}

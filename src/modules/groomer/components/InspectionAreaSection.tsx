import { useRef } from "react";
import { FileUpload, Icon, type FileUploadItem } from "@/components/common";
import type { InspectionPhotoOut } from "@/lib/api";
import type { InspectionAreaConfig } from "@/modules/groomer/photoHealthConfig";

export type InspectionPhotoUploadState = {
  status: "uploading" | "error";
  progress: number;
};

export function InspectionAreaSection({
  config,
  photos,
  disabled,
  error,
  onFilesSelected,
  onRemove,
  onOpen,
  uploadStates = {},
}: {
  config: InspectionAreaConfig;
  photos: InspectionPhotoOut[];
  disabled?: boolean;
  error?: string;
  onFilesSelected: (files: File[]) => void;
  onRemove: (photo: InspectionPhotoOut) => void;
  onOpen: (photo: InspectionPhotoOut) => void;
  uploadStates?: Record<number, InspectionPhotoUploadState>;
}) {
  const earInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const openFilePicker = (input: HTMLInputElement | null) => {
    if (!input || input.disabled) return;
    input.click();
  };
  const items: FileUploadItem[] = photos.map((photo) => ({
    file: new File([], photo.original_filename || `${photo.area}.jpg`, {
      type: photo.normalized_mime_type || "image/jpeg",
    }),
    previewUrl: photo.url,
    serverUrl: photo.url,
    photoId: photo.id,
    uploadStatus: uploadStates[photo.id]?.status ?? "uploaded",
    uploadProgress: uploadStates[photo.id]?.progress ?? 100,
    errorType: uploadStates[photo.id]?.status === "error" ? "upload" : null,
    badge:
      photo.classification === "ai_scan"
        ? "AI Scan"
        : photo.area === "left_ear"
          ? "Left ear"
          : photo.area === "right_ear"
            ? "Right ear"
            : undefined,
  }));

  const areaName = config.label.replace(/ photo$/i, "");
  const isEarSection =
    config.area === "left_ear" || config.area === "right_ear";
  const isMouthSection = config.area === "mouth";
  const isPostureSection = config.area === "posture";
  const isPersistentPhotoSection =
    config.area === "skin" || isMouthSection || isPostureSection;
  const slots = isEarSection ? (["left_ear", "right_ear"] as const) : [];
  const persistentSlotLabel = isPostureSection
    ? "Posture"
    : config.area === "skin"
      ? "Skin area"
      : "Mouth area";
  const sectionDescription = isPostureSection
    ? "Help to complete health report"
    : "Add photos for AI health inspection";

  const renderUploadState = (photo: InspectionPhotoOut) => {
    const uploadState = uploadStates[photo.id];
    if (!uploadState) return null;
    if (uploadState.status === "error") {
      return (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[14px] bg-[rgba(190,18,60,0.22)]">
          <span className="rounded-full bg-white/90 px-2 py-1 font-comfortaa text-[10px] font-bold text-[#BE123C]">
            Upload failed
          </span>
        </div>
      );
    }
    return (
      <>
        <div className="pointer-events-none absolute inset-0 z-10 rounded-[14px] bg-[rgba(0,0,0,0.2)] backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <p className="font-comfortaa text-[11px] font-medium leading-4 text-center text-white">
            Uploading
          </p>
          <div className="relative h-1 w-20 overflow-clip rounded-2xl border border-neutral-200 bg-white">
            <div
              className="absolute left-0 top-0 h-1 rounded-2xl bg-green-500 transition-all duration-300"
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
        </div>
      </>
    );
  };

  // The Add photo slot remains available after the first named photo slot is filled.
  const renderPersistentPhotoInput = () => (
    <input
      ref={(element) => {
        earInputRefs.current[config.area] = element;
      }}
      type="file"
      accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
      multiple={config.area === "skin" || isPostureSection}
      className="hidden"
      onChange={(event) => {
        const selected = Array.from(event.currentTarget.files ?? []);
        if (selected.length > 0) {
          onFilesSelected(
            config.area === "skin"
              ? selected
              : selected.slice(0, Math.max(0, 2 - photos.length))
          );
        }
        event.currentTarget.value = "";
      }}
    />
  );

  const renderEarSlot = (slotArea: "left_ear" | "right_ear") => {
    const areaPhoto = photos.find((photo) => photo.area === slotArea) ?? null;
    const label = slotArea === "left_ear" ? "Left ear" : "Right ear";
    return (
      <div
        key={slotArea}
        className="relative h-[84px] min-w-0 flex-1 overflow-visible rounded-[14px] border border-[#D4C9E0]"
      >
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
            {renderUploadState(areaPhoto)}
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
            <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">
              {label}
            </span>
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

  const renderPersistentPhotoSlot = (
    photo: InspectionPhotoOut | null,
    index: number
  ) => {
    const label = persistentSlotLabel;
    return (
      <div
        key={`${config.area}-${photo?.id ?? "empty"}-${index}`}
        className="relative h-[84px] min-w-0 flex-1 overflow-visible rounded-[14px]"
      >
        {photo ? (
          <>
            <button
              type="button"
              className="absolute inset-0 cursor-pointer overflow-hidden rounded-[14px]"
              onClick={() => onOpen(photo)}
            >
              <img
                src={photo.url}
                alt={photo.original_filename}
                className="absolute inset-0 size-full max-w-none pointer-events-none rounded-[14px] object-cover object-center"
              />
            </button>
            {renderUploadState(photo)}
            <button
              type="button"
              aria-label={`Remove ${config.label} ${index + 1}`}
              className="absolute right-[-4px] top-[-4px] z-20 flex size-[20px] cursor-pointer items-center justify-center rounded-[8px] border border-[#4c4c4c] bg-neutral-100 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
              onClick={() => void onRemove(photo)}
            >
              <span className="relative flex size-[10px] items-center justify-center">
                <span className="absolute h-[1.5px] w-full rotate-45 bg-[#4c4c4c]" />
                <span className="absolute h-[1.5px] w-full rotate-[-45deg] bg-[#4c4c4c]" />
              </span>
            </button>
            {!isPostureSection && photo.classification === "ai_scan" ? (
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
            onClick={() => openFilePicker(earInputRefs.current[config.area])}
            aria-label={`Upload ${label}`}
          >
            <div className="flex h-[29px] w-[28px] items-center justify-center rounded-full bg-[#F0EBF7]">
              <Icon name="add-inspection" className="block size-[28px]" />
            </div>
            <span className="font-comfortaa text-[12px] font-medium leading-[18px] text-[#633479]">
              {label}
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="rounded-xl bg-white p-3.5 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center">
          <h2 className="font-comfortaa text-base font-semibold leading-[28px] text-[#4A3C2A]">
            {areaName} - after grooming photos
          </h2>
          <span className="font-comfortaa text-xs leading-4 text-[#4A3C2A]">
            {sectionDescription}
          </span>
        </div>
        <div className="flex flex-col">
          <p className="font-comfortaa text-sm leading-[22.75px] text-[#4A3C2A]">
            {config.label}
          </p>
          <div className="mt-2">
            {isEarSection ? (
              <div className="relative flex w-full flex-col items-center justify-center rounded-[16px] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                <div className="flex h-[84px] w-full gap-1 overflow-visible">
                  {slots.map((slotArea) => renderEarSlot(slotArea))}
                </div>
              </div>
            ) : isPersistentPhotoSection ? (
              <div className="relative flex w-full flex-col items-center justify-center rounded-[16px] border border-[#633479] bg-[#FAFAFA] p-4 shadow-[0px_4px_5px_0px_rgba(0,0,0,0.15)]">
                <div className="grid w-full grid-cols-2 gap-x-1 gap-y-4 overflow-visible">
                  {renderPersistentPhotoSlot(photos[0] ?? null, 0)}
                  {photos
                    .slice(1)
                    .map((photo, index) =>
                      renderPersistentPhotoSlot(photo, index + 1)
                    )}
                  <button
                    type="button"
                    className="relative flex h-[84px] min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border-[1.451px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_2.5px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#de6a07]"
                    onClick={() =>
                      openFilePicker(earInputRefs.current[config.area])
                    }
                    aria-label={`Add ${config.label}`}
                  >
                    <div className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-[#F0EBF7]">
                      <Icon
                        name="add-inspection"
                        className="block size-[28px]"
                      />
                    </div>
                    <span className="text-center font-comfortaa text-xs font-medium leading-[18px] text-[#633479]">
                      Add photo
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <FileUpload
                layout="inspection"
                inputAriaLabel={`Upload ${config.label}`}
                accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
                multiple={config.area !== "posture"}
                maxFiles={
                  config.area === "posture"
                    ? 2
                    : config.area === "mouth"
                      ? 1
                      : undefined
                }
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
      {isPersistentPhotoSection ? renderPersistentPhotoInput() : null}
    </section>
  );
}

import { CustomTextarea, FileUpload, type FileUploadItem } from "@/components/common";

export interface CheckInObservationPhotoTabProps {
  items: FileUploadItem[];
  note: string;
  disabled?: boolean;
  error?: string;
  onFilesSelected: (files: File[]) => void;
  onRemove: (index: number) => void;
  onNoteChange: (value: string) => void;
}

export function CheckInObservationPhotoTab({
  items,
  note,
  disabled = false,
  error = "",
  onFilesSelected,
  onRemove,
  onNoteChange,
}: CheckInObservationPhotoTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <p className="font-comfortaa text-[14px] font-bold leading-5 text-[#DE6A07]">
          Upload before service photos
        </p>
        <FileUpload
          inputAriaLabel="Upload before service photos"
          accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
          disabled={disabled}
          autoPreviewOnUpload
          maxSizeMB={10}
          multiple
          uploadItems={items}
          onChange={onFilesSelected}
          onRemove={onRemove}
          fileTypeHint="JPG, JPEG, PNG, HEIC, or HEIF — up to 10MB each"
          className="[&_p]:whitespace-normal"
        />
        {error ? <p className="font-comfortaa text-[12px] leading-[18px] text-[#DE1507]">{error}</p> : null}
      </div>

      <CustomTextarea
        label="Arrival observation note (optional)"
        placeholder="Describe your pet's condition on arrival"
        value={note}
        disabled={disabled}
        onChange={(event) => onNoteChange(event.target.value)}
        showResizeHandle={false}
      />
    </div>
  );
}

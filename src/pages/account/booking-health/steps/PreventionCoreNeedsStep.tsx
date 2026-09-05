import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "@/components/common/Calendar";
import { CustomTextarea } from "@/components/common/CustomTextarea";
import { FileUpload, type FileUploadItem } from "@/components/common/FileUpload";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { buildImageUrl, uploadReferencePhoto } from "@/lib/api";
import { PREVENTION_OPTIONS } from "../questionnaire";
import type { BookingHealthStepProps } from "../types";
import {
  AddMoreButton,
  FieldTitle,
  InlineStepperRow,
  OptionGrid,
  QuestionGroup,
  QuestionStepShell,
  UnderlinedFieldRow,
} from "../components/QuestionnairePrimitives";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseDateValue(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setSingleArray(list: string[], value: string): string[] {
  return list.includes(value) ? [] : [value];
}

function isSameFile(left: File, right: File): boolean {
  return left.name === right.name && left.size === right.size && left.lastModified === right.lastModified;
}

function createPlaceholderUploadItem(url: string, photoId: number, prefix: string): FileUploadItem {
  return {
    file: new File([], `${prefix}-${photoId}.jpg`, { type: "image/jpeg" }),
    previewUrl: buildImageUrl(url),
    uploadStatus: "uploaded",
    uploadProgress: 100,
    photoId,
    serverUrl: url,
  };
}

export function PreventionCoreNeedsStep({
  value,
  onChange,
  petName,
}: BookingHealthStepProps & { petName: string }) {
  const prevention = value.prevention;
  const showMicrochipNumber = prevention.spayedNeutered === true;
  const today = formatDateValue(new Date());
  const [vaccinationUploadItems, setVaccinationUploadItems] = useState<FileUploadItem[]>([]);
  const [recentTreatmentUploadItems, setRecentTreatmentUploadItems] = useState<FileUploadItem[]>([]);
  const vaccinationInputFilesRef = useRef<File[]>([]);
  const recentTreatmentInputFilesRef = useRef<File[]>([]);

  useEffect(() => {
    setVaccinationUploadItems((current) => {
      const uploadedItems = prevention.vaccinationPhotoIds.map((photoId, index) => {
        const url = prevention.vaccinationPhotoUrls[index];
        return url ? createPlaceholderUploadItem(url, photoId, "vaccination") : null;
      }).filter((item): item is FileUploadItem => item !== null);
      const pendingItems = current.filter((item) => item.uploadStatus !== "uploaded" || item.photoId === undefined);
      return [...uploadedItems, ...pendingItems];
    });
  }, [prevention.vaccinationPhotoIds, prevention.vaccinationPhotoUrls]);

  useEffect(() => {
    setRecentTreatmentUploadItems((current) => {
      const uploadedItems = prevention.recentTreatmentPhotoIds.map((photoId, index) => {
        const url = prevention.recentTreatmentPhotoUrls[index];
        return url ? createPlaceholderUploadItem(url, photoId, "treatment") : null;
      }).filter((item): item is FileUploadItem => item !== null);
      const pendingItems = current.filter((item) => item.uploadStatus !== "uploaded" || item.photoId === undefined);
      return [...uploadedItems, ...pendingItems];
    });
  }, [prevention.recentTreatmentPhotoIds, prevention.recentTreatmentPhotoUrls]);

  const handleVaccinationUpload = async (file: File) => {
    try {
      const response = await uploadReferencePhoto(file, (progress) => {
        setVaccinationUploadItems((current) =>
          current.map((item) => (item.file === file ? { ...item, uploadProgress: progress } : item))
        );
      });
      const previewUrl = buildImageUrl(response.url);
      setVaccinationUploadItems((current) =>
        current.map((item) =>
          item.file === file
            ? { ...item, uploadStatus: "uploaded", uploadProgress: 100, photoId: response.id, serverUrl: response.url, previewUrl }
            : item
        )
      );
      onChange((current) => ({
        ...current,
        prevention: {
          ...current.prevention,
          vaccinationPhotoIds: current.prevention.vaccinationPhotoIds.includes(response.id)
            ? current.prevention.vaccinationPhotoIds
            : [...current.prevention.vaccinationPhotoIds, response.id],
          vaccinationPhotoUrls: current.prevention.vaccinationPhotoUrls.includes(response.url)
            ? current.prevention.vaccinationPhotoUrls
            : [...current.prevention.vaccinationPhotoUrls, response.url],
        },
      }));
    } catch (error) {
      console.error("Failed to upload vaccination history image:", error);
      setVaccinationUploadItems((current) =>
        current.map((item) => (item.file === file ? { ...item, uploadStatus: "error", errorType: "upload" } : item))
      );
    }
  };

  const handleRecentTreatmentUpload = async (file: File) => {
    try {
      const response = await uploadReferencePhoto(file, (progress) => {
        setRecentTreatmentUploadItems((current) =>
          current.map((item) => (item.file === file ? { ...item, uploadProgress: progress } : item))
        );
      });
      const previewUrl = buildImageUrl(response.url);
      setRecentTreatmentUploadItems((current) =>
        current.map((item) =>
          item.file === file
            ? { ...item, uploadStatus: "uploaded", uploadProgress: 100, photoId: response.id, serverUrl: response.url, previewUrl }
            : item
        )
      );
      onChange((current) => ({
        ...current,
        prevention: {
          ...current.prevention,
          recentTreatmentPhotoIds: current.prevention.recentTreatmentPhotoIds.includes(response.id)
            ? current.prevention.recentTreatmentPhotoIds
            : [...current.prevention.recentTreatmentPhotoIds, response.id],
          recentTreatmentPhotoUrls: current.prevention.recentTreatmentPhotoUrls.includes(response.url)
            ? current.prevention.recentTreatmentPhotoUrls
            : [...current.prevention.recentTreatmentPhotoUrls, response.url],
        },
      }));
    } catch (error) {
      console.error("Failed to upload recent treatment image:", error);
      setRecentTreatmentUploadItems((current) =>
        current.map((item) => (item.file === file ? { ...item, uploadStatus: "error", errorType: "upload" } : item))
      );
    }
  };

  const handleVaccinationFilesChange = (files: File[]) => {
    const newFiles = files.filter((file) => !vaccinationInputFilesRef.current.some((previous) => isSameFile(previous, file)));
    vaccinationInputFilesRef.current = files;
    if (newFiles.length === 0) return;
    const newItems: FileUploadItem[] = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploading",
      uploadProgress: 0,
    }));
    setVaccinationUploadItems((current) => [...current, ...newItems]);
    newFiles.forEach((file) => {
      void handleVaccinationUpload(file);
    });
  };

  const handleRecentTreatmentFilesChange = (files: File[]) => {
    const newFiles = files.filter((file) => !recentTreatmentInputFilesRef.current.some((previous) => isSameFile(previous, file)));
    recentTreatmentInputFilesRef.current = files;
    if (newFiles.length === 0) return;
    const newItems: FileUploadItem[] = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadStatus: "uploading",
      uploadProgress: 0,
    }));
    setRecentTreatmentUploadItems((current) => [...current, ...newItems]);
    newFiles.forEach((file) => {
      void handleRecentTreatmentUpload(file);
    });
  };

  const handleVaccinationRemove = (index: number) => {
    setVaccinationUploadItems((current) => {
      const item = current[index];
      if (item?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const nextItems = current.filter((_, itemIndex) => itemIndex !== index);
      onChange((questionnaire) => ({
        ...questionnaire,
        prevention: {
          ...questionnaire.prevention,
          vaccinationPhotoIds: nextItems.map((nextItem) => nextItem.photoId).filter((id): id is number => id !== undefined),
          vaccinationPhotoUrls: nextItems.map((nextItem) => nextItem.serverUrl).filter((url): url is string => Boolean(url)),
        },
      }));
      return nextItems;
    });
  };

  const handleRecentTreatmentRemove = (index: number) => {
    setRecentTreatmentUploadItems((current) => {
      const item = current[index];
      if (item?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      const nextItems = current.filter((_, itemIndex) => itemIndex !== index);
      onChange((questionnaire) => ({
        ...questionnaire,
        prevention: {
          ...questionnaire.prevention,
          recentTreatmentPhotoIds: nextItems.map((nextItem) => nextItem.photoId).filter((id): id is number => id !== undefined),
          recentTreatmentPhotoUrls: nextItems.map((nextItem) => nextItem.serverUrl).filter((url): url is string => Boolean(url)),
        },
      }));
      return nextItems;
    });
  };

  return (
    <QuestionStepShell
      title="Prevention & Core needs"
      subtitle={`Help us understand ${petName}'s daily diet and digestive health to create the best care plan.`}
    >
          <ChoiceRow
            label="Spayed / Neutered?"
            value={prevention.spayedNeutered}
            onChange={(next) =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  spayedNeutered: next,
                  vaccinationHistory: next ? current.prevention.vaccinationHistory : [{ id: createId("vaccination"), date: "", type: "" }],
                },
              }))
            }
          />

          {showMicrochipNumber ? (
            <UnderlinedFieldRow
              label="Microchip number (optional)"
              value={prevention.microchipNumber}
              onChange={(next) => onChange((current) => ({ ...current, prevention: { ...current.prevention, microchipNumber: next } }))}
              fieldWrapClassName="sm:w-[291px]"
            />
          ) : null}

          <UploadSection
            label="Vaccination history"
            helper="Take a picture and upload your vaccination booklet or add manually"
            entries={prevention.vaccinationHistory}
            uploadButtonText="Upload vaccination image"
            addButtonLabel="Add more"
            maxDate={today}
            uploadItems={vaccinationUploadItems}
            onFilesChange={handleVaccinationFilesChange}
            onUploadRemove={handleVaccinationRemove}
            onChange={(id, field, next) =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  vaccinationHistory: current.prevention.vaccinationHistory.map((entry) =>
                    entry.id === id ? { ...entry, [field]: next } : entry
                  ),
                },
              }))
            }
            onAdd={() =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  vaccinationHistory: [...current.prevention.vaccinationHistory, { id: createId("vaccination"), date: "", type: "" }],
                },
              }))
            }
            onRemove={(id) =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  vaccinationHistory:
                    current.prevention.vaccinationHistory.length > 1
                      ? current.prevention.vaccinationHistory.filter((entry) => entry.id !== id)
                      : current.prevention.vaccinationHistory.map((entry) =>
                          entry.id === id ? { ...entry, date: "", type: "" } : entry
                        ),
                },
              }))
            }
          />

          <div className="h-px w-full bg-[#e5e7eb]" />

          <QuestionGroup label="Parasite prevention">
            <div className="space-y-5 pt-[14px]">
              <InlineStepperRow
                label="Internal (Deworming): Every"
                value={prevention.internalParasiteIntervalDays}
                suffix="days"
                onChange={(next) =>
                  onChange((current) => ({ ...current, prevention: { ...current.prevention, internalParasiteIntervalDays: next } }))
                }
              />
              <InlineStepperRow
                label="External (Flea/Tick): Every"
                value={prevention.externalParasiteIntervalDays}
                suffix="days"
                onChange={(next) =>
                  onChange((current) => ({ ...current, prevention: { ...current.prevention, externalParasiteIntervalDays: next } }))
                }
              />
            </div>
          </QuestionGroup>

          <UploadSection
            label="Recent treatments"
            helper="Take a picture and upload recent treatment records or add manually"
            entries={prevention.recentTreatments}
            uploadButtonText="Upload treatment image"
            addButtonLabel="Add more"
            maxDate={today}
            uploadItems={recentTreatmentUploadItems}
            onFilesChange={handleRecentTreatmentFilesChange}
            onUploadRemove={handleRecentTreatmentRemove}
            onChange={(id, field, next) =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  recentTreatments: current.prevention.recentTreatments.map((entry) =>
                    entry.id === id ? { ...entry, [field]: next } : entry
                  ),
                },
              }))
            }
              onAdd={() =>
                onChange((current) => ({
                  ...current,
                  prevention: {
                    ...current.prevention,
                    recentTreatments: [...current.prevention.recentTreatments, { id: createId("treatment"), date: "", type: "" }],
                  },
                }))
              }
            onRemove={(id) =>
              onChange((current) => ({
                ...current,
                prevention: {
                  ...current.prevention,
                  recentTreatments:
                    current.prevention.recentTreatments.length > 1
                      ? current.prevention.recentTreatments.filter((entry) => entry.id !== id)
                      : current.prevention.recentTreatments.map((entry) =>
                          entry.id === id ? { ...entry, date: "", type: "" } : entry
                        ),
                },
              }))
            }
          />

          <div className="h-px w-full bg-[#e5e7eb]" />

          <GoalGrid
            values={prevention.primaryGoals}
            onToggle={(option) =>
              onChange((current) => ({
                ...current,
                prevention: { ...current.prevention, primaryGoals: setSingleArray(current.prevention.primaryGoals, option) },
              }))
            }
          />

          <div className="space-y-3">
            <CustomTextarea
              label="Important restrictions (optional)"
              aria-label="Important restrictions"
              value={prevention.restrictions}
              onChange={(event) => onChange((current) => ({ ...current, prevention: { ...current.prevention, restrictions: event.target.value } }))}
              placeholder="(e.g., Sensitive skin, cannot tolerate high heat drying, easily stressed)"
              className="font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#314158] placeholder:text-[#717182]"
              labelClassName="font-comfortaa text-[15px] font-medium leading-[23px] text-[#0f172b] sm:text-[15.75px] sm:leading-[24.5px]"
              showResizeHandle={false}
            />
          </div>
    </QuestionStepShell>
  );
}

function ChoiceRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="space-y-[14px]">
      <FieldTitle>{label}</FieldTitle>
      <div className="grid gap-[10px] sm:grid-cols-2 sm:gap-[10.5px]">
        {[{ label: "Yes", value: true }, { label: "No", value: false }].map((item) => {
          const selected = value === item.value;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onChange(item.value)}
              className={[
                "min-h-[53px] cursor-pointer whitespace-normal rounded-full border-2 px-4 py-3 text-center font-comfortaa text-[14px] font-medium leading-[21px] transition-colors",
                selected ? "border-[#00d492] bg-[#ecfdf5] text-[#007a55]" : "border-[#e5e7eb] bg-white text-[#314158] hover:border-[#00d492]",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UploadSection({
  label,
  helper,
  entries,
  uploadButtonText,
  addButtonLabel,
  maxDate,
  uploadItems,
  onFilesChange,
  onUploadRemove,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  helper: string;
  entries: Array<{ id: string; date: string; type: string }>;
  uploadButtonText: string;
  addButtonLabel: string;
  maxDate?: string;
  uploadItems: FileUploadItem[];
  onFilesChange: (files: File[]) => void;
  onUploadRemove: (index: number) => void;
  onChange: (id: string, field: "date" | "type", value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-[14px]">
      <FieldTitle>{label}</FieldTitle>
      <div className="space-y-3">
        <p className="font-comfortaa text-[14px] font-normal leading-[22.75px] text-black">{helper}</p>
        <FileUpload
          accept="image/*"
          multiple
          maxSizeMB={10}
          uploadItems={uploadItems}
          onChange={onFilesChange}
          onRemove={onUploadRemove}
          buttonText={uploadButtonText}
          fileTypeHint="JPG, JPEG, PNG less than 10MB"
          showDragHint
          className="w-full"
        />
      </div>
      <div className="space-y-3 sm:space-y-4">
        {entries.map((entry, index) => (
          <TimelineEntryFields
            key={entry.id}
            entry={entry}
            index={index}
            canRemove={entries.length > 1 || Boolean(entry.date) || Boolean(entry.type)}
            maxDate={maxDate}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </div>
      <div className="flex justify-start sm:justify-end">
        <AddMoreButton label={addButtonLabel} onClick={onAdd} />
      </div>
    </div>
  );
}

function TimelineEntryFields({
  entry,
  index,
  canRemove,
  maxDate,
  onChange,
  onRemove,
}: {
  entry: { id: string; date: string; type: string };
  index: number;
  canRemove: boolean;
  maxDate?: string;
  onChange: (id: string, field: "date" | "type", value: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <UnderlinedMiniField
          label={index === 0 ? "Date:" : `Date ${index + 1}:`}
          value={entry.date}
          onChange={(value) => onChange(entry.id, "date", value)}
          calendar
          maxDate={maxDate}
        />
        <UnderlinedMiniField
          label={index === 0 ? "Type:" : `Type ${index + 1}:`}
          value={entry.type}
          onChange={(value) => onChange(entry.id, "type", value)}
        />
        {canRemove ? (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="shrink-0 cursor-pointer text-[#b42318] hover:opacity-70 sm:mb-1"
            aria-label={`Remove ${index === 0 ? "entry" : `entry ${index + 1}`}`}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function UnderlinedMiniField({
  label,
  value,
  onChange,
  calendar = false,
  maxDate,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  calendar?: boolean;
  maxDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => (calendar ? parseDateValue(value) : null), [calendar, value]);
  const currentDate = selectedDate ?? new Date();

  if (calendar) {
    return (
      <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-end">
        <label className="shrink-0 font-comfortaa text-[14px] font-medium leading-[22px] text-[#0f172b] sm:text-[15.75px] sm:leading-[24.5px]">{label}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div className="flex w-full items-end gap-2 border-b border-[#9ca3af] pb-1">
              <input
                aria-label={label}
                value={value}
                onClick={() => setOpen(true)}
                onChange={(event) => onChange(event.target.value)}
                className="w-full bg-transparent font-comfortaa text-[14px] leading-[21px] text-[#314158] outline-none"
              />
              <button
                type="button"
                aria-label={`${label} calendar`}
                onClick={() => setOpen((current) => !current)}
                className="cursor-pointer text-[#6b7280]"
              >
                <CalendarDays className="size-4" />
              </button>
            </div>
          </PopoverAnchor>
          <PopoverContent align="end" sideOffset={8} className="w-auto max-w-[calc(100vw-32px)] rounded-[16px] border border-[#eadfd2] p-0 shadow-[0_16px_40px_rgba(74,60,42,0.12)]">
            <Calendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onDateChange={(date) => {
                onChange(formatDateValue(date));
                setOpen(false);
              }}
              maxDate={maxDate ? parseDateValue(maxDate) ?? undefined : undefined}
              className="gap-3 rounded-[16px] p-4"
              variant="compact"
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-1 sm:flex-row sm:items-end">
      <label className="shrink-0 font-comfortaa text-[14px] font-medium leading-[22px] text-[#0f172b] sm:text-[15.75px] sm:leading-[24.5px]">{label}</label>
      <div className="flex w-full items-end gap-2 border-b border-[#9ca3af] pb-1">
        <input
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent font-comfortaa text-[14px] leading-[21px] text-[#314158] outline-none"
        />
      </div>
    </div>
  );
}

function GoalGrid({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-[14px]">
      <FieldTitle>Primary goal for this service</FieldTitle>
      <OptionGrid options={PREVENTION_OPTIONS.primaryGoals} values={values} onToggle={onToggle} columns={2} />
    </div>
  );
}

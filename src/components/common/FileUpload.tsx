import { useState, useEffect, useMemo } from "react";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ImagePreview } from "./ImagePreview";

export type FileUploadState = "default" | "uploaded" | "hover-to-delete" | "error-size" | "error-format";

export interface FileUploadItem {
  file: File;
  previewUrl: string; // blob URL 或服务器 URL
  uploadProgress?: number;
  uploadStatus?: "uploading" | "uploaded" | "error";
  errorType?: "size" | "format" | "upload" | null;
  photoId?: number; // 上传成功后的照片 ID
  serverUrl?: string; // 上传成功后服务器返回的 URL（相对路径）
  /** 缩略图状态标签，仅用于需要在图片上展示业务状态的布局 */
  badge?: string;
}

export interface FileUploadProps {
  /** 隐藏文件输入的无障碍标签 */
  inputAriaLabel?: string;
  /** 接受的文件类型，例如 "image/*" */
  accept?: string;
  /** 是否支持多文件上传 */
  multiple?: boolean;
  /** 文件大小限制（MB） */
  maxSizeMB?: number;
  /** 最大文件数量限制 */
  maxFiles?: number;
  /** 文件变化回调 */
  onChange?: (files: File[]) => void;
  /** 仅返回本次新增文件；适合由服务端状态控制列表的上传器 */
  onFilesAdded?: (files: File[]) => void;
  /** 删除项回调（用于已上传的图片） */
  onRemove?: (index: number) => void;
  /** 点击上传项预览时交由业务组件处理；未提供时使用通用图片预览 */
  onPreviewItem?: (index: number) => void;
  /** 上传器布局；inspection 为健康检查的紧凑图片槽 */
  layout?: "default" | "inspection";
  /** 上传按钮文字 */
  buttonText?: string;
  /** 文件类型提示文字 */
  fileTypeHint?: string;
  /** 是否显示拖拽提示 */
  showDragHint?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 上传项列表（包含上传状态） */
  uploadItems?: FileUploadItem[];
  /** 上传进度回调（按文件索引） */
  onUploadProgress?: (index: number, progress: number) => void;
  /** 错误类型 */
  errorType?: "size" | "format" | "upload" | null;
  /** 错误信息回调 */
  onError?: (error: { type: "size" | "format"; message: string }) => void;
}

function getUploadItemKey(item: FileUploadItem) {
  return item.photoId !== undefined
    ? `photo-${item.photoId}`
    : `file-${item.file.name}-${item.file.size}-${item.file.lastModified}`;
}

export function FileUpload({
  inputAriaLabel = "Upload files",
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  maxFiles,
  onChange,
  onFilesAdded,
  onRemove,
  onPreviewItem,
  layout = "default",
  buttonText = "Click to upload",
  fileTypeHint = "JPG, JPEG, PNG less than 10MB",
  showDragHint = true,
  className,
  disabled = false,
  uploadItems,
  onUploadProgress: _onUploadProgress,
  errorType,
  onError,
}: FileUploadProps) {
  // 计算当前文件数量（用于判断是否允许追加）
  const currentFilesCount = uploadItems?.length || 0;

  const {
    fileInputRef,
    isDragging,
    files,
    handleClick,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    removeFile,
  } = useFileUpload({
    accept,
    multiple,
    maxSizeMB,
    maxFiles,
    append: !maxFiles || (maxFiles > 1 && currentFilesCount < maxFiles), // 如果没有 maxFiles 限制或未达到限制，允许追加
    onChange: (newFiles) => {
      // 验证文件并触发错误回调
      newFiles.forEach((file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        const fileType = file.type.toLowerCase();
        const isValidType = fileType.startsWith("image/") &&
          (fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png") || fileType.includes("heic") || fileType.includes("heif"));

        if (fileSizeMB > maxSizeMB) {
          onError?.({ type: "size", message: "The uploaded image is too big." });
        } else if (!isValidType) {
          onError?.({ type: "format", message: "The format of uploaded is not accepted." });
        }
      });
      onChange?.(newFiles);
    },
    onFilesAdded,
    disabled,
  });

  // 管理图片预览 URL 和上传状态
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [internalUploadItems, setInternalUploadItems] = useState<FileUploadItem[]>([]);

  // 如果提供了 uploadItems，使用外部状态；否则使用内部状态
  const displayItems = uploadItems || internalUploadItems;

  // 使用 useMemo 稳定 images 和 fileNames 数组，避免不必要的重新渲染
  const previewImages = useMemo(
    () => displayItems.map((item) => item.previewUrl).filter((url) => url),
    [displayItems]
  );
  const previewFileNames = useMemo(
    () => displayItems.map((item) => item.file.name),
    [displayItems]
  );

  useEffect(() => {
    // 为每个文件创建预览 URL
    const urls = files.map((file) => URL.createObjectURL(file));

    // 如果没有提供 uploadItems，创建内部状态
    if (!uploadItems) {
      const items: FileUploadItem[] = files.map((file, index) => ({
        file,
        previewUrl: urls[index],
        uploadStatus: "uploading",
        uploadProgress: 0,
      }));
      setInternalUploadItems(items);
    }

    // 清理函数：组件卸载或文件变化时释放 URL
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files, uploadItems]);

  // 确定当前状态
  const getState = (): FileUploadState => {
    if (errorType === "size") return "error-size";
    if (errorType === "format") return "error-format";
    // 使用 displayItems 而不是 files，因为可能从外部传入 uploadItems
    if (displayItems.length > 0) return "uploaded";
    return "default";
  };

  const state = getState();
  // 使用 displayItems 而不是 files，因为可能从外部传入 uploadItems
  const hasFiles = displayItems.length > 0;
  // 是否可以添加更多文件，取决于 maxFiles 限制
  const canAddMore = !maxFiles || displayItems.length < maxFiles;
  // 当达到 maxFiles 限制时，禁用上传功能
  const isUploadDisabled = maxFiles ? displayItems.length >= maxFiles : false;

  return (
    <div className={cn("relative flex w-full flex-col items-start", className)}>
      <div
        className={cn(
          layout === "inspection"
            ? "relative flex w-full shrink-0 flex-col items-center justify-center rounded-2xl border border-[#633479] bg-[#FAFAFA] p-4 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)]"
            : "relative flex w-full shrink-0 flex-col items-center justify-center rounded-[calc(16*var(--px393))] border-[1.5px] border-dashed border-[#de6a07] bg-neutral-50 p-[calc(16*var(--px393))] transition-colors shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] sm:rounded-[16px] sm:p-[24px]",
          isDragging && "border-[#de6a07] bg-[rgba(222,106,7,0.05)]",
          (state === "error-size" || state === "error-format") && "gap-[12px]"
        )}
        onDragEnter={!disabled && !isUploadDisabled ? handleDragEnter : undefined}
        onDragOver={!disabled && !isUploadDisabled ? handleDragOver : undefined}
        onDragLeave={!disabled && !isUploadDisabled ? handleDragLeave : undefined}
        onDrop={!disabled && !isUploadDisabled ? handleDrop : undefined}
      >
        <div className={cn(
          "relative flex shrink-0 flex-col items-center justify-center gap-[calc(14*var(--px393))] sm:gap-[18px]",
          hasFiles && "w-full"
        )}>
          {/* 文件列表：显示在按钮和文字上方 */}
          {(hasFiles || layout === "inspection") && (
            <div className={cn(
              "relative flex w-full flex-wrap items-center gap-[calc(10*var(--px393))] sm:flex-nowrap sm:gap-[12px]",
              layout === "inspection" && "flex-wrap gap-1 overflow-visible sm:flex-wrap sm:gap-1",
            )}>
              {/* 已上传的图片缩略图列表 */}
              {displayItems.map((item, index) => {
                const file = item.file;
                const previewUrl = item.previewUrl;
                const isUploading = item.uploadStatus === "uploading" && (item.uploadProgress !== undefined && item.uploadProgress < 100);

                const isUploaded = item.uploadStatus === "uploaded";

                // 使用稳定的 key：优先使用 photoId（已上传的图片），否则使用 file 的唯一标识
                // 这样可以避免在删除时因索引变化导致重新渲染
                const stableKey = getUploadItemKey(item);

                return (
                  <div
                    key={stableKey}
                    className={cn(
                      layout === "inspection"
                        ? "relative overflow-visible h-[84px] flex-1 rounded-[14px] border border-[#D4C9E0] shrink-0"
                        : "relative overflow-visible h-[calc(80*var(--px393))] w-[calc(80*var(--px393))] sm:h-[80px] sm:w-[96px] rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 border border-neutral-200",
                    )}
                  >
                    {previewUrl && (
                      <>
                        <div
                          className={cn("absolute inset-0 cursor-pointer rounded-[calc(8*var(--px393))] sm:rounded-[8px]", layout === "inspection" && "rounded-[14px] sm:rounded-[14px]")}
                          onClick={() => {
                            if (onPreviewItem) {
                              onPreviewItem(index);
                              return;
                            }
                            setPreviewIndex(index);
                            setPreviewOpen(true);
                          }}
                        >
                          <img
                            className={cn("absolute inset-0 size-full max-w-none pointer-events-none rounded-[calc(8*var(--px393))] object-cover sm:rounded-[8px]", layout === "inspection" && "rounded-[14px] sm:rounded-[14px]")}
                            alt={file.name}
                            src={previewUrl}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        {/* 上传进度遮罩（上传中时显示） */}
                        {isUploading && (
                          <>
                            <div className="absolute backdrop-blur-[2px] backdrop-filter bg-[rgba(0,0,0,0.2)] inset-0 rounded-[calc(8*var(--px393))] sm:rounded-[8px]" />
                            <div className="absolute flex flex-col gap-[calc(6*var(--px393))] sm:gap-[8px] items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[calc(16*var(--px393))] sm:leading-[16px] not-italic relative shrink-0 text-[calc(11*var(--px393))] sm:text-[11px] text-center text-white">
                                Uploading
                              </p>
                              <div className="bg-white border border-neutral-200 h-[4px] overflow-clip relative rounded-[16px] shrink-0 w-[calc(80*var(--px393))] sm:w-[80px]">
                                <div
                                  className="absolute bg-green-500 h-[4px] left-0 rounded-[16px] top-0 transition-all duration-300"
                                  style={{ width: `${item.uploadProgress || 0}%` }}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {/* 删除按钮（位于缩略图右上角，上传成功后显示） */}
                        {isUploaded && !isUploading && (
                          <div
                            className="absolute bg-neutral-100 border border-[#4c4c4c] border-solid overflow-clip rounded-[calc(8*var(--px393))] sm:rounded-[8px] size-[calc(20*var(--px393))] sm:size-[20px] top-[-4px] right-[-4px] cursor-pointer flex items-center justify-center z-20 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.debug("[FileUpload] delete click", {
                                index,
                                hasUploadItems: Boolean(uploadItems),
                                item: displayItems[index],
                              });
                              // 清理预览 URL（只清理 blob URL，不清理服务器 URL）
                              if (displayItems[index]?.previewUrl && displayItems[index].previewUrl.startsWith("blob:")) {
                                URL.revokeObjectURL(displayItems[index].previewUrl);
                              }
                              // 如果是从外部传入的 uploadItems，需要通过回调通知父组件
                              if (uploadItems) {
                                // 外部传入 uploadItems：已上传项直接走 onRemove（即便没有 photoId）
                                if (displayItems[index]?.uploadStatus === "uploaded") {
                                  console.debug("[FileUpload] onRemove uploaded", {
                                    index,
                                    photoId: displayItems[index]?.photoId,
                                  });
                                  onRemove?.(index);
                                } else {
                                  // 未上传的文件，使用 onChange 回调
                                  const remainingFiles = files.filter((_, i) => i !== index);
                                  console.debug("[FileUpload] onChange remaining files", {
                                    remainingCount: remainingFiles.length,
                                  });
                                  onChange?.(remainingFiles);
                                }
                              } else {
                                console.debug("[FileUpload] removeFile internal", { index });
                                removeFile(index);
                              }
                            }}
                          >
                            {/* X 图标：两条交叉的线 */}
                            <div className="relative shrink-0 size-[calc(10*var(--px393))] sm:size-[10px] flex items-center justify-center">
                              <div className="absolute bg-[#4c4c4c] h-[1.5px] w-full rotate-45" />
                              <div className="absolute bg-[#4c4c4c] h-[1.5px] w-full rotate-135" />
                            </div>
                          </div>
                        )}
                        {layout === "inspection" && item.badge ? (
                          <div className="pointer-events-none absolute bottom-[-8px] left-[12px] z-10 flex items-center gap-1 rounded-full border border-[#F1C9CC] bg-[#FFF6F6] px-3 py-1 font-comfortaa text-xs text-[#B23A48] shadow-sm">
                            <Icon name="alert-ai-scan" className="size-[13px]" />
                            {item.badge}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}

              {/* 添加更多图片按钮 */}
              {canAddMore && (
                <div
                  className={cn(
                    layout === "inspection"
                      ? "relative flex h-[84px] flex-1 shrink-0 cursor-pointer flex-col items-center justify-center gap-[7px] rounded-[14px] border-[1.45px] border-dashed border-[#D4C9E0] bg-white shadow-[0px_1px_5px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#de6a07]"
                      : "relative overflow-clip h-[calc(80*var(--px393))] w-[calc(80*var(--px393))] sm:h-[80px] sm:w-[96px] rounded-[calc(8*var(--px393))] sm:rounded-[8px] bg-white border border-dashed border-neutral-300 shrink-0 cursor-pointer transition-colors hover:border-[#de6a07]",
                  )}
                  onClick={handleClick}
                >
                  {layout === "inspection" ? (
                    <>
                      <div className="flex size-[29px] shrink-0 items-center justify-center rounded-full bg-[#F0EBF7]">
                        <Icon name="add-inspection" className="block size-[28px]" />
                      </div>
                      <span className="text-center font-comfortaa text-xs font-medium leading-[18px] text-[#633479]">Add photo</span>
                    </>
                  ) : (
                    <>
                      <div className="absolute bg-neutral-100 -inset-px rounded-[calc(8*var(--px393))] sm:rounded-[8px]" />
                      <div className="absolute left-1/2 size-[calc(32*var(--px393))] sm:size-[32px] top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Icon
                          name="add"
                          className="block size-full text-[#A3A3A3]"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Default State: 显示上传图标（仅在没有文件时显示） */}
          {state === "default" && layout === "default" && (
            <div className="overflow-clip relative shrink-0 size-[calc(48*var(--px393))] sm:size-[48px]">
              <Icon
                name="image"
                className="block size-full text-[#A3A3A3]"
              />
            </div>
          )}

          {/* Text Group: 上传按钮和提示文字（移动端：按钮与 or drag and drop 纵向；PC：横向） */}
          <div className={cn("relative flex w-full flex-col items-center justify-center gap-[calc(6*var(--px393))] sm:gap-[3px]", layout === "inspection" && "hidden")}>
            <div className="relative flex w-full flex-col items-center justify-center gap-[calc(6*var(--px393))] sm:w-auto sm:flex-row sm:gap-[9px]">
              <div
                className={cn(
                  "relative flex h-[calc(32*var(--px393))] w-full items-center justify-center rounded-[calc(32*var(--px393))] border-2 border-solid border-[#de6a07] px-[calc(18*var(--px393))] sm:h-[28px] sm:w-auto sm:rounded-[32px] sm:border-[#8b6357] sm:px-[26px]",
                  (disabled || isUploadDisabled) && "border-[rgba(222,106,7,0.35)] sm:border-[rgba(139,99,87,0.35)]"
                )}
              >
                <div className="relative flex items-center gap-[5px] border-0 border-solid border-transparent bg-clip-padding">
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || isUploadDisabled}
                    className={cn(
                      "relative w-full cursor-pointer text-center font-comfortaa text-[calc(12*var(--px393))] font-bold leading-[calc(17.5*var(--px393))] text-[#de6a07] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-[12px] sm:leading-[17.5px] sm:text-[#8b6357]",
                      (disabled || isUploadDisabled) && "text-[rgba(222,106,7,0.35)] sm:text-[rgba(139,99,87,0.35)]"
                    )}
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
              {showDragHint && (
                <p
                  className={cn(
                    "relative text-center font-comfortaa text-[calc(13*var(--px393))] font-bold leading-[calc(18*var(--px393))] text-neutral-600 sm:shrink-0 sm:text-[14px] sm:leading-[20px]",
                    (disabled || isUploadDisabled) && "text-[rgba(96,104,122,0.35)]"
                  )}
                >
                  or drag and drop
                </p>
              )}
            </div>
            <p className="max-w-full text-center font-['Inter:Regular',sans-serif] text-[calc(13px*var(--px393))] font-normal leading-[calc(20*var(--px393))] not-italic text-neutral-400 sm:shrink-0 sm:text-[16.5px] sm:leading-[24px]">
              {fileTypeHint}
            </p>
          </div>
        </div>

        {/* 错误提示 */}
        {(state === "error-size" || state === "error-format") && (
          <div className="border border-[#de1507] border-solid flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 w-full">
            <div className="flex gap-[8px] items-center relative shrink-0">
              <Icon
                name="alert-error"
                className="relative shrink-0 size-[12px] text-[#de1507]"
              />
              <p className="font-comfortaa font-normal leading-normal relative shrink-0 text-[#de1507] text-[10px]">
                {state === "error-size"
                  ? "The uploaded image is too big."
                  : "The format of uploaded is not accepted."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        aria-label={inputAriaLabel}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploadDisabled}
      />

      {/* 图片预览对话框 */}
      {displayItems.length > 0 && displayItems.some((item) => item.previewUrl) && (
        <ImagePreview
          images={previewImages}
          currentIndex={previewIndex}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          fileNames={previewFileNames}
        />
      )}
    </div>
  );
}

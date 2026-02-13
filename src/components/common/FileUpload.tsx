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
}

export interface FileUploadProps {
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
  /** 删除项回调（用于已上传的图片） */
  onRemove?: (index: number) => void;
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

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  maxFiles,
  onChange,
  onRemove,
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
          (fileType.includes("jpeg") || fileType.includes("jpg") || fileType.includes("png"));

        if (fileSizeMB > maxSizeMB) {
          onError?.({ type: "size", message: "The uploaded image is too big." });
        } else if (!isValidType) {
          onError?.({ type: "format", message: "The format of uploaded is not accepted." });
        }
      });
      onChange?.(newFiles);
    },
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
    <div className={cn("content-stretch flex flex-col items-start relative shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] w-full", className)}>
      <div
        className={cn(
          "bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed content-stretch flex flex-col items-center justify-center p-[calc(20*var(--px393))] sm:p-[24px] relative rounded-[calc(16*var(--px393))] sm:rounded-[16px] shrink-0 w-full transition-colors",
          isDragging && "border-[#de6a07] bg-[rgba(222,106,7,0.05)]",
          (disabled || isUploadDisabled) && "opacity-60 cursor-not-allowed",
          (state === "error-size" || state === "error-format") && "gap-[12px]"
        )}
        onDragEnter={!isUploadDisabled ? handleDragEnter : undefined}
        onDragOver={!isUploadDisabled ? handleDragOver : undefined}
        onDragLeave={!isUploadDisabled ? handleDragLeave : undefined}
        onDrop={!isUploadDisabled ? handleDrop : undefined}
      >
        <div className={cn(
          "content-stretch flex flex-col gap-[calc(18*var(--px393))] sm:gap-[18px] items-center justify-center relative shrink-0",
          hasFiles && "w-full"
        )}>
          {/* 文件列表：显示在按钮和文字上方 */}
          {hasFiles && (
            <div className="content-stretch flex flex-wrap sm:flex-nowrap gap-[calc(12*var(--px393))] sm:gap-[12px] items-center relative shrink-0 w-full">
              {/* 已上传的图片缩略图列表 */}
              {displayItems.map((item, index) => {
                const file = item.file;
                const previewUrl = item.previewUrl;
                const isUploading = item.uploadStatus === "uploading" && (item.uploadProgress !== undefined && item.uploadProgress < 100);

                const isUploaded = item.uploadStatus === "uploaded";

                // 使用稳定的 key：优先使用 photoId（已上传的图片），否则使用 file 的唯一标识
                // 这样可以避免在删除时因索引变化导致重新渲染
                const stableKey = item.photoId !== undefined 
                  ? `photo-${item.photoId}` 
                  : `file-${file.name}-${file.size}-${file.lastModified}`;

                return (
                  <div
                    key={stableKey}
                    className="h-[calc(80*var(--px393))] w-[calc(80*var(--px393))] sm:h-[80px] sm:w-[96px] overflow-visible relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 border border-neutral-200"
                  >
                    {previewUrl && (
                      <>
                        <div
                          className="absolute inset-0 rounded-[calc(8*var(--px393))] sm:rounded-[8px] cursor-pointer"
                          onClick={() => {
                            setPreviewIndex(index);
                            setPreviewOpen(true);
                          }}
                        >
                          <img
                            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[calc(8*var(--px393))] sm:rounded-[8px] size-full"
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
                            <div className="absolute content-stretch flex flex-col gap-[calc(6*var(--px393))] sm:gap-[8px] items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
                            className="absolute bg-neutral-100 border border-[#4c4c4c] border-solid overflow-clip rounded-[calc(8*var(--px393))] sm:rounded-[8px] size-[calc(20*var(--px393))] sm:size-[20px] top-[calc(-6*var(--px393))] right-[calc(-6*var(--px393))] sm:top-[-6px] sm:right-[-6px] cursor-pointer flex items-center justify-center z-20 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]"
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
                      </>
                    )}
                  </div>
                );
              })}

              {/* 添加更多图片按钮 */}
              {canAddMore && (
                <div
                  className="bg-white border border-dashed border-neutral-300 h-[calc(80*var(--px393))] w-[calc(80*var(--px393))] sm:h-[80px] sm:w-[96px] overflow-clip relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 cursor-pointer hover:border-[#de6a07] transition-colors"
                  onClick={handleClick}
                >
                  <div className="absolute bg-neutral-100 -inset-px rounded-[calc(8*var(--px393))] sm:rounded-[8px]" />
                  <div className="absolute left-1/2 size-[calc(32*var(--px393))] sm:size-[32px] top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Icon
                      name="add"
                      className="block size-full text-[#A3A3A3]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Default State: 显示上传图标（仅在没有文件时显示） */}
          {state === "default" && (
            <div className="overflow-clip relative shrink-0 size-[calc(48*var(--px393))] sm:size-[48px]">
              <Icon
                name="image"
                className="block size-full text-[#A3A3A3]"
              />
            </div>
          )}

          {/* Text Group: 上传按钮和提示文字（移动端：按钮与 or drag and drop 纵向；PC：横向） */}
          <div className="content-stretch flex flex-col gap-[calc(6*var(--px393))] sm:gap-[3px] items-center justify-center relative shrink-0">
            <div className="content-stretch flex flex-col sm:flex-row gap-[calc(6*var(--px393))] sm:gap-[9px] items-center justify-center relative shrink-0">
              <div className="border-2 border-[#de6a07] sm:border-[#8b6357] border-solid content-stretch flex h-[calc(28*var(--px393))] sm:h-[28px] items-center justify-center px-[calc(26*var(--px393))] sm:px-[26px] relative rounded-[calc(32*var(--px393))] sm:rounded-[32px] shrink-0">
                <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative">
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled || isUploadDisabled}
                    className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(17.5*var(--px393))] sm:leading-[17.5px] relative shrink-0 text-[calc(12*var(--px393))] sm:text-[12px] text-[#de6a07] sm:text-[#8b6357] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
              {showDragHint && (
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[calc(20*var(--px393))] sm:leading-[20px] relative shrink-0 text-[calc(14*var(--px393))] sm:text-[14px] text-neutral-600">
                  or drag and drop
                </p>
              )}
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[calc(24*var(--px393))] sm:leading-[24px] not-italic relative shrink-0 text-[calc(16.5*var(--px393))] sm:text-[16.5px] text-neutral-400">
              {fileTypeHint}
            </p>
          </div>
        </div>

        {/* 错误提示 */}
        {(state === "error-size" || state === "error-format") && (
          <div className="border border-[#de1507] border-solid content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[calc(8*var(--px393))] sm:rounded-[8px] shrink-0 w-full">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              <Icon
                name="alert-error"
                className="relative shrink-0 size-[12px] text-[#de1507]"
              />
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-normal relative shrink-0 text-[#de1507] text-[10px]">
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

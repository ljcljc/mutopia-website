import { useState, useEffect } from "react";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { ImagePreview } from "./ImagePreview";

export type FileUploadState = "default" | "uploaded" | "hover-to-delete" | "error-size" | "error-format";

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
  /** 上传进度（0-100），用于显示上传状态 */
  uploadProgress?: number;
  /** 错误类型 */
  errorType?: "size" | "format" | null;
  /** 错误信息回调 */
  onError?: (error: { type: "size" | "format"; message: string }) => void;
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  maxFiles,
  onChange,
  buttonText = "Click to upload",
  fileTypeHint = "JPG, JPEG, PNG less than 10MB",
  showDragHint = true,
  className,
  disabled = false,
  uploadProgress,
  errorType,
  onError,
}: FileUploadProps) {
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

  // 管理图片预览 URL
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    // 为每个文件创建预览 URL
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // 清理函数：组件卸载或文件变化时释放 URL
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 确定当前状态
  const getState = (): FileUploadState => {
    if (errorType === "size") return "error-size";
    if (errorType === "format") return "error-format";
    if (files.length > 0 && hoveredIndex !== null) return "hover-to-delete";
    if (files.length > 0) return "uploaded";
    return "default";
  };

  const state = getState();
  const hasFiles = files.length > 0;
  const canAddMore = !maxFiles || files.length < maxFiles;

  return (
    <div className={cn("content-stretch flex flex-col items-start relative shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] w-full", className)}>
      <div
        className={cn(
          "bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed content-stretch flex flex-col items-center justify-center p-[24px] relative rounded-[16px] shrink-0 w-full transition-colors",
          isDragging && "border-[#de6a07] bg-[rgba(222,106,7,0.05)]",
          disabled && "opacity-60 cursor-not-allowed",
          (state === "error-size" || state === "error-format") && "gap-[12px]"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={cn(
          "content-stretch flex flex-col gap-[18px] items-center justify-center relative shrink-0",
          hasFiles && "w-full"
        )}>
          {/* Default State: 显示上传图标和按钮 */}
          {state === "default" && (
            <div className="overflow-clip relative shrink-0 size-[48px]">
              <Icon
                name="image"
                className="block size-full text-[#A3A3A3]"
              />
            </div>
          )}

          {/* Text Group: 上传按钮和提示文字 */}
          <div className="content-stretch flex flex-col gap-[3px] items-center justify-center relative shrink-0">
            <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0">
              <div className="border-2 border-(--mutopia-logo,#8b6357) border-solid content-stretch flex h-[28px] items-center justify-center px-[26px] relative rounded-[32px] shrink-0">
                <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex gap-[5px] items-center relative">
                  <button
                    type="button"
                    onClick={handleClick}
                    disabled={disabled}
                    className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[17.5px] relative shrink-0 text-[12px] text-(--mutopia-logo,#8b6357) cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {buttonText}
                  </button>
                </div>
              </div>
              {showDragHint && (
                <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-neutral-600">
                  or drag and drop
                </p>
              )}
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16.5px] text-neutral-400">
              {fileTypeHint}
            </p>
          </div>

          {/* Uploaded State: 显示图片预览 */}
          {hasFiles && (
            <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
              {/* 已上传的图片预览 */}
              {files.map((file, index) => {
                const previewUrl = previewUrls[index];
                const isHovered = hoveredIndex === index;
                const isUploading = uploadProgress !== undefined && uploadProgress < 100;

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="h-[80px] overflow-clip relative rounded-[8px] shrink-0 w-[96px] group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* 图片预览 */}
                    {previewUrl && (
                      <>
                        <div
                          className="absolute inset-0 rounded-[8px] cursor-pointer"
                          onClick={() => {
                            setPreviewIndex(index);
                            setPreviewOpen(true);
                          }}
                        >
                          <img
                            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full"
                            alt={file.name}
                            src={previewUrl}
                          />
                        </div>
                        {/* 上传进度遮罩 */}
                        {isUploading && (
                          <>
                            <div className="absolute backdrop-blur-[2px] backdrop-filter bg-[rgba(0,0,0,0.2)] inset-0" />
                            <div className="absolute content-stretch flex flex-col gap-[8px] items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[11px] text-center text-white">
                                Uploading
                              </p>
                              <div className="bg-white h-[4px] overflow-clip relative rounded-[16px] shrink-0 w-[80px]">
                                <div
                                  className="absolute bg-green-500 h-[4px] left-0 rounded-[16px] top-0 transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {/* 删除按钮 */}
                        <div
                          className={cn(
                            "absolute bg-red-50 content-stretch flex items-center justify-center overflow-clip p-[6px] rounded-[6px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.08)] left-1/2 top-[calc(50%+64px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity",
                            isUploading ? "opacity-0 pointer-events-none" : "opacity-100",
                            isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                            setHoveredIndex(null);
                          }}
                        >
                          <div className="relative shrink-0 size-[20px]">
                            <Icon
                              name="trash"
                              className="block size-full text-[#EF4444]"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* 添加更多图片按钮 */}
              {canAddMore && (
                <div
                  className="bg-white border border-dashed border-neutral-300 h-[80px] overflow-clip relative rounded-[8px] shrink-0 w-[96px] cursor-pointer hover:border-[#de6a07] transition-colors"
                  onClick={handleClick}
                >
                  <div className="absolute bg-neutral-100 -inset-px rounded-[8px]" />
                  <div className="absolute left-1/2 size-[32px] top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Icon
                      name="add"
                      className="block size-full text-[#A3A3A3]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {(state === "error-size" || state === "error-format") && (
          <div className="border border-[#de1507] border-solid content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[8px] shrink-0 w-full">
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
        disabled={disabled}
      />

      {/* 图片预览对话框 */}
      {previewUrls.length > 0 && (
        <ImagePreview
          images={previewUrls}
          currentIndex={previewIndex}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          fileNames={files.map((f) => f.name)}
        />
      )}
    </div>
  );
}
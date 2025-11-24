import { Icon } from "./Icon";
import { OrangeButton } from "./OrangeButton";
import { cn } from "@/components/ui/utils";
import { useFileUpload } from "@/hooks/useFileUpload";

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
  /** 上传区域图标 */
  icon?: "image" | "add";
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
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  maxFiles,
  onChange,
  icon = "image",
  buttonText = "Click to upload",
  fileTypeHint = "JPG, JPEG, PNG less than 10MB",
  showDragHint = true,
  className,
  disabled = false,
}: FileUploadProps) {
  const {
    fileInputRef,
    isDragging,
    handleClick,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useFileUpload({
    accept,
    multiple,
    maxSizeMB,
    maxFiles,
    onChange,
    disabled,
  });

  return (
    <div
      className={cn(
        "bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed box-border flex flex-col gap-[12px] items-center justify-center p-[24px] relative rounded-[16px] transition-colors",
        isDragging && "border-[#de6a07] bg-[rgba(222,106,7,0.05)]",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col gap-[18px] items-center justify-center relative shrink-0">
        <div className="overflow-clip relative shrink-0 size-[48px]">
          <Icon
            name={icon}
            className="block size-full text-[#A3A3A3]"
          />
        </div>
        <div className="flex flex-col gap-[3px] items-center justify-center relative shrink-0">
          <div className="flex gap-[9px] items-center justify-center relative shrink-0">
            <OrangeButton
              size="compact"
              variant="secondary"
              showArrow={true}
              onClick={handleClick}
              type="button"
              disabled={disabled}
            >
              {buttonText}
            </OrangeButton>
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
      </div>
    </div>
  );
}


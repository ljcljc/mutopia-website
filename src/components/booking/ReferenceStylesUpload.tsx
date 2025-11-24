import { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common/OrangeButton";
import { cn } from "@/components/ui/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

export interface ReferenceStylesUploadProps {
  /** 文件变化回调 */
  onChange?: (files: File[]) => void;
  /** 是否禁用 */
  disabled?: boolean;
}

export function ReferenceStylesUpload({
  onChange,
  disabled = false,
}: ReferenceStylesUploadProps) {
  // Reference styles 上传 hook
  const {
    fileInputRef,
    isDragging,
    files,
    accept,
    multiple,
    handleClick,
    handleFileChange,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    removeFile,
  } = useFileUpload({
    accept: "image/*",
    multiple: true,
    maxSizeMB: 1,
    maxFiles: 2,
    append: true,
    onChange,
    disabled,
  });

  // 管理图片预览 URL
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    // 为每个文件创建预览 URL
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // 清理函数：组件卸载或文件变化时释放 URL
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  return (
    <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
      <div className="flex flex-col gap-[14px] items-start relative shrink-0 w-full">
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <div className="flex flex-col items-start relative shrink-0">
            <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-black">
              Upload reference styles (optional)
            </p>
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
              This helps groomers prepare and provide the best care possible
            </p>
          </div>
          <div className="flex gap-[12px] items-start overflow-clip relative shrink-0 w-full">
            <div
              className={cn(
                "bg-neutral-50 border-[#de6a07] border-[1.5px] border-dashed box-border flex flex-1 gap-[12px] items-end p-[24px] relative rounded-[16px] shrink-0 transition-colors",
                isDragging && "bg-[rgba(222,106,7,0.05)]"
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
              <PhotoProvider>
                <div className="flex flex-1 flex-col gap-[12px] items-center justify-end relative shrink-0">
                  <div className="flex gap-[12px] items-center relative shrink-0">
                    {files.slice(0, 2).map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="bg-white border border-dashed border-neutral-300 h-[120px] relative rounded-[8px] shrink-0 w-[144px] group"
                      >
                        <div className="h-[120px] overflow-clip relative rounded-[inherit] w-[144px]">
                          {previewUrls[index] ? (
                            <>
                              <PhotoView src={previewUrls[index]}>
                                <img
                                  src={previewUrls[index]}
                                  alt={file.name}
                                  className="absolute inset-0 w-full h-full object-cover rounded-[8px] cursor-pointer"
                                />
                              </PhotoView>
                              <div className="absolute bg-[rgba(222,106,7,0.5)] inset-0 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  removeFile(index);
                                }}
                                className="absolute right-1 top-1 size-[20px] bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                aria-label="Remove image"
                              >
                                <span className="text-white text-[12px] leading-none">×</span>
                              </button>
                            </>
                          ) : (
                            <div className="absolute bg-[rgba(222,106,7,0.5)] inset-0 rounded-[8px]" />
                          )}
                        </div>
                      </div>
                    ))}
                    {files.length < 2 && (
                      <div className="bg-white border border-dashed border-neutral-300 h-[120px] relative rounded-[8px] shrink-0 w-[144px] overflow-hidden">
                        <div className="absolute bg-neutral-100 inset-0 rounded-[8px]" />
                        <div
                          className="absolute left-1/2 size-[48px] top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                          onClick={handleClick}
                        >
                          <Icon
                            name="add"
                            className="block size-full text-[#A3A3A3]"
                          />
                        </div>
                      </div>
                    )}
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
                        Click to upload
                      </OrangeButton>
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] relative shrink-0 text-[14px] text-neutral-600">
                        or drag and drop
                      </p>
                    </div>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16.5px] text-neutral-400">
                      JPG, JPEG, PNG less than 1MB
                    </p>
                  </div>
                </div>
              </PhotoProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


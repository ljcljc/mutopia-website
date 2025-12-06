import { FileUpload } from "@/components/common";

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
          <div className="flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full">
            <FileUpload
              accept="image/*"
              multiple={true}
              maxSizeMB={1}
              maxFiles={2}
              onChange={onChange}
              buttonText="Click to upload"
              fileTypeHint="JPG, JPEG, PNG less than 1MB"
              showDragHint={true}
              className="w-full"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
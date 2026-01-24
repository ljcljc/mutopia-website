import { useRef, useState, useCallback } from "react";
import { uploadAvatar, getCurrentUser } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { useAuthStore } from "@/components/auth/authStore";

export interface UseAvatarUploadOptions {
  /** 文件大小限制（MB），默认 10MB */
  maxSizeMB?: number;
  /** 允许的文件类型，默认 ["image/jpeg", "image/jpg", "image/png"] */
  validTypes?: string[];
  /** 上传成功后的回调 */
  onSuccess?: () => void;
  /** 上传失败后的回调 */
  onError?: (error: Error) => void;
}

export interface UseAvatarUploadReturn {
  /** 文件输入 ref */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** 是否正在上传 */
  isUploading: boolean;
  /** 上传进度（0-100） */
  uploadProgress: number;
  /** 触发文件选择 */
  handleClick: () => void;
  /** 文件选择变化处理 */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 自定义文件输入组件属性 */
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    type: "file";
    accept: string;
    className: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    style: React.CSSProperties;
  };
}

/**
 * 头像上传 Hook
 * 
 * 提供完整的头像上传功能，包括：
 * - 文件验证（类型、大小）
 * - 上传进度跟踪
 * - 自动更新用户信息
 * - 错误处理
 * 
 * @example
 * ```tsx
 * const { fileInputRef, isUploading, uploadProgress, handleClick, inputProps } = useAvatarUpload({
 *   onSuccess: () => console.log("Upload successful"),
 * });
 * 
 * // 使用自定义输入
 * <input {...inputProps} />
 * 
 * // 或使用 ref 手动控制
 * <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
 * ```
 */
export function useAvatarUpload(options: UseAvatarUploadOptions = {}): UseAvatarUploadReturn {
  const {
    maxSizeMB = 10,
    validTypes = ["image/jpeg", "image/jpg", "image/png"],
    onSuccess,
    onError,
  } = options;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const handleClick = useCallback(() => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  }, [isUploading]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 验证文件类型
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPG, JPEG, or PNG image.");
        e.target.value = "";
        return;
      }

      // 验证文件大小
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`Image size must be less than ${maxSizeMB}MB.`);
        e.target.value = "";
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        await uploadAvatar(file, (progress) => {
          setUploadProgress(progress);
        });

        // 上传成功后，更新用户信息
        const updatedUserInfo = await getCurrentUser();
        setUserInfo(updatedUserInfo);

        toast.success("Avatar uploaded successfully!");
        onSuccess?.();
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        const errorMessage =
          error instanceof HttpError
            ? error.message || "Failed to upload avatar."
            : "Failed to upload avatar. Please try again.";
        toast.error(errorMessage);
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        e.target.value = "";
      }
    },
    [maxSizeMB, validTypes, onSuccess, onError, setUserInfo]
  );

  const accept = validTypes.join(",");

  return {
    fileInputRef,
    isUploading,
    uploadProgress,
    handleClick,
    handleFileChange,
    inputProps: {
      ref: fileInputRef,
      type: "file",
      accept,
      className: "hidden",
      onChange: handleFileChange,
      disabled: isUploading,
      style: { display: "none" },
    },
  };
}

import { useRef, useState, useCallback } from "react";

export interface UseFileUploadOptions {
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
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否追加文件（用于多文件上传时追加到现有列表） */
  append?: boolean;
}

export interface UseFileUploadReturn {
  /** 文件输入 ref */
  fileInputRef: React.RefObject<HTMLInputElement>;
  /** 是否正在拖拽 */
  isDragging: boolean;
  /** 已选择的文件列表 */
  files: File[];
  /** 接受的文件类型 */
  accept: string;
  /** 是否支持多文件 */
  multiple: boolean;
  /** 点击上传按钮 */
  handleClick: () => void;
  /** 文件选择变化处理 */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 拖拽进入处理 */
  handleDragEnter: (e: React.DragEvent) => void;
  /** 拖拽离开处理 */
  handleDragLeave: (e: React.DragEvent) => void;
  /** 拖拽悬停处理 */
  handleDragOver: (e: React.DragEvent) => void;
  /** 拖拽放下处理 */
  handleDrop: (e: React.DragEvent) => void;
  /** 清空文件列表 */
  clearFiles: () => void;
  /** 移除指定文件 */
  removeFile: (index: number) => void;
}

/**
 * 文件上传 Hook
 * 
 * 提供完整的文件上传功能，包括：
 * - 点击上传
 * - 拖拽上传
 * - 文件大小验证
 * - 文件数量限制
 * - 文件列表管理
 * 
 * @example
 * ```tsx
 * const {
 *   fileInputRef,
 *   isDragging,
 *   files,
 *   handleClick,
 *   handleFileChange,
 *   handleDragEnter,
 *   handleDragLeave,
 *   handleDragOver,
 *   handleDrop,
 * } = useFileUpload({
 *   accept: "image/*",
 *   multiple: true,
 *   maxSizeMB: 10,
 *   maxFiles: 5,
 *   onChange: (files) => console.log(files),
 * });
 * ```
 */
export function useFileUpload({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  maxFiles,
  onChange,
  disabled = false,
  append = false,
}: UseFileUploadOptions = {}): UseFileUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles || selectedFiles.length === 0) return;

      const fileArray = Array.from(selectedFiles);
      
      // 验证文件大小
      const validFiles = fileArray.filter((file) => {
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          console.warn(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      // 处理文件列表
      const newFiles = append ? [...files, ...validFiles] : validFiles;
      
      // 应用文件数量限制
      const limitedFiles = maxFiles ? newFiles.slice(0, maxFiles) : newFiles;
      
      setFiles(limitedFiles);
      onChange?.(limitedFiles);
    },
    [maxSizeMB, maxFiles, onChange, append, files]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // 重置 input，允许重复选择同一文件
      e.target.value = "";
    },
    [handleFileSelect]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    },
    [disabled, handleFileSelect]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
    onChange?.([]);
  }, [onChange]);

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
      onChange?.(newFiles);
    },
    [files, onChange]
  );

  return {
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
    clearFiles,
    removeFile,
  };
}


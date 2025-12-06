import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";

export interface ImagePreviewProps {
  /** 图片 URL 数组 */
  images: string[];
  /** 当前显示的图片索引 */
  currentIndex?: number;
  /** 是否打开预览 */
  open?: boolean;
  /** 关闭预览回调 */
  onClose?: () => void;
  /** 图片文件名数组（可选，用于显示文件名） */
  fileNames?: string[];
  /** 初始缩放比例（默认 100） */
  initialZoom?: number;
  /** 最小缩放比例（默认 50） */
  minZoom?: number;
  /** 最大缩放比例（默认 200） */
  maxZoom?: number;
}

export function ImagePreview({
  images,
  currentIndex: initialIndex = 0,
  open = false,
  onClose,
  fileNames,
  initialZoom = 100,
  minZoom = 50,
  maxZoom = 200,
}: ImagePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(initialZoom);

  // 当外部传入的 currentIndex 变化时更新内部状态
  useEffect(() => {
    if (open && initialIndex >= 0 && initialIndex < images.length) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex, images.length]);

  // 当对话框关闭时重置缩放
  useEffect(() => {
    if (!open) {
      setZoom(initialZoom);
    }
  }, [open, initialZoom]);

  const currentImage = images[currentIndex];
  const currentFileName = fileNames?.[currentIndex] || `image_${currentIndex + 1}`;
  const totalImages = images.length;

  // 导航到上一张图片
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  // 导航到下一张图片
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // 缩放控制
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 10, maxZoom));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 10, minZoom));
  }, [minZoom]);

  // 键盘快捷键支持
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-") {
        handleZoomOut();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handlePrev, handleNext, handleZoomIn, handleZoomOut, onClose]);

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent
        className="bg-white border border-[rgba(0,0,0,0.2)] border-solid content-stretch flex flex-col gap-[16px] items-start px-0 py-[12px] relative rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-[684px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden"
      >
        {/* Header: 关闭按钮、文件名、索引 */}
        <div className="h-[32px] relative shrink-0 w-full">
          <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-0 top-0 w-full">
            <div className="content-stretch flex items-center justify-between pl-[12px] pr-[28px] py-0 relative shrink-0 w-full">
              {/* 关闭按钮 */}
              <DialogClose asChild>
                <button
                  className="block cursor-pointer opacity-70 relative shrink-0 size-[16px] hover:opacity-100 transition-opacity"
                  aria-label="Close"
                >
                  <div className="absolute left-0 overflow-clip size-[16px] top-[0.5px]">
                    <div className="absolute bottom-0 flex items-center justify-center left-[22.3%] right-[22.3%] top-0">
                      <div className="flex-none h-[16px] rotate-180 w-[8.864px]">
                        <Icon
                          name="nav-next"
                          className="block size-full text-[#4a3c2a]"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              </DialogClose>

              {/* 文件名（居中） */}
              <div className="content-stretch flex flex-1 items-center justify-center min-h-px min-w-px relative shrink-0">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4c4c4c] text-[14px] text-center">
                  {currentFileName}
                </p>
              </div>

              {/* 当前索引 */}
              <div className="h-[17.5px] relative shrink-0 w-[27.148px]">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#101828] text-[12.25px] top-[-0.5px] w-[28px] whitespace-pre-wrap">
                  {currentIndex + 1} / {totalImages}
                </p>
              </div>
            </div>
            {/* 分隔线 */}
            <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" />
          </div>
        </div>

        {/* 主图片显示区域 */}
        <div className="h-[268.797px] overflow-clip relative shrink-0 w-full flex items-center justify-center bg-neutral-100">
          {currentImage && (
            <>
              {/* 图片 */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute bg-[rgba(255,255,255,0)] inset-0" />
                <img
                  alt={currentFileName}
                  className="max-w-none object-contain size-full"
                  src={currentImage}
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transition: "transform 0.2s ease-in-out",
                  }}
                />
              </div>

              {/* 左侧导航箭头 */}
              {images.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute bg-white border border-gray-200 border-solid content-stretch flex flex-col items-start left-[21px] pb-px pt-[11.5px] px-[11.5px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[44px] top-1/2 -translate-y-1/2 hover:bg-neutral-50 transition-colors cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <div className="h-[21px] overflow-clip relative shrink-0 w-full">
                    <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                      <Icon
                        name="nav-prev"
                        className="block size-full text-[#4a3c2a]"
                      />
                    </div>
                  </div>
                </button>
              )}

              {/* 右侧导航箭头 */}
              {images.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute bg-white border border-gray-200 border-solid content-stretch flex flex-col items-start left-[620px] pb-px pt-[11.5px] px-[11.5px] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[44px] top-1/2 -translate-y-1/2 hover:bg-neutral-50 transition-colors cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <div className="h-[21px] overflow-clip relative shrink-0 w-full">
                    <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                      <Icon
                        name="nav-next"
                        className="block size-full text-[#4a3c2a]"
                      />
                    </div>
                  </div>
                </button>
              )}

              {/* 缩放控制（右下角） */}
              <div className="absolute bg-[rgba(255,255,255,0.9)] border border-gray-200 border-solid content-stretch flex gap-[7px] h-[44px] items-center left-[510px] px-[15px] py-px rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[216px] w-[160px]">
                {/* 缩小按钮 */}
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className="relative rounded-[16777200px] shrink-0 size-[28px] flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex flex-col items-start pb-0 pt-[7px] px-[7px] relative size-[28px]">
                    <div className="h-[14px] overflow-clip relative shrink-0 w-full">
                      <Icon
                        name="nav-prev"
                        className="block size-full text-[#364153]"
                      />
                    </div>
                  </div>
                </button>

                {/* 缩放百分比显示 */}
                <div className="flex-1 h-[24.5px] min-h-px min-w-px relative rounded-[16777200px] shrink-0 flex items-center justify-center">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#364153] text-[12.25px] text-center">
                    {zoom}%
                  </p>
                </div>

                {/* 放大按钮 */}
                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= maxZoom}
                  className="relative rounded-[16777200px] shrink-0 size-[28px] flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex flex-col items-start pb-0 pt-[7px] px-[7px] relative size-[28px]">
                    <div className="h-[14px] overflow-clip relative shrink-0 w-full">
                      <Icon
                        name="nav-next"
                        className="block size-full text-[#364153]"
                      />
                    </div>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>

        {/* 底部缩略图轮播 */}
        {images.length > 1 && (
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            {/* 分隔线 */}
            <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" />
            {/* 缩略图列表 */}
            <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full overflow-x-auto pb-2">
              {images.map((image, index) => {
                const isSelected = index === currentIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "content-stretch flex flex-col items-start overflow-clip p-[2.2px] relative rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 size-[61.6px] transition-all",
                      isSelected
                        ? "bg-[rgba(255,255,255,0)] border-2 border-[#de6a07] border-solid"
                        : "border-2 border-[#d1d5dc] border-solid opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <div className="h-[57.2px] relative shrink-0 w-full">
                      <img
                        alt={`Thumbnail ${index + 1}`}
                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full rounded-[10px]"
                        src={image}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

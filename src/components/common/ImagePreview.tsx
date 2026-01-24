import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
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
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchStartDistanceRef = useRef<number | null>(null);
  const zoomStartRef = useRef(initialZoom);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageNaturalSizeRef = useRef({ width: 0, height: 0 });

  // 当外部传入的 currentIndex 变化时更新内部状态
  useEffect(() => {
    if (open && initialIndex >= 0 && initialIndex < images.length) {
      setCurrentIndex(initialIndex);
    }
  }, [open, initialIndex, images.length]);

  // 确保 currentIndex 在有效范围内（仅在 images 变化时检查）
  useEffect(() => {
    if (images.length > 0) {
      setCurrentIndex((prev) => {
        if (prev < 0 || prev >= images.length) {
          return 0;
        }
        return prev;
      });
    }
  }, [images.length]);

  // 当对话框关闭时重置缩放
  useEffect(() => {
    if (!open) {
      setZoom(initialZoom);
      setPan({ x: 0, y: 0 });
    }
  }, [open, initialZoom]);

  useEffect(() => {
    setZoom(initialZoom);
    setPan({ x: 0, y: 0 });
  }, [currentIndex, initialZoom]);


  // 使用 useMemo 稳定 currentImage，避免不必要的重新渲染
  const currentImage = useMemo(() => {
    return images[currentIndex] || images[0] || "";
  }, [images, currentIndex]);
  
  const currentFileName = fileNames?.[currentIndex] || fileNames?.[0] || `image_${currentIndex + 1}`;
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

  const clampPan = useCallback(
    (nextPan: { x: number; y: number }, nextZoom: number) => {
      const container = containerRef.current;
      const natural = imageNaturalSizeRef.current;
      if (!container || !natural.width || !natural.height) {
        return { x: 0, y: 0 };
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const imageAspect = natural.width / natural.height;
      const containerAspect = containerWidth / containerHeight;

      const baseWidth =
        containerAspect > imageAspect
          ? containerHeight * imageAspect
          : containerWidth;
      const baseHeight =
        containerAspect > imageAspect
          ? containerHeight
          : containerWidth / imageAspect;

      const scale = nextZoom / 100;
      const scaledWidth = baseWidth * scale;
      const scaledHeight = baseHeight * scale;

      const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);

      return {
        x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
        y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
      };
    },
    []
  );

  useEffect(() => {
    setPan((prev) => clampPan(prev, zoom));
  }, [zoom, clampPan]);

  useEffect(() => {
    const handleResize = () => {
      setPan((prev) => clampPan(prev, zoom));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom, clampPan]);

  const handleWheel = useCallback(
    (e: globalThis.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -10 : 10;
      setZoom((prev) => Math.min(Math.max(prev + delta, minZoom), maxZoom));
    },
    [minZoom, maxZoom]
  );

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;
    const wheelHandler = (event: WheelEvent) => handleWheel(event);
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      container.removeEventListener("wheel", wheelHandler);
    };
  }, [open, handleWheel]);

  const handleDragStart = useCallback((e: ReactMouseEvent) => {
    if (e.button !== 0 || zoom <= 100) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  }, [zoom, pan]);

  const handleDragMove = useCallback(
    (e: ReactMouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      const nextPan = {
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      };
      setPan(clampPan(nextPan, zoom));
    },
    [isDragging, clampPan, zoom]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const [first, second] = [touches[0], touches[1]];
    const dx = first.clientX - second.clientX;
    const dy = first.clientY - second.clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStartDistanceRef.current = getTouchDistance(e.touches);
        zoomStartRef.current = zoom;
        return;
      }

      if (e.touches.length === 1 && zoom > 100) {
        const touch = e.touches[0];
        setIsDragging(true);
        dragStartRef.current = { x: touch.clientX, y: touch.clientY };
        panStartRef.current = { ...pan };
      }
    },
    [zoom, pan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDistanceRef.current !== null) {
        e.preventDefault();
        const nextDistance = getTouchDistance(e.touches);
        if (!nextDistance) return;
        const scale = nextDistance / pinchStartDistanceRef.current;
        const nextZoom = Math.min(Math.max(zoomStartRef.current * scale, minZoom), maxZoom);
        setZoom(nextZoom);
        setPan((prev) => clampPan(prev, nextZoom));
        return;
      }

      if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - dragStartRef.current.x;
        const dy = touch.clientY - dragStartRef.current.y;
        const nextPan = {
          x: panStartRef.current.x + dx,
          y: panStartRef.current.y + dy,
        };
        setPan(clampPan(nextPan, zoom));
      }
    },
    [isDragging, clampPan, zoom, minZoom, maxZoom]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      pinchStartDistanceRef.current = null;
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  }, []);

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
        className="image-preview-dialog bg-white border border-[rgba(0,0,0,0.2)] border-solid flex flex-col gap-[16px] items-start px-0 py-[12px] rounded-none sm:rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] w-screen h-screen max-w-none max-h-none sm:w-[80vw]! sm:h-[80vh]! sm:max-w-[80vw]! sm:max-h-[80vh]! overflow-visible [&>button]:hidden left-0 top-0 translate-x-0 translate-y-0 sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]"
      >
        {/* 屏幕阅读器可访问的标题和描述（视觉上隐藏） */}
        <DialogTitle className="sr-only">
          Image Preview: {currentFileName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Viewing image {currentIndex + 1} of {totalImages}. Use arrow keys to navigate, + and - to zoom, and Escape to close.
        </DialogDescription>
        
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
                      <div className="flex-none h-[16px] rotate-180 w-[16px]">
                        <Icon
                          name="close-arrow"
                          className="block size-full text-[#4a3c2a]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -left-px overflow-clip size-px top-[13px]">
                    <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] top-[0.5px] sr-only">
                      Close
                    </p>
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
              <div className="h-[17.5px] relative shrink-0 w-[50px]">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#101828] text-[12.25px] top-[-0.5px] w-full whitespace-pre-wrap">
                  {currentIndex + 1} / {totalImages}
                </p>
              </div>
            </div>
            {/* 分隔线 */}
            <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" />
          </div>
        </div>

        {/* 主图片显示区域 */}
        <div
          ref={containerRef}
          className="flex-1 overflow-hidden relative shrink-0 w-full flex items-center justify-center bg-neutral-100 min-h-0 touch-none"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {currentImage ? (
            <>
              {/* 图片 */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  ref={imageRef}
                  alt={currentFileName}
                  className={cn(
                    "object-50%-50% object-contain select-none",
                    zoom > 100 ? "cursor-grab" : "cursor-default",
                    isDragging && "cursor-grabbing"
                  )}
                  src={currentImage}
                  loading="eager"
                  decoding="async"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
                    transition: isDragging ? "none" : "transform 0.2s ease-in-out",
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                  }}
                  draggable={false}
                  onLoad={(e) => {
                    imageNaturalSizeRef.current = {
                      width: e.currentTarget.naturalWidth,
                      height: e.currentTarget.naturalHeight,
                    };
                    setPan((prev) => clampPan(prev, zoom));
                  }}
                  onError={(e) => {
                    console.error("Failed to load image:", currentImage);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* 左侧导航箭头 */}
              {images.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute bg-white border border-gray-200 border-solid flex items-center justify-center left-[5%] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[44px] top-1/2 -translate-y-1/2 hover:bg-neutral-50 transition-colors cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <Icon
                    name="nav-prev"
                    className="block size-4 text-[#4a3c2a]"
                  />
                </button>
              )}

              {/* 右侧导航箭头 */}
              {images.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute bg-white border border-gray-200 border-solid flex items-center justify-center right-[5%] rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[44px] top-1/2 -translate-y-1/2 hover:bg-neutral-50 transition-colors cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <Icon
                    name="nav-next"
                    className="block size-4 text-[#4a3c2a]"
                  />
                </button>
              )}

              {/* 缩放控制（右下角，距离右下角10%） */}
              <div className="absolute bg-[rgba(255,255,255,0.9)] border border-gray-200 border-solid flex gap-[7px] h-[44px] items-center px-[15px] py-px rounded-[16777200px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] right-[5%] bottom-[10%]">
                {/* 缩小按钮 */}
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className="relative rounded-[16777200px] shrink-0 size-[28px] flex items-center justify-center hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <Icon
                    name="zoom-out"
                    className="block size-[14px] text-[#364153]"
                  />
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
                  <Icon
                    name="zoom-in"
                    className="block size-[14px] text-[#364153]"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-400 text-sm">No image to display</p>
            </div>
          )}
        </div>

        {/* 底部缩略图轮播 */}
        {images.length > 1 && (
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full h-[100px]">
            {/* 分隔线 */}
            <div className="bg-[rgba(0,0,0,0.1)] h-px shrink-0 w-full" />
            {/* 缩略图列表 */}
            <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full overflow-x-auto overflow-y-visible pb-2 py-2">
              {images.map((image, index) => {
                const isSelected = index === currentIndex;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "content-stretch flex flex-col items-start overflow-visible relative rounded-[14px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 transition-all size-[61.6px]",
                      isSelected
                        ? "bg-[rgba(255,255,255,0)] border-2 border-[#de6a07] border-solid p-[2.2px] scale-110 z-10"
                        : "border-2 border-[#d1d5dc] border-solid opacity-70 p-[2.2px] scale-100"
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <div className="relative shrink-0 w-full h-[57.2px]">
                      <img
                        alt={`Thumbnail ${index + 1}`}
                        className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full rounded-[10px]"
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

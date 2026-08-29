import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Icon, OrangeButton } from "@/components/common";
import { toast } from "sonner";
import type {
  InspectionPhotoClassification,
  InspectionPhotoOut,
} from "@/lib/api";
import {
  OBSERVATION_GROUPS,
  type InspectionAreaConfig,
} from "@/modules/groomer/photoHealthConfig";
import { InspectionTagGroup } from "./InspectionTagGroup";

type PanelSnap = "collapsed" | "default" | "expanded";
type SlideDirection = "next" | "previous";

export interface InspectionPhotoReviewProps {
  photos: InspectionPhotoOut[];
  activePhotoId: number | null;
  config: InspectionAreaConfig | null;
  open: boolean;
  onActivePhotoChange: (photoId: number) => void;
  onClose: () => void;
  onChange: (
    photoId: number,
    classification: InspectionPhotoClassification,
    hints: string[]
  ) => void;
  onAddPhoto: (files: File[]) => void;
  observationTags?: string[];
  onObservationTagsChange?: (tags: string[]) => void;
  onProceedToNotes?: () => void;
  initialPanelSnap?: PanelSnap;
  onPanelSnapChange?: (snap: PanelSnap) => void;
  petName?: string;
  petBreed?: string;
}

const SNAP_HEIGHTS: Record<PanelSnap, string> = {
  collapsed: "96px",
  default: "38vh",
  expanded: "72vh",
};

export function InspectionPhotoReview({
  photos,
  activePhotoId,
  config,
  open,
  onActivePhotoChange,
  onClose,
  onChange,
  onAddPhoto,
  observationTags = [],
  onObservationTagsChange,
  onProceedToNotes,
  initialPanelSnap = "default",
  onPanelSnapChange,
  petName = "Current pet",
  petBreed,
}: InspectionPhotoReviewProps) {
  const activeIndex = Math.max(
    0,
    photos.findIndex((photo) => photo.id === activePhotoId)
  );
  const photo = photos[activeIndex] ?? null;
  const isPosture = photo?.area === "posture";
  const [classification, setClassification] =
    useState<InspectionPhotoClassification>("normal");
  const [hints, setHints] = useState<string[]>([]);
  const [panelSnap, setPanelSnap] = useState<PanelSnap>(initialPanelSnap);
  const [slideDirection, setSlideDirection] = useState<SlideDirection | null>(
    null
  );
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 0,
    height: 0,
  });
  const dragStart = useRef<{
    y: number;
    height: number;
    snap: PanelSnap;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFilePicker = (input: HTMLInputElement | null) => {
    if (!input || input.disabled) return;
    input.click();
  };
  const viewportRef = useRef<HTMLDivElement>(null);
  const imagePointers = useRef(new Map<number, { x: number; y: number }>());
  const imageGesture = useRef<{
    x: number;
    y: number;
    positionX: number;
    positionY: number;
    distance?: number;
    scale: number;
  } | null>(null);
  const mobilePanelHeight = dragHeight ?? SNAP_HEIGHTS[panelSnap];
  const mobilePanelHeightCss =
    typeof mobilePanelHeight === "number"
      ? `${mobilePanelHeight}px`
      : mobilePanelHeight;

  useEffect(() => {
    setClassification(photo?.classification ?? "normal");
    setHints(photo?.finding_hints ?? []);
  }, [photo]);

  useEffect(() => {
    if (!photo || photo.confirmed) return;
    onChange(
      photo.id,
      photo.classification ?? "normal",
      photo.finding_hints ?? []
    );
  }, [onChange, photo]);

  useEffect(() => setPanelSnap(initialPanelSnap), [initialPanelSnap, open]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setImageNaturalSize({ width: 0, height: 0 });
  }, [photo?.id]);

  useEffect(() => {
    const updateViewportSize = () => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      setViewportSize({ width: rect.width, height: rect.height });
    };
    updateViewportSize();
    const observer =
      typeof ResizeObserver !== "undefined" && viewportRef.current
        ? new ResizeObserver(() => updateViewportSize())
        : null;
    if (observer && viewportRef.current) observer.observe(viewportRef.current);
    window.addEventListener("resize", updateViewportSize);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateViewportSize);
    };
  }, [mobilePanelHeight, photo?.id]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const aiSelectedCount = useMemo(
    () =>
      photos.filter(
        (item) => item.area === photo?.area && item.classification === "ai_scan"
      ).length,
    [photo?.area, photos]
  );
  const aiLimitReached = classification !== "ai_scan" && aiSelectedCount >= 2;
  const fitScale =
    viewportSize.width > 0 &&
    viewportSize.height > 0 &&
    imageNaturalSize.width > 0 &&
    imageNaturalSize.height > 0
      ? Math.max(
          viewportSize.width / imageNaturalSize.width,
          viewportSize.height / imageNaturalSize.height
        )
      : 1;
  const containScale =
    viewportSize.width > 0 &&
    viewportSize.height > 0 &&
    imageNaturalSize.width > 0 &&
    imageNaturalSize.height > 0
      ? Math.min(
          viewportSize.width / imageNaturalSize.width,
          viewportSize.height / imageNaturalSize.height
        )
      : 1;
  const scaleFloor =
    fitScale > 0 ? Math.max(0.5, containScale / fitScale) : 0.5;
  const dragThreshold = 1.08;
  const previewScale = fitScale * scale;
  const getPanLimits = (scaleValue = scale) => {
    const nextRenderedWidth =
      imageNaturalSize.width > 0
        ? imageNaturalSize.width * fitScale * scaleValue
        : 0;
    const nextRenderedHeight =
      imageNaturalSize.height > 0
        ? imageNaturalSize.height * fitScale * scaleValue
        : 0;
    const overflowX = Math.max(0, (nextRenderedWidth - viewportSize.width) / 2);
    const overflowY = Math.max(
      0,
      (nextRenderedHeight - viewportSize.height) / 2
    );
    const relaxedLimit = 24;
    return {
      x:
        scaleValue >= dragThreshold
          ? overflowX
          : Math.min(relaxedLimit, overflowX || relaxedLimit),
      y:
        scaleValue >= dragThreshold
          ? overflowY
          : Math.min(relaxedLimit, overflowY || relaxedLimit),
    };
  };
  const clampPosition = (
    nextPosition: { x: number; y: number },
    scaleValue = scale
  ) => {
    const limits = getPanLimits(scaleValue);
    return {
      x: Math.max(-limits.x, Math.min(limits.x, nextPosition.x)),
      y: Math.max(-limits.y, Math.min(limits.y, nextPosition.y)),
    };
  };
  const previewStyle =
    imageNaturalSize.width > 0 && imageNaturalSize.height > 0
      ? {
          width: `${imageNaturalSize.width}px`,
          height: `${imageNaturalSize.height}px`,
          maxWidth: "none",
          maxHeight: "none",
          aspectRatio: `${imageNaturalSize.width} / ${imageNaturalSize.height}`,
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${previewScale})`,
          transformOrigin: "center center",
        }
      : {
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "center center",
        };

  useEffect(() => {
    setPosition((current) => clampPosition(current));
  }, [
    previewScale,
    viewportSize.width,
    viewportSize.height,
    imageNaturalSize.width,
    imageNaturalSize.height,
    scale,
  ]);

  if (!open || !photo || !config) return null;

  const apply = (
    nextClassification: InspectionPhotoClassification,
    nextHints = hints
  ) => {
    setClassification(nextClassification);
    setHints(nextHints);
    onChange(
      photo.id,
      nextClassification,
      nextClassification === "normal" ? [] : nextHints
    );
  };
  const selectHints = (nextHints: string[]) => {
    if (aiLimitReached && nextHints.length > hints.length) {
      toast("You can select up to 2 photos for AI Scan.");
      return;
    }
    setHints(nextHints);
    const nextClassification =
      nextHints.length > 0 ? "ai_scan" : classification;
    setClassification(nextClassification);
    onChange(
      photo.id,
      nextClassification,
      nextClassification === "normal" ? [] : nextHints
    );
  };
  const changePhoto = (nextPhotoId: number) => {
    const nextIndex = photos.findIndex((item) => item.id === nextPhotoId);
    if (nextIndex < 0 || nextIndex === activeIndex) return;
    const forwardDistance =
      (nextIndex - activeIndex + photos.length) % photos.length;
    setSlideDirection(
      forwardDistance <= photos.length / 2 ? "next" : "previous"
    );
    onActivePhotoChange(nextPhotoId);
  };
  const move = (offset: number) => {
    const next = photos[(activeIndex + offset + photos.length) % photos.length];
    if (next) changePhoto(next.id);
  };
  const setSnap = (snap: PanelSnap) => {
    setPanelSnap(snap);
    onPanelSnapChange?.(snap);
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragStart.current = {
      y: event.clientY,
      height:
        event.currentTarget.parentElement?.getBoundingClientRect().height ?? 0,
      snap: panelSnap,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) return;
    setDragHeight(
      Math.max(
        96,
        Math.min(
          window.innerHeight * 0.72,
          start.height + start.y - event.clientY
        )
      )
    );
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    dragStart.current = null;
    setDragHeight(null);
    if (!start) return;
    const delta = event.clientY - start.y;
    if (Math.abs(delta) < 28) return;
    const order: PanelSnap[] = ["collapsed", "default", "expanded"];
    const index = order.indexOf(start.snap);
    setSnap(
      order[
        Math.max(0, Math.min(order.length - 1, index + (delta > 0 ? -1 : 1)))
      ]
    );
  };
  const imagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    imagePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const points = [...imagePointers.current.values()];
    imageGesture.current = {
      x: event.clientX,
      y: event.clientY,
      positionX: position.x,
      positionY: position.y,
      distance:
        points.length === 2
          ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
          : undefined,
      scale,
    };
  };
  const imagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imagePointers.current.has(event.pointerId)) return;
    imagePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const gesture = imageGesture.current;
    const points = [...imagePointers.current.values()];
    if (!gesture) return;
    if (points.length === 2 && gesture.distance) {
      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
      const nextScale = Math.max(
        scaleFloor,
        Math.min(4, (gesture.scale * distance) / gesture.distance)
      );
      const midpoint = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2,
      };
      const nextPreviewScale = fitScale * nextScale;
      const currentPreviewScale = fitScale * gesture.scale;
      const centerX = viewportSize.width / 2;
      const centerY = viewportSize.height / 2;
      const focalX =
        currentPreviewScale > 0
          ? (midpoint.x - centerX - gesture.positionX) / currentPreviewScale
          : 0;
      const focalY =
        currentPreviewScale > 0
          ? (midpoint.y - centerY - gesture.positionY) / currentPreviewScale
          : 0;
      setScale(nextScale);
      setPosition(
        clampPosition(
          {
            x: midpoint.x - centerX - focalX * nextPreviewScale,
            y: midpoint.y - centerY - focalY * nextPreviewScale,
          },
          nextScale
        )
      );
    } else if (points.length === 1) {
      setPosition(
        clampPosition({
          x: gesture.positionX + event.clientX - gesture.x,
          y: gesture.positionY + event.clientY - gesture.y,
        })
      );
    }
  };
  const imagePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = imageGesture.current;
    imagePointers.current.delete(event.pointerId);
    if (gesture && scale === 1 && Math.abs(event.clientX - gesture.x) > 48)
      move(event.clientX < gesture.x ? 1 : -1);
    if (imagePointers.current.size === 0) imageGesture.current = null;
  };

  const title = `Any ${config.label.replace(/ photo$/i, "").toLowerCase()} issue?`;
  const panelTitle = isPosture
    ? `Almost done! How was ${petName} today?`
    : title;
  const panelSubtitle = isPosture
    ? "Tap unusual behaviours to help generate AI report."
    : `${petName}${petBreed ? ` · ${petBreed}` : ""} · ${config.label.replace(/ photo$/i, "")}`;
  const previewLabel = `${activeIndex + 1}. ${config.label.replace(/ photo$/i, "")}`;
  const showPreviewLabel = [
    "left_ear",
    "right_ear",
    "left_eye",
    "right_eye",
  ].includes(photo.area);
  const postureNextLabel =
    observationTags.length > 0 ? "Next - Summary & notes" : "Next - Add notes";
  const controls = (
    <>
      {!isPosture ? (
        <InspectionTagGroup
          label={`${config.label.replace(/ photo$/i, "")} issue - optional for AI hint`}
          tags={config.hints}
          selected={hints}
          onChange={selectHints}
        />
      ) : onObservationTagsChange ? (
        <div className="space-y-4">
          {OBSERVATION_GROUPS.map((group) => (
            <InspectionTagGroup
              key={group.label}
              label={group.label}
              tags={group.tags}
              selected={observationTags}
              onChange={onObservationTagsChange}
            />
          ))}
        </div>
      ) : null}
      {!isPosture ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            aria-pressed={classification === "normal"}
            onClick={() => apply("normal", [])}
            className={`min-h-[94px] cursor-pointer rounded-[22px] border-2 px-3 font-comfortaa transition-colors ${classification === "normal" ? "border-[#C97A1B] text-[#DE8A19]" : "border-[#5D5D64] text-white hover:bg-white/10 active:bg-white/20 md:text-[#4F5060]"}`}
          >
            <span className="block text-[15px] font-bold leading-[18px]">
              Normal
            </span>
            <span className="mt-1 block text-[11px] leading-[14px]">
              Archives photo
            </span>
          </button>
          <button
            type="button"
            aria-pressed={classification === "ai_scan"}
            onClick={() => {
              if (aiLimitReached) {
                toast("You can select up to 2 photos for AI Scan.");
                return;
              }
              apply("ai_scan");
            }}
            className={`min-h-[94px] cursor-pointer rounded-[22px] border-2 px-3 font-comfortaa transition-colors ${classification === "ai_scan" ? "border-[#C97A1B] text-[#DE8A19]" : "border-[#5D5D64] text-white hover:bg-white/10 active:bg-white/20 md:text-[#4F5060]"}`}
          >
            <span className="block text-[15px] font-bold leading-[18px]">
              AI Scan
            </span>
            <span className="mt-1 block text-[11px] leading-[14px]">
              Generates report
            </span>
          </button>
        </div>
      ) : null}
      <div
        className={`mt-5 justify-end gap-3 ${isPosture ? "flex" : "hidden md:flex"}`}
      >
        {isPosture ? (
          <OrangeButton
            type="button"
            fullWidth
            textSize={14}
            onClick={() => onProceedToNotes?.()}
            className="bg-gradient-to-b from-[#E67E22] to-[#F39C12] font-bold hover:from-[#D8751F] hover:to-[#E89010]"
          >
            {postureNextLabel}
          </OrangeButton>
        ) : null}
        <OrangeButton
          type="button"
          variant="outline"
          onClick={onClose}
          className="hidden md:block"
        >
          Cancel
        </OrangeButton>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
          multiple={!isPosture}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            if (files.length > 0) onAddPhoto(files);
            event.target.value = "";
          }}
        />
        <OrangeButton
          type="button"
          onClick={() => openFilePicker(fileInputRef.current)}
          className="hidden md:block"
        >
          Add photo
        </OrangeButton>
      </div>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label={`${config.label} review`}
    >
      <div className="relative mx-auto h-full w-full overflow-hidden bg-black md:my-6 md:flex md:h-[calc(100vh-3rem)] md:max-h-[980px] md:max-w-[760px] md:flex-col md:rounded-[28px] md:bg-white md:text-[#4A3C2A] md:shadow-2xl">
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 md:static md:border-b md:border-[#E3E0DD]">
          <span className="hidden size-10 md:block" />
          <h2 className="hidden font-comfortaa text-xl md:block">
            {config.label} review
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo review"
            className="absolute right-[18px] top-[42px] flex aspect-square h-[38.5px] w-[38.5px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[rgba(0,0,0,0.5)] p-0 text-[28px] leading-none text-white shadow-[0px_10px_24px_rgba(0,0,0,0.18)] transition hover:bg-[rgba(0,0,0,0.62)] md:static md:ml-auto md:size-10 md:bg-transparent md:text-[#666674] md:text-2xl md:shadow-none"
          >
            ×
          </button>
        </header>

        <div className="relative h-full md:min-h-0 md:flex-1 md:overflow-y-auto md:p-8">
          <div
            ref={viewportRef}
            className={`relative z-0 h-[calc(100dvh-var(--review-panel-height))] min-h-[120px] w-full touch-none overflow-hidden bg-[#EFEFEF] md:h-[360px] md:w-full ${dragHeight === null ? "transition-[height] duration-200 ease-out" : "transition-none"}`}
            style={
              {
                ["--review-panel-height" as string]: mobilePanelHeightCss,
              } as CSSProperties
            }
            onPointerDown={imagePointerDown}
            onPointerMove={imagePointerMove}
            onPointerUp={imagePointerUp}
            onPointerCancel={imagePointerUp}
            onDoubleClick={() => {
              setScale((current) => (current === 1 ? 2 : 1));
              if (scale !== 1) setPosition({ x: 0, y: 0 });
            }}
            onWheel={(event) => {
              event.preventDefault();
              setScale((current) =>
                Math.max(
                  0.5,
                  Math.min(4, current + (event.deltaY < 0 ? 0.25 : -0.25))
                )
              );
            }}
          >
            <div className="relative h-full min-h-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                {showPreviewLabel ? (
                  <div className="absolute bottom-1 left-4 z-20 flex items-center gap-2 rounded-full bg-[rgba(0,0,0,0.55)] px-4 py-2 font-comfortaa text-[12px] font-bold leading-[18px] text-white shadow-[0px_4px_12px_rgba(0,0,0,0.16)]">
                    <span className="h-2 w-2 rounded-[24338400px] bg-white opacity-[0.5074]" />
                    {previewLabel}
                  </div>
                ) : null}
                <div
                  key={photo.id}
                  className={`absolute inset-0 ${photos.length > 1 && slideDirection ? `review-photo-slide-in-${slideDirection}` : ""}`}
                >
                  <img
                    src={photo.url}
                    alt={photo.original_filename || config.label}
                    draggable={false}
                    className="absolute left-1/2 top-1/2 select-none will-change-transform"
                    style={previewStyle as CSSProperties}
                    onLoad={(event) => {
                      setImageNaturalSize({
                        width: event.currentTarget.naturalWidth,
                        height: event.currentTarget.naturalHeight,
                      });
                    }}
                  />
                </div>
              </div>
              {photos.length > 1 ? (
                <div className="pointer-events-none absolute inset-0 z-[70]">
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() => move(-1)}
                    className="pointer-events-auto absolute left-[5%] top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[16777200px] border border-solid border-gray-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors hover:bg-neutral-50"
                  >
                    <Icon
                      name="nav-prev"
                      className="block size-4 text-[#4a3c2a]"
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => move(1)}
                    className="pointer-events-auto absolute right-[5%] top-1/2 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[16777200px] border border-solid border-gray-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors hover:bg-neutral-50"
                  >
                    <Icon
                      name="nav-next"
                      className="block size-4 text-[#4a3c2a]"
                    />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {photos.map((item, index) => (
                      <button
                        type="button"
                        aria-label={`Go to photo ${index + 1}`}
                        aria-current={
                          index === activeIndex ? "true" : undefined
                        }
                        onClick={() => changePhoto(item.id)}
                        key={item.id}
                        className={`pointer-events-auto h-1.5 cursor-pointer rounded-full transition-[width,background-color] ${index === activeIndex ? "w-7 bg-white" : "w-3 bg-white/45 hover:bg-white/70"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-4 rounded-full bg-white/90 px-5 py-2 text-[#343443] shadow md:flex">
              <button
                type="button"
                aria-label="Zoom out"
                className="cursor-pointer"
                onClick={() =>
                  setScale((current) => Math.max(scaleFloor, current - 0.25))
                }
              >
                −
              </button>
              <span>{Math.round(scale * 100)}%</span>
              <button
                type="button"
                aria-label="Zoom in"
                className="cursor-pointer"
                onClick={() =>
                  setScale((current) => Math.min(4, current + 0.25))
                }
              >
                +
              </button>
            </div>
          </div>

          <section className="hidden pt-6 md:block">
            <h3 className="font-comfortaa text-2xl">{panelTitle}</h3>
            <p className="mb-6 mt-1 font-comfortaa text-sm text-[#666674]">
              {panelSubtitle}
            </p>
            {controls}
          </section>
        </div>

        <section
          className={`absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] bg-[#121212] text-white shadow-[0_-8px_32px_rgba(0,0,0,.35)] md:hidden ${dragHeight === null ? "transition-[height] duration-200 ease-out" : "transition-none"}`}
          style={{ height: mobilePanelHeight }}
        >
          <div
            className="touch-none select-none cursor-grab px-5 pb-4 pt-3 active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/35" />
            <h3 className="font-comfortaa text-[26px] leading-[30px]">
              {panelTitle}
            </h3>
            <p className="mt-1 truncate font-comfortaa text-[14px] leading-[20px] text-white/65">
              {panelSubtitle}
            </p>
          </div>
          {panelSnap !== "collapsed" ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
              {controls}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Icon, OrangeButton } from "@/components/common";
import { toast } from "sonner";
import type { InspectionPhotoClassification, InspectionPhotoOut } from "@/lib/api";
import { OBSERVATION_GROUPS, type InspectionAreaConfig } from "@/modules/groomer/photoHealthConfig";
import { InspectionTagGroup } from "./InspectionTagGroup";

type PanelSnap = "collapsed" | "default" | "expanded";

export interface InspectionPhotoReviewProps {
  photos: InspectionPhotoOut[];
  activePhotoId: number | null;
  config: InspectionAreaConfig | null;
  open: boolean;
  onActivePhotoChange: (photoId: number) => void;
  onClose: () => void;
  onChange: (photoId: number, classification: InspectionPhotoClassification, hints: string[]) => void;
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
  const activeIndex = Math.max(0, photos.findIndex((photo) => photo.id === activePhotoId));
  const photo = photos[activeIndex] ?? null;
  const isPosture = photo?.area === "posture";
  const [classification, setClassification] = useState<InspectionPhotoClassification>("normal");
  const [hints, setHints] = useState<string[]>([]);
  const [panelSnap, setPanelSnap] = useState<PanelSnap>(initialPanelSnap);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const dragStart = useRef<{ y: number; height: number; snap: PanelSnap } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagePointers = useRef(new Map<number, { x: number; y: number }>());
  const imageGesture = useRef<{ x: number; y: number; positionX: number; positionY: number; distance?: number; scale: number } | null>(null);

  useEffect(() => {
    setClassification(isPosture ? "ai_scan" : photo?.classification ?? "normal");
    setHints(photo?.finding_hints ?? []);
  }, [isPosture, photo]);

  useEffect(() => {
    if (!photo || photo.confirmed) return;
    onChange(photo.id, isPosture ? "ai_scan" : photo.classification ?? "normal", photo.finding_hints ?? []);
  }, [isPosture, onChange, photo]);

  useEffect(() => setPanelSnap(initialPanelSnap), [initialPanelSnap, open]);

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [photo?.id]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const aiSelectedCount = useMemo(
    () => photos.filter((item) => item.classification === "ai_scan").length,
    [photos],
  );
  const aiLimitReached = classification !== "ai_scan" && aiSelectedCount >= 2;

  if (!open || !photo || !config) return null;

  const apply = (nextClassification: InspectionPhotoClassification, nextHints = hints) => {
    setClassification(nextClassification);
    setHints(nextHints);
    onChange(photo.id, isPosture ? "ai_scan" : nextClassification, isPosture || nextClassification === "normal" ? [] : nextHints);
  };
  const selectHints = (nextHints: string[]) => {
    if (aiLimitReached && nextHints.length > hints.length) {
      toast("You can select up to 2 photos for AI Scan.");
      return;
    }
    setHints(nextHints);
    const nextClassification = nextHints.length > 0 ? "ai_scan" : classification;
    setClassification(nextClassification);
    onChange(photo.id, nextClassification, nextClassification === "normal" ? [] : nextHints);
  };
  const move = (offset: number) => {
    const next = photos[(activeIndex + offset + photos.length) % photos.length];
    if (next) onActivePhotoChange(next.id);
  };
  const setSnap = (snap: PanelSnap) => {
    setPanelSnap(snap);
    onPanelSnapChange?.(snap);
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragStart.current = { y: event.clientY, height: event.currentTarget.parentElement?.getBoundingClientRect().height ?? 0, snap: panelSnap };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) return;
    setDragHeight(Math.max(96, Math.min(window.innerHeight * 0.72, start.height + start.y - event.clientY)));
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
    setSnap(order[Math.max(0, Math.min(order.length - 1, index + (delta > 0 ? -1 : 1)))]);
  };
  const imagePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    imagePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...imagePointers.current.values()];
    imageGesture.current = {
      x: event.clientX,
      y: event.clientY,
      positionX: position.x,
      positionY: position.y,
      distance: points.length === 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : undefined,
      scale,
    };
  };
  const imagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imagePointers.current.has(event.pointerId)) return;
    imagePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const gesture = imageGesture.current;
    const points = [...imagePointers.current.values()];
    if (!gesture) return;
    if (points.length === 2 && gesture.distance) {
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      setScale(Math.max(1, Math.min(4, gesture.scale * distance / gesture.distance)));
    } else if (points.length === 1 && scale > 1) {
      setPosition({ x: gesture.positionX + event.clientX - gesture.x, y: gesture.positionY + event.clientY - gesture.y });
    }
  };
  const imagePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = imageGesture.current;
    imagePointers.current.delete(event.pointerId);
    if (gesture && scale === 1 && Math.abs(event.clientX - gesture.x) > 48) move(event.clientX < gesture.x ? 1 : -1);
    if (imagePointers.current.size === 0) imageGesture.current = null;
  };

  const title = `Any ${config.label.replace(/ photo$/i, "").toLowerCase()} issue?`;
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
            <InspectionTagGroup key={group.label} label={group.label} tags={group.tags} selected={observationTags} onChange={onObservationTagsChange} />
          ))}
        </div>
      ) : null}
      {!isPosture ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={classification === "normal"}
            onClick={() => apply("normal", [])}
            className={`min-h-16 cursor-pointer rounded-2xl border-2 px-3 font-comfortaa transition-colors ${classification === "normal" ? "border-[#C97A1B] text-[#DE8A19]" : "border-[#5D5D64] text-white hover:bg-white/10 active:bg-white/20 md:text-[#4F5060]"}`}
          >
            <span className="block text-lg">Normal</span><span className="block text-[11px]">Archives photo</span>
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
            className={`min-h-16 cursor-pointer rounded-2xl border-2 px-3 font-comfortaa transition-colors ${classification === "ai_scan" ? "border-[#C97A1B] text-[#DE8A19]" : "border-[#5D5D64] text-white hover:bg-white/10 active:bg-white/20 md:text-[#4F5060]"}`}
          >
            <span className="block text-lg">AI Scan</span><span className="block text-[11px]">Generates report</span>
          </button>
        </div>
      ) : null}
      <div className={`mt-5 justify-end gap-3 ${isPosture ? "flex" : "hidden md:flex"}`}>
        {isPosture ? (
          <OrangeButton type="button" variant="outline" onClick={() => onProceedToNotes?.()}>Add Notes &amp; Generate Report</OrangeButton>
        ) : null}
        <OrangeButton type="button" variant="outline" onClick={onClose} className="hidden md:block">Cancel</OrangeButton>
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
        <OrangeButton type="button" onClick={() => fileInputRef.current?.click()} className="hidden md:block">Add photo</OrangeButton>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[120] bg-black/75" role="dialog" aria-modal="true" aria-label={`${config.label} review`}>
      <div className="relative mx-auto h-full w-full overflow-hidden bg-black md:my-6 md:flex md:h-[calc(100vh-3rem)] md:max-h-[980px] md:max-w-[760px] md:flex-col md:rounded-[28px] md:bg-white md:text-[#4A3C2A] md:shadow-2xl">
        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-4 md:static md:border-b md:border-[#E3E0DD]">
          <span className="hidden size-10 md:block" />
          <h2 className="hidden font-comfortaa text-xl md:block">{config.label} review</h2>
          <button type="button" onClick={onClose} aria-label="Close photo review" className="ml-auto size-10 cursor-pointer rounded-full bg-black/45 text-2xl text-white transition hover:bg-black/65 md:bg-transparent md:text-[#666674]">×</button>
        </header>

        <div className="relative h-full md:min-h-0 md:flex-1 md:overflow-y-auto md:p-8">
          <div
            className="relative h-full touch-none overflow-hidden bg-[#EFEFEF] md:h-[360px]"
            onPointerDown={imagePointerDown}
            onPointerMove={imagePointerMove}
            onPointerUp={imagePointerUp}
            onPointerCancel={imagePointerUp}
            onDoubleClick={() => {
              setScale((current) => current === 1 ? 2 : 1);
              if (scale !== 1) setPosition({ x: 0, y: 0 });
            }}
            onWheel={(event) => {
              event.preventDefault();
              setScale((current) => Math.max(1, Math.min(4, current + (event.deltaY < 0 ? 0.25 : -0.25))));
            }}
          >
            <img
              src={photo.url}
              alt={photo.original_filename || config.label}
              draggable={false}
              className="h-full w-full select-none object-contain transition-transform duration-75"
              style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
            />
            {photos.length > 1 ? (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => move(-1)} className="absolute left-[5%] top-1/2 z-10 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[16777200px] border border-solid border-gray-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors hover:bg-neutral-50">
                  <Icon name="nav-prev" className="block size-4 text-[#4a3c2a]" />
                </button>
                <button type="button" aria-label="Next photo" onClick={() => move(1)} className="absolute right-[5%] top-1/2 z-10 flex size-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[16777200px] border border-solid border-gray-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] transition-colors hover:bg-neutral-50">
                  <Icon name="nav-next" className="block size-4 text-[#4a3c2a]" />
                </button>
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {photos.map((item, index) => <span key={item.id} className={`h-1.5 rounded-full ${index === activeIndex ? "w-7 bg-white" : "w-3 bg-white/45"}`} />)}
                </div>
              </>
            ) : null}
            <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-4 rounded-full bg-white/90 px-5 py-2 text-[#343443] shadow md:flex">
              <button type="button" aria-label="Zoom out" className="cursor-pointer" onClick={() => setScale((current) => Math.max(1, current - 0.25))}>−</button>
              <span>{Math.round(scale * 100)}%</span>
              <button type="button" aria-label="Zoom in" className="cursor-pointer" onClick={() => setScale((current) => Math.min(4, current + 0.25))}>+</button>
            </div>
          </div>

          <section className="hidden pt-6 md:block">
            <h3 className="font-comfortaa text-2xl">{title}</h3>
            <p className="mb-6 mt-1 font-comfortaa text-sm text-[#666674]">{petName}{petBreed ? ` · ${petBreed}` : ""} · {config.label.replace(/ photo$/i, "")}</p>
            {controls}
          </section>
        </div>

        <section
          className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[24px] bg-[#121212] text-white shadow-[0_-8px_32px_rgba(0,0,0,.35)] transition-[height] duration-200 md:hidden"
          style={{ height: dragHeight ?? SNAP_HEIGHTS[panelSnap] }}
        >
          <div className="touch-none select-none cursor-grab px-4 pb-3 pt-2 active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-white/35" />
            <h3 className="truncate font-comfortaa text-xl">{title}</h3>
            <p className="truncate font-comfortaa text-xs text-white/65">{petName}{petBreed ? ` · ${petBreed}` : ""} · {config.label.replace(/ photo$/i, "")}</p>
          </div>
          {panelSnap !== "collapsed" ? <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">{controls}</div> : null}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useIsMobile } from "@/components/ui/use-mobile";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";
import { PerformanceRadarChart } from "@/modules/groomer/components/PerformanceRadarChart";
import { ReportReviewModal } from "@/modules/groomer/components/ReportReviewModal";
import { UpdateTechnicalSkillModal } from "@/modules/groomer/components/UpdateTechnicalSkillModal";
import {
  getGroomerPerformancePresentation,
} from "@/modules/groomer/utils/performance";
import { useGroomerPerformance } from "@/modules/groomer/hooks/useGroomerPerformance";
import { useNavigate } from "react-router-dom";
import { reportGroomerReview, replyGroomerReview, submitGroomerTechnicalSkillUpdate, uploadGroomerApplyImage } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

const REVIEW_AVATAR_URL = "https://www.figma.com/api/mcp/asset/2d6c06cd-b66a-4365-9ebb-501b695cd90d";

type ScoreCard = {
  title: string;
  subtitle: string;
  score: number;
  maxScore: number;
  scoreColor: string;
  iconToneClassName: string;
  cardClassName?: string;
  icon: ReactNode;
  body: ReactNode;
};

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HttpError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

const COLLAPSE_DURATION_MS = 300;

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="relative flex size-[140px] items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#F08A12 ${Math.max(0, Math.min(score, 100)) * 3.6}deg,#E7DED8 0deg)` }}
    >
      <div className="flex size-[116px] flex-col items-center justify-center rounded-full bg-[#633479]">
        <span className="font-comfortaa text-[32px] font-bold leading-8 text-white">{Math.round(score)}</span>
        <span className="mt-1 font-comfortaa text-[14px] font-medium leading-[21px] text-[rgba(255,255,255,0.7)]">/100</span>
      </div>
    </div>
  );
}

function PerformanceBadge({ label, level }: { label: string; level: string }) {
  const presentation = getGroomerPerformancePresentation(level, label, 0);
  const tagText =
    level === "level_a"
      ? "Level A (85-100)"
      : level === "level_b"
        ? "Level B (70-84)"
        : level === "level_c"
          ? "Level C (0-69)"
          : presentation.badgeText;

  return (
    <div className={`inline-flex h-[26px] items-center ${presentation.badgeClassName}`}>
      <span className={presentation.badgeTextClassName}>{tagText}</span>
    </div>
  );
}

function PerformanceTierScale() {
  const secondaryText = "75/100 Silver groomer";
  const baseText = "70/100 Premium groomer";

  return (
    <div className="mt-2 flex w-[147px] flex-col gap-2">
      <div className="h-[21px] rounded-full bg-[linear-gradient(180deg,rgba(238,236,236,0.4)_0%,rgba(237,236,236,0.4)_16.827%,rgba(223,222,222,0.4)_50%,rgba(164,164,164,0.4)_88.462%,rgba(184,182,182,0.4)_100%)] px-2 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
        <div className="flex h-full items-center gap-1 text-[#633479]">
          <Icon name="star-3" className="size-[10px]" aria-hidden="true" />
          <span className="font-comfortaa text-[10px] font-bold leading-[14px]">{secondaryText}</span>
        </div>
      </div>
      <div className="h-[21px] rounded-full bg-[linear-gradient(180deg,rgba(139,99,87,0.6)_0%,rgba(74,44,85,0.6)_100%)] px-[9px] shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
        <div className="flex h-full items-center">
          <span className="font-comfortaa text-[10px] font-bold leading-[14px] text-[rgba(255,255,255,0.4)]">{baseText}</span>
        </div>
      </div>
    </div>
  );
}

function PerformanceRadarCard({
  isOpen,
  onToggle,
  radarMetrics,
}: {
  isOpen: boolean;
  onToggle: () => void;
  radarMetrics: Array<{ label: string; value: number; color: string }>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [panelHeight, setPanelHeight] = useState<number | "auto">(isOpen ? "auto" : 0);

  useEffect(() => {
    const panelElement = panelRef.current;

    if (!panelElement) {
      return;
    }

    const clearPendingAnimation = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    clearPendingAnimation();

    const nextHeight = panelElement.scrollHeight;

    if (isOpen) {
      setPanelHeight(0);
      animationFrameRef.current = window.requestAnimationFrame(() => {
        setPanelHeight(nextHeight);
        timeoutRef.current = window.setTimeout(() => {
          setPanelHeight("auto");
        }, COLLAPSE_DURATION_MS);
      });
    } else {
      const startingHeight = panelElement.scrollHeight;
      setPanelHeight(startingHeight);
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = window.requestAnimationFrame(() => {
          setPanelHeight(0);
        });
      });
    }

    return () => {
      clearPendingAnimation();
    };
  }, [isOpen]);

  return (
    <article className="rounded-[16px] bg-white p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] lg:h-full lg:p-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isOpen}
        aria-controls="performance-radar-panel"
        aria-label={isOpen ? "Collapse performance radar" : "Expand performance radar"}
      >
        <div className="min-w-0 flex-1">
          <p className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Performance Radar</p>
          {isOpen ? (
            <p className="mt-[7px] font-comfortaa text-[13px] font-normal leading-[19.5px] text-[#8B6357]">
              Your strengths across 5 key areas
            </p>
          ) : null}
        </div>
        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#8B6357]">
          <Icon
            name="chevron-down"
            className={`size-5 origin-center transform-gpu text-[#8B6357] transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        id="performance-radar-panel"
        ref={panelRef}
        style={{ height: panelHeight === "auto" ? "auto" : `${panelHeight}px` }}
        className={`overflow-hidden transition-[height,opacity,margin] duration-300 ease-in-out ${
          isOpen ? "mt-4 opacity-100" : "mt-0 opacity-0"
        }`}
      >
        <div>
          <div className={`flex justify-center ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
            <PerformanceRadarChart metrics={radarMetrics.map((metric) => ({ ...metric }))} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ScoreCardView({ card }: { card: ScoreCard }) {
  return (
    <article
      className={`w-full rounded-[20px] border border-[rgba(139,99,87,0.05)] bg-white px-[20.73px] pb-[20px] pt-[20.73px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] lg:px-6 lg:pb-6 lg:pt-6 ${card.cardClassName ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${card.iconToneClassName}`}>
            {card.icon}
          </div>
          <div className="min-w-0">
            <h3 className="whitespace-pre-line font-comfortaa text-[16px] font-bold leading-5 text-[#4A2C55]">{card.title}</h3>
            <p className="mt-1 font-comfortaa text-[12px] font-medium leading-[18px] text-[#8B6357]">{card.subtitle}</p>
          </div>
        </div>
        <p className={`shrink-0 font-comfortaa text-[20px] font-bold leading-[30px] ${card.scoreColor}`}>
          {card.score}
          <span className="font-medium text-[14px] leading-[21px] text-[#8B6357]">/{card.maxScore}</span>
        </p>
      </div>
      <div className="mt-4">{card.body}</div>
    </article>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Icon
          key={index}
          name="star-2"
          className={`size-[14px] ${index < Math.round(rating) ? "text-[#E67E22]" : "text-[#E7DED8]"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function RatingBreakdownRow({ label, rating }: { label: string; rating: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357]">{label}</span>
      <RatingStars rating={rating} />
    </div>
  );
}

function getResponseTimePresentation(score: number) {
  const normalizedScore = Math.max(0, Math.min(score, 20));
  const completion = (normalizedScore / 20) * 100;
  const averageMinutes = Math.round(120 - normalizedScore * 3.75);

  if (normalizedScore >= 18) {
    return { averageMinutes, badge: "Fast Responder", progress: completion };
  }

  if (normalizedScore >= 14) {
    return { averageMinutes, badge: "On Track", progress: completion };
  }

  return { averageMinutes, badge: "Needs Follow-up", progress: completion };
}

function getPunctualityPresentation(punctuality: {
  onTimeRate: number;
  lateArrivalCount: number;
  latestLateMinutes: number | null;
}) {
  const progress = Math.max(0, Math.min(Math.round(punctuality.onTimeRate), 100));

  if (punctuality.lateArrivalCount <= 0) {
    return {
      onTimeRate: progress,
      progress,
      incidentText: "No recent late arrivals",
      incidentTone: "text-[#16A34A]",
    };
  }

  const lateLabel = punctuality.lateArrivalCount === 1 ? "Late arrival" : "Late arrivals";
  const minuteLabel =
    punctuality.latestLateMinutes && punctuality.latestLateMinutes > 0
      ? ` (${punctuality.latestLateMinutes} mins)`
      : "";

  return {
    onTimeRate: progress,
    progress,
    incidentText: `${punctuality.lateArrivalCount} ${lateLabel}${minuteLabel}`,
    incidentTone: "text-[#DC2626]",
  };
}

function getCompletionPresentation(score: number) {
  const normalizedScore = Math.max(0, Math.min(score, 20));

  if (normalizedScore >= 18) {
    return {
      summary: "All Health Reports filed within 24h",
      tone: "text-[#4A2C55]",
      iconTone: "text-[#3B82F6]",
    };
  }

  if (normalizedScore >= 14) {
    return {
      summary: "Most Health Reports filed within 24h",
      tone: "text-[#4A2C55]",
      iconTone: "text-[#3B82F6]",
    };
  }

  return {
    summary: "Some Health Reports were filed after 24h",
    tone: "text-[#DC2626]",
    iconTone: "text-[#DC2626]",
  };
}

function getTechnicalSkillPresentation(technicalSkill: {
  certificationTitle: string;
  status: string;
  statusLabel: string;
}) {
  if (technicalSkill.status === "pending") {
    return {
      title: technicalSkill.certificationTitle,
      status: technicalSkill.statusLabel,
      statusTone: "text-[#27AE60]",
      statusBg: "bg-[#DCFCE7]",
      statusIcon: "check-green" as const,
    };
  }

  if (technicalSkill.status === "approved") {
    return {
      title: technicalSkill.certificationTitle,
      status: technicalSkill.statusLabel,
      statusTone: "text-[#27AE60]",
      statusBg: "bg-[#DCFCE7]",
      statusIcon: "check-green" as const,
    };
  }

  return {
    title: technicalSkill.certificationTitle,
    status: technicalSkill.statusLabel,
    statusTone: "text-[#633479]",
    statusBg: "bg-[rgba(124,58,237,0.1)]",
    statusIcon: "premium-quality" as const,
  };
}

export default function GroomerPerformancePage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isPerformanceRadarOpen, setIsPerformanceRadarOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReportReviewOpen, setIsReportReviewOpen] = useState(false);
  const [isSubmittingReportReview, setIsSubmittingReportReview] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidenceFile, setReportEvidenceFile] = useState<File | null>(null);
  const [isTechnicalSkillModalOpen, setIsTechnicalSkillModalOpen] = useState(false);
  const [technicalSkillDescription, setTechnicalSkillDescription] = useState("");
  const [technicalSkillEvidenceFile, setTechnicalSkillEvidenceFile] = useState<File | null>(null);
  const [isSubmittingTechnicalSkill, setIsSubmittingTechnicalSkill] = useState(false);
  const { performance, setPerformance } = useGroomerPerformance();

  const radarMetrics = useMemo(
    () => [
      { label: "Ratings", value: performance?.breakdown.customerRating ?? 0, color: "#E67E22" },
      { label: "Response", value: performance?.breakdown.responseTime ?? 0, color: "#22C55E" },
      { label: "Punctuality", value: performance?.breakdown.reliability ?? 0, color: "#D97706" },
      { label: "Completion", value: performance?.breakdown.completion ?? 0, color: "#60A5FA" },
      { label: "Technical", value: performance?.breakdown.technical ?? 0, color: "#A855F7" },
    ],
    [performance],
  );

  const scoreCards: ScoreCard[] = useMemo(() => {
    const firstReview = performance?.recentFeedback[0];
    const averageStars = firstReview
      ? ((firstReview.technicalRating || firstReview.rating) + (firstReview.attitudeRating || firstReview.rating) + (firstReview.environmentRating || firstReview.rating)) / 3
      : 0;
    const responseTimeScore = Math.round(performance?.breakdown.responseTime ?? 0);
    const responseTimePresentation = getResponseTimePresentation(responseTimeScore);
    const reliabilityScore = Math.round(performance?.breakdown.reliability ?? 0);
    const punctualityPresentation = getPunctualityPresentation(
      performance?.punctuality ?? {
        onTimeRate: 100,
        lateArrivalCount: 0,
        latestLateMinutes: null,
      },
    );
    const completionScore = Math.round(performance?.breakdown.completion ?? 0);
    const completionPresentation = getCompletionPresentation(completionScore);
    const technicalScore = Math.round(performance?.breakdown.technical ?? 0);
    const technicalPresentation = getTechnicalSkillPresentation(
      performance?.technicalSkill ?? {
        certificationTitle: "Groomer",
        status: "needs_update",
        statusLabel: "Update certification details",
      },
    );

    return [
      {
        title: "User Rating",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.customerRating ?? 0),
        maxScore: 20,
        scoreColor: "text-[#E67E22]",
        iconToneClassName: "bg-[#FFF7ED]",
        cardClassName: "min-h-[218px]",
        icon: <Icon name="star" className="size-[18px] text-[#E67E22]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
              Average {averageStars > 0 ? averageStars.toFixed(1) : "-"} Stars
            </p>
            <div className="mt-[10px] space-y-[11px]">
              <RatingBreakdownRow
                label="Skill"
                rating={firstReview ? (firstReview.technicalRating || firstReview.rating) : 0}
              />
              <RatingBreakdownRow
                label="Attitude"
                rating={firstReview ? (firstReview.attitudeRating || firstReview.rating) : 0}
              />
              <RatingBreakdownRow
                label="Environment"
                rating={firstReview ? (firstReview.environmentRating || firstReview.rating) : 0}
              />
            </div>
          </div>
        ),
      },
      {
        title: "Confirm Time",
        subtitle: "Max 20 pts",
        score: responseTimeScore,
        maxScore: 20,
        scoreColor: "text-[#16A34A]",
        iconToneClassName: "bg-[#F0FDF4]",
        cardClassName: "min-h-[167px]",
        icon: <Icon name="alert-success" className="size-[18px]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
                Average: {responseTimePresentation.averageMinutes} mins
              </p>
              <span className="inline-flex h-6 items-center rounded-full bg-[#DCFCE7] px-3 font-comfortaa text-[11px] font-bold leading-[16.5px] text-[#388B5E]">
                {responseTimePresentation.badge}
              </span>
            </div>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#00A63E]"
                style={{ width: `${responseTimePresentation.progress}%` }}
              />
            </div>
          </div>
        ),
      },
      {
        title: "Punctuality",
        subtitle: "Max 20 pts",
        score: reliabilityScore,
        maxScore: 20,
        scoreColor: "text-[#D97706]",
        iconToneClassName: "bg-[#FFF7ED]",
        cardClassName: "min-h-[190px]",
        icon: <Icon name="clock" className="size-[18px] text-[#D97706]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
              {punctualityPresentation.onTimeRate}% On-time
            </p>
            <div className="mt-2 h-[6px] overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#D97706]"
                style={{ width: `${punctualityPresentation.progress}%` }}
              />
            </div>
            <p className={`mt-[9px] font-comfortaa text-[12px] font-medium leading-[18px] ${punctualityPresentation.incidentTone}`}>
              {punctualityPresentation.incidentText}
            </p>
          </div>
        ),
      },
      {
        title: "Completion &\nHealth Reports",
        subtitle: "Max 20 pts",
        score: completionScore,
        maxScore: 20,
        scoreColor: "text-[#3B82F6]",
        iconToneClassName: "bg-[#EFF6FF]",
        cardClassName: "min-h-[149px]",
        icon: <Icon name="check" className="size-[18px] text-[#3B82F6]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <div className="flex items-start gap-2">
              <Icon name="check" className={`mt-[2px] size-[14px] ${completionPresentation.iconTone}`} aria-hidden="true" />
              <p className={`font-comfortaa text-[13px] leading-[19.5px] ${completionPresentation.tone}`}>
                {completionPresentation.summary}
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Technical Skill",
        subtitle: "Max 20 pts",
        score: technicalScore,
        maxScore: 20,
        scoreColor: "text-[#633479]",
        iconToneClassName: "bg-[#FAF5FF]",
        cardClassName: "min-h-[218px]",
        icon: <Icon name="premium-quality" className="size-[18px] text-[#A855F7]" aria-hidden="true" />,
        body: (
          <div>
            <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center rounded-full border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.1)] px-3 py-[7px]">
                  <Icon name="premium-quality" className="size-[14px] shrink-0 text-[#633479]" aria-hidden="true" />
                  <span className="ml-2 truncate font-comfortaa text-[12px] font-bold leading-[18px] text-[#633479]">
                    {technicalPresentation.title}
                  </span>
                </div>
                <div className={`inline-flex h-6 items-center gap-1 rounded-[12px] px-3 ${technicalPresentation.statusBg}`}>
                  <Icon
                    name={technicalPresentation.statusIcon}
                    className={`size-[14px] ${technicalPresentation.statusTone}`}
                    aria-hidden="true"
                  />
                  <span className={`font-comfortaa text-[10px] font-bold leading-[14px] ${technicalPresentation.statusTone}`}>
                    {technicalPresentation.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setTechnicalSkillDescription(performance?.technicalSkill.latestRequest?.description ?? "");
                  setTechnicalSkillEvidenceFile(null);
                  setIsTechnicalSkillModalOpen(true);
                }}
                className="inline-flex h-9 w-[196px] items-center justify-center rounded-[20px] border border-[#633479] bg-white font-comfortaa text-[14px] font-bold leading-[21px] text-[#633479] transition-[transform,opacity] active:scale-[0.98] active:opacity-80"
              >
                Update
              </button>
            </div>
          </div>
        ),
      },
    ];
  }, [performance]);
  const firstFeedback = performance?.recentFeedback[0] ?? null;
  const hasExistingReply = Boolean(firstFeedback?.reply?.trim());

  const updateFeedbackReply = (reviewId: number, reply: string) => {
    setPerformance((current) => {
      if (!current) return current;

      return {
        ...current,
        recentFeedback: current.recentFeedback.map((feedback) =>
          feedback.reviewId === reviewId ? { ...feedback, reply } : feedback,
        ),
      };
    });
  };

  const updateTechnicalSkill = (technicalSkill: NonNullable<typeof performance>["technicalSkill"]) => {
    setPerformance((current) => {
      if (!current) return current;
      return {
        ...current,
        technicalSkill,
      };
    });
  };

  const resetReportReviewForm = () => {
    setIsReportReviewOpen(false);
    setReportReason("");
    setReportEvidenceFile(null);
  };

  const resetTechnicalSkillForm = () => {
    setIsTechnicalSkillModalOpen(false);
    setTechnicalSkillDescription("");
    setTechnicalSkillEvidenceFile(null);
  };

  const handleReplySubmit = async () => {
    if (!firstFeedback || isSubmittingReply) return;

    const trimmedReply = replyText.trim();
    if (!trimmedReply) {
      toast.error("Please enter your reply");
      return;
    }

    setIsSubmittingReply(true);
    try {
      await replyGroomerReview(firstFeedback.reviewId, { reply: trimmedReply });
      updateFeedbackReply(firstFeedback.reviewId, trimmedReply);
      setIsReplying(false);
      setReplyText("");
      toast.success("Reply sent");
    } catch (error) {
      console.error("Failed to reply review:", error);
      toast.error(getActionErrorMessage(error, "Failed to send reply"));
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReportReviewSubmit = async () => {
    if (!firstFeedback || isSubmittingReportReview) return;

    const trimmedReason = reportReason.trim();
    if (!trimmedReason) {
      toast.error("Please share your reasons");
      return;
    }

    setIsSubmittingReportReview(true);
    try {
      await reportGroomerReview(firstFeedback.reviewId, {
        why: trimmedReason,
        evidenceFile: reportEvidenceFile,
      });
      resetReportReviewForm();
      toast.success("Review reported");
    } catch (error) {
      console.error("Failed to report review:", error);
      toast.error(getActionErrorMessage(error, "Failed to report review"));
    } finally {
      setIsSubmittingReportReview(false);
    }
  };

  const handleTechnicalSkillSubmit = async () => {
    const trimmedDescription = technicalSkillDescription.trim();
    if (isSubmittingTechnicalSkill) return;

    if (!trimmedDescription) {
      toast.error("Please share your updated skills");
      return;
    }

    setIsSubmittingTechnicalSkill(true);
    try {
      let evidenceImageId: number | null = null;
      if (technicalSkillEvidenceFile) {
        const uploaded = await uploadGroomerApplyImage(technicalSkillEvidenceFile, "work_or_cert");
        evidenceImageId = uploaded.id;
      }
      const response = await submitGroomerTechnicalSkillUpdate({
        description: trimmedDescription,
        evidence_image_id: evidenceImageId,
      });
      updateTechnicalSkill({
        certificationTitle: String(response.technical_skill.certification_title ?? "Groomer"),
        status: String(response.technical_skill.status ?? "pending"),
        statusLabel: String(response.technical_skill.status_label ?? "Your request is under review"),
        canUpdate: Boolean(response.technical_skill.can_update ?? true),
        latestRequest: response.technical_skill.latest_request && typeof response.technical_skill.latest_request === "object"
          ? {
              id: Number((response.technical_skill.latest_request as Record<string, unknown>).id ?? 0),
              status: String((response.technical_skill.latest_request as Record<string, unknown>).status ?? "pending"),
              description: String((response.technical_skill.latest_request as Record<string, unknown>).description ?? ""),
              reviewerNotes: String((response.technical_skill.latest_request as Record<string, unknown>).reviewer_notes ?? ""),
              evidenceImageId: Number((response.technical_skill.latest_request as Record<string, unknown>).evidence_image_id ?? 0),
              submittedAt: String((response.technical_skill.latest_request as Record<string, unknown>).submitted_at ?? ""),
              reviewedAt: ((response.technical_skill.latest_request as Record<string, unknown>).reviewed_at as string | null | undefined) ?? null,
            }
          : null,
      });
      resetTechnicalSkillForm();
      toast.success("Technical skill update submitted");
    } catch (error) {
      console.error("Failed to submit technical skill update:", error);
      toast.error(getActionErrorMessage(error, "Failed to submit technical skill update"));
    } finally {
      setIsSubmittingTechnicalSkill(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(40*var(--px393))] pt-[calc(16*var(--px393))] sm:px-5 sm:pb-10 sm:pt-4 lg:mx-auto lg:max-w-[944px] lg:min-h-0 lg:px-0 lg:pb-6 lg:pt-6">
        <div className="mx-auto w-full max-w-[354px] lg:max-w-none">
          <div className="w-full">
            <div className="flex items-center gap-2 lg:px-0">
              <button
                type="button"
                onClick={() => navigate("/groomer/account")}
                className="flex size-5 items-center justify-center text-white lg:hidden"
                aria-label="Go back to my account"
              >
                <Icon name="nav-prev" className="size-5 text-white" aria-hidden="true" />
              </button>
              <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white lg:hidden">Performance details</h1>
              <nav
                aria-label="Breadcrumb"
                className="hidden items-center gap-2 font-comfortaa text-[20px] font-bold leading-[22px] text-white lg:flex"
              >
                <button
                  type="button"
                  onClick={() => navigate("/groomer/account")}
                  className="transition-opacity hover:opacity-80"
                >
                  My account
                </button>
                <span aria-hidden="true">&gt;</span>
                <span>Performance details</span>
              </nav>
            </div>

            <section className="mt-5">
              <div className="flex flex-col items-center">
                <ScoreRing score={performance?.score ?? 0} />
                <div className="mt-4">
                  <PerformanceBadge label={performance?.levelLabel ?? "Groomer"} level={performance?.level ?? "level_c"} />
                </div>
                {!isMobile ? <PerformanceTierScale /> : null}
              </div>
            </section>

            <section className="mt-4 lg:mt-5">
              <PerformanceRadarCard
                isOpen={isPerformanceRadarOpen}
                onToggle={() => setIsPerformanceRadarOpen((value) => !value)}
                radarMetrics={radarMetrics}
              />
            </section>

            <section className="mt-4 lg:mt-3">
              <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] tracking-[0.45px] text-white">Detailed Scores</h2>
              <div className="mt-4 space-y-4">
                {scoreCards.map((card) => (
                  <ScoreCardView key={card.title} card={card} />
                ))}
              </div>
            </section>

            <section className="mt-[26px] lg:mt-5">
              <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] tracking-[0.45px] text-white">
                Client feedback in 72 hours
              </h2>
              <article className="mt-[15px] rounded-[24px] bg-white px-5 py-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] lg:px-6 lg:py-6">
                {!firstFeedback ? (
                  <p className="font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">No recent feedback in the last 72 hours.</p>
                ) : (
                  <>
              <div className="flex items-start gap-3">
                <img
                  src={REVIEW_AVATAR_URL}
                  alt={firstFeedback.userName}
                  className="size-12 rounded-full border border-white object-cover shadow-[0px_1px_3px_rgba(0,0,0,0.1)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#4A2C55]">{firstFeedback.userName}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon
                        key={index}
                        name="star-2"
                        className={`size-3 ${index < Math.round(firstFeedback.rating) ? "text-[#E67E22]" : "text-[#E7DED8]"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 max-w-[244px] font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">
                    {firstFeedback.comment ? `"${firstFeedback.comment}"` : "No written comment."}
                  </p>
                </div>
              </div>

              {isReplying ? (
                <div className="mt-4 flex flex-col items-end">
                  <div className="w-full pl-[52px]">
                    <textarea
                      value={replyText}
                      onChange={(event) => setReplyText(event.target.value)}
                      placeholder="Reply here"
                      disabled={isSubmittingReply}
                      className="h-[88px] w-full resize-none rounded-[12px] border border-[#DE6A07] bg-white px-4 py-3 font-comfortaa text-[12px] leading-[18px] text-[#4A2C55] outline-none placeholder:text-[#717182]"
                    />
                  </div>
                  <div className="mt-4 w-[266px]">
                    <GroomerPrimaryActionButton
                      fullWidth
                      onClick={handleReplySubmit}
                      disabled={isSubmittingReply}
                      loading={isSubmittingReply}
                    >
                      Send
                    </GroomerPrimaryActionButton>
                    <div className="mt-[10px] flex h-12 items-center justify-center">
                      <GroomerLinkButton
                        disabled={isSubmittingReply}
                        onClick={() => {
                          setIsReplying(false);
                          setReplyText("");
                        }}
                      >
                        <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline">Cancel</span>
                      </GroomerLinkButton>
                    </div>
                  </div>
                </div>
              ) : hasExistingReply ? (
                <div className="mt-4 rounded-[12px] bg-[#FAF9F7] px-4 py-4">
                  <p className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#8B6357]">Your reply</p>
                  <p className="mt-2 font-comfortaa text-[13px] leading-[19.5px] text-[#4A2C55]">{firstFeedback.reply}</p>
                </div>
              ) : (
                <>
                  <OrangeButton
                    type="button"
                    variant="outline"
                    size="standard"
                    onClick={() => setIsReplying(true)}
                    className="mt-[20px] h-[48px] w-full"
                  >
                    <span className="flex items-center justify-center gap-2 font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#E67E22]">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path
                          d="M6 5L3 8L6 11M3.5 8H9.25C11.3211 8 13 9.67893 13 11.75V12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Reply</span>
                    </span>
                  </OrangeButton>

                  <div className="mt-[11px] flex justify-center">
                    <GroomerLinkButton type="button" onClick={() => setIsReportReviewOpen(true)}>
                      <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline decoration-from-font">
                        Report review
                      </span>
                    </GroomerLinkButton>
                  </div>
                </>
              )}
                </>
              )}
            </article>
          </section>
          </div>
        </div>
      </div>

      <ReportReviewModal
        open={isReportReviewOpen}
        reason={reportReason}
        evidenceName={reportEvidenceFile?.name ?? ""}
        onReasonChange={setReportReason}
        onEvidenceChange={setReportEvidenceFile}
        onSubmit={handleReportReviewSubmit}
        isSubmitting={isSubmittingReportReview}
        onClose={resetReportReviewForm}
      />

      <UpdateTechnicalSkillModal
        open={isTechnicalSkillModalOpen}
        description={technicalSkillDescription}
        evidenceName={technicalSkillEvidenceFile?.name ?? ""}
        isSubmitting={isSubmittingTechnicalSkill}
        onDescriptionChange={setTechnicalSkillDescription}
        onEvidenceChange={setTechnicalSkillEvidenceFile}
        onSubmit={handleTechnicalSkillSubmit}
        onClose={resetTechnicalSkillForm}
      />
    </>
  );
}

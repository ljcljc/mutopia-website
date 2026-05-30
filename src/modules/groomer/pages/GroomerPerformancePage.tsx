import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";
import { PerformanceRadarChart } from "@/modules/groomer/components/PerformanceRadarChart";
import { ReportReviewModal } from "@/modules/groomer/components/ReportReviewModal";
import { useNavigate } from "react-router-dom";
import { getGroomerPerformance, reportGroomerReview, replyGroomerReview } from "@/lib/api";
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

type PerformanceSummary = {
  score: number;
  level: string;
  levelLabel: string;
  breakdown: {
    customerRating: number;
    responseTime: number;
    reliability: number;
    completion: number;
    technical: number;
  };
  recentFeedback: Array<{
    reviewId: number;
    bookingId: number;
    userName: string;
    rating: number;
    technicalRating: number;
    attitudeRating: number;
    environmentRating: number;
    comment: string;
    reply: string | null;
  }>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function getNumber(source: Record<string, unknown>, key: string, fallback = 0): number {
  const value = source[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function getString(source: Record<string, unknown>, key: string, fallback = ""): string {
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function getActionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof HttpError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

function mapPerformanceData(raw: unknown): PerformanceSummary {
  const record = asRecord(raw);
  const breakdown = asRecord(record.breakdown);
  const feedback = Array.isArray(record.recent_feedback) ? record.recent_feedback : [];

  return {
    score: getNumber(record, "score"),
    level: getString(record, "level"),
    levelLabel: getString(record, "level_label", "Groomer"),
    breakdown: {
      customerRating: getNumber(breakdown, "customer_rating"),
      responseTime: getNumber(breakdown, "response_time"),
      reliability: getNumber(breakdown, "reliability"),
      completion: getNumber(breakdown, "completion"),
      technical: getNumber(breakdown, "technical"),
    },
    recentFeedback: feedback.map((item) => {
      const review = asRecord(item);
      return {
        reviewId: getNumber(review, "review_id"),
        bookingId: getNumber(review, "booking_id"),
        userName: getString(review, "user_name", "Client"),
        rating: getNumber(review, "rating"),
        technicalRating: getNumber(review, "technical_rating"),
        attitudeRating: getNumber(review, "attitude_rating"),
        environmentRating: getNumber(review, "environment_rating"),
        comment: getString(review, "comment"),
        reply: getString(review, "reply") || getString(review, "groomer_reply") || null,
      };
    }),
  };
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

function PerformanceBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex h-[26px] items-center gap-2 rounded-full bg-[linear-gradient(180deg,#FFF584_0%,#F0D65A_13.46%,#E0B730_26.92%,#C78A0E_75.96%,#BB7F12_87.98%,#C8A32B_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-0.5">
        <Icon name="star-2" className="size-[12px] text-white" aria-hidden="true" />
        <Icon name="star-2" className="size-[12px] text-white" aria-hidden="true" />
      </div>
      <span className="bg-[linear-gradient(168.31deg,#FFF7ED_0%,#FFFBEB_100%)] bg-clip-text font-comfortaa text-[12px] font-bold leading-[17.5px] text-transparent">
        {label}
      </span>
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
    <article className="mt-6 rounded-[16px] bg-white p-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)]">
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
      className={`rounded-[20px] border border-[rgba(139,99,87,0.05)] bg-white px-[20.73px] pb-[20px] pt-[20.73px] shadow-[0px_4px_16px_rgba(0,0,0,0.1)] ${card.cardClassName ?? ""}`}
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

export default function GroomerPerformancePage() {
  const navigate = useNavigate();
  const [isPerformanceRadarOpen, setIsPerformanceRadarOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReportReviewOpen, setIsReportReviewOpen] = useState(false);
  const [isSubmittingReportReview, setIsSubmittingReportReview] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidenceFile, setReportEvidenceFile] = useState<File | null>(null);
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);

  useEffect(() => {
    getGroomerPerformance()
      .then((response) => setPerformance(mapPerformanceData(response)))
      .catch((error) => {
        console.error("Failed to load groomer performance:", error);
      });
  }, []);

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

    return [
      {
        title: "User Rating",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.customerRating ?? 0),
        maxScore: 20,
        scoreColor: "text-[#E67E22]",
        iconToneClassName: "bg-[#FFF7ED]",
        cardClassName: "min-h-[239px]",
        icon: <Icon name="professional-service" className="size-[18px] text-[#E67E22]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
              Average {averageStars > 0 ? averageStars.toFixed(1) : "-"} Stars
            </p>
          </div>
        ),
      },
      {
        title: "Confirm Time",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.responseTime ?? 0),
        maxScore: 20,
        scoreColor: "text-[#16A34A]",
        iconToneClassName: "bg-[#F0FDF4]",
        cardClassName: "min-h-[170px]",
        icon: <Icon name="target" className="size-[18px] text-[#16A34A]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
              Response score {Math.round(performance?.breakdown.responseTime ?? 0)}/20
            </p>
          </div>
        ),
      },
      {
        title: "Punctuality",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.reliability ?? 0),
        maxScore: 20,
        scoreColor: "text-[#D97706]",
        iconToneClassName: "bg-[#FFF7ED]",
        cardClassName: "min-h-[170px]",
        icon: <Icon name="clock" className="size-[18px] text-[#D97706]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
              Reliability score {Math.round(performance?.breakdown.reliability ?? 0)}/20
            </p>
          </div>
        ),
      },
      {
        title: "Completion &\nHealth Reports",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.completion ?? 0),
        maxScore: 20,
        scoreColor: "text-[#3B82F6]",
        iconToneClassName: "bg-[#EFF6FF]",
        cardClassName: "min-h-[167px]",
        icon: <Icon name="target" className="size-[18px] text-[#60A5FA]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <div className="flex items-start gap-2">
              <Icon name="target" className="mt-[2px] size-[14px] text-[#60A5FA]" aria-hidden="true" />
              <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#4A2C55]">
                Completion score {Math.round(performance?.breakdown.completion ?? 0)}/20
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Technical Skill",
        subtitle: "Max 20 pts",
        score: Math.round(performance?.breakdown.technical ?? 0),
        maxScore: 20,
        scoreColor: "text-[#633479]",
        iconToneClassName: "bg-[#FAF5FF]",
        cardClassName: "min-h-[163px]",
        icon: <Icon name="premium-quality" className="size-[18px] text-[#A855F7]" aria-hidden="true" />,
        body: (
          <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,85,247,0.2)] bg-[rgba(168,85,247,0.1)] px-3 py-[7px]">
              <Icon name="premium-quality" className="size-[14px] text-[#A855F7]" aria-hidden="true" />
              <span className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#633479]">{performance?.levelLabel ?? "Groomer"}</span>
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

  const resetReportReviewForm = () => {
    setIsReportReviewOpen(false);
    setReportReason("");
    setReportEvidenceFile(null);
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

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] w-full bg-[#633479] px-[calc(20*var(--px393))] pb-[calc(40*var(--px393))] pt-[calc(16*var(--px393))] sm:px-5 sm:pb-10 sm:pt-4 lg:mx-auto lg:max-w-[944px] lg:min-h-0 lg:px-0">
        <div className="mx-auto w-full max-w-[354px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/groomer/account")}
              className="flex size-5 items-center justify-center text-white"
              aria-label="Go back to my account"
            >
              <Icon name="nav-prev" className="size-5 text-white" aria-hidden="true" />
            </button>
            <h1 className="font-comfortaa text-[20px] font-bold leading-[22px] text-white">Performance details</h1>
          </div>

          <section className="mt-5 flex flex-col items-center">
            <ScoreRing score={performance?.score ?? 0} />
            <div className="mt-4">
              <PerformanceBadge label={performance?.levelLabel ?? "Groomer"} />
            </div>
          </section>

          <PerformanceRadarCard
            isOpen={isPerformanceRadarOpen}
            onToggle={() => setIsPerformanceRadarOpen((value) => !value)}
            radarMetrics={radarMetrics}
          />

          <section className="mt-4">
            <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] tracking-[0.45px] text-white">Detailed Scores</h2>
            <div className="mt-4 space-y-4">
              {scoreCards.map((card) => (
                <ScoreCardView key={card.title} card={card} />
              ))}
            </div>
          </section>

          <section className="mt-[26px]">
            <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] tracking-[0.45px] text-white">
              Client feedback in 72 hours
            </h2>
            <article className="mt-[15px] rounded-[24px] bg-white px-5 py-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)]">
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
    </>
  );
}

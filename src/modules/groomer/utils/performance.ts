export type GroomerPerformanceSummary = {
  score: number;
  level: string;
  levelLabel: string;
  serviceFeeRate: number;
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

export type GroomerPerformancePresentation = {
  badgeClassName: string;
  badgeTextClassName: string;
  badgeText: string;
  showStars: boolean;
  badgeIconName?: "star-3";
  badgeIconClassName?: string;
  benefitTone: "gold" | "neutral";
  benefits: Array<{ title: string; description: string }>;
};

export type GroomerPerformanceDashboardMetrics = {
  partnerScore: string;
  rating: string;
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

function formatPercent(value: number): string {
  const normalized = Number.isFinite(value) ? value : 0;
  const rounded = Math.round(normalized * 100);
  return `${rounded}%`;
}

export function mapGroomerPerformanceData(raw: unknown): GroomerPerformanceSummary {
  const record = asRecord(raw);
  const breakdown = asRecord(record.breakdown);
  const feedback = Array.isArray(record.recent_feedback) ? record.recent_feedback : [];

  return {
    score: getNumber(record, "score"),
    level: getString(record, "level"),
    levelLabel: getString(record, "level_label", "Groomer"),
    serviceFeeRate: getNumber(record, "service_fee_rate"),
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

export function mapGroomerPerformanceDashboardMetrics(raw: unknown): GroomerPerformanceDashboardMetrics {
  const performance = mapGroomerPerformanceData(raw);
  const rawStars = (performance.breakdown.customerRating / 20) * 5;
  const roundedStars = Math.round(rawStars * 10) / 10;

  return {
    partnerScore: `${Math.round(performance.score)}/100`,
    rating: Number.isFinite(roundedStars) ? roundedStars.toFixed(1).replace(/\.0$/, "") : "-",
  };
}

export function getGroomerPerformancePresentation(
  level: string,
  levelLabel: string,
  serviceFeeRate: number,
): GroomerPerformancePresentation {
  const payoutShare = formatPercent(1 - serviceFeeRate);

  if (level === "level_a") {
    return {
      badgeClassName:
        "h-[26px] rounded-full bg-[linear-gradient(180deg,#FFF584_0%,#F0D65A_13.46%,#E0B730_26.92%,#C78A0E_75.96%,#BB7F12_87.98%,#C8A32B_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
      badgeTextClassName:
        "bg-[linear-gradient(168.31deg,#FFF7ED_0%,#FFFBEB_100%)] bg-clip-text font-comfortaa text-[12px] font-bold leading-[17.5px] text-transparent",
      badgeText: levelLabel || "Gold Groomer",
      showStars: true,
      benefitTone: "gold",
      benefits: [
        { title: `${payoutShare} payout share`, description: "Highest earnings tier based on your performance" },
        { title: "Priority client matching", description: "You are ranked first when matching nearby jobs" },
        { title: "Top-tier standing", description: "Maintain 85+ points to keep Gold Groomer status" },
      ],
    };
  }

  if (level === "level_b") {
    return {
      badgeClassName:
        "h-[26px] rounded-full bg-[linear-gradient(180deg,#EEECEC_0%,#EDECEC_16.83%,#DFDEDE_50%,#A4A4A4_88.46%,#B8B6B6_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
      badgeTextClassName: "font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#633479]",
      badgeText: levelLabel || "Silver Groomer",
      showStars: false,
      badgeIconName: "star-3",
      badgeIconClassName: "size-[12px]",
      benefitTone: "neutral",
      benefits: [
        { title: `${payoutShare} payout share`, description: "Strong earnings tier backed by consistent service" },
        { title: "Priority client matching", description: "You stay ahead of base-tier groomers in ranking" },
        { title: "Path to Gold", description: "Reach 85+ points to unlock Gold Groomer status" },
      ],
    };
  }

  return {
    badgeClassName:
      "h-[26px] rounded-full bg-[linear-gradient(180deg,#8B6357_0%,#4A2C55_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]",
    badgeTextClassName: "font-comfortaa text-[12px] font-bold leading-[17.5px] text-white",
    badgeText: levelLabel || "Groomer",
    showStars: false,
    benefitTone: "neutral",
    benefits: [
      { title: `${payoutShare} payout share`, description: "Current payout share based on your performance tier" },
      { title: "Improve your score", description: "Reach 70+ points to unlock Silver Groomer benefits" },
    ],
  };
}

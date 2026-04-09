import { useState, type ReactNode } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { PerformanceRadarChart } from "@/modules/groomer/components/PerformanceRadarChart";
import { useNavigate } from "react-router-dom";

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

const radarMetrics = [
  { label: "Ratings", value: 18, color: "#E67E22" },
  { label: "Response", value: 20, color: "#22C55E" },
  { label: "Punctuality", value: 15, color: "#D97706" },
  { label: "Completion", value: 20, color: "#60A5FA" },
  { label: "Technical", value: 19, color: "#A855F7" },
] as const;

const scoreCards: ScoreCard[] = [
  {
    title: "User Rating",
    subtitle: "Max 20 pts",
    score: 18,
    maxScore: 20,
    scoreColor: "text-[#E67E22]",
    iconToneClassName: "bg-[#FFF7ED]",
    cardClassName: "min-h-[239px]",
    icon: <Icon name="professional-service" className="size-[18px] text-[#E67E22]" aria-hidden="true" />,
    body: (
      <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
        <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">Average 4.8 Stars</p>
        <div className="mt-2.5 space-y-2">
          {[
            ["Skill", 5],
            ["Attitude", 4],
            ["Environment", 5],
          ].map(([label, filled]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357]">{label}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon
                    key={`${label}-${index}`}
                    name="star-2"
                    className={index < Number(filled) ? "size-[14px] text-[#E67E22]" : "size-[14px] text-[#E7DED8]"}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Confirm Time",
    subtitle: "Max 20 pts",
    score: 20,
    maxScore: 20,
    scoreColor: "text-[#16A34A]",
    iconToneClassName: "bg-[#F0FDF4]",
    cardClassName: "min-h-[170px]",
    icon: <Icon name="target" className="size-[18px] text-[#16A34A]" aria-hidden="true" />,
    body: (
      <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">Average: 45 mins</p>
          <span className="rounded-full bg-[#DCFCE7] px-[10px] py-1 font-comfortaa text-[10px] font-bold leading-[15px] text-[#16A34A]">
            Fast Responder
          </span>
        </div>
        <div className="mt-3 h-[6px] rounded-full bg-[#E5E7EB]">
          <div className="h-[6px] w-full rounded-full bg-[#22C55E]" />
        </div>
      </div>
    ),
  },
  {
    title: "Punctuality",
    subtitle: "Max 20 pts",
    score: 15,
    maxScore: 20,
    scoreColor: "text-[#D97706]",
    iconToneClassName: "bg-[#FFF7ED]",
    cardClassName: "min-h-[170px]",
    icon: <Icon name="clock" className="size-[18px] text-[#D97706]" aria-hidden="true" />,
    body: (
      <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
        <p className="font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">98% On-time</p>
        <div className="mt-3 h-[6px] rounded-full bg-[#E5E7EB]">
          <div className="h-[6px] w-[74%] rounded-full bg-[#D97706]" />
        </div>
        <p className="mt-3 font-comfortaa text-[12px] font-medium leading-[18px] text-[#DC2626]">1 Late arrival (4 mins)</p>
      </div>
    ),
  },
  {
    title: "Completion &\nHealth Reports",
    subtitle: "Max 20 pts",
    score: 20,
    maxScore: 20,
    scoreColor: "text-[#3B82F6]",
    iconToneClassName: "bg-[#EFF6FF]",
    cardClassName: "min-h-[167px]",
    icon: <Icon name="target" className="size-[18px] text-[#60A5FA]" aria-hidden="true" />,
    body: (
      <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
        <div className="flex items-start gap-2">
          <Icon name="target" className="mt-[2px] size-[14px] text-[#60A5FA]" aria-hidden="true" />
          <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#4A2C55]">All Health Reports filed within 24h</p>
        </div>
      </div>
    ),
  },
  {
    title: "Technical Skill",
    subtitle: "Max 20 pts",
    score: 19,
    maxScore: 20,
    scoreColor: "text-[#633479]",
    iconToneClassName: "bg-[#FAF5FF]",
    cardClassName: "min-h-[163px]",
    icon: <Icon name="premium-quality" className="size-[18px] text-[#A855F7]" aria-hidden="true" />,
    body: (
      <div className="rounded-[12px] bg-[#FAF9F7] px-4 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(168,85,247,0.2)] bg-[rgba(168,85,247,0.1)] px-3 py-[7px]">
          <Icon name="premium-quality" className="size-[14px] text-[#A855F7]" aria-hidden="true" />
          <span className="font-comfortaa text-[12px] font-bold leading-[18px] text-[#633479]">Level A (Certified)</span>
        </div>
      </div>
    ),
  },
];

function ScoreRing() {
  return (
    <div className="relative flex size-[140px] items-center justify-center rounded-full bg-[conic-gradient(#F08A12_306deg,#E7DED8_306deg_360deg)]">
      <div className="flex size-[116px] flex-col items-center justify-center rounded-full bg-[#633479]">
        <span className="font-comfortaa text-[32px] font-bold leading-8 text-white">85</span>
        <span className="mt-1 font-comfortaa text-[14px] font-medium leading-[21px] text-[rgba(255,255,255,0.7)]">/100</span>
      </div>
    </div>
  );
}

function PerformanceBadge() {
  return (
    <div className="inline-flex h-[26px] items-center gap-2 rounded-full bg-[linear-gradient(180deg,#FFF584_0%,#F0D65A_13.46%,#E0B730_26.92%,#C78A0E_75.96%,#BB7F12_87.98%,#C8A32B_100%)] px-3 shadow-[0px_10px_15px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-0.5">
        <Icon name="star-2" className="size-[12px] text-white" aria-hidden="true" />
        <Icon name="star-2" className="size-[12px] text-white" aria-hidden="true" />
      </div>
      <span className="bg-[linear-gradient(168.31deg,#FFF7ED_0%,#FFFBEB_100%)] bg-clip-text font-comfortaa text-[12px] font-bold leading-[17.5px] text-transparent">
        Gold groomer
      </span>
    </div>
  );
}

function PerformanceRadarCard({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
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
            className={`size-5 text-[#8B6357] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </div>
      </button>

      {isOpen ? (
        <div id="performance-radar-panel" className="mt-4 flex justify-center">
          <PerformanceRadarChart metrics={radarMetrics.map((metric) => ({ ...metric }))} />
        </div>
      ) : null}
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
  const [isPerformanceRadarOpen, setIsPerformanceRadarOpen] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReportReviewOpen, setIsReportReviewOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidenceName, setReportEvidenceName] = useState("");

  return (
    <>
      <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-[393px] bg-[#633479] px-5 pb-10 pt-4 lg:min-h-0 lg:max-w-[944px] lg:px-0">
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
            <ScoreRing />
            <div className="mt-4">
              <PerformanceBadge />
            </div>
          </section>

          <PerformanceRadarCard isOpen={isPerformanceRadarOpen} onToggle={() => setIsPerformanceRadarOpen((value) => !value)} />

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
              <div className="flex items-start gap-3">
                <img
                  src={REVIEW_AVATAR_URL}
                  alt="Jessica L."
                  className="size-12 rounded-full border border-white object-cover shadow-[0px_1px_3px_rgba(0,0,0,0.1)]"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#4A2C55]">Jessica L.</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Icon key={index} name="star-2" className="size-3 text-[#E67E22]" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-1.5 max-w-[244px] font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">
                    "Great groom! Max looks amazing and smells wonderful. Will book again."
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
                      className="h-[88px] w-full resize-none rounded-[12px] border border-[#DE6A07] bg-white px-4 py-3 font-comfortaa text-[12px] leading-[18px] text-[#4A2C55] outline-none placeholder:text-[#717182]"
                    />
                  </div>
                  <div className="mt-4 w-[266px]">
                    <OrangeButton
                      type="button"
                      variant="secondary"
                      size="standard"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyText("");
                      }}
                      className="w-full bg-[#8B6357] shadow-[0px_4px_12px_rgba(139,99,87,0.3)] hover:bg-[#8B6357] active:bg-[#8B6357] focus-visible:bg-[#8B6357]"
                    >
                      <span className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-white">Send</span>
                    </OrangeButton>
                    <button
                      type="button"
                      onClick={() => {
                        setIsReplying(false);
                        setReplyText("");
                      }}
                      className="mt-[10px] block h-12 w-full text-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <OrangeButton
                    type="button"
                    variant="outline"
                    size="medium"
                    onClick={() => setIsReplying(true)}
                    className="mt-[20px] w-full"
                  >
                    <span className="flex items-center justify-center gap-2 font-comfortaa text-[14px] font-bold leading-[21px] text-[#E67E22]">
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

                  <button
                    type="button"
                    onClick={() => setIsReportReviewOpen(true)}
                    className="mt-[11px] block w-full text-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline decoration-from-font transition-colors hover:text-[#6E4F46] focus-visible:text-[#6E4F46]"
                  >
                    Report review
                  </button>
                </>
              )}
            </article>
          </section>
        </div>
      </div>

      <Drawer open={isReportReviewOpen} onOpenChange={setIsReportReviewOpen} direction="bottom" shouldScaleBackground={false}>
        <DrawerContent className="mx-auto w-[calc(100%-24px)] max-w-[393px] rounded-t-[32px] border-0 bg-white px-5 pb-6 pt-5">
          <DrawerTitle className="sr-only">Report review</DrawerTitle>
          <DrawerDescription className="sr-only">Submit a review report with a reason and optional evidence.</DrawerDescription>

          <div className="mx-auto h-1.5 w-[72px] rounded-full bg-[#D9D9D9]" />

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <p className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">Account &gt; performance details</p>
              <h3 className="mt-2 font-comfortaa text-[24px] font-bold leading-[26.4px] text-[#4A2C55]">Report review</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsReportReviewOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-[#8B6357] transition-colors hover:bg-[#F7F1EC] hover:text-[#6E4F46]"
              aria-label="Close report review dialog"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-6">
            <p className="font-comfortaa text-[18px] font-bold leading-[27px] text-[#4A2C55]">Tell us your experience</p>
            <p className="mt-1 font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">Why would you report this review</p>
            <textarea
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              placeholder="Share your reasons"
              className="mt-4 h-[126px] w-full resize-none rounded-[20px] border border-[#DE6A07] bg-white px-4 py-3 font-comfortaa text-[14px] leading-[21px] text-[#4A2C55] outline-none placeholder:text-[#9E9E9E]"
            />
          </div>

          <div className="mt-6">
            <p className="font-comfortaa text-[18px] font-bold leading-[27px] text-[#4A2C55]">Upload evidence (optional)</p>
            <label
              htmlFor="report-review-evidence"
              className="mt-4 flex h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-[#CBBDB5] bg-[#FCFAF8] px-4 text-center transition-colors hover:border-[#DE6A07] hover:bg-[#FFF8F1]"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-[#FFF0E4] text-[#DE6A07]">
                <Icon name="add" className="size-[18px] text-[#DE6A07]" aria-hidden="true" />
              </span>
              <span className="mt-3 font-comfortaa text-[14px] font-bold leading-[21px] text-[#4A2C55]">
                {reportEvidenceName || "Click to upload"}
              </span>
              <span className="mt-1 font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">JPG, JPEG, PNG less than 10MB</span>
            </label>
            <input
              id="report-review-evidence"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setReportEvidenceName(file?.name ?? "");
              }}
            />
          </div>

          <div className="mt-8">
            <OrangeButton
              type="button"
              variant="secondary"
              size="standard"
              onClick={() => {
                setIsReportReviewOpen(false);
                setReportReason("");
                setReportEvidenceName("");
              }}
              className="w-full bg-[#8B6357] shadow-[0px_4px_12px_rgba(139,99,87,0.3)] hover:bg-[#8B6357] active:bg-[#8B6357] focus-visible:bg-[#8B6357]"
            >
              <span className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-white">Send</span>
            </OrangeButton>
            <button
              type="button"
              onClick={() => {
                setIsReportReviewOpen(false);
                setReportReason("");
                setReportEvidenceName("");
              }}
              className="mt-3 block h-12 w-full text-center font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline"
            >
              Cancel
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

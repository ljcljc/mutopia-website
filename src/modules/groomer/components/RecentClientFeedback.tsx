import { useEffect, useRef, useState } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";
import { ReportReviewModal } from "@/modules/groomer/components/ReportReviewModal";
import type { GroomerReview } from "@/modules/groomer/utils/performance";
import { buildImageUrl, replyGroomerReview, reportGroomerReview } from "@/lib/api";
import { toast } from "sonner";

const REVIEW_AVATAR_URL = "https://www.figma.com/api/mcp/asset/2d6c06cd-b66a-4365-9ebb-501b695cd90d";
const WINDOW_MS = 72 * 60 * 60 * 1000;

export function RecentClientFeedback({ reviews, requestedReviewId, showReviews = false, onReply }: {
  reviews: GroomerReview[];
  requestedReviewId?: number | null;
  showReviews?: boolean;
  onReply: (reviewId: number, reply: string) => void;
}) {
  const [asOf] = useState(() => Date.now());
  const sectionRef = useRef<HTMLElement>(null);
  const requestedRef = useRef<HTMLElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [reportId, setReportId] = useState<number | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidence, setReportEvidence] = useState<File | null>(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  const recentReviews = reviews.filter((review) => {
    const created = Date.parse(review.createdAt);
    return Number.isFinite(created) && created <= asOf && created >= asOf - WINDOW_MS;
  }).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const requestedIsOutside = requestedReviewId != null && !recentReviews.some((review) => review.reviewId === requestedReviewId);
  const requestedReview = recentReviews.find((review) => review.reviewId === requestedReviewId);
  const requestedUnansweredId = requestedReview && !requestedReview.reply ? requestedReview.reviewId : null;

  useEffect(() => {
    if (requestedUnansweredId !== null) setReplyingId(requestedUnansweredId);
  }, [requestedUnansweredId]);

  useEffect(() => {
    if (requestedReviewId != null && !requestedIsOutside) requestedRef.current?.scrollIntoView({ block: "center" });
    else if (showReviews) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [requestedReviewId, requestedIsOutside, showReviews, reviews]);

  useEffect(() => {
    if (replyingId === requestedReviewId) replyInputRef.current?.focus();
  }, [replyingId, requestedReviewId]);

  function closeReport() {
    setReportId(null);
    setReportReason("");
    setReportEvidence(null);
  }

  async function submitReply(reviewId: number) {
    const reply = replyText.trim();
    if (!reply) return toast.error("Please enter your reply");
    setSubmittingReply(true);
    try {
      await replyGroomerReview(reviewId, { reply });
      onReply(reviewId, reply);
      setReplyingId(null);
      setReplyText("");
      toast.success("Reply sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reply");
    } finally {
      setSubmittingReply(false);
    }
  }

  async function submitReport() {
    if (reportId == null) return;
    const why = reportReason.trim();
    if (!why) return toast.error("Please share your reasons");
    setSubmittingReport(true);
    try {
      await reportGroomerReview(reportId, { why, evidenceFile: reportEvidence });
      closeReport();
      toast.success("Review reported");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report review");
    } finally {
      setSubmittingReport(false);
    }
  }

  return <section ref={sectionRef} className="mt-[26px] lg:mt-5">
    <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] text-white">Client feedback in 72 hours</h2>
    {requestedIsOutside && <p className="mt-3 px-2 font-comfortaa text-sm text-white">This review is outside the last 72 hours or unavailable.</p>}
    {recentReviews.length === 0 && <article className="mt-[15px] rounded-[24px] bg-white px-5 py-5 font-comfortaa text-[14px] text-[#8B6357]">No client feedback in the last 72 hours.</article>}
    <div className="space-y-4">
      {recentReviews.map((review) => <article key={review.reviewId} ref={review.reviewId === requestedReviewId ? requestedRef : undefined} className="mt-[15px] rounded-[24px] bg-white px-5 py-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] lg:px-6 lg:py-6">
        <div className="flex items-start gap-3">
          <img src={review.avatarUrl ? buildImageUrl(review.avatarUrl) : REVIEW_AVATAR_URL} alt={review.userName} className="size-12 rounded-full border border-white object-cover shadow-[0px_1px_3px_rgba(0,0,0,0.1)]" />
          <div className="min-w-0 flex-1">
            <p className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#4A2C55]">{review.userName}</p>
            <div className="mt-1 flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Icon key={index} name="star-2" className={`size-3 ${index < Math.round(review.rating) ? "text-[#E67E22]" : "text-[#E7DED8]"}`} aria-hidden="true" />)}</div>
            <p className="mt-1.5 max-w-[244px] font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">{review.comment ? `"${review.comment}"` : "No written comment."}</p>
          </div>
        </div>
        {replyingId === review.reviewId ? <div className="mt-4 flex flex-col items-end">
          <textarea ref={replyingId === requestedReviewId ? replyInputRef : undefined} value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Reply here" aria-label={`Reply to ${review.userName}'s review`} disabled={submittingReply} className="h-[88px] w-full resize-none rounded-[12px] border border-[#DE6A07] bg-white px-4 py-3 font-comfortaa text-[12px] text-[#4A2C55]" />
          <div className="mt-4 w-[266px]"><GroomerPrimaryActionButton fullWidth onClick={() => submitReply(review.reviewId)} disabled={submittingReply} loading={submittingReply}>Send</GroomerPrimaryActionButton>
            <div className="mt-[10px] flex h-12 items-center justify-center"><GroomerLinkButton disabled={submittingReply} onClick={() => { setReplyingId(null); setReplyText(""); }}>Cancel</GroomerLinkButton></div>
          </div>
        </div> : review.reply ? <div className="mt-4 rounded-[12px] bg-[#FAF9F7] px-4 py-4"><p className="font-comfortaa text-[12px] font-bold text-[#8B6357]">Your reply</p><p className="mt-2 font-comfortaa text-[13px] text-[#4A2C55]">{review.reply}</p></div> : <>
          <OrangeButton type="button" variant="outline" size="standard" onClick={() => { setReplyingId(review.reviewId); setReplyText(""); }} className="mt-[20px] h-[48px] w-full">Reply</OrangeButton>
        </>}
        <div className="mt-[11px] flex justify-center"><GroomerLinkButton type="button" onClick={() => setReportId(review.reviewId)}>Report review</GroomerLinkButton></div>
      </article>)}
    </div>
    <ReportReviewModal open={reportId !== null} reason={reportReason} evidenceName={reportEvidence?.name ?? ""} onReasonChange={setReportReason} onEvidenceChange={setReportEvidence} onSubmit={submitReport} isSubmitting={submittingReport} onClose={closeReport} />
  </section>;
}

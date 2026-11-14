import { useEffect, useRef, useState } from "react";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { GroomerLinkButton } from "@/modules/groomer/components/GroomerLinkButton";
import { GroomerPrimaryActionButton } from "@/modules/groomer/components/GroomerPrimaryActionButton";
import { ReportReviewModal } from "@/modules/groomer/components/ReportReviewModal";
import { buildImageUrl, replyGroomerReview, reportGroomerReview } from "@/lib/api";
import { toast } from "sonner";

export type ClientReviewCardData = {
  reviewId: number;
  userName: string;
  avatarUrl: string | null;
  rating: number;
  comment: string;
  reply: string | null;
};

function ReviewAvatar({ name, url }: { name: string; url: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const imageUrl = url ? buildImageUrl(url) : null;

  if (imageUrl && imageUrl !== failedUrl) {
    return <img src={imageUrl} alt={name} onError={() => setFailedUrl(imageUrl)} className="size-12 shrink-0 rounded-full border border-white object-cover shadow-[0px_1px_3px_rgba(0,0,0,0.1)]" />;
  }

  return <span role="img" aria-label={`${name} avatar placeholder`} className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F3E8F3] font-comfortaa text-[18px] font-bold text-[#633479]">
    {name.trim().charAt(0).toUpperCase() || "?"}
  </span>;
}

export function ClientReviewCard({ review, onReply, autoReply = false, className }: {
  review: ClientReviewCardData;
  onReply: (reviewId: number, reply: string) => void;
  autoReply?: boolean;
  className: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportEvidence, setReportEvidence] = useState<File | null>(null);
  const [submittingReport, setSubmittingReport] = useState(false);
  useEffect(() => {
    if (autoReply && !review.reply) {
      setReplying(true);
      cardRef.current?.scrollIntoView({ block: "center" });
    }
  }, [autoReply, review.reply]);

  useEffect(() => {
    if (replying && autoReply) replyInputRef.current?.focus();
  }, [replying, autoReply]);

  function closeReport() {
    setReportOpen(false);
    setReportReason("");
    setReportEvidence(null);
  }

  async function submitReply() {
    const reply = replyText.trim();
    if (!reply) return toast.error("Please enter your reply");
    setSubmittingReply(true);
    try {
      await replyGroomerReview(review.reviewId, { reply });
      onReply(review.reviewId, reply);
      setReplying(false);
      setReplyText("");
      toast.success("Reply sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reply");
    } finally {
      setSubmittingReply(false);
    }
  }

  async function submitReport() {
    const why = reportReason.trim();
    if (!why) return toast.error("Please share your reasons");
    setSubmittingReport(true);
    try {
      await reportGroomerReview(review.reviewId, { why, evidenceFile: reportEvidence });
      closeReport();
      toast.success("Review reported");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to report review");
    } finally {
      setSubmittingReport(false);
    }
  }

  return <><article ref={cardRef} className={className}>
        <div className="flex items-start gap-3">
          <ReviewAvatar name={review.userName} url={review.avatarUrl} />
          <div className="min-w-0 flex-1">
            <p className="font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#4A2C55]">{review.userName}</p>
            <div className="mt-1 flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Icon key={index} name="star-2" className={`size-3 ${index < Math.round(review.rating) ? "text-[#E67E22]" : "text-[#E7DED8]"}`} aria-hidden="true" />)}</div>
            <p className="mt-1.5 max-w-[244px] font-comfortaa text-[14px] leading-[21px] text-[#8B6357]">{review.comment ? `"${review.comment}"` : "No written comment."}</p>
          </div>
        </div>
        {replying ? <div className="mt-4 flex flex-col items-end">
          <div className="w-full pl-[52px]">
            <textarea ref={autoReply ? replyInputRef : undefined} value={replyText} onChange={(event) => setReplyText(event.target.value)} placeholder="Reply here" aria-label={`Reply to ${review.userName}'s review`} disabled={submittingReply} className="h-[88px] w-full resize-none rounded-[12px] border border-[#DE6A07] bg-white px-4 py-3 font-comfortaa text-[12px] leading-[18px] text-[#4A2C55] outline-none placeholder:text-[#717182]" />
          </div>
          <div className="mt-4 w-[266px]">
            <GroomerPrimaryActionButton fullWidth onClick={() => submitReply()} disabled={submittingReply} loading={submittingReply}>Send</GroomerPrimaryActionButton>
            <div className="mt-[10px] flex h-12 items-center justify-center">
              <GroomerLinkButton disabled={submittingReply} onClick={() => { setReplying(false); setReplyText(""); }}>
                <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline">Cancel</span>
              </GroomerLinkButton>
            </div>
          </div>
        </div> : review.reply ? <div className="mt-4 rounded-[12px] bg-[#FAF9F7] px-4 py-4"><p className="font-comfortaa text-[12px] font-bold text-[#8B6357]">Your reply</p><p className="mt-2 font-comfortaa text-[13px] text-[#4A2C55]">{review.reply}</p></div> : <>
          <OrangeButton type="button" variant="outline" size="standard" onClick={() => { setReplying(true); setReplyText(""); }} className="mt-[20px] h-[48px] w-full">
            <span className="flex items-center justify-center gap-2 font-comfortaa text-[15px] font-bold leading-[22.5px] text-[#E67E22]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 5L3 8L6 11M3.5 8H9.25C11.3211 8 13 9.67893 13 11.75V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Reply</span>
            </span>
          </OrangeButton>
        </>}
        <div className="mt-[11px] flex justify-center">
          <GroomerLinkButton type="button" onClick={() => setReportOpen(true)}>
            <span className="font-comfortaa text-[13px] leading-[19.5px] text-[#8B6357] underline decoration-from-font">Report review</span>
          </GroomerLinkButton>
        </div>
  </article>

  <ReportReviewModal open={reportOpen} reason={reportReason} evidenceName={reportEvidence?.name ?? ""} onReasonChange={setReportReason} onEvidenceChange={setReportEvidence} onSubmit={submitReport} isSubmitting={submittingReport} onClose={closeReport} />
  </>;
}

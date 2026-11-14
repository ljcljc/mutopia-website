import { useEffect, useRef, useState } from "react";
import { ClientReviewCard } from "@/modules/groomer/components/ClientReviewCard";
import type { GroomerReview } from "@/modules/groomer/utils/performance";

const WINDOW_MS = 72 * 60 * 60 * 1000;

export function RecentClientFeedback({ reviews, requestedReviewId, showReviews = false, onReply }: {
  reviews: GroomerReview[];
  requestedReviewId?: number | null;
  showReviews?: boolean;
  onReply: (reviewId: number, reply: string) => void;
}) {
  const [asOf] = useState(() => Date.now());
  const sectionRef = useRef<HTMLElement>(null);
  const recentReviews = reviews.filter((review) => {
    const created = Date.parse(review.createdAt);
    return Number.isFinite(created) && created <= asOf && created >= asOf - WINDOW_MS;
  }).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const requestedIsOutside = requestedReviewId != null && !recentReviews.some((review) => review.reviewId === requestedReviewId);

  useEffect(() => {
    if (showReviews || requestedIsOutside) sectionRef.current?.scrollIntoView({ block: "start" });
  }, [showReviews, requestedIsOutside]);

  return <section ref={sectionRef} className="mt-[26px] lg:mt-5">
    <h2 className="px-2 font-comfortaa text-[18px] font-bold leading-[27px] text-white">Client feedback in 72 hours</h2>
    {requestedIsOutside && <p className="mt-3 px-2 font-comfortaa text-sm text-white">This review is outside the last 72 hours or unavailable.</p>}
    {recentReviews.length === 0 && <article className="mt-[15px] rounded-[24px] bg-white px-5 py-5 font-comfortaa text-[14px] text-[#8B6357]">No client feedback in the last 72 hours.</article>}
    <div className="space-y-4">
      {recentReviews.map((review) => <ClientReviewCard key={review.reviewId} review={review} onReply={onReply} autoReply={review.reviewId === requestedReviewId} className="mt-[15px] rounded-[24px] bg-white px-5 py-5 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] lg:px-6 lg:py-6" />)}
    </div>
  </section>;
}

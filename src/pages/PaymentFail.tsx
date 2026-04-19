import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, PurpleButton } from "@/components/common";
import { createDepositSession } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

export default function PaymentFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryPayment = async () => {
    if (isRetrying) return;

    const bookingIdFromQuery = searchParams.get("booking_id");
    const persistedBookingId = sessionStorage.getItem("pendingDepositBookingId");
    const bookingId = Number(bookingIdFromQuery ?? persistedBookingId);

    if (!Number.isFinite(bookingId) || bookingId <= 0) {
      toast.error("Booking not found. Please start payment again from booking detail.");
      navigate("/account/dashboard");
      return;
    }

    try {
      setIsRetrying(true);
      const paymentSession = await createDepositSession(bookingId);
      window.location.assign(paymentSession.url);
    } catch (error) {
      console.error("Failed to retry payment:", error);
      toast.error("Failed to restart payment. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoToAccount = () => {
    navigate("/account/dashboard");
  };

  return (
    <div className="relative flex min-h-full w-full flex-col items-center gap-8 bg-[#f9f1e8] px-4 pb-15 pt-10 md:gap-15 md:px-0 md:pt-15 md:pb-25">
      <div className="relative flex w-full max-w-[780px] shrink-0 flex-col items-start gap-8">
        {/* Failure Header */}
        <div className="flex w-full flex-col items-center">
          <div className="mb-1 flex size-10 items-center justify-center rounded-[20px] bg-[#DE1507] md:mb-4 md:size-20 md:rounded-full">
            <Icon name="alert-error" className="size-5 text-white md:size-12" />
          </div>
          <h1 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4C4C4C] md:text-2xl md:font-bold md:text-[#4a3c2a]">
            Payment was unsuccessful.
          </h1>
        </div>

        {/* Error Details Card */}
        <div className="w-full rounded-xl bg-white p-6 shadow-lg md:rounded-2xl md:shadow-lg">
          <div className="flex flex-col gap-4">
            <h2 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4a5565] md:text-xl md:font-bold md:text-[#4a3c2a]">
              What happened?
            </h2>
            <p className="font-comfortaa text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:text-base md:leading-[24px] md:font-normal">
              We were unable to process your payment. This could be due to:
            </p>
            <ul className="font-comfortaa list-disc space-y-1 pl-4.5 text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:space-y-2 md:pl-5 md:text-base md:leading-[24px] md:font-normal">
              <li>Insufficient funds in your account</li>
              <li>Card expiration or incorrect card details</li>
              <li>Network connectivity issues</li>
              <li>Bank security restrictions</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-5 md:flex-row md:justify-between md:gap-4">
          <OrangeButton
            size="medium"
            onClick={handleGoToAccount}
            className="flex w-full items-center gap-2 md:h-12 md:w-auto md:px-7 md:py-3.5"
          >
            <span>Go to My account</span>
          </OrangeButton>

          <PurpleButton
            variant="primary"
            size="medium"
            onClick={handleRetryPayment}
            loading={isRetrying}
            className="w-full md:h-12 md:w-auto md:px-7 md:py-3.5"
          >
            Try again
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

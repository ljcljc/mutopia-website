import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, PurpleButton } from "@/components/common";

export default function PaymentFail() {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    // Navigate back to booking flow or payment page
    navigate("/booking");
  };

  const handleGoToAccount = () => {
    navigate("/account");
  };

  return (
    <div className="relative flex min-h-full w-full flex-col items-center gap-8 bg-[#f9f1e8] px-4 pt-10 pb-[60px] md:gap-[60px] md:px-0 md:pt-[60px] md:pb-[100px]">
      <div className="relative flex w-full max-w-[780px] shrink-0 flex-col items-start gap-8">
        {/* Failure Header */}
        <div className="flex flex-col items-center w-full">
          <div className="mb-1 flex size-10 items-center justify-center rounded-[20px] bg-[#DE1507] md:mb-4 md:size-20 md:rounded-full">
            <Icon name="alert-error" className="size-[20px] md:size-12 text-white" />
          </div>
          <h1 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4C4C4C] md:text-2xl md:font-bold md:text-[#4a3c2a]">
            Payment was unsuccessful.
          </h1>
        </div>

        {/* Error Details Card */}
        <div className="w-full rounded-xl bg-white p-6 shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] md:rounded-2xl md:shadow-lg">
          <div className="flex flex-col gap-4">
            <h2 className="font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4a5565] md:text-xl md:font-bold md:text-[#4a3c2a]">
              What happened?
            </h2>
            <p className="font-comfortaa text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:text-base md:leading-[24px] md:font-normal">
              We were unable to process your payment. This could be due to:
            </p>
            <ul className="font-comfortaa list-disc space-y-1 pl-[18px] text-[12px] leading-[16px] font-bold text-[#4A3C2A] md:space-y-2 md:pl-5 md:text-base md:leading-[24px] md:font-normal">
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
            className="flex items-center gap-2 w-full md:w-auto md:h-[48px] md:px-[28px] md:py-[14px]"
          >
            <span>Go to My account</span>
          </OrangeButton>

          <PurpleButton
            variant="primary"
            size="medium"
            onClick={handleRetryPayment}
            className="w-full md:w-auto md:h-[48px] md:px-[28px] md:py-[14px]"
          >
            Try again
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

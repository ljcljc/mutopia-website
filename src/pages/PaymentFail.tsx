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
    <div className="box-border content-stretch flex flex-col gap-[32px] md:gap-[60px] items-center pb-[60px] md:pb-[100px] pt-[40px] md:pt-[60px] px-[16px] md:px-0 w-full min-h-full relative bg-[#f9f1e8]">
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full max-w-[780px]">
        {/* Failure Header */}
        <div className="flex flex-col items-center w-full">
          <div className="w-[40px] h-[40px] md:w-20 md:h-20 bg-[#DE1507] rounded-[20px] md:rounded-full flex items-center justify-center mb-[4px] md:mb-4">
            <Icon name="alert-error" className="size-[20px] md:size-12 text-white" />
          </div>
          <h1 className="text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4C4C4C] md:text-2xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:text-[#4a3c2a]">
            Payment was unsuccessful.
          </h1>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-[12px] md:rounded-[16px] p-[24px] md:p-6 md:shadow-lg shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-[16px] leading-[28px] font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4a5565] md:text-xl md:font-['Comfortaa:Bold',sans-serif] md:font-bold md:text-[#4a3c2a]">
              What happened?
            </h2>
            <p className="text-[12px] leading-[16px] md:text-base md:leading-[24px] text-[#4A3C2A] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Regular',sans-serif] font-bold md:font-normal">
              We were unable to process your payment. This could be due to:
            </p>
            <ul className="list-disc pl-[18px] md:pl-5 space-y-[4px] md:space-y-2 text-[12px] leading-[16px] md:text-base md:leading-[24px] text-[#4A3C2A] font-['Comfortaa:Bold',sans-serif] md:font-['Comfortaa:Regular',sans-serif] font-bold md:font-normal">
              <li>Insufficient funds in your account</li>
              <li>Card expiration or incorrect card details</li>
              <li>Network connectivity issues</li>
              <li>Bank security restrictions</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-[20px] md:gap-4 md:justify-between w-full">
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

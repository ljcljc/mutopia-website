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
    <div className="box-border content-stretch flex flex-col gap-[60px] items-center pb-[100px] pt-[60px] px-0 w-full min-h-full relative bg-[#f9f1e8]">
      <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-[780px] max-w-[780px]">
        {/* Failure Header */}
        <div className="flex flex-col items-center mb-8 w-full">
          <div className="w-20 h-20 bg-[#DE1507] rounded-full flex items-center justify-center mb-4">
            <Icon name="alert-error" className="size-12 text-white" />
          </div>
          <h1 className="text-2xl font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">
            Payment was unsuccessful.
          </h1>
        </div>

        {/* Error Details Card */}
        <div className="bg-white rounded-[16px] p-6 md:p-8 mb-8 shadow-lg w-full">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-['Comfortaa:Bold',sans-serif] font-bold text-[#4a3c2a]">
              What happened?
            </h2>
            <p className="text-base text-[#4A3C2A] font-['Comfortaa:Regular',sans-serif] font-normal">
              We were unable to process your payment. This could be due to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-base text-[#4A3C2A] font-['Comfortaa:Regular',sans-serif] font-normal">
              <li>Insufficient funds in your account</li>
              <li>Card expiration or incorrect card details</li>
              <li>Network connectivity issues</li>
              <li>Bank security restrictions</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between w-full">
          <OrangeButton
            size="standard"
            onClick={handleGoToAccount}
            className="flex items-center gap-2"
          >
            <Icon name="button-arrow" className="size-4 rotate-180" />
            <span>Go to My account</span>
          </OrangeButton>

          <PurpleButton
            variant="primary"
            size="standard"
            onClick={handleRetryPayment}
          >
            Try again
          </PurpleButton>
        </div>
      </div>
    </div>
  );
}

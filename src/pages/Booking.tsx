import { useEffect } from "react";
import { ProgressSteps } from "@/components/booking/ProgressSteps";
import { OrangeButton } from "@/components/common/OrangeButton";
import { Icon } from "@/components/common/Icon";
import { useAuthStore } from "@/components/auth/authStore";
import { useBookingStore } from "@/components/booking/bookingStore";
import { Step1AddressAndServiceType } from "@/components/booking/Step1AddressAndServiceType";
import { Step2 } from "@/components/booking/Step2";
import { Step3 } from "@/components/booking/Step3";
import { Step4 } from "@/components/booking/Step4";
import { Step5 } from "@/components/booking/Step5";
import { Step6 } from "@/components/booking/Step6";
import { STEP_TITLES } from "@/components/booking/stepTitles";

export default function Booking() {
  const user = useAuthStore((state) => state.user);
  const { currentStep, nextStep, petName } = useBookingStore();

  // 当用户登出时，清空 bookingStore 的 userInfo
  // 注意：用户信息加载由 LoginModalContent 统一处理，这里不需要调用 API
  useEffect(() => {
    if (!user) {
      useBookingStore.setState({ userInfo: null });
    }
  }, [user]);

  // Render step component based on current step
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1AddressAndServiceType />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return <Step6 />;
      default:
        return <Step1AddressAndServiceType />;
    }
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-[60px] items-center pt-[32px] pb-[60px] sm:pt-[60px] sm:pb-[100px] px-0 w-full min-h-full relative bg-[#f9f1e8]">
      {/* Content */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full max-w-[780px]">
        {/* Progress Steps */}
        <div className="hidden sm:block w-full">
          <ProgressSteps
            currentStep={currentStep}
            totalSteps={6}
            title={
              currentStep === 3 && petName
                ? `${petName} - package and add-on`
                : STEP_TITLES[currentStep] || "Address and service type"
            }
          />
        </div>

        {/* Main Form */}
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
          {renderStepComponent()}

          {/* Continue Button - Only show for Step 1 */}
          {currentStep === 1 && (
            <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full px-[20px] sm:px-0">
              <OrangeButton size="medium" onClick={nextStep} className="w-full sm:w-auto">
                <div className="flex gap-[4px] items-center">
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-white">
                    Continue
                  </p>
                  <Icon
                    name="button-arrow"
                    aria-label="Arrow"
                    className="size-[14px] text-white"
                  />
                </div>
              </OrangeButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ProgressSteps } from "@/components/booking/steps";
import { LoginModal } from "@/components/auth/LoginModal";
import { OrangeButton } from "@/components/common/OrangeButton";
import { Icon } from "@/components/common/Icon";
import { Input } from "@/components/ui/input";

export default function Booking() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const city = "Autofilled";
  const province = "BC";
  const postCode = "Autofilled";

  return (
    <div className="box-border content-stretch flex flex-col gap-[60px] items-center pb-[100px] pt-[60px] px-0 relative size-full bg-[#f9f1e8]">
      {/* Content */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[780px] max-w-[780px] px-4">
        {/* Progress Steps */}
        <ProgressSteps
          currentStep={1}
          totalSteps={6}
          title="Address and service type"
        />

        {/* Main Form */}
        <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
            {/* Form Card */}
            <div className="bg-white box-border content-stretch flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                {/* Section Header */}
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-min whitespace-pre-wrap">
                    Tell us your location
                  </p>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                    This helps us find a groomer near you
                  </p>
                </div>

                {/* Login Section */}
                <div className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[7px] items-center relative shrink-0">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                      Have an account already?
                    </p>
                  </div>
                  <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                    <button
                      className="bg-neutral-100 border-2 border-[#633479] border-solid box-border content-stretch flex gap-[8px] w-[191px] h-[36px] items-center justify-center px-[30px] py-[16px] relative rounded-[32px] shrink-0 cursor-pointer hover:bg-[#f2dfcf] active:bg-[#f2dfcf] focus-visible:bg-[#f2dfcf] transition-colors"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] text-[#633479] text-[14px]">
                        Log in
                      </p>
                    </button>
                  </LoginModal>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border border-[#bedbff] border-solid h-[36px] relative rounded-[8px] shrink-0 w-fit">
                  <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      {/* Info Icon */}
                      <div className="relative shrink-0 size-[12px]">
                        <Icon
                          name="alert-info"
                          aria-label="Info"
                          className="block size-full text-[#ffffff]"
                        />
                      </div>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#193cb8] text-[10px] whitespace-nowrap">
                        We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Input */}
                <div className="content-stretch flex gap-[20px] items-end relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[20px] items-start relative shrink-0 flex-1">
                    <div className="content-stretch flex flex-1 flex-col items-start relative shrink-0">
                      <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full mb-2">
                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                          Address
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 border-solid h-[36px] relative rounded-[12px] shrink-0 w-[320px]">
                        <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                          <div className="content-stretch flex flex-1 items-center min-h-px min-w-px relative shrink-0">
                            <Input
                              type="text"
                              placeholder="Enter your address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="flex-1 h-auto font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] text-[#717182] text-[12.25px] bg-transparent border-none outline-none placeholder:text-[#717182] p-0"
                            />
                            <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity" title="Use current location">
                              <Icon
                                name="location"
                                aria-label="Use current location"
                                className="block size-full text-[#de6a07]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* City and Province */}
                <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[200px]">
                    <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full mb-2">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                        City
                      </p>
                    </div>
                    <div className="bg-gray-200 border border-gray-200 border-solid h-[36px] relative rounded-[12px] shrink-0 w-full">
                      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                        <div className="content-stretch flex flex-1 items-center min-h-px min-w-px relative shrink-0">
                          <p className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[12.25px] whitespace-pre-wrap">
                            {city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[100px]">
                    <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full mb-2">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                        Province
                      </p>
                    </div>
                    <div className="bg-gray-200 border border-gray-200 border-solid h-[36px] relative rounded-[12px] shrink-0 w-full">
                      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                        <div className="content-stretch flex flex-1 items-center min-h-px min-w-px relative shrink-0">
                          <p className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[12.25px] whitespace-pre-wrap">
                            {province}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Code */}
                <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[200px]">
                    <div className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full mb-2">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[14px]">
                        Post code
                      </p>
                    </div>
                    <div className="bg-gray-200 border border-gray-200 border-solid h-[36px] relative rounded-[12px] shrink-0 w-full">
                      <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                        <div className="content-stretch flex flex-1 items-center min-h-px min-w-px relative shrink-0">
                          <p className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#4c4c4c] text-[12.25px] whitespace-pre-wrap">
                            {postCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="content-stretch flex gap-[20px] items-start relative shrink-0">
            <OrangeButton size="medium">
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
        </div>
      </div>
    </div>
  );
}

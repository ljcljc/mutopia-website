import { LoginModal } from "@/components/auth/LoginModal";
import { Icon } from "@/components/common/Icon";
import { CustomInput } from "@/components/common";
import { useAuthStore } from "@/components/auth/authStore";
import { useBookingStore } from "./bookingStore";

export function Step1AddressAndServiceType() {
  const user = useAuthStore((state) => state.user);
  const {
    address,
    serviceType,
    city,
    province,
    postCode,
    isLoginModalOpen,
    userInfo,
    setAddress,
    setServiceType,
    setIsLoginModalOpen,
  } = useBookingStore();

  // Auto-fill city, province, postcode based on address (mock data for now)
  const displayCity = userInfo?.address ? city : "Autofilled";
  const displayPostCode = userInfo?.address ? postCode : "Autofilled";
  const infoText = userInfo?.address 
    ? "We currently provide mobile grooming services throughout Vancouver and surrounding areas."
    : "We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.";

  return (
    <>
      <div className="content-stretch flex flex-col gap-[24px] items-start relative w-full">
        {/* Form Card */}
        <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="flex flex-col gap-[20px] items-start relative w-full">
            {/* Section Header */}
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-min whitespace-pre-wrap">
                Tell us your location
              </p>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                This helps us find a groomer near you
              </p>
            </div>

            {/* Login Section - Only show if user is not logged in */}
            {!user && (
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
            )}

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
                    {infoText}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Input */}
            {user && userInfo?.address ? (
              <div className="flex flex-col items-start relative w-[320px]">
                <div className="flex gap-[7px] items-center relative mb-2">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative text-[#4a3c2a] text-[14px]">
                    Address
                  </p>
                </div>
                <div className="bg-white border border-gray-200 border-solid h-[36px] relative rounded-[8px] w-[320px]">
                  <div className="box-border flex h-[36px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] w-full">
                    <div className="flex flex-1 items-center relative">
                      <div className="overflow-clip relative shrink-0 size-[24px]">
                        <Icon
                          name="location"
                          aria-label="Location"
                          className="block size-full text-[#de6a07]"
                        />
                      </div>
                      <p className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative text-[#717182] text-[12.25px] ml-[4px]">
                        {address || "123 abc street"}
                      </p>
                      <div className="h-[6.375px] relative shrink-0 w-[11.25px] cursor-pointer hover:opacity-80 transition-opacity">
                        <Icon
                          name="chevron-down"
                          aria-label="Dropdown"
                          className="block size-full text-[#717182]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-[320px]">
                <CustomInput
                  label="Address"
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rightElement={
                    <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity ml-2" title="Use current location">
                      <Icon
                        name="location"
                        aria-label="Use current location"
                        className="block size-full text-[#de6a07]"
                      />
                    </div>
                  }
                />
              </div>
            )}

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
                        {displayCity}
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
                        {displayPostCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Type Selection - Only show if user is logged in */}
            {user && (
              <div className="flex flex-col gap-[8px] items-start relative w-full">
                <div className="flex gap-[7px] items-center relative w-full">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative text-[#4a3c2a] text-[14px]">
                    Service type
                  </p>
                </div>
                <div className="flex gap-[16px] items-stretch relative w-full">
                  {/* Mobile Option */}
                  <button
                    type="button"
                    onClick={() => setServiceType("mobile")}
                    className={`border-2 border-solid box-border flex flex-col items-center justify-center p-[16px] relative rounded-[14px] w-auto cursor-pointer transition-colors ${
                      serviceType === "mobile"
                        ? "border-[#8b6357] bg-[rgba(139,99,87,0.05)]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col gap-[12px] items-center justify-center relative w-full">
                      <div className="flex gap-[8px] items-center justify-center relative w-full">
                        <div className="relative size-[16px]">
                          <div
                            className={`size-[16px] rounded-full border-2 ${
                              serviceType === "mobile"
                                ? "border-[#8b6357] bg-[#8b6357]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {serviceType === "mobile" && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[6px] rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-[4px] items-center relative">
                          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[21px] relative text-[14px] text-[#8b6357]">
                            Mobile
                          </p>
                          <div className="flex items-center justify-center relative h-[24px]">
                            <div className="h-[18.164px] relative w-[24px]">
                              <Icon
                                name="van"
                                aria-label="Van"
                                className="block size-full text-[#8b6357]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* In Store Option */}
                  <button
                    type="button"
                    onClick={() => setServiceType("instore")}
                    className={`border-2 border-solid box-border flex flex-col items-center justify-center p-[16px] relative rounded-[14px] w-auto cursor-pointer transition-colors ${
                      serviceType === "instore"
                        ? "border-[#8b6357] bg-[rgba(139,99,87,0.05)]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col gap-[12px] items-center justify-center relative w-full">
                      <div className="flex gap-[8px] items-center justify-center relative w-full">
                        <div className="relative size-[16px]">
                          <div
                            className={`size-[16px] rounded-full border-2 ${
                              serviceType === "instore"
                                ? "border-[#8b6357] bg-[#8b6357]"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {serviceType === "instore" && (
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[6px] rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-[4px] items-center relative">
                          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[21px] relative text-[14px] text-[#8b6357]">
                            In store
                          </p>
                          <div className="flex items-center justify-center relative h-[24px]">
                            <div className="relative size-[24px]">
                              <Icon
                                name="shop"
                                aria-label="Shop"
                                className="block size-full text-[#8b6357]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


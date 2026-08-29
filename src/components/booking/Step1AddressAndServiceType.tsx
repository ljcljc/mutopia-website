import { useEffect, useMemo, useRef, useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Icon } from "@/components/common/Icon";
import { CustomInput, CustomRadio, CustomSelect, CustomSelectItem } from "@/components/common";
import { OrangeButton } from "@/components/common/OrangeButton";
import { useAuthStore } from "@/components/auth/authStore";
import { formatCanadianPostalCodeInput, getCanadianPostalCodeError } from "@/lib/postalCode";
import { useBookingStore } from "./bookingStore";
import { getServiceAreaProvinces, getServiceAreas, type ProvinceOut, type ServiceAreaOut } from "@/lib/api";

type Step1Field = "address" | "city" | "postCode";
type Step1Errors = Partial<Record<Step1Field, string>>;

const DEFAULT_PROVINCE_CODE = "BC";
const DEFAULT_PROVINCE_NAME = "British Columbia";

export function Step1AddressAndServiceType() {
  const user = useAuthStore((state) => state.user);
  const {
    address,
    serviceType,
    city,
    province,
    postCode,
    selectedServiceAreaId,
    isLoginModalOpen,
    selectedAddressId,
    addresses,
    setAddress,
    setServiceType,
    setCity,
    setProvince,
    setPostCode,
    setSelectedServiceAreaId,
    setSelectedAddressId,
    loadAddresses,
    setIsLoginModalOpen,
    nextStep,
  } = useBookingStore();

  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceOut[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaOut[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [errors, setErrors] = useState<Step1Errors>({});
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef(city);

  useEffect(() => {
    cityRef.current = city;
  }, [city]);

  useEffect(() => {
    if (!province) {
      setProvince(DEFAULT_PROVINCE_CODE);
    }
  }, [province, setProvince]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddressDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 加载地址列表（如果用户已登录）
  useEffect(() => {
    if (user) {
      loadAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const loadProvinces = async () => {
      try {
        const data = await getServiceAreaProvinces();
        if (!cancelled) {
          setProvinces(data);
        }
      } catch (error) {
        console.error("Failed to load provinces:", error);
      }
    };
    void loadProvinces();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!province) {
      setServiceAreas([]);
      return;
    }
    let cancelled = false;
    const loadAreas = async () => {
      setIsLoadingAreas(true);
      try {
        const data = await getServiceAreas({ province_code: province });
        if (!cancelled) {
          setServiceAreas(data);
          if (cityRef.current && !data.some((item) => item.city === cityRef.current)) {
            setCity("");
            setSelectedServiceAreaId(null);
          }
        }
      } catch (error) {
        console.error("Failed to load service areas:", error);
        if (!cancelled) {
          setServiceAreas([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingAreas(false);
        }
      }
    };
    void loadAreas();
    return () => {
      cancelled = true;
    };
  }, [province, setCity, setSelectedServiceAreaId]);

  // 根据服务类型显示不同的信息文本
  const infoText = "We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.";

  // 获取当前显示的地址或门店
  const currentAddress =
    (serviceType === "mobile" || serviceType === "in_home") && selectedAddressId
      ? addresses.find((addr) => addr.id === selectedAddressId)
      : null;
  const selectableAddresses = addresses.filter((addr) => addr.service_type !== "in_store");

  const selectedProvinceName = useMemo(
    () => provinces.find((item) => item.code === province)?.name ?? province,
    [province, provinces],
  );

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity("");
    setSelectedServiceAreaId(null);
    if (selectedAddressId !== null) {
      setSelectedAddressId(null);
    }
  };

  const handleCityChange = (value: string) => {
    const selectedArea = serviceAreas.find((item) => item.id === Number(value));
    if (!selectedArea) return;
    setSelectedServiceAreaId(selectedArea.id);
    setCity(selectedArea.city);
    setProvince(selectedArea.province_code);
    if (selectedAddressId !== null) {
      setSelectedAddressId(null);
    }
    setErrors((current) => ({ ...current, city: undefined }));
  };

  const getErrors = (): Step1Errors => {
    return {
      ...((selectedAddressId === null && !address.trim()) ? { address: "Address is required" } : {}),
      ...(!selectedServiceAreaId || !city.trim() ? { city: "Select a city" } : {}),
      ...(getCanadianPostalCodeError(postCode) ? { postCode: getCanadianPostalCodeError(postCode) } : {}),
    };
  };

  const validateAndContinue = () => {
    const nextErrors = getErrors();
    setErrors(nextErrors);
    const firstField = Object.keys(nextErrors)[0] as Step1Field | undefined;
    if (!firstField) {
      nextStep();
      return;
    }
    const element = document.querySelector<HTMLElement>(`[data-booking-field="${firstField}"]`);
    element?.scrollIntoView?.({ behavior: "smooth", block: "center" });
    element?.querySelector<HTMLElement>("input, button")?.focus();
  };

  const clearError = (field: Step1Field) => {
    setErrors((current) => current[field] ? { ...current, [field]: undefined } : current);
  };

  // displayCity, displayProvince, displayPostCode are no longer needed
  // as the input fields now directly use city, province, postCode from store

  const locationField =
    (serviceType === "mobile" || serviceType === "in_home") && user && addresses.length > 0 ? (
      <div data-booking-field="address" className="flex flex-col items-start relative w-full sm:w-[320px]">
        <div className="relative mb-2 flex items-center gap-[7px]">
          <p className="relative font-comfortaa text-[14px] leading-[22.75px] font-normal text-[#4a3c2a]">
            Address
          </p>
        </div>
        <div className="relative w-full sm:w-[320px]" ref={addressDropdownRef}>
          <div className={`relative h-9 w-full rounded-lg border border-solid bg-white transition-colors hover:border-[#633479] ${errors.address ? "border-[#de1507]" : "border-gray-200"}`}>
            <div className="relative flex h-9 w-full items-center overflow-clip rounded-[inherit] px-3 py-1">
              <div className="relative flex flex-1 items-center">
                <input
                  type="text"
                  value={currentAddress?.address || address || ""}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (e.target.value.trim()) clearError("address");
                    if (selectedAddressId !== null) {
                      setSelectedAddressId(null);
                    }
                  }}
                  onFocus={() => setIsAddressDropdownOpen(true)}
                  onBlur={() => setErrors(getErrors())}
                  placeholder="Select an address or type"
                  className="flex-1 font-comfortaa font-normal leading-[normal] relative text-[#717182] text-[12.25px] bg-transparent border-none outline-none placeholder:text-[#717182]"
                />
                <div
                  className="relative w-4 shrink-0 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddressDropdownOpen(!isAddressDropdownOpen);
                  }}
                >
                  <Icon
                    name="chevron-down"
                    aria-label="Dropdown"
                    className={`block size-full text-[#717182] transition-transform ${
                      isAddressDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          {isAddressDropdownOpen && (
            <div className="absolute z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {selectableAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`cursor-pointer px-3 py-2 transition-colors hover:bg-gray-50 ${
                    selectedAddressId === addr.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedAddressId(addr.id);
                    setIsAddressDropdownOpen(false);
                    clearError("address");
                  }}
                >
                  <p className="font-comfortaa text-[12.25px] text-[#4a3c2a]">{addr.address}</p>
                  <p className="font-comfortaa text-[10px] text-[#717182] mt-1">
                    {addr.city}, {addr.province} {addr.postal_code}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.address && <p role="alert" className="mt-1 text-xs text-[#de1507]">{errors.address}</p>}
      </div>
    ) : (
      <div data-booking-field="address" className="w-full sm:w-[320px]">
        <CustomInput
          label="Address"
          type="text"
          placeholder="Enter your address"
          value={address}
          error={errors.address}
          onChange={(e) => { setAddress(e.target.value); if (e.target.value.trim()) clearError("address"); }}
          onBlur={() => setErrors(getErrors())}
        />
      </div>
    );

  return (
    <>
      <div className="relative flex w-full flex-col items-start gap-4 px-5 sm:px-0">
        {/* Mobile Step Header */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-3 sm:hidden">
          <p className="relative h-[19px] w-full shrink-0 whitespace-pre-wrap font-comfortaa text-[12px] leading-[17.5px] font-bold text-black">
            Book your appointment
          </p>
          <div className="relative flex h-6 shrink-0 items-center justify-center overflow-clip rounded-xl border border-solid border-[#4c4c4c] px-[9px] py-[5px]">
            <p className="relative shrink-0 font-comfortaa text-[10px] leading-[14px] font-bold text-[#4c4c4c]">
              Step 1 of 6
            </p>
          </div>
          <p className="relative w-[min-content] min-w-full shrink-0 whitespace-pre-wrap font-comfortaa text-[16px] leading-[28px] font-semibold text-[#4a3c2a]">
            Address and service type
          </p>
        </div>
        {/* Form Card */}
        <div className="relative flex w-full flex-col items-start gap-4 rounded-xl bg-white p-6 shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)]">
          <div className="relative flex w-full flex-col items-start gap-4">
            {/* Section Header */}
            <div className="flex flex-col items-start relative shrink-0 w-full">
              <p className="font-comfortaa font-semibold leading-[28px] min-w-full relative shrink-0 text-[#4a3c2a] text-[16px] w-min whitespace-pre-wrap">
                Tell us your location
              </p>
              <p className="font-comfortaa font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                This helps us find a groomer near you
              </p>
            </div>

            {/* Login Section - Only show if user is not logged in */}
            {!user && (
              <div className="flex flex-col items-start justify-end relative shrink-0 w-full">
                <div className="relative flex shrink-0 items-center gap-[7px]">
                  <p className="relative shrink-0 font-comfortaa text-[14px] leading-[22.75px] font-normal text-[#4a3c2a]">
                    Have an account already?
                  </p>
                </div>
                <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                  <button
                    className="relative flex h-9 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[32px] border-2 border-solid border-[#633479] bg-neutral-100 px-[30px] py-4 transition-colors hover:bg-[#f2dfcf] focus-visible:bg-[#f2dfcf] active:bg-[#f2dfcf] sm:w-[191px]"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    <p className="font-comfortaa font-bold leading-[20px] text-[#633479] text-[14px]">
                      Log in
                    </p>
                  </button>
                </LoginModal>
              </div>
            )}

            {/* Info Alert */}
            <div className="relative rounded-lg border border-solid border-[#bedbff] bg-[#eff6ff]">
              <div className="relative flex items-center overflow-clip rounded-[inherit] px-4 py-2">
                <div className="relative flex min-w-0 w-full items-start gap-2">
                  {/* Info Icon */}
                  <div className="relative size-3 shrink-0">
                    <Icon
                      name="alert-info"
                      aria-label="Info"
                      className="block size-full text-[#2374FF]"
                    />
                  </div>
                  <p className="font-comfortaa font-normal leading-[12px] relative text-[#193cb8] text-[10px] whitespace-normal break-words min-w-0">
                    {infoText}
                  </p>
                </div>
              </div>
            </div>

            {/* City and Province */}
            <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[20px] items-start relative shrink-0 w-full">
              <div className="flex flex-col items-start relative shrink-0 w-full sm:w-[160px]">
                <CustomSelect
                  label="Province"
                  placeholder="Select province"
                  value={province}
                  displayValue={selectedProvinceName || DEFAULT_PROVINCE_NAME}
                  onValueChange={handleProvinceChange}
                  disabled={true}
                >
                  {provinces.map((item) => (
                    <CustomSelectItem key={item.code} value={item.code}>
                      {item.name}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
              <div data-booking-field="city" className="flex flex-col items-start relative shrink-0 w-full sm:w-[192px]">
                <CustomSelect
                  label="City"
                  placeholder={province ? "Select city" : "Select province first"}
                  value={selectedServiceAreaId ? String(selectedServiceAreaId) : ""}
                  displayValue={city || undefined}
                  onValueChange={handleCityChange}
                  error={errors.city}
                  disabled={!province || isLoadingAreas}
                >
                  {serviceAreas.map((item) => (
                    <CustomSelectItem key={item.id} value={String(item.id)}>
                      {item.city}
                    </CustomSelectItem>
                  ))}
                </CustomSelect>
              </div>
            </div>

            {/* Address/Store Selection */}
            {locationField}

            {/* Post Code */}
            <div className="flex gap-[20px] items-start relative shrink-0 w-full">
              <div data-booking-field="postCode" className="flex flex-col items-start relative shrink-0 w-full sm:w-[192px]">
                <CustomInput
                  label="Post code"
                  type="text"
                  placeholder="Enter post code"
                  value={postCode}
                  error={errors.postCode}
                  onChange={(e) => {
                    const nextValue = formatCanadianPostalCodeInput(e.target.value);
                    setPostCode(nextValue);
                    if (errors.postCode) {
                      setErrors((current) => ({ ...current, postCode: getCanadianPostalCodeError(nextValue) || undefined }));
                    }
                  }}
                  onBlur={() => {
                    setErrors((current) => ({ ...current, postCode: getCanadianPostalCodeError(postCode) || undefined }));
                  }}
                />
              </div>
            </div>

            {/* Service Type Selection - Only show if user is logged in */}
            {user && (
              <div className="flex flex-col gap-[8px] items-start relative w-full">
                <div className="flex gap-[7px] items-center relative w-full">
                  <p className="font-comfortaa font-normal leading-[22.75px] relative text-[#4a3c2a] text-[14px]">
                    Service type
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-[16px] items-stretch relative w-full sm:flex sm:gap-[16px]">
                  <CustomRadio
                    label="Mobile"
                    icon="van"
                    isSelected={serviceType === "mobile"}
                    onClick={() => setServiceType("mobile")}
                    className="w-full"
                  />
                  <CustomRadio
                    label="In home"
                    icon="home"
                    isSelected={serviceType === "in_home"}
                    onClick={() => setServiceType("in_home")}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex w-full shrink-0 items-start gap-5 px-5 sm:px-0">
        <OrangeButton size="medium" onClick={validateAndContinue} className="w-full sm:w-auto">Continue</OrangeButton>
      </div>
    </>
  );
}

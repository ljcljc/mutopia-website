import { useEffect, useState, useRef } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { Icon } from "@/components/common/Icon";
import { CustomInput, CustomRadio } from "@/components/common";
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
    selectedAddressId,
    selectedStoreId,
    addresses,
    stores,
    setAddress,
    setServiceType,
    setCity,
    setProvince,
    setPostCode,
    setSelectedAddressId,
    setSelectedStoreId,
    loadAddresses,
    loadStores,
    setIsLoginModalOpen,
  } = useBookingStore();

  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const storeDropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAddressDropdownOpen(false);
      }
      if (
        storeDropdownRef.current &&
        !storeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStoreDropdownOpen(false);
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

  // 加载门店列表（如果选择 in_store 服务）
  useEffect(() => {
    if (serviceType === "in_store") {
      loadStores();
    }
  }, [serviceType, loadStores]);

  // 当服务类型改变时，重置选择
  useEffect(() => {
    if (serviceType === "mobile") {
      setSelectedStoreId(null);
    } else if (serviceType === "in_store") {
      setSelectedAddressId(null);
    }
  }, [serviceType, setSelectedAddressId, setSelectedStoreId]);

  // 根据服务类型显示不同的信息文本
  const infoText =
    serviceType === "mobile"
      ? "We currently provide mobile grooming services throughout Vancouver and surrounding areas."
      : "Please select a store location for in-store grooming services.";

  // 获取当前显示的地址或门店
  const currentAddress =
    serviceType === "mobile" && selectedAddressId
      ? addresses.find((addr) => addr.id === selectedAddressId)
      : null;
  const currentStore =
    serviceType === "in_store" && selectedStoreId
      ? stores.find((store) => store.id === selectedStoreId)
      : null;

  // displayCity, displayProvince, displayPostCode are no longer needed
  // as the input fields now directly use city, province, postCode from store

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

            {/* Address/Store Selection */}
            {serviceType === "mobile" && user && addresses.length > 0 ? (
              // 已登录用户选择地址（mobile 服务）- 支持下拉选择和手动输入
              <div className="flex flex-col items-start relative w-[320px]">
                <div className="flex gap-[7px] items-center relative mb-2">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative text-[#4a3c2a] text-[14px]">
                    Address
                  </p>
                </div>
                <div className="relative w-[320px]" ref={addressDropdownRef}>
                  <div className="bg-white border border-gray-200 border-solid h-[36px] relative rounded-[8px] w-full hover:border-[#633479] transition-colors">
                    <div className="box-border flex h-[36px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] w-full">
                      <div className="flex flex-1 items-center relative">
                        <div className="overflow-clip relative shrink-0 size-[24px]">
                          <Icon
                            name="location"
                            aria-label="Location"
                            className="block size-full text-[#de6a07]"
                          />
                        </div>
                        <input
                          type="text"
                          value={currentAddress?.address || address || ""}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            // 当用户手动输入时，清除选中的地址 ID
                            if (selectedAddressId !== null) {
                              setSelectedAddressId(null);
                            }
                          }}
                          onFocus={() => setIsAddressDropdownOpen(true)}
                          placeholder="Select an address or type"
                          className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative text-[#717182] text-[12.25px] ml-[4px] bg-transparent border-none outline-none placeholder:text-[#717182]"
                        />
                        <div 
                          className="relative shrink-0 w-[16px] cursor-pointer"
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
                  {/* Address Dropdown */}
                  {isAddressDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`px-[12px] py-[8px] cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedAddressId === addr.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setSelectedAddressId(addr.id);
                            setIsAddressDropdownOpen(false);
                          }}
                        >
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[12.25px] text-[#4a3c2a]">
                            {addr.address}
                          </p>
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] text-[#717182] mt-1">
                            {addr.city}, {addr.province} {addr.postal_code}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : serviceType === "in_store" && stores.length > 0 ? (
              // 选择门店（in_store 服务）
              <div className="flex flex-col items-start relative w-[320px]">
                <div className="flex gap-[7px] items-center relative mb-2">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative text-[#4a3c2a] text-[14px]">
                    Store Location
                  </p>
                </div>
                <div className="relative w-[320px]" ref={storeDropdownRef}>
                  <div
                    className="bg-white border border-gray-200 border-solid h-[36px] relative rounded-[8px] w-full cursor-pointer hover:border-[#633479] transition-colors"
                    onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                  >
                    <div className="box-border flex h-[36px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] w-full">
                      <div className="flex flex-1 items-center relative">
                        <div className="overflow-clip relative shrink-0 size-[24px]">
                          <Icon
                            name="location"
                            aria-label="Location"
                            className="block size-full text-[#de6a07]"
                          />
                        </div>
                        <p className="flex-1 font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative text-[#717182] text-[12.25px] ml-[4px] truncate">
                          {currentStore?.name || "Select a store"}
                        </p>
                        <div className="h-[6.375px] relative shrink-0 w-[11.25px]">
                          <Icon
                            name="chevron-down"
                            aria-label="Dropdown"
                            className={`block size-full text-[#717182] transition-transform ${
                              isStoreDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Store Dropdown */}
                  {isStoreDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                      {stores.map((store) => (
                        <div
                          key={store.id}
                          className={`px-[12px] py-[8px] cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedStoreId === store.id ? "bg-blue-50" : ""
                          }`}
                          onClick={() => {
                            setSelectedStoreId(store.id);
                            setIsStoreDropdownOpen(false);
                          }}
                        >
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[12.25px] text-[#4a3c2a] font-semibold">
                            {store.name}
                          </p>
                          <p className="font-['Comfortaa:Regular',sans-serif] text-[10px] text-[#717182] mt-1">
                            {store.address}, {store.city}, {store.province}{" "}
                            {store.postal_code}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // 手动输入地址（未登录用户或没有保存的地址）
              <div className="w-[320px]">
                <CustomInput
                  label={serviceType === "in_store" ? "Store Location" : "Address"}
                  type="text"
                  placeholder={
                    serviceType === "in_store"
                      ? "Enter store address"
                      : "Enter your address"
                  }
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rightElement={
                    <div
                      className="overflow-clip relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity ml-2"
                      title="Use current location"
                    >
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
                <CustomInput
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[100px]">
                <CustomInput
                  label="Province"
                  type="text"
                  placeholder="Enter province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                />
              </div>
            </div>

            {/* Post Code */}
            <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[200px]">
                <CustomInput
                  label="Post code"
                  type="text"
                  placeholder="Enter post code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                />
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
                  <CustomRadio
                    label="Mobile"
                    icon="van"
                    isSelected={serviceType === "mobile"}
                    onClick={() => setServiceType("mobile")}
                  />
                  <CustomRadio
                    label="In store"
                    icon="shop"
                    isSelected={serviceType === "in_store"}
                    onClick={() => setServiceType("in_store")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


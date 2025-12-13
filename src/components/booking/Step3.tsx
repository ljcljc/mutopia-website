import { useEffect, useRef, useState, useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { CommonCheckbox, OrangeButton, CustomRadio, Spinner } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { useAuthStore } from "@/components/auth/authStore";
import { LoginModal } from "@/components/auth/LoginModal";
import { cn } from "@/components/ui/utils";
import { getServicePrice } from "@/lib/pricing";

export function Step3() {
  const {
    serviceId,
    services,
    isLoadingServices,
    addOnsList,
    isLoadingAddOns,
    addOns: selectedAddOns,
    userInfo,
    setServiceId,
    toggleAddOn,
    loadServices,
    loadAddOns,
    previousStep,
    nextStep,
    weight,
    weightUnit,
  } = useBookingStore();

  const user = useAuthStore((state) => state.user);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isLoggedIn = userInfo !== null || user !== null;

  const hasLoadedServices = useRef(false);
  const hasLoadedAddOns = useRef(false);
  const hasAutoSelectedMembership = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("Most Popular");
  const [isEstimationExpanded, setIsEstimationExpanded] = useState(false);

  // 监听登录状态，登录成功后关闭弹窗
  // 注意：用户信息加载由 Booking.tsx 统一处理，这里不需要重复调用 loadUserInfo
  useEffect(() => {
    if (user && isLoginModalOpen) {
      // 登录成功后关闭弹窗
      setIsLoginModalOpen(false);
    }
  }, [user, isLoginModalOpen]);

  // 获取服务数据（只加载一次）
  useEffect(() => {
    if (!hasLoadedServices.current) {
      hasLoadedServices.current = true;
      loadServices();
    }
  }, [loadServices]);

  // 获取 add-ons 数据（只加载一次）
  useEffect(() => {
    if (!hasLoadedAddOns.current) {
      hasLoadedAddOns.current = true;
      loadAddOns();
    }
  }, [loadAddOns]);

  // 当 add-ons 加载完成后，自动选中 included_in_membership 为 true 的项（只执行一次）
  // 前提条件：用户已登录且是会员
  useEffect(() => {
    if (
      addOnsList.length > 0 &&
      !hasAutoSelectedMembership.current &&
      userInfo !== null &&
      userInfo.is_member === true
    ) {
      const membershipAddOns = addOnsList
        .filter((addOn) => addOn.included_in_membership === true)
        .map((addOn) => addOn.id);
      
      if (membershipAddOns.length > 0) {
        hasAutoSelectedMembership.current = true;
        // 批量添加选中的 add-ons
        membershipAddOns.forEach((id) => {
          if (!selectedAddOns.includes(id)) {
            toggleAddOn(id);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addOnsList.length, userInfo]); // 在 add-ons 列表长度变化或用户信息变化时执行

  // 从 API 数据中提取所有唯一的 label 值作为标签列表，并确保 "Most Popular" 始终存在
  const categories = useMemo(() => {
    const labels = new Set<string>();
    // 始终添加 "Most Popular"
    labels.add("Most Popular");
    // 添加其他标签
    addOnsList.forEach((addOn) => {
      if (addOn.label && addOn.label !== "Most Popular") {
        labels.add(addOn.label);
      }
    });
    // 确保 "Most Popular" 在第一位
    const sortedLabels = Array.from(labels);
    if (sortedLabels.includes("Most Popular")) {
      const index = sortedLabels.indexOf("Most Popular");
      sortedLabels.splice(index, 1);
      sortedLabels.unshift("Most Popular");
    }
    return sortedLabels;
  }, [addOnsList]);

  // 根据选中的标签过滤 add-ons
  const filteredAddOns = useMemo(() => {
    if (selectedCategory === "Most Popular") {
      // 显示 most_popular 为 true 的条目
      return addOnsList.filter((addOn) => addOn.most_popular === true);
    } else if (selectedCategory) {
      // 根据 label 过滤
      return addOnsList.filter((addOn) => addOn.label === selectedCategory);
    }
    return [];
  }, [addOnsList, selectedCategory]);

  // Calculate prices
  const selectedService = services.find((s) => s.id === serviceId);
  const packagePrice = getServicePrice(selectedService, weight, weightUnit);
  
  // Calculate add-ons price and get selected add-ons details
  // If included_in_membership is true and user is a member, price should be 0
  const selectedAddOnsDetails = useMemo(() => {
    const isMember = userInfo?.is_member === true;
    return selectedAddOns
      .map((addOnId) => {
        const addOn = addOnsList.find((a) => a.id === addOnId);
        if (addOn) {
          let price = typeof addOn.price === "string" ? parseFloat(addOn.price) : addOn.price;
          // If included_in_membership is true and user is a member, price is 0
          if (addOn.included_in_membership === true && isMember) {
            price = 0;
          }
          return { ...addOn, price };
        }
        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [selectedAddOns, addOnsList, userInfo]);

  const addOnsPrice = selectedAddOnsDetails.reduce((total, addOn) => total + addOn.price, 0);
  const totalPrice = packagePrice + addOnsPrice;

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative w-full">
      {/* Service Package Selection */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                  Select your service package
                </p>
              </div>
              <div className="h-[17.5px] relative shrink-0 w-full">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                  Choose the package that best fits your pet's needs
                </p>
              </div>
            </div>
            <div className="gap-[16px] grid grid-cols-2 grid-rows-1 relative shrink-0 w-full">
              {isLoadingServices ? (
                <div className="col-span-2 flex items-center justify-center gap-2 py-8 text-[#4a5565]">
                  <Spinner size="small" color="#4a5565" />
                  <span>Loading services...</span>
                </div>
              ) : services.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-[#4a5565]">
                  No services available
                </div>
              ) : (
                services.map((service) => {
                  const price = getServicePrice(service, weight, weightUnit);
                  return (
                    <CustomRadio
                      key={service.id}
                      variant="package"
                      label={service.name}
                      description={service.description || ""}
                      price={price}
                      duration="" // API 中没有 duration 字段，可以留空或根据 type 推断
                      isSelected={serviceId === service.id}
                      onClick={() => setServiceId(service.id)}
                    />
                  );
                })
              )}
            </div>
        </div>
      </div>

      {/* Add-ons Selection */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                  Enhance your service with add-on (Optional)
                </p>
              </div>
              <div className="h-[17.5px] relative shrink-0 w-full">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                  Add extra pampering for your furry friend
                </p>
              </div>
            </div>
            {/* Category Badges */}
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
              {categories.map((category) => {
                const isSelected = selectedCategory === category;
                return (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "border border-solid h-[24px] relative rounded-[12px] shrink-0 cursor-pointer transition-colors",
                      isSelected
                        ? "bg-white border-[#de6a07]"
                        : "border-[#4c4c4c]"
                    )}
                  >
                    <div className="box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[inherit]">
                      <p
                        className={cn(
                          "font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[10px]",
                          isSelected ? "text-[#de6a07]" : "text-[#4c4c4c]"
                        )}
                      >
                        {category}
                      </p>
                      {isSelected && (
                        <div className="h-[6px] relative shrink-0 w-[9px] flex items-center justify-center">
                          <Icon
                            name="check"
                            className="relative shrink-0 h-[6px] w-[9px] text-[#de6a07]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-[17.5px] relative shrink-0 w-full">
              <p className="absolute font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] left-0 text-[14px] text-[#de6a07] top-[-0.5px]">
                Most popular add-ons
              </p>
            </div>
            {/* Add-ons Grid */}
            <div className="gap-[16px] grid grid-cols-2 relative shrink-0 w-full">
              {isLoadingAddOns ? (
                <div className="col-span-2 flex items-center justify-center gap-2 py-8 text-[#4a5565]">
                  <Spinner size="small" color="#4a5565" />
                  <span>Loading add-ons...</span>
                </div>
              ) : filteredAddOns.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-[#4a5565]">
                  No add-ons available in this category
                </div>
              ) : (
                filteredAddOns.map((addOn) => {
                  const isSelected = selectedAddOns.includes(addOn.id);
                  const price =
                    typeof addOn.price === "string"
                      ? parseFloat(addOn.price)
                      : addOn.price;
                  return (
                    <CommonCheckbox
                      key={addOn.id}
                      name={addOn.name}
                      description={addOn.description || ""}
                      price={price}
                      duration={addOn.service_time || undefined}
                      checked={isSelected}
                      onCheckedChange={() => toggleAddOn(addOn.id)}
                    />
                  );
                })
              )}
            </div>
            {/* Selected Add-ons Count Alert */}
            {selectedAddOns.length > 0 && (
              <div className="bg-[#f4ffde] border border-[#6aa31c] border-solid content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[8px] shrink-0">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                  <Icon
                    name="alert-success"
                    className="relative shrink-0 size-[12px] text-[#6aa31c]"
                  />
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#467900] text-[10px]">
                    {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              </div>
            )}
            {/* Selected Add-ons Tags */}
            {selectedAddOns.length > 0 && (
              <div className="content-stretch flex flex-wrap gap-[14px] items-start relative shrink-0 w-full">
                {selectedAddOns.map((addOnId) => {
                  const addOn = addOnsList.find((a) => a.id === addOnId);
                  if (!addOn) return null;
                  const isMember = userInfo?.is_member === true;
                  let price =
                    typeof addOn.price === "string"
                      ? parseFloat(addOn.price)
                      : addOn.price;
                  // If included_in_membership is true and user is a member, price is 0
                  if (addOn.included_in_membership === true && isMember) {
                    price = 0;
                  }
                  return (
                    <div
                      key={addOnId}
                      className="border border-[#4c4c4c] border-solid content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[12px] shrink-0"
                    >
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#4c4c4c] text-[10px]">
                        {addOn.name} ${price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => toggleAddOn(addOnId)}
                        className="flex items-center justify-center relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                        aria-label={`Remove ${addOn.name}`}
                      >
                        <Icon
                          name="close-arrow"
                          className="h-[16px] relative w-[16px] text-[#4c4c4c]"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Total Estimation - Collapsible */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div 
              className="content-stretch flex gap-[14px] items-start relative shrink-0 w-full cursor-pointer"
              onClick={() => setIsEstimationExpanded(!isEstimationExpanded)}
            >
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[45.5px] items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                    {isEstimationExpanded ? "Total estimation for the service" : "Subtotal estimation for the service"}
                  </p>
                </div>
                <div className="h-[17.5px] relative shrink-0 w-full">
                  <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                    Our groomer will evaluate the final price
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-[#de6a07]">
                  ${totalPrice.toFixed(2)}
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[20px]">
                  <div className={cn("flex-none", isEstimationExpanded ? "rotate-180" : "")}>
                    <div className={cn(
                      "content-stretch flex items-center justify-center relative rounded-[8px] size-[20px]",
                      "hover:border hover:border-[#8b6357] hover:border-solid transition-colors"
                    )}>
                      <Icon name="chevron-down" size={16} className="text-[#8b6357]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Expanded Details */}
            {isEstimationExpanded && (
              <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
                {/* Full rooming package section */}
                {selectedService && (
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex items-center relative shrink-0 w-full">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4a3c2a] text-[10px]">
                        Full rooming package
                      </p>
                    </div>
                    {/* Service package name */}
                    <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                      <p className="relative shrink-0">
                        {selectedService.name}
                      </p>
                      <p className="relative shrink-0">
                        ${packagePrice.toFixed(2)}
                      </p>
                    </div>
                    {/* Service items list */}
                    {selectedService.items && selectedService.items.length > 0 && (
                      <>
                        {selectedService.items
                          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                          .map((item) => {
                            const itemPrice = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                            return (
                              <div key={item.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                                <p className="relative shrink-0">
                                  {item.name}
                                </p>
                                <p className="relative shrink-0">
                                  ${itemPrice.toFixed(2)}
                                </p>
                              </div>
                            );
                          })}
                      </>
                    )}
                    {/* Separator line */}
                    <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                    <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                      <p className="relative shrink-0">
                        Subtotal
                      </p>
                      <p className="relative shrink-0">
                        ${packagePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Add-ons section */}
                {selectedAddOnsDetails.length > 0 && (
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex items-center relative shrink-0 w-full">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4a3c2a] text-[10px]">
                        Add-ons
                      </p>
                    </div>
                    {selectedAddOnsDetails.map((addOn) => (
                      <div key={addOn.id} className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                        <p className="relative shrink-0">
                          {addOn.name}
                        </p>
                        <p className="relative shrink-0">
                          ${addOn.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                    {/* Separator line */}
                    <div className="h-0 relative shrink-0 w-full border-t border-[#e0e0e0] my-[4px]" />
                    <div className="content-stretch flex font-['Comfortaa:Bold',sans-serif] font-bold items-start justify-between leading-[22.75px] relative shrink-0 text-[#4a3c2a] text-[12px] w-full">
                      <p className="relative shrink-0">
                        Subtotal
                      </p>
                      <p className="relative shrink-0">
                        ${addOnsPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      {/* Buttons */}
      <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
            {isLoggedIn ? (
              <OrangeButton
                size="medium"
                variant="primary"
                showArrow={true}
                onClick={nextStep}
              >
                Continue
              </OrangeButton>
            ) : (
              <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                <OrangeButton
                  size="medium"
                  variant="primary"
                  showArrow={true}
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Log in or sign up to continue
                </OrangeButton>
              </LoginModal>
            )}
            <OrangeButton
              size="medium"
              variant="outline"
              onClick={previousStep}
            >
              Back
            </OrangeButton>
        </div>
      </div>
    </div>
  );
}

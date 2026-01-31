import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { useAccountStore } from "@/components/account/accountStore";
import { getBookingDetail, cancelBooking, type AddressOut, type BookingDetailOut } from "@/lib/api";
import { toast } from "sonner";
import AddAddressModal from "@/components/account/AddAddressModal";
import ModifyAddressModal from "@/components/account/ModifyAddressModal";

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    return `${year}-${month}-${day} at ${hours}H`;
  } catch {
    return dateString;
  }
}

function formatAmount(value: number | string | undefined, fallback: string) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "number") return `$${value.toFixed(2)}`;
  const trimmed = String(value).trim();
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

function getStatusLabel(status?: string | null) {
  const statusLower = status?.toLowerCase() ?? "";
  if (statusLower.includes("ready") || statusLower.includes("checked_in")) {
    return "Ready for service";
  }
  if (statusLower.includes("cancel")) return "Service canceled";
  return "Pending";
}


export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<BookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPackageExpanded, setIsPackageExpanded] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressOverride, setAddressOverride] = useState<AddressOut | null>(null);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const { addresses, isLoadingAddresses, fetchAddresses } = useAccountStore();

  useEffect(() => {
    const id = Number(bookingId);
    if (!id || Number.isNaN(id)) {
      setError("Invalid booking ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    getBookingDetail(id)
      .then((data) => {
        setDetail(data);
      })
      .catch((error) => {
        console.error("Failed to load booking detail:", error);
        setError("Failed to load booking detail. Please try again.");
        toast.error("Failed to load booking detail");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [bookingId]);

  const petSnapshot = (detail?.pet_snapshot as Record<string, unknown> | undefined) ?? {};
  const addressSnapshot = (detail?.address_snapshot as Record<string, unknown> | undefined) ?? {};
  const packageSnapshot = (detail?.package_snapshot as Record<string, unknown> | undefined) ?? {};

  const petName = (petSnapshot.name as string | undefined) ?? "Duke";
  const bookingCode = `Tkf-${detail?.id ?? "4485"}`;
  const serviceName = (packageSnapshot.name as string | undefined) ?? "Full grooming";
  const serviceType =
    (packageSnapshot.service_type as string | undefined) ??
    (packageSnapshot.type as string | undefined) ??
    "Mobile";
  const scheduledDisplay = formatDateTime(detail?.scheduled_time) || "2026-04-03 at 10H";

  const addressLine1 =
    addressOverride?.address ??
    (addressSnapshot.address as string | undefined) ??
    "100 Vancouver Cres";
  const addressLine2 =
    [
      addressOverride?.city ?? (addressSnapshot.city as string | undefined),
      addressOverride?.province ?? (addressSnapshot.province as string | undefined),
      addressOverride?.postal_code ?? (addressSnapshot.postal_code as string | undefined),
    ]
      .filter(Boolean)
      .join(" ") || "MIRAMICHI NB E1N 2E5";

  const statusLabel = getStatusLabel(detail?.status);
  const statusLower = detail?.status?.toLowerCase() ?? "";
  const isPending = statusLower.includes("pending");
  const progressVariant =
    statusLower.includes("confirm") || statusLower.includes("proposed")
      ? "confirm"
      : statusLower.includes("ready") || statusLower.includes("checked_in")
      ? "ready"
      : "waiting";

  const progressConfig = {
    waiting: {
      barColor: "#DE6A07",
      barWidth: 40,
      badgeText: "Waiting for groomer match",
      badgeBg: "#DE6A07",
      badgeTextColor: "#FFFFFF",
      nextStep: "Waiting for groomer response",
    },
    confirm: {
      barColor: "#DE6A07",
      barWidth: 40,
      badgeText: "Waiting for your confirmation",
      badgeBg: "#DE6A07",
      badgeTextColor: "#FFFFFF",
      nextStep: "Confirm for new time proposed",
    },
    ready: {
      barColor: "#388B5E",
      barWidth: 70,
      badgeText: statusLabel,
      badgeBg: "#DCFCE7",
      badgeTextColor: "#016630",
      nextStep: `Upcoming booking ${scheduledDisplay}`,
    },
  } as const;

  const activeProgress = progressConfig[progressVariant];
  const canModifyAddress = isPending || progressVariant === "waiting";
  const proposedTimeDisplay = "2026-04-03 at 11H";
  
  // 价格信息（需要在 useMemo 之前定义）
  const totalEstimation = formatAmount(detail?.final_amount, "$0.00");
  const packageSubtotal = formatAmount(detail?.package_amount, "$0.00");
  const addOnSubtotal = formatAmount(detail?.addons_amount, "$0.00");
  
  // 从 package_snapshot 中提取套餐详情
  const packageItems = useMemo(() => {
    if (!detail?.package_snapshot) return [];
    
    const pkg = detail.package_snapshot as Record<string, unknown>;
    const items: Array<{ label: string; amount: string }> = [];
    
    // 套餐名称
    if (pkg.name) {
      const packagePrice = formatAmount(pkg.price as number | string | undefined, "$0.00");
      items.push({ label: pkg.name as string, amount: packagePrice });
    }
    
    // 服务类型（如果是 mobile，可能需要显示额外的费用）
    const pkgServiceType = (pkg.service_type as string | undefined) ?? (pkg.type as string | undefined);
    if (pkgServiceType && pkgServiceType.toLowerCase() === "mobile") {
      // 如果有 mobile 服务费用，可以在这里添加
      // 注意：实际费用可能已经在 package_amount 中包含了
    }
    
    return items.length > 0 ? items : [{ label: serviceName, amount: packageSubtotal }];
  }, [detail?.package_snapshot, serviceName, packageSubtotal]);

  // 从 addons_snapshot 中提取附加服务列表
  const addOnItems = useMemo(() => {
    if (!detail?.addons_snapshot || !Array.isArray(detail.addons_snapshot)) return [];
    
    return detail.addons_snapshot.map((addon) => {
      const addonObj = addon as Record<string, unknown>;
      const name = (addonObj.name as string | undefined) ?? "Add-on service";
      const price = formatAmount(addonObj.price as number | string | undefined, "$0.00");
      return { label: name, amount: price };
    });
  }, [detail?.addons_snapshot]);

  useEffect(() => {
    if (!isModifyOpen) return;
    fetchAddresses();
  }, [isModifyOpen, fetchAddresses]);

  useEffect(() => {
    if (!isModifyOpen) return;
    if (selectedAddressId !== null) return;
    const defaultAddress = addresses.find((address) => address.is_default);
    setSelectedAddressId(defaultAddress?.id ?? addresses[0]?.id ?? null);
  }, [isModifyOpen, addresses, selectedAddressId]);

  const handleSaveAddress = () => {
    const selected = addresses.find((address) => address.id === selectedAddressId) || null;
    setAddressOverride(selected);
    setIsModifyOpen(false);
  };

  // 计算折扣信息
  const discountRate = detail?.discount_rate 
    ? (typeof detail.discount_rate === "number" ? detail.discount_rate : parseFloat(String(detail.discount_rate)) || 0)
    : 0;
  const discountAmount = formatAmount(detail?.discount_amount, "$0.00");
  const couponAmount = formatAmount(detail?.coupon_amount, "$0.00");
  const membershipFee = formatAmount(detail?.membership_fee, "$0.00");
  
  // 会员和优惠券信息
  const membershipSnapshot = (detail?.membership_snapshot as Record<string, unknown> | undefined) ?? {};
  const couponSnapshot = (detail?.coupon_snapshot as Record<string, unknown> | undefined) ?? {};
  const hasMembership = Object.keys(membershipSnapshot).length > 0;
  const hasCoupon = Object.keys(couponSnapshot).length > 0;
  
  // 判断是否可以取消预约
  const statusLowerForCancel = detail?.status?.toLowerCase() ?? "";
  const canCancel = !statusLowerForCancel.includes("cancel") && !statusLowerForCancel.includes("completed") && !statusLowerForCancel.includes("refunded");
  
  // 处理取消预约
  const handleCancelBooking = async () => {
    if (!detail?.id) return;
    
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;
    
    setIsCanceling(true);
    try {
      await cancelBooking(detail.id);
      toast.success("Booking canceled successfully");
      // 刷新数据或跳转回 dashboard
      navigate("/account/dashboard");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 pb-8 flex-1">
        <div className="flex flex-col gap-[20px]">
          <div className="h-[27px] flex items-center">
            <nav
              aria-label="Breadcrumb"
              className="font-['Comfortaa:Bold',sans-serif] font-bold text-[20px] text-[#4A3C2A] flex items-center gap-[6px]"
            >
              <Link to="/account/dashboard" className="hover:text-[#DE6A07] transition-colors">
                Dashboard
              </Link>
              <span aria-hidden="true">{" > "}</span>
              <span>Upcoming booking - {petName}</span>
            </nav>
          </div>

          <div className="bg-white p-[24px] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-[14px] flex-1">
                <div className="flex items-start justify-between gap-[14px]">
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#DE6A07]">
                      {petName}
                    </p>
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                      {serviceName} - {serviceType} {scheduledDisplay}
                    </p>
                  </div>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                    {bookingCode}
                  </p>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <div className="relative h-[8px] w-full rounded-[8px] bg-[#D9D9D9]">
                    <div
                      className="absolute left-0 top-0 h-full rounded-[8px] transition-all duration-300"
                      style={{
                        width: `${activeProgress.barWidth}%`,
                        backgroundColor: activeProgress.barColor,
                      }}
                    />
                  </div>
                  {progressVariant === "ready" ? (
                    <div className="bg-[#DCFCE7] h-[24px] w-fit px-[16px] py-[4px] rounded-[12px] flex items-center">
                      <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#016630]">
                        {activeProgress.badgeText}
                      </span>
                    </div>
                  ) : (
                    <OrangeButton
                      size="compact"
                      variant="primary"
                      showArrow={false}
                      className="cursor-default w-[190px] h-[24px] px-[16px] py-[4px] gap-[4px] bg-[#DE6A07] hover:bg-[#DE6A07] active:bg-[#DE6A07] focus-visible:bg-[#DE6A07]"
                    >
                      {activeProgress.badgeText}
                    </OrangeButton>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-[20px]">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                Next step
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                {activeProgress.nextStep}
              </p>
            </div>

            {isLoading ? (
              <p className="mt-[12px] text-[10px] text-[#8B6357]">Loading booking detail...</p>
            ) : error ? (
              <p className="mt-[12px] text-[10px] text-red-600">{error}</p>
            ) : null}

            {progressVariant === "confirm" ? (
              <div className="mt-[16px] flex flex-wrap items-center gap-[8px]">
                <div className="flex flex-1 min-w-[200px] flex-col gap-[4px] text-[#4A3C2A]">
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px]">
                    New time proposed by groomer
                  </p>
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px]">
                    {proposedTimeDisplay}
                  </p>
                </div>
                <OrangeButton variant="secondary" size="compact" className="w-[209px]">
                  Cancel booking
                </OrangeButton>
                <OrangeButton variant="primary" size="compact" showArrow>
                  Confirm
                </OrangeButton>
              </div>
            ) : null}
          </div>

          <div className="bg-white p-[24px] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-[8px]">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Address and service type
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
                <div>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                    Address
                  </p>
                  <div className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                    <p>{addressLine1}</p>
                    <p>{addressLine2}</p>
                  </div>
                </div>
                <div>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                    Service type
                  </p>
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                    {serviceType}
                  </p>
                </div>
              </div>
              {canModifyAddress ? (
                <OrangeButton
                  variant="secondary"
                  size="compact"
                  className="w-[103px]"
                  onClick={() => setIsModifyOpen(true)}
                >
                  Modify
                </OrangeButton>
              ) : null}
            </div>
          </div>

          <div className="bg-white p-[24px] rounded-[12px] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-[14px]">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                Package and add-on
              </p>
              <div className="flex items-center justify-between">
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                  Total estimation for the service
                </p>
                <div className="flex items-center gap-[8px]">
                  <span className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#DE6A07]">
                    {totalEstimation}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPackageExpanded((value) => !value)}
                    className="flex items-center justify-center size-[20px] rounded-[8px] hover:border hover:border-[#8B6357] transition-colors"
                    aria-expanded={isPackageExpanded}
                    aria-label="Toggle package and add-on details"
                  >
                    <Icon
                      name="chevron-down"
                      className={`size-[20px] text-[#4A3C2A] transition-transform ${isPackageExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {isPackageExpanded ? (
                <>
                  {packageItems.length > 0 && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                        {serviceName} package
                      </p>
                      <div className="flex flex-col gap-[4px]">
                        {packageItems.map((item, index) => (
                          <div key={`package-${index}`} className="flex items-center justify-between">
                            <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {item.label}
                            </p>
                            <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {item.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#E5E7EB] my-[4px]" />
                      <div className="flex items-center justify-between">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          Subtotal
                        </p>
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          {packageSubtotal}
                        </p>
                      </div>
                    </div>
                  )}

                  {addOnItems.length > 0 && (
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                        Add-on
                      </p>
                      <div className="flex flex-col gap-[4px]">
                        {addOnItems.map((item, index) => (
                          <div key={`addon-${index}`} className="flex items-center justify-between">
                            <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {item.label}
                            </p>
                            <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                              {item.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-[#E5E7EB] my-[4px]" />
                      <div className="flex items-center justify-between">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          Subtotal
                        </p>
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          {addOnSubtotal}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="bg-white p-[24px] rounded-[12px] border-2 border-[#DE6A07] shadow-[0px_8px_12px_0px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-[20px]">
              <div className="flex items-start justify-between gap-[14px]">
                <div>
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#4A3C2A]">
                    Total estimation for the service
                  </p>
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[12.25px] leading-[17.5px] text-[#4A5565]">
                    Our groomer will evaluate the final price
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px] text-[#DE6A07]">
                    {totalEstimation}
                  </p>
                  {discountRate > 0 && (
                    <div className="flex items-center justify-end gap-[8px] mt-[4px]">
                      <span className="bg-[#DCFCE7] h-[24px] px-[16px] py-[4px] rounded-[12px] text-[10px] leading-[14px] font-['Comfortaa:Bold',sans-serif] font-bold text-[#016630]">
                        {discountRate}% OFF
                      </span>
                    </div>
                  )}
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4A5565] mt-[4px]">
                    tax included
                  </p>
                </div>
              </div>

              {(hasMembership || hasCoupon || couponAmount !== "$0.00" || discountAmount !== "$0.00") && (
                <>
                  <div className="border-t border-[#E5E7EB]" />

                  <div className="flex flex-col gap-[12px]">
                    {hasMembership && membershipFee !== "$0.00" && (
                      <div className="flex items-center justify-between">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                          Membership discount
                        </p>
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          -{membershipFee}
                        </p>
                      </div>
                    )}

                    {hasCoupon && couponAmount !== "$0.00" && (
                      <div className="flex items-center justify-between">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                          Coupon discount
                        </p>
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          -{couponAmount}
                        </p>
                      </div>
                    )}

                    {discountAmount !== "$0.00" && (
                      <div className="flex items-center justify-between">
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                          Discount
                        </p>
                        <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                          -{discountAmount}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {canCancel && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={isCanceling}
                className="flex items-center justify-center gap-[8px] text-[#8B6357] text-[12px] leading-[17.5px] font-['Comfortaa:Bold',sans-serif] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#DE6A07] transition-colors cursor-pointer"
              >
                <Icon name="trash" size={16} className="text-current" />
                {isCanceling ? "Canceling..." : "Cancel booking"}
              </button>
            </div>
          )}
        </div>
      </div>

      <ModifyAddressModal
        open={isModifyOpen}
        onOpenChange={setIsModifyOpen}
        addresses={addresses}
        isLoading={isLoadingAddresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={(id) => setSelectedAddressId(id)}
        onAddNew={() => setIsAddAddressOpen(true)}
        onSave={handleSaveAddress}
      />

      <AddAddressModal
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        onSuccess={() => fetchAddresses()}
      />
    </div>
  );
}

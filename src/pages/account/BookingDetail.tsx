import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { OrangeButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { getBookingDetail, type BookingDetailOut } from "@/lib/api";

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

function getProgressPercent(status?: string | null) {
  const statusLower = status?.toLowerCase() ?? "";
  if (statusLower.includes("ready") || statusLower.includes("checked_in")) return 70;
  if (statusLower.includes("cancel")) return 0;
  return 45;
}

export default function BookingDetail() {
  const { bookingId } = useParams();
  const [detail, setDetail] = useState<BookingDetailOut | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPackageExpanded, setIsPackageExpanded] = useState(true);

  useEffect(() => {
    const id = Number(bookingId);
    if (!id || Number.isNaN(id)) return;

    setIsLoading(true);
    getBookingDetail(id)
      .then((data) => {
        setDetail(data);
      })
      .catch((error) => {
        console.error("Failed to load booking detail:", error);
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
    (addressSnapshot.address as string | undefined) ?? "100 Vancouver Cres";
  const addressLine2 =
    [
      addressSnapshot.city as string | undefined,
      addressSnapshot.province as string | undefined,
      addressSnapshot.postal_code as string | undefined,
    ]
      .filter(Boolean)
      .join(" ") || "MIRAMICHI NB E1N 2E5";

  const statusLabel = getStatusLabel(detail?.status);
  const progressPercent = getProgressPercent(detail?.status);

  const packageItems = useMemo(
    () => [
      { label: "Full grooming", amount: "$58.50" },
      { label: "Mobile van service", amount: "$27.00" },
      { label: "Safety insurance", amount: "$11.00" },
    ],
    []
  );

  const addOnItems = useMemo(
    () => [
      { label: "Teeth brushing", amount: "$13.50" },
      { label: "Ear cleaning", amount: "$11.70" },
    ],
    []
  );

  const totalEstimation = formatAmount(detail?.final_amount, "$121.70");
  const packageSubtotal = formatAmount(detail?.package_amount, "$96.50");
  const addOnSubtotal = formatAmount(detail?.addons_amount, "$25.20");

  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="w-full max-w-[944px] mx-auto px-6 py-8 flex-1">
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
                      className="absolute left-0 top-0 h-full rounded-[8px] bg-[#388B5E] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="bg-[#DCFCE7] h-[24px] w-fit px-[16px] py-[4px] rounded-[12px] flex items-center">
                    <span className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#016630]">
                      {statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-[20px]">
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                Next step
              </p>
              <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                Check in {scheduledDisplay}
              </p>
            </div>

            {isLoading ? (
              <p className="mt-[12px] text-[10px] text-[#8B6357]">Loading booking detail...</p>
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
              <OrangeButton variant="secondary" size="compact" className="w-[103px]">
                Modify
              </OrangeButton>
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
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                      Full grooming package
                    </p>
                    <div className="flex flex-col gap-[4px]">
                      {packageItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
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

                  <div className="flex flex-col gap-[4px]">
                    <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[10px] leading-[12px] text-[#4A3C2A]">
                      Add-on
                    </p>
                    <div className="flex flex-col gap-[4px]">
                      {addOnItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
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
                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#4A5565]">
                    was $133 <span className="text-[#DE6A07] font-semibold">$209.70</span>
                  </p>
                  <div className="flex items-center justify-end gap-[8px]">
                    <span className="bg-[#DCFCE7] h-[24px] px-[16px] py-[4px] rounded-[12px] text-[10px] leading-[14px] font-['Comfortaa:Bold',sans-serif] font-bold text-[#016630]">
                      10% OFF
                    </span>
                    <span className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[22.75px] text-[#DE6A07]">
                      ($110.70 + $99)
                    </span>
                  </div>
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[10px] leading-[14px] text-[#4A5565]">
                    tax included
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E5E7EB]" />

              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                    Cash credit (3 left)
                  </p>
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                    -$5
                  </p>
                </div>

                <div className="flex flex-col gap-[8px]">
                  <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                    Special gift
                  </p>
                  <div className="flex items-center justify-between pl-[24px]">
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[17.5px] text-[#4A3C2A]">
                      - Birthday
                    </p>
                    <p className="font-['Comfortaa:Bold',sans-serif] font-bold text-[12px] leading-[16px] text-[#4A3C2A]">
                      -$10
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="button" className="flex items-center justify-center gap-[8px] text-[#8B6357] text-[12px] leading-[17.5px] font-['Comfortaa:Bold',sans-serif]">
            <Icon name="trash" size={16} className="text-[#8B6357]" />
            Cancel booking
          </button>
        </div>
      </div>
    </div>
  );
}

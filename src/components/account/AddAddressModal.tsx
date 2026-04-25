import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Checkbox,
  CustomInput,
  CustomSelect,
  CustomSelectItem,
  OrangeButton,
} from "@/components/common";
import { Icon } from "@/components/common/Icon";
import {
  createAddress,
  getServiceAreaProvinces,
  getServiceAreas,
  type AddressManageIn,
  type ProvinceOut,
  type ServiceAreaOut,
} from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";

interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAddressModalProps) {
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [serviceAreaId, setServiceAreaId] = useState<number | null>(null);
  const [postalCode, setPostalCode] = useState("");
  const [serviceType] = useState<"mobile" | "in_store" | "in_home">("mobile");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [provinces, setProvinces] = useState<ProvinceOut[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaOut[]>([]);
  const cityRef = useRef(city);

  useEffect(() => {
    cityRef.current = city;
  }, [city]);

  const selectedProvinceName = useMemo(
    () => provinces.find((item) => item.code === province)?.name ?? province,
    [province, provinces],
  );

  const resetForm = () => {
    setAddress("");
    setProvince("");
    setCity("");
    setServiceAreaId(null);
    setPostalCode("");
    setLabel("");
    setIsDefault(false);
    setServiceAreas([]);
  };

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const loadProvinces = async () => {
      try {
        const data = await getServiceAreaProvinces();
        if (cancelled) return;
        setProvinces(data);
        if (data.length === 1) {
          setProvince(data[0].code);
        }
      } catch (error) {
        console.error("Failed to load provinces:", error);
      }
    };

    void loadProvinces();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !province) {
      setServiceAreas([]);
      return;
    }

    let cancelled = false;
    const loadCities = async () => {
      setIsLoadingAreas(true);
      try {
        const data = await getServiceAreas({ province_code: province });
        if (cancelled) return;
        setServiceAreas(data);
        setServiceAreaId((current) => (
          current && data.some((item) => item.id === current) ? current : null
        ));
        if (cityRef.current && !data.some((item) => item.city === cityRef.current)) {
          setCity("");
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

    void loadCities();
    return () => {
      cancelled = true;
    };
  }, [open, province]);

  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity("");
    setServiceAreaId(null);
  };

  const handleCityChange = (value: string) => {
    const selected = serviceAreas.find((item) => item.id === Number(value));
    if (!selected) return;
    setServiceAreaId(selected.id);
    setCity(selected.city);
    setProvince(selected.province_code);
  };

  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!province.trim()) {
      toast.error("Province is required");
      return;
    }
    if (!city.trim() || !serviceAreaId) {
      toast.error("City is required");
      return;
    }
    if (!postalCode.trim()) {
      toast.error("Postal code is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: AddressManageIn = {
        service_area_id: serviceAreaId,
        address: address.trim(),
        city: city.trim(),
        province: province.trim(),
        postal_code: postalCode.trim(),
        service_type: serviceType,
        is_default: isDefault,
        ...(label.trim() ? { label: label.trim() } : {}),
      };

      await createAddress(payload);
      toast.success("Address added successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating address:", error);
      const message =
        error instanceof HttpError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Failed to add address. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-32px)] rounded-xl border border-[rgba(0,0,0,0.1)] bg-white px-6 pb-6 pt-3 shadow-[0_8px_12px_0_rgba(0,0,0,0.10)] sm:max-w-[400px] [&>button]:hidden">
        <DialogTitle className="sr-only">Add address</DialogTitle>
        <DialogDescription className="sr-only">
          Add a new address for your bookings.
        </DialogDescription>

        <div>
          <div className="mb-3 flex items-center relative">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="z-10 cursor-pointer opacity-70 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <Icon name="close-arrow" className="w-5 h-5 text-[#717182]" />
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 font-comfortaa text-lg font-semibold text-[#4A3C2A]">
              Modify address
            </h2>
          </div>
          <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
        </div>

        <div className="flex flex-col">
          <h3 className="font-comfortaa text-base font-semibold text-[#4A3C2A]">
            Tell us your location
          </h3>
          <p className="font-comfortaa text-sm font-normal text-[#717182]">
            This helps us find a groomer near you.
          </p>
        </div>

        <div className="relative rounded-lg border border-solid border-[#bedbff] bg-[#eff6ff]">
          <div className="relative flex items-center overflow-clip rounded-[inherit] px-4 py-2">
            <div className="relative flex w-full min-w-0 items-start gap-2">
              <div className="relative size-3 shrink-0">
                <Icon
                  name="alert-info"
                  aria-label="Info"
                  className="block size-full text-[#2374FF]"
                />
              </div>
              <p className="min-w-0 whitespace-normal break-words font-comfortaa text-[10px] font-normal leading-[12px] text-[#193cb8]">
                We currently provide mobile grooming services throughout Grand Vancouver and surrounding areas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative flex w-full shrink-0 flex-col items-start gap-3 sm:flex-row sm:gap-5">
            <div className="relative flex w-full shrink-0 flex-col items-start sm:w-[140px]">
              <CustomSelect
                label="Province"
                placeholder="Select province"
                value={province}
                displayValue={selectedProvinceName}
                onValueChange={handleProvinceChange}
              >
                {provinces.map((item) => (
                  <CustomSelectItem key={item.code} value={item.code}>
                    {item.name}
                  </CustomSelectItem>
                ))}
              </CustomSelect>
            </div>
            <div className="relative flex w-full shrink-0 flex-col items-start sm:flex-1">
              <CustomSelect
                label="City"
                placeholder={province ? "Select city" : "Select province first"}
                value={serviceAreaId ? String(serviceAreaId) : ""}
                displayValue={city || undefined}
                onValueChange={handleCityChange}
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

          <div className="w-full sm:w-[320px]">
            <CustomInput
              label="Address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rightElement={
                <div
                  className="ml-2 relative size-[24px] shrink-0 cursor-pointer overflow-clip transition-opacity hover:opacity-80"
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

          <div className="relative flex w-full shrink-0 items-start gap-5">
            <div className="relative flex w-full shrink-0 flex-col items-start sm:w-48">
              <CustomInput
                label="Post code"
                type="text"
                placeholder="Enter post code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="relative flex w-full shrink-0 flex-col items-start">
            <CustomInput
              label="Label"
              type="text"
              placeholder="Optional"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={isDefault}
              onCheckedChange={setIsDefault}
              id="set-as-default"
            />
            <label
              htmlFor="set-as-default"
              className="cursor-pointer font-comfortaa text-[14px] font-normal text-[#4a3c2a]"
            >
              Set as default
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <OrangeButton
            variant="outline"
            size="medium"
            className="w-30"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </OrangeButton>
          <OrangeButton
            variant="primary"
            size="medium"
            className="w-30"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Save
          </OrangeButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

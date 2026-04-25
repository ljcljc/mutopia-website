import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { OrangeButton, CustomSelect, CustomSelectItem } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import type { ProvinceOut, ServiceAreaOut } from "@/lib/api";

interface AddServiceAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  provinces: ProvinceOut[];
  areaOptions: ServiceAreaOut[];
  selectedAreaIds: number[];
  isSaving?: boolean;
  onSave: (serviceAreaIds: number[]) => void;
}

export default function AddServiceAreaModal({
  open,
  onOpenChange,
  provinces,
  areaOptions,
  selectedAreaIds,
  isSaving = false,
  onSave,
}: AddServiceAreaModalProps) {
  const [draftIds, setDraftIds] = useState<number[]>(selectedAreaIds);
  const [province, setProvince] = useState("");
  const [serviceAreaId, setServiceAreaId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraftIds(selectedAreaIds);
    if (provinces.length === 1) {
      setProvince(provinces[0].code);
    } else {
      setProvince("");
    }
    setServiceAreaId(null);
  }, [open, provinces, selectedAreaIds]);

  const selectedProvinceName = useMemo(
    () => provinces.find((item) => item.code === province)?.name ?? province,
    [province, provinces],
  );

  const provinceAreas = useMemo(
    () => areaOptions.filter((item) => item.province_code === province),
    [areaOptions, province],
  );

  const draftAreas = useMemo(
    () => draftIds
      .map((id) => areaOptions.find((item) => item.id === id))
      .filter((item): item is ServiceAreaOut => Boolean(item))
      .sort((left, right) => left.label.localeCompare(right.label)),
    [areaOptions, draftIds],
  );

  const handleAdd = () => {
    if (!serviceAreaId || draftIds.includes(serviceAreaId)) return;
    setDraftIds((current) => [...current, serviceAreaId]);
    setServiceAreaId(null);
  };

  const handleRemove = (id: number) => {
    setDraftIds((current) => current.filter((item) => item !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!top-1/2 !left-1/2 !grid !w-full !max-w-[482px] !translate-x-[-50%] !translate-y-[-50%] !gap-0 overflow-hidden rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] [&>button]:hidden">
        <DialogTitle className="sr-only">Modify service areas</DialogTitle>
        <DialogDescription className="sr-only">
          Select province and city, then save groomer service areas.
        </DialogDescription>

        <div className="w-full">
          <div className="relative mb-2 flex items-center px-3 pt-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="z-10 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close service area selector"
            >
              <Icon name="close-arrow" className="h-4 w-4 text-[#717182]" />
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#4C4C4C]">
              Modify
            </h2>
          </div>
          <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="flex items-center gap-2">
            <Icon name="location" className="h-5 w-5 text-[#DE6A07]" />
            <p className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Service areas</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:items-end">
            <CustomSelect
              label="Province"
              placeholder="Select province"
              value={province}
              displayValue={selectedProvinceName}
              onValueChange={(value) => {
                setProvince(value);
                setServiceAreaId(null);
              }}
            >
              {provinces.map((item) => (
                <CustomSelectItem key={item.code} value={item.code}>
                  {item.name}
                </CustomSelectItem>
              ))}
            </CustomSelect>

            <CustomSelect
              label="City"
              placeholder={province ? "Select city" : "Select province first"}
              value={serviceAreaId ? String(serviceAreaId) : ""}
              displayValue={provinceAreas.find((item) => item.id === serviceAreaId)?.city}
              onValueChange={(value) => setServiceAreaId(Number(value))}
              disabled={!province}
            >
              {provinceAreas.map((item) => (
                <CustomSelectItem key={item.id} value={String(item.id)}>
                  {item.city}
                </CustomSelectItem>
              ))}
            </CustomSelect>

            <OrangeButton
              type="button"
              variant="outline"
              size="medium"
              className="w-full sm:w-[112px]"
              onClick={handleAdd}
              disabled={!serviceAreaId || draftIds.includes(serviceAreaId)}
            >
              Add
            </OrangeButton>
          </div>

          <div className="space-y-3">
            {draftAreas.length === 0 ? (
              <p className="font-comfortaa text-[13px] leading-[19.5px] text-[#6B7280]">
                No service areas selected yet.
              </p>
            ) : (
              draftAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between rounded-[12px] bg-[#FAF9F7] px-3 py-3"
                >
                  <div className="flex flex-col">
                    <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">
                      {area.city}
                    </span>
                    <span className="font-comfortaa text-[12px] leading-[18px] text-[#8B6357]">
                      {area.province_name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(area.id)}
                    className="cursor-pointer rounded-[8px] p-1 text-[#EF4444] transition-colors hover:text-[#DC2626]"
                    aria-label={`Remove ${area.label}`}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end gap-2.5">
            <OrangeButton
              type="button"
              variant="outline"
              size="medium"
              className="w-[120px]"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </OrangeButton>
            <OrangeButton
              type="button"
              variant="primary"
              size="medium"
              className="w-[120px]"
              onClick={() => onSave(draftIds)}
              loading={isSaving}
              disabled={isSaving}
            >
              Save
            </OrangeButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

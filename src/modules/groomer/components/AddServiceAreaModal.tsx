import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common";

interface AddServiceAreaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "add" | "edit";
  initialValue?: string;
  onSubmit: (areaName: string) => void;
}

export default function AddServiceAreaModal({
  open,
  onOpenChange,
  mode = "add",
  initialValue = "",
  onSubmit,
}: AddServiceAreaModalProps) {
  const [areaName, setAreaName] = useState("");

  useEffect(() => {
    if (open) setAreaName(initialValue);
  }, [open, initialValue]);

  const handleClose = () => onOpenChange(false);

  const handleSubmit = () => {
    const nextArea = areaName.trim();
    if (!nextArea) {
      toast.error("Area name is required");
      return;
    }

    onSubmit(nextArea);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-32px)] rounded-[20px] border border-[rgba(0,0,0,0.2)] bg-white px-0 pb-8 pt-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sm:max-w-[482px] [&>button]:hidden">
        <DialogTitle className="sr-only">Add service area</DialogTitle>
        <DialogDescription className="sr-only">
          Add a new service area for groomer account.
        </DialogDescription>

        <div className="w-full">
          <div className="relative mb-2 flex items-center px-3">
            <button
              type="button"
              onClick={handleClose}
              className="z-10 cursor-pointer opacity-70 transition-opacity hover:opacity-100"
              aria-label="Close"
            >
              <Icon name="close-arrow" className="h-4 w-4 text-[#717182]" />
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-comfortaa text-[14px] font-normal leading-[22.75px] text-[#4C4C4C]">
              {mode === "edit" ? "Modify area" : "Add area"}
            </h2>
          </div>
          <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
        </div>

        <div className="w-full px-6 pt-5">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="location" className="h-5 w-5 text-[#DE6A07]" />
              <p className="font-comfortaa text-[16px] font-bold leading-6 text-[#4A2C55]">Service areas</p>
            </div>
            <span className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#E67E22]">+ Add area</span>
          </div>

          <div className="rounded-[12px] bg-[#FAF9F7] px-3">
            <div className="flex h-[48px] items-center justify-between">
              <input
                value={areaName}
                onChange={(event) => setAreaName(event.target.value)}
                placeholder={mode === "edit" ? "Service area" : "Select an area"}
                className="w-full border-none bg-transparent font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55] placeholder:text-[#6B7280] focus:outline-none"
              />
              <Icon
                name={mode === "edit" ? "pencil" : "chevron-down"}
                className={`ml-2 h-5 w-5 shrink-0 ${mode === "edit" ? "text-[#DE6A07]" : "text-[#8B6357]"}`}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex w-full items-center justify-end gap-[10px] px-6">
          <OrangeButton
            type="button"
            variant="outline"
            size="medium"
            className="w-[120px] border-[#DE6A07] text-[#DE6A07]"
            onClick={handleClose}
          >
            Cancel
          </OrangeButton>
          <OrangeButton type="button" size="medium" className="w-[120px]" onClick={handleSubmit}>
            {mode === "edit" ? "Save" : "Add"}
          </OrangeButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

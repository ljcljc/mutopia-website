import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";
import { cn } from "@/components/ui/utils";

export interface CommonCheckboxProps {
  /** Checkbox label/name */
  name: string;
  /** Optional description text */
  description?: string;
  /** Price to display (number or string) */
  price?: string | number;
  /** Optional duration text */
  duration?: string;
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void;
  /** Additional className for the container */
  className?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
}

/**
 * CommonCheckbox component for add-on selection cards
 * Matches Figma design for "Most popular add-ons" section
 */
export function CommonCheckbox({
  name,
  description,
  price,
  duration,
  checked,
  onCheckedChange,
  className,
  disabled = false,
}: CommonCheckboxProps) {
  const priceText = typeof price === "number" ? `$${price}` : price;
  const isSelected = checked;

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "border-2 border-solid box-border content-stretch flex flex-col items-start p-[16px] relative rounded-[14px] shrink-0 transition-all",
        isSelected ? "border-[#de6a07] bg-[#fff3e9]" : "border-gray-200 bg-white",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
    >
      <div className="content-stretch flex items-start justify-between gap-[10px] relative shrink-0 w-full">
        <div className="flex gap-[8px] items-start flex-1 min-w-0">
          <div
            className="flex items-center shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={checked}
              onCheckedChange={onCheckedChange}
              disabled={disabled}
              containerClassName="cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
            <p
              className={cn(
                "font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] text-[14px]",
                isSelected ? "text-[#de6a07]" : "text-[#8b6357]"
              )}
            >
              {name}
            </p>
            {description && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#4a5565] text-[12.25px] break-words text-left">
                {description}
              </p>
            )}
          </div>
        </div>
        {(priceText || duration) && (
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-end justify-center relative">
              {priceText && (
                <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[14px] text-[#de6a07]">
                  {priceText}
                </p>
              )}
              {duration && (
                <div className="content-stretch flex gap-[7px] h-[17.5px] items-center relative shrink-0">
                  <Icon name="clock" size={16} className="text-[rgba(74,60,42,0.6)]" />
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative">
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12.25px] text-[rgba(74,60,42,0.6)]">
                        {duration}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


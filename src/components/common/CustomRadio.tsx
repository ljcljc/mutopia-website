import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";

export interface CustomRadioProps {
  label: string;
  icon?: "dog" | "cat" | "pet" | "van" | "shop" | "home";
  description?: string; // For tiles with description (like GroomingFrequencyTile)
  variant?: "simple" | "with-description" | "package"; // Layout variant
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  // Package variant specific props
  price?: string | number; // Price to display on the right
  duration?: string; // Duration to display below price
}

// Shared radio button component
function RadioButton({ isChecked, className }: { isChecked: boolean; className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[16px] mt-[2.5px]", className)}>
      <div className="size-[16px] rounded-full border border-solid transition-colors border-[#717182] bg-white">
        {isChecked && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[8px] rounded-full bg-[#de6a07]" />
        )}
      </div>
    </div>
  );
}

// Shared radio button for RadioGroup (uses peer classes)
function RadioButtonPeer({ className }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 size-[16px] mt-[2.5px]", className)}>
      <div className="size-[16px] rounded-full border border-solid transition-colors border-[#717182] bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[8px] rounded-full bg-[#de6a07] opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}

// Shared styles
const baseTileClasses = "border-2 border-solid box-border relative rounded-[14px] cursor-pointer transition-all outline-none";
const hoverClasses = "hover:border-[#E5A56E]";
const focusClasses = "focus-visible:ring-2 focus-visible:ring-[#2374ff] focus-visible:ring-offset-2 focus-visible:border-[#2374ff]";
const disabledClasses = "opacity-50 cursor-not-allowed";

// Shared component for price and duration display
function PriceAndDuration({ priceText, duration }: { priceText?: string; duration?: string }) {
  if (!priceText && !duration) return null;

  return (
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
  );
}

export function CustomRadio({
  label,
  icon,
  description,
  variant = "simple",
  isSelected = false,
  onClick,
  className,
  disabled,
  price,
  duration,
}: CustomRadioProps) {
  const handleChange = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  // Determine colors based on state - matching Figma design
  const borderColor = isSelected ? "border-[#de6a07]" : "border-gray-200";
  const bgColor = isSelected ? "bg-[#fff3e9]" : "bg-white";
  const textColor = isSelected ? "text-[#de6a07]" : "text-[#8b6357]";
  const iconColor = isSelected ? "text-[#de6a07]" : "text-[#8b6357]";

  // Shared button classes
  const buttonClasses = cn(
    baseTileClasses,
    borderColor,
    bgColor,
    hoverClasses,
    focusClasses,
    disabled && disabledClasses,
    className
  );

  if (variant === "package") {
    const priceText = typeof price === "number" ? `$${price}` : price;
    return (
      <button
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={cn(buttonClasses, "flex flex-col items-start p-[16px] w-full")}
      >
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full min-h-[42px]">
          <div className="relative shrink-0">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10px] items-start relative">
              <RadioButton isChecked={isSelected} />
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                <div className="h-[21px] relative shrink-0 w-[141.891px]">
                  <p
                    className={cn(
                      "absolute leading-[21px] left-0 text-[14px] top-[0.5px] text-[#8b6357]",
                      isSelected
                        ? "font-['Comfortaa:Bold',sans-serif] font-bold"
                        : "font-['Comfortaa:Medium',sans-serif] font-medium"
                    )}
                  >
                    {label}
                  </p>
                </div>
                {description && (
                  <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full min-h-[17.5px]">
                    <p
                      className={cn(
                        "font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]",
                        isSelected
                          ? "font-['Comfortaa:Bold',sans-serif] font-bold"
                          : "font-['Comfortaa:Regular',sans-serif] font-normal"
                      )}
                    >
                      {description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <PriceAndDuration priceText={priceText} duration={duration} />
        </div>
      </button>
    );
  }

  if (variant === "with-description") {
    return (
      <button
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={cn(buttonClasses, "flex flex-col items-start p-[16px] w-full")}
      >
        <div className="flex gap-[10px] items-start relative shrink-0 w-full">
          <RadioButton isChecked={isSelected} />
          <div className="flex flex-col gap-[4px] items-start relative shrink-0 flex-1">
            <p className={cn(
              "font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] relative text-[14px]",
              textColor
            )}>
              {label}
            </p>
            {description && (
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative text-[#4a5565] text-[12.25px] whitespace-nowrap">
                {description}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  }

  // Simple variant (default) - matching Figma design
  return (
    <button
      type="button"
      onClick={handleChange}
      disabled={disabled}
      className={cn(buttonClasses, "flex flex-col items-center justify-center p-[16px] w-auto")}
    >
      <div className="flex flex-col gap-[12px] items-center justify-center relative w-full">
        <div className="flex gap-[8px] items-start justify-center relative">
          <RadioButton isChecked={isSelected} />
          <div className="flex flex-col gap-[4px] items-center relative">
            <p className={cn(
              "font-['Comfortaa:Bold',sans-serif] font-bold leading-[21px] relative text-[14px] whitespace-nowrap",
              textColor
            )}>
              {label}
            </p>
            {icon && (
              <div className="flex items-center justify-center relative h-[24px]">
                <div className={cn(
                  "relative",
                  icon === "van" ? "h-[18.164px] w-[24px]" : "size-[24px]"
                )}>
                  <Icon
                    name={icon}
                    aria-label={icon}
                    className={cn("block size-full", iconColor)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// RadioGroupItem version (for use with RadioGroup) - based on shadcn
export const CustomRadioItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<CustomRadioProps, "isSelected" | "onClick"> & {
    value: string;
  }
>(function CustomRadioItem(
  {
    label,
    icon,
    description,
    variant = "simple",
    className,
    value,
    disabled,
    price,
    duration,
    ...props
  },
  ref
) {
  const generatedId = React.useId();
  const inputId = `radio-${value}-${generatedId}`;

  // Base tile classes for RadioGroup (uses peer classes)
  const peerTileClasses = cn(
    baseTileClasses,
    "border-gray-200 bg-white",
    hoverClasses,
    "peer-data-[state=checked]:border-[#de6a07] peer-data-[state=checked]:bg-[#fff3e9]",
    "peer-focus-visible:ring-2 peer-focus-visible:ring-[#2374ff] peer-focus-visible:ring-offset-2 peer-focus-visible:border-[#2374ff]",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    disabled && disabledClasses,
    className
  );

  if (variant === "package") {
    const priceText = typeof price === "number" ? `$${price}` : price;
    return (
      <label htmlFor={inputId} className="cursor-pointer">
        <RadioGroupPrimitive.Item
          ref={ref}
          id={inputId}
          value={value}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={cn(
            peerTileClasses,
            "flex flex-col items-start p-[16px] w-full"
          )}
        >
          <div className="content-stretch flex items-start justify-between relative shrink-0 w-full min-h-[42px]">
            <div className="relative shrink-0">
              <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10px] items-start relative">
                <RadioButtonPeer />
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                  <div className="h-[21px] relative shrink-0 w-[141.891px]">
                    <p
                      className={cn(
                        "absolute leading-[21px] left-0 text-[14px] top-[0.5px] text-[#8b6357]",
                        "font-['Comfortaa:Medium',sans-serif] font-medium",
                        "peer-data-[state=checked]:font-['Comfortaa:Bold',sans-serif] peer-data-[state=checked]:font-bold"
                      )}
                    >
                      {label}
                    </p>
                  </div>
                  {description && (
                    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full min-h-[17.5px]">
                      <p
                        className={cn(
                          "font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]",
                          "peer-data-[state=checked]:font-['Comfortaa:Bold',sans-serif] peer-data-[state=checked]:font-bold"
                        )}
                      >
                        {description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <PriceAndDuration priceText={priceText} duration={duration} />
          </div>
        </div>
      </label>
    );
  }

  if (variant === "with-description") {
    return (
      <label htmlFor={inputId} className="cursor-pointer">
        <RadioGroupPrimitive.Item
          ref={ref}
          id={inputId}
          value={value}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div className={cn(peerTileClasses, "flex flex-col items-start p-[16px] w-full")}>
          <div className="flex gap-[10px] items-start relative shrink-0 w-full">
            <RadioButtonPeer />
            <div className="flex flex-col gap-[4px] items-start relative shrink-0 flex-1">
              <p
                className={cn(
                  "font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] text-[14px] text-[#8b6357]",
                  "peer-data-[state=checked]:text-[#de6a07]"
                )}
              >
                {label}
              </p>
              {description && (
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#4a5565] text-[12.25px] whitespace-nowrap">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </label>
    );
  }

  // Simple variant (default) - matching Figma design
  return (
    <label htmlFor={inputId} className="cursor-pointer">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        value={value}
        disabled={disabled}
        className="peer sr-only"
        {...props}
      />
      <div className={cn(peerTileClasses, "flex flex-col items-center justify-center p-[16px] w-auto")}>
        <div className="flex flex-col gap-[12px] items-center justify-center relative w-full">
          <div className="flex gap-[8px] items-start justify-center relative">
            <RadioButtonPeer />
            <div className="flex flex-col gap-[4px] items-center relative">
              <p
                className={cn(
                  "font-['Comfortaa:Bold',sans-serif] font-bold leading-[21px] text-[14px] whitespace-nowrap text-[#8b6357]",
                  "peer-data-[state=checked]:text-[#de6a07]"
                )}
              >
                {label}
              </p>
              {icon && (
                <div className="flex items-center justify-center relative h-[24px]">
                  <div
                    className={cn(
                      "relative",
                      icon === "van" ? "h-[18.164px] w-[24px]" : "size-[24px]"
                    )}
                  >
                    <Icon
                      name={icon}
                      aria-label={icon}
                      className={cn(
                        "block size-full text-[#8b6357]",
                        "peer-data-[state=checked]:text-[#de6a07]"
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </label>
  );
});

CustomRadioItem.displayName = "CustomRadioItem";

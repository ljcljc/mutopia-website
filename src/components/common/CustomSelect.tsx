import { forwardRef, ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "./Icon";
import { cn } from "@/components/ui/utils";

export interface CustomSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  displayValue?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  leftElement?: ReactNode;
  children?: ReactNode;
  className?: string;
  debug?: boolean; // Debug mode: keep dropdown open
  noLeftRadius?: boolean; // Remove left border radius
}

export const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(
  (
    {
      label,
      placeholder = "Select...",
      value,
      displayValue,
      onValueChange,
      error,
      disabled,
      leftElement,
      children,
      className,
      debug = false,
      noLeftRadius = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(debug);

    const isAutoWidth = className && className.includes("w-auto");
    
    return (
      <div className={cn(
        "content-stretch flex flex-col gap-[8px] items-start relative",
        isAutoWidth ? "w-auto" : "w-full"
      )}>
        {/* Label */}
        {label && (
          <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
            <p
              className={cn(
                "font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-nowrap whitespace-pre",
                error ? "text-[#de1507]" : "text-[#4a3c2a]"
              )}
            >
              {label}
            </p>
          </div>
        )}

        {/* Select Container */}
        <div className={cn(
          "bg-white h-[36px] relative shrink-0 group",
          isAutoWidth ? "w-auto" : "w-full",
          noLeftRadius 
            ? "rounded-br-[8px] rounded-tr-[8px] rounded-bl-none rounded-tl-none"
            : "rounded-[8px]"
        )}>
          <Select
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            open={debug ? true : isOpen}
            onOpenChange={debug ? undefined : setIsOpen}
          >
            <SelectTrigger
              ref={ref}
              className={cn(
                "h-[36px] border-none bg-transparent shadow-none focus:ring-0 focus-visible:ring-0 px-[12px] py-[4px] w-full",
                noLeftRadius 
                  ? "rounded-br-[8px] rounded-tr-[8px] rounded-bl-none rounded-tl-none"
                  : "rounded-[8px]",
                "[&>svg]:hidden", // Hide the default chevron icon from shadcn (SelectPrimitive.Icon)
                className && !className.includes("w-auto") ? className : ""
              )}
            >
              <div className="flex flex-1 items-center min-h-px min-w-px relative shrink-0">
                <div className="flex flex-1 gap-[8px] items-center min-h-px min-w-px relative shrink-0">
                  {leftElement}
                  <SelectValue placeholder={placeholder}>
                    <span
                      className={cn(
                        "font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] text-[12.25px]",
                        value ? "text-[#4a3c2a]" : "text-[#717182]"
                      )}
                    >
                      {value ? (displayValue ?? value) : placeholder}
                    </span>
                  </SelectValue>
                </div>
                <Icon
                  name="chevron-down"
                  className="h-[6.375px] relative shrink-0 w-[11.25px] text-[#717182]"
                />
              </div>
            </SelectTrigger>
            <SelectContent 
              className="rounded-[8px] border border-[#d6d6d6] p-[4px] min-w-[var(--radix-select-trigger-width)] shadow-md bg-white! text-[#6b6b6b]! [&_*]:text-[#6b6b6b]!"
              style={{
                backgroundColor: "white",
                color: "#6b6b6b",
              } as React.CSSProperties}
            >
              {children}
            </SelectContent>
          </Select>

          {/* Border with states */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute border border-solid inset-0 pointer-events-none transition-colors duration-200",
              noLeftRadius 
                ? "rounded-br-[8px] rounded-tr-[8px] rounded-bl-none rounded-tl-none"
                : "rounded-[8px]",
              error
                ? "border-[#de1507]"
                : isOpen
                  ? "border-[#2374ff]"
                  : "border-gray-200 group-hover:border-[#717182]"
            )}
          />
        </div>
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

// Custom SelectItem component with hover and selected states matching Figma design
export interface CustomSelectItemProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function CustomSelectItem({
  value,
  children,
  icon,
  disabled,
  className,
}: CustomSelectItemProps) {
  return (
    <SelectItem
      value={value}
      disabled={disabled}
      className={cn(
        // Base styles - use justify-between for space-between layout, fixed height 36px
        "flex justify-between items-center px-[8px] h-[36px] rounded-[4px] cursor-pointer",
        "bg-white!",
        "font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] leading-[20px]",
        
        // Override shadcn default text colors
        "text-[#6b6b6b]!",
        "focus:text-[#6b6b6b]! focus-visible:text-[#6b6b6b]!",
        "[&_svg]:text-[#8b6357]!",
        // Target SelectPrimitive.ItemText (the span that wraps our children) - exclude check indicator
        "[&>span:not([class*='absolute'])]:flex [&>span:not([class*='absolute'])]:gap-[12px] [&>span:not([class*='absolute'])]:items-center [&>span:not([class*='absolute'])]:flex-1 [&>span:not([class*='absolute'])]:w-full [&>span:not([class*='absolute'])]:order-1",
        "[&>span:not([class*='absolute'])]:text-[#6b6b6b]!",
        "[&_span]:text-[#6b6b6b]!",
        "[&_div]:text-[#6b6b6b]!",
        "[&_*]:text-[#6b6b6b]!",
        // Check indicator (the absolute positioned span with CheckIcon) - make it relative for space-between layout
        "[&>span[class*='absolute']]:relative [&>span[class*='absolute']]:right-0 [&>span[class*='absolute']]:shrink-0 [&>span[class*='absolute']]:order-2",
        "[&>span[class*='absolute']_svg]:text-[#6b6b6b]! [&>span[class*='absolute']_*]:text-[#6b6b6b]!",
        
        // Hover state: amber-50 background, gray text, brown icon
        "data-highlighted:bg-amber-50!",
        "data-highlighted:text-[#6b6b6b]!",
        "data-highlighted:[&_span]:text-[#6b6b6b]!",
        "data-highlighted:[&_div]:text-[#6b6b6b]!",
        "data-highlighted:[&_svg]:text-[#8b6357]!",
        "data-highlighted:[&>span[class*='absolute']_svg]:text-[#6b6b6b]!",
        
        // Selected state: white background, orange text (#de6a07), orange check icon
        "data-[state=checked]:bg-white!",
        "data-[state=checked]:text-[#de6a07]!",
        "data-[state=checked]:[&_span]:text-[#de6a07]!",
        "data-[state=checked]:[&_div]:text-[#de6a07]!",
        "data-[state=checked]:[&_svg]:text-[#de6a07]!",
        "data-[state=checked]:[&>span[class*='absolute']_svg]:text-[#de6a07]!",
        "data-[state=checked]:[&>span[class*='absolute']_*]:text-[#de6a07]!",
        
        // Disabled state: white background, gray text (#808080), gray icon, reduced opacity
        "data-disabled:bg-white!",
        "data-disabled:text-[#808080]!",
        "data-disabled:[&_span]:text-[#808080]!",
        "data-disabled:[&_div]:text-[#808080]!",
        "data-disabled:[&_svg]:text-[#808080]!",
        "data-disabled:[&>span[class*='absolute']_svg]:text-[#808080]!",
        "data-disabled:opacity-60 data-disabled:cursor-not-allowed",
        
        className
      )}
      style={{
        color: "#6b6b6b !important",
        backgroundColor: "white",
      } as React.CSSProperties}
    >
      <div className="flex gap-[12px] items-center flex-1">
        {icon && (
          <div className="relative shrink-0 size-[20px] flex items-center justify-center overflow-clip rounded-[100px]">
            {icon}
          </div>
        )}
        <span 
          style={{ 
            color: "#6b6b6b !important",
          } as React.CSSProperties} 
          className="flex-1 whitespace-pre-wrap"
        >
          {children}
        </span>
      </div>
    </SelectItem>
  );
}

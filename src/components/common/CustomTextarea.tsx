import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/ui/utils";

export interface CustomTextareaProps
  extends React.ComponentProps<typeof Textarea> {
  label?: string;
  helperText?: string;
  error?: string;
  showResizeHandle?: boolean;
  labelClassName?: string;
  helperTextClassName?: string;
}

export function CustomTextarea({
  label = "Message",
  placeholder = "Enter your message",
  className,
  helperText,
  error,
  showResizeHandle = true,
  labelClassName,
  helperTextClassName,
  onFocus,
  onBlur,
  disabled,
  ...props
}: CustomTextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const borderColor = error
    ? "border-[#de1507]"
    : isFocused
      ? "border-[#2374ff]"
      : isHovered
        ? "border-[#717182]"
        : "border-gray-200";

  const labelColor = error ? "text-[#de1507]" : "text-[#4a3c2a]";

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative w-full">
      {/* Label */}
      {label && (
        <div className="content-stretch flex gap-[7px] h-[12.25px] items-center relative shrink-0 w-full">
          <p
            className={cn(
              "font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] text-[14px] text-nowrap whitespace-pre",
              labelColor,
              labelClassName
            )}
          >
            {label}
          </p>
        </div>
      )}

      {/* Textarea Container */}
      <div
        className={cn(
          "bg-white relative rounded-[12px] shrink-0 w-full h-[120px] max-h-[120px] transition-colors duration-200 border",
          borderColor,
          disabled ? "opacity-60 cursor-not-allowed" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Textarea
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "h-full resize-none border-none bg-transparent outline-none shadow-none font-['Comfortaa:Regular',sans-serif] font-normal text-[#717182] text-[12px] leading-[18px] placeholder:text-[#717182] px-[16px] py-[12px]",
            "focus-visible:ring-0 focus-visible:border-none focus-visible:outline-none",
            className
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {/* Resize Icon */}
        {showResizeHandle && (
          <div className="absolute right-[16px] bottom-[12px] h-[17.5px] w-[15.5px] pointer-events-none">
            <svg
              className="block size-full"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M1 15L15 1"
                stroke={
                  error
                    ? "#de1507"
                    : isFocused
                      ? "#2374ff"
                      : isHovered
                        ? "#717182"
                        : "#D6D6D6"
                }
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M5 15L15 5"
                stroke={
                  error
                    ? "#de1507"
                    : isFocused
                      ? "#2374ff"
                      : isHovered
                        ? "#717182"
                        : "#D6D6D6"
                }
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {error ? (
        <p className="font-['Comfortaa:Medium',sans-serif] text-[12px] text-[#de1507]">
          {error}
        </p>
      ) : helperText ? (
        <p className={cn(
          "font-['Comfortaa:Regular',sans-serif] font-normal leading-[14px] text-[10.5px] text-[#6a7282]",
          helperTextClassName
        )}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

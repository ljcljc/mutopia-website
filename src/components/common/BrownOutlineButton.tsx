import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface BrownOutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: "standard" | "medium" | "compact";
  fullWidth?: boolean;
  loading?: boolean;
}

export const BrownOutlineButton = forwardRef<HTMLButtonElement, BrownOutlineButtonProps>(
  (
    {
      children,
      size = "medium",
      fullWidth = false,
      loading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative rounded-[32px] transition-all duration-200 cursor-pointer group";
    const isDisabled = disabled || loading;

    // Size styles
    const sizeStyles = {
      standard: "h-[48px] px-[28px] py-[14px]",
      medium: "h-[36px] px-[28px] py-[16px]",
      compact: "h-[28px] px-[12px] py-[4px]",
    };

    // Variant styles - based on Figma design
    // Default: border 2px solid #8B6357, color #8B6357, no background
    // Hover: border 2px solid #8B6357, background rgba(139, 99, 87, 0.20), color #8B6357
    // Focus: border 2px solid #2374FF, background rgba(139, 99, 87, 0.20), color #8B6357
    const variantStyles =
      "bg-transparent border-2 border-[#8B6357] text-[#8B6357] hover:bg-[rgba(139,99,87,0.20)] hover:border-[#8B6357] active:bg-[rgba(139,99,87,0.20)] active:border-[#8B6357] focus-visible:bg-[rgba(139,99,87,0.20)] focus-visible:border-[#2374ff]";

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${widthStyle} ${className}`}
        {...props}
      >
        <div className="flex gap-[7px] items-center justify-center size-full relative z-10">
          {/* Spinner overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="medium" color="#8B6357" />
            </div>
          )}
          {/* Content - invisible when loading but still takes up space */}
          {typeof children === "string" ? (
            <p
              className={`font-['Comfortaa:Bold',sans-serif] leading-[24.5px] text-[16px] whitespace-nowrap ${loading ? "invisible" : ""}`}
            >
              {children}
            </p>
          ) : (
            <div className={loading ? "invisible" : ""}>{children}</div>
          )}
        </div>
      </button>
    );
  }
);

BrownOutlineButton.displayName = "BrownOutlineButton";










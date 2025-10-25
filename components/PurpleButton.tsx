import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface PurpleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "bordered";
  size?: "standard" | "medium";
  fullWidth?: boolean;
  loading?: boolean;
}

export const PurpleButton = forwardRef<HTMLButtonElement, PurpleButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "standard",
      fullWidth = false,
      loading = false,
      disabled,
      className = "",
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "relative rounded-[32px] transition-all duration-200 cursor-pointer group";
    const isDisabled = disabled || loading;

    // Outline and bordered buttons have border-2, so they need different padding to maintain visual size
    const sizeStyles = {
      standard: variant === "outline" || variant === "bordered" ? "h-[48px] px-[30px] py-[18px]" : "h-[48px] px-[28px] py-[14px]",
      medium: variant === "outline" || variant === "bordered" ? "h-[36px] px-[30px] py-[18px]" : "h-[36px] px-[28px] py-[14px]",
    };

    const variantStyles = {
      primary:
        "bg-[#633479] hover:bg-[rgba(99,52,121,0.8)] active:bg-[rgba(99,52,121,0.8)] focus-visible:bg-[rgba(99,52,121,0.8)] text-white",
      outline:
        "bg-white hover:bg-[rgba(99,52,121,0.2)] active:bg-[rgba(99,52,121,0.2)] focus-visible:bg-[rgba(99,52,121,0.2)] focus-visible:border-[#2374ff] active:border-[#2374ff] text-[#633479] border-2 border-transparent",
      bordered:
        "bg-neutral-100 hover:bg-[#f2dfcf] active:bg-[#f2dfcf] focus-visible:bg-[#f2dfcf] focus-visible:border-[#2374ff] active:border-[#2374ff] text-[#633479] border-2 border-[#633479]",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    if (variant === "primary") {
      return (
        <button
          ref={ref}
          disabled={isDisabled}
          className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${widthStyle} ${className}`}
          {...props}
        >
          {/* Focus ring - appears on keyboard focus and active state */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[32px] pointer-events-none border-2 border-transparent group-focus-visible:border-[#2374ff] group-active:border-[#2374ff] transition-colors duration-200"
          />
          <div className="flex gap-[8px] items-center justify-center size-full relative z-10">
            {/* Spinner overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="medium" color="white" />
              </div>
            )}
            {/* Content - invisible when loading but still takes up space */}
            {typeof children === "string" ? (
              <p className={`font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] whitespace-nowrap ${loading ? "invisible" : ""}`}>
                {children}
              </p>
            ) : (
              <div className={loading ? "invisible" : ""}>
                {children}
              </div>
            )}
          </div>
        </button>
      );
    }

    // Outline and bordered variants
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${widthStyle} ${className}`}
        {...props}
      >
        <div className="flex gap-[8px] items-center justify-center size-full relative">
          {/* Spinner overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="medium" color="#633479" />
            </div>
          )}
          {/* Content - invisible when loading but still takes up space */}
          {typeof children === "string" ? (
            <p className={`font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] whitespace-nowrap ${loading ? "invisible" : ""}`}>
              {children}
            </p>
          ) : (
            <div className={loading ? "invisible" : ""}>
              {children}
            </div>
          )}
        </div>
      </button>
    );
  },
);

PurpleButton.displayName = "PurpleButton";

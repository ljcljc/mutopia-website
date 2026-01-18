import { ButtonHTMLAttributes, forwardRef } from "react";
import { Spinner } from "./Spinner";

interface OrangeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "secondary";
  size?: "standard" | "medium" | "compact";
  fullWidth?: boolean;
  showArrow?: boolean;
  loading?: boolean;
  textSize?: number;
}

export const OrangeButton = forwardRef<HTMLButtonElement, OrangeButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "standard",
      fullWidth = false,
      showArrow = false,
      loading = false,
      textSize,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative rounded-[32px] transition-all duration-200 cursor-pointer group";
    const isDisabled = disabled || loading;

    const textStyle = textSize ? { fontSize: `${textSize}px` } : undefined;

    // Compact variant has special styling
    if (size === "compact") {
      // Compact Primary
      if (variant === "primary") {
        return (
          <button
            ref={ref}
            disabled={isDisabled}
            className={`${baseStyles} h-[28px] bg-[#8b6357] hover:bg-[rgba(139,99,87,0.8)] active:bg-[rgba(139,99,87,0.8)] focus-visible:bg-[rgba(139,99,87,0.8)] ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${fullWidth ? "w-full" : ""} ${className}`}
            {...props}
          >
            {/* Focus ring - appears on keyboard focus and active state */}
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[32px] pointer-events-none border-2 border-transparent group-focus-visible:border-[#2374ff] group-active:border-[#2374ff] transition-colors duration-200"
            />
            <div className="flex flex-row items-center justify-center size-full relative z-10">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[16px] relative size-full">
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[5px] items-center relative">
                    {/* Spinner overlay */}
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Spinner size="small" color="#FFF7ED" />
                      </div>
                    )}
                    {/* Content - invisible when loading but still takes up space */}
                    {typeof children === "string" ? (
                      <p
                        className={`bg-clip-text font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px] text-nowrap whitespace-pre ${loading ? "invisible" : ""}`}
                        style={{
                          ...textStyle,
                          backgroundImage:
                            "linear-gradient(180deg, #FFF7ED 0%, #FFFBEB 100%)",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {children}
                      </p>
                    ) : (
                      <div className={loading ? "invisible" : ""}>
                        {children}
                      </div>
                    )}
                    {showArrow && (
                      <div className="relative shrink-0 size-[14px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 14 14"
                        >
                          <g>
                            <path
                              d="M2.91668 7H11.0833"
                              stroke="url(#paint0_linear_compact)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.16667"
                            />
                            <path
                              d="M7 2.9166L11.0833 6.99993L7 11.0833"
                              stroke="url(#paint1_linear_compact)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.16667"
                            />
                          </g>
                          <defs>
                            <linearGradient
                              gradientUnits="userSpaceOnUse"
                              id="paint0_linear_compact"
                              x1="2.91668"
                              x2="3.15796"
                              y1="7"
                              y2="8.97046"
                            >
                              <stop stopColor="#FFF7ED" />
                              <stop offset="1" stopColor="#FFFBEB" />
                            </linearGradient>
                            <linearGradient
                              gradientUnits="userSpaceOnUse"
                              id="paint1_linear_compact"
                              x1="7"
                              x2="13.5333"
                              y1="2.9166"
                              y2="6.18326"
                            >
                              <stop stopColor="#FFF7ED" />
                              <stop offset="1" stopColor="#FFFBEB" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      }

      // Compact Secondary
      if (variant === "secondary") {
        return (
          <button
            ref={ref}
            disabled={isDisabled}
            className={`${baseStyles} h-[28px] bg-transparent hover:bg-[rgba(139,99,87,0.2)] active:bg-[rgba(139,99,87,0.2)] focus-visible:bg-[rgba(139,99,87,0.2)] ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${fullWidth ? "w-full" : ""} ${className}`}
            {...props}
          >
            {/* Border - changes color on focus/active */}
            <div
              aria-hidden="true"
              className="absolute border-2 border-[#8b6357] border-solid inset-0 pointer-events-none rounded-[32px] group-focus-visible:border-[#2374ff] group-active:border-[#2374ff] transition-colors duration-200"
            />
            <div className="flex flex-row items-center justify-center size-full relative z-10">
              <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[30px] py-[18px] relative size-full">
                <div className="relative shrink-0">
                  <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[5px] items-center relative">
                    {/* Spinner overlay */}
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Spinner size="small" color="#8b6357" />
                      </div>
                    )}
                    {/* Content - invisible when loading but still takes up space */}
                    {typeof children === "string" ? (
                      <p
                        className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px] text-nowrap whitespace-pre ${loading ? "invisible" : ""}`}
                        style={textStyle}
                      >
                        {children}
                      </p>
                    ) : (
                      <div className={loading ? "invisible" : ""}>
                        {children}
                      </div>
                    )}
                    {showArrow && (
                      <div className="relative shrink-0 size-[14px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 14 14"
                        >
                          <g>
                            <path
                              d="M2.91668 7H11.0833"
                              stroke="#8B6357"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.16667"
                            />
                            <path
                              d="M7 2.9166L11.0833 6.99993L7 11.0833"
                              stroke="#8B6357"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.16667"
                            />
                          </g>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </button>
        );
      }
    }

    // Outline buttons have border-2, so they need different padding to maintain visual size
    const sizeStyles = {
      standard:
        variant === "outline"
          ? "h-[48px] px-[30px] py-[16px]"
          : "h-[48px] px-[28px] py-[14px]",
      medium: "h-[36px] px-[28px] py-[16px]",
    };

    const variantStyles = {
      primary:
        "bg-[#de6a07] hover:bg-[rgba(222,106,7,0.8)] active:bg-[rgba(222,106,7,0.8)] focus-visible:bg-[rgba(222,106,7,0.8)] text-white",
      outline:
        "border-2 border-[#de6a07] focus-visible:border-[#2374ff] active:border-[#2374ff] text-[#de6a07] hover:bg-[rgba(222,106,7,0.16)] active:bg-[rgba(222,106,7,0.16)] focus-visible:bg-[rgba(222,106,7,0.16)]",
      secondary: "",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    if (variant === "primary") {
      return (
        <button
          ref={ref}
          disabled={isDisabled}
          className={`${baseStyles} ${sizeStyles[size as "standard" | "medium"]} ${variantStyles[variant]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${widthStyle} ${className}`}
          {...props}
        >
          {/* Focus ring - appears on keyboard focus and active state */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[32px] pointer-events-none border-2 border-transparent group-focus-visible:border-[#2374ff] group-active:border-[#2374ff] transition-colors duration-200"
          />
          <div className="flex gap-[7px] items-center justify-center size-full relative z-10">
            {/* Spinner overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="medium" color="white" />
              </div>
            )}
            {/* Content - invisible when loading but still takes up space */}
            {typeof children === "string" ? (
              <p
                className={`font-['Comfortaa:Bold',sans-serif] leading-[24.5px] text-[16px] whitespace-nowrap ${loading ? "invisible" : ""}`}
                style={textStyle}
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

    // Outline variant
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`${baseStyles} ${sizeStyles[size as "standard" | "medium"]} ${variantStyles[variant]} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""} ${widthStyle} ${className}`}
        {...props}
      >
        <div className="flex gap-[7px] items-center justify-center size-full relative">
          {/* Spinner overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="medium" color="#de6a07" />
            </div>
          )}
          {/* Content - invisible when loading but still takes up space */}
          {typeof children === "string" ? (
            <p
              className={`font-['Comfortaa:Bold',sans-serif] leading-[24.5px] text-[#de6a07] text-[16px] whitespace-nowrap ${loading ? "invisible" : ""}`}
              style={textStyle}
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

OrangeButton.displayName = "OrangeButton";

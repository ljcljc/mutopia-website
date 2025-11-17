import React from "react";
import { Spinner } from "./Spinner";

interface TertiaryButtonProps {
  children: React.ReactNode;
  variant?: "orange" | "brown";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}

export function TertiaryButton({
  children,
  variant = "orange",
  onClick,
  className = "",
  type = "button",
  loading = false,
  disabled,
}: TertiaryButtonProps) {
  const textColor = variant === "orange" ? "text-[#de6a07]" : "text-[#8b6357]";
  const spinnerColor = variant === "orange" ? "#de6a07" : "#8b6357";
  const hoverBorderColor =
    variant === "orange" ? "hover:border-[#de6a07]" : "hover:border-[#8b6357]";
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative rounded-[12px] h-[28px] 
        border border-transparent
        ${hoverBorderColor}
        focus:border-[#2374ff] 
        active:border-[#2374ff]
        transition-colors duration-200
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
      data-name="Button tertiary"
    >
      <div className="flex flex-row items-center justify-center size-full relative">
        {/* Spinner overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="small" color={spinnerColor} />
          </div>
        )}
        {/* Content - invisible when loading but still takes up space */}
        <div
          className={`box-border content-stretch flex gap-[12px] items-center justify-center px-[12px] py-[4px] relative size-full ${loading ? "invisible" : ""}`}
        >
          <p
            className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 ${textColor} text-[12px] text-nowrap whitespace-pre`}
          >
            {children}
          </p>
        </div>
      </div>
    </button>
  );
}

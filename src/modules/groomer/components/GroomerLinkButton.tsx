interface GroomerLinkButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GroomerLinkButton({
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: GroomerLinkButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center border-0 bg-transparent p-0 text-center transition-[color,transform,opacity] hover:text-[#6E4F46] active:scale-[0.96] active:text-[#6E4F46] active:opacity-70 focus-visible:text-[#6E4F46] ${disabled ? "cursor-not-allowed opacity-60 active:scale-100 active:opacity-60" : "cursor-pointer"} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

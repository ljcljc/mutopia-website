interface GroomerLinkButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GroomerLinkButton({
  children,
  className = "",
  onClick,
  type = "button",
}: GroomerLinkButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-center transition-[color,transform,opacity] hover:text-[#6E4F46] active:scale-[0.96] active:text-[#6E4F46] active:opacity-70 focus-visible:text-[#6E4F46] ${className}`.trim()}
    >
      {children}
    </button>
  );
}

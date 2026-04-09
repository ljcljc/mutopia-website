import { OrangeButton } from "@/components/common";

interface GroomerPrimaryActionButtonProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GroomerPrimaryActionButton({
  children,
  className = "",
  fullWidth = false,
  onClick,
  type = "button",
}: GroomerPrimaryActionButtonProps) {
  return (
    <OrangeButton
      type={type}
      variant="primary"
      size="compact"
      fullWidth={fullWidth}
      onClick={onClick}
      className={`h-[48px] ${className}`.trim()}
      textSize={15}
    >
      {children}
    </OrangeButton>
  );
}

import { OrangeButton } from "@/components/common";

interface GroomerPrimaryActionButtonProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GroomerPrimaryActionButton({
  children,
  className = "",
  fullWidth = false,
  disabled = false,
  loading = false,
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
      disabled={disabled}
      loading={loading}
      className={`h-[48px] ${className}`.trim()}
      textSize={15}
    >
      {children}
    </OrangeButton>
  );
}

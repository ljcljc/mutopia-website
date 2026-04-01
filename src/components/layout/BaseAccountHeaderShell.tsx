import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/components/ui/utils";

interface BaseAccountHeaderShellProps {
  children: ReactNode;
  wrapperClassName?: string;
  containerClassName: string;
  wrapperStyle?: CSSProperties;
  dataName?: string;
}

export default function BaseAccountHeaderShell({
  children,
  wrapperClassName,
  containerClassName,
  wrapperStyle,
  dataName,
}: BaseAccountHeaderShellProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full rounded-bl-[21px] rounded-br-[21px] border-b border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.95)]",
        wrapperClassName
      )}
      style={wrapperStyle}
      data-name={dataName}
    >
      <div className="w-full">
        <div className={containerClassName}>{children}</div>
      </div>
    </header>
  );
}

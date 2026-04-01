import type { ReactNode } from "react";
import { accountCenterTheme } from "./theme";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <section
      className={`${accountCenterTheme.cardRadiusClassName} ${accountCenterTheme.cardBgClassName} ${accountCenterTheme.cardShadowClassName} ${className}`}
    >
      {children}
    </section>
  );
}


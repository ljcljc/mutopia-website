import { Icon } from "@/components/common/Icon";

interface PerformanceBenefitItemProps {
  title: string;
  description: string;
  tone?: "gold" | "neutral";
  className?: string;
}

export default function PerformanceBenefitItem({
  title,
  description,
  tone = "gold",
  className = "",
}: PerformanceBenefitItemProps) {
  const iconName = tone === "neutral" ? "dot" : "target";
  const iconWrapperClassName =
    tone === "neutral"
      ? "mt-px flex size-[19.99px] items-center justify-center rounded-full border-2 border-[#8B6357] bg-white"
      : "mt-px flex size-[19.99px] items-center justify-center rounded-full bg-[#DE6A07]";

  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <div className={iconWrapperClassName}>
        <Icon
          name={iconName}
          className={`size-[14px] ${tone === "neutral" ? "text-[#8B6357]" : "text-white"}`}
          aria-hidden="true"
        />
      </div>
      <div>
        <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{title}</p>
        <p className="font-comfortaa text-[12px] leading-[18px] text-[#6B7280]">{description}</p>
      </div>
    </li>
  );
}

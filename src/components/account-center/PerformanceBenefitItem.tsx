import { Icon } from "@/components/common/Icon";

interface PerformanceBenefitItemProps {
  title: string;
  description: string;
  className?: string;
}

export default function PerformanceBenefitItem({ title, description, className = "" }: PerformanceBenefitItemProps) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <div className="mt-[1px] flex size-[19.99px] items-center justify-center rounded-full bg-[#DE6A07]">
        <Icon name="target" className="size-[14px] text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="font-comfortaa text-[14px] font-medium leading-[21px] text-[#4A2C55]">{title}</p>
        <p className="font-comfortaa text-[12px] leading-[18px] text-[#6B7280]">{description}</p>
      </div>
    </li>
  );
}

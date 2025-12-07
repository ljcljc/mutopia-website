import { PurpleButton } from "@/components/common";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";

export interface FeatureItem {
  text: string;
  isHighlight?: boolean;
}

export interface MembershipCardProps {
  title: string;
  price: string;
  priceUnit?: string;
  badgeText?: string;
  description?: string;
  features: FeatureItem[];
  buttonText?: string;
  showMostPopular?: boolean;
  onButtonClick?: () => void;
  // Step4 样式相关 props
  variant?: "standalone" | "wrapped";
  headerTitle?: string;
  headerSubtitle?: string;
  showButton?: boolean;
  className?: string;
}

export function MembershipCard({
  title,
  price,
  priceUnit = "/year",
  badgeText,
  description,
  features,
  buttonText = "Go premium",
  showMostPopular = false,
  onButtonClick,
  variant = "standalone",
  headerTitle,
  headerSubtitle,
  showButton = true,
  className,
}: MembershipCardProps) {
  // 特性列表组件（共享）
  const featuresList = (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
        {features.map((feature, index) => (
          <div
            key={index}
            className="content-stretch flex items-start relative shrink-0"
          >
            <div className="relative shrink-0">
              <div className="bg-clip-padding border-0 border-transparent border-solid content-stretch flex flex-col items-start justify-center relative">
                <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                  <div className="relative shrink-0 size-[16.8px]">
                    <Icon name="check-green" className="block size-full text-[#00A63E]" />
                  </div>
                  <p
                    className={`font-['Comfortaa:Bold',sans-serif] font-bold leading-[17.5px] relative shrink-0 text-[12.25px] whitespace-nowrap ${
                      feature.isHighlight
                        ? "text-[#de6a07]"
                        : "text-[#364153]"
                    }`}
                  >
                    {feature.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Standalone 变体（Packages 使用）
  if (variant === "standalone") {
    return (
      <div className={`relative w-full max-w-[336px] md:max-w-[384px] ${className || ""}`}>
        {/* Most Popular Badge */}
        {showMostPopular && (
          <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 z-20">
            <div className="bg-[#633479] h-[24px] px-[22px] py-[4.5px] rounded-full flex items-center justify-center">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[14px] text-[10.5px] text-white whitespace-nowrap">
                Most Popular
              </p>
            </div>
          </div>
        )}
        {/* Card */}
        <div className="bg-[rgba(255,255,255,0.96)] rounded-[16px] p-[32px] flex flex-col gap-[16px] items-center shadow-xl">
          <div className="content-stretch flex flex-col gap-[24px] items-center w-full">
            {/* Pricing Header */}
            <div className="content-stretch flex flex-col gap-[16px] items-center py-[16px] w-full">
              <div className="content-stretch flex flex-col gap-[12px] items-center">
                {/* Title and Price */}
                <div className="flex flex-col md:flex-row gap-[12px] items-center justify-center">
                  <p className="font-['Comfortaa:Bold',sans-serif] leading-[normal] text-[#633479] text-[24px] text-center whitespace-nowrap">
                    {title}
                  </p>
                  <div className="flex gap-[4px] items-center">
                    <p className="font-['Comfortaa:Bold',sans-serif] leading-[normal] text-[#633479] text-[24px] text-center whitespace-nowrap">
                      {price}
                    </p>
                    {priceUnit && (
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] text-[#4a5565] text-[14px] text-center whitespace-nowrap">
                        {priceUnit}
                      </p>
                    )}
                  </div>
                </div>
                {/* Badge */}
                {badgeText && (
                  <div className="flex gap-[12px] items-center">
                    <Badge className="bg-green-100 text-[#016630] h-[24px] px-[16px] py-[4px] rounded-[12px] hover:bg-green-100">
                      <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] text-[10px] whitespace-nowrap">
                        {badgeText}
                      </p>
                    </Badge>
                  </div>
                )}
              </div>
              {/* Description */}
              {description && (
                <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)] text-center whitespace-pre-line max-w-[280px]">
                  {description}
                </p>
              )}
            </div>
            {/* Features List */}
            {featuresList}
            {/* CTA Button */}
            {showButton && (
              <div className="w-full px-0 md:px-[24px] pt-[8px]">
                <PurpleButton size="medium" fullWidth onClick={onButtonClick}>
                  <div className="flex gap-[4px] items-center">
                    <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
                      {buttonText}
                    </p>
                    <Icon name="button-arrow" size={14} className="text-white" />
                  </div>
                </PurpleButton>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Wrapped 变体（Step4 使用）
  return (
    <div className={`content-stretch flex flex-col items-start relative shrink-0 ${className || ""}`}>
      <div className="bg-[#8760a0] content-stretch flex flex-col items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-full">
          {/* Header Title and Subtitle */}
          {(headerTitle || headerSubtitle) && (
            <div className="content-stretch flex flex-col gap-[3.5px] h-[45.5px] items-center relative shrink-0">
              {headerTitle && (
                <div className="content-stretch flex h-[24.5px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[24.5px] relative shrink-0 text-[15.75px] text-white text-center">
                    {headerTitle}
                  </p>
                </div>
              )}
              {headerSubtitle && (
                <div className="h-[17.5px] relative shrink-0 w-full">
                  <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[12.25px] text-white top-[-0.5px]">
                    {headerSubtitle}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* Card Content */}
          <div className="bg-[rgba(255,255,255,0.96)] content-stretch flex flex-col items-center p-[32px] relative rounded-[16px] shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex items-start justify-center relative shrink-0 w-full">
                  <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px px-0 py-[16px] relative shrink-0 max-w-full">
                    <div className="content-stretch flex flex-col gap-[16px] items-center justify-center relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full">
                        {/* Title and Price */}
                        <div className="content-stretch flex gap-[12px] items-start justify-center relative shrink-0">
                          <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#633479] text-[24px] text-center">
                            {title}
                          </p>
                          <div className="content-stretch flex items-center relative shrink-0">
                            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#633479] text-[24px] text-center">
                                {price}
                              </p>
                              {priceUnit && (
                                <div className="content-stretch flex items-center justify-center relative shrink-0">
                                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#4a5565] text-[14px] text-center">
                                    {priceUnit}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Badge */}
                        {badgeText && (
                          <div className="content-stretch flex items-center relative shrink-0">
                            <div className="bg-green-100 content-stretch flex h-[24px] items-center justify-center overflow-clip px-[16px] py-[4px] relative rounded-[12px] shrink-0">
                              <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[#016630] text-[10px]">
                                {badgeText}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Description */}
                      {description && (
                        <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px] text-[rgba(74,60,42,0.7)] text-center whitespace-pre-line max-w-[280px]">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Features List */}
                {featuresList}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

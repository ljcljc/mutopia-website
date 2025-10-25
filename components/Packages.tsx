import svgPaths from "../imports/svg-zb4ynfxey2";
import { PurpleButton } from "./PurpleButton";
import { Badge } from "./ui/badge";
// import { Check } from "lucide-react";

interface FeatureItem {
  text: string;
  isHighlight?: boolean;
}

export default function Packages() {
  const features: FeatureItem[] = [
    { text: "30$ instant cash coupons", isHighlight: true },
    { text: "10% off additional services" },
    { text: "Priority booking" },
    { text: "Free de-shedding treatment" },
    { text: "Premium products upgrade" },
    { text: "Grooming photo updates" },
  ];

  return (
    <div
      id="packages"
      className="bg-gradient-to-br from-[#7b4a8f] via-[#6b4382] to-[#633479] relative w-full py-[56px] md:py-[70px] overflow-hidden"
      data-name="Packages"
    >
      {/* Background Decorative Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large blur circles for depth - Desktop only */}
        <div className="absolute bg-[rgba(255,255,255,0.08)] blur-[80px] rounded-full w-[280px] h-[280px] top-[180px] right-[80px] hidden lg:block" />
        <div className="absolute bg-[rgba(255,255,255,0.06)] blur-[100px] rounded-full w-[320px] h-[320px] top-[380px] -left-[100px] hidden lg:block" />

        {/* Medium blur circles for ambient glow */}
        <div className="absolute bg-[rgba(255,255,255,0.1)] blur-[60px] rounded-full w-[200px] h-[200px] top-[50px] left-[15%] hidden md:block" />
        <div className="absolute bg-[rgba(255,255,255,0.08)] blur-[50px] rounded-full w-[160px] h-[160px] bottom-[80px] right-[12%] hidden md:block" />

        {/* Small decorative circles - visible on all sizes */}
        <div className="absolute bg-[rgba(255,255,255,0.12)] rounded-full w-[120px] h-[120px] top-[20px] left-[50%] -translate-x-1/2 md:left-[30%] md:translate-x-0 opacity-40" />
        <div className="absolute bg-[rgba(255,255,255,0.12)] rounded-full w-[100px] h-[100px] bottom-[120px] right-[8%] hidden md:block opacity-35" />

        {/* Tiny accent circles */}
        <div className="absolute bg-[rgba(255,255,255,0.18)] rounded-full w-[70px] h-[70px] top-[280px] left-[18%] hidden md:block opacity-30" />
        <div className="absolute bg-[rgba(255,255,255,0.15)] rounded-full w-[50px] h-[50px] top-[240px] left-[22%] hidden lg:block opacity-35" />
        <div className="absolute bg-[rgba(255,255,255,0.15)] rounded-full w-[60px] h-[60px] bottom-[180px] right-[15%] hidden lg:block opacity-30" />

        {/* Mobile-specific subtle circles */}
        <div className="absolute bg-[rgba(255,255,255,0.08)] rounded-full w-[80px] h-[80px] bottom-[40px] left-[10%] md:hidden opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px] relative z-10">
        <div className="flex flex-col gap-[56px] md:gap-[70px] items-center w-full">
          {/* Title */}
          <div className="content-stretch flex flex-col gap-[20px] items-center text-center w-full max-w-[672px]">
            <h2 className="font-['Comfortaa:Bold',_sans-serif] leading-[40px] text-white text-[32px]">
              <span className="md:hidden">
                Membership
                <br />
                Packages
              </span>
              <span className="hidden md:inline">
                Membership Packages
              </span>
            </h2>
            <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(255,255,255,0.8)] max-w-[588px] px-4 md:px-0">
              Save money and ensure your pet always looks their
              best with our convenient monthly membership
              packages.
            </p>
          </div>

          {/* Package Card */}
          <div className="relative w-full max-w-[336px] md:max-w-[384px]">
            {/* Most Popular Badge */}
            <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 z-20">
              <div className="bg-[#633479] h-[24px] px-[22px] py-[4.5px] rounded-full flex items-center justify-center">
                <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] text-[10.5px] text-white whitespace-nowrap">
                  Most Popular
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="bg-[rgba(255,255,255,0.96)] rounded-[16px] p-[32px] flex flex-col gap-[16px] items-center shadow-xl">
              <div className="content-stretch flex flex-col gap-[24px] items-center w-full">
                {/* Pricing Header */}
                <div className="content-stretch flex flex-col gap-[16px] items-center py-[16px] border-b border-gray-100 w-full">
                  <div className="content-stretch flex flex-col gap-[12px] items-center">
                    {/* Title and Price */}
                    <div className="flex flex-col md:flex-row gap-[12px] items-center justify-center">
                      <p className="font-['Comfortaa:Bold',_sans-serif] leading-[normal] text-[#633479] text-[24px] text-center whitespace-nowrap">
                        Premium Plus
                      </p>
                      <div className="flex gap-[4px] items-center">
                        <p className="font-['Comfortaa:Bold',_sans-serif] leading-[normal] text-[#633479] text-[24px] text-center whitespace-nowrap">
                          $ 99
                        </p>
                        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[#4a5565] text-[14px] text-center whitespace-nowrap">
                          /year
                        </p>
                      </div>
                    </div>

                    {/* Was Price and Badge */}
                    <div className="flex gap-[12px] items-center">
                      <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[24.5px] line-through text-[#99a1af] text-[15.75px] text-center whitespace-nowrap">
                        was $199
                      </p>
                      <Badge className="bg-green-100 text-[#016630] h-[24px] px-[16px] py-[4px] rounded-[12px] hover:bg-green-100">
                        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] text-[10px] whitespace-nowrap">
                          Save up to 50%
                        </p>
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)] text-center">
                    Our most popular package for
                    <br />
                    complete pet care
                  </p>
                </div>

                {/* Features List */}
                <div className="content-stretch flex flex-col gap-[12px] items-start w-full">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex gap-[12px] items-start w-full"
                    >
                      <div className="shrink-0 size-[16.8px] mt-[1px]">
                        <svg
                          className="block size-full"
                          fill="none"
                          viewBox="0 0 17 17"
                        >
                          <g>
                            <path
                              d={svgPaths.p37829300}
                              stroke="#00A63E"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.33333"
                            />
                          </g>
                        </svg>
                      </div>
                      <p
                        className={`font-['Comfortaa:Bold',_sans-serif] leading-[17.5px] text-[12.25px] ${
                          feature.isHighlight
                            ? "text-[#de6a07]"
                            : "text-[#364153]"
                        }`}
                      >
                        {feature.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="w-full px-0 md:px-[24px] pt-[8px]">
                  <PurpleButton size="medium" fullWidth>
                    <div className="flex gap-[4px] items-center">
                      <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] text-[14px] text-nowrap whitespace-pre">
                        Go premium
                      </p>
                      <svg
                        className="size-[14px]"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <g>
                          <path
                            d="M2.91668 7H11.0833"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.16667"
                          />
                          <path
                            d={svgPaths.pd880200}
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.16667"
                          />
                        </g>
                      </svg>
                    </div>
                  </PurpleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
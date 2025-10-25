import svgPaths from "../imports/svg-w2x3orw39j";
// 使用占位图片替换 figma:asset 导入
const imgImageWithFallback = "/images/grooming-hero.png";
import { OrangeButton } from "./OrangeButton";
import { Calendar, Heart, Star } from "lucide-react";

export default function Hero() {
  return (
    <div
      className="relative w-full bg-gradient-to-b from-[#fdf8f3] to-[#f9f1e8] overflow-hidden"
      data-name="Hero"
    >
      {/* Glow Effect */}
      <div className="absolute right-[10%] md:right-[15%] top-[50px] md:top-[69px] mix-blend-lighten size-[80px] md:size-[109px] pointer-events-none opacity-60">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 109 109"
        >
          <g
            id="Ellipse 1"
            opacity="0.6"
            style={{ mixBlendMode: "lighten" }}
          >
            <circle
              cx="54.5"
              cy="54.5"
              fill="url(#paint0_radial_6_718)"
              fillOpacity="0.8"
              r="54.5"
            />
          </g>
          <defs>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(54.5 54.5) rotate(90) scale(54.5)"
              gradientUnits="userSpaceOnUse"
              id="paint0_radial_6_718"
              r="1"
            >
              <stop stopColor="white" stopOpacity="0.8" />
              <stop
                offset="1"
                stopColor="white"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Desktop & Tablet: Flexbox layout */}
        <div className="hidden md:flex items-start justify-between gap-[78px] px-8 lg:px-[57.5px] pt-[100px] pb-[180px]">
          {/* Left Content */}
          <div className="flex flex-col gap-[32px] items-start flex-shrink-0 max-w-[567px]">
            {/* Title */}
            <div className="flex flex-col items-start w-full">
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[65.625px] text-[56px] text-[#8b6357] whitespace-pre">
                Premium
                <br />
                Pet Grooming
              </p>
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[65.625px] text-[56px] text-[#de6a07] whitespace-pre">
                Made Simple
              </p>
            </div>

            {/* Description */}
            <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(74,60,42,0.7)] w-[489px]">
              Transform your furry friend with our professional
              grooming services. Book online, relax at home, and
              let our certified groomers come to you.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-[24px] items-start">
              {/* Easy booking */}
              <div className="flex gap-[7px] items-center">
                <Calendar
                  className="size-[20px] text-[#DE6A07]"
                  strokeWidth={1.66667}
                />
                <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                  Easy booking
                </p>
              </div>

              {/* Pet-friendly */}
              <div className="flex gap-[7px] items-center">
                <Heart
                  className="size-[20px] text-[#8B6357]"
                  strokeWidth={1.66667}
                />
                <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                  Pet-friendly
                </p>
              </div>

              {/* Professional service */}
              <div className="flex gap-[7px] items-center">
                <Star
                  className="size-[20px] text-[#F0B100]"
                  strokeWidth={1.66667}
                />
                <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                  Professional service
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-[14px] items-start">
              <OrangeButton className="w-[209px]">
                Book Appointment
              </OrangeButton>

              <OrangeButton
                variant="outline"
                className="w-[170px]"
              >
                View Services
              </OrangeButton>
            </div>
          </div>

          {/* Right Image */}

          <div className="group relative shrink-0 w-[497px] h-[482.258px]">
            <div className="flex-none h-[499.182px] rotate-[4deg] w-[360.779px] group-hover:rotate-[0deg] transition-transform duration-500 ease-out">
              <img
                alt="Pet grooming service"
                className="inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full"
                src={imgImageWithFallback}
              />
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="md:hidden flex flex-col gap-[40px] px-4 pt-[60px] pb-[140px]">
          {/* Title */}
          <div className="flex flex-col items-start w-full">
            <p className="font-['Comfortaa:Bold',_sans-serif] leading-[1.17] text-[32px] text-[#8b6357]">
              Premium
              <br />
              Pet Grooming
            </p>
            <p className="font-['Comfortaa:Bold',_sans-serif] leading-[1.17] text-[32px] text-[#de6a07]">
              Made Simple
            </p>
          </div>

          {/* Mobile Image */}
          {/* <div className="relative w-full flex items-center justify-center" style={{ minHeight: '350px' }}>
            <div className="relative" style={{ width: '250px', height: '346px' }}>
              <img
                alt="Pet grooming service"
                className="w-full h-full object-contain rotate-[4deg]"
                src={imgImageWithFallback}
              />
            </div>
          </div> */}

          {/* Description */}
          <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(74,60,42,0.7)]">
            Transform your furry friend with our professional
            grooming services. Book online, relax at home, and
            let our certified groomers come to you.
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-[16px] items-start">
            {/* Easy booking */}
            <div className="flex gap-[7px] items-center">
              <Calendar
                className="size-[20px] text-[#DE6A07]"
                strokeWidth={1.66667}
              />
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                Easy booking
              </p>
            </div>

            {/* Pet-friendly */}
            <div className="flex gap-[7px] items-center">
              <Heart
                className="size-[20px] text-[#8B6357]"
                strokeWidth={1.66667}
              />
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                Pet-friendly
              </p>
            </div>

            {/* Professional service */}
            <div className="flex gap-[7px] items-center">
              <Star
                className="size-[20px] text-[#F0B100]"
                strokeWidth={1.66667}
              />
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px] text-[rgba(74,60,42,0.8)]">
                Professional service
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-[14px] w-full">
            <OrangeButton fullWidth>
              Book Appointment
            </OrangeButton>

            <OrangeButton variant="outline" fullWidth>
              View Services
            </OrangeButton>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div
        className="absolute bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none"
        style={{ height: "139px" }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2674px] h-[139px] rotate-180 scale-y-[-100%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 2676 141"
          >
            <g>
              <path d={svgPaths.p30823500} fill="white" />
              <path d={svgPaths.p7eb59f0} fill="white" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

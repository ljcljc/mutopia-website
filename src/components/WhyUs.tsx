import { useRef } from "react";
import Slider from "react-slick";
import svgPaths from "@/assets/icons/svg-s9drboz5og";
import svgPathsMobile from "@/assets/icons/svg-ne441427l6";
import iconArrowLeft from "@/assets/icons/icon-arrow-left.svg";
import iconArrowRight from "@/assets/icons/icon-arrow-right.svg";
// 使用占位图片替换 figma:asset 导入
const imgImageWithFallback = "/images/happy-dog-grooming.png";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import iconCertifiedProfessionals from "@/assets/icons/icon-certified-professionals.svg";
import iconConvenientScheduling from "@/assets/icons/icon-convenient-scheduling.svg";
import iconPersonalizedCare from "@/assets/icons/icon-personalized-care.svg";
import iconPremiumQuality from "@/assets/icons/icon-premium-quality.svg";
import iconStressFreeExperience from "@/assets/icons/icon-stress-free-experience.svg";
import iconRealTimeUpdates from "@/assets/icons/icon-real-time-updates.svg";

// Feature Card Components for Desktop
function FeatureCard1() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconCertifiedProfessionals} alt="Certified Professionals" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Certified Professionals
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">
          All our groomers are certified, insured, and
          background-checked for your peace of mind.
        </p>
      </CardContent>
    </Card>
  );
}

function FeatureCard2() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconConvenientScheduling} alt="Convenient Scheduling" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Convenient Scheduling
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">
          Book appointments online 24/7. We work around your
          schedule, not the other way around.
        </p>
      </CardContent>
    </Card>
  );
}

function FeatureCard3() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconPersonalizedCare} alt="Personalized Care" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Personalized Care
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">{`Every pet is unique. We tailor our services to your pet's specific needs and temperament.`}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard4() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconPremiumQuality} alt="Premium Quality" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Premium Quality
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">
          We use only the finest, pet-safe products and
          state-of-the-art equipment.
        </p>
      </CardContent>
    </Card>
  );
}

function FeatureCard5() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconStressFreeExperience} alt="Stress-Free Experience" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Stress-Free Experience
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">
          Mobile service means no stressful car rides. Your pet
          stays comfortable at home.
        </p>
      </CardContent>
    </Card>
  );
}

function FeatureCard6() {
  return (
    <Card className="border-0 shadow-none bg-transparent gap-[16px] p-0 w-full lg:w-[238px]">
      <CardContent className="p-0 flex flex-col gap-[16px]">
        <div className="content-stretch flex gap-[10.5px] h-[42px] items-center">
          <Badge iconSize="custom" className="bg-[rgba(222,106,7,0.8)] rounded-[12px] size-[42px] p-0 hover:bg-[rgba(222,106,7,0.8)] flex items-center justify-center">
            <img src={iconRealTimeUpdates} alt="Real-Time Updates" className="size-[24px]" />
          </Badge>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px] text-nowrap whitespace-pre">
            Real-Time Updates
          </h3>
        </div>
        <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)]">
          Get photos and updates throughout the grooming process
          via our mobile app.
        </p>
      </CardContent>
    </Card>
  );
}

// Mobile Image Section Component
function MobileImageSection() {
  return (
    <div
      className="relative w-full max-w-[393px] mx-auto"
      data-name="Img"
    >
      <div className="relative h-[349px]" data-name="Container">
        <div
          className="absolute bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col h-[324px] items-start left-[2px] right-[2px] overflow-clip rounded-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[-9px]"
          data-name="Container"
        >
          <div
            className="h-[324px] relative shrink-0 w-full"
            data-name="ImageWithFallback"
          >
            <img
              alt="Pet care decoration"
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={imgImageWithFallback}
            />
          </div>
        </div>
        <div
          className="absolute bg-[rgba(99,52,121,0.78)] box-border content-stretch flex flex-col items-start left-[2px] right-[2px] p-[12px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[279px]"
          data-name="Container"
        >
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-center flex gap-[12px] sm:gap-[20px] items-center justify-between px-[12px] sm:px-[36px] py-0 relative w-full">
                <div
                  className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre"
                  data-name="Container"
                >
                  <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                    100%
                  </p>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                    Verified groomer
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre"
                  data-name="Container"
                >
                  <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                    Quick
                  </p>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                    Availability
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre"
                  data-name="Container"
                >
                  <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                    Premium
                  </p>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                    Service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute h-[40px] right-[16px] top-[17px] w-[46px]"
        data-name="Vector"
      >
        <div className="absolute inset-[-7.5%_-6.52%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 52 46"
          >
            <path
              d={svgPathsMobile.p2a986c80}
              id="Vector"
              stroke="var(--stroke-0, #633479)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.8"
              strokeWidth="6"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Desktop Image Section Component
function DesktopImageSection() {
  return (
    <div className="relative w-full max-w-[504px]">
      <div className="relative h-[400px]" data-name="Container">
        <div
          className="absolute bg-[rgba(255,255,255,0)] box-border content-stretch flex flex-col h-[417.346px] items-start left-[-6.83px] right-[-13.83px] overflow-clip rounded-[21px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] top-[-8.67px]"
          data-name="Container"
        >
          <div className="h-full relative shrink-0 w-full">
            <img
              alt="Pet care decoration"
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
              src={imgImageWithFallback}
            />
          </div>
        </div>
        <div
          className="absolute bg-[rgba(99,52,121,0.78)] box-border content-stretch flex flex-col items-start left-[28px] right-[28px] px-[36px] py-[12px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-[364.25px]"
          data-name="Container"
        >
          <div className="content-center flex flex-wrap gap-[20px] items-center justify-between relative shrink-0 w-full">
            <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre">
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                100%
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                Verified groomer
              </p>
            </div>
            <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre">
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                Quick
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                Availability
              </p>
            </div>
            <div className="content-stretch flex flex-col h-[45.5px] items-center relative shrink-0 text-center text-nowrap text-white whitespace-pre">
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] relative shrink-0 text-[20px]">
                Premium
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12px]">
                Service
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute h-[58px] right-[20px] top-[17.25px] w-[69px]"
        data-name="Vector"
      >
        <div className="absolute inset-[-6.9%_-5.8%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 77 66"
          >
            <path
              d={svgPaths.p139f0a00}
              stroke="#633479"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.8"
              strokeWidth="8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Mobile Feature Card Component - Single Card
function MobileFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10.5px] items-center justify-center relative shrink-0 w-full">
        <div className="bg-[rgba(222,106,7,0.8)] relative rounded-[12px] shrink-0 size-[42px] flex items-center justify-center">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[42px]">
            {icon}
          </div>
        </div>
        <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[#de6a07] text-[14px]">
          {title}
        </p>
      </div>
      <div className="h-[68.25px] relative shrink-0 w-full">
        <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] left-1/2 -translate-x-1/2 text-[14px] text-[rgba(74,60,42,0.7)] text-center top-0 w-[233px]">
          {description}
        </p>
      </div>
    </div>
  );
}

// Mobile Slide Component - Contains 2 cards (top and bottom)
function MobileSlide1() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start w-[238px]">
      <MobileFeatureCard
        icon={<img src={iconCertifiedProfessionals} alt="Certified Professionals" className="size-[24px]" />}
        title="Certified Professionals"
        description="All our groomers are certified, insured, and background-checked for your peace of mind."
      />
      <MobileFeatureCard
        icon={<img src={iconConvenientScheduling} alt="Convenient Scheduling" className="size-[24px]" />}
        title="Convenient Scheduling"
        description="Book appointments online 24/7. We work around your schedule, not the other way around."
      />
    </div>
  );
}

function MobileSlide2() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start w-[238px]">
      <MobileFeatureCard
        icon={<img src={iconPersonalizedCare} alt="Personalized Care" className="size-[24px]" />}
        title="Personalized Care"
        description="Every pet is unique. We tailor our services to your pet's specific needs and temperament."
      />
      <MobileFeatureCard
        icon={<img src={iconPremiumQuality} alt="Premium Quality" className="size-[24px]" />}
        title="Premium Quality"
        description="We use only the finest, pet-safe products and state-of-the-art equipment."
      />
    </div>
  );
}

function MobileSlide3() {
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start w-[238px]">
      <MobileFeatureCard
        icon={<img src={iconStressFreeExperience} alt="Stress-Free Experience" className="size-[24px]" />}
        title="Stress-Free Experience"
        description="Mobile service means no stressful car rides. Your pet stays comfortable at home."
      />
      <MobileFeatureCard
        icon={<img src={iconRealTimeUpdates} alt="Real-Time Updates" className="size-[24px]" />}
        title="Real-Time Updates"
        description="Get photos and updates throughout the grooming process via our mobile app."
      />
    </div>
  );
}

// Custom Arrow Components - Not used in mobile, arrows are part of Frame87
// function CustomPrevArrow() {
//   return <div style={{ display: "none" }} />;
// }

// function CustomNextArrow() {
//   return <div style={{ display: "none" }} />;
// }

export default function WhyUs() {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <div
      id="why-us"
      className="bg-white relative w-full -mt-[1px] py-[56px] lg:py-[84px]"
      data-name="WhyUs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px]">
        {/* Title Section */}
        <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 text-center w-full mb-[48px] lg:mb-[56px]">
          <p className="font-['Comfortaa:Bold',_sans-serif] leading-[40px] relative shrink-0 text-[32px] text-[rgba(99,52,121,0.8)] w-full">
            Why Choose Mutopia?
          </p>
          <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] relative shrink-0 text-[16px] text-[rgba(74,60,42,0.7)] w-full max-w-[672px] mx-auto">
            {`We're not just another grooming service. We're pet care specialists who understand that your furry family members deserve the very best.`}
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex content-center flex-wrap gap-[56px] items-center justify-between relative w-full">
          {/* Left Side - Feature Cards Grid */}
          <div className="content-start flex flex-wrap gap-[28px] items-start relative flex-1 max-w-[504px]">
            <FeatureCard1 />
            <FeatureCard2 />
            <FeatureCard3 />
            <FeatureCard4 />
            <FeatureCard5 />
            <FeatureCard6 />
          </div>

          {/* Right Side - Image */}
          <DesktopImageSection />
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col gap-[28px] items-center">
          {/* Image Section */}
          <MobileImageSection />

          {/* Carousel Section - Frame87 */}
          <div
            className="content-start flex flex-wrap gap-[28px] items-start justify-center relative shrink-0 w-full"
            data-name="Container"
          >
            <div
              className="box-border content-stretch flex gap-[24px] sm:gap-[36px] items-center px-4 sm:px-[36px] py-0 relative shrink-0"
              data-name="Frame87"
            >
              <button
                onClick={handlePrev}
                className="flex items-center justify-center relative shrink-0 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous"
              >
                <img
                  src={iconArrowLeft}
                  alt="Previous"
                  className="h-[36px] w-[16px] rotate-180"
                />
              </button>

              <div className="w-[238px]">
                <style>{`
                  .slick-slider {
                    position: relative;
                    display: block;
                    box-sizing: border-box;
                    user-select: none;
                    touch-action: pan-y;
                  }
                  .slick-list {
                    position: relative;
                    display: block;
                    overflow: hidden;
                    margin: 0;
                    padding: 0;
                  }
                  .slick-list:focus {
                    outline: none;
                  }
                  .slick-list.dragging {
                    cursor: pointer;
                  }
                  .slick-slider .slick-track,
                  .slick-slider .slick-list {
                    transform: translate3d(0, 0, 0);
                  }
                  .slick-track {
                    position: relative;
                    top: 0;
                    left: 0;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                  }
                  .slick-track:before,
                  .slick-track:after {
                    display: table;
                    content: '';
                  }
                  .slick-track:after {
                    clear: both;
                  }
                  .slick-loading .slick-track {
                    visibility: hidden;
                  }
                  .slick-slide {
                    display: none;
                    float: left;
                    height: 100%;
                    min-height: 1px;
                  }
                  .slick-slide > div {
                    outline: none;
                  }
                  .slick-slide.slick-loading img {
                    display: none;
                  }
                  .slick-slide.dragging img {
                    pointer-events: none;
                  }
                  .slick-initialized .slick-slide {
                    display: block;
                  }
                  .slick-loading .slick-slide {
                    visibility: hidden;
                  }
                  .slick-vertical .slick-slide {
                    display: block;
                    height: auto;
                    border: 1px solid transparent;
                  }
                  .slick-arrow.slick-hidden {
                    display: none;
                  }
                `}</style>
                <Slider ref={sliderRef} {...settings}>
                  <MobileSlide1 />
                  <MobileSlide2 />
                  <MobileSlide3 />
                </Slider>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center justify-center relative shrink-0 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next"
              >
                <img
                  src={iconArrowRight}
                  alt="Next"
                  className="h-[36px] w-[16px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

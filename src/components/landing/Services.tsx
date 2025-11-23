import { useState } from "react";
// import svgPaths from "@/assets/icons/svg-aj6ul1v84s";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrangeButton } from "@/components/common";
import iconClock from "@/assets/icons/icon-clock.svg";
import iconBathBrush from "@/assets/icons/icon-bath-brush.svg";
import iconFullGrooming from "@/assets/icons/icon-full-grooming.svg";
import iconExpressGroom from "@/assets/icons/icon-express-groom.svg";
import { Icon } from "@/components/common/Icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Service Card Component
interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  price: string;
  includes: string[];
  isPopular?: boolean;
  onBookClick?: () => void;
  isMobile?: boolean;
}

function ServiceCard({
  icon,
  title,
  description,
  duration,
  price,
  includes,
  isPopular = false,
  onBookClick,
  isMobile = false,
}: ServiceCardProps) {
  return (
    <div className="relative pt-4 h-full">
      {isPopular && (
        <Badge className="absolute bg-[#de6a07] left-[24.5px] top-0 h-[24px] px-[16px] py-[4px] rounded-[12px] hover:bg-[#de6a07] z-10 whitespace-nowrap">
          <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[14px] text-[10px] text-white whitespace-nowrap">
            Most Popular
          </p>
        </Badge>
      )}
      <Card
        className={`relative bg-white rounded-[21px] border-2 border-[rgba(0,0,0,0.1)] p-0 h-full ${isMobile ? "w-[280px]" : "w-[336px]"}`}
      >
        <CardContent
          className={`flex flex-col gap-[20px] items-center h-full ${isMobile ? "p-[20px]" : "p-[30px]"}`}
        >
          <div className="content-stretch flex flex-col gap-[32px] items-center w-full flex-1">
            {/* Header */}
            <div className="content-stretch flex flex-col gap-[20px] items-center w-full">
              <div className="bg-[rgba(222,106,7,0.1)] rounded-[21px] size-[56px] flex items-center justify-center">
                {icon}
              </div>

              <div className="content-stretch flex flex-col gap-[12px] items-start w-full">
                <h3 className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[#4a3c2a] text-[16px] text-center w-full">
                  {title}
                </h3>
                <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(74,60,42,0.7)] text-center w-full">
                  {description}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="content-stretch flex flex-col gap-[16px] items-start w-full">
              <div className="content-stretch flex h-[24.5px] items-center justify-between w-full">
                <div className="flex gap-[7px] items-center">
                  <img
                    src={iconClock}
                    alt="Duration"
                    className="size-[16px] opacity-60"
                  />
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[12.25px] text-[rgba(74,60,42,0.6)]">
                    {duration}
                  </p>
                </div>
                <div>
                  <p className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[24.5px] text-[#de6a07]">
                    <span className="text-[14px]">From</span>
                    <span className="text-[17.5px]"> </span>
                    <span className="text-[24px]">{price}</span>
                  </p>
                </div>
              </div>

              {/* Includes */}
              <div className="content-stretch flex flex-col gap-[7px] items-start w-full">
                <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[#4a3c2a] text-[14px]">
                  Includes:
                </p>
                <div className="content-stretch flex flex-col gap-[3.5px] items-start w-full">
                  {includes.map((item, index) => (
                    <div key={index} className="h-[17.5px] relative w-full">
                      <div className="absolute bg-[#de6a07] left-0 rounded-full size-[5.25px] top-[6.13px]" />
                      <p className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] left-[12.25px] text-[12.25px] text-[rgba(74,60,42,0.7)] top-[-0.5px]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <OrangeButton
            variant={isPopular ? "primary" : "outline"}
            size="medium"
            fullWidth
            onClick={onBookClick}
          >
            <div className="flex gap-[4px] items-center">
              <p
                className={`font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] text-[14px] ${
                  isPopular ? "text-white" : "text-[#de6a07]"
                }`}
              >
                Book Now
              </p>
              <Icon
                name="button-arrow"
                aria-label="Arrow"
                className={`size-[14px] ${
                  isPopular ? "text-white" : "text-[#de6a07]"
                }`}
              />
            </div>
          </OrangeButton>
        </CardContent>
      </Card>
    </div>
  );
}

// Additional Service Item Component
interface AdditionalServiceProps {
  name: string;
  price: string;
}

function AdditionalServiceItem({ name, price }: AdditionalServiceProps) {
  return (
    <div className="box-border flex h-[51px] items-center justify-between px-[15px] py-px rounded-[14px] w-full bg-white border border-[#E5E7EB]">
      <div className="flex gap-[10.5px] items-center min-w-0">
        <img src={iconExpressGroom} alt={name} className="size-[20px]" />
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[#4a3c2a] text-[14px] truncate">
          {name}
        </p>
      </div>
      <p className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold leading-[21px] text-[#de6a07] text-[14px] shrink-0 ml-2">
        {price}
      </p>
    </div>
  );
}

export default function Services() {
  const [showAllServicesMobile, setShowAllServicesMobile] = useState(false);

  const services = [
    {
      icon: (
        <img src={iconBathBrush} alt="Bath & Brush" className="size-[32px]" />
      ),
      title: "Bath & Brush",
      description:
        "Refreshing bath with premium products and thorough brushing",
      duration: "1 hour",
      price: "$65",
      includes: [
        "Premium shampoo",
        "Conditioning",
        "Thorough brushing",
        "Basic nail trim",
        "Ear check",
      ],
    },
    {
      icon: (
        <img
          src={iconFullGrooming}
          alt="Full Grooming"
          className="size-[32px]"
        />
      ),
      title: "Full Grooming",
      description: "Complete wash, cut, nail trim, and styling for your pet",
      duration: "1.5-2 hours",
      price: "$95",
      includes: [
        "Bath & dry",
        "Haircut & styling",
        "Nail trimming",
        "Ear cleaning",
        "Teeth brushing",
      ],
      isPopular: true,
    },
    {
      icon: (
        <img
          src={iconExpressGroom}
          alt="Express Groom"
          className="size-[32px]"
        />
      ),
      title: "Express Groom",
      description: "Quick touch-up for pets who need a fast refresh",
      duration: "1 hour",
      price: "$75",
      includes: [
        "Quick wash & dry",
        "Brush out",
        "Nail trim",
        "Sanitary trim",
        "Face & feet groom",
      ],
    },
  ];

  const additionalServices = [
    { name: "Nail Painting", price: "$15" },
    { name: "Teeth Cleaning", price: "$25" },
    { name: "Flea Treatment", price: "$30" },
    { name: "De-shedding Treatment", price: "$35" },
    { name: "Aromatherapy Add-on", price: "$20" },
    { name: "Premium Cologne", price: "$10" },
  ];

  // Get services to display based on state
  // Desktop: show all, Mobile: show based on toggle state
  const displayedServicesMobile = showAllServicesMobile
    ? additionalServices
    : additionalServices.slice(0, 3);

  return (
    <div
      id="services"
      className="bg-[#fdf8f0] relative w-full py-[56px] lg:py-[56px]"
      data-name="Services"
    >
      <div className="flex flex-col gap-[56px] lg:px-14 w-full">
        {/* Title Section - Centered with max-width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px] w-full">
          <div className="content-stretch flex flex-col gap-[12px] items-center w-full">
            <p className="font-['Comfortaa:Bold',_sans-serif] leading-[40px] text-[#4a3c2a] text-[32px] text-center">
              Our Premium Services
            </p>
            <div className="max-w-[672px] mx-auto">
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(74,60,42,0.7)] text-center">
                From basic baths to full spa treatments, we offer everything
                your pet needs to look and feel their absolute best.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop View - Hidden on mobile */}
        <div className="hidden sm:flex content-start flex-wrap gap-[24px] items-stretch justify-center w-full max-w-7xl mx-auto px-8 md:px-12 lg:px-[57.5px]">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} isMobile={false} />
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="block sm:hidden w-full pb-6">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="items-stretch gap-6 ml-0 pl-4">
              {services.map((service, index) => (
                <CarouselItem key={index} className="pl-0 basis-[280px]">
                  <ServiceCard {...service} isMobile={true} />
                </CarouselItem>
              ))}
              {/* Spacer for right padding - 16px */}
              <div className="shrink-0 w-[16px]" aria-hidden="true" />
            </CarouselContent>
          </Carousel>
        </div>

        {/* Additional Services - Full width, no margins */}
        <div className="w-full">
          <div className="bg-white relative w-full border border-[1px] border-[#de6a07] rounded-xl">
            <div className="flex flex-col items-center w-full py-[24px] px-0 sm:px-[24px]">
              <div className="flex flex-col gap-[28px] items-center w-full">
                {/* Additional Services Title */}
                <div className="flex flex-col gap-[7px] items-center text-center max-w-[493px] mx-auto px-4 sm:px-0">
                  <p className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] text-[#4a3c2a] text-[21px]">
                    Additional Services
                  </p>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-[rgba(74,60,42,0.7)]">
                    Enhance your pet's grooming experience with our premium
                    add-ons
                  </p>
                </div>

                {/* Additional Services Grid - Desktop: show all, 3 columns */}
                <div className="hidden sm:grid grid-cols-3 gap-[20px] w-full max-w-7xl mx-auto px-[56px]">
                  {additionalServices.map((service, index) => (
                    <AdditionalServiceItem key={index} {...service} />
                  ))}
                </div>

                {/* Additional Services Grid - Mobile: show with toggle, full width */}
                <div className="flex sm:hidden flex-col gap-[20px] w-full px-0">
                  {displayedServicesMobile.map((service, index) => (
                    <AdditionalServiceItem key={index} {...service} />
                  ))}
                </div>

                {/* View All Button - Mobile only */}
                <Button
                  variant="outline"
                  className="sm:hidden h-[28px] rounded-[32px] w-[209px] border-2 border-[#8b6357] hover:bg-[#8b6357]/5"
                  onClick={() =>
                    setShowAllServicesMobile(!showAllServicesMobile)
                  }
                >
                  <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] text-[#8b6357] text-[12px]">
                    {showAllServicesMobile
                      ? "Show Less"
                      : "View All Services & Pricing"}
                  </p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

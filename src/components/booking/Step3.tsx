import { Icon } from "@/components/common/Icon";
import { Checkbox, OrangeButton, CustomRadio } from "@/components/common";
import { useBookingStore } from "./bookingStore";
import { cn } from "@/components/ui/utils";

// Service package data
const servicePackages = [
  {
    id: "premium-bath",
    name: "Premium bath",
    description: "Bath and dry, brush, and nail trim",
    price: 50,
    duration: "1 hour",
    icon: "bath-brush",
  },
  {
    id: "full-grooming",
    name: "Full grooming",
    description: "Basic bath, haircut & styling",
    price: 100,
    duration: "1.5-2 hours",
    icon: "full-grooming",
  },
] as const;

// Add-on data
interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  category: string;
}

const addOns: AddOn[] = [
  {
    id: "teeth-brushing",
    name: "Teeth brushing",
    description: "Professional dental cleaning",
    price: 15,
    category: "Most Popular",
  },
  {
    id: "de-shedding",
    name: "De-shedding treatment",
    description: "Reduce shedding by up to 80%",
    price: 10,
    duration: "1.5-2 hours",
    category: "Most Popular",
  },
  {
    id: "flea-tick",
    name: "Flea & Tick",
    description: "Kills fleas, ticks, larvae and eggs by contact",
    price: 12,
    category: "Skin & Coat",
  },
  {
    id: "anal-gland",
    name: "Anal Gland Expression",
    description: "Manually emptying the small sacs",
    price: 12,
    category: "Treatments",
  },
  {
    id: "pet-cologne",
    name: "Pet cologne",
    description: "Long-lasting fresh scent",
    price: 8,
    category: "Facial",
  },
  {
    id: "paw-treatment",
    name: "Paw Treatment",
    description: "Moisturizing paw balm",
    price: 18,
    category: "Paws",
  },
] as const;

// Category badges
const categories = ["Most Popular", "Skin & Coat", "Treatments", "Facial", "Paws"] as const;

export function Step3() {
  const {
    servicePackage,
    addOns: selectedAddOns,
    setServicePackage,
    toggleAddOn,
    previousStep,
    nextStep,
  } = useBookingStore();

  // Calculate total price
  const packagePrice = servicePackage
    ? servicePackages.find((pkg) => pkg.id === servicePackage)?.price || 0
    : 0;
  const addOnsPrice = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find((a) => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);
  const totalPrice = packagePrice + addOnsPrice;

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative w-full">
      {/* Service Package Selection */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                  Select your service package
                </p>
              </div>
              <div className="h-[17.5px] relative shrink-0 w-full">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                  Choose the package that best fits your pet's needs
                </p>
              </div>
            </div>
            <div className="gap-[16px] grid grid-cols-2 grid-rows-1 relative shrink-0 w-full">
              {servicePackages.map((pkg) => (
                <CustomRadio
                  key={pkg.id}
                  variant="package"
                  label={pkg.name}
                  icon={pkg.icon as "bath-brush" | "full-grooming"}
                  description={pkg.description}
                  price={pkg.price}
                  duration={pkg.duration}
                  isSelected={servicePackage === pkg.id}
                  onClick={() => setServicePackage(pkg.id as "premium-bath" | "full-grooming")}
                />
              ))}
            </div>
        </div>
      </div>

      {/* Add-ons Selection */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[4px] h-[45.5px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                  Enhance your service with add-on (Optional)
                </p>
              </div>
              <div className="h-[17.5px] relative shrink-0 w-full">
                <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                  Add extra pampering for your furry friend
                </p>
              </div>
            </div>
            {/* Category Badges */}
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
              {categories.map((category) => {
                const isMostPopular = category === "Most Popular";
                return (
                  <div
                    key={category}
                    className={cn(
                      "border border-solid h-[24px] relative rounded-[12px] shrink-0",
                      isMostPopular
                        ? "bg-white border-[#de6a07]"
                        : "border-[#4c4c4c]"
                    )}
                  >
                    <div className="box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[17px] py-[5px] relative rounded-[inherit]">
                      <p
                        className={cn(
                          "font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[10px]",
                          isMostPopular ? "text-[#de6a07]" : "text-[#4c4c4c]"
                        )}
                      >
                        {category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-[17.5px] relative shrink-0 w-full">
              <p className="absolute font-['Comfortaa:Bold',sans-serif] font-bold leading-[20px] left-0 text-[14px] text-[#de6a07] top-[-0.5px]">
                Most popular add-ons
              </p>
            </div>
            {/* Add-ons Grid */}
            <div className="gap-[16px] grid grid-cols-2 relative shrink-0 w-full">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.includes(addOn.id);
                return (
                  <div
                    key={addOn.id}
                    className="border-2 border-gray-200 border-solid box-border content-stretch flex flex-col items-start p-[16px] relative rounded-[14px] shrink-0"
                  >
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                      <div className="relative shrink-0">
                        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-start relative">
                          <div className="content-stretch flex gap-[10px] h-[21px] items-center relative shrink-0">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleAddOn(addOn.id)}
                              containerClassName="cursor-pointer"
                            />
                          </div>
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
                            <div className="h-[21px] relative shrink-0">
                              <p className="absolute font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] left-0 text-[14px] text-[#8b6357] top-[0.5px]">
                                {addOn.name}
                              </p>
                            </div>
                            <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                              <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[#4a5565] text-[12.25px]">
                                {addOn.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative shrink-0">
                        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-end justify-center relative">
                          <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[21px] relative shrink-0 text-[14px] text-[#de6a07]">
                            ${addOn.price}
                          </p>
                          {addOn.duration && (
                            <div className="content-stretch flex gap-[7px] h-[17.5px] items-center relative shrink-0">
                              <Icon name="clock" size={16} className="text-[rgba(74,60,42,0.6)]" />
                              <div className="relative shrink-0">
                                <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative">
                                  <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] relative shrink-0 text-[12.25px] text-[rgba(74,60,42,0.6)]">
                                    {addOn.duration}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </div>

      {/* Total Estimation */}
      <div className="bg-white box-border flex flex-col gap-[20px] items-start p-[24px] relative rounded-[12px] shadow-[0px_8px_12px_-5px_rgba(0,0,0,0.1)] shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex gap-[14px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-[45.5px] items-start min-h-px min-w-px relative shrink-0">
                <div className="content-stretch flex gap-[7px] h-[24.5px] items-center relative shrink-0 w-full">
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[#4a3c2a] text-[16px]">
                    Total estimation for the service
                  </p>
                </div>
                <div className="h-[17.5px] relative shrink-0 w-full">
                  <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a5565] text-[12.25px] top-[-0.5px]">
                    Our groomer will evaluate the final price
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
                <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold leading-[28px] relative shrink-0 text-[16px] text-[#de6a07]">
                  ${totalPrice}
                </p>
                <div className="flex items-center justify-center relative shrink-0 size-[20px]">
                  <div className="flex-none rotate-90">
                    <div className="border border-[#8b6357] border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative rounded-[8px] size-[20px]">
                      <Icon name="chevron-down" size={12} className="text-[#8b6357]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
          <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
            <OrangeButton
              size="medium"
              variant="primary"
              showArrow={true}
              onClick={nextStep}
            >
              Continue
            </OrangeButton>
            <OrangeButton
              size="medium"
              variant="outline"
              onClick={previousStep}
            >
              Back
            </OrangeButton>
        </div>
      </div>
    </div>
  );
}

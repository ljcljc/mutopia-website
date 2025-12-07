import { MembershipCard, type FeatureItem } from "@/components/common/MembershipCard";

export default function Packages() {
  const features: FeatureItem[] = [
    { text: "30$ instant cash coupons", isHighlight: true },
    { text: "10% off additional services" },
    { text: "Priority booking within 3 days" },
    { text: "Free teeth brushing" },
    { text: "Free anal gland expression" },
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
            <h2 className="font-['Comfortaa:Bold',sans-serif] leading-[40px] text-white text-[32px]">
              <span className="md:hidden">
                Membership
                <br />
                Packages
              </span>
              <span className="hidden md:inline">Membership Packages</span>
            </h2>
            <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(255,255,255,0.8)] max-w-[588px] px-4 md:px-0">
              Save money and ensure your pet always looks their best with our
              convenient annuel membership packages.
            </p>
          </div>

          {/* Package Card */}
          <MembershipCard
            title="Premium Plus"
            price="$ 99"
            priceUnit="/year"
            badgeText="Save up to 100%"
            description="Our most popular package for complete pet care"
            features={features}
            buttonText="Go premium"
            showMostPopular={true}
          />
        </div>
      </div>
    </div>
  );
}

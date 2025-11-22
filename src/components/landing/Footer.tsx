import iconFooterLogo from "@/assets/icons/icon-footer-logo.svg";
import iconEmail from "@/assets/icons/icon-email.svg";
import iconLocation from "@/assets/icons/icon-location.svg";
import iconSocial1 from "@/assets/icons/icon-social-1.svg";
import iconSocial2 from "@/assets/icons/icon-social-2.svg";
import iconSocial3 from "@/assets/icons/icon-social-3.svg";

export default function Footer() {
  const quickLinks = [
    { label: "Services", href: "#services" },
    { label: "Packages", href: "#packages" },
    { label: "Why Choose Us", href: "#why-us" },
    { label: "FAQ", href: "#faq" },
    { label: "Book Appointment", href: "#" },
    { label: "Apply to Groomer", href: "#" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#contact" },
    { label: "Cancellation Policy", href: "#" },
    { label: "Service Areas", href: "#" },
    { label: "Customer Reviews", href: "#" },
    { label: "Pet Care Blog", href: "#" },
  ];

  return (
    <footer className="bg-[#8b6357] w-full" data-name="Footer">
      <div className="flex flex-col items-center w-full">
        <div className="max-w-7xl w-full px-[28px] md:px-[36px] py-[28px]">
          <div className="content-stretch flex flex-col gap-[24px] items-center w-full">
            {/* Main Content */}
            <div className="content-center flex flex-wrap gap-[24px] items-center md:items-start w-full">
              {/* Brand Column */}
              <div className="basis-0 content-stretch flex flex-col gap-[14px] grow items-start min-w-[272px] w-full md:w-auto">
                {/* Logo and Name */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full">
                  <div className="h-[35px] relative shrink-0 w-[31px]">
                    <img
                      src={iconFooterLogo}
                      alt="Logo"
                      className="block size-full"
                    />
                  </div>
                  <h3 className="font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] text-white text-[21px]">
                    Mutopia
                  </h3>
                </div>

                {/* Description */}
                <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-white w-[224px] whitespace-pre-wrap">
                  Premium pet grooming services bringing professional care
                  directly to your door. Your pet's comfort is our priority.
                </p>

                {/* Email */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full">
                  <div className="relative shrink-0 size-[16px]">
                    <img
                      src={iconEmail}
                      alt="Email"
                      className="block size-full"
                    />
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white">
                    hello@mutopia.ca
                  </p>
                </div>

                {/* Location */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full max-w-[273px]">
                  <div className="relative shrink-0 size-[16px]">
                    <img
                      src={iconLocation}
                      alt="Location"
                      className="block size-full"
                    />
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white">
                    Serving Greater Vancouver Area
                  </p>
                </div>
              </div>

              {/* Quick Links Column - Desktop only */}
              <div className="hidden lg:flex basis-0 content-stretch flex-col gap-[21px] grow items-start min-h-px min-w-px">
                <h4 className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[14px] text-white">
                  Quick Links
                </h4>
                <div className="content-stretch flex flex-col gap-[10.5px] items-start w-full">
                  {quickLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Support Column - Desktop only */}
              <div className="hidden lg:flex basis-0 content-stretch flex-col gap-[21px] grow items-start min-h-px min-w-px">
                <h4 className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[14px] text-white">
                  Support
                </h4>
                <div className="content-stretch flex flex-col gap-[10.5px] items-start w-full">
                  {supportLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Follow Us Column */}
              <div className="content-stretch flex flex-col gap-[21px] items-start shrink-0 w-full md:w-auto">
                <div className="content-stretch flex flex-col gap-[14px] items-start w-[133px]">
                  <h4 className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[14px] text-white">
                    Follow Us
                  </h4>
                  <div className="content-stretch flex gap-[14px] items-start w-full">
                    {/* Facebook */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer relative shrink-0"
                      aria-label="Facebook"
                    >
                      <div className="relative shrink-0 size-[20px]">
                        <img
                          src={iconSocial1}
                          alt="Facebook"
                          className="block size-full"
                        />
                      </div>
                    </a>

                    {/* Instagram */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer relative shrink-0"
                      aria-label="Instagram"
                    >
                      <div className="relative shrink-0 size-[20px]">
                        <img
                          src={iconSocial2}
                          alt="Instagram"
                          className="block size-full"
                        />
                      </div>
                    </a>

                    {/* Twitter */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer relative shrink-0"
                      aria-label="Twitter"
                    >
                      <div className="relative shrink-0 size-[20px]">
                        <img
                          src={iconSocial3}
                          alt="Twitter"
                          className="block size-full"
                        />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="bg-[#fff9ec] h-px shrink-0 w-full" />

            {/* Bottom Footer: Copyright + Policy Links */}
            <div className="content-center flex flex-col md:flex-row flex-wrap gap-[24px] items-center md:items-start justify-center md:justify-between w-full">
              <p className="flex-[1_0_0] font-['Comfortaa:Regular',_sans-serif] font-normal min-h-px min-w-px leading-[17.5px] text-[12.25px] text-center md:text-left text-white whitespace-pre-wrap order-1 md:order-1">
                © 2026 Mutopia. All rights reserved.
              </p>
              <div className="h-[17.5px] relative shrink-0 order-2 md:order-2">
                <div className="content-stretch flex font-['Comfortaa:Regular',_sans-serif] font-normal gap-[24px] h-[17.5px] items-start leading-[17.5px] text-[12.25px] text-white">
                  <a
                    href="#"
                    className="relative shrink-0 hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="relative shrink-0 hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="relative shrink-0 hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                  >
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

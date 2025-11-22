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
        <div className="max-w-7xl w-full px-[36px] md:px-[60px] py-[28px]">
          <div className="content-stretch flex flex-col gap-[24px] items-center w-full">
            {/* Main Content */}
            <div className="content-center flex flex-wrap gap-[24px] items-center md:items-start w-full">
              {/* Brand Column */}
              <div className="basis-0 content-stretch flex flex-col gap-[14px] grow items-start min-w-[272px] w-full md:w-auto">
                {/* Logo and Name */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full">
                  <div className="size-[31px] shrink-0">
                    <img
                      src={iconFooterLogo}
                      alt="Logo"
                      className="size-[31px]"
                    />
                  </div>
                  <h3 className="font-['Comfortaa:Bold',_sans-serif] leading-[28px] text-white text-[21px]">
                    Mutopia
                  </h3>
                </div>

                {/* Description */}
                <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-white max-w-[224px]">
                  Premium pet grooming services bringing professional care
                  directly to your door. Your pet's comfort is our priority.
                </p>

                {/* Email */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full">
                  <div className="size-[16px] shrink-0">
                    {/* <svg className="block size-full" fill="none" viewBox="0 0 16 16">
                      <g>
                        <path d={svgPaths.p2f8e7e80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p17070980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </g>
                    </svg> */}
                    <img src={iconEmail} alt="Email" className="size-[16px]" />
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white">
                    hello@mutopia.ca
                  </p>
                </div>

                {/* Location */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full max-w-[273px]">
                  <div className="size-[16px] shrink-0">
                    <img
                      src={iconLocation}
                      alt="Location"
                      className="size-[16px]"
                    />
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white">
                    Serving Greater Vancouver Area
                  </p>
                </div>
              </div>

              {/* Quick Links Column - Hidden on mobile */}
              <div className="hidden md:flex basis-0 content-stretch flex-col gap-[21px] grow items-start min-h-px min-w-px">
                <h4 className="font-['Comfortaa:Bold',_sans-serif] leading-[21px] text-[14px] text-white">
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

              {/* Support Column - Hidden on mobile */}
              <div className="hidden md:flex basis-0 content-stretch flex-col gap-[21px] grow items-start min-h-px min-w-px">
                <h4 className="font-['Comfortaa:Bold',_sans-serif] leading-[21px] text-[14px] text-white">
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
              <div className="content-stretch flex flex-col gap-[21px] items-center md:items-start shrink-0">
                <div className="content-stretch flex flex-col gap-[14px] items-start w-[133px]">
                  <h4 className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[21px] text-[14px] text-white w-full">
                    Follow Us
                  </h4>
                  <div className="content-stretch flex gap-[14px] items-start w-full">
                    {/* Facebook */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] active:bg-[rgba(222,106,7,0.8)] focus-visible:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer group relative border-2 border-transparent focus-visible:border-[#2374ff] active:border-[#2374ff]"
                      aria-label="Facebook"
                    >
                      <img
                        src={iconSocial1}
                        alt="Facebook"
                        className="size-[20px]"
                      />
                    </a>

                    {/* Instagram */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] active:bg-[rgba(222,106,7,0.8)] focus-visible:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer group relative border-2 border-transparent focus-visible:border-[#2374ff] active:border-[#2374ff]"
                      aria-label="Instagram"
                    >
                      <img
                        src={iconSocial2}
                        alt="Instagram"
                        className="size-[20px]"
                      />
                    </a>

                    {/* Twitter */}
                    <a
                      href="#"
                      className="bg-[#de6a07] rounded-full size-[35px] flex items-center justify-center hover:bg-[rgba(222,106,7,0.8)] active:bg-[rgba(222,106,7,0.8)] focus-visible:bg-[rgba(222,106,7,0.8)] transition-colors duration-200 cursor-pointer group relative border-2 border-transparent focus-visible:border-[#2374ff] active:border-[#2374ff]"
                      aria-label="Twitter"
                    >
                      <img
                        src={iconSocial3}
                        alt="Twitter"
                        className="size-[20px]"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="bg-[#fff9ec] h-px w-full" />

            {/* Bottom Footer: Copyright + Policy Links */}
            <div className="content-center flex flex-col md:flex-row flex-wrap gap-[16px] md:gap-[24px] items-center justify-center w-full">
              <p className="basis-0 font-['Comfortaa:Regular',_sans-serif] font-normal grow min-w-px leading-[17.5px] text-[12.25px] text-center text-white order-2 md:order-1">
                © 2026 Mutopia. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-[16px] md:gap-[24px] items-center justify-center order-1 md:order-2">
                <a
                  href="#"
                  className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[12.25px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[12.25px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[12.25px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

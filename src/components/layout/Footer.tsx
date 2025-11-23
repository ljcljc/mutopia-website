import { Link } from "react-router-dom";
import { Icon } from "@/components/common/Icon";

export default function Footer() {
  const quickLinks = [
    { label: "Services", href: "#services", isAnchor: true },
    { label: "Packages", href: "#packages", isAnchor: true },
    { label: "Why Choose Us", href: "#why-us", isAnchor: true },
    { label: "FAQ", href: "#faq", isAnchor: true },
    { label: "Book Appointment", href: "/booking", isAnchor: false },
    { label: "Apply to Groomer", href: "#", isAnchor: true },
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
                    <Icon
                      name="footer-logo"
                      aria-label="Logo"
                      className="block size-full text-white"
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
                    <Icon
                      name="email"
                      aria-label="Email"
                      className="block size-full text-white"
                    />
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white">
                    hello@mutopia.ca
                  </p>
                </div>

                {/* Location */}
                <div className="content-stretch flex gap-[10.5px] items-center w-full max-w-[273px]">
                  <div className="relative shrink-0 size-[16px]">
                    <Icon
                      name="location"
                      aria-label="Location"
                      className="block size-full text-white"
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
                  {quickLinks.map((link, index) => {
                    const linkClassName = "font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] text-[14px] text-white hover:text-[#de6a07] transition-colors duration-200 cursor-pointer";
                    return link.isAnchor ? (
                      <a
                        key={index}
                        href={link.href}
                        className={linkClassName}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={index}
                        to={link.href}
                        className={linkClassName}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
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
                        <Icon
                          name="facebook-alt"
                          aria-label="Facebook"
                          className="block size-full text-white"
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
                        <Icon
                          name="instagram"
                          aria-label="Instagram"
                          className="block size-full text-white"
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
                        <Icon
                          name="twitter"
                          aria-label="Twitter"
                          className="block size-full text-white"
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


import { useState } from "react";
import { Menu } from "lucide-react";
// 使用实际图片替换占位图片
const imgIcon = "/images/logo.png";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { OrangeButton } from "./OrangeButton";
import { LoginModal } from "./LoginModal";
import { useUser } from "./UserContext";
import svgPaths from "../imports/svg-kzu0xk56ho";

// Helper function to handle smooth scroll to anchor with header offset
const scrollToAnchor = (href: string) => {
  const targetId = href.replace("#", "");
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    // Use different offset for mobile vs desktop
    // Mobile: 100px (header + extra padding), Desktop: 80px
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    const headerOffset = isMobile ? 100 : 80;
    const elementPosition =
      targetElement.getBoundingClientRect().top;
    const offsetPosition =
      elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

function Icon() {
  return (
    <div
      className="h-[39px] relative shrink-0 w-[35px]"
      data-name="Icon"
    >
      <img
        alt="Mutopia Logo"
        className="absolute bg-clip-padding border-0 border-[transparent] border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
        src={imgIcon}
      />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[39px] w-[35px]" />
    </div>
  );
}

function Mutopia() {
  return (
    <div
      className="h-[28px] relative shrink-0 w-[92.82px]"
      data-name="Mutopia"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[28px] relative w-[92.82px]">
        <p className="absolute font-['Comfortaa:Bold',_sans-serif] font-bold leading-[28px] left-0 text-[#8b6357] text-[21px] text-nowrap top-[-1px] whitespace-pre">
          Mutopia pet
        </p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      className="basis-0 grow h-[35px] min-h-px min-w-px relative shrink-0 lg:basis-0 lg:grow"
      data-name="Logo"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[35px] items-center relative w-full">
        <Icon />
        <Mutopia />
      </div>
    </div>
  );
}

function Link() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    scrollToAnchor("#why-us");
  };

  return (
    <div
      className="h-[21px] relative shrink-0 w-[53.398px]"
      data-name="Link"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[53.398px]">
        <a
          href="#why-us"
          onClick={handleClick}
          className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
        >
          Why Us
        </a>
      </div>
    </div>
  );
}

function Link1() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    scrollToAnchor("#services");
  };

  return (
    <div
      className="h-[21px] relative shrink-0 w-[60.539px]"
      data-name="Link"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[60.539px]">
        <a
          href="#services"
          onClick={handleClick}
          className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
        >
          Services
        </a>
      </div>
    </div>
  );
}

function Link2() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    scrollToAnchor("#packages");
  };

  return (
    <div
      className="relative shrink-0 w-[68.508px]"
      data-name="Link"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative w-[68.508px]">
        <a
          href="#packages"
          onClick={handleClick}
          className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[#4a3c2a] text-[14px] w-[92px] hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
        >
          Membership
        </a>
      </div>
    </div>
  );
}

function Link3() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    scrollToAnchor("#faq");
  };

  return (
    <div
      className="h-[21px] relative shrink-0 w-[29.531px]"
      data-name="Link"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[29.531px]">
        <a
          href="#faq"
          onClick={handleClick}
          className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
        >
          FAQ
        </a>
      </div>
    </div>
  );
}

function Link4() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    scrollToAnchor("#contact");
  };

  return (
    <div
      className="h-[21px] relative shrink-0 w-[58.219px]"
      data-name="Link"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21px] relative w-[58.219px]">
        <a
          href="#contact"
          onClick={handleClick}
          className="absolute font-['Comfortaa:Regular',_sans-serif] font-normal leading-[21px] left-0 text-[#4a3c2a] text-[14px] text-nowrap top-[0.5px] whitespace-pre hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
        >
          Contact
        </a>
      </div>
    </div>
  );
}


function Navigation() {
  return (
    <div
      className="h-[21px] relative shrink-0 hidden lg:block"
      data-name="Navigation"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[28px] h-[21px] items-center relative">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function ButtonCompactSecondaryOrange() {
  return (
    <OrangeButton variant="secondary" size="compact" showArrow={false} className="shrink-0">
      Apply as groomer
    </OrangeButton>
  );
}

function ButtonCompactPrincipalOrange() {
  return (
    <LoginModal>
      <OrangeButton size="compact" showArrow={false} className="shrink-0">
        Log in/sign up
      </OrangeButton>
    </LoginModal>
  );
}

// User info component for logged-in users
function UserInfo() {
  const { user, logout } = useUser();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="content-stretch flex gap-[10.5px] items-center">
      {/* Notification icon */}
      <button
        className="content-stretch flex gap-[10px] h-[28px] items-center justify-center relative shrink-0 w-[28px] cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Notifications"
      >
        <div className="relative shrink-0 size-[20px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g id="Bell">
              <path d={svgPaths.p18131300} id="Vector" stroke="var(--stroke-0, #4A3C2A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              <path d={svgPaths.p23185c80} id="Vector_2" stroke="var(--stroke-0, #4A3C2A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </g>
          </svg>
        </div>
      </button>

      {/* User avatar and name */}
      <div className="content-stretch flex gap-[8px] items-center cursor-pointer hover:opacity-80 transition-opacity group">
        <div className="bg-[#633479] flex items-center justify-center relative rounded-full shrink-0 size-[28px]">
          <span className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold text-white text-[12px]">
            {getInitials(user.name)}
          </span>
        </div>
        <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] text-[#4a3c2a] text-[12px]">
          {user.name}
        </p>
      </div>
    </div>
  );
}

function Buttons() {
  const { user } = useUser();

  return (
    <div
      className="basis-0 grow h-[28px] min-h-px min-w-px relative shrink-0 hidden lg:block lg:basis-0 lg:grow"
      data-name="Buttons"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[10.5px] h-[28px] items-center justify-end relative w-full">
        <ButtonCompactSecondaryOrange />
        {user ? <UserInfo /> : <ButtonCompactPrincipalOrange />}
      </div>
    </div>
  );
}

// Mobile menu link component matching Figma design
function MobileLink({
  children,
  href,
  onClick,
}: {
  children: string;
  href: string;
  onClick: () => void;
}) {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();

    // Close the menu first
    onClick();

    // Wait for menu to close, then scroll
    setTimeout(() => {
      scrollToAnchor(href);
    }, 300);
  };

  return (
    <div
      className="h-[48px] relative shrink-0 w-full"
      data-name="Link"
    >
      <a
        href={href}
        onClick={handleClick}
        className="absolute flex flex-col font-['Comfortaa:Regular',_sans-serif] font-normal h-[48px] justify-center leading-[0] left-1/2 text-[#4a3c2a] text-[14px] text-center top-1/2 -translate-x-1/2 -translate-y-1/2 w-full hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
      >
        <p className="leading-[21px]">{children}</p>
      </a>
    </div>
  );
}

// Mobile buttons matching Figma design
function MobileButton1() {
  return (
    <div
      className="bg-[#f8f7f1] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full cursor-pointer hover:bg-[#f0efe8] transition-colors"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-[0.737px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2.47134e+07px]"
      />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[11.237px] py-[0.737px] relative w-full">
          <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] text-nowrap whitespace-pre">
            Apply to Groomer
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileButton2() {
  const { user } = useUser();

  if (user) {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div className="content-stretch flex gap-[16px] items-center w-full">
        {/* Notification icon */}
        <button
          className="content-stretch flex gap-[10px] h-[48px] items-center justify-center relative shrink-0 w-[48px] cursor-pointer hover:opacity-80 transition-opacity bg-[#f5f5f5] rounded-[2.47134e+07px]"
          aria-label="Notifications"
        >
          <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <g id="Bell">
                <path d={svgPaths.p18131300} id="Vector" stroke="var(--stroke-0, #4A3C2A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
                <path d={svgPaths.p23185c80} id="Vector_2" stroke="var(--stroke-0, #4A3C2A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
              </g>
            </svg>
          </div>
        </button>

        {/* User info */}
        <div className="content-stretch flex gap-[12px] items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="bg-[#633479] flex items-center justify-center relative rounded-full shrink-0 size-[48px]">
            <span className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold text-white text-[18px]">
              {getInitials(user.name)}
            </span>
          </div>
          <div className="flex flex-col flex-1">
            <p className="font-['Comfortaa:SemiBold',_sans-serif] font-semibold text-[#4a3c2a] text-[14px]">
              {user.name}
            </p>
            <p className="font-['Comfortaa:Regular',_sans-serif] font-normal text-[#717182] text-[12px]">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LoginModal>
      <div
        className="bg-[#8b6357] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full cursor-pointer hover:bg-[#6f4e44] transition-colors"
        data-name="Button"
      >
        <div className="flex flex-row items-center justify-center size-full">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[10.5px] py-0 relative w-full">
            <p className="font-['Comfortaa:Medium',_sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12.25px] text-nowrap text-white whitespace-pre">
              Login / Sign Up
            </p>
          </div>
        </div>
      </div>
    </LoginModal>
  );
}

function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleLinkClick = () => {
    // Close menu after a short delay to allow navigation
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="w-full lg:hidden overflow-hidden"
        >
          <div className="w-full pb-[20px] pt-0 px-[20px]">
            {/* Navigation Links - Full width */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
            >
              <MobileLink
                href="#why-us"
                onClick={handleLinkClick}
              >
                Why Us
              </MobileLink>
              <MobileLink
                href="#services"
                onClick={handleLinkClick}
              >
                Services
              </MobileLink>
              <MobileLink
                href="#packages"
                onClick={handleLinkClick}
              >
                Membership
              </MobileLink>
              <MobileLink href="#faq" onClick={handleLinkClick}>
                FAQ
              </MobileLink>
              <MobileLink
                href="#contact"
                onClick={handleLinkClick}
              >
                Contact
              </MobileLink>
            </motion.div>

            {/* Buttons - Full width */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="box-border content-stretch flex flex-col gap-[20px] items-start pb-0 pt-[13.994px] px-0 relative shrink-0 w-full"
            >
              <MobileButton1 />
              <MobileButton2 />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mobile close button matching Figma design
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative shrink-0 size-[23.994px] cursor-pointer"
      data-name="Button"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative size-[23.994px]">
        <div
          className="h-[23.994px] overflow-clip relative shrink-0 w-full"
          data-name="Icon"
        >
          <div
            className="absolute inset-1/4"
            data-name="Vector"
          >
            <div className="absolute inset-[-8.33%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
              >
                <path
                  d="M12.9972 1L1 12.9972"
                  id="Vector"
                  stroke="#8B6357"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.99953"
                />
              </svg>
            </div>
          </div>
          <div
            className="absolute inset-1/4"
            data-name="Vector"
          >
            <div className="absolute inset-[-8.33%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 14 14"
              >
                <path
                  d="M1 1L12.9972 12.9972"
                  id="Vector"
                  stroke="#8B6357"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.99953"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container({
  isMenuOpen,
  toggleMenu,
}: {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div
      className="h-[62.984px] lg:h-[63px] relative shrink-0 w-full"
      data-name="Container"
    >
      <div
        aria-hidden="true"
        className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-solid inset-0 pointer-events-none lg:hidden"
      />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[62.984px] lg:h-[63px] items-center justify-between pb-px pt-0 px-0 lg:pl-0 lg:pr-[0.008px] lg:py-0 relative w-full">
          <Logo />
          <Navigation />
          <Buttons />

          {/* Mobile Menu Button */}
          <motion.div
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden"
          >
            {isMenuOpen ? (
              <CloseButton onClick={toggleMenu} />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-[#8b6357] hover:text-[#6f4e44] hover:bg-[#8b6357]/5 cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className="bg-[rgba(255,255,255,0.95)] sticky top-0 w-full z-50 rounded-bl-[21px] rounded-br-[21px]"
      style={{
        boxShadow: isMenuOpen
          ? "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)"
          : "none",
        transition: "box-shadow 0.3s ease-in-out",
      }}
      data-name="Header"
    >
      <div className="max-w-7xl mx-auto">
        <div className="min-w-inherit w-full">
          <div className="box-border content-stretch flex flex-col items-start min-w-inherit pb-px lg:pb-px pt-0 px-4 sm:px-8 md:px-12 lg:px-[57.5px] relative w-full">
            <Container
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
            />

            {/* Mobile Menu - Inside the container */}
            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

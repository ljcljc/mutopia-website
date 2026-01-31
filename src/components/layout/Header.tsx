import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// 使用实际图片替换占位图片
const imgIcon = "/images/logo.png";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { OrangeButton } from "@/components/common";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuthStore } from "@/components/auth/authStore";
import AccountDropdown from "@/components/layout/AccountDropdown";
import NotificationsPopover from "@/components/layout/NotificationsPopover";
import { useLogout } from "@/hooks/useLogout";

// Helper function to handle smooth scroll to anchor with header offset
const scrollToAnchor = (href: string) => {
  const targetId = href.replace("#", "");
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    // Use different offset for mobile vs desktop
    // Mobile: 100px (header + extra padding), Desktop: 80px
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    const headerOffset = isMobile ? 100 : 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

function LogoIcon() {
  return (
    <div className="h-[39px] relative shrink-0 w-[35px]" data-name="Icon">
      <img
        alt="Mutopia Logo"
        className="absolute bg-clip-padding border-0 border-transparent border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
        src={imgIcon}
      />
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border h-[39px] w-[35px]" />
    </div>
  );
}

function Mutopia() {
  return (
    <div className="h-[28px] relative shrink-0 w-[92.82px]" data-name="Mutopia">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border h-[28px] relative w-[92.82px]">
        <p className="absolute font-['Comfortaa:Bold',sans-serif] font-bold leading-[28px] left-0 text-[#8b6357] text-[21px] text-nowrap -top-px whitespace-pre">
          Mutopia pet
        </p>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      className="h-[35px] relative shrink-0"
      data-name="Logo"
    >
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10.5px] h-[35px] items-center relative w-full">
            <LogoIcon />
        <Mutopia />
      </div>
    </div>
  );
}

function NavigationLink({ href, children }: { href: string; children: string }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToAnchor(href);
  };

  return (
        <a
      href={href}
          onClick={handleClick}
      className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[21px] text-[#4a3c2a] text-[14px] hover:text-[#8b6357] transition-colors no-underline cursor-pointer whitespace-nowrap"
        >
      {children}
    </a>
  );
}

function Navigation() {
  return (
    <div
      className="h-[21px] relative shrink-0 hidden lg:flex items-center gap-[28px]"
      data-name="Navigation"
    >
      <NavigationLink href="#why-us">Why Us</NavigationLink>
      <NavigationLink href="#services">Services</NavigationLink>
      <NavigationLink href="#packages">Membership</NavigationLink>
      <NavigationLink href="#faq">FAQ</NavigationLink>
      <NavigationLink href="#contact">Contact</NavigationLink>
    </div>
  );
}

function ApplyAsGroomerButton() {
  return (
    <OrangeButton
      variant="secondary"
      size="compact"
      showArrow={false}
      className="shrink-0"
    >
      Apply as groomer
    </OrangeButton>
  );
}

function LoginSignUpButton() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <LoginModal
      open={isLoginModalOpen}
      onOpenChange={setIsLoginModalOpen}
      onSuccess={() => navigate("/account/dashboard")}
    >
      <OrangeButton size="compact" showArrow={false} className="shrink-0">
        Log in/sign up
      </OrangeButton>
    </LoginModal>
  );
}

// User info component for logged-in users
function UserInfo() {
  const user = useAuthStore((state) => state.user);
  const userInfo = useAuthStore((state) => state.userInfo);

  if (!user) return null;

  return (
    <div className="content-stretch flex gap-[10.5px] items-center">
      <AccountDropdown
        userInfo={userInfo ?? undefined}
        fallbackName={user.name || user.email}
      />

      <NotificationsPopover />
    </div>
  );
}

function DesktopActions() {
  const user = useAuthStore((state) => state.user);

  return (
    <div
      className="h-[28px] relative shrink-0 hidden lg:flex items-center gap-[10.5px]"
      data-name="Buttons"
    >
      <ApplyAsGroomerButton />
      {user ? <UserInfo /> : <LoginSignUpButton />}
    </div>
  );
}

// Mobile menu link component
function MobileLink({
  children,
  href,
  onClick,
}: {
  children: string;
  href: string;
  onClick: () => void;
}) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
    setTimeout(() => {
      scrollToAnchor(href);
    }, 300);
  };

  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Link">
      <a
        href={href}
        onClick={handleClick}
        className="absolute flex flex-col font-['Comfortaa:Regular',sans-serif] font-normal h-[48px] justify-center leading-0 left-1/2 text-[#4a3c2a] text-[14px] text-center top-1/2 -translate-x-1/2 -translate-y-1/2 w-full hover:text-[#8b6357] transition-colors no-underline cursor-pointer"
      >
        <p className="leading-[21px]">{children}</p>
      </a>
    </div>
  );
}

// Mobile buttons
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
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[11.237px] py-[0.737px] relative w-full">
          <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] text-nowrap whitespace-pre">
            Apply to Groomer
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileButton2() {
  const user = useAuthStore((state) => state.user);
  const { handleLogout } = useLogout();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  if (user) {
    return (
      <div className="content-stretch flex flex-col gap-[12px] w-full">
        <div className="content-stretch flex gap-[16px] items-center w-full">
          {/* Notification icon */}
          <div className="content-stretch flex gap-[10px] h-[48px] items-center justify-center relative shrink-0 w-[48px] bg-[#f5f5f5] rounded-[2.47134e+07px]">
            <NotificationsPopover />
          </div>

          {/* User info */}
          <div className="content-stretch flex gap-[12px] items-center flex-1">
            <div className="bg-[#8b6357] overflow-clip relative rounded-[100px] shrink-0 size-[48px] flex items-center justify-center" data-name="Icons/Avatar/Brown/Default/Rempli">
              <Icon
                name="user"
                aria-label="User"
                className="block size-full text-white"
              />
            </div>
            <div className="flex flex-col flex-1">
              <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[#4a3c2a] text-[14px]">
                {user.name}
              </p>
              <p className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#717182] text-[12px]">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-[#f8f7f1] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full cursor-pointer hover:bg-[#f0efe8] transition-colors"
        >
          <div
            aria-hidden="true"
            className="absolute border-[0.737px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[2.47134e+07px]"
          />
          <div className="flex flex-row items-center justify-center size-full">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[11.237px] py-[0.737px] relative w-full">
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12.25px] text-nowrap whitespace-pre">
                Log out
              </p>
            </div>
          </div>
        </button>
      </div>
    );
  }

  const navigate = useNavigate();

  return (
    <LoginModal
      open={isLoginModalOpen}
      onOpenChange={setIsLoginModalOpen}
      onSuccess={() => navigate("/account/dashboard")}
    >
      <div
        className="bg-[#8b6357] h-[48px] relative rounded-[2.47134e+07px] shrink-0 w-full cursor-pointer hover:bg-[#6f4e44] transition-colors"
        data-name="Button"
      >
        <div className="flex flex-row items-center justify-center size-full">
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[5.25px] h-[48px] items-center justify-center px-[10.5px] py-0 relative w-full">
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12.25px] text-nowrap text-white whitespace-pre">
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
            {/* Navigation Links */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
            >
              <MobileLink href="#why-us" onClick={handleLinkClick}>
                Why Us
              </MobileLink>
              <MobileLink href="#services" onClick={handleLinkClick}>
                Services
              </MobileLink>
              <MobileLink href="#packages" onClick={handleLinkClick}>
                Membership
              </MobileLink>
              <MobileLink href="#faq" onClick={handleLinkClick}>
                FAQ
              </MobileLink>
              <MobileLink href="#contact" onClick={handleLinkClick}>
                Contact
              </MobileLink>
            </motion.div>

            {/* Buttons */}
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

// Mobile close button
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="relative shrink-0 size-[23.994px] cursor-pointer"
      data-name="Button"
    >
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col items-start relative size-[23.994px]">
        <div
          className="h-[23.994px] overflow-clip relative shrink-0 w-full"
          data-name="Icon"
        >
          <div className="absolute inset-1/4" data-name="Vector">
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
          <div className="absolute inset-1/4" data-name="Vector">
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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 滚动检测和智能阴影显示
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 智能阴影显示：滚动时或菜单打开时显示阴影
  const shouldShowShadow = isScrolled || isMenuOpen;
  const shadowStyle = shouldShowShadow
    ? "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
    : "none";

  return (
    <div
      className="bg-[rgba(255,255,255,0.95)] sticky top-0 w-full z-50 rounded-bl-[21px] rounded-br-[21px]"
      style={{
        boxShadow: shadowStyle,
        transition: "box-shadow 0.3s ease-in-out",
      }}
      data-name="Header"
    >
      {/* 移除 max-w-7xl 限制，使用 padding 控制内容区域 */}
      <div className="w-full">
        <div className="box-border content-stretch flex flex-col items-start min-w-inherit pb-px lg:pb-px pt-0 px-4 sm:px-8 md:px-12 lg:px-[57.5px] xl:px-[80px] 2xl:px-[120px] relative w-full">
          {/* Desktop Header Container */}
          <div className="flex flex-row items-center justify-between w-full h-[62.984px] lg:h-[63px]">
            {/* Left: Logo */}
            <Logo />

            {/* Center: Navigation (Desktop only) */}
            <Navigation />

            {/* Right: Actions (Desktop only) */}
            <DesktopActions />

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
                  <Icon name="menu" aria-label="Menu" className="size-[24px] text-[#8b6357]" />
                </Button>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu */}
            <MobileMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const imgIcon = "/images/logo.png";
import { Icon } from "@/components/common/Icon";
import { OrangeButton, BrownOutlineButton } from "@/components/common";
import { useAuthStore } from "@/components/auth/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type MeOut } from "@/lib/api";
import { useLogout } from "@/hooks/useLogout";
import { useBookingStore } from "@/components/booking/bookingStore";

function Logo() {
  return (
    <div className="h-[35px] relative shrink-0" data-name="Logo">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10.5px] h-[35px] items-center relative w-full">
        <div className="h-[39px] relative shrink-0 w-[35px]" data-name="Icon">
          <img
            alt="Mutopia Logo"
            className="absolute bg-clip-padding border-0 border-transparent border-solid box-border inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
            src={imgIcon}
          />
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border h-[39px] w-[35px]" />
        </div>
        <div className="relative shrink-0" data-name="Mutopia">
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[10px] items-center justify-center relative">
            <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[28px] relative shrink-0 text-[#8b6357] text-[21px]">
              Mutopia pet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackToHomeButton() {
  const navigate = useNavigate();
  const hasFormData = useBookingStore((state) => state.hasFormData);
  const reset = useBookingStore((state) => state.reset);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 检查是否在 booking 页面
    const isBookingPage = window.location.pathname.includes("/booking");
    
    if (isBookingPage && hasFormData()) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
    // 如果不在 booking 页面或没有表单数据，正常跳转
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleLeave = () => {
    setIsDialogOpen(false);
    reset();
    navigate("/");
  };

  return (
    <>
      <Link
        to="/"
        onClick={handleClick}
        className="relative shrink-0 w-[134px] cursor-pointer hover:opacity-80 transition-opacity"
        data-name="Button tertiary"
      >
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative w-[134px]">
          <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0 size-[20px]" data-name="Icons">
            <div className="flex-none">
              <div className="size-4 rotate-180">
                <Icon name="button-arrow" className="block max-w-none size-full text-[#8b6357]" />
              </div>
            </div>
          </div>
          <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px]">
            Back to home
          </p>
        </div>
      </Link>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-white rounded-[12px] border border-[#E0E0E0] p-0 max-w-[90%] sm:max-w-[700px]">
          <AlertDialogHeader className="px-6 h-[44px] flex items-center justify-center border-b border-[#E0E0E0]">
            <AlertDialogTitle className="font-['Comfortaa:Regular',sans-serif] font-normal text-[16px] text-[#4C4C4C] text-center">
              Leave the page without saving
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="px-5 py-4">
            <AlertDialogDescription className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] text-[#4C4C4C] leading-relaxed">
              <p className="mb-2 text-left">
                You have entered information in this form. If you leave this page, your changes will be lost.
              </p>
              <p className="text-center font-['Comfortaa',sans-serif] font-semibold text-[16px] text-black leading-[28px]">
                Are you sure you want to continue?
              </p>
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="px-6 pb-6 pt-0 flex flex-row items-center gap-3 [&]:justify-center sm:[&]:justify-center">
            <BrownOutlineButton
              size="medium"
              onClick={handleCancel}
              className="w-[120px]"
            >
              Cancel
            </BrownOutlineButton>
            <OrangeButton
              variant="primary"
              size="medium"
              onClick={handleLeave}
              className="w-[120px]"
            >
              Leave
            </OrangeButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function AddressInput({ address, onAddressChange }: { address: string | null; onAddressChange?: (address: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(address || "");

  useEffect(() => {
    setEditValue(address || "");
  }, [address]);

  const handleSubmit = () => {
    if (onAddressChange) {
      onAddressChange(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setEditValue(address || "");
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 border-solid h-[34px] relative rounded-[8px] shrink-0 w-[278px]" data-name="Button">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[7px] h-[34px] items-center px-[15px] py-px relative w-[278px]">
          <div className="relative shrink-0 size-[18px]" data-name="Icon">
            <Icon name="location" className="block max-w-none size-full text-[#4a3c2a]" />
          </div>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="flex-[1_0_0] h-[17.5px] min-h-px min-w-px relative shrink-0 font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] text-[#4a3c2a] text-[12.25px] bg-transparent border-none outline-none"
            autoFocus
          />
          <div className="relative shrink-0 size-[16px]" data-name="Icon">
            <Icon name="chevron-down" className="block max-w-none size-full text-[#4a3c2a]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border border-gray-200 border-solid h-[34px] relative rounded-[8px] shrink-0 w-[278px] cursor-pointer hover:border-[#8b6357] transition-colors"
      data-name="Button"
      onClick={() => setIsEditing(true)}
    >
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[7px] h-[34px] items-center px-[15px] py-px relative w-[278px]">
        <div className="relative shrink-0 size-[18px]" data-name="Icon">
          <Icon name="location" className="block max-w-none size-full text-[#4a3c2a]" />
        </div>
        <div className="flex-[1_0_0] h-[17.5px] min-h-px min-w-px relative shrink-0" data-name="Text">
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border h-[17.5px] overflow-clip relative rounded-[inherit] w-full">
            <p className="absolute font-['Comfortaa:Regular',sans-serif] font-normal leading-[17.5px] left-0 text-[#4a3c2a] text-[12.25px] top-[-0.5px] w-[206px] whitespace-pre-wrap truncate">
              {address || "Add address..."}
            </p>
          </div>
        </div>
        <div className="relative shrink-0 size-[16px]" data-name="Icon">
          <Icon name="chevron-down" className="block max-w-none size-full" />
        </div>
      </div>
    </div>
  );
}

function CreditsBadge() {
  // TODO: Replace with actual credits from API when available
  const credits = "$0.00";
  
  return (
    <div className="bg-[#de6a07] h-[24px] relative rounded-[12px] shrink-0 w-[103px]" data-name="Badge">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-[103px]">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[10px] text-white">
          <span>Credits </span>{credits}
        </p>
      </div>
    </div>
  );
}

function UserInfo({ userInfo }: { userInfo: MeOut }) {
  const userName = userInfo.first_name || userInfo.email.split("@")[0] || "User";
  const { handleLogout } = useLogout();

  return (
    <div className="content-stretch flex gap-[10.5px] h-[28px] items-center relative w-[281.008px]" data-name="Buttons">
      <CreditsBadge />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative shrink-0 w-[134px] cursor-pointer hover:opacity-80 transition-opacity" data-name="Button tertiary">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative w-[134px]">
              <div className="bg-[#8b6357] overflow-clip relative rounded-[100px] shrink-0 size-[20px] flex items-center justify-center" data-name="Icons/Avatar/Brown/Default/Rempli">
                <Icon
                  name="user"
                  aria-label="User"
                  className="block size-full text-white"
                />
              </div>
              <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px]">
                {userName}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[160px]">
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-[#8b6357] hover:text-[#6f4e44] hover:bg-[#8b6357]/5"
          >
            <span className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px]">
              Log out
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Notifications"
        data-name="notifications"
      >
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border overflow-clip relative rounded-[inherit] size-[24px]">
          <div className="absolute inset-[8.33%_16.67%]" data-name="icon">
            <Icon
              name="notify"
              aria-label="Notifications"
              className="block max-w-none size-full text-[#8b6357]"
            />
          </div>
        </div>
      </button>
    </div>
  );
}

export default function HeaderApp() {
  const user = useAuthStore((state) => state.user);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Get user info from authStore (set by LoginModalContent after login)
  const userInfo = useAuthStore((state) => state.userInfo);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shouldShowShadow = isScrolled;
  const shadowStyle = shouldShowShadow
    ? "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
    : "none";

  const hasAddress = userInfo?.address && userInfo.address.trim() !== "";

  return (
    <div
      className="bg-[rgba(255,255,255,0.95)] sticky top-0 w-full z-50 rounded-bl-[21px] rounded-br-[21px] border-[rgba(0,0,0,0.1)] border-b border-l-0 border-r-0 border-solid border-t-0"
      style={{
        boxShadow: shadowStyle,
        transition: "box-shadow 0.3s ease-in-out",
      }}
      data-name="HeaderApp"
    >
      <div className="max-w-7xl mx-auto">
        <div className="box-border content-stretch flex h-[63px] items-center justify-between pl-0 pr-[0.008px] py-0 relative shrink-0 w-full px-[57.5px]" data-name="Container">
          {/* Left side: Logo + Back to home (if not logged in or no address) */}
          {(!user || !hasAddress) ? (
            <div className="relative shrink-0 w-[549.242px]">
              <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[24px] items-center relative w-[549.242px]">
                <Logo />
                <div className="content-stretch flex gap-[10.5px] h-[28px] items-center justify-end relative shrink-0" data-name="Buttons">
                  <BackToHomeButton />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Left side: Logo only (if logged in and has address) */}
              <div className="relative shrink-0">
                <Logo />
              </div>

              {/* Middle: Address input (only if logged in and has address) */}
              {user && hasAddress && userInfo && (
                <AddressInput address={userInfo.address || null} />
              )}

              {/* Right side: User info (if logged in) */}
              {user && userInfo && <UserInfo userInfo={userInfo} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const imgIcon = "/images/logo.png";
import { Icon } from "@/components/common/Icon";
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
import { logout, type MeOut } from "@/lib/api";
import { toast } from "sonner";
import { useBookingStore } from "@/components/booking/bookingStore";
import { BrownOutlineButton, OrangeButton } from "@/components/common";
import { getEncryptedItem } from "@/lib/encryption";
import { STORAGE_KEYS } from "@/lib/storageKeys";

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

function CreditsBadge() {
  // TODO: Replace with actual credits from API when available
  const credits = "$0.00";
  
  return (
    <div className="bg-[#de6a07] h-[24px] relative rounded-[12px] shrink-0 cursor-pointer hover:opacity-90 transition-opacity" data-name="Badge">
      <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[4px] h-[24px] items-center justify-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
        <p className="font-['Comfortaa:Bold',sans-serif] font-bold leading-[14px] relative shrink-0 text-[10px] text-white whitespace-nowrap">
          <span>Credits </span>{credits}
        </p>
      </div>
    </div>
  );
}

function UserInfo({ userInfo, fallbackName }: { userInfo?: MeOut | null; fallbackName?: string }) {
  const logoutUser = useAuthStore((state) => state.logout);
  const userName = userInfo 
    ? (userInfo.first_name || userInfo.email.split("@")[0] || "User")
    : (fallbackName || "User");

  const handleLogout = async () => {
    try {
      await logout();
      await logoutUser();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      await logoutUser();
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className="content-stretch flex gap-[10.5px] h-[28px] items-center relative" data-name="Buttons">
      <CreditsBadge />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-name="Button tertiary">
            <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative">
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const hasFormData = useBookingStore((state) => state.hasFormData);
  const reset = useBookingStore((state) => state.reset);
  
  // Get user info from authStore (globally maintained)
  // Display logic: first check global state, if not found, load from localStorage
  const userInfo = useAuthStore((state) => state.userInfo);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  // Load userInfo from localStorage if not in global state (following user's logic)
  useEffect(() => {
    const loadUserInfoFromStorage = async () => {
      // First check global state - if exists, use it directly
      if (userInfo) {
        return; // Already in global state, no need to load
      }

      // If not in global state, check localStorage
      if (user) {
        try {
          const userInfoStr = await getEncryptedItem(STORAGE_KEYS.USER_INFO);
          if (userInfoStr) {
            const parsed = JSON.parse(userInfoStr);
            // Check if it's MeOut type (has first_name or email, but not just name)
            if (parsed && typeof parsed === "object" && parsed.email) {
              if (parsed.first_name !== undefined || !parsed.name) {
                // It's MeOut type, load to global state
                setUserInfo(parsed as MeOut);
              } else {
                // Legacy User type, convert to MeOut
                const converted: MeOut = {
                  id: "",
                  email: parsed.email,
                  first_name: parsed.name.split(" ")[0] || null,
                  last_name: parsed.name.split(" ").slice(1).join(" ") || null,
                  birthday: null,
                  address: null,
                  receive_marketing_message: false,
                  role: "user",
                  is_email_verified: true,
                  invite_code: null,
                  is_member: false,
                };
                setUserInfo(converted);
              }
            }
          }
        } catch (e) {
          console.warn("Failed to load userInfo from localStorage:", e);
        }
      }
    };

    loadUserInfoFromStorage();
  }, [user, userInfo, setUserInfo]);

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

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isBookingPage = window.location.pathname.includes("/booking");

    if (isBookingPage && hasFormData()) {
      e.preventDefault();
      e.currentTarget.blur();
      setIsDialogOpen(true);
    }
  };

  const handleCancelLeave = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmLeave = () => {
    setIsDialogOpen(false);
    reset();
    navigate("/");
  };

  return (
    <div
      className="bg-[rgba(255,255,255,0.95)] sticky top-0 w-full z-50 rounded-bl-[21px] rounded-br-[21px] border-[rgba(0,0,0,0.1)] border-b border-l-0 border-r-0 border-solid border-t-0"
      style={{
        boxShadow: shadowStyle,
        transition: "box-shadow 0.3s ease-in-out",
      }}
      data-name="HeaderApp"
    >
      {/* 移除 max-w-7xl 限制，使用 padding 控制内容区域 */}
      <div className="w-full">
        <div className="box-border content-stretch flex h-[63px] items-center justify-between relative shrink-0 w-full px-[20px] sm:px-8 md:px-12 lg:px-[57.5px] xl:px-[80px] 2xl:px-[120px]" data-name="Container">
          {/* Left side: Logo + Back to home */}
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
            <Link to="/" onClick={handleHomeClick} className="cursor-pointer" aria-label="Go to home">
              <Logo />
            </Link>
            {!user && (
              <Link
                to="/"
                onClick={handleHomeClick}
                className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                data-name="Button tertiary"
              >
                <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative">
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
            )}
          </div>

          {/* Right side: User info (only if logged in) */}
          {user && (
            <>
              <div className="flex items-center gap-[10.5px] sm:hidden">
                <CreditsBadge />
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
              <div className="hidden sm:flex">
                <UserInfo 
                  userInfo={userInfo ?? undefined} 
                  fallbackName={user.name || user.email.split("@")[0]}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-white rounded-[20px] border border-[rgba(0,0,0,0.2)] p-0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] max-w-[90%] sm:max-w-[700px]">
          <div className="flex flex-col gap-[32px] items-start pb-[32px] pt-[12px] w-full">
            <AlertDialogHeader className="px-[12px] w-full">
              <AlertDialogTitle className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px] text-[#4C4C4C] text-center">
                Leave the page without saving
              </AlertDialogTitle>
              <div className="bg-[rgba(0,0,0,0.1)] h-px w-full mt-[8px]" />
            </AlertDialogHeader>
            <div className="px-[24px] w-full">
              <AlertDialogDescription asChild>
                <div className="font-['Comfortaa:Regular',sans-serif] font-normal text-[#000000] leading-[22.75px] text-center">
                  <p className="text-[14px]">
                    You have entered information in this form. If you leave this page, your changes will be lost.
                  </p>
                  <p className="font-['Comfortaa:SemiBold',sans-serif] font-semibold text-[16px] leading-[28px]">
                    Are you sure you want to continue?
                  </p>
                </div>
              </AlertDialogDescription>
            </div>
            <AlertDialogFooter className="px-[24px] pt-0 flex flex-row items-center justify-center gap-[24px] w-full">
              <BrownOutlineButton
                size="medium"
                onClick={handleCancelLeave}
                className="w-[120px]"
              >
                Cancel
              </BrownOutlineButton>
              <OrangeButton
                variant="primary"
                size="medium"
                onClick={handleConfirmLeave}
                className="w-[120px]"
              >
                Leave
              </OrangeButton>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

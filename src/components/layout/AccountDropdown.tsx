import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/common/Icon";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import type { MeOut } from "@/lib/api";

export default function AccountDropdown({
  userInfo,
  fallbackName,
  mode = "customer",
}: {
  userInfo?: MeOut | null;
  fallbackName?: string;
  mode?: "customer" | "groomer";
}) {
  const userName = userInfo
    ? (userInfo.first_name || userInfo.email.split("@")[0] || "User")
    : (fallbackName || "User");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useLogout();
  const isCustomerMode = mode === "customer";
  const isDashboardActive = isCustomerMode
    ? location.pathname.startsWith("/account/dashboard")
    : location.pathname.startsWith("/groomer/dashboard");
  const isGroomerSwitchVisible = Boolean(userInfo?.is_groomer);
  const switchId = isCustomerMode ? "header-groomer-switch" : "header-pet-owner-switch";
  const switchLabel = isCustomerMode ? "Groomer" : "Pet owner";
  const switchAriaLabel = isCustomerMode ? "Switch to groomer" : "Switch to pet owner";
  const dashboardPath = isCustomerMode ? "/account/dashboard" : "/groomer/dashboard";
  const triggerAvatarClassName = isCustomerMode ? "bg-[#8b6357]" : "bg-[#633479]";
  const triggerTextClassName = isCustomerMode ? "text-[#8b6357]" : "text-[#633479]";
  const contentClassName = isCustomerMode
    ? "min-w-[160px]"
    : "min-w-[176px] border-[#633479]/15 bg-[#FCFAFF]";
  const switchLabelClassName = isCustomerMode ? "text-[#8b6357]" : "text-[#633479]";
  const separatorClassName = isCustomerMode ? "bg-[#8b6357]/10" : "bg-[#633479]/12";
  const itemBaseClassName = isCustomerMode
    ? "text-[#8b6357] hover:text-[#6f4e44] hover:bg-[#8b6357]/5"
    : "text-[#633479] hover:text-[#4F2960] hover:bg-[#633479]/6";
  const activeItemClassName = isCustomerMode ? "bg-[#8b6357]/10 text-[#6f4e44]" : "bg-[#633479]/10 text-[#4F2960]";
  const switchClassName = isCustomerMode
    ? "cursor-pointer"
    : "cursor-pointer data-[state=checked]:border-[#633479] data-[state=checked]:bg-[#633479]";
  const switchChecked = isCustomerMode ? false : true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-name="Button tertiary">
          <div className="bg-clip-padding border-0 border-transparent border-solid flex gap-[8px] items-center px-[12px] py-[4px] relative">
            <div className={`${triggerAvatarClassName} relative rounded-[100px] shrink-0 size-[20px] flex items-center justify-center`} data-name="Icons/Avatar/Brown/Default/Rempli">
              <Icon name="user" aria-label="User" className="block size-full text-white" />
              {userInfo?.is_member && (
                <span className="absolute -right-[4px] -top-[4px] z-10 inline-flex h-[12px] w-[12px] items-center justify-center rounded-full border border-white bg-[#DCFCE7] text-[8px] font-comfortaa font-bold leading-none text-[#008236] pointer-events-none">
                  M
                </span>
              )}
            </div>
            <p className={`font-comfortaa font-medium leading-[17.5px] relative shrink-0 text-[12px] ${triggerTextClassName}`}>
              {userName}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={contentClassName}>
        {isGroomerSwitchVisible ? (
          <>
            <div className="flex items-center justify-between gap-3 px-2 py-2">
              <Label
                htmlFor={switchId}
                className={`font-comfortaa text-[14px] font-normal ${switchLabelClassName}`}
              >
                {switchLabel}
              </Label>
              <Switch
                id={switchId}
                checked={switchChecked}
                onCheckedChange={(checked) => {
                  if (checked && isCustomerMode) {
                    navigate("/groomer/dashboard");
                  }
                  if (!checked && !isCustomerMode) {
                    navigate("/account/dashboard");
                  }
                }}
                className={switchClassName}
                aria-label={switchAriaLabel}
              />
            </div>
            <DropdownMenuSeparator className={separatorClassName} />
          </>
        ) : null}
        <DropdownMenuItem
          onClick={() => navigate(dashboardPath)}
          className={`cursor-pointer ${itemBaseClassName} ${
            isDashboardActive ? activeItemClassName : ""
          }`}
        >
          <span className="font-comfortaa font-normal text-[14px]">
            Dashboard
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className={`cursor-pointer ${itemBaseClassName}`}
        >
          <span className="font-comfortaa font-normal text-[14px]">
            Log out
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

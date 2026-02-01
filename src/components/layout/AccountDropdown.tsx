import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/common/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import type { MeOut } from "@/lib/api";

export default function AccountDropdown({
  userInfo,
  fallbackName,
}: {
  userInfo?: MeOut | null;
  fallbackName?: string;
}) {
  const userName = userInfo
    ? (userInfo.first_name || userInfo.email.split("@")[0] || "User")
    : (fallbackName || "User");
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useLogout();
  const isDashboardActive = location.pathname.startsWith("/account/dashboard");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" data-name="Button tertiary">
          <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative">
            <div className="bg-[#8b6357] overflow-clip relative rounded-[100px] shrink-0 size-[20px] flex items-center justify-center" data-name="Icons/Avatar/Brown/Default/Rempli">
              <Icon name="user" aria-label="User" className="block size-full text-white" />
            </div>
            <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#8b6357] text-[12px]">
              {userName}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => navigate("/account/dashboard")}
          className={`cursor-pointer text-[#8b6357] hover:text-[#6f4e44] hover:bg-[#8b6357]/5 ${
            isDashboardActive ? "bg-[#8b6357]/10 text-[#6f4e44]" : ""
          }`}
        >
          <span className="font-['Comfortaa:Regular',sans-serif] font-normal text-[14px]">
            Dashboard
          </span>
        </DropdownMenuItem>
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
  );
}

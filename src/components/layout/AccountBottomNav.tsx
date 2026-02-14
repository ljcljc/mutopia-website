import { useLocation, useNavigate } from "react-router-dom";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/components/ui/utils";

interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: IconName;
  showLabel?: boolean;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/account/dashboard",
    iconName: "dashboard",
    showLabel: true,
  },
  {
    id: "my-pets",
    label: "My Pets",
    path: "/account/pets",
    iconName: "pets",
    showLabel: true,
  },
  {
    id: "account",
    label: "Account",
    path: "/account/profile",
    iconName: "user",
    showLabel: true,
  },
  {
    id: "more",
    label: "More",
    path: "/account/notifications",
    iconName: "more",
    showLabel: false,
  },
];

const isActiveRoute = (pathname: string, path: string, from?: string | null): boolean => {
  if (pathname.startsWith("/account/pets/new")) {
    return path === (from === "my-pets" ? "/account/pets" : "/account/dashboard");
  }
  if (pathname.startsWith("/account/bookings")) {
    return path === "/account/dashboard";
  }
  if (path === "/account" || path === "/account/") {
    return pathname === "/account" || pathname === "/account/";
  }
  return pathname === path || pathname.startsWith(path + "/");
};

export default function AccountBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as { from?: string } | null)?.from ?? null;

  return (
    <div className="account-bottom-nav fixed bottom-0 left-0 right-0 z-50 sm:hidden">
      <div className="bg-white border-t-2 border-[#8B6357] relative h-[60px]">
        <div className="pointer-events-none absolute -top-[15px] left-1/2 z-10 h-[15.273px] w-[56px] -translate-x-1/2">
          <img
            alt=""
            src="https://www.figma.com/api/mcp/asset/7fe23bd9-b0e3-4610-94ad-cf4622ea0c6a"
            className="h-full w-full"
          />
        </div>
        <div className="nav-list relative flex h-full items-end justify-between px-6 pb-[8px]">
          {navItems.slice(0, 2).map((item) => {
            const active = isActiveRoute(location.pathname, item.path, from);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-item flex flex-col items-center gap-[3px] px-[6px]",
                  active && "nav-item-active"
                )}
              >
                <Icon
                  name={item.iconName}
                  className={cn("size-[20px]", active ? "text-[#DE6A07]" : "text-[#8B6357]")}
                  aria-hidden="true"
                />
                {item.showLabel && (
                  <span
                    className={cn(
                      "font-comfortaa text-[12px] font-bold leading-[17.5px]",
                      active ? "text-[#DE6A07]" : "text-[#8B6357]"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => navigate("/booking")}
              aria-label="Book"
              className="-mt-[22px] flex items-center justify-center rounded-full bg-[#DE6A07] shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)] size-[42px]"
            >
              <Icon name="pet" className="size-[20px] text-white" aria-hidden="true" />
            </button>
            <span className="mt-[2px] font-comfortaa text-[12px] font-bold leading-[17.5px] text-[#8B6357]">
              Book
            </span>
          </div>

          {navItems.slice(2).map((item) => {
            const active = isActiveRoute(location.pathname, item.path, from);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-item flex flex-col items-center gap-[3px] px-[6px]",
                  active && item.showLabel
                    ? "nav-item-active"
                    : item.showLabel
                      ? ""
                      : "pt-[10px] nav-item-icononly"
                )}
              >
                <Icon
                  name={item.iconName}
                  className={cn("size-[20px]", active ? "text-[#DE6A07]" : "text-[#8B6357]")}
                  aria-hidden="true"
                />
                {item.showLabel && (
                  <span
                    className={cn(
                      "font-comfortaa text-[12px] font-bold leading-[17.5px]",
                      active ? "text-[#DE6A07]" : "text-[#8B6357]"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .account-bottom-nav .nav-item {
          width: 60px;
          height: 50px;
          transition: all 0.3s ease;
          border-top-left-radius: 100px;
          border-top-right-radius: 100px;
        }
        .account-bottom-nav .nav-item-active {
          transform: translateY(-12px);
          height: 60px;
          background: #ffffff;
        }
        .account-bottom-nav .nav-item-active::before,
        .account-bottom-nav .nav-item-active::after {
          content: "";
          position: absolute;
          top: 6px;
          width: 6px;
          height: 6px;
          border-bottom: 2px solid #8B6357;
          background: transparent;
        }
        .account-bottom-nav .nav-item-active::before {
          left: -3px;
          border-bottom-right-radius: 6px;
        }
        .account-bottom-nav .nav-item-active::after {
          right: -3px;
          border-bottom-left-radius: 6px;
        }
        .account-bottom-nav .nav-item-active::marker {
          content: none;
        }
        .account-bottom-nav .nav-list::before {
          content: "";
          position: absolute;
          top: 0;
          height: 2px;
          width: 60px;
          background: #ffffff;
          left: calc(50% - 30px);
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

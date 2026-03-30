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
    label: "Menu",
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
      <div className="relative mx-auto h-[71px] max-w-[393px] bg-white">
        <div aria-hidden="true" className="nav-bridge" />
        <div className="relative h-full">
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
                  "nav-item absolute top-[12px] h-[43px] transition-colors duration-200",
                  `nav-item-${item.id}`
                )}
              >
                <Icon
                  name={item.iconName}
                  className={cn(
                    "nav-item-icon size-6 transition-colors duration-200",
                    active ? "text-[#E67E22]" : "text-[#9CA3AF]"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "nav-item-text whitespace-nowrap font-comfortaa text-[10px] leading-[15px] transition-colors duration-200",
                    active ? "font-bold text-[#E67E22]" : "font-normal text-[#9CA3AF]"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="absolute left-1/2 top-[-9px] -translate-x-1/2">
            <button
              type="button"
              onClick={() => navigate("/booking")}
              aria-label="Book"
              className="book-btn flex h-16 w-16 flex-col items-center justify-center rounded-full"
            >
              <div className="book-inner">
                <Icon name="calendar" className="book-icon size-6 text-white" aria-hidden="true" />
                <span className="book-text font-comfortaa text-[10px] font-normal leading-[15px] text-white">
                  Book
                </span>
              </div>
            </button>
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
                  "nav-item absolute top-[12px] h-[43px] transition-colors duration-200",
                  `nav-item-${item.id}`
                )}
              >
                <Icon
                  name={item.iconName}
                  className={cn(
                    "nav-item-icon size-6 transition-colors duration-200",
                    active ? "text-[#E67E22]" : "text-[#9CA3AF]"
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "nav-item-text whitespace-nowrap font-comfortaa text-[10px] leading-[15px] transition-colors duration-200",
                    active ? "font-bold text-[#E67E22]" : "font-normal text-[#9CA3AF]"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .account-bottom-nav .nav-bridge {
          position: absolute;
          top: -21px;
          left: 50%;
          width: 78px;
          height: 70px;
          transform: translateX(-50%);
          border-radius: 39px 39px 0 0;
          background: #ffffff;
        }
        .account-bottom-nav .nav-item-dashboard {
          left: 34.39px;
          width: 30.81px;
        }
        .account-bottom-nav .nav-item-my-pets {
          left: 94px;
          width: 48px;
        }
        .account-bottom-nav .nav-item-account {
          left: 253.16px;
          width: 46.84px;
        }
        .account-bottom-nav .nav-item-more {
          left: 328.8px;
          width: 29.47px;
        }
        .account-bottom-nav .nav-item-icon {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .account-bottom-nav .nav-item-text {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
        }
        .account-bottom-nav .book-btn {
          background: linear-gradient(180deg, #e67e22 0%, #f39c12 100%);
          box-shadow: 0 8px 20px rgba(230, 126, 34, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .account-bottom-nav .book-inner {
          display: flex;
          height: 100%;
          width: 100%;
          flex-direction: column;
          align-items: center;
          padding-top: 12.5px;
        }
        .account-bottom-nav .book-icon {
          flex-shrink: 0;
        }
        .account-bottom-nav .book-text {
          margin-top: 0;
        }
        .account-bottom-nav .book-btn:active {
          transform: scale(0.97);
          box-shadow: 0 6px 14px rgba(230, 126, 34, 0.34);
        }
      `}</style>
    </div>
  );
}

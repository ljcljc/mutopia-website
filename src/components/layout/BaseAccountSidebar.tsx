import type { CSSProperties } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon, type IconName } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common";
import { cn } from "@/components/ui/utils";

export interface SidebarNavItem {
  id: string;
  label: string;
  path: string;
  iconName: IconName;
  badge?: number | string;
  variant?: "default" | "danger";
  onClick?: () => void;
}

interface BaseAccountSidebarProps {
  mainNavItems: SidebarNavItem[];
  auxiliaryLinks: SidebarNavItem[];
  className?: string;
  bookingPath?: string;
  bookingLabel?: string;
  activeMatcher?: (locationPath: string, itemPath: string) => boolean;
  useAuxiliaryStateClasses?: boolean;
  footerCompact?: boolean;
  footerGapClassName?: string;
}

export default function BaseAccountSidebar({
  mainNavItems,
  auxiliaryLinks,
  className,
  bookingPath = "/booking",
  bookingLabel = "Book appointment",
  activeMatcher,
  useAuxiliaryStateClasses = false,
  footerGapClassName,
}: BaseAccountSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string): boolean => {
    if (activeMatcher) {
      return activeMatcher(location.pathname, path);
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavClick = (item: SidebarNavItem) => {
    if (item.onClick) {
      item.onClick();
      return;
    }
    if (item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="none"
      className={cn(
        "bg-white h-[610px] p-4 rounded-[12px] border border-[rgba(0,0,0,0.10)] shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]",
        className
      )}
      style={{ "--sidebar-width": "280px" } as CSSProperties}
    >
      <SidebarContent className="flex flex-col gap-10 overflow-x-hidden">
        <div>
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className="font-['Comfortaa',sans-serif] font-normal text-[14px] text-[#8B6357] data-[active=true]:text-[#DE6A07] data-[active=true]:bg-[#FAE7D5] rounded-lg h-auto min-h-[40px] py-2.5 px-4 transition-colors duration-200 hover:bg-[#FAE7D5]/50 hover:text-[#DE6A07]"
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center gap-3 w-full group"
                    >
                      <Icon
                        name={item.iconName}
                        className={cn(
                          "shrink-0",
                          active ? "text-[#DE6A07]" : "text-[#8B6357] group-hover:text-[#DE6A07]"
                        )}
                        style={{ width: "20px", height: "20px" }}
                        aria-hidden="true"
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined &&
                        (typeof item.badge === "number" ? item.badge > 0 : item.badge !== "") && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          <OrangeButton
            variant="primary"
            size="medium"
            fullWidth
            onClick={() => navigate(bookingPath)}
            className="mt-8"
          >
            <div className="flex gap-2 items-center justify-center">
              <span className="font-['Comfortaa',sans-serif] font-medium text-[14px] text-white">{bookingLabel}</span>
              <Icon name="button-arrow" aria-label="Arrow" className="size-[14px] text-white" />
            </div>
          </OrangeButton>
        </div>

        <div className="py-6 border-t border-[rgba(0,0,0,0.1)]">
          <SidebarMenu>
            {auxiliaryLinks.map((item) => {
              const active = isActive(item.path);
              const isDanger = item.variant === "danger";
              const iconClassName = useAuxiliaryStateClasses
                ? cn(
                    "shrink-0",
                    isDanger ? "sidebar-icon-danger" : "sidebar-icon-default",
                    !isDanger && active && "sidebar-icon-active"
                  )
                : cn(
                    "shrink-0",
                    isDanger ? "sidebar-icon-danger text-[#E7000B]" : "sidebar-icon-default text-[#364153]"
                  );
              const textClassName = useAuxiliaryStateClasses
                ? cn(
                    "flex-1",
                    isDanger ? "sidebar-text-danger" : "sidebar-text-default",
                    !isDanger && active && "sidebar-text-active"
                  )
                : cn(
                    "flex-1",
                    isDanger ? "sidebar-text-danger text-[#E7000B]" : "sidebar-text-default text-[#364153]"
                  );
              const baseClassName = cn(
                "font-['Comfortaa',sans-serif] font-normal text-[14px] rounded-lg h-auto min-h-[40px] py-2.5 px-4 transition-colors duration-200",
                isDanger
                  ? "text-[#E7000B] hover:text-[#E7000B] hover:bg-[#FEE2E2] cursor-pointer"
                  : "text-[#8B6357] data-[active=true]:text-[#DE6A07] data-[active=true]:bg-[#FAE7D5] hover:bg-[#FAE7D5]/50 hover:text-[#DE6A07]"
              );

              if (item.onClick || item.path === "#") {
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={active} onClick={() => handleNavClick(item)} className={baseClassName}>
                      <div className="flex items-center gap-3 w-full group">
                        <Icon name={item.iconName} className={iconClassName} style={{ width: "20px", height: "20px" }} aria-hidden="true" />
                        <span className={textClassName}>{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={active} className={baseClassName}>
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item)}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className="flex items-center gap-3 w-full group"
                    >
                      <Icon name={item.iconName} className={iconClassName} style={{ width: "20px", height: "20px" }} aria-hidden="true" />
                      <span className={textClassName}>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          "border-t border-[rgba(0,0,0,0.1)] px-0 pt-6",
          footerGapClassName
        )}
      >
        <div className={cn("flex flex-col gap-3")}>
          <h3 className="font-['Comfortaa',sans-serif] font-normal text-[12px] text-[#8B7A6B] uppercase tracking-wide">
            DOWNLOAD THE APP
          </h3>
          <div
            className={cn(
              "bg-white border border-[rgba(0,0,0,0.1)] rounded-lg flex items-center justify-between px-3 py-2",
            )}
          >
            <div className="flex items-center gap-2">
              <Icon
                name="download"
                className="text-[#4A3C2A] shrink-0"
                style={{ width: "20px", height: "20px" }}
                aria-hidden="true"
              />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[14px] text-[#4A3C2A]">Get the App</span>
            </div>
            <span className="font-['Comfortaa',sans-serif] font-normal text-[12px] text-[#DE6A07]">Coming soon</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Icon, type IconName } from "@/components/common/Icon";
import { OrangeButton } from "@/components/common";
import { useAuthStore } from "@/components/auth/authStore";
import { logout } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";

interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: IconName; // 项目 Icon 组件名称
  badge?: number | string;
  variant?: "default" | "danger";
  onClick?: () => void;
}

// 主要导航项
const mainNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/account/dashboard",
    iconName: "dashboard",
  },
  {
    id: "my-pets",
    label: "My Pets",
    path: "/account/pets",
    iconName: "pets",
  },
  {
    id: "notifications",
    label: "Notifications",
    path: "/account/notifications",
    iconName: "notify",
    badge: 0, // TODO: 从 API 获取未读通知数
  },
  {
    id: "my-account",
    label: "My Account",
    path: "/account/profile",
    iconName: "user",
  },
];

// 辅助链接
const auxiliaryLinks: NavItem[] = [
  {
    id: "how-it-works",
    label: "How It Works",
    path: "/how-it-works",
    iconName: "help-circle",
  },
  {
    id: "logout",
    label: "Logout",
    path: "#",
    iconName: "logout",
    variant: "danger",
    onClick: async () => {
      try {
        await logout();
        useAuthStore.getState().logout();
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout error:", error);
        useAuthStore.getState().logout(); // 无论 API 是否成功，都清理本地状态
        toast.success("Logged out successfully");
      }
    },
  },
];

interface AccountSidebarProps {
  className?: string;
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // 判断当前激活项（支持嵌套路由）
  const isActive = (path: string): boolean => {
    if (path === "/account" || path === "/account/") {
      return (
        location.pathname === "/account" || location.pathname === "/account/"
      );
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  // 处理导航点击
  const handleNavClick = (item: NavItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="none"
      className={cn(
        "bg-white h-[610px] p-4", // 白色背景
        "rounded-[12px]", // border-radius: 12px
        "border border-[rgba(0,0,0,0.10)]", // border: 1px solid rgba(0, 0, 0, 0.10)
        "shadow-[0_1px_3px_0_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]", // box-shadow
        className
      )}
      style={
        {
          "--sidebar-width": "280px", // TODO: 从 Figma 精确测量
        } as React.CSSProperties
      }
    >
      <SidebarContent className="flex flex-col gap-10 overflow-x-hidden">
        <div>
          {/* 主要导航区域 */}
          <SidebarMenu>
            {mainNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "font-['Comfortaa',sans-serif] font-normal text-[14px]",
                      "text-[#8B6357]", // 默认文字颜色，与图标颜色一致
                      "data-[active=true]:text-[#DE6A07]", // 激活状态橙色文字
                      "data-[active=true]:bg-[#FAE7D5]", // 激活状态浅橙色背景（根据 Figma 精确还原）
                      "rounded-lg", // 圆角矩形
                      "h-auto min-h-[40px] py-2.5 px-4", // 根据 Figma 精确测量
                      "transition-colors duration-200",
                      "hover:bg-[#FAE7D5]/50 hover:text-[#DE6A07]", // 悬停效果：背景和文字颜色
                      active && "aria-current=page"
                    )}
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
                        active 
                          ? "text-[#DE6A07]" 
                          : "text-[#8B6357] group-hover:text-[#DE6A07]"
                      )}
                      style={{ width: "20px", height: "20px" }}
                      aria-hidden="true"
                    />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined &&
                        (typeof item.badge === "number"
                          ? item.badge > 0
                          : item.badge !== "") && (
                          <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                        )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>

          {/* Book Appointment 按钮 */}
          <OrangeButton
            variant="primary"
            size="medium"
            fullWidth
            onClick={() => navigate("/booking")}
            className="mt-8"
          >
            <div className="flex gap-2 items-center justify-center">
              <span className="font-['Comfortaa',sans-serif] font-medium text-[14px] text-white">
                Book appointement
              </span>
              <Icon
                name="button-arrow"
                aria-label="Arrow"
                className="size-[14px] text-white"
              />
            </div>
          </OrangeButton>
        </div>

        <div className="pt-6 border-t border-[rgba(0,0,0,0.1)]">
          {/* 辅助链接区域 */}
          <SidebarMenu>
            {auxiliaryLinks.map((item) => {
              const active = isActive(item.path);
              const isDanger = item.variant === "danger";
              return (
                <SidebarMenuItem key={item.id}>
                  {item.onClick ? (
                    <SidebarMenuButton
                      isActive={active}
                      onClick={item.onClick}
                      className={cn(
                        "font-['Comfortaa',sans-serif] font-normal text-[14px]",
                        isDanger
                          ? "text-[#E7000B] hover:text-[#E7000B] hover:bg-[#FEE2E2] cursor-pointer"
                          : "text-[#8B6357] data-[active=true]:text-[#DE6A07] hover:text-[#DE6A07]", // 默认文字颜色与图标一致
                        "data-[active=true]:bg-[#FAE7D5]",
                        "rounded-lg",
                        "h-auto min-h-[40px] py-2.5 px-4",
                        "transition-colors duration-200",
                        "hover:bg-[#FAE7D5]/50"
                      )}
                    >
                      <div className="flex items-center gap-3 w-full group">
                        <Icon
                          name={item.iconName}
                          className={cn(
                            "shrink-0",
                            isDanger ? "sidebar-icon-danger" : "sidebar-icon-default"
                          )}
                          style={{ width: "20px", height: "20px" }}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "flex-1",
                            isDanger ? "sidebar-text-danger" : "sidebar-text-default"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "font-['Comfortaa',sans-serif] font-normal text-[14px]",
                        "text-[#8B6357] data-[active=true]:text-[#DE6A07] hover:text-[#DE6A07]", // 默认文字颜色与图标一致
                        "data-[active=true]:bg-[#FAE7D5]",
                        "rounded-lg",
                        "h-auto min-h-[40px] py-2.5 px-4",
                        "transition-colors duration-200",
                        "hover:bg-[#FAE7D5]/50"
                      )}
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
                        "shrink-0 sidebar-icon-default",
                        active && "sidebar-icon-active"
                      )}
                      style={{ width: "20px", height: "20px" }}
                      aria-hidden="true"
                    />
                        <span className={cn(
                          "flex-1 sidebar-text-default",
                          active && "sidebar-text-active"
                        )}>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* 底部下载区域 */}
      <SidebarFooter className="pt-6 px-0 border-t border-[rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-3">
          <h3 className="font-['Comfortaa',sans-serif] font-normal text-[12px] text-[#8B7A6B] uppercase tracking-wide">
            DOWNLOAD THE APP
          </h3>
          <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon
                name="download"
                className="text-[#4A3C2A] shrink-0"
                style={{ width: "20px", height: "20px" }}
                aria-hidden="true"
              />
              <span className="font-['Comfortaa',sans-serif] font-normal text-[14px] text-[#4A3C2A]">
                Get the App
              </span>
            </div>
            <span className="font-['Comfortaa',sans-serif] font-normal text-[12px] text-[#DE6A07]">
              Coming soon
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

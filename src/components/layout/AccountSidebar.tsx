import { useLogout } from "@/hooks/useLogout";
import BaseAccountSidebar, { type SidebarNavItem } from "./BaseAccountSidebar";

const mainNavItems: SidebarNavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/account/dashboard", iconName: "dashboard" },
  { id: "my-pets", label: "My Pets", path: "/account/pets", iconName: "pets" },
  { id: "notifications", label: "Notifications", path: "/account/notifications", iconName: "notify", badge: 0 },
  { id: "my-account", label: "My Account", path: "/account/profile", iconName: "user" },
];

interface AccountSidebarProps {
  className?: string;
}

export function AccountSidebar({ className }: AccountSidebarProps) {
  const { handleLogout } = useLogout();

  const auxiliaryLinks: SidebarNavItem[] = [
    { id: "how-it-works", label: "How It Works", path: "/how-it-works", iconName: "help-circle" },
    { id: "logout", label: "Logout", path: "#", iconName: "logout", variant: "danger", onClick: handleLogout },
  ];

  const activeMatcher = (locationPath: string, path: string): boolean => {
    if (locationPath.startsWith("/account/pets/new")) return path === "/account/dashboard";
    if (locationPath.startsWith("/account/bookings")) return path === "/account/dashboard";
    if (path === "/account" || path === "/account/") return locationPath === "/account" || locationPath === "/account/";
    return locationPath === path || locationPath.startsWith(path + "/");
  };

  return (
    <BaseAccountSidebar
      className={className}
      mainNavItems={mainNavItems}
      auxiliaryLinks={auxiliaryLinks}
      activeMatcher={activeMatcher}
      useAuxiliaryStateClasses
    />
  );
}

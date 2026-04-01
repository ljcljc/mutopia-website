import { useLogout } from "@/hooks/useLogout";
import BaseAccountSidebar, { type SidebarNavItem } from "@/components/layout/BaseAccountSidebar";

const mainNavItems: SidebarNavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/groomer/dashboard", iconName: "logo" },
  { id: "my-work", label: "My work", path: "/groomer/my-work", iconName: "clock" },
  { id: "earnings", label: "Earnings", path: "/groomer/earnings", iconName: "earning" },
  { id: "my-account", label: "My Account", path: "/groomer/account", iconName: "user" },
];

interface GroomerSidebarProps {
  className?: string;
}

export default function GroomerSidebar({ className }: GroomerSidebarProps) {
  const { handleLogout } = useLogout();

  const auxiliaryLinks: SidebarNavItem[] = [
    { id: "how-it-works", label: "How It Works", path: "/how-it-works", iconName: "help-circle" },
    { id: "logout", label: "Logout", path: "#", iconName: "logout", variant: "danger", onClick: handleLogout },
  ];

  return (
    <BaseAccountSidebar
      className={className}
      mainNavItems={mainNavItems}
      auxiliaryLinks={auxiliaryLinks}
      footerGapClassName="mt-0"
    />
  );
}

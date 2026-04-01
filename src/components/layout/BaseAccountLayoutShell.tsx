import { type ReactNode, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/common";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/components/ui/utils";

interface BaseAccountLayoutShellProps {
  rootClassName: string;
  contentBackgroundClassName: string;
  contentContainerClassName: string;
  sidebar: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  bottomNav: ReactNode;
  footerClassName: string;
  bottomNavClassName: string;
  insetClassName?: string;
  contentGrow?: boolean;
}

export default function BaseAccountLayoutShell({
  rootClassName,
  contentBackgroundClassName,
  contentContainerClassName,
  sidebar,
  header,
  footer,
  bottomNav,
  footerClassName,
  bottomNavClassName,
  insetClassName,
  contentGrow = true,
}: BaseAccountLayoutShellProps) {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <SidebarProvider className="w-full" defaultOpen={true}>
      <div className={cn("min-h-screen flex flex-col w-full", rootClassName)}>
        {header}

        <div className={cn("w-full", contentGrow && "flex-1", contentBackgroundClassName)}>
          <div className={contentContainerClassName}>
            {sidebar}
            <SidebarInset ref={contentRef} className={cn("flex-1 overflow-auto rounded-lg", insetClassName)}>
              <main className="flex-1 min-h-full w-full flex flex-col">
                <Outlet />
              </main>
            </SidebarInset>
          </div>
        </div>

        <div className={footerClassName}>{footer}</div>
        <div className={bottomNavClassName}>{bottomNav}</div>
        <ScrollToTop />
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

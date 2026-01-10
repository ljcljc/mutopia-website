import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AccountSidebar } from "./AccountSidebar";
import HeaderApp from "./HeaderApp";
import Footer from "./Footer";
import { ScrollToTop } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";

export default function AccountLayout() {
  return (
    <SidebarProvider className="w-full" defaultOpen={true}>
      <div className="min-h-screen flex flex-col bg-[#F9F1E8] w-full">
        {/* 全局顶部 Header */}
        <HeaderApp />
        
        {/* 主内容区域：侧边栏 + 内容区 */}
        <div className="w-7xl mx-auto flex flex-1 overflow-hidden gap-6 my-14">
          {/* 左侧侧边栏 */}
          <AccountSidebar />
          
          {/* 右侧主内容区域 */}
          <SidebarInset className="flex-1 bg-[#F9F1E8] overflow-auto rounded-lg">
            <main className="flex-1 min-h-full w-full flex flex-col">
              <Outlet />
            </main>
          </SidebarInset>
        </div>
        
        {/* 全局底部 Footer */}
        <Footer />
        <ScrollToTop />
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

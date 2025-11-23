import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import HeaderApp from "@/components/layout/HeaderApp";
import Footer from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {isHomePage ? <Header /> : <HeaderApp />}
      <main className="flex-1">
        <Outlet />
      </main>
      {isHomePage && <Footer />}
      <ScrollToTop />
      <Toaster />
    </div>
  );
}


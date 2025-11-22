import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/landing/Hero";
import WhyUs from "@/components/landing/WhyUs";
import Services from "@/components/landing/Services";
import Packages from "@/components/landing/Packages";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import { ScrollToTop } from "@/components/common";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/components/auth/authStore";
import { getEncryptedItem } from "@/lib/encryption";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export default function App() {
  const setUser = useAuthStore((state) => state.setUser);

  // Load user info from encrypted localStorage on app start
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userInfoStr = await getEncryptedItem(STORAGE_KEYS.USER_INFO);
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          // Validate that the stored user info has required fields
          if (userInfo && typeof userInfo === "object" && userInfo.name && userInfo.email) {
            setUser({
              name: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.avatar,
            });
          }
        }
      } catch (e) {
        console.warn("Failed to load user info from localStorage:", e);
        // Clear invalid data
        try {
          const { removeEncryptedItem } = await import("@/lib/encryption");
          removeEncryptedItem(STORAGE_KEYS.USER_INFO);
        } catch (clearError) {
          console.warn("Failed to clear invalid user info from localStorage:", clearError);
        }
      }
    };

    loadUserInfo();
  }, [setUser]);

  return (
      <div className="min-h-screen">
        <Header />

        <main>
          <Hero />
          <WhyUs />
          <Services />
          <Packages />
          <FAQ />
        </main>
        <Footer />

        <ScrollToTop />
        <Toaster />
      </div>
  );
}

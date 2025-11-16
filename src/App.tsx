import Header from '@/components/Header';
import Hero from '@/components/landing/Hero';
import WhyUs from '@/components/landing/WhyUs';
import Services from '@/components/landing/Services';
import Packages from '@/components/landing/Packages';
import FAQ from '@/components/landing/FAQ';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { UserProvider } from '@/components/UserContext';

export default function App() {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

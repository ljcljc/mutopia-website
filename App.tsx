import Header from './components/Header';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import Packages from './components/Packages';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from './components/ui/sonner';
import { UserProvider } from './components/UserContext';

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

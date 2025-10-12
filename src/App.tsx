import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { WhyUs } from "./components/WhyUs";
import { Services } from "./components/Services";
import { Packages } from "./components/Packages";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Services />
        <Packages />
        <FAQ />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
import Hero from "@/components/landing/Hero";
import WhyUs from "@/components/landing/WhyUs";
import Services from "@/components/landing/Services";
import Packages from "@/components/landing/Packages";
import FAQ from "@/components/landing/FAQ";
import Contact from "@/components/landing/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Services />
      <Packages />
      <FAQ />
      <Contact />
    </>
  );
}


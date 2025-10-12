<script setup lang="ts">
import Header from './components/Header.vue';
import Hero from './components/Hero.vue';
import WhyUs from './components/WhyUs.vue';
import Services from './components/Services.vue';
import Packages from './components/Packages.vue';
import FAQ from './components/FAQ.vue';
import Footer from './components/Footer.vue';
import Testimonials from './components/Testimonials.vue';
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <main>
      <Hero />
      <WhyUs />
      <Services />
      <Packages />
      <Testimonials />
      <FAQ />
    </main>
    <Footer />
  </div>
</template>

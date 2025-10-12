<script setup lang="ts">
import Button from './ui/button.vue';
import ImageWithFallback from './figma/ImageWithFallback.vue';
import { Calendar, Star, Heart } from 'lucide-vue-next';

const groomingImage = '/images/grooming-hero.png';
</script>

<template>
  <section
    class="relative bg-gradient-to-br from-orange-50 to-amber-50 py-20 lg:py-32 overflow-hidden"
  >
    <!-- Curved Background Elements -->
    <div class="absolute inset-0">
      <div class="absolute top-0 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-accent rounded-full opacity-20"></div>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <!-- Left Content -->
        <div class="space-y-8">
          <div class="space-y-4">
            <h1 class="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Premium Pet Grooming
              <span class="text-primary">Made Simple</span>
            </h1>
            <p class="text-xl text-foreground/70 leading-relaxed">
              Transform your furry friend with our professional grooming services. Book online,
              relax at home, and let our certified groomers come to you.
            </p>
          </div>

          <!-- Features -->
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-2">
              <Calendar class="text-primary" :size="20" />
              <span class="text-foreground/80">Easy booking</span>
            </div>
            <div class="flex items-center gap-2">
              <Heart class="text-secondary" :size="20" />
              <span class="text-foreground/80">Pet-friendly</span>
            </div>
            <div class="flex items-center gap-2">
              <Star class="text-yellow-500" :size="20" />
              <span class="text-foreground/80">Professional service</span>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <Button
              class="text-lg px-8 py-4 h-auto rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Book Appointment
            </Button>
            <Button
              variant="outline"
              class="text-lg px-8 py-4 h-auto rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              View Services
            </Button>
          </div>
        </div>

        <!-- Right Content - Image -->
        <div class="relative flex justify-center">
          <div class="relative transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <ImageWithFallback
              :src="groomingImage"
              alt="Professional pet grooming with grooming tools"
              class="w-96 h-auto object-contain"
            />
          </div>

          <!-- Decorative Elements -->
          <div
            class="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/20 rounded-full opacity-60 blur-xl"
          ></div>
          <div
            class="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-full opacity-40 blur-xl"
          ></div>
          <div
            class="absolute -top-12 left-1/2 w-20 h-20 bg-accent rounded-full opacity-50 blur-lg"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

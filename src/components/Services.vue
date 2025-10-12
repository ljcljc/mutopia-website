<script setup lang="ts">
// 所有UI组件和图标都自动可用
// 注意：Scissors、Droplets、Brush、Sparkles 需要手动导入（未在自动导入配置中）
import { Scissors, Droplets, Brush, Sparkles } from 'lucide-vue-next';

const mainServices = [
  {
    icon: Scissors,
    title: 'Full Grooming',
    description: 'Complete wash, cut, nail trim, and styling for your pet',
    duration: '2-3 hours',
    price: 'From $80',
    features: [
      'Bath & dry',
      'Haircut & styling',
      'Nail trimming',
      'Ear cleaning',
      'Teeth brushing',
    ],
    popular: true,
  },
  {
    icon: Droplets,
    title: 'Bath & Brush',
    description: 'Refreshing bath with premium products and thorough brushing',
    duration: '1-2 hours',
    price: 'From $45',
    features: [
      'Premium shampoo',
      'Conditioning',
      'Thorough brushing',
      'Basic nail trim',
      'Ear check',
    ],
    popular: false,
  },
  {
    icon: Brush,
    title: 'Express Groom',
    description: 'Quick touch-up for pets who need a fast refresh',
    duration: '45-60 min',
    price: 'From $35',
    features: ['Quick wash', 'Brush out', 'Nail trim', 'Sanitary trim', 'Face & feet cleanup'],
    popular: false,
  },
];

const additionalServices = [
  { name: 'Nail Painting', price: '$15' },
  { name: 'Teeth Cleaning', price: '$25' },
  { name: 'Flea Treatment', price: '$30' },
  { name: 'De-shedding Treatment', price: '$35' },
  { name: 'Aromatherapy Add-on', price: '$20' },
  { name: 'Premium Cologne', price: '$10' },
];
</script>

<template>
  <section
    id="services"
    class="py-20 bg-gradient-to-br from-accent to-orange-50 relative overflow-hidden"
  >
    <!-- Curved decorative elements -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Premium Services</h2>
        <p class="text-xl text-foreground/70 max-w-3xl mx-auto">
          From basic baths to full spa treatments, we offer everything your pet needs to look and
          feel their absolute best.
        </p>
      </div>

      <!-- Main Services -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card
          v-for="(service, index) in mainServices"
          :key="index"
          class="relative group hover:shadow-xl transition-all duration-300 rounded-3xl border-2 hover:border-primary/20"
        >
          <Badge
            v-if="service.popular"
            class="absolute -top-3 left-6 bg-primary text-white rounded-full px-4 py-1"
          >
            Most Popular
          </Badge>

          <CardHeader class="text-center pb-4">
            <div
              class="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
            >
              <component :is="service.icon" class="text-primary" :size="32" />
            </div>
            <CardTitle class="text-xl mb-2">{{ service.title }}</CardTitle>
            <CardDescription class="text-foreground/70">
              {{ service.description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <Clock :size="16" class="text-primary/60" />
                <span class="text-sm text-foreground/60">{{ service.duration }}</span>
              </div>
              <span class="text-xl font-semibold text-primary">{{ service.price }}</span>
            </div>

            <div class="space-y-2">
              <h4 class="font-medium text-foreground">Includes:</h4>
              <ul class="space-y-1">
                <li
                  v-for="(feature, idx) in service.features"
                  :key="idx"
                  class="flex items-center gap-2 text-sm text-foreground/70"
                >
                  <div class="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  {{ feature }}
                </li>
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              class="w-full rounded-full bg-primary hover:bg-primary/90 transition-colors py-6"
            >
              Book Now
              <ArrowRight :size="16" class="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Additional Services -->
      <div class="bg-white rounded-3xl p-8 shadow-lg border-2 border-primary/10">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-foreground mb-2">Additional Services</h3>
          <p class="text-foreground/70">
            Enhance your pet's grooming experience with our premium add-ons
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(service, index) in additionalServices"
            :key="index"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary/30 transition-colors"
          >
            <div class="flex items-center gap-3">
              <Sparkles class="text-primary" :size="20" />
              <span class="font-medium text-foreground">{{ service.name }}</span>
            </div>
            <span class="font-semibold text-primary">{{ service.price }}</span>
          </div>
        </div>

        <div class="text-center mt-8">
          <Button variant="outline" size="lg">View All Services & Pricing</Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 图标作为变量使用时需要手动导入
import { Crown, Gift, Star, Check } from 'lucide-vue-next';

const packages = [
  {
    name: 'Basic Care',
    icon: Gift,
    price: '$120',
    period: '/month',
    originalPrice: null,
    description: 'Perfect for pets who need regular basic grooming',
    features: [
      '2 bath & brush sessions',
      'Nail trimming included',
      'Ear cleaning',
      'Basic health check',
      '10% off additional services',
      'Flexible scheduling',
    ],
    popular: false,
    cta: 'Get Started',
  },
  {
    name: 'Premium Plus',
    icon: Star,
    price: '$199',
    period: '/month',
    originalPrice: '$240',
    description: 'Our most popular package for complete pet care',
    features: [
      '2 full grooming sessions',
      '1 bath & brush session',
      'All nail, ear & teeth care',
      'De-shedding treatment',
      'Premium products upgrade',
      '15% off additional services',
      'Priority booking',
      'Monthly photo updates',
    ],
    popular: true,
    cta: 'Most Popular',
  },
  {
    name: 'Luxury Spa',
    icon: Crown,
    price: '$299',
    period: '/month',
    originalPrice: '$380',
    description: 'Ultimate luxury experience for pampered pets',
    features: [
      '3 full grooming sessions',
      '2 bath & brush sessions',
      'All premium add-ons included',
      'Aromatherapy treatments',
      'Nail painting service',
      'Custom styling consultation',
      '20% off all services',
      'VIP priority scheduling',
      'Monthly health reports',
      'Complimentary pickup/delivery',
    ],
    popular: false,
    cta: 'Go Premium',
  },
];

const getSavingsPercent = (price: string, originalPrice: string | null) => {
  if (!originalPrice) return 0;
  return Math.round((1 - parseInt(price.slice(1)) / parseInt(originalPrice.slice(1))) * 100);
};
</script>

<template>
  <section
    id="packages"
    class="py-20 relative overflow-hidden"
    style="background: linear-gradient(135deg, #633479 0%, #8b4a9c 50%, #a855f7 100%)"
  >
    <!-- Curved background elements -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute top-0 left-1/3 w-40 h-40 bg-white/15 rounded-full opacity-30"></div>
    </div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
      <!-- Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">Membership Packages</h2>
        <p class="text-xl text-white/80 max-w-3xl mx-auto">
          Save money and ensure your pet always looks their best with our convenient monthly
          membership packages.
        </p>
      </div>

      <!-- Packages Grid -->
      <div class="grid md:grid-cols-3 gap-8 lg:gap-12">
        <Card
          v-for="(pkg, index) in packages"
          :key="index"
          :class="[
            'relative group hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white',
            pkg.popular
              ? 'ring-2 ring-white scale-105 shadow-xl border-white/20'
              : 'hover:scale-105 border-2 hover:border-white/20',
          ]"
        >
          <Badge
            v-if="pkg.popular"
            class="absolute -top-3 left-1/2 -translate-x-1/2 text-white px-6 py-1 rounded-full"
            style="background-color: #633479"
          >
            Most Popular
          </Badge>

          <CardHeader class="text-center pb-6">
            <div
              class="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 transition-colors"
              :style="{
                backgroundColor: pkg.popular ? '#633479' : 'rgba(99, 52, 121, 0.1)',
                color: pkg.popular ? 'white' : '#633479',
              }"
            >
              <component :is="pkg.icon" :size="32" />
            </div>

            <CardTitle class="text-2xl mb-2 text-foreground">{{ pkg.name }}</CardTitle>
            <CardDescription class="text-foreground/70 mb-4">
              {{ pkg.description }}
            </CardDescription>

            <div class="space-y-2">
              <div class="flex items-center justify-center gap-2">
                <span class="text-4xl font-bold text-gray-900">{{ pkg.price }}</span>
                <span class="text-gray-600">{{ pkg.period }}</span>
              </div>
              <div v-if="pkg.originalPrice" class="flex items-center justify-center gap-2">
                <span class="text-lg text-gray-400 line-through">{{ pkg.originalPrice }}</span>
                <Badge variant="secondary" class="bg-green-100 text-green-800">
                  Save {{ getSavingsPercent(pkg.price, pkg.originalPrice) }}%
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 px-6">
            <ul class="space-y-3">
              <li v-for="(feature, idx) in pkg.features" :key="idx" class="flex items-start gap-3">
                <Check
                  :size="16"
                  :class="['mt-0.5 flex-shrink-0', pkg.popular ? 'text-primary' : 'text-green-600']"
                />
                <span class="text-sm text-gray-700">{{ feature }}</span>
              </li>
            </ul>
          </CardContent>

          <CardFooter class="px-6 pb-6">
            <Button
              :class="[
                'w-full rounded-full',
                pkg.popular
                  ? 'bg-primary hover:bg-primary/90 py-6'
                  : 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
              ]"
              :variant="pkg.popular ? 'default' : 'outline'"
              size="lg"
            >
              {{ pkg.cta }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </section>
</template>

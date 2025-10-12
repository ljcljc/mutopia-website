<script setup lang="ts">
import Button from './ui/button.vue';
import Input from './ui/input.vue';
import Separator from './ui/separator.vue';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-vue-next';
</script>

<template>
  <footer id="contact" class="bg-secondary text-white">
    <!-- Newsletter Section -->
    <div class="bg-primary py-16 rounded-t-[3rem] relative overflow-hidden">
      <!-- Curved background elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div
          class="absolute bottom-0 -left-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl"
        ></div>
      </div>
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <h3 class="text-2xl font-bold mb-4">Stay Updated with Pet Care Tips</h3>
        <p class="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          Get expert grooming tips, seasonal care advice, and exclusive offers delivered to your
          inbox.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            placeholder="Enter your email"
            class="bg-white text-gray-900 border-0 rounded-full"
          />
          <Button
            variant="secondary"
            class="whitespace-nowrap bg-white text-primary hover:bg-gray-100 rounded-full"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-6">
            <div class="flex items-center space-x-3 mb-4">
              <img src="@/assets/images/mutopia-logo.png" alt="Mutopia Logo" class="h-10 w-10" />
              <h3 class="text-2xl font-bold">Mutopia</h3>
            </div>
            <div>
              <p class="text-gray-400 leading-relaxed">
                Premium mobile pet grooming services bringing professional care directly to your
                door. Your pet's comfort is our priority.
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Mail :size="16" class="text-primary" />
                <span>hello@mutopia.ca</span>
              </div>
              <div class="flex items-center gap-3">
                <MapPin :size="16" class="text-primary" />
                <span>Serving Greater Toronto Area</span>
              </div>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-6">Quick Links</h4>
            <ul class="space-y-3">
              <li>
                <a href="#services" class="text-gray-400 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#packages" class="text-gray-400 hover:text-white transition-colors">
                  Packages
                </a>
              </li>
              <li>
                <a href="#why-us" class="text-gray-400 hover:text-white transition-colors">
                  Why Choose Us
                </a>
              </li>
              <li>
                <a href="#faq" class="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/booking" class="text-gray-400 hover:text-white transition-colors">
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="/careers" class="text-gray-400 hover:text-white transition-colors">
                  Apply to Groomer
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-6">Support</h4>
            <ul class="space-y-3">
              <li>
                <a href="/help" class="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" class="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/cancellation" class="text-gray-400 hover:text-white transition-colors">
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a href="/service-areas" class="text-gray-400 hover:text-white transition-colors">
                  Service Areas
                </a>
              </li>
              <li>
                <a href="/testimonials" class="text-gray-400 hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="/blog" class="text-gray-400 hover:text-white transition-colors">
                  Pet Care Blog
                </a>
              </li>
            </ul>
          </div>

          <!-- Business Hours & Social -->
          <div>
            <h4 class="font-semibold mb-6">Business Hours</h4>
            <div class="space-y-2 mb-6">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Saturday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Sunday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
            </div>

            <div>
              <h5 class="font-medium mb-4">Follow Us</h5>
              <div class="flex gap-4">
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Facebook :size="20" />
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Instagram :size="20" />
                </a>
                <a
                  href="#"
                  class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Twitter :size="20" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Separator class="bg-gray-800" />

    <!-- Bottom Footer -->
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-gray-400 text-sm">© 2024 Mutopia. All rights reserved.</p>
          <div class="flex gap-6 text-sm">
            <a href="/privacy" class="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" class="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" class="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

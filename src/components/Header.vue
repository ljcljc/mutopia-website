<script setup lang="ts">
// ref、Button、Menu、X、AuthDialog 都自动可用
const isMenuOpen = ref(false);
const isAuthDialogOpen = ref(false);
</script>

<template>
  <header
    class="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 rounded-b-3xl shadow-lg"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <img src="@/assets/images/mutopia-logo.png" alt="Mutopia Logo" class="h-10 w-10" />
          <h1 class="text-2xl font-bold text-secondary">Mutopia</h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#services" class="text-foreground hover:text-primary transition-colors">
            Services
          </a>
          <a href="#packages" class="text-foreground hover:text-primary transition-colors">
            Packages
          </a>
          <a href="#why-us" class="text-foreground hover:text-primary transition-colors">Why Us</a>
          <a href="#faq" class="text-foreground hover:text-primary transition-colors">FAQ</a>
          <a href="#contact" class="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        <!-- CTA Buttons -->
        <div class="hidden md:flex items-center space-x-3">
          <Button variant="outline" size="sm" class="rounded-full h-8 px-4">
            Apply to Groomer
          </Button>
          <Button
            variant="secondary"
            size="sm"
            class="rounded-full h-8 px-4"
            @click="isAuthDialogOpen = true"
          >
            Login / Sign Up
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <button class="md:hidden" @click="isMenuOpen = !isMenuOpen">
          <X v-if="isMenuOpen" :size="24" />
          <Menu v-else :size="24" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-border py-4">
        <nav class="flex flex-col space-y-4">
          <a href="#services" class="text-foreground hover:text-primary transition-colors">
            Services
          </a>
          <a href="#packages" class="text-foreground hover:text-primary transition-colors">
            Packages
          </a>
          <a href="#why-us" class="text-foreground hover:text-primary transition-colors">Why Us</a>
          <a href="#faq" class="text-foreground hover:text-primary transition-colors">FAQ</a>
          <a href="#contact" class="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
          <div class="pt-4 space-y-2">
            <Button variant="outline" size="sm" class="w-full rounded-full">
              Apply to Groomer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              class="w-full rounded-full"
              @click="isAuthDialogOpen = true"
            >
              Login / Sign Up
            </Button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Auth Dialog -->
    <AuthDialog :open="isAuthDialogOpen" @update:open="isAuthDialogOpen = $event" />
  </header>
</template>

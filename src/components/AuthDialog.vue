<script setup lang="ts">
import { ref } from 'vue';
import Dialog from './ui/dialog.vue';
import DialogContent from './ui/DialogContent.vue';
import DialogHeader from './ui/DialogHeader.vue';
import DialogTitle from './ui/DialogTitle.vue';
import DialogDescription from './ui/DialogDescription.vue';
import Tabs from './ui/tabs.vue';
import TabsContent from './ui/TabsContent.vue';
import TabsList from './ui/TabsList.vue';
import TabsTrigger from './ui/TabsTrigger.vue';
import Button from './ui/button.vue';
import Input from './ui/input.vue';
import Label from './ui/label.vue';
import Separator from './ui/separator.vue';
import { Loader2 } from 'lucide-vue-next';

interface Props {
  open: boolean;
}

defineProps<Props>();
const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const activeTab = ref('login');
const showForgotPassword = ref(false);
const isLoading = ref(false);

// Simple toast implementation (替代sonner)
const showToast = (title: string, description: string) => {
  console.log(`[Toast] ${title}: ${description}`);
  // TODO: 实现真正的toast通知
};

const handleGoogleAuth = async () => {
  isLoading.value = true;
  console.log('Google OAuth initiated');

  await new Promise(resolve => setTimeout(resolve, 1500));

  isLoading.value = false;
  emit('update:open', false);
  showToast('Successfully logged in!', 'Welcome back to Mutopia');
};

const handleFacebookAuth = async () => {
  isLoading.value = true;
  console.log('Facebook OAuth initiated');

  await new Promise(resolve => setTimeout(resolve, 1500));

  isLoading.value = false;
  emit('update:open', false);
  showToast('Successfully logged in!', 'Welcome back to Mutopia');
};

const handleEmailLogin = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  console.log('Email login attempted');

  await new Promise(resolve => setTimeout(resolve, 1500));

  isLoading.value = false;
  emit('update:open', false);
  showToast('Successfully logged in!', 'Welcome back to Mutopia');
};

const handleEmailSignup = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  console.log('Email signup attempted');

  await new Promise(resolve => setTimeout(resolve, 1500));

  isLoading.value = false;
  emit('update:open', false);
  showToast(
    'Account created successfully!',
    'Welcome to Mutopia! Your pet grooming journey begins now.'
  );
};

const handleForgotPassword = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  console.log('Forgot password email sent');

  await new Promise(resolve => setTimeout(resolve, 1500));

  isLoading.value = false;
  showForgotPassword.value = false;
  activeTab.value = 'login';
  showToast('Password reset email sent!', 'Check your inbox for the reset link.');
};

const resetDialogState = () => {
  activeTab.value = 'login';
  showForgotPassword.value = false;
  isLoading.value = false;
};

const handleClose = (value: boolean) => {
  if (!value) {
    resetDialogState();
  }
  emit('update:open', value);
};
</script>

<template>
  <Dialog :open="open" @update:open="handleClose">
    <DialogContent class="sm:max-w-md bg-card border-border rounded-3xl">
      <DialogHeader class="text-center pb-4">
        <DialogTitle class="text-2xl text-foreground font-medium">
          {{ showForgotPassword ? 'Reset Your Password' : 'Welcome to Mutopia' }}
        </DialogTitle>
        <DialogDescription class="text-muted-foreground">
          {{
            showForgotPassword
              ? "Enter your email address and we'll send you a link to reset your password"
              : 'Your pet deserves the best grooming experience'
          }}
        </DialogDescription>
      </DialogHeader>

      <!-- Forgot Password View -->
      <div v-if="showForgotPassword" class="space-y-6">
        <form class="space-y-4" @submit="handleForgotPassword">
          <div class="space-y-2">
            <Label for="forgot-email">Email Address</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="Enter your email address"
              class="h-12 rounded-2xl bg-input-background border-border"
              required
              :disabled="isLoading"
            />
          </div>
          <Button
            type="submit"
            class="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </Button>
        </form>

        <div class="text-center">
          <button
            type="button"
            class="text-sm text-primary hover:underline"
            :disabled="isLoading"
            @click="showForgotPassword = false"
          >
            ← Back to Login
          </button>
        </div>
      </div>

      <!-- Main Auth Tabs -->
      <Tabs v-else v-model="activeTab" class="w-full">
        <TabsList class="grid w-full grid-cols-2 mb-6 bg-accent rounded-2xl">
          <TabsTrigger
            value="login"
            class="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            class="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" class="space-y-4">
          <!-- OAuth Buttons -->
          <div class="space-y-3">
            <Button
              variant="outline"
              class="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
              :disabled="isLoading"
              @click="handleGoogleAuth"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
              <template v-else>
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </template>
            </Button>

            <Button
              variant="outline"
              class="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
              :disabled="isLoading"
              @click="handleFacebookAuth"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
              <template v-else>
                <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Continue with Facebook
              </template>
            </Button>
          </div>

          <div class="relative">
            <Separator class="my-6" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="px-4 bg-card text-muted-foreground text-sm">or</span>
            </div>
          </div>

          <!-- Email Login Form -->
          <form class="space-y-4" @submit="handleEmailLogin">
            <div class="space-y-2">
              <Label for="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                class="h-12 rounded-2xl bg-input-background border-border"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                class="h-12 rounded-2xl bg-input-background border-border"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2 text-sm">
                <input type="checkbox" class="rounded" :disabled="isLoading" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                class="text-sm text-primary hover:underline"
                :disabled="isLoading"
                @click="showForgotPassword = true"
              >
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              class="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" class="space-y-4">
          <!-- OAuth Buttons -->
          <div class="space-y-3">
            <Button
              variant="outline"
              class="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
              :disabled="isLoading"
              @click="handleGoogleAuth"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
              <template v-else>
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </template>
            </Button>

            <Button
              variant="outline"
              class="w-full h-12 border-border hover:bg-accent rounded-2xl flex items-center justify-center gap-3"
              :disabled="isLoading"
              @click="handleFacebookAuth"
            >
              <Loader2 v-if="isLoading" class="h-5 w-5 animate-spin" />
              <template v-else>
                <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Sign up with Facebook
              </template>
            </Button>
          </div>

          <div class="relative">
            <Separator class="my-6" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="px-4 bg-card text-muted-foreground text-sm">or</span>
            </div>
          </div>

          <!-- Email Signup Form -->
          <form class="space-y-4" @submit="handleEmailSignup">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="signup-first-name">First Name</Label>
                <Input
                  id="signup-first-name"
                  type="text"
                  placeholder="First name"
                  class="h-12 rounded-2xl bg-input-background border-border"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div class="space-y-2">
                <Label for="signup-last-name">Last Name</Label>
                <Input
                  id="signup-last-name"
                  type="text"
                  placeholder="Last name"
                  class="h-12 rounded-2xl bg-input-background border-border"
                  required
                  :disabled="isLoading"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                class="h-12 rounded-2xl bg-input-background border-border"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                class="h-12 rounded-2xl bg-input-background border-border"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="signup-confirm-password">Confirm Password</Label>
              <Input
                id="signup-confirm-password"
                type="password"
                placeholder="Confirm your password"
                class="h-12 rounded-2xl bg-input-background border-border"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="flex items-start space-x-2">
              <input type="checkbox" class="rounded mt-1" required :disabled="isLoading" />
              <label class="text-sm text-muted-foreground">
                I agree to the
                <button type="button" class="text-primary hover:underline" :disabled="isLoading">
                  Terms of Service
                </button>
                and
                <button type="button" class="text-primary hover:underline" :disabled="isLoading">
                  Privacy Policy
                </button>
              </label>
            </div>
            <Button
              type="submit"
              class="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              :disabled="isLoading"
            >
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
</template>

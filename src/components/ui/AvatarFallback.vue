<script setup lang="ts">
import { useAttrs } from 'vue';
import { AvatarFallback } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <AvatarFallback
    :class="
      cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted',
        attrs.class as string
      )
    "
  >
    <slot />
  </AvatarFallback>
</template>

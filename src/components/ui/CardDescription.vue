<script setup lang="ts">
import { useAttrs } from 'vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', attrs.class as string)">
    <slot />
  </p>
</template>

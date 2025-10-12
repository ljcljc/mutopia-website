<script setup lang="ts">
import { useAttrs } from 'vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <h3 :class="cn('text-2xl font-semibold leading-none tracking-tight', attrs.class as string)">
    <slot />
  </h3>
</template>

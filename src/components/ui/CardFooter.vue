<script setup lang="ts">
import { useAttrs } from 'vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <div :class="cn('flex items-center p-6 pt-0', attrs.class as string)">
    <slot />
  </div>
</template>

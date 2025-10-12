<script setup lang="ts">
import { useAttrs } from 'vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <div :class="cn('flex flex-col gap-2 text-center sm:text-left', attrs.class as string)">
    <slot />
  </div>
</template>

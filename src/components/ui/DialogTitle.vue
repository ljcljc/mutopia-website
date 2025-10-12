<script setup lang="ts">
import { useAttrs } from 'vue';
import { DialogTitle } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <DialogTitle :class="cn('text-lg leading-none font-semibold', attrs.class as string)">
    <slot />
  </DialogTitle>
</template>

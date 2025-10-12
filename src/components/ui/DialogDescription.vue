<script setup lang="ts">
import { useAttrs } from 'vue';
import { DialogDescription } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <DialogDescription :class="cn('text-muted-foreground text-sm', attrs.class as string)">
    <slot />
  </DialogDescription>
</template>

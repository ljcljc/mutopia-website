<script setup lang="ts">
import { useAttrs } from 'vue';
import { AvatarRoot } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <AvatarRoot
    :class="
      cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', attrs.class as string)
    "
  >
    <slot />
  </AvatarRoot>
</template>

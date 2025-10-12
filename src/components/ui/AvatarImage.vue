<script setup lang="ts">
import { useAttrs } from 'vue';
import { AvatarImage } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();

interface Props {
  src?: string;
  alt?: string;
}

defineProps<Props>();
</script>

<template>
  <AvatarImage
    :src="src"
    :alt="alt"
    :class="cn('aspect-square h-full w-full', attrs.class as string)"
  />
</template>

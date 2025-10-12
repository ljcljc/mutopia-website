<script setup lang="ts">
import { useAttrs } from 'vue';
import { Separator } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();

interface Props {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true,
});
</script>

<template>
  <Separator
    :orientation="orientation"
    :decorative="decorative"
    :class="
      cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        attrs.class as string
      )
    "
  />
</template>

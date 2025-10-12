<script setup lang="ts">
import { useAttrs } from 'vue';
import { Label as LabelPrimitive } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <LabelPrimitive
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        attrs.class as string
      )
    "
  >
    <slot />
  </LabelPrimitive>
</template>

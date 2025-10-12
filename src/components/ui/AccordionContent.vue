<script setup lang="ts">
import { useAttrs } from 'vue';
import { AccordionContent } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <AccordionContent
    class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
  >
    <div :class="cn('pt-0 pb-4', attrs.class as string)">
      <slot />
    </div>
  </AccordionContent>
</template>

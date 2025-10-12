<script setup lang="ts">
import { useAttrs } from 'vue';
import { AccordionHeader, AccordionTrigger } from 'radix-vue';
import { ChevronDown } from 'lucide-vue-next';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      :class="
        cn(
          'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
          attrs.class as string
        )
      "
    >
      <slot />
      <ChevronDown
        class="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"
      />
    </AccordionTrigger>
  </AccordionHeader>
</template>

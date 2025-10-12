<script setup lang="ts">
import { useAttrs } from 'vue';
import { AccordionItem } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();

interface Props {
  value: string;
  disabled?: boolean;
}

defineProps<Props>();
</script>

<template>
  <AccordionItem
    v-bind="attrs"
    :value="value"
    :disabled="disabled"
    :class="cn('border-b last:border-b-0', attrs.class as string)"
  >
    <slot />
  </AccordionItem>
</template>

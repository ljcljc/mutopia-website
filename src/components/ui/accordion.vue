<script setup lang="ts">
import { useAttrs } from 'vue';
import { AccordionRoot } from 'radix-vue';

const attrs = useAttrs();

interface Props {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  modelValue?: string | string[];
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string | string[]];
}>();
</script>

<template>
  <AccordionRoot
    v-bind="attrs"
    :type="type"
    :collapsible="collapsible"
    :default-value="defaultValue"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </AccordionRoot>
</template>

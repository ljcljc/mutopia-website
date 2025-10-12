<script setup lang="ts">
import { useAttrs } from 'vue';
import { TabsRoot } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();

interface Props {
  defaultValue?: string;
  modelValue?: string;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  activationMode?: 'automatic' | 'manual';
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
    :model-value="modelValue"
    :orientation="orientation"
    :dir="dir"
    :activation-mode="activationMode"
    :class="cn('flex flex-col gap-2', attrs.class as string)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>

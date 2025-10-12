<script setup lang="ts">
import { useAttrs } from 'vue';
import { TabsContent } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();

interface Props {
  value: string;
}

defineProps<Props>();
</script>

<template>
  <TabsContent :value="value" :class="cn('flex-1 outline-none', attrs.class as string)">
    <slot />
  </TabsContent>
</template>

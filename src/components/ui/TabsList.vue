<script setup lang="ts">
import { useAttrs } from 'vue';
import { TabsList } from 'radix-vue';
import { cn } from './utils';

const attrs = useAttrs();
</script>

<template>
  <TabsList
    :class="
      cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex',
        attrs.class as string
      )
    "
  >
    <slot />
  </TabsList>
</template>

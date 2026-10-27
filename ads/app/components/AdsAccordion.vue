<script setup lang="ts">
// Progressive disclosure on <details>, so it works before JS arrives and is
// announced correctly without a single ARIA attribute.
export type AccordionItem = { title: string; body: string }

defineProps<{ items: AccordionItem[] }>()
</script>

<template>
  <div class="ads-accordion">
    <details v-for="(item, i) in items" :key="i" :open="i === 0 ? true : undefined">
      <summary>{{ item.title }}</summary>
      <div class="panel">{{ item.body }}</div>
    </details>
  </div>
</template>

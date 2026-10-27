<script setup lang="ts">
// A bare spinner, for an inline wait of unknown shape — next to the thing that
// is loading, never over the page. Where the shape is known, use a skeleton.
// The global rule stops it turning for readers who asked for less motion.
withDefaults(defineProps<{ size?: number; label?: string }>(), { size: 18, label: 'Loading' })
</script>

<template>
  <span class="ads-spinner" :style="{ width: `${size}px`, height: `${size}px` }" role="status" :aria-label="label" />
</template>

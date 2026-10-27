<script setup lang="ts">
// A placeholder that holds the layout at the real content's dimensions, so
// nothing shifts when the data lands. A spinner over the page throws away a
// layout the reader had already started reading.
withDefaults(defineProps<{ width?: string; height?: string; pill?: boolean }>(), { width: '100%', height: '1em', pill: false })
</script>

<template>
  <div class="ads-skeleton" :class="{ 'round-pill': pill }" :style="{ width, height }" aria-hidden="true" />
</template>

<script setup lang="ts">
// A box that holds its proportions while its width changes, so an image or a
// chart reserves its space before it loads and nothing below it jumps. It is a
// well: content sits pressed into the card, never on the canvas.
withDefaults(defineProps<{ ratio?: string }>(), { ratio: '16 / 9' })
</script>

<template>
  <div class="ads-aspect-ratio" :style="{ aspectRatio: ratio }"><slot /></div>
</template>

<style scoped>
.ads-aspect-ratio {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}
</style>

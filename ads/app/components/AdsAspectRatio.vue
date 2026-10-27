<script setup lang="ts">
// A container with a fixed aspect ratio.
withDefaults(defineProps<{ ratio?: string }>(), { ratio: '16 / 9' })
</script>

<template>
  <div class="aspect" :style="{ aspectRatio: ratio }"><slot /></div>
</template>

<style scoped>
.aspect {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}
</style>

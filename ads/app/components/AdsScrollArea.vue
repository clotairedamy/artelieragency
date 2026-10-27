<script setup lang="ts">
// A scrollable area with a soft, slim scrollbar.
defineProps<{ height?: string }>()
</script>

<template>
  <div class="scroll-area" :style="{ height }"><slot /></div>
</template>

<style scoped>
.scroll-area {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--subdued) transparent;
  border-radius: var(--radius-sm);
}

.scroll-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scroll-area::-webkit-scrollbar-thumb {
  border-radius: var(--pill);
  background: var(--subdued);
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
</style>

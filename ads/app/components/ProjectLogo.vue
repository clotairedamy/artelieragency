<script setup lang="ts">
// A client's word on a small inset tile, always in the ink.
withDefaults(defineProps<{ word?: string; size?: number }>(), { word: 'A', size: 76 })
</script>

<template>
  <span class="pl" :style="{ '--s': `${size}px` }">
    <span class="pl-word">{{ word }}</span>
  </span>
</template>

<style scoped>
.pl {
  display: grid;
  place-items: center;
  flex: none;
  width: var(--s);
  height: var(--s);
  border-radius: calc(var(--s) * 0.2);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text);
  overflow: hidden;
}

.pl-word {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: calc(var(--s) * 0.22);
  letter-spacing: -0.01em;
}
</style>

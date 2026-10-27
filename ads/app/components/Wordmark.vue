<script setup lang="ts">
// The wordmark, set small. No mark beside it: the word is the logo.
withDefaults(defineProps<{ size?: number; text?: string }>(), { size: 18, text: 'Artelier' })
</script>

<template>
  <span class="wm" :style="{ fontSize: `${size}px` }">{{ text }}</span>
</template>

<style scoped>
.wm {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text);
  white-space: nowrap;
}
</style>

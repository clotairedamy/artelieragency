<script setup lang="ts">
// The wordmark, set small: the studio's name in the display face, in the ink.
// It stands on its own where the name has to be read; where it sits beside
// BrandMark, the mark is the logo and this only spells it out.
withDefaults(defineProps<{ size?: number; text?: string }>(), { size: 18, text: 'Artelier' })
</script>

<template>
  <span class="ads-wordmark" :style="{ fontSize: `${size}px` }">{{ text }}</span>
</template>

<style scoped>
.ads-wordmark {
  display: inline-block;
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1;
  color: var(--text);
  white-space: nowrap;
}
</style>

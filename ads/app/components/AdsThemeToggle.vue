<script setup lang="ts">
// Light/dark switch. The two halves of the glyph are drawn in utils/glyphs.ts.
const { theme, toggle } = useTheme()

function onClick(e: MouseEvent) {
  toggle({ x: e.clientX, y: e.clientY })
}
</script>

<template>
  <button type="button" class="ads-icon-button is-round" :aria-label="theme === 'dark' ? 'Switch to light' : 'Switch to dark'" @click="onClick">
    <Icon name="theme" :size="17" />
  </button>
</template>

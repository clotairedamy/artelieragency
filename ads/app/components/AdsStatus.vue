<script setup lang="ts">
// Severity in a monochrome system is luminance: the worse it is, the brighter
// it is. The glyph (dot) carries it too, so the rank survives a greyscale
// print and a colour-vision deficiency alike.
withDefaults(defineProps<{ label: string; grade?: 1 | 2 | 3 | 4 }>(), { grade: 1 })
</script>

<template>
  <span class="ads-status" :class="`g${grade}`">
    <span class="ads-dot" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
// A directional hint — an arrow rotated toward `to`.
withDefaults(defineProps<{ to?: 'up' | 'down' | 'left' | 'right' }>(), { to: 'right' })
</script>

<template>
  <span class="direction" :class="to"><Icon name="arrow" :size="15" /></span>
</template>

<style scoped>
.direction {
  display: inline-grid;
  place-items: center;
  color: var(--subdued);
}

.direction.right :deep(svg) { rotate: 0deg; }
.direction.down :deep(svg) { rotate: 90deg; }
.direction.left :deep(svg) { rotate: 180deg; }
.direction.up :deep(svg) { rotate: -90deg; }
</style>

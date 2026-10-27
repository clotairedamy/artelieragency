<script setup lang="ts">
// A directional hint — an arrow rotated toward `to`. Decorative by default,
// since it usually sits beside words that already say where; give it a
// `label` when the arrow is the only thing carrying the meaning.
withDefaults(defineProps<{ to?: 'up' | 'down' | 'left' | 'right'; label?: string }>(), { to: 'right', label: '' })
</script>

<template>
  <span
    class="ads-direction"
    :class="`is-${to}`"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  ><Icon name="arrow" :size="15" /></span>
</template>

<style scoped>
.ads-direction {
  display: inline-grid;
  place-items: center;
  color: var(--subdued);
}

.ads-direction.is-right :deep(svg) { rotate: 0deg; }
.ads-direction.is-down :deep(svg) { rotate: 90deg; }
.ads-direction.is-left :deep(svg) { rotate: 180deg; }
.ads-direction.is-up :deep(svg) { rotate: -90deg; }
</style>

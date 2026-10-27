<script setup lang="ts">
// A status marker: a dot (optionally labelled), coloured by role.
withDefaults(defineProps<{ color?: string; label?: string }>(), { color: 'var(--ok)', label: '' })
</script>

<template>
  <span class="marker">
    <span class="marker-dot" :style="{ background: color }" aria-hidden="true" />
    <span v-if="label" class="marker-label">{{ label }}</span>
    <slot />
  </span>
</template>

<style scoped>
.marker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-soft);
}

.marker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex: none;
}

.marker-label {
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>

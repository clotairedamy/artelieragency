<script setup lang="ts">
// A single collapsible — native details/summary, so it works before JS.
withDefaults(defineProps<{ title: string; open?: boolean }>(), { open: false })
</script>

<template>
  <details class="ads-collapsible" :open="open ? true : undefined">
    <summary>{{ title }}</summary>
    <div class="panel"><slot /></div>
  </details>
</template>

<style scoped>
.ads-collapsible {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.ads-collapsible summary {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 13px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-soft);
  list-style: none;
  transition: color 0.2s var(--ease);
}

.ads-collapsible summary::-webkit-details-marker {
  display: none;
}

.ads-collapsible summary:hover {
  color: var(--text);
}

.ads-collapsible summary::before {
  content: '';
  width: 7px;
  height: 7px;
  flex: none;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 0.25s var(--ease);
}

.ads-collapsible[open] > summary::before {
  transform: rotate(45deg);
}

.ads-collapsible .panel {
  padding: 0 16px 15px 34px;
  font-size: 0.86rem;
  color: var(--subdued);
}
</style>

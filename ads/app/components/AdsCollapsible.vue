<script setup lang="ts">
// A single collapsible — native details/summary, so it works before JS and the
// browser does the keyboard and the aria-expanded for us. For the reasoning
// most readers skip and some want; never for something every reader needs.
// `v-model:open` follows the reader's clicks.
const open = defineModel<boolean>('open', { default: false })
defineProps<{ title: string }>()

function onToggle(e: Event) {
  open.value = (e.target as HTMLDetailsElement).open
}
</script>

<template>
  <details class="ads-collapsible" :open="open || undefined" @toggle="onToggle">
    <summary class="ads-collapsible__summary">{{ title }}</summary>
    <div class="ads-collapsible__panel"><slot /></div>
  </details>
</template>

<style scoped>
.ads-collapsible {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.ads-collapsible__summary {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3) var(--sp-4);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-soft);
  list-style: none;
  transition: color var(--dur-control) var(--ease);
}

.ads-collapsible__summary::-webkit-details-marker {
  display: none;
}

.ads-collapsible__summary:hover {
  color: var(--accent);
}

/* The chevron: two strokes of currentColor, so it brightens with the text. */
.ads-collapsible__summary::before {
  content: '';
  width: 7px;
  height: 7px;
  flex: none;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(-45deg);
  transition: transform var(--dur-control) var(--ease);
}

.ads-collapsible[open] > .ads-collapsible__summary::before {
  transform: rotate(45deg);
}

.ads-collapsible__panel {
  padding: 0 var(--sp-4) var(--sp-4) 34px;
  font-size: 0.86rem;
  color: var(--subdued);
}
</style>

<script setup lang="ts">
// A chat bubble. Theirs is a well; `mine` stands proud of the page instead —
// depth and alignment tell the two voices apart. Not the accent: a thread
// would spend it on every other line, and the accent is for the one thing to
// click.
withDefaults(defineProps<{ mine?: boolean }>(), { mine: false })
</script>

<template>
  <div class="ads-bubble" :class="{ 'is-mine': mine }"><slot /></div>
</template>

<style scoped>
.ads-bubble {
  width: fit-content;
  max-width: 72ch;
  padding: var(--sp-2) var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  font-size: 0.9rem;
  color: var(--text-soft);
}

.ads-bubble.is-mine {
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text);
}
</style>

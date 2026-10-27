<script setup lang="ts">
// A chat bubble. `mine` puts it on the accent.
withDefaults(defineProps<{ mine?: boolean }>(), { mine: false })
</script>

<template>
  <div class="bubble" :class="{ mine }"><slot /></div>
</template>

<style scoped>
.bubble {
  padding: 10px 15px;
  border-radius: 16px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  max-width: 72ch;
  font-size: 0.9rem;
  color: var(--text-soft);
  width: fit-content;
}

.bubble.mine {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: var(--soft-raised-sm);
}
</style>

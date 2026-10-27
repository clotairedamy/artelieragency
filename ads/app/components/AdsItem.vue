<script setup lang="ts">
// A list item: an optional glyph, then the body. It only answers the pointer
// when it goes somewhere — give it `to` and it becomes a real link that
// brightens on hover; without one it is plain text, because a row that lights
// up and does nothing is a promise the interface breaks. Rows in a list are
// separated by the parent, with a hairline, not by a box around each.
defineProps<{ icon?: string; iconSize?: number; to?: string }>()
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="ads-item is-link">
    <Icon v-if="icon" :name="icon" :size="iconSize ?? 18" class="ads-item__icon" />
    <span class="ads-item__body"><slot /></span>
  </NuxtLink>
  <div v-else class="ads-item">
    <Icon v-if="icon" :name="icon" :size="iconSize ?? 18" class="ads-item__icon" />
    <span class="ads-item__body"><slot /></span>
  </div>
</template>

<style scoped>
.ads-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-item.is-link:hover {
  color: var(--accent);
}

.ads-item.is-link:hover .ads-item__icon {
  color: var(--accent);
}

.ads-item.is-link:active {
  box-shadow: var(--soft-inset-sm);
}

.ads-item__icon {
  flex: none;
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease);
}

.ads-item__body {
  min-width: 0;
}
</style>

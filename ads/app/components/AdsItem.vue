<script setup lang="ts">
// A list item: an optional glyph, then the body.
defineProps<{ icon?: string; iconSize?: number }>()
</script>

<template>
  <div class="item">
    <Icon v-if="icon" :name="icon" :size="iconSize ?? 18" class="item-icon" />
    <span class="item-body"><slot /></span>
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  transition: background 0.2s var(--ease), color 0.2s var(--ease);
}

.item:hover {
  background: var(--hover);
  color: var(--text);
}

.item-icon {
  flex: none;
  color: var(--subdued);
}

.item-body {
  min-width: 0;
}
</style>

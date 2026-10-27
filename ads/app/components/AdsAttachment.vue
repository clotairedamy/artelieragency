<script setup lang="ts">
// A file attachment chip: name, size, and a remove affordance.
withDefaults(defineProps<{ name: string; size?: string; removable?: boolean }>(), { size: '', removable: true })
const emit = defineEmits<{ (e: 'remove'): void }>()
</script>

<template>
  <span class="attachment">
    <span class="att-icon"><Icon name="code" :size="15" /></span>
    <span class="att-text">
      <span class="att-name">{{ name }}</span>
      <span v-if="size" class="att-size num">{{ size }}</span>
    </span>
    <button v-if="removable" type="button" class="att-remove" aria-label="Remove" @click="emit('remove')">×</button>
  </span>
</template>

<style scoped>
.attachment {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.att-icon {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 9px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--subdued);
}

.att-text {
  display: grid;
  gap: 1px;
}

.att-name {
  font-size: 0.85rem;
  color: var(--text);
}

.att-size {
  font-size: 0.7rem;
  color: var(--subdued);
}

.att-remove {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: var(--subdued);
  transition: color 0.2s var(--ease);
}

.att-remove:hover {
  color: var(--text);
}
</style>

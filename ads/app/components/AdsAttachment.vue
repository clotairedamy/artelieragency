<script setup lang="ts">
// A file attachment chip: the type, the name, the size, and a way to take it
// off again. The type is the file's own extension in the data face rather than
// a generic glyph — it is the one fact about the file a reader scans for. The
// size is a figure, so it is monospaced; pass it with its unit ("1.2 MB").
const props = withDefaults(defineProps<{ name: string; size?: string; removable?: boolean }>(), {
  size: '',
  removable: true,
})
const emit = defineEmits<{ (e: 'remove'): void }>()

const ext = computed(() => {
  const dot = props.name.lastIndexOf('.')
  return dot > 0 ? props.name.slice(dot + 1, dot + 5).toUpperCase() : 'FILE'
})
</script>

<template>
  <span class="ads-attachment">
    <span class="ads-attachment__type" aria-hidden="true">{{ ext }}</span>
    <span class="ads-attachment__text">
      <span class="ads-attachment__name">{{ name }}</span>
      <span v-if="size" class="ads-attachment__size num">{{ size }}</span>
    </span>
    <button
      v-if="removable"
      type="button"
      class="ads-attachment__remove"
      :aria-label="`Remove ${name}`"
      @click="emit('remove')"
    >
      <Icon name="plus" :size="14" style="rotate: 45deg" />
    </button>
  </span>
</template>

<style scoped>
.ads-attachment {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.ads-attachment__type {
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 30px;
  padding: 0 var(--sp-1);
  flex: none;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  font-family: var(--mono);
  font-size: 0.6rem;
  letter-spacing: 0.04em;
  color: var(--subdued);
}

.ads-attachment__text {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.ads-attachment__name {
  font-size: 0.85rem;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ads-attachment__size {
  font-size: 0.7rem;
  color: var(--subdued);
}

.ads-attachment__remove {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  color: var(--subdued);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-attachment__remove:hover {
  color: var(--accent);
}

.ads-attachment__remove:active {
  box-shadow: var(--soft-inset-sm);
}
</style>

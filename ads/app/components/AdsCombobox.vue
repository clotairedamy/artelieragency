<script setup lang="ts">
// A combobox: a text field that filters a list as you type.
const props = withDefaults(
  defineProps<{ options?: { label: string; value: string | number }[]; modelValue?: string | number; placeholder?: string }>(),
  { options: () => [], modelValue: '', placeholder: 'Search…' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
const query = ref('')
const open = ref(false)

const filtered = computed(() =>
  props.options.filter((o) => o.label.toLowerCase().includes(query.value.toLowerCase())),
)
</script>

<template>
  <div class="combo">
    <input
      v-model="query"
      class="combo-input"
      type="text"
      :placeholder="placeholder"
      @focus="open = true"
      @blur="open = false"
    >
    <div v-if="open && filtered.length" class="combo-menu">
      <button
        v-for="o in filtered"
        :key="o.value"
        type="button"
        class="opt"
        @mousedown.prevent="emit('update:modelValue', o.value); query = o.label; open = false"
      >{{ o.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.combo {
  position: relative;
}

.combo-input {
  width: 100%;
  height: 42px;
  padding: 0 14px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text);
  font-size: 0.92rem;
}

.combo-input:focus {
  box-shadow: var(--soft-inset-sm), 0 0 0 2px var(--accent);
}

.combo-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
  max-height: 240px;
  overflow-y: auto;
}

.opt {
  text-align: left;
  padding: 9px 12px;
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.9rem;
}

.opt:hover {
  background: var(--hover);
  color: var(--text);
}
</style>

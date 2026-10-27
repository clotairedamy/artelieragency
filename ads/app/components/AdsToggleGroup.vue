<script setup lang="ts">
// A row of toggle buttons where several can be on at once (bold and italic).
// Not a segmented control: that is one choice of two to five, and fills the
// chosen one with the accent. Here every pressed button stays pressed into the
// page, as AdsToggle does, so three active toggles do not spend the accent
// three times. `label` names the group.
export type ToggleOption = { label: string; value: string | number }

const props = withDefaults(defineProps<{ modelValue?: (string | number)[]; options: ToggleOption[]; label: string }>(), {
  modelValue: () => [],
})
const emit = defineEmits<{ (e: 'update:modelValue', v: (string | number)[]): void }>()

function toggle(v: string | number) {
  const cur = props.modelValue
  emit('update:modelValue', cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v])
}
</script>

<template>
  <div class="ads-toggle-group" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="ads-toggle-group__button"
      :class="{ 'is-on': modelValue.includes(o.value) }"
      :aria-pressed="modelValue.includes(o.value)"
      @click="toggle(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.ads-toggle-group {
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--sp-1);
}

.ads-toggle-group__button {
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  font-size: 0.83rem;
  color: var(--text-soft);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  white-space: nowrap;
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-toggle-group__button:hover {
  color: var(--accent);
}

.ads-toggle-group__button.is-on {
  color: var(--accent);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}
</style>

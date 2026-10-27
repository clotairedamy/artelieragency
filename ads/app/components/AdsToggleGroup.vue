<script setup lang="ts">
// A button group: a set of toggle buttons in one pressed track. Multiple can
// be active at once.
export type ToggleOption = { label: string; value: string | number }

withDefaults(
  defineProps<{ modelValue?: (string | number)[]; options: ToggleOption[] }>(),
  { modelValue: () => [] },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: (string | number)[]): void }>()

function toggle(v: string | number) {
  const next = modelValue.includes(v) ? modelValue.filter((x) => x !== v) : [...modelValue, v]
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="ads-segmented" role="group">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      :class="{ 'is-on': modelValue.includes(o.value) }"
      :aria-pressed="modelValue.includes(o.value)"
      @click="toggle(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

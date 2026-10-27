<script setup lang="ts">
// A segmented control: two to five mutually exclusive views, all visible at
// once, in a single pressed track. More than five, or labels that wrap, is a
// select. The group needs a name because the options alone ("7d", "30d") do
// not say what they choose between.
export type SegOption = { label: string; value: string | number }

const props = withDefaults(defineProps<{ modelValue?: string | number; options: SegOption[]; label: string }>(), {
  modelValue: undefined,
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

if (import.meta.dev && (props.options.length < 2 || props.options.length > 5)) {
  console.warn(`[AdsSegmented] "${props.label}" has ${props.options.length} options; a segmented control holds 2–5. Use a select.`)
}
</script>

<template>
  <div class="ads-segmented" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      :aria-pressed="props.modelValue === o.value"
      :class="{ 'is-on': props.modelValue === o.value }"
      @click="emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

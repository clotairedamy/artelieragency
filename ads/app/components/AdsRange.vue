<script setup lang="ts">
// A slider, pressed into the page, with an accent thumb.
withDefaults(
  defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label?: string }>(),
  { modelValue: 0, min: 0, max: 100, step: 1, label: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const uid = useId()
</script>

<template>
  <div class="stack gap-2">
    <label v-if="label" :for="uid" class="range-label">{{ label }}</label>
    <input
      :id="uid"
      type="range"
      class="ads-range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
  </div>
</template>

<style scoped>
.range-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}
</style>

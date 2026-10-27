<script setup lang="ts">
// A slider, pressed into the page, with an accent thumb. For a value where
// the approximate position matters more than the exact figure — but the
// figure is shown anyway, always, in the data face beside the label, because
// somebody always needs it. The label is required and visible; it carries
// the unit so the readout holds only the number.
withDefaults(
  defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label: string }>(),
  { modelValue: 0, min: 0, max: 100, step: 1 },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const uid = useId()
</script>

<template>
  <div class="ads-field-group">
    <div class="ads-range__head">
      <label :for="uid" class="ads-label">{{ label }}</label>
      <output :for="uid" class="num ads-range__value">{{ modelValue }}</output>
    </div>
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
.ads-range__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.ads-range__value {
  font-size: 0.82rem;
  color: var(--text);
}
</style>

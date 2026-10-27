<script setup lang="ts">
// A quantity against a threshold. Distinct from progress, which is a task
// moving toward completion. The threshold is required: it draws the mark the
// reader needs to know whether the fill is good news, and a meter without one
// is decoration. The label is required too — it is the meter's name, for the
// eye and for a screen reader alike.
const props = withDefaults(
  defineProps<{ value: number; max?: number; threshold: number; label: string; unit?: string }>(),
  { max: 100, unit: '' },
)

const at = (n: number) => `${Math.max(0, Math.min(100, (n / props.max) * 100))}%`
const valueText = computed(
  () => `${props.value}${props.unit} of ${props.max}${props.unit}, threshold ${props.threshold}${props.unit}`,
)
</script>

<template>
  <div class="ads-meter__wrap">
    <span class="ads-meter__head">
      <span class="ads-meter__label">{{ label }}</span>
      <span class="num ads-meter__value">{{ value }}{{ unit }}</span>
    </span>
    <div
      class="ads-meter"
      role="meter"
      :aria-label="label"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
      :aria-valuetext="valueText"
    >
      <i :style="{ width: at(value) }" />
      <b :style="{ left: at(threshold) }" />
    </div>
  </div>
</template>

<style scoped>
.ads-meter__wrap {
  display: grid;
  gap: var(--sp-2);
}

.ads-meter__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.ads-meter__label {
  font-size: 0.76rem;
  color: var(--subdued);
}

.ads-meter__value {
  font-size: 0.76rem;
  color: var(--text-soft);
}
</style>

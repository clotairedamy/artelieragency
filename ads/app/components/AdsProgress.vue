<script setup lang="ts">
// A task moving toward completion. Distinct from a meter, which is a quantity
// against a threshold — so there is no threshold here, only an end. The label
// names the task ("Crawling"); a progress bar with no name is a bar a screen
// reader can only call "progress".
const props = withDefaults(defineProps<{ value: number; max?: number; label: string }>(), { max: 100 })

const percent = computed(() => Math.round(Math.max(0, Math.min(100, (props.value / props.max) * 100))))
</script>

<template>
  <div class="ads-progress__wrap">
    <span class="ads-progress__head">
      <span class="ads-progress__label">{{ label }}</span>
      <span class="num ads-progress__value">{{ percent }}%</span>
    </span>
    <div
      class="ads-progress"
      role="progressbar"
      :aria-label="label"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
    >
      <i :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>

<style scoped>
.ads-progress__wrap {
  display: grid;
  gap: var(--sp-2);
}

.ads-progress__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.ads-progress__label {
  font-size: 0.76rem;
  color: var(--subdued);
}

.ads-progress__value {
  font-size: 0.76rem;
  color: var(--text-soft);
}
</style>

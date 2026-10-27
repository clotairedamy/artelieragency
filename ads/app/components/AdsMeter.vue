<script setup lang="ts">
// A quantity against a threshold. Distinct from progress, which is a task
// moving toward completion. `threshold` draws the mark the reader needs to
// know whether the fill is good news.
withDefaults(defineProps<{ value: number; max?: number; threshold?: number; label?: string }>(), { max: 100, threshold: undefined, label: '' })
</script>

<template>
  <div class="stack gap-2">
    <span v-if="label" class="meter-label">{{ label }}</span>
    <div class="ads-meter" role="meter" :aria-valuenow="value" :aria-valuemin="0" :aria-valuemax="max">
      <i :style="{ width: `${Math.min(100, (value / max) * 100)}%` }" />
      <b v-if="threshold !== undefined" :style="{ left: `${(threshold / max) * 100}%` }" />
    </div>
  </div>
</template>

<style scoped>
.meter-label {
  font-size: 0.76rem;
  color: var(--subdued);
}
</style>

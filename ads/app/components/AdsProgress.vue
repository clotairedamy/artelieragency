<script setup lang="ts">
// A task moving toward completion. Distinct from a meter, which is a quantity
// against a threshold.
withDefaults(defineProps<{ value: number; max?: number }>(), { max: 100 })
</script>

<template>
  <div class="ads-progress" role="progressbar" :aria-valuenow="value" :aria-valuemin="0" :aria-valuemax="max">
    <i :style="{ width: `${Math.min(100, (value / max) * 100)}%` }" />
  </div>
</template>

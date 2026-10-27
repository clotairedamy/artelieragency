<script setup lang="ts">
// The most-used control on any dashboard. ISO dates in the data face so
// ranges sort and compare visually, presets beside them because most readers
// want "last 30 days", not a calendar.
withDefaults(
  defineProps<{
    from?: string
    to?: string
    presets?: string[]
    modelValue?: string
  }>(),
  { from: '2026-09-25', to: '2026-10-25', presets: () => ['7d', '30d', '90d', 'Custom'], modelValue: '30d' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="stack gap-2">
    <div class="ads-daterange">
      <Icon name="compass" :size="15" />
      <span class="num">{{ from }}</span>
      <span class="sep">→</span>
      <span class="num">{{ to }}</span>
    </div>
    <div v-if="presets?.length" class="ads-segmented" role="group" aria-label="Range">
      <button
        v-for="p in presets"
        :key="p"
        type="button"
        :class="{ 'is-on': modelValue === p }"
        :aria-pressed="modelValue === p"
        @click="emit('update:modelValue', p)"
      >{{ p }}</button>
    </div>
  </div>
</template>

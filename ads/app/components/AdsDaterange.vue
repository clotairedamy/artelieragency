<script setup lang="ts">
// The most-used control on any dashboard. ISO dates in the data face so
// ranges sort and compare visually, presets beside them because most readers
// want "last 30 days", not a calendar. The whole control is one named group,
// so a screen reader hears what the dates and presets belong to.
withDefaults(
  defineProps<{
    from?: string
    to?: string
    presets?: string[]
    modelValue?: string
    label?: string
  }>(),
  { from: '2026-09-25', to: '2026-10-25', presets: () => ['7d', '30d', '90d', 'Custom'], modelValue: '30d', label: 'Date range' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="stack gap-2" role="group" :aria-label="label">
    <div class="ads-daterange">
      <Icon name="compass" :size="15" />
      <time class="num" :datetime="from">{{ from }}</time>
      <span class="sep" aria-hidden="true">→</span>
      <span class="sr-only">to</span>
      <time class="num" :datetime="to">{{ to }}</time>
    </div>
    <div v-if="presets?.length" class="ads-segmented" role="group" aria-label="Presets">
      <button
        v-for="p in presets"
        :key="p"
        type="button"
        class="num"
        :class="{ 'is-on': modelValue === p }"
        :aria-pressed="modelValue === p"
        @click="emit('update:modelValue', p)"
      >{{ p }}</button>
    </div>
  </div>
</template>

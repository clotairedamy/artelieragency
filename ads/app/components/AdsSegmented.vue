<script setup lang="ts">
// A segmented control: mutually-exclusive options in a single pressed track.
export type SegOption = { label: string; value: string | number }

const props = withDefaults(defineProps<{ modelValue?: string | number; options: SegOption[] }>(), { modelValue: undefined })
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
</script>

<template>
  <div class="ads-segmented" role="radiogroup">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      role="radio"
      :aria-checked="props.modelValue === o.value"
      :class="{ 'is-on': props.modelValue === o.value }"
      @click="emit('update:modelValue', o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

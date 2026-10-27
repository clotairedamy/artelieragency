<script setup lang="ts">
// A native select, styled as a well (same shape as a field).
withDefaults(defineProps<{ modelValue?: string | number; options?: { label: string; value: string | number }[]; placeholder?: string; ariaLabel?: string }>(), {
  modelValue: '',
  options: () => [],
  placeholder: 'Choose…',
  ariaLabel: undefined,
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
</script>

<template>
  <select
    class="ads-field select"
    :aria-label="ariaLabel"
    :value="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
  </select>
</template>

<script setup lang="ts">
// Tabs: a hairline with the active tab underlined by the accent.
export type Tab = { label: string; value: string | number }

const props = withDefaults(defineProps<{ modelValue?: string | number; tabs: Tab[] }>(), { modelValue: undefined })
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
</script>

<template>
  <div class="ads-tabs" role="tablist">
    <button
      v-for="t in tabs"
      :key="t.value"
      type="button"
      role="tab"
      :aria-selected="props.modelValue === t.value"
      :class="{ 'is-on': props.modelValue === t.value }"
      @click="emit('update:modelValue', t.value)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

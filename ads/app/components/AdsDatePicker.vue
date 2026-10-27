<script setup lang="ts">
// A date picker: a single date well, with quick presets.
withDefaults(
  defineProps<{ modelValue?: string; label?: string; presets?: string[] }>(),
  { modelValue: '', label: '', presets: () => ['Today', '7d', '30d'] },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const uid = useId()
</script>

<template>
  <div class="stack gap-2">
    <label v-if="label" :for="uid" class="field-label">{{ label }}</label>
    <div class="date">
      <Icon name="compass" :size="15" />
      <input
        :id="uid"
        type="date"
        class="date-input"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div v-if="presets.length" class="ads-segmented" role="group">
      <button
        v-for="p in presets"
        :key="p"
        type="button"
        :class="{ 'is-on': modelValue === p }"
        @click="emit('update:modelValue', p)"
      >{{ p }}</button>
    </div>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}

.date {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 14px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  color: var(--subdued);
}

.date-input {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.9rem;
}

.date-input:focus {
  outline: none;
}
</style>

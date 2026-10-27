<script setup lang="ts">
// Checkbox, radio or switch. A switch is for a setting that takes effect
// immediately; a checkbox is for a value that is submitted.
withDefaults(
  defineProps<{
    kind?: 'checkbox' | 'radio' | 'switch'
    label: string
    modelValue?: boolean
    name?: string
    value?: string | number
    disabled?: boolean
  }>(),
  { kind: 'checkbox', modelValue: false, name: undefined, value: undefined, disabled: false },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const uid = useId()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}
</script>

<template>
  <label class="ads-choice" :class="{ 'is-disabled': disabled }">
    <input
      :type="kind === 'radio' ? 'radio' : 'checkbox'"
      :id="uid"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span v-if="kind !== 'switch'" class="ads-box" :class="{ 'is-round': kind === 'radio' }">
      <svg v-if="kind === 'checkbox'" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" /></svg>
      <span v-else class="radio-dot" />
    </span>
    <span v-else class="ads-switch" />
    <span class="choice-label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.choice-label {
  color: var(--text-soft);
}

.radio-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
</style>

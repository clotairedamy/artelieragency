<script setup lang="ts">
// A stepper: a figure with up/down buttons, right-aligned in the data face so
// it lines up with the values it will be compared against. The label is
// required and visible, and carries the unit — "Max URLs", "Timeout (s)" — so
// the field holds only the figure.
const props = withDefaults(
  defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label: string }>(),
  { modelValue: 0, min: 0, max: Infinity, step: 1 },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const uid = useId()

const clamp = (n: number) => Math.min(Math.max(n, props.min), props.max)

function bump(dir: number) {
  emit('update:modelValue', clamp((props.modelValue ?? 0) + dir * props.step))
}

function onInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value
  // An emptied field is mid-edit, not zero.
  if (raw !== '') emit('update:modelValue', Number(raw))
}
</script>

<template>
  <div class="ads-field-group">
    <label :for="uid" class="ads-label">{{ label }}</label>
    <div class="ads-number">
      <input :id="uid" type="number" :value="modelValue" :min="min" :max="max" :step="step" @input="onInput" />
      <div class="steps">
        <button type="button" :aria-label="`Increase ${label}`" :disabled="modelValue >= max" @click="bump(1)">▲</button>
        <button type="button" :aria-label="`Decrease ${label}`" :disabled="modelValue <= min" @click="bump(-1)">▼</button>
      </div>
    </div>
  </div>
</template>

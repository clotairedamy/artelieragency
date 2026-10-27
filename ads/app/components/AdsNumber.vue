<script setup lang="ts">
// A stepper: an inline number input with up/down buttons.
const props = withDefaults(
  defineProps<{ modelValue?: number; min?: number; max?: number; step?: number; label?: string }>(),
  { modelValue: 0, min: 0, max: Infinity, step: 1, label: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>()
const uid = useId()

function bump(dir: number) {
  const next = Math.min(Math.max((props.modelValue ?? 0) + dir * (props.step ?? 1), props.min ?? 0), props.max ?? Infinity)
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="stack gap-2">
    <label v-if="label" :for="uid" class="num-label">{{ label }}</label>
    <div class="ads-number">
      <input
        :id="uid"
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        @input="emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
      />
      <div class="steps">
        <button type="button" aria-label="Increase" @click="bump(1)">▲</button>
        <button type="button" aria-label="Decrease" @click="bump(-1)">▼</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.num-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}
</style>

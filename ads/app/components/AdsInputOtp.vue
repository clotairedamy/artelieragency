<script setup lang="ts">
// A one-time-password input: a row of single-character boxes.
const props = withDefaults(defineProps<{ length?: number; modelValue?: string }>(), { length: 6, modelValue: '' })
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const boxes = computed(() => Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? ''))

function onInput(i: number, e: Event) {
  const ch = (e.target as HTMLInputElement).value
  const next = props.modelValue.split('')
  next[i] = ch.slice(-1)
  emit('update:modelValue', next.join('').slice(0, props.length))
  if (ch && i < props.length - 1) (e.target as HTMLInputElement).nextElementSibling?.focus?.()
}
</script>

<template>
  <div class="otp" role="group" aria-label="One-time code">
    <input
      v-for="(v, i) in boxes"
      :key="i"
      class="otp-box num"
      inputmode="numeric"
      maxlength="1"
      :value="v"
      :aria-label="`Digit ${i + 1}`"
      @input="onInput(i, $event)"
      @keydown.backspace="!v && i > 0 && ($event.target as HTMLInputElement).previousElementSibling?.focus?.()"
    >
  </div>
</template>

<style scoped>
.otp {
  display: flex;
  gap: 8px;
}

.otp-box {
  width: 44px;
  height: 48px;
  text-align: center;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text);
  font-size: 1.1rem;
}

.otp-box:focus {
  box-shadow: var(--soft-inset-sm), 0 0 0 2px var(--accent);
}
</style>

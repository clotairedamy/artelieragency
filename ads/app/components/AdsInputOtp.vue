<script setup lang="ts">
// A one-time code: a row of single-digit wells, in the data face so the digits
// line up with the code in the message they were copied from. It behaves like
// one field — typing advances, backspace goes back, arrows move, and pasting
// the whole code fills every box. The browser can offer the code from an SMS.
const props = withDefaults(defineProps<{ length?: number; modelValue?: string; label?: string }>(), {
  length: 6,
  modelValue: '',
  label: 'One-time code',
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const uid = useId()
const root = ref<HTMLElement>()
const boxes = computed(() => Array.from({ length: props.length }, (_, i) => props.modelValue[i] ?? ''))

function box(i: number) {
  return root.value?.querySelectorAll<HTMLInputElement>('input')[i]
}

function write(chars: string[]) {
  emit('update:modelValue', chars.join('').slice(0, props.length))
}

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement
  const digits = el.value.replace(/\D/g, '')
  const next = boxes.value.slice()
  if (!digits) {
    next[i] = ''
    el.value = ''
    write(next)
    return
  }
  // More than one digit at once is autofill or a paste: spread it forward.
  for (let k = 0; k < digits.length && i + k < props.length; k++) next[i + k] = digits[k]!
  write(next)
  el.value = next[i]!
  box(Math.min(i + digits.length, props.length - 1))?.focus()
}

function onKeydown(i: number, e: KeyboardEvent) {
  if (e.key === 'Backspace' && !boxes.value[i] && i > 0) {
    e.preventDefault()
    const next = boxes.value.slice()
    next[i - 1] = ''
    write(next)
    box(i - 1)?.focus()
  } else if (e.key === 'ArrowLeft' && i > 0) {
    e.preventDefault()
    box(i - 1)?.focus()
  } else if (e.key === 'ArrowRight' && i < props.length - 1) {
    e.preventDefault()
    box(i + 1)?.focus()
  }
}

function onPaste(i: number, e: ClipboardEvent) {
  const digits = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
  if (!digits) return
  e.preventDefault()
  const next = boxes.value.slice()
  for (let k = 0; k < digits.length && i + k < props.length; k++) next[i + k] = digits[k]!
  write(next)
  box(Math.min(i + digits.length, props.length - 1))?.focus()
}
</script>

<template>
  <div class="ads-input-otp ads-field-group">
    <span :id="`${uid}-label`" class="ads-label">{{ label }}</span>
    <div ref="root" class="ads-input-otp__boxes" role="group" :aria-labelledby="`${uid}-label`">
      <input
        v-for="(v, i) in boxes"
        :key="i"
        class="ads-input-otp__box num"
        inputmode="numeric"
        pattern="[0-9]*"
        :autocomplete="i === 0 ? 'one-time-code' : 'off'"
        :value="v"
        :aria-label="`Digit ${i + 1} of ${length}`"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @paste="onPaste(i, $event)"
        @focus="($event.target as HTMLInputElement).select()"
      >
    </div>
  </div>
</template>

<style scoped>
.ads-input-otp__boxes {
  display: flex;
  gap: var(--sp-2);
}

.ads-input-otp__box {
  width: 44px;
  height: 48px;
  border: 0;
  text-align: center;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text);
  font-size: 1.1rem;
}

.ads-input-otp__box:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>

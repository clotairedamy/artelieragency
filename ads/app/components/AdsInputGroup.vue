<script setup lang="ts">
// A field with a fixed addon either side — a scheme, a domain, a path. The
// addon is part of the well, set in the data face and read out with the field,
// so "https://" is heard as well as seen. Not for units on a figure: those
// belong in the label (AdsNumber), so the digits stay in register.
const props = withDefaults(
  defineProps<{
    label: string
    prefix?: string
    suffix?: string
    placeholder?: string
    hint?: string
    modelValue?: string
    type?: string
    id?: string
  }>(),
  { prefix: '', suffix: '', placeholder: '', hint: '', modelValue: '', type: 'text', id: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const uid = useId()
const fieldId = computed(() => props.id || uid)
const describedBy = computed(
  () =>
    [props.prefix && `${fieldId.value}-pre`, props.suffix && `${fieldId.value}-suf`, props.hint && `${fieldId.value}-hint`]
      .filter(Boolean)
      .join(' ') || undefined,
)
</script>

<template>
  <div class="ads-input-group ads-field-group">
    <label class="ads-label" :for="fieldId">{{ label }}</label>
    <div class="ads-input-group__well">
      <span v-if="prefix" :id="`${fieldId}-pre`" class="ads-input-group__addon">{{ prefix }}</span>
      <input
        :id="fieldId"
        class="ads-input-group__input"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-describedby="describedBy"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <span v-if="suffix" :id="`${fieldId}-suf`" class="ads-input-group__addon">{{ suffix }}</span>
    </div>
    <span v-if="hint" :id="`${fieldId}-hint`" class="ads-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.ads-input-group__well {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  transition: box-shadow var(--dur-control) var(--ease);
}

/* The input inside draws no ring of its own, so the whole well takes it. */
.ads-input-group__well:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.ads-input-group__addon {
  flex: none;
  padding: 0 var(--sp-3);
  font-family: var(--mono);
  font-size: 0.82rem;
  color: var(--subdued);
  white-space: nowrap;
}

.ads-input-group__addon:first-child {
  padding-right: 0;
}

.ads-input-group__addon:last-child {
  padding-left: 0;
}

.ads-input-group__input {
  flex: 1;
  min-width: 0;
  padding: 11px var(--sp-3);
  border: 0;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
}

.ads-input-group__input:focus,
.ads-input-group__input:focus-visible {
  outline: none;
}

.ads-input-group__input::placeholder {
  color: var(--subdued);
}
</style>

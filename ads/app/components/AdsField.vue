<script setup lang="ts">
// A labelled field: input, textarea or select, with hint and error.
// Inputs are wells — the card shape pressed into the page. The label is
// required and always visible: a placeholder disappears exactly when it is
// needed, and fails hardest for screen readers. The error replaces the hint
// rather than sitting beside it, and carries a glyph so it is not read by
// colour alone. Figures — numbers, dates, phone numbers — are set in the data
// face.
export type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'date' | 'textarea' | 'select'

const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: string | number
    type?: FieldType
    id?: string
    name?: string
    placeholder?: string
    hint?: string
    error?: string
    options?: { label: string; value: string | number }[]
    rows?: number
    autocomplete?: string
    required?: boolean
    disabled?: boolean
  }>(),
  { type: 'text', id: '', placeholder: '', hint: '', error: '', rows: 4, autocomplete: undefined, required: false, disabled: false },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
const uid = useId()
const fieldId = computed(() => props.id || uid)
const msgId = computed(() => `${fieldId.value}-msg`)
const describedBy = computed(() => (props.error || props.hint ? msgId.value : undefined))
const numeric = computed(() => ['number', 'date', 'tel'].includes(props.type))
</script>

<template>
  <div class="ads-field-group">
    <label :for="fieldId" class="ads-label">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      :id="fieldId"
      :name="name"
      class="ads-field"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />

    <select
      v-else-if="type === 'select'"
      :id="fieldId"
      :name="name"
      class="ads-field"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>

    <input
      v-else
      :id="fieldId"
      :name="name"
      :type="type"
      class="ads-field ads-field__input"
      :class="{ 'is-invalid': error, 'is-numeric': numeric, 'is-number': type === 'number' }"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="describedBy"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" :id="msgId" class="ads-hint ads-field__error">
      <Icon name="alert" :size="13" class="ads-field__error-glyph" />
      {{ error }}
    </p>
    <p v-else-if="hint" :id="msgId" class="ads-hint ads-field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.ads-field__input.is-numeric {
  font-family: var(--mono);
  font-variant-numeric: tabular-nums;
}

/* A number lines up with the figures it will be compared against. */
.ads-field__input.is-number {
  text-align: right;
}

.ads-field__hint,
.ads-field__error {
  margin: 0;
}

/* The worse it is, the brighter it is: the error reads at full contrast, and
   the glyph carries the state, so it survives without the colour. */
.ads-field__error {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  color: var(--text);
}

.ads-field__error-glyph {
  flex: none;
  color: var(--bad);
}
</style>

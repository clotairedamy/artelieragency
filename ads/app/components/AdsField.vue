<script setup lang="ts">
// A labelled field: input, textarea or select, with hint and error.
// Inputs are wells — the card shape pressed into the page.
export type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'date' | 'textarea' | 'select'

const props = withDefaults(
  defineProps<{
    label?: string
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
</script>

<template>
  <div class="field-group">
    <label v-if="label" :for="fieldId" class="field-label">{{ label }}</label>

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
      class="ads-field"
      :class="{ 'is-invalid': error }"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="field-msg is-error">{{ error }}</p>
    <p v-else-if="hint" class="field-msg">{{ hint }}</p>
  </div>
</template>

<style scoped>
.field-group {
  display: grid;
  gap: 7px;
}

.field-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
}

.field-msg {
  font-size: 0.76rem;
  color: var(--subdued);
  margin: 0;
}

.field-msg.is-error {
  color: var(--bad);
}
</style>

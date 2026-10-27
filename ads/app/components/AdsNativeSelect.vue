<script setup lang="ts">
// The browser's own select, styled as a well (the `.ads-field` shape, chevron
// painted into its background). Reach for it before AdsSelect: it is already
// accessible, keyboard-complete and native on a phone. A visible label always —
// the placeholder option disappears exactly when it is needed.
const props = withDefaults(
  defineProps<{
    label: string
    modelValue?: string | number
    options?: { label: string; value: string | number }[]
    placeholder?: string
    hint?: string
    id?: string
  }>(),
  { modelValue: '', options: () => [], placeholder: 'Choose…', hint: '', id: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
const uid = useId()
const fieldId = computed(() => props.id || uid)
</script>

<template>
  <div class="ads-native-select ads-field-group">
    <label class="ads-label" :for="fieldId">{{ label }}</label>
    <select
      :id="fieldId"
      class="ads-field"
      :value="modelValue"
      :aria-describedby="hint ? `${fieldId}-hint` : undefined"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
    </select>
    <span v-if="hint" :id="`${fieldId}-hint`" class="ads-hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
// Checkbox, radio or switch. A switch is for a setting that takes effect
// immediately; a checkbox is for a value that is submitted — so a switch
// inside a <form> is flagged in development: it belongs outside the form, or
// it should be a checkbox. The label is visible and inside the hit target;
// pass `label`, or the default slot when it needs a link.
const props = withDefaults(
  defineProps<{
    kind?: 'checkbox' | 'radio' | 'switch'
    label?: string
    modelValue?: boolean
    name?: string
    value?: string | number
    disabled?: boolean
  }>(),
  { kind: 'checkbox', label: '', modelValue: false, name: undefined, value: undefined, disabled: false },
)

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const slots = useSlots()
const uid = useId()
const root = ref<HTMLElement>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).checked)
}

if (import.meta.dev) {
  onMounted(() => {
    if (!props.label && !slots.default) console.warn('[AdsChoice] needs a visible label: pass `label` or the default slot.')
    if (props.kind === 'switch' && root.value?.closest('form')) {
      console.warn('[AdsChoice] A switch applies immediately; inside a form with a submit button, use a checkbox.')
    }
  })
}
</script>

<template>
  <label ref="root" class="ads-choice" :class="{ 'is-disabled': disabled }">
    <input
      :id="uid"
      :type="kind === 'radio' ? 'radio' : 'checkbox'"
      :role="kind === 'switch' ? 'switch' : undefined"
      :name="name"
      :value="value"
      :checked="modelValue"
      :disabled="disabled"
      @change="onChange"
    />
    <span v-if="kind !== 'switch'" class="ads-box" :class="{ 'is-round': kind === 'radio' }">
      <svg v-if="kind === 'checkbox'" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" /></svg>
      <span v-else class="ads-choice__dot" />
    </span>
    <span v-else class="ads-switch" />
    <span class="ads-choice__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<style scoped>
.ads-choice__label {
  color: var(--text-soft);
}

.ads-choice__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}
</style>

<script setup lang="ts">
// One date, typed or picked. The field takes ISO (YYYY-MM-DD) in the data
// face, so what you type is what you read back, and it says plainly when a
// date will not parse. The calendar opens from its own labelled button in a
// popover — Escape closes it and focus goes back to the button. Presets are
// offsets from today, so "7 days ago" always means a real date.
export type DatePreset = { label: string; offset: number }
const props = withDefaults(
  defineProps<{ label: string; presets?: DatePreset[]; hint?: string; id?: string }>(),
  {
    presets: () => [
      { label: 'Today', offset: 0 },
      { label: 'Yesterday', offset: -1 },
      { label: '7 days ago', offset: -7 },
    ],
    hint: '',
    id: '',
  },
)
const value = defineModel<string>({ default: '' })

const uid = useId()
const fieldId = computed(() => props.id || uid)
const root = ref<HTMLElement>()
const toggleBtn = ref<HTMLButtonElement>()
const pop = ref<HTMLElement>()
const open = ref(false)
const draft = ref(value.value)
const invalid = ref(false)

watch(value, (v) => {
  draft.value = v
  invalid.value = false
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function iso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function valid(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return false
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return iso(d) === s
}
function presetIso(p: DatePreset) {
  const d = new Date()
  d.setDate(d.getDate() + p.offset)
  return iso(d)
}

function commit() {
  const s = draft.value.trim()
  if (!s) {
    invalid.value = false
    value.value = ''
    return
  }
  invalid.value = !valid(s)
  if (!invalid.value) value.value = s
}

async function show() {
  open.value = true
  await nextTick()
  pop.value?.querySelector<HTMLElement>('.ads-calendar__day[tabindex="0"]')?.focus()
}

function hide(refocus = true) {
  open.value = false
  if (refocus) toggleBtn.value?.focus()
}

function onPick(v: string) {
  value.value = v
  hide()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.preventDefault()
    e.stopPropagation()
    hide()
  }
}

function onFocusout(e: FocusEvent) {
  if (open.value && !root.value?.contains(e.relatedTarget as Node)) hide(false)
}

const describedBy = computed(
  () => [invalid.value && `${fieldId.value}-err`, props.hint && `${fieldId.value}-hint`].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div ref="root" class="ads-date-picker ads-field-group" @keydown="onKeydown" @focusout="onFocusout">
    <label class="ads-label" :for="fieldId">{{ label }}</label>
    <div class="ads-date-picker__row">
      <input
        :id="fieldId"
        v-model="draft"
        class="ads-date-picker__input ads-field num"
        :class="{ 'is-invalid': invalid }"
        type="text"
        inputmode="numeric"
        placeholder="YYYY-MM-DD"
        autocomplete="off"
        :aria-invalid="invalid || undefined"
        :aria-describedby="describedBy"
        @change="commit"
        @keydown.enter.prevent="commit"
      >
      <button
        ref="toggleBtn"
        type="button"
        class="ads-icon-button"
        aria-label="Choose date from calendar"
        aria-haspopup="dialog"
        :aria-expanded="open"
        @click="open ? hide() : show()"
      >
        <Icon name="compass" :size="16" />
      </button>
      <div v-if="open" ref="pop" class="ads-date-picker__pop" role="dialog" :aria-label="`${label}: calendar`">
        <AdsCalendar :model-value="value" :label="label" @update:model-value="onPick" />
      </div>
    </div>
    <span v-if="invalid" :id="`${fieldId}-err`" class="ads-hint" role="alert">Use a real date as YYYY-MM-DD, for example {{ presetIso({ label: '', offset: 0 }) }}.</span>
    <span v-if="hint" :id="`${fieldId}-hint`" class="ads-hint">{{ hint }}</span>
    <div v-if="presets.length" class="ads-segmented" role="group" :aria-label="`${label} presets`">
      <button
        v-for="p in presets"
        :key="p.label"
        type="button"
        :class="{ 'is-on': value === presetIso(p) }"
        :aria-pressed="value === presetIso(p)"
        @click="value = presetIso(p)"
      >{{ p.label }}</button>
    </div>
  </div>
</template>

<style scoped>
.ads-date-picker__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.ads-date-picker__input {
  flex: 1;
  min-width: 0;
}

.ads-date-picker__pop {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 30;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
  animation: ads-date-picker-in var(--dur-control) var(--ease);
}

@keyframes ads-date-picker-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>

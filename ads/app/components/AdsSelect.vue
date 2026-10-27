<script setup lang="ts">
// A custom select, for when an option needs more than text. Prefer
// AdsNativeSelect — this one has to rebuild what the browser gives free, so it
// follows the select-only combobox pattern to the letter: the trigger is a
// well with a visible label, arrows move, typing jumps, Enter picks, Escape
// closes and focus stays on the trigger. The chosen option is marked with a
// tick, not an accent fill — the accent is spent elsewhere on the screen.
const props = withDefaults(
  defineProps<{
    label: string
    options?: { label: string; value: string | number }[]
    modelValue?: string | number
    placeholder?: string
    hint?: string
  }>(),
  { options: () => [], modelValue: '', placeholder: 'Choose…', hint: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

const uid = useId()
const root = ref<HTMLElement>()
const listEl = ref<HTMLElement>()
const open = ref(false)
const active = ref(-1)
let typed = ''
let typedTimer: ReturnType<typeof setTimeout> | undefined

const selectedIndex = computed(() => props.options.findIndex((o) => o.value === props.modelValue))
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label)

function show() {
  open.value = true
  active.value = Math.max(selectedIndex.value, 0)
  nextTick(scrollActive)
}

function hide() {
  open.value = false
}

function pick(i: number) {
  const o = props.options[i]
  if (o) emit('update:modelValue', o.value)
  hide()
}

function move(i: number) {
  active.value = Math.min(Math.max(i, 0), props.options.length - 1)
  nextTick(scrollActive)
}

function scrollActive() {
  listEl.value?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-opt-${active.value}`)}`)?.scrollIntoView({ block: 'nearest' })
}

function typeahead(ch: string) {
  typed += ch.toLowerCase()
  clearTimeout(typedTimer)
  typedTimer = setTimeout(() => (typed = ''), 500)
  const start = open.value ? active.value + (typed.length === 1 ? 1 : 0) : 0
  const n = props.options.length
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n
    if (props.options[i]!.label.toLowerCase().startsWith(typed)) {
      if (!open.value) show()
      move(i)
      return
    }
  }
}

function onKeydown(e: KeyboardEvent) {
  const last = props.options.length - 1
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      open.value ? move(active.value + 1) : show()
      break
    case 'ArrowUp':
      e.preventDefault()
      open.value ? move(active.value - 1) : show()
      break
    case 'Home':
      if (open.value) { e.preventDefault(); move(0) }
      break
    case 'End':
      if (open.value) { e.preventDefault(); move(last) }
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      open.value ? pick(active.value) : show()
      break
    case 'Escape':
      if (open.value) { e.preventDefault(); hide() }
      break
    case 'Tab':
      if (open.value) pick(active.value)
      break
    default:
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) typeahead(e.key)
  }
}

function onFocusout(e: FocusEvent) {
  if (!root.value?.contains(e.relatedTarget as Node)) hide()
}

onBeforeUnmount(() => clearTimeout(typedTimer))
</script>

<template>
  <div ref="root" class="ads-select ads-field-group" @focusout="onFocusout">
    <span :id="`${uid}-label`" class="ads-label">{{ label }}</span>
    <div class="ads-select__anchor">
      <button
        type="button"
        class="ads-select__trigger ads-field"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open"
        :aria-controls="`${uid}-list`"
        :aria-labelledby="`${uid}-label ${uid}-value`"
        :aria-activedescendant="open && active >= 0 ? `${uid}-opt-${active}` : undefined"
        :aria-describedby="hint ? `${uid}-hint` : undefined"
        @click="open ? hide() : show()"
        @keydown="onKeydown"
      >
        <span :id="`${uid}-value`" class="ads-select__value" :class="{ 'is-placeholder': !selectedLabel }">
          {{ selectedLabel ?? placeholder }}
        </span>
        <svg class="ads-select__chevron" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <ul
        v-show="open"
        :id="`${uid}-list`"
        ref="listEl"
        class="ads-select__list"
        role="listbox"
        :aria-labelledby="`${uid}-label`"
        tabindex="-1"
      >
        <li
          v-for="(o, i) in options"
          :id="`${uid}-opt-${i}`"
          :key="o.value"
          class="ads-select__option"
          :class="{ 'is-active': i === active }"
          role="option"
          :aria-selected="o.value === modelValue"
          @mousedown.prevent
          @mousemove="active = i"
          @click="pick(i)"
        >
          <span>{{ o.label }}</span>
          <Icon v-if="o.value === modelValue" name="check" :size="14" class="ads-select__tick" />
        </li>
      </ul>
    </div>
    <span v-if="hint" :id="`${uid}-hint`" class="ads-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.ads-select {
  min-width: 180px;
}

.ads-select__anchor {
  position: relative;
}

.ads-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  text-align: left;
  cursor: pointer;
}

.ads-select__value.is-placeholder {
  color: var(--subdued);
}

.ads-select__chevron {
  flex: none;
  color: var(--subdued);
  transition: transform var(--dur-control) var(--ease);
}

.ads-select__trigger[aria-expanded='true'] .ads-select__chevron {
  transform: rotate(180deg);
}

.ads-select__list {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  max-height: 260px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
}

.ads-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: 9px var(--sp-3);
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color var(--dur-control) var(--ease), background var(--dur-control) var(--ease);
}

.ads-select__option.is-active {
  background: var(--hover);
  color: var(--accent);
}

.ads-select__option[aria-selected='true'] {
  color: var(--text);
}

.ads-select__tick {
  flex: none;
  color: var(--text);
}
</style>

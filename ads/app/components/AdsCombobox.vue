<script setup lang="ts">
// A field that filters a list as you type — for a choice among too many
// options to scan. It is a real combobox: the list is announced, arrows move
// through it without leaving the field, Enter picks, Escape closes (and a
// second Escape clears). An empty result says so instead of vanishing.
const props = withDefaults(
  defineProps<{
    label: string
    options?: { label: string; value: string | number }[]
    modelValue?: string | number
    placeholder?: string
    hint?: string
  }>(),
  { options: () => [], modelValue: '', placeholder: 'Type to search', hint: '' },
)
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()

const uid = useId()
const listEl = ref<HTMLElement>()
const query = ref(props.options.find((o) => o.value === props.modelValue)?.label ?? '')
const open = ref(false)
const active = ref(-1)

watch(
  () => props.modelValue,
  (v) => {
    const o = props.options.find((x) => x.value === v)
    if (o) query.value = o.label
  },
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  const chosen = props.options.find((o) => o.value === props.modelValue)
  // Showing the whole list again once a choice is in the field.
  if (!q || chosen?.label.toLowerCase() === q) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

function show() {
  open.value = true
}

function pick(i: number) {
  const o = filtered.value[i]
  if (!o) return
  emit('update:modelValue', o.value)
  query.value = o.label
  open.value = false
  active.value = -1
}

function move(i: number) {
  if (!filtered.value.length) return
  open.value = true
  active.value = (i + filtered.value.length) % filtered.value.length
  nextTick(() =>
    listEl.value?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-opt-${active.value}`)}`)?.scrollIntoView({ block: 'nearest' }),
  )
}

function onInput() {
  open.value = true
  active.value = -1
}

function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      move(active.value + 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      move(active.value - 1)
      break
    case 'Enter':
      if (open.value && active.value >= 0) {
        e.preventDefault()
        pick(active.value)
      }
      break
    case 'Escape':
      e.preventDefault()
      if (open.value) open.value = false
      else query.value = ''
      active.value = -1
      break
  }
}
</script>

<template>
  <div class="ads-combobox ads-field-group">
    <label class="ads-label" :for="`${uid}-input`">{{ label }}</label>
    <div class="ads-combobox__anchor">
      <input
        :id="`${uid}-input`"
        v-model="query"
        class="ads-combobox__input ads-field"
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="`${uid}-list`"
        :aria-activedescendant="open && active >= 0 ? `${uid}-opt-${active}` : undefined"
        :aria-describedby="hint ? `${uid}-hint` : undefined"
        :placeholder="placeholder"
        @focus="show"
        @click="show"
        @blur="open = false"
        @input="onInput"
        @keydown="onKeydown"
      >
      <ul
        v-show="open"
        :id="`${uid}-list`"
        ref="listEl"
        class="ads-combobox__list"
        role="listbox"
        :aria-labelledby="`${uid}-input`"
      >
        <li
          v-for="(o, i) in filtered"
          :id="`${uid}-opt-${i}`"
          :key="o.value"
          class="ads-combobox__option"
          :class="{ 'is-active': i === active }"
          role="option"
          :aria-selected="o.value === modelValue"
          @mousedown.prevent="pick(i)"
          @mousemove="active = i"
        >
          <span>{{ o.label }}</span>
          <Icon v-if="o.value === modelValue" name="check" :size="14" class="ads-combobox__tick" />
        </li>
        <li v-if="!filtered.length" class="ads-combobox__empty" role="presentation">No matches</li>
      </ul>
    </div>
    <span v-if="hint" :id="`${uid}-hint`" class="ads-hint">{{ hint }}</span>
  </div>
</template>

<style scoped>
.ads-combobox__anchor {
  position: relative;
}

.ads-combobox__list {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  max-height: 240px;
  margin: 0;
  padding: 6px;
  overflow-y: auto;
  list-style: none;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-lg);
}

.ads-combobox__option {
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

.ads-combobox__option.is-active {
  background: var(--hover);
  color: var(--accent);
}

.ads-combobox__option[aria-selected='true'] {
  color: var(--text);
}

.ads-combobox__tick {
  flex: none;
}

.ads-combobox__empty {
  padding: 9px var(--sp-3);
  font-size: 0.86rem;
  color: var(--subdued);
}
</style>

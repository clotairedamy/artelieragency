<script setup lang="ts">
// Tabs: filtered views of one dataset, where the columns stay put — not
// navigation between screens, which is the rail's job. A hairline with the
// active tab underlined by the accent, the accent's only appearance in a nav
// context. One tab stop for the row; arrow keys move between tabs, as the
// tablist pattern expects. `controls` is the id of the view the tabs filter.
export type Tab = { label: string; value: string | number }

const props = withDefaults(defineProps<{ modelValue?: string | number; tabs: Tab[]; label: string; controls?: string }>(), {
  modelValue: undefined,
  controls: undefined,
})
const emit = defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
const root = ref<HTMLElement>()

// With nothing selected yet, the first tab keeps the row reachable.
const stop = computed(() => (props.tabs.some((t) => t.value === props.modelValue) ? props.modelValue : props.tabs[0]?.value))

function onKeydown(e: KeyboardEvent) {
  const at = props.tabs.findIndex((t) => t.value === stop.value)
  const last = props.tabs.length - 1
  const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: last }[e.key]
  if (next === undefined || !props.tabs.length) return
  e.preventDefault()
  const i = (next + props.tabs.length) % props.tabs.length
  emit('update:modelValue', props.tabs[i]!.value)
  nextTick(() => root.value?.querySelectorAll<HTMLElement>('[role="tab"]')[i]?.focus())
}
</script>

<template>
  <div ref="root" class="ads-tabs" role="tablist" :aria-label="label" @keydown="onKeydown">
    <button
      v-for="t in tabs"
      :key="t.value"
      type="button"
      role="tab"
      :aria-selected="props.modelValue === t.value"
      :aria-controls="controls"
      :tabindex="t.value === stop ? 0 : -1"
      :class="{ 'is-on': props.modelValue === t.value }"
      @click="emit('update:modelValue', t.value)"
    >
      {{ t.label }}
    </button>
  </div>
</template>

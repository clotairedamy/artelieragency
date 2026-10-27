<script setup lang="ts">
// The arrangement that carries most of the working hours in any data product:
// header, tabs, filter bar, grid, pagination.
//
// The tabs filter the one table below them — they never swap in a different
// screen — so they are a real tablist whose panel is the grid, with the arrow
// keys moving between tabs. The header's action is the screen's single accent;
// pass an empty `actionLabel` when the page already spends it elsewhere. A
// selected row is forwarded as `select`, for the drawer beside it.
import type { GridColumn, Row } from './AdsDataGrid.vue'

export type { GridColumn }
export type GridRow = Row

const props = withDefaults(
  defineProps<{
    title: string
    count?: string
    actionLabel?: string
    tabs?: string[]
    tab?: string
    columns: GridColumn[]
    rows: GridRow[]
    placeholder?: string
    searchLabel?: string
  }>(),
  { count: '', actionLabel: 'Export CSV', tabs: () => [], tab: '', placeholder: 'Filter by URL…', searchLabel: 'Filter by URL' },
)

const query = defineModel<string>('query', { default: '' })

const emit = defineEmits<{
  (e: 'update:tab', v: string): void
  (e: 'action'): void
  (e: 'select', row: GridRow, index: number): void
}>()

const uid = `ads-table-screen-${useId().replace(/[^\w-]/g, '-')}`
const tabIds = computed(() => props.tabs.map((_, i) => `${uid}-tab-${i}`))
const tablist = ref<HTMLElement | null>(null)

// Roving focus: only the selected tab is in the tab order; the arrows move
// between tabs and select as they go, as a tablist is expected to.
function onTabKey(e: KeyboardEvent) {
  const n = props.tabs.length
  const at = Math.max(0, props.tabs.indexOf(props.tab))
  let next = -1
  if (e.key === 'ArrowRight') next = (at + 1) % n
  else if (e.key === 'ArrowLeft') next = (at - 1 + n) % n
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = n - 1
  if (next < 0) return
  e.preventDefault()
  emit('update:tab', props.tabs[next]!)
  tablist.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
}
</script>

<template>
  <div class="card ads-table-screen">
    <header class="ads-table-screen__head">
      <div class="ads-table-screen__heading">
        <h4 class="ads-table-screen__title ads-display">{{ title }}</h4>
        <span v-if="count" class="dim num">{{ count }}</span>
      </div>
      <button v-if="actionLabel" class="btn btn-accent" type="button" @click="emit('action')">{{ actionLabel }}</button>
    </header>

    <div v-if="tabs.length" ref="tablist" class="ads-tabs" role="tablist" :aria-label="title" @keydown="onTabKey">
      <button
        v-for="(t, i) in tabs"
        :id="tabIds[i]"
        :key="t"
        type="button"
        role="tab"
        :aria-selected="tab === t"
        :aria-controls="`${uid}-panel`"
        :tabindex="tab === t || (!tabs.includes(tab) && i === 0) ? 0 : -1"
        :class="{ 'is-on': tab === t }"
        @click="emit('update:tab', t)"
      >{{ t }}</button>
    </div>

    <div
      :id="`${uid}-panel`"
      class="ads-table-screen__panel"
      :role="tabs.length ? 'tabpanel' : undefined"
      :aria-labelledby="tabs.length ? tabIds[Math.max(0, tabs.indexOf(tab))] : undefined"
    >
      <div class="ads-table-screen__controls">
        <div class="ads-search">
          <Icon name="compass" :size="16" />
          <input v-model="query" class="ads-field" type="search" :placeholder="placeholder" :aria-label="searchLabel" />
        </div>
        <slot name="filters" />
      </div>

      <AdsDataGrid :columns="columns" :rows="rows" :caption="title" @select="(r, i) => emit('select', r, i)" />
    </div>

    <footer class="ads-table-screen__foot">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.ads-table-screen {
  display: grid;
  gap: var(--sp-4);
  padding: 22px;
}

.ads-table-screen__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  flex-wrap: wrap;
}

.ads-table-screen__heading {
  display: grid;
  gap: 2px;
}

.ads-table-screen__title {
  font-size: 1.15rem;
  font-weight: 600;
}

.ads-table-screen__panel {
  display: grid;
  gap: var(--sp-4);
}

.ads-table-screen__controls {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
  align-items: center;
}

.ads-table-screen__controls .ads-search {
  flex: 1;
  min-width: 200px;
}

.ads-table-screen__foot {
  display: flex;
  justify-content: flex-end;
}
</style>

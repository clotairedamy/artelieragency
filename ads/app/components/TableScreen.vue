<script setup lang="ts">
// The arrangement that carries most of the working hours in any data product:
// header, tabs, filter bar, grid, pagination.
export type GridColumn = { key: string; label: string; align?: 'end'; mono?: boolean; grade?: boolean }
export type GridRow = Record<string, string | number>

withDefaults(
  defineProps<{
    title: string
    count?: string
    actionLabel?: string
    tabs?: string[]
    tab?: string
    columns: GridColumn[]
    rows: GridRow[]
    placeholder?: string
  }>(),
  { count: '', actionLabel: 'Export CSV', tabs: () => [], tab: '', placeholder: 'Filter by URL…' },
)

const emit = defineEmits<{ (e: 'update:tab', v: string): void; (e: 'action'): void }>()
</script>

<template>
  <div class="card screen">
    <header class="head">
      <div>
        <h4 class="title ads-display">{{ title }}</h4>
        <span v-if="count" class="dim num">{{ count }}</span>
      </div>
      <button v-if="actionLabel" class="btn btn-accent" type="button" @click="emit('action')">{{ actionLabel }}</button>
    </header>

    <div v-if="tabs.length" class="ads-tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t"
        type="button"
        role="tab"
        :aria-selected="tab === t"
        :class="{ 'is-on': tab === t }"
        @click="emit('update:tab', t)"
      >{{ t }}</button>
    </div>

    <div class="bar">
      <div class="ads-search">
        <Icon name="compass" :size="16" />
        <input class="ads-field" type="search" :placeholder="placeholder" aria-label="Filter" />
      </div>
      <slot name="filters" />
    </div>

    <AdsDataGrid :columns="columns" :rows="rows" :caption="title" />

    <footer class="foot">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.screen {
  display: grid;
  gap: 16px;
  padding: 22px;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.head > div {
  display: grid;
  gap: 2px;
}

.title {
  font-size: 1.15rem;
  font-weight: 600;
}

.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.bar .ads-search {
  flex: 1;
  min-width: 200px;
}

.foot {
  display: flex;
  justify-content: flex-end;
}
</style>

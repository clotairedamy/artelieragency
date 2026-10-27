<script setup lang="ts">
// The KPI row — the top of nearly every dashboard. Four figures at most, ranked
// left to right by how often they are the reason someone opened the screen.
// Each tile carries its comparison (a delta, the previous period or a target)
// because a figure with nothing to compare it to is trivia.
export type StatItem = {
  value: string | number
  label: string
  unit?: string
  note?: string
  delta?: string
  direction?: 'up' | 'down' | 'flat'
  previous?: string | number
  target?: string | number
}

const props = withDefaults(defineProps<{ stats: StatItem[]; columns?: 2 | 3 | 4 }>(), { columns: 4 })

if (import.meta.dev && props.stats.length > 4) {
  console.warn(`[KpiRow] ${props.stats.length} figures: four at most, or none of them is the headline.`)
}
</script>

<template>
  <div class="ads-kpi-row" :class="`is-cols-${columns}`">
    <AdsStat v-for="s in stats" :key="s.label" v-bind="s" />
  </div>
</template>

<style scoped>
.ads-kpi-row {
  display: grid;
  gap: var(--gutter);
}

@media (min-width: 760px) {
  .ads-kpi-row.is-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .ads-kpi-row.is-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .ads-kpi-row.is-cols-4 { grid-template-columns: repeat(4, 1fr); }
}
</style>

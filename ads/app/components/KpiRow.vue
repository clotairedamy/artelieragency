<script setup lang="ts">
// The KPI row — the top of nearly every dashboard. Four figures at most, ranked
// left to right by how often they are the reason someone opened the screen.
export type StatItem = { value: string | number; label: string; unit?: string; note?: string }

withDefaults(defineProps<{ stats: StatItem[]; columns?: 2 | 3 | 4 }>(), { columns: 4 })
</script>

<template>
  <div class="kpis" :class="`grid-${columns}`">
    <AdsStat v-for="s in stats" :key="s.label" :value="s.value" :label="s.label" :unit="s.unit" :note="s.note" />
  </div>
</template>

<style scoped>
.kpis {
  display: grid;
  gap: var(--gutter);
}

@media (min-width: 760px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
}
</style>

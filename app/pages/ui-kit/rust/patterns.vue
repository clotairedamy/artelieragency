<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Patterns · Artelier UI Kit for Rust',
  description: 'The compositions that recur in every dashboard.',
  path: '/ui-kit/rust/patterns',
})
const { usage, source } = useRustDocs()
const kpi = [{ value: '1,284', label: 'URLs', delta: '+37', direction: 'up' as const }, { value: '98', label: 'Health', target: 100 }]
const gridColumns = [{ key: 'name', label: 'Page', mono: true }, { key: 'views', label: 'Views' }]
const gridRows = [{ name: '/overview', views: 18240 }, { name: '/pricing', views: 9312 }]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Patterns</p>
      <h1 class="title face-display">Patterns</h1>
      <p class="lede">The compositions that recur in every dashboard.</p>
    </header>

    <RustDoc id="r-kpi" name="KpiRow" :code="usage.KpiRow" file="blocks/kpi_row.rs" :source="source('blocks/kpi_row.rs')"><div class="block"><KpiRow :stats="kpi" /></div></RustDoc>
    <RustDoc id="r-filter" name="FilterBar" :code="usage.FilterBar" file="blocks/filter_bar.rs" :source="source('blocks/filter_bar.rs')"><div class="block"><FilterBar :tags="['Exec summary']" /></div></RustDoc>
    <RustDoc id="r-table" name="TableScreen" :code="usage.TableScreen" file="blocks/table_screen.rs" :source="source('blocks/table_screen.rs')"><div class="block"><TableScreen title="Results" count="733 rows" :tabs="['Internal', 'External']" tab="Internal" :columns="gridColumns" :rows="gridRows" /></div></RustDoc>
    <RustDoc id="r-summary" name="SummaryDetail" :code="usage.SummaryDetail" file="blocks/summary_detail.rs" :source="source('blocks/summary_detail.rs')"><div class="block"><SummaryDetail /></div></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

<script setup lang="ts">
const stats = [
  { value: '1,284', label: 'URLs', note: '+37' },
  { value: '98', label: 'Health', note: 'of 100' },
  { value: '74', label: 'Median', unit: 'ms', note: '−12%' },
  { value: '23', label: 'Issues', note: '4 critical' },
]

const columns = [
  { key: 'url', label: 'URL' },
  { key: 'code', label: 'Code', align: 'end' as const, mono: true },
  { key: 'status', label: 'Status', grade: true },
]
const rows = [
  { url: '/overview', code: 200, status: 1 },
  { url: '/pricing', code: 404, status: 4 },
  { url: '/docs/installing', code: 301, status: 2 },
]

const kpiCode = `<KpiRow :stats="[
  { value: '1,284', label: 'URLs', note: '+37' },
  { value: '98', label: 'Health', note: 'of 100' },
  { value: '74', label: 'Median', unit: 'ms', note: '−12%' },
  { value: '23', label: 'Issues', note: '4 critical' },
]" />`

const filterCode = `<FilterBar
  placeholder="Filter by URL…"
  :tags="['Exec summary', 'Broken links']"
  :segments="['All', '2xx', '4xx']"
  @remove-tag="…" @save="…" />`

const screenCode = `<TableScreen
  title="Results" count="733 rows" action-label="Export CSV"
  :tabs="['Internal', 'External', 'Response codes']"
  :columns="columns" :rows="rows" />`

const summaryCode = `<SummaryDetail :rungs="[
  { title: 'Answer.', body: 'One ranked list.' },
  { title: 'Reasoning.', body: 'Why this ranks first.' },
  { title: 'Evidence.', body: 'The grid, filtered, with the filter visible as a tag.' },
]" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Patterns</p>
      <h1 class="title face-display">Patterns</h1>
      <p class="lede">The compositions. Components are half a system — these are the arrangements that recur in every dashboard.</p>
    </header>

    <ComponentDoc
      id="kpirow"
      name="KpiRow"
      description="The top of nearly every dashboard. Four figures at most, ranked left to right by how often they are the reason someone opened the screen."
      :code="kpiCode"
      :props="[
        { name: 'stats', type: '{ value, label, unit?, note? }[]', default: '—' },
        { name: 'columns', type: '2 | 3 | 4', default: '4' },
      ]"
    >
      <div class="block"><KpiRow :stats="stats" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="filterbar"
      name="FilterBar"
      description="One row, above the data, holding every control that changes what is shown. Saved views turn a repeated set of filters into a named thing a team can share."
      :code="filterCode"
      :props="[
        { name: 'placeholder', type: 'string', default: 'Filter by URL…' },
        { name: 'tags', type: 'string[]', default: '[]' },
        { name: 'segments', type: 'string[]', default: 'All / 2xx / 4xx' },
        { name: 'segment', type: 'string', default: 'All' },
      ]"
    >
      <div class="block"><FilterBar :tags="['Exec summary', 'Broken links']" :segments="['All', '2xx', '4xx']" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="tablescreen"
      name="TableScreen"
      description="Header, tabs, filter bar, grid, pagination. The arrangement that carries most of the working hours in any data product."
      :code="screenCode"
      :props="[
        { name: 'title', type: 'string', default: '—' },
        { name: 'count', type: 'string', default: '' },
        { name: 'tabs', type: 'string[]', default: '[]' },
        { name: 'columns / rows', type: '—', default: '—', desc: 'Passed to AdsDataGrid.' },
      ]"
    >
      <div class="block"><TableScreen title="Results" count="733 rows" action-label="Export CSV" :tabs="['Internal', 'External', 'Response codes']" :columns="columns" :rows="rows" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="summarydetail"
      name="SummaryDetail"
      description="The pattern the whole system is arranged around: a ranked answer at the top, the reasoning one level down, the raw rows two levels down."
      :code="summaryCode"
      :props="[{ name: 'rungs', type: '{ title, body }[]', default: 'Answer / Reasoning / Evidence' }]"
    >
      <div class="block"><SummaryDetail /></div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>

<script setup lang="ts">
const stats = [
  { value: '1,284', label: 'URLs', delta: '+37', direction: 'up' as const },
  { value: '98', label: 'Health', target: 100 },
  { value: '74', label: 'Median', unit: 'ms', previous: 84 },
  { value: '23', label: 'Issues', delta: '−4', direction: 'down' as const, note: '4 critical' },
]

const columns = [
  { key: 'url', label: 'URL', mono: true },
  { key: 'code', label: 'Code', mono: true, numeric: false },
  { key: 'size', label: 'Size', unit: 'KB' },
  { key: 'status', label: 'Severity', grade: true },
]
const rows = [
  { url: '/overview', code: 200, size: 182, status: 1 },
  { url: '/pricing', code: 404, size: 4, status: 4 },
  { url: '/docs/installing', code: 301, size: 1, status: 2 },
  { url: '/blog/launch', code: 200, size: 246, status: 1 },
]

// The tabs filter the one table; the search narrows it further.
const tabs = ['All', 'Redirects', 'Errors']
const tab = ref('All')
const query = ref('')
const shown = computed(() =>
  rows.filter(
    (r) =>
      (tab.value === 'All' || (tab.value === 'Redirects' ? r.code >= 300 && r.code < 400 : r.code >= 400)) &&
      r.url.includes(query.value.trim()),
  ),
)

const segment = ref('All')
const tags = ref(['Exec summary', 'Broken links'])

const kpiCode = `<KpiRow :stats="[
  { value: '1,284', label: 'URLs', delta: '+37', direction: 'up' },
  { value: '98', label: 'Health', target: 100 },
  { value: '74', label: 'Median', unit: 'ms', previous: 84 },
  { value: '23', label: 'Issues', delta: '−4', direction: 'down', note: '4 critical' },
]" />`

const filterCode = `<FilterBar
  v-model:query="query"
  v-model:segment="segment"
  search-label="Filter by URL"
  segments-label="Status class"
  :tags="tags"
  :segments="['All', '2xx', '4xx']"
  @remove-tag="(t) => tags.splice(tags.indexOf(t), 1)"
  @save="saveView" />`

const screenCode = `<TableScreen
  v-model:tab="tab" v-model:query="query"
  title="Results" count="733 rows" action-label="Export CSV"
  :tabs="['All', 'Redirects', 'Errors']"
  :columns="columns" :rows="filtered"
  @select="openInDrawer">
  <template #footer>
    <DashEmpty v-if="!filtered.length" status="no-results" title="No rows match" />
  </template>
</TableScreen>`

const summaryCode = `<SummaryDetail :rungs="[
  { title: 'Answer.', body: 'One ranked list.' },
  { title: 'Reasoning.', body: 'Why this ranks first.' },
  { title: 'Evidence.', body: 'The grid, filtered, with the filter visible as a tag.' },
]" />`

const emptyCode = `<DashEmpty status="empty" title="No crawls yet" action-label="Start a crawl" @action="start" />
<DashEmpty status="no-results" title="No pages match these filters" action-label="Clear filters" @action="clear" />
<DashEmpty status="forbidden" title="Search Console is not connected" reason="The service account has no access to this property." />`

const ganttCode = `<GanttChart />`
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
      description="The top of nearly every dashboard. Four figures at most, ranked left to right by how often they are the reason someone opened the screen. Each carries a comparison — delta, previous or target — passed straight to AdsStat."
      :code="kpiCode"
      :props="[
        { name: 'stats', type: '{ value, label, unit?, delta?, direction?, previous?, target?, note? }[]', default: '—', desc: 'Four at most; more warns in development.' },
        { name: 'columns', type: '2 | 3 | 4', default: '4' },
      ]"
    >
      <div class="block"><KpiRow :stats="stats" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="filterbar"
      name="FilterBar"
      description="One row, above the data, holding every control that changes what is shown. Saved views are tags, and tags are removable filters. Every control is named; the placeholder is an example, never the label."
      :code="filterCode"
      :props="[
        { name: 'query', type: 'string (v-model)', default: `''` },
        { name: 'placeholder', type: 'string', default: 'Filter by URL…' },
        { name: 'searchLabel', type: 'string', default: 'Filter by URL', desc: 'Accessible name of the search field.' },
        { name: 'tags', type: 'string[]', default: '[]' },
        { name: 'segments', type: 'string[]', default: 'All / 2xx / 4xx' },
        { name: 'segment', type: 'string (v-model)', default: 'All' },
        { name: 'segmentsLabel', type: 'string', default: 'Status' },
        { name: 'from / to', type: 'string', default: '30d / now', desc: 'Relative presets, or ISO dates: 2026-10-27.' },
        { name: '@remove-tag / @save', type: 'event', default: '—' },
      ]"
    >
      <div class="block">
        <FilterBar
          v-model:segment="segment"
          segments-label="Status class"
          :tags="tags"
          :segments="['All', '2xx', '4xx']"
          @remove-tag="(t) => tags.splice(tags.indexOf(t), 1)"
          @save="tags.push(`View ${tags.length + 1}`)"
        />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="tablescreen"
      name="TableScreen"
      description="Header, tabs, filter bar, grid, pagination. The tabs filter the one table below them; the arrow keys move between tabs. The header action is the screen's single accent. A selected row is forwarded as @select — open it in a drawer."
      :code="screenCode"
      :props="[
        { name: 'title', type: 'string', default: '—' },
        { name: 'count', type: 'string', default: '' },
        { name: 'actionLabel', type: 'string', default: 'Export CSV', desc: 'Empty hides it — when the page spends its accent elsewhere.' },
        { name: 'tabs', type: 'string[]', default: '[]' },
        { name: 'tab', type: 'string (v-model)', default: `''` },
        { name: 'query', type: 'string (v-model)', default: `''` },
        { name: 'placeholder / searchLabel', type: 'string', default: 'Filter by URL…' },
        { name: 'columns / rows', type: '—', default: '—', desc: 'Passed to AdsDataGrid.' },
        { name: '@select', type: '(row, index) => void', default: '—' },
      ]"
    >
      <div class="block">
        <TableScreen
          v-model:tab="tab"
          v-model:query="query"
          title="Results"
          :count="`${shown.length} rows`"
          action-label="Export CSV"
          :tabs="tabs"
          :columns="columns"
          :rows="shown"
        >
          <template #footer>
            <DashEmpty
              v-if="!shown.length"
              status="no-results"
              title="No rows match"
              action-label="Clear filters"
              @action="tab = 'All'; query = ''"
            />
          </template>
        </TableScreen>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="dashempty"
      name="DashEmpty"
      description="Why a panel is empty, in plain words, with the fix — and the action that applies it. “Never had data” and “no results” are different situations and say so. The state is carried by glyph and words, not colour."
      :code="emptyCode"
      :props="[
        { name: 'title', type: 'string', default: '—' },
        { name: 'status', type: `'empty' | 'no-results' | 'error' | 'forbidden' | 'unconfigured'`, default: `'empty'` },
        { name: 'reason', type: 'string', default: '' },
        { name: 'fix', type: 'string', default: 'per status' },
        { name: 'actionLabel', type: 'string', default: '', desc: 'Renders a button that emits @action.' },
      ]"
    >
      <div class="block stack gap-3">
        <DashEmpty status="empty" title="No crawls yet" action-label="Start a crawl" />
        <DashEmpty status="no-results" title="No pages match these filters" action-label="Clear filters" />
        <DashEmpty status="forbidden" title="Search Console is not connected" reason="The service account has no access to this property." />
      </div>
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

    <ComponentDoc
      id="ganttchart"
      name="GanttChart"
      description="The engagement plan from the studio site: a length control that rescales the plan, and a marker you drag (or move with the arrow keys) to ask what is happening in a given week."
      :code="ganttCode"
    >
      <GanttChart />
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

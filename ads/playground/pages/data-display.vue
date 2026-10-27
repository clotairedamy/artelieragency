<script setup lang="ts">
const bars = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 74 },
  { label: 'Fri', value: 66 },
]
const spark = [12, 19, 15, 24, 31, 27, 38, 35, 44, 52, 48, 61]
const columns = [
  { key: 'name', label: 'Page' },
  { key: 'views', label: 'Views', align: 'end' as const, mono: true },
  { key: 'status', label: 'Status', grade: true },
]
const rows = [
  { name: '/overview', views: 18240, status: 1 },
  { name: '/pricing', views: 9312, status: 2 },
  { name: '/contact', views: 2133, status: 4 },
]
const detail = [
  { term: 'Region', value: 'NA + EU' },
  { term: 'Window', value: 'Last 7 days' },
  { term: 'Owner', value: 'Growth' },
]

const statCode = `<AdsStat :value="'1,284'" label="URLs crawled" note="+37 this run" />
<AdsDelta direction="up" value="12.4%" />`

const meterCode = `<AdsMeter :value="68" :max="100" :threshold="80" label="Budget used" />
<AdsProgress :value="46" :max="100" />`

const choiceCode = `<ChartChoice />`

const chartsCode = `<AdsSparkline :points="[12, 19, 15, 24]" unit="k" />
<AdsBars :data="[{ label: 'Mon', value: 42 }]" />
<AdsGauge :value="68" :max="100" label="coverage" unit="%" />
<AdsHeatmap :cols="16" :rows="5" />`

const dlCode = `<AdsDl :items="[{ term: 'Status', value: '200 · indexable' }]" />`

const gridCode = `<AdsDataGrid
  :columns="[{ key: 'name', label: 'Page' }, { key: 'views', label: 'Views', align: 'end', mono: true }]"
  :rows="[{ name: '/overview', views: 18240 }]" />`

const badgeCode = `<AdsBadge :value="5" />
<AdsStatus label="Critical" :grade="4" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Data display</p>
      <h1 class="title face-display">Data display</h1>
      <p class="lede">The reason the screen exists. Numbers are monospaced so a column scans downward.</p>
    </header>

    <ComponentDoc
      id="adsstat"
      name="AdsStat"
      description="A figure, its direction of travel, and its standing. A number without a comparison is trivia."
      :code="statCode"
      :props="[
        { name: 'value', type: 'string | number', default: '—' },
        { name: 'label', type: 'string', default: '—' },
        { name: 'unit', type: 'string', default: '' },
        { name: 'note', type: 'string', default: '' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsStat value="1,284" label="URLs crawled" note="+37 this run" />
        <AdsStat value="74" label="Median latency" unit="ms" note="−12% vs last" />
        <div class="stack gap-2"><AdsDelta direction="up" value="12.4%" /><AdsDelta direction="down" value="3.1%" /><AdsDelta direction="flat" value="0.0%" /></div>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsbadge"
      name="AdsBadge & AdsStatus"
      description="A count pill and a severity read. Severity in a monochrome system is luminance — the worse it is, the brighter it is."
      :code="badgeCode"
      :props="[
        { name: 'value', type: 'string | number', default: '—' },
        { name: 'quiet', type: 'boolean', default: 'false' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsBadge :value="5" /><AdsBadge :value="99" /><AdsBadge value="draft" quiet />
        <AdsStatus label="Healthy" :grade="1" /><AdsStatus label="Critical" :grade="4" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsmeter"
      name="AdsMeter & AdsProgress"
      description="Two shapes often confused. A meter is a quantity against a threshold; a progress bar is a task moving toward a known end."
      :code="meterCode"
      :props="[
        { name: 'value', type: 'number', default: '—' },
        { name: 'max', type: 'number', default: '100' },
        { name: 'threshold', type: 'number', default: '—', desc: 'Meter only — draws the mark.' },
      ]"
    >
      <div class="block stack gap-4" style="max-width: 360px">
        <AdsMeter :value="68" :max="100" :threshold="80" label="Budget used" />
        <AdsMeter :value="91" :max="100" :threshold="40" label="Error rate" />
        <AdsProgress :value="46" :max="100" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="chartchoice"
      name="ChartChoice"
      description="The decision before the component. Pick the form from the job, then the colour — most bad charts are the wrong shape."
      :code="choiceCode"
      :props="[{ name: 'rows', type: '[job, form, decides][]', default: '8 rows' }]"
    >
      <div class="block"><ChartChoice /></div>
    </ComponentDoc>

    <ComponentDoc
      id="chartsc"
      name="Charts"
      description="Four shapes cover nearly everything a dashboard has to say. Hand-drawn SVG, no charting library."
      :code="chartsCode"
    >
      <div class="block stack gap-4">
        <AdsSparkline :points="spark" unit="k" />
        <AdsBars :data="bars" />
        <div class="row gap-4 wrap items-center">
          <AdsGauge :value="68" :max="100" label="coverage" unit="%" />
          <div style="flex: 1; min-width: 220px"><AdsHeatmap :cols="16" :rows="5" /></div>
        </div>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsdl"
      name="AdsDl"
      description="Key-value detail — what a selected row almost always needs. A grid, not a table, so long values wrap."
      :code="dlCode"
      :props="[{ name: 'items', type: '{ term, value }[]', default: '—' }]"
    >
      <div class="block" style="max-width: 360px"><AdsDl :items="detail" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adsdatagrid"
      name="AdsDataGrid"
      description="The workhorse. Sortable headers, a keyboard cursor, rows separated by a whisper, figures monospaced."
      :code="gridCode"
      :props="[
        { name: 'columns', type: '{ key, label, align?, mono?, grade? }[]', default: '—' },
        { name: 'rows', type: 'Record<string, string | number>[]', default: '—' },
        { name: 'caption', type: 'string', default: '—' },
      ]"
    >
      <div class="block"><AdsDataGrid :columns="columns" :rows="rows" caption="Top pages" /></div>
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

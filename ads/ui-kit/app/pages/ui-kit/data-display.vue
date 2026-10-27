<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Data display · Artelier UI Kit for Vue',
  description: 'The reason the screen exists. Numbers are monospaced so a column scans downward.',
  path: '/ui-kit/data-display',
})

const bars = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 74 },
  { label: 'Fri', value: 66 },
]
const spark = [12, 19, 15, 24, 31, 27, 38, 35, 44, 52, 48, 61]
const columns = [
  { key: 'name', label: 'Page', mono: true },
  { key: 'views', label: 'Views' },
  { key: 'latency', label: 'Latency', unit: 'ms' },
  { key: 'status', label: 'Severity', grade: true },
]
const rows = [
  { name: '/overview', views: 18240, latency: 74, status: 1 },
  { name: '/pricing', views: 9312, latency: 112, status: 2 },
  { name: '/contact', views: 2133, latency: 486, status: 4 },
]
const picked = ref('')
const detail = [
  { term: 'Region', value: 'NA + EU' },
  { term: 'Window', value: '2026-10-20 → 2026-10-27' },
  { term: 'Owner', value: 'Growth' },
]

// A deterministic field rather than Math.random(), so the server render and
// the client render agree and Vue does not throw a hydration mismatch.
const heatRows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const heatCols = Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? `${String(i + 6).padStart(2, '0')}h` : ''))
const heat = heatRows.map((_, y) =>
  heatCols.map((_, x) => {
    const wave = Math.sin(x / 3.1 + y / 1.7) * 0.5 + 0.5
    const drift = Math.sin((x * 7 + y * 13) / 11) * 0.5 + 0.5
    return Math.round((wave * 0.65 + drift * 0.35) * 40)
  }),
)

const statCode = `<AdsStat value="1,284" label="URLs crawled" delta="+37" direction="up" />
<AdsStat value="74" unit="ms" label="Median latency" :previous="84" />
<AdsStat value="68" unit="%" label="Coverage" :target="80" />`

const countCode = `<CountUp :to="18240" />`

const deltaCode =`<AdsDelta direction="up" value="12.4%" />`

const badgeCode = `<AdsBadge :value="5" label="unread findings" />`

const statusCode = `<AdsStatus label="Critical" :grade="4" />
<AdsStatus label="Passing" tone="ok" />`

const meterCode = `<AdsMeter :value="68" :threshold="80" label="Budget used" unit="%" />`

const progressCode = `<AdsProgress :value="46" label="Crawling" />`

const choiceCode = `<ChartChoice />`

const sparkCode = `<AdsSparkline :points="[12, 19, 15, 24]" label="Sessions, last 12 weeks" unit="k" />`

const barsCode = `<AdsBars :data="[{ label: 'Mon', value: 42 }]" label="Crawls by weekday" />`

const gaugeCode = `<AdsGauge :value="68" :threshold="80" label="Coverage" unit="%" />`

const heatCode = `<AdsHeatmap
  :values="[[0, 4, 12], [3, 9, 40]]"
  label="Crawl errors by weekday and hour"
  :row-labels="['Mon', 'Tue']"
  :col-labels="['06h', '07h', '08h']" />`

const dlCode = `<AdsDl :items="[{ term: 'Status', value: '200 · indexable' }]" />`

const gridCode = `<AdsDataGrid
  :columns="[
    { key: 'name', label: 'Page', mono: true },
    { key: 'views', label: 'Views' },
    { key: 'latency', label: 'Latency', unit: 'ms' },
    { key: 'status', label: 'Severity', grade: true },
  ]"
  :rows="[{ name: '/overview', views: 18240, latency: 74, status: 1 }]"
  caption="Top pages"
  @select="(row) => open(row)" />`
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
      description="A figure and its comparison. A number with nothing to compare it to is trivia, so every tile carries one: a delta, the previous period, or a target. A tile with none warns in development."
      :code="statCode"
      :props="[
        { name: 'value', type: 'string | number', default: '—' },
        { name: 'label', type: 'string', default: '—' },
        { name: 'unit', type: 'string', default: '' },
        { name: 'delta', type: 'string', default: '—', desc: 'Change against the last period, shown with AdsDelta.' },
        { name: 'direction', type: `'up' | 'down' | 'flat'`, default: `'flat'`, desc: 'Direction of the delta.' },
        { name: 'previous', type: 'string | number', default: '—', desc: 'The prior period’s figure, in the same unit.' },
        { name: 'target', type: 'string | number', default: '—', desc: 'The figure being aimed for.' },
        { name: 'note', type: 'string', default: '', desc: 'Context only — not a comparison.' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsStat value="1,284" label="URLs crawled" delta="+37" direction="up" />
        <AdsStat value="74" label="Median latency" unit="ms" :previous="84" />
        <AdsStat value="68" label="Coverage" unit="%" :target="80" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="countup"
      name="CountUp"
      description="A figure that counts up once, the first time it scrolls into view — an arrival, never a ticker. Later changes are set, not animated; reduced motion and screen readers get the final value."
      :code="countCode"
      :props="[
        { name: 'to', type: 'number', default: '—' },
        { name: 'decimals', type: 'number', default: '0' },
        { name: 'duration', type: 'number (ms)', default: '1600' },
      ]"
    >
      <p class="count-demo"><CountUp :to="18240" /> <span class="dim">pages crawled</span></p>
    </ComponentDoc>

    <ComponentDoc
      id="adsdelta"
      name="AdsDelta"
      description="Change against a previous period. The direction is required and is carried by the glyph and spoken text as well as the tone — never by colour alone."
      :code="deltaCode"
      :props="[
        { name: 'direction', type: `'up' | 'down' | 'flat'`, default: '—', desc: 'Required.' },
        { name: 'value', type: 'string', default: '—' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsDelta direction="up" value="12.4%" /><AdsDelta direction="down" value="3.1%" /><AdsDelta direction="flat" value="0.0%" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsbadge"
      name="AdsBadge"
      description="A count pill. A bare number means nothing to a screen reader, so `label` says what is being counted."
      :code="badgeCode"
      :props="[
        { name: 'value', type: 'string | number', default: '—' },
        { name: 'label', type: 'string', default: '', desc: 'Spoken after the value: “5 unread findings”.' },
        { name: 'quiet', type: 'boolean', default: 'false' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsBadge :value="5" label="unread findings" /><AdsBadge :value="99" label="pages" /><AdsBadge value="draft" quiet />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsstatus"
      name="AdsStatus"
      description="A state, always as a dot and a word. In dense data use `grade` — luminance, the worse the brighter. For a single state outside a table, `tone` allows the three reserved state colours. There is no colour prop."
      :code="statusCode"
      :props="[
        { name: 'label', type: 'string', default: '—', desc: 'Required — the state in words.' },
        { name: 'grade', type: '1 | 2 | 3 | 4', default: '1' },
        { name: 'tone', type: `'ok' | 'warn' | 'bad'`, default: '—', desc: 'Wins over grade.' },
      ]"
    >
      <div class="row gap-4 wrap items-center">
        <AdsStatus label="Low" :grade="1" /><AdsStatus label="Medium" :grade="2" /><AdsStatus label="High" :grade="3" /><AdsStatus label="Critical" :grade="4" />
        <AdsStatus label="Passing" tone="ok" /><AdsStatus label="Degraded" tone="warn" /><AdsStatus label="Failing" tone="bad" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsmeter"
      name="AdsMeter"
      description="A quantity against a threshold. The threshold is required: the mark is the component, and without it the fill means nothing."
      :code="meterCode"
      :props="[
        { name: 'value', type: 'number', default: '—' },
        { name: 'max', type: 'number', default: '100' },
        { name: 'threshold', type: 'number', default: '—', desc: 'Required — draws the mark.' },
        { name: 'label', type: 'string', default: '—', desc: 'Required — visible and the accessible name.' },
        { name: 'unit', type: 'string', default: '' },
      ]"
    >
      <div class="block stack gap-4" style="max-width: 360px">
        <AdsMeter :value="68" :threshold="80" label="Budget used" unit="%" />
        <AdsMeter :value="91" :threshold="40" label="Error rate" unit="%" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsprogress"
      name="AdsProgress"
      description="A task moving toward a known end. Not a meter: there is no threshold, only completion. The label names the task."
      :code="progressCode"
      :props="[
        { name: 'value', type: 'number', default: '—' },
        { name: 'max', type: 'number', default: '100' },
        { name: 'label', type: 'string', default: '—', desc: 'Required.' },
      ]"
    >
      <div class="block" style="max-width: 360px"><AdsProgress :value="46" label="Crawling" /></div>
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
      id="adssparkline"
      name="AdsSparkline"
      description="Change over time, beside the figure it explains. Point at it, or focus it and use the arrow keys, to read a value. `label` is required and names the chart."
      :code="sparkCode"
      :props="[
        { name: 'points', type: 'number[]', default: '—' },
        { name: 'label', type: 'string', default: '—', desc: 'Required — the accessible name.' },
        { name: 'unit', type: 'string', default: '' },
        { name: 'fill', type: 'boolean', default: 'true' },
        { name: 'pointLabel', type: '(i: number) => string', default: '#n', desc: 'Names a point in the readout.' },
      ]"
    >
      <div class="block"><AdsSparkline :points="spark" label="Sessions, last 12 weeks" unit="k" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adsbars"
      name="AdsBars"
      description="Comparing categories: horizontal bars, each with its figure as real text. Value maps to luminance as well as length."
      :code="barsCode"
      :props="[
        { name: 'data', type: '{ label, value }[]', default: '—' },
        { name: 'label', type: 'string', default: '—', desc: 'Required — names the figure and carries the unit.' },
      ]"
    >
      <div class="block" style="max-width: 420px"><AdsBars :data="bars" label="Crawls by weekday" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adsgauge"
      name="AdsGauge"
      description="A meter bent into a dial, for a rate that changes while you watch. Like the meter, its threshold is required."
      :code="gaugeCode"
      :props="[
        { name: 'value', type: 'number', default: '—' },
        { name: 'max', type: 'number', default: '100' },
        { name: 'threshold', type: 'number', default: '—', desc: 'Required — the notch on the arc.' },
        { name: 'label', type: 'string', default: '—', desc: 'Required.' },
        { name: 'unit', type: 'string', default: '' },
      ]"
    >
      <AdsGauge :value="68" :threshold="80" label="Coverage" unit="%" />
    </ComponentDoc>

    <ComponentDoc
      id="adsheatmap"
      name="AdsHeatmap"
      description="Density over two axes. Values are quantised into the four luminance grades, with recessive axes and a legend; the accessible name carries the shape and range."
      :code="heatCode"
      :props="[
        { name: 'values', type: 'number[][]', default: '—', desc: 'Rows of cells.' },
        { name: 'label', type: 'string', default: '—', desc: 'Required.' },
        { name: 'rowLabels', type: 'string[]', default: '—' },
        { name: 'colLabels', type: 'string[]', default: '—', desc: 'Empty strings skip a label.' },
        { name: 'max', type: 'number', default: 'largest value' },
        { name: 'unit', type: 'string', default: '' },
      ]"
    >
      <div class="block"><AdsHeatmap :values="heat" label="Crawl errors by weekday and hour" :row-labels="heatRows" :col-labels="heatCols" /></div>
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
      description="The workhorse. Numeric columns right-aligned in tabular figures with the unit in the header; text left. No striping. Sortable headers, a keyboard cursor (arrows, Home, End, Page Up/Down), and Enter or a click emits `select` — open the row in a drawer, never a modal."
      :code="gridCode"
      :props="[
        { name: 'columns', type: '{ key, label, unit?, numeric?, mono?, grade?, format? }[]', default: '—', desc: '`numeric` is inferred when every value is a number. `mono` is for identifiers and stays left-aligned.' },
        { name: 'rows', type: 'Record<string, string | number>[]', default: '—' },
        { name: 'caption', type: 'string', default: '—' },
        { name: '@select', type: '(row, index) => void', default: '—' },
      ]"
    >
      <div class="block stack gap-2">
        <AdsDataGrid :columns="columns" :rows="rows" caption="Top pages" @select="(r) => (picked = String(r.name))" />
        <p v-if="picked" class="dim">Selected <span class="num">{{ picked }}</span></p>
      </div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}

.count-demo {
  font-size: 1.6rem;
  margin: 0;
}

.count-demo .dim {
  font-size: 0.9rem;
}
</style>

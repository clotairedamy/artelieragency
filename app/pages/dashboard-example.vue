<script setup lang="ts">
definePageMeta({ layout: 'plain' })

useSeo({
  title: 'Dashboard example',
  path: '/dashboard-example',
  description:
    'A working dashboard built from ADS components, with every figure computed in Rust compiled to WebAssembly — and an annotation layer that explains which component each region is and which rule it follows.',
})

const engine = useEngine()

// ─── Controls ────────────────────────────────────────────────────────────

const CLASSES = [
  { label: '2xx', bit: 1 },
  { label: '3xx', bit: 2 },
  { label: '4xx', bit: 4 },
  { label: '5xx', bit: 8 },
]

const mask = ref(0b1111)
const maxDepth = ref(9)
const explain = ref(false)
const dense = ref(false)

const metrics = ref<Metrics | null>(null)
const plan = ref<PlanJob[]>([])
const rows = ref<Row[]>([])
const hist = ref<{ max: number; bins: number[] }>({ max: 0, bins: [] })

function refresh() {
  if (!engine.ready.value) return
  engine.filter(mask.value, maxDepth.value)
  metrics.value = engine.metrics()
  plan.value = engine.plan()
  rows.value = engine.rows(dense.value ? 20 : 12)
  hist.value = engine.latencyHistogram(14)
}

onMounted(async () => {
  await engine.load(600, 7)
  refresh()
})

watch([mask, maxDepth, dense], refresh)

function toggleClass(bit: number) {
  // Never let the filter empty itself — a control that can produce a blank
  // screen with no way back is a trap, not a filter.
  const next = mask.value ^ bit
  if (next !== 0) mask.value = next
}

const activeFilters = computed(() => {
  const out: string[] = []
  if (mask.value !== 0b1111) {
    out.push(CLASSES.filter((c) => mask.value & c.bit).map((c) => c.label).join(' · '))
  }
  if (maxDepth.value < 9) out.push(`depth ≤ ${maxDepth.value}`)
  return out
})

// Health is only meaningful against a threshold; 85 is where this product
// would start asking for attention.
const HEALTH_TARGET = 85

const gridCols = [
  { key: 'code', label: 'Code', mono: true },
  { key: 'depth', label: 'Depth', mono: true, align: 'end' as const },
  { key: 'words', label: 'Words', mono: true, align: 'end' as const },
  { key: 'inlinks', label: 'Inlinks', mono: true, align: 'end' as const },
  { key: 'latency', label: 'ms', mono: true, align: 'end' as const },
  { key: 'severity', label: 'Severity', grade: true, align: 'end' as const },
]

const gridRows = computed(() =>
  rows.value.map((r) => ({
    code: r.code,
    depth: r.depth,
    words: r.words.toLocaleString('en-GB'),
    inlinks: r.inlinks.toLocaleString('en-GB'),
    latency: r.latency,
    severity: r.severity,
  })),
)

const n = (v: number | undefined, d = 0) =>
  v === undefined ? '—' : v.toLocaleString('en-GB', { maximumFractionDigits: d })

// ─── The annotation layer ────────────────────────────────────────────────

// Each region of the dashboard, what it is in ADS, and the rule it obeys.
// Shown as numbered callouts when "Explain" is on.
const notes: Record<string, { n: number; component: string; href: string; rule: string }> = {
  filters: {
    n: 1, component: 'Filter bar + tags', href: '#ads-filter-bar',
    rule: 'One row above the data holding everything that changes it, with the applied state visible as removable tags. Scattered filters mean the reader cannot see the state they are in.',
  },
  kpis: {
    n: 2, component: 'KPI row', href: '#ads-kpi-row',
    rule: 'Four figures at most, ranked left to right by how often they are the reason someone opened the screen. A fifth means the screen has not decided what it is for.',
  },
  health: {
    n: 3, component: 'Meter', href: '#ads-meter',
    rule: 'A number without a threshold is trivia. The mark at 85 is the component — without it the fill says nothing about whether 92 is good.',
  },
  dist: {
    n: 4, component: 'Histogram', href: '#ads-chart-choice',
    rule: 'An average hides the shape. The median says 139ms; the distribution shows the tail that the median is quietly ignoring.',
  },
  split: {
    n: 5, component: 'Bars', href: '#ads-charts',
    rule: 'Ordered by value, horizontal, never a pie — angle is the hardest encoding to compare. Value drives width and brightness so the ranking survives a glance.',
  },
  plan: {
    n: 6, component: 'Ranked list', href: '#ads-disclosure-pattern',
    rule: 'Ten thousand rows is not a to-do list. Score is severity × reach ÷ effort, so a medium problem one template fixes outranks a critical one that is forty separate edits.',
  },
  grid: {
    n: 7, component: 'Data grid', href: '#ads-grid',
    rule: 'Numbers monospaced and right-aligned so a column is scanned downward. Rows separated by a whisper, not a rule. Past a few hundred rows, windowed.',
  },
  engine: {
    n: 8, component: 'Loading strategy', href: '#e-loading',
    rule: 'The engine is fetched and instantiated after first paint; until it answers, the panels hold their shape with skeletons at the real dimensions so nothing shifts when the data lands.',
  },
}
</script>

<template>
  <div class="page" :class="{ explaining: explain, dense }">
    <header class="screen-head">
      <div>
        <h1 class="screen-title ads-display">Dashboard example</h1>
        <p class="screen-sub num">
          <span class="live"><span class="dot" />rust · wasm</span>
          · {{ n(metrics?.corpus) }} pages crawled
        </p>
      </div>
      <div class="screen-tools">
        <label class="ads-choice">
          <input v-model="explain" type="checkbox">
          <span class="ads-switch" />
          Explain
        </label>
        <NuxtLink class="btn" to="/design-system">Design system →</NuxtLink>
      </div>
    </header>

    <section class="intro">
      <p v-reveal class="lede">
        A working dashboard assembled from ADS and nothing else. Every figure
        on it — the aggregates, the percentiles, the health score, the ranked
        plan and the result of every filter change — is computed in Rust
        compiled to WebAssembly, not hard-coded in the page. Turn on
        <strong>Explain</strong> to see what each region is and which rule it
        follows.
      </p>

      <div v-if="engine.failed.value" class="ads-banner">
        <span class="glyph"><Icon name="alert" :size="17" /></span>
        <span>The engine did not load, so there is nothing to show. A dashboard that silently renders zeros is worse than one that says why it is empty.</span>
      </div>
    </section>

    <!-- ═══ Filters ═════════════════════════════════════════════════════ -->
    <AdsNote v-bind="notes.filters!" :on="explain">
      <div class="filters card">
        <div class="filter-bar">
          <div class="ads-segmented" role="group" aria-label="Status class">
            <button
              v-for="c in CLASSES"
              :key="c.bit"
              type="button"
              :class="{ 'is-on': mask & c.bit }"
              :aria-pressed="!!(mask & c.bit)"
              @click="toggleClass(c.bit)"
            >{{ c.label }}</button>
          </div>

          <label class="depth">
            <span class="ads-label">Depth ≤ <span class="num">{{ maxDepth }}</span></span>
            <input v-model.number="maxDepth" class="ads-range" type="range" min="0" max="9">
          </label>

          <label class="ads-choice density">
            <input v-model="dense" type="checkbox">
            <span class="ads-switch" />
            Compact
          </label>
        </div>

        <div v-if="activeFilters.length" class="tags">
          <span class="ads-label">Applied</span>
          <span v-for="f in activeFilters" :key="f" class="ads-tag">
            {{ f }}
            <button type="button" aria-label="Clear" @click="mask = 0b1111; maxDepth = 9">×</button>
          </span>
          <span class="dim num matched">{{ n(metrics?.rows) }} of {{ n(metrics?.corpus) }} match</span>
        </div>
      </div>
    </AdsNote>

    <!-- ═══ KPIs ════════════════════════════════════════════════════════ -->
    <AdsNote v-bind="notes.kpis!" :on="explain">
      <div class="kpis">
        <template v-if="metrics">
          <StatTile :value="n(metrics.rows)" label="Pages" :note="`of ${n(metrics.corpus)} crawled`" />
          <StatTile :value="n(metrics.medianLatency)" unit="ms" label="Median latency" :note="`p95 ${n(metrics.p95Latency)}ms`" />
          <StatTile :value="n(metrics.issues)" label="Issues" :note="`${n(metrics.c4xx + metrics.c5xx)} are errors`" />
          <StatTile :value="n(metrics.avgWords)" label="Avg words" :note="`${n(metrics.totalMiB, 1)} MiB total`" />
        </template>
        <template v-else>
          <div v-for="i in 4" :key="i" class="ads-skeleton kpi-skel" />
        </template>
      </div>
    </AdsNote>

    <div class="split">
      <!-- ═══ Health ════════════════════════════════════════════════════ -->
      <AdsNote v-bind="notes.health!" :on="explain">
        <div class="card panel">
          <div class="panel-head">
            <span class="ads-label">Crawl health</span>
            <span v-if="metrics" class="ads-status" :class="metrics.health >= HEALTH_TARGET ? 'g1' : 'g4'">
              <span class="ads-dot" />{{ metrics.health >= HEALTH_TARGET ? 'at target' : 'below target' }}
            </span>
          </div>
          <div v-if="metrics" class="health">
            <span class="num health-figure">{{ n(metrics.health) }}</span>
            <span class="ads-meter">
              <i :style="{ width: `${metrics.health}%` }" />
              <b :style="{ left: `${HEALTH_TARGET}%` }" />
            </span>
            <span class="dim num">target {{ HEALTH_TARGET }}</span>
          </div>
          <div v-else class="ads-skeleton" style="height: 54px" />
        </div>
      </AdsNote>

      <!-- ═══ Latency distribution ══════════════════════════════════════ -->
      <AdsNote v-bind="notes.dist!" :on="explain">
        <div class="card panel">
          <div class="panel-head">
            <span class="ads-label">Latency distribution</span>
            <span v-if="metrics" class="chip num">0–{{ n(hist.max) }}ms</span>
          </div>
          <div v-if="hist.bins.length" class="hist">
            <span
              v-for="(b, i) in hist.bins"
              :key="i"
              class="hist-bar"
              :style="{
                height: `${Math.max(2, (b / Math.max(...hist.bins)) * 100)}%`,
                opacity: 0.35 + (b / Math.max(...hist.bins)) * 0.65,
              }"
              :title="`${b} pages`"
            />
          </div>
          <div v-else class="ads-skeleton" style="height: 86px" />
        </div>
      </AdsNote>
    </div>

    <div class="split">
      <!-- ═══ Status split ══════════════════════════════════════════════ -->
      <AdsNote v-bind="notes.split!" :on="explain">
        <div class="card panel">
          <span class="ads-label">By status class</span>
          <Bars
            v-if="metrics"
            :data="[
              { label: '2xx', value: metrics.c2xx },
              { label: '3xx', value: metrics.c3xx },
              { label: '4xx', value: metrics.c4xx },
              { label: '5xx', value: metrics.c5xx },
            ].filter((d) => d.value > 0)"
          />
          <div v-else class="ads-skeleton" style="height: 86px" />
        </div>
      </AdsNote>

      <!-- ═══ Ranked plan ═══════════════════════════════════════════════ -->
      <AdsNote v-bind="notes.plan!" :on="explain">
        <div class="card panel">
          <div class="panel-head">
            <span class="ads-label">What to fix first</span>
            <span class="chip num">severity × reach ÷ effort</span>
          </div>
          <ol v-if="plan.length" class="plan">
            <li v-for="(j, i) in plan" :key="j.name">
              <span class="num rank">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="job">
                <span class="job-name">{{ j.name }}</span>
                <span class="dim num job-math">
                  {{ j.severity }} × {{ n(j.reach) }} ÷ {{ j.effort }} edits
                </span>
              </span>
              <span class="num job-score">{{ n(j.score, 1) }}</span>
            </li>
          </ol>
          <p v-else-if="metrics" class="dim empty-note">Nothing matches the current filter.</p>
          <div v-else class="ads-skeleton" style="height: 110px" />
        </div>
      </AdsNote>
    </div>

    <!-- ═══ Grid ════════════════════════════════════════════════════════ -->
    <AdsNote v-bind="notes.grid!" :on="explain">
      <div class="card panel">
        <div class="panel-head">
          <span class="ads-label">Results</span>
          <span class="dim num">showing {{ gridRows.length }} of {{ n(metrics?.rows) }}</span>
        </div>
        <DataGrid v-if="gridRows.length" :columns="gridCols" :rows="gridRows" caption="Crawl results" />
        <div v-else class="ads-skeleton" style="height: 180px" />
      </div>
    </AdsNote>

    <!-- ═══ The engine ══════════════════════════════════════════════════ -->
    <AdsNote v-bind="notes.engine!" :on="explain">
      <div class="card panel engine-note">
        <span class="ads-label">The engine</span>
        <p class="body">
          <code>engine/src/lib.rs</code> compiles to an 8.9 KB
          <code>.wasm</code> with no <code>wasm-bindgen</code>: every export
          is numeric, and rows cross the boundary as a <code>Float64Array</code>
          view over linear memory. Filtering recomputes in Rust rather than in
          JavaScript, which is the arrangement that still holds at a hundred
          thousand rows.
        </p>
        <pre class="ads-code"><span class="tok">// the whole interop surface</span>
const { instance } = await WebAssembly.instantiate(bytes, {})
instance.exports.recompute(classMask, maxDepth)
new Float64Array(memory.buffer, rows_ptr(), len * stride)</pre>
      </div>
    </AdsNote>
  </div>
</template>

<style scoped>
.page {
  display: grid;
  gap: var(--gutter);
  padding: 0 clamp(20px, 4vw, 48px) clamp(40px, 6vw, 72px);
  max-width: var(--max);
  margin: 0 auto;
}

.dense {
  --gutter: 16px;
  --row-h: 28px;
}

/* ─── Head ─────────────────────────────────────────────────────────────── */

.screen-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(28px, 4vw, 44px) 0 26px;
  border-bottom: 1px solid var(--line);
}

.screen-title {
  font-size: clamp(1.9rem, 4vw, 2.6rem);
  font-variation-settings: 'opsz' 32;
}

.screen-sub {
  margin-top: 6px;
  font-size: 0.78rem;
  color: var(--subdued);
}

.live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text);
}

.live .dot {
  animation: pulse 2.4s var(--ease) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.screen-tools {
  display: flex;
  align-items: center;
  gap: 16px;
}

.intro {
  display: grid;
  gap: 16px;
  padding: 8px 0 4px;
}

.intro .lede {
  max-width: 66ch;
}

.intro strong {
  color: var(--text);
  font-weight: 560;
}

/* ─── Filters ──────────────────────────────────────────────────────────── */

.filters {
  display: grid;
  gap: 16px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.depth {
  display: grid;
  gap: 8px;
  flex: 1 1 180px;
  min-width: 150px;
}

.density {
  margin-left: auto;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.matched {
  margin-left: auto;
  font-size: 0.76rem;
}

/* ─── Layout ───────────────────────────────────────────────────────────── */

.kpis {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
}

@media (min-width: 620px) {
  .kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.kpi-skel {
  height: 86px;
  border-radius: var(--radius-sm);
}

.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--gutter);
}

@media (min-width: 860px) {
  .split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.panel {
  display: grid;
  gap: 16px;
  align-content: start;
}

.panel-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* ─── Health ───────────────────────────────────────────────────────────── */

.health {
  display: grid;
  gap: 12px;
}

.health-figure {
  font-size: 2.3rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;
}

.health .dim {
  font-size: 0.74rem;
}

/* ─── Histogram ────────────────────────────────────────────────────────── */

.hist {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  align-items: end;
  gap: 3px;
  height: 86px;
}

.hist-bar {
  background: var(--accent);
  border-radius: 3px 3px 1px 1px;
  transition:
    height 0.5s var(--ease),
    opacity 0.5s var(--ease);
}

/* ─── Plan ─────────────────────────────────────────────────────────────── */

.plan {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.plan li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 13px;
  padding: 9px 11px;
  border-radius: 9px;
  transition: background 0.2s var(--ease);
}

.plan li:hover {
  background: var(--hover);
}

.plan li:first-child {
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.rank {
  font-size: 0.72rem;
  color: var(--accent);
}

.job {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.job-name {
  font-size: 0.9rem;
  color: var(--text);
}

.job-math {
  font-size: 0.68rem;
}

.job-score {
  font-size: 0.95rem;
  color: var(--text);
}

.empty-note {
  font-size: 0.87rem;
  margin: 0;
}

/* ─── Engine ───────────────────────────────────────────────────────────── */

.engine-note .body {
  max-width: 70ch;
  font-size: 0.88rem;
}

.engine-note code {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-soft);
}
</style>

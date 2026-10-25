<script setup lang="ts">
const { studio } = useAppConfig()

useSeo({
  title: 'Home',
  path: '/',
  description:
    'Artelier is a dashboard and data-UI studio. We design SaaS dashboards, admin panels, BI and analytics interfaces, and ship them as working front-end code and design tokens — not a folder of Figma frames.',
})

// The hero reads the visit it is part of. See usePageMetrics for why none of
// these numbers are invented.
const { scroll, dwell, fps, viewport, sectionsSeen } = usePageMetrics()

const failures = [
  { symptom: 'Everything is the same size', cost: 'No answer to "what first?"', where: 'KPI row', grade: 4 },
  { symptom: 'Colour used for decoration', cost: 'Meaningful colour goes unread', where: 'Charts', grade: 4 },
  { symptom: 'Numbers set in a proportional face', cost: 'Columns cannot be scanned', where: 'Tables', grade: 3 },
  { symptom: 'Filters that lose their state', cost: 'The same work, done twice', where: 'Toolbar', grade: 3 },
  { symptom: 'Empty states that say "No data"', cost: 'New users never start', where: 'First run', grade: 4 },
  { symptom: 'A chart per metric, forever', cost: 'Scrolling instead of knowing', where: 'Overview', grade: 2 },
  { symptom: 'Density that cannot be changed', cost: 'Power users leave for a CSV', where: 'Grid', grade: 2 },
]

const columns = [
  { key: 'symptom', label: 'Symptom' },
  { key: 'where', label: 'Where', mono: true },
  { key: 'cost', label: 'What it costs' },
  { key: 'grade', label: 'Severity', grade: true, align: 'end' as const },
]

const services = [
  {
    icon: 'dashboard',
    name: 'Dashboard & data UI',
    body: 'SaaS dashboards, admin panels, BI and analytics interfaces. We start from the decision the screen exists to support, then work backwards to the chart.',
    tags: ['Information design', 'Charts & tables', 'Empty & loading states'],
  },
  {
    icon: 'system',
    name: 'Design systems in code',
    body: 'Tokens, components and themes delivered as a working library your engineers import — light and dark, density modes, and the documentation that keeps it alive.',
    tags: ['Tokens', 'Component library', 'Theming'],
  },
  {
    icon: 'signal',
    name: 'Instrumentation',
    body: 'What to measure, how to show it, and how to tell a real signal from a flattering one. The part most dashboards skip, and the reason so many go unread.',
    tags: ['Metric design', 'Thresholds', 'Reporting'],
  },
]

// The phases themselves live in GanttChart.vue, since the chart owns their
// extents. This is only what we build them with.
const stack = ['Flutter', 'Rust', 'iOS', 'TypeScript']

const principles = [
  { n: '01', name: 'Cards, not strips', body: 'Every block of content is a card with the same radius and padding. Alignment comes from one shared gutter, not from rules drawn between full-width bars.' },
  { n: '02', name: 'Numbers are monospaced', body: 'Counts, codes and durations line up column to column, so the eye scans down a column instead of reading across a row.' },
  { n: '03', name: 'One accent, spent once', body: 'Colour carries meaning — severity, status, the next action. Spending it on decoration is what makes the meaningful uses invisible.' },
  { n: '04', name: 'Depth over ornament', body: 'Hierarchy comes from elevation and value. A surface that is raised is available; a surface pressed in is holding something.' },
]

// Deterministic series, so the server and client renders agree.
const traffic = [14, 19, 17, 26, 31, 28, 37, 34, 42, 51, 47, 58, 63, 59, 71]
const latency = [62, 58, 61, 49, 52, 44, 47, 39, 41, 36, 33, 35, 29, 31, 26]
const adoption = [
  { label: 'Overview', value: 92 },
  { label: 'Reports', value: 64 },
  { label: 'Segments', value: 38 },
  { label: 'Exports', value: 21 },
]
</script>

<template>
  <div class="page">
    <!-- ─── Overview ──────────────────────────────────────────────────── -->
    <section id="overview" class="screen hero">
      <header class="screen-head">
        <div>
          <h1 class="screen-title">Overview</h1>
          <p class="screen-sub num">
            <span class="live"><span class="dot" />live</span> · this session
          </p>
        </div>
        <div class="screen-tools">
          <span class="chip num">{{ studio.domain }}</span>
          <NuxtLink class="btn btn-accent" to="/contact">
            <Icon name="spark" :size="18" />
            Start a project
          </NuxtLink>
        </div>
      </header>

      <div class="hero-body">
        <div class="hero-copy">
          <span v-reveal class="eyebrow">Dashboard &amp; data-UI studio</span>
          <h2 v-reveal="60" class="h1 promise">{{ studio.promise }}</h2>
          <p v-reveal="120" class="lede">
            Most products ship a capable engine behind a screen nobody can
            read. We design that screen — analytics, admin, BI, internal
            tools — and hand it over as working front-end code and a token
            set, not a folder of frames.
          </p>
          <div v-reveal="180" class="hero-actions">
            <a class="btn btn-accent" href="#problem">
              See what we fix
              <Icon name="arrow" :size="18" />
            </a>
            <a class="btn" href="#lab">Play with the theme</a>
          </div>
        </div>

        <!-- The instrument panel. Real readings from the visit in progress. -->
        <aside v-reveal="120" class="hero-panel card">
          <div class="panel-head">
            <span class="eyebrow">Session telemetry</span>
            <span class="chip num"><span class="dot" />measuring</span>
          </div>
          <div class="panel-body">
            <Gauge :value="scroll" :max="100" label="scrolled" unit="%" />
            <div class="tiles">
              <StatTile :value="dwell" unit="s" label="dwell" note="on this page" />
              <StatTile :value="fps" unit="fps" label="paint" note="your browser" />
              <StatTile :value="sectionsSeen" label="sections read" :note="`of 8`" />
              <StatTile
                :value="`${viewport.w}×${viewport.h}`"
                label="viewport"
                note="css pixels"
              />
            </div>
          </div>
          <p class="panel-foot body">
            Measured from your visit, in your browser, and sent nowhere. It
            seemed dishonest to open a dashboard studio with a fake chart.
          </p>
        </aside>
      </div>
    </section>

    <!-- ─── The problem ───────────────────────────────────────────────── -->
    <section id="problem" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">The problem</span>
        <h2 class="h2">Ten thousand rows is not an answer.</h2>
        <p class="lede">
          Dashboards rarely fail because the data is wrong. They fail because
          every number is given the same weight, and the reader is left to do
          the ranking the software should have done. Here is the list we work
          through on a first read — sort it, the header works.
        </p>
      </div>
      <div v-reveal>
        <DataGrid :columns="columns" :rows="failures" caption="How dashboards fail" />
      </div>
    </section>

    <!-- ─── Services ──────────────────────────────────────────────────── -->
    <section id="services" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">What we do</span>
        <h2 class="h2">Three things, done properly.</h2>
        <p class="lede">
          A small studio, so the work is narrow on purpose. If your problem is
          a marketing site or a mobile app, we are the wrong people and will
          say so on the first call.
        </p>
      </div>
      <div class="grid grid-3">
        <article
          v-for="(s, i) in services"
          :key="s.name"
          v-reveal="i * 90"
          class="card card-press service"
        >
          <span class="tile"><Icon :name="s.icon" :size="20" /></span>
          <h3 class="h3">{{ s.name }}</h3>
          <p class="body">{{ s.body }}</p>
          <ul class="tags">
            <li v-for="t in s.tags" :key="t" class="chip">{{ t }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- ─── Theme lab ─────────────────────────────────────────────────── -->
    <section id="lab" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">Theme lab</span>
        <h2 class="h2">A design system is not a picture of one.</h2>
        <p class="lede">
          This page is built from the same kind of token set we hand to
          clients. Which means you can take it apart from here, live, without
          a build step — and so can their engineers.
        </p>
      </div>
      <div v-reveal>
        <ThemeLab />
      </div>
    </section>

    <!-- ─── Component shelf ───────────────────────────────────────────── -->
    <section id="shelf" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">Components</span>
        <h2 class="h2">The vocabulary.</h2>
        <p class="lede">
          Every chart here is drawn by hand — no charting library, no icon
          package. It keeps the page under a tenth of the weight of a typical
          agency site, and it means a chart can be made to match a design
          rather than the other way round.
        </p>
      </div>
      <div class="grid grid-2">
        <article v-reveal class="card shelf-card">
          <div class="shelf-head">
            <span class="eyebrow">Trend</span>
            <span class="chip num">+408%</span>
          </div>
          <Sparkline :points="traffic" />
          <p class="body">Smoothed series with a fading fill. One path, no dependency.</p>
        </article>

        <article v-reveal="90" class="card shelf-card">
          <div class="shelf-head">
            <span class="eyebrow">Inverse trend</span>
            <span class="chip num">−58%</span>
          </div>
          <Sparkline :points="latency" />
          <p class="body">The same component, reading a metric where down is good.</p>
        </article>

        <article v-reveal class="card shelf-card">
          <div class="shelf-head">
            <span class="eyebrow">Feature adoption</span>
            <span class="chip num">4 of 4</span>
          </div>
          <Bars :data="adoption" />
          <p class="body">Value drives width and brightness, so the ranking survives a glance.</p>
        </article>

        <article v-reveal="90" class="card shelf-card">
          <div class="shelf-head">
            <span class="eyebrow">Activity density</span>
            <span class="chip num">24 × 7</span>
          </div>
          <Heatmap />
          <p class="body">Opacity as magnitude — the channel the eye reads fastest.</p>
        </article>
      </div>
    </section>

    <!-- ─── Process ───────────────────────────────────────────────────── -->
    <section id="process" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">Process</span>
        <h2 class="h2">One to three months, end to end.</h2>
        <p class="lede">
          Set the length and the plan rescales — a four-week job and a
          twelve-week job are the same shape at different sizes. Drag the
          marker to see what is running in any given week, or pick a phase to
          read what it involves.
        </p>
      </div>
      <div v-reveal>
        <GanttChart />
      </div>
      <p v-reveal class="stack body">
        <span class="eyebrow">Built in</span>
        <span v-for="t in stack" :key="t" class="chip">{{ t }}</span>
      </p>
    </section>

    <!-- ─── Principles ────────────────────────────────────────────────── -->
    <section id="principles" class="screen">
      <div v-reveal class="section-head">
        <span class="eyebrow">Principles</span>
        <h2 class="h2">The rules this page is built on.</h2>
        <p class="lede">
          Stated plainly, because a studio should be willing to be held to its
          own work. Everything you have scrolled through follows all four.
        </p>
      </div>
      <div class="grid grid-2">
        <article
          v-for="(p, i) in principles"
          :key="p.n"
          v-reveal="i * 70"
          class="card card-press law"
        >
          <span class="num law-n">{{ p.n }}</span>
          <div>
            <h3 class="h3">{{ p.name }}</h3>
            <p class="body">{{ p.body }}</p>
          </div>
        </article>
      </div>
    </section>

    <CtaBand />
  </div>
</template>

<style scoped>
.page {
  padding: 0 clamp(20px, 4vw, 48px);
}

.screen {
  max-width: var(--max);
  margin: 0 auto;
  padding: clamp(64px, 9vw, 104px) 0;
}

.screen + .screen {
  border-top: 1px solid var(--line);
}

/* ─── Screen header, as in the app ─────────────────────────────────────── */

.hero {
  padding-top: clamp(28px, 4vw, 44px);
}

.screen-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--line);
}

.screen-title {
  font-size: clamp(1.7rem, 3vw, 2.1rem);
  font-weight: 560;
  letter-spacing: -0.03em;
}

.screen-sub {
  margin-top: 4px;
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
  50% { opacity: 0.25; }
}

.screen-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Below the rail's breakpoint the mobile top bar already carries the brand
   and the one action, so the screen header's copy of them would be the same
   button twice on one screen. */
@media (max-width: 899px) {
  .screen-tools {
    display: none;
  }
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */

.hero-body {
  display: grid;
  gap: clamp(32px, 5vw, 52px);
  padding-top: clamp(40px, 6vw, 64px);
}

/* Two columns only once the right-hand column is wide enough to hold a dial
   and two tiles side by side. Below that the panel is better off full width
   than squeezed — at 1024px the readings were being clipped. */
@media (min-width: 1140px) {
  .hero-body {
    grid-template-columns: 1.02fr 0.98fr;
    align-items: center;
  }
}

.hero-copy {
  display: grid;
  gap: 20px;
  align-content: start;
}

.promise {
  max-width: 14ch;
}

.hero-copy .lede {
  max-width: 50ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 6px;
}

/* The panel lays itself out against its own width rather than the window's,
   so it reflows correctly whether it is sitting in the hero's second column
   or running full width underneath. */
.hero-panel {
  display: grid;
  gap: 20px;
  container-type: inline-size;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-body {
  display: grid;
  gap: 20px;
  align-items: center;
  justify-items: center;
}

@container (min-width: 440px) {
  .panel-body {
    grid-template-columns: auto 1fr;
  }
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
}

.panel-foot {
  font-size: 0.82rem;
  border-top: 1px solid var(--line);
  padding-top: 16px;
  margin: 0;
}

/* ─── Services ─────────────────────────────────────────────────────────── */

.service {
  display: grid;
  gap: 13px;
  align-content: start;
}

.service .tile {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
  margin-bottom: 4px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
}

.tags .chip {
  font-size: 0.68rem;
}

/* ─── Shelf ────────────────────────────────────────────────────────────── */

.shelf-card {
  display: grid;
  gap: 16px;
  align-content: start;
}

.shelf-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.shelf-card .body {
  font-size: 0.85rem;
  margin: 0;
}

/* ─── Stack strip ──────────────────────────────────────────────────────── */

.stack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  margin: 22px 0 0;
}

.stack .eyebrow {
  margin-right: 5px;
}

/* ─── Principles ───────────────────────────────────────────────────────── */

.law {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  align-items: start;
}

.law-n {
  font-size: 0.82rem;
  color: var(--accent);
  padding-top: 3px;
}

.law h3 {
  margin-bottom: 8px;
}
</style>

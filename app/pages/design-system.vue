<script setup lang="ts">
definePageMeta({ layout: 'ads' })

const { adsComponentCount } = useAdsManifest()

useSeo({
  title: 'ADS — Artelier Design System',
  path: '/design-system',
  description:
    'The Artelier Design System: monochrome soft-UI components, a validated data-colour system, and the layout and engineering rules behind dashboards for data-rich applications.',
})

// ─── Live specimen state ─────────────────────────────────────────────────

const checks = reactive({ a: true, b: false })
const radio = ref('weekly')
const toggles = reactive({ live: true, compact: false })
const slider = ref(62)
const segment = ref('24h')
const tab = ref('internal')
const page = ref(3)
const field = ref('')
const count = ref(24)
const tags = ref(['status: 4xx', 'depth ≤ 3', 'indexable'])

// ─── Foundations ─────────────────────────────────────────────────────────

const surfaces = [
  { token: '--canvas', note: 'behind everything' },
  { token: '--rail', note: 'the sidebar' },
  { token: '--surface', note: 'the frame, and every well' },
  { token: '--raised', note: 'cards' },
  { token: '--elevated', note: 'chips, bars, overlays' },
  { token: '--hover', note: 'row hover' },
]

const depths = [
  { token: '--soft-raised-sm', label: 'sm', note: 'controls, rows' },
  { token: '--soft-raised', label: 'md', note: 'cards' },
  { token: '--soft-raised-lg', label: 'lg', note: 'the frame, overlays' },
  { token: '--soft-inset', label: 'inset', note: 'wells, fields' },
]

const radii = [
  { token: '--radius-lg', note: 'the frame' },
  { token: '--radius', note: 'cards' },
  { token: '--radius-sm', note: 'controls' },
  { token: '--pill', note: 'chips, meters' },
]

const typeScale = [
  { name: 'Display', font: 'var(--font-display)', size: '2.6rem', sample: 'Dashboards', note: 'Bricolage Grotesque · opsz' },
  { name: 'Heading', font: 'var(--font-display)', size: '1.3rem', sample: 'Response codes', note: 'Bricolage Grotesque' },
  { name: 'Body', font: 'var(--font)', size: '0.97rem', sample: 'Every number has a threshold.', note: 'Inter Tight' },
  { name: 'Label', font: 'var(--font-label)', size: '0.62rem', sample: 'SEVERITY', note: 'Martian Mono · wdth' },
  { name: 'Data', font: 'var(--mono)', size: '0.95rem', sample: '1,284 · 301 · 74ms', note: 'JetBrains Mono · tnum' },
]

const motionScale = [
  { name: 'Control', ms: '200–300ms', note: 'hover, press, check' },
  { name: 'Transition', ms: '420ms', note: 'the rail, the tab' },
  { name: 'Entrance', ms: '750ms', note: 'reveal, chart draw' },
  { name: 'Easing', ms: 'cubic-bezier(.22,1,.36,1)', note: 'one curve, everywhere' },
]

const glyphs = [
  'dashboard', 'signal', 'growth', 'gauge', 'discovery', 'blueprint', 'system',
  'prototype', 'access', 'handoff', 'engine', 'theme', 'audit', 'table',
]

// ─── Colour ──────────────────────────────────────────────────────────────

// Run through the data-viz validator against both ADS surfaces: all checks
// pass on #1e1e22 and #ececef. The light run returned one obligation, which
// is documented in the colour-vision block rather than buried.
const categorical = [
  { slot: 1, hue: 'blue', dark: '#3987e5', light: '#2a78d6' },
  { slot: 2, hue: 'orange', dark: '#d95926', light: '#eb6834' },
  { slot: 3, hue: 'aqua', dark: '#199e70', light: '#1baf7a' },
  { slot: 4, hue: 'yellow', dark: '#c98500', light: '#eda100' },
  { slot: 5, hue: 'magenta', dark: '#d55181', light: '#e87ba4' },
  { slot: 6, hue: 'green', dark: '#008300', light: '#008300' },
  { slot: 7, hue: 'violet', dark: '#9085e9', light: '#6250d6' },
  { slot: 8, hue: 'red', dark: '#e66767', light: '#e34948' },
]

// Chosen in OKLCH and checked three ways — see the block's own notes.
const brand = [
  { role: 'primary', pigment: 'Tyrian', note: 'the mark, identity moments', token: '--brand-primary', dark: '#b66dcc', light: '#8a4e9c', dE: '11.2' },
  { role: 'secondary', pigment: 'Verdigris', note: 'supporting identity, links in marketing', token: '--brand-secondary', dark: '#2b96a4', light: '#006981', dE: '8.7' },
]

const semantic = [
  { role: 'success', pigment: 'Celadon', note: 'completed, healthy, within target', token: '--ok', dark: '#7bc062', light: '#317905' },
  { role: 'warning', pigment: 'Orpiment', note: 'approaching a threshold, stale, pending', token: '--warn', dark: '#d88c00', light: '#9d5500' },
  { role: 'danger', pigment: 'Vermilion', note: 'failed, destructive, over threshold', token: '--bad', dark: '#e55458', light: '#9e001f' },
]

const sequential = ['#0e2a47', '#143c66', '#1a5088', '#2466ab', '#2f7ccb', '#5a9bdb', '#8cbaea']
const monoRamp = ['#131315', '#26262a', '#3a3a41', '#5c5c64', '#86868e', '#b9b9c1', '#f3f3f5']
const diverging = ['#b5461f', '#d08a5e', '#e0bda6', '#86868e', '#a9c3d8', '#5a9bdb', '#2466ab']

const chartChoice = [
  ['Change over time', 'Line, or a sparkline beside the figure', 'Minimal grid; label the first and last value, never every point'],
  ['Comparing categories', 'Horizontal bars, ordered by value', 'Never a pie — angle is the hardest encoding to compare'],
  ['One headline number', 'Stat tile with a delta', 'A figure with no comparison is trivia; pair it with a target or a prior period'],
  ['Part of a whole', 'Stacked bar, or just the percentage', 'Two or three parts at most, or it becomes a pie lying down'],
  ['Distribution', 'Histogram or box plot', 'An average hides the shape; show the spread where the spread is the point'],
  ['Density over two axes', 'Heatmap', 'Opacity for magnitude — the channel the eye reads fastest'],
  ['Progress to a target', 'Meter with a threshold mark', 'The mark is the component; without it the fill means nothing'],
  ['Relationship', 'Scatter', 'Three series maximum — any two marks can sit side by side'],
]

// ─── Specimen data ───────────────────────────────────────────────────────

const gridCols = [
  { key: 'code', label: 'Code', mono: true },
  { key: 'url', label: 'URL', mono: true },
  { key: 'words', label: 'Words', mono: true, align: 'end' as const },
  { key: 'grade', label: 'Severity', grade: true, align: 'end' as const },
]

const gridRows = [
  { code: 200, url: '/pricing', words: 1286, grade: 1 },
  { code: 301, url: '/blog/old-post', words: 330, grade: 3 },
  { code: 404, url: '/careers/2019', words: 0, grade: 4 },
  { code: 200, url: '/docs/getting-started', words: 912, grade: 2 },
]

const series = [12, 19, 15, 24, 31, 27, 38, 35, 44, 52, 48, 61]
const adoption = [
  { label: 'Overview', value: 92 },
  { label: 'Reports', value: 61 },
  { label: 'Exports', value: 24 },
]

const grades = [
  { token: '--grade-4', label: 'critical' },
  { token: '--grade-3', label: 'high' },
  { token: '--grade-2', label: 'medium' },
  { token: '--grade-1', label: 'low' },
]

const checklist = [
  'Name the personas and the three questions the screen answers, before any layout.',
  'Put the top-level answer where the eye lands first; push granularity down the page.',
  'Pair every headline figure with a threshold, a target or a prior period.',
  'Give the reader a density control rather than picking a row height for them.',
  'Serialise filters and sort into the URL so a view can be sent to a colleague.',
  'Virtualise any table that can exceed a few hundred rows.',
  'Stream the cheap panels first; skeleton the rest at their real dimensions.',
  'Test the screen desaturated, at 200% zoom, and with the keyboard only.',
  'Load it with a realistic payload before calling it finished.',
]
</script>

<template>
  <div class="page">
    <!-- ─── Masthead ──────────────────────────────────────────────────── -->
    <header class="masthead">
      <div>
        <h1 class="screen-title ads-display">ADS</h1>
        <p class="screen-sub num">
          Artelier Design System · v1.0 · {{ adsComponentCount }} entries
        </p>
      </div>
      <div class="screen-tools">
        <span class="chip num"><span class="dot" />in use</span>
        <NuxtLink class="btn" to="/">← Site</NuxtLink>
      </div>
    </header>

    <!-- ─── Index column + content ────────────────────────────────────── -->
    <div class="ads-shell">
      <AdsContents class="index-col" />

      <div class="content">
        <section class="intro">
          <p v-reveal class="lede">
            The building blocks every Artelier dashboard is assembled from, plus
            the layout, colour and engineering rules that decide how they go
            together. Monochrome soft UI: nothing has a border, shape comes from
            two shadows on a surface the same colour as its background, and
            hierarchy is elevation and value rather than hue.
          </p>

          <div v-reveal="90" class="intro-rules">
            <div
              v-for="(r, i) in [
                ['The chrome is grey so the data can be coloured', 'Interface colour and data colour compete for the same channel. We give the whole channel to the data.'],
                ['Depth is the only decoration', 'A raised surface is available; a surface pressed in is holding something. No ornament beyond the shadow pair.'],
                ['Numbers are monospaced', 'Counts, codes and durations line up column to column, so a column is scanned downward instead of read across.'],
                ['Every component names its tokens', 'Change a token and everything listing it moves together. That is the difference between a system and a style guide.'],
              ]"
              :key="i"
              class="intro-rule"
            >
              <span class="num rule-n">{{ String(i + 1).padStart(2, '0') }}</span>
              <div>
                <h3 class="rule-name">{{ r[0] }}</h3>
                <p class="body">{{ r[1] }}</p>
              </div>
            </div>
          </div>

          <div v-reveal="150" class="ads-banner compare">
            <span class="glyph"><Icon name="alert" :size="17" /></span>
            <span>
              <strong>How this differs from a general-purpose system.</strong>
              Carbon, Material and Fluent list components alphabetically and
              leave the decisions to you — they have to, because they do not
              know what you are building. ADS is narrow on purpose, for
              data-rich screens only, so it can take positions those systems
              cannot: contents ordered by job rather than by spelling, one
              validated data palette rather than a themeable one, a
              chart-selection table rather than a chart gallery, and an
              engineering section — because at ten thousand rows the rendering
              strategy <em>is</em> a design decision.
            </span>
          </div>
        </section>

        <!-- ═══ Foundations ═══════════════════════════════════════════ -->
        <section id="foundations" class="band">
          <AdsSectionHead
            eyebrow="01 — Foundations"
            title="The variables everything else reads."
            lede="Six surfaces, four depths, four radii, five type roles and one easing curve. Every component below is a composition of these and nothing more."
          />

          <div class="found-grid">
            <div id="f-value" class="found card">
              <h3 class="found-name">Value scale</h3>
              <p class="body">Six steps in a narrow band. Neumorphism needs a mid-tone so a shadow has room to go lighter <em>and</em> darker — pure black leaves nowhere to fall.</p>
              <ul class="swatches">
                <li v-for="s in surfaces" :key="s.token">
                  <span class="sw" :style="{ background: `var(${s.token})` }" />
                  <code>{{ s.token }}</code>
                  <span class="dim">{{ s.note }}</span>
                </li>
              </ul>
            </div>

            <div id="f-elevation" class="found card">
              <h3 class="found-name">Elevation</h3>
              <p class="body">A tight contact shadow reads as thickness; a wide soft fall seats the shape on the page. One blur gives you one or the other and looks printed on.</p>
              <div class="depths">
                <div v-for="d in depths" :key="d.token" class="depth">
                  <span class="depth-box" :style="{ boxShadow: `var(${d.token})` }">{{ d.label }}</span>
                  <code>{{ d.token }}</code>
                  <span class="dim">{{ d.note }}</span>
                </div>
              </div>
            </div>

            <div id="f-radius" class="found card">
              <h3 class="found-name">Radius</h3>
              <p class="body">Large on purpose. Soft UI reads as moulded rather than drawn, and a tight 8pt corner looks like a stock dashboard again.</p>
              <div class="radii">
                <div v-for="r in radii" :key="r.token" class="radius">
                  <span class="radius-box" :style="{ borderRadius: `var(${r.token})` }" />
                  <code>{{ r.token }}</code>
                  <span class="dim">{{ r.note }}</span>
                </div>
              </div>
            </div>

            <div id="f-motion" class="found card">
              <h3 class="found-name">Motion</h3>
              <p class="body">One easing curve everywhere. Three durations, chosen by how far the thing has to travel. All of it collapses under reduced motion.</p>
              <ul class="motion-list">
                <li v-for="m in motionScale" :key="m.name">
                  <span>{{ m.name }}</span>
                  <code>{{ m.ms }}</code>
                  <span class="dim">{{ m.note }}</span>
                </li>
              </ul>
            </div>

            <div id="f-type" class="found card wide">
              <h3 class="found-name">Type</h3>
              <p class="body">Four families, each with a job. The display face carries personality at size; the UI face stays legible at 13px in a dense grid, which the display face would not.</p>
              <ul class="type-list">
                <li v-for="t in typeScale" :key="t.name">
                  <span class="ads-label">{{ t.name }}</span>
                  <span class="type-sample" :style="{ fontFamily: t.font, fontSize: t.size }">{{ t.sample }}</span>
                  <span class="dim type-note">{{ t.note }}</span>
                </li>
              </ul>
            </div>

            <div id="f-icons" class="found card wide">
              <h3 class="found-name">Iconography</h3>
              <p class="body">A 24px grid, a 1.6 stroke, round caps. Two tones: the frame or track recedes, the thing the glyph is about sits at full strength. Frames take the interface's rounded corners, and a solid dot marks the value.</p>
              <ul class="glyph-grid">
                <li v-for="g in glyphs" :key="g">
                  <span class="glyph-tile"><Icon :name="g" :size="22" /></span>
                  <code>{{ g }}</code>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- ═══ Colour ════════════════════════════════════════════════ -->
        <section id="colour" class="band">
          <AdsSectionHead
            eyebrow="02 — Colour"
            title="Grey chrome, coloured data."
            lede="A dashboard has one colour channel and two things competing for it. ADS settles the argument by giving the whole channel to the data and leaving the interface in greyscale."
          />

          <div class="specs">
            <AdsSpec
              id="c-thesis"
              name="The thesis"
              role="Interface colour and data colour draw on the same perceptual budget. Spend it on toolbars and the one red bar that matters stops being visible."
              :tokens="['--accent', '--grade-1…4', '--subdued']"
              wide
            >
              <div class="thesis">
                <div class="thesis-col">
                  <span class="ads-label">Interface — greyscale</span>
                  <p class="body">Surfaces, controls, type and state live in six greys plus white. Hierarchy comes from elevation and value. The accent — pure white in dark mode, near-black in light — is reserved for the one action per screen.</p>
                </div>
                <div class="thesis-col">
                  <span class="ads-label">Data — the full channel</span>
                  <p class="body">Charts get hue, and they get it exclusively. A coloured mark on a grey page is unmissable, which is the entire argument: colour means something here because nothing else is using it.</p>
                </div>
              </div>
              <template #use>
                <li>Hue inside the plot area, greyscale everywhere outside it.</li>
                <li>Text in text tokens, never in a series colour — the mark beside it carries identity.</li>
              </template>
              <template #avoid>
                <li>Brand colour on chrome. It competes with the data for the only channel that encodes meaning.</li>
                <li>Colouring nominal bars by their own value — that re-encodes what bar length already shows and spends the identity channel for nothing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-brand"
              name="Brand & semantic"
              role="Five colours Artelier keeps. Two carry the identity, three carry state — and the two sets never borrow from each other, because a brand colour that also means 'error' means nothing."
              :tokens="['--brand-primary', '--brand-secondary', '--ok', '--warn', '--bad']"
              wide
            >
              <div class="brand-block">
                <div>
                  <span class="ads-label">Brand — identity only, never a chrome fill</span>
                  <div class="brand-row">
                    <div v-for="b in brand" :key="b.role" class="brand-card">
                      <span class="brand-chip" :style="{ background: b.dark }" />
                      <span class="brand-chip is-light" :style="{ background: b.light }" />
                      <div class="brand-meta">
                        <span class="brand-name">{{ b.pigment }}</span>
                        <code>{{ b.token }}</code>
                        <span class="dim">{{ b.note }}</span>
                        <span class="num brand-de">{{ b.dE }} ΔE from the nearest known brand</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span class="ads-label">Semantic — locked meanings, always with a glyph</span>
                  <div class="brand-row">
                    <div v-for="t in semantic" :key="t.role" class="brand-card">
                      <span class="brand-chip" :style="{ background: t.dark }" />
                      <span class="brand-chip is-light" :style="{ background: t.light }" />
                      <div class="brand-meta">
                        <span class="brand-name">{{ t.pigment }}</span>
                        <code>{{ t.token }}</code>
                        <span class="dim">{{ t.note }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="ads-banner">
                  <span class="glyph"><Icon name="alert" :size="17" /></span>
                  <span>
                    The semantic three sit close to the conventional
                    green/amber/red on purpose — Celadon is 6.1 ΔE from
                    Supabase's green, Vermilion 3.0 from Tailwind's red. That
                    is not a miss. A success colour nobody recognises is a
                    failed success colour. The uniqueness lives in the brand
                    pair, where it costs nothing to be unfamiliar.
                  </span>
                </div>
              </div>
              <template #states>
                <span class="ads-status" style="color: var(--ok)"><span class="ads-dot" />healthy</span>
                <span class="ads-status" style="color: var(--warn)"><span class="ads-dot" />stale</span>
                <span class="ads-status" style="color: var(--bad)"><span class="ads-dot" />failed</span>
              </template>
              <template #use>
                <li>Brand on the mark and on identity moments; semantic on state. Never the reverse.</li>
                <li>Inside dense data — a severity column, a heat grid — keep the luminance grades instead. Three hues repeated down four hundred rows is noise, not meaning.</li>
              </template>
              <template #avoid>
                <li>Brand colour as a surface or a toolbar fill. The chrome is grey so that these five mean something when they appear.</li>
                <li>A sixth. If something needs its own colour, it is probably a state that already has one.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-categorical"
              name="Categorical palette"
              role="Identity — which series is which. Eight hues in a fixed order, assigned in sequence and never cycled. The order is the colour-blindness safety mechanism, so it does not change."
              :tokens="['--series-1…8']"
              wide
            >
              <div class="series-block">
                <div>
                  <span class="ads-label">Dark surface</span>
                  <div class="ads-series">
                    <div v-for="c in categorical" :key="c.slot" class="slot">
                      <span class="chipc" :style="{ background: c.dark }" />
                      <code>{{ c.slot }} · {{ c.hue }}</code>
                    </div>
                  </div>
                </div>
                <div>
                  <span class="ads-label">Light surface — restepped, not flipped</span>
                  <div class="ads-series">
                    <div v-for="c in categorical" :key="c.slot" class="slot">
                      <span class="chipc" :style="{ background: c.light }" />
                      <code>{{ c.light }}</code>
                    </div>
                  </div>
                </div>
              </div>
              <template #states>
                <span class="ads-status g4"><span class="ads-dot" />validated, both modes</span>
                <span class="ads-status g2"><span class="ads-dot" />worst adjacent ΔE 8.4 dark · 9.1 light</span>
              </template>
              <template #use>
                <li>Assign slot 1, then 2, then 3 — in order, by entity, so a filter that drops a series never repaints the survivors.</li>
                <li>Three series maximum in scatter, bubble or small multiples, where any two marks can sit side by side. Only the first three slots clear the all-pairs test.</li>
                <li>A ninth series folds into "Other" or becomes small multiples. It is never a generated hue.</li>
              </template>
              <template #avoid>
                <li>Picking hues by eye. Every slot here was computed and re-run against both ADS surfaces.</li>
                <li>Using a status colour as "series 4". Status meanings are reserved.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-sequential"
              name="Sequential & ordinal"
              role="Magnitude — how much. One hue, light to dark, never a rainbow. Where the quantity has no natural hue, the monochrome ramp keeps the plot in the system's own voice."
              :tokens="['--seq-1…7', '--grade-1…4']"
              wide
            >
              <div class="ramps">
                <div>
                  <span class="ads-label">Single hue — choropleth, heat, magnitude</span>
                  <div class="ads-ramp">
                    <span v-for="c in sequential" :key="c" :style="{ background: c }" />
                  </div>
                </div>
                <div>
                  <span class="ads-label">Monochrome — density inside a grey interface</span>
                  <div class="ads-ramp">
                    <span v-for="c in monoRamp" :key="c" :style="{ background: c }" />
                  </div>
                </div>
              </div>
              <template #use>
                <li>Order the steps by lightness, so magnitude survives a greyscale print.</li>
                <li>Use the ordinal form — one hue, monotone steps — whenever reordering the categories would change the meaning: funnel stages, size tiers, age bands.</li>
              </template>
              <template #avoid>
                <li>A rainbow ramp. It invents boundaries the data does not have.</li>
                <li>A pale lightest step that drops below 2:1 against the surface and stops reading as a mark at all.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-diverging"
              name="Diverging"
              role="Polarity — which side of a baseline. Two hues meeting at a neutral grey midpoint, with equal steps per arm so the two directions stay comparable."
              :tokens="['--div-neg…pos']"
              wide
            >
              <div class="ramps">
                <div>
                  <span class="ads-label">Below target · at target · above target</span>
                  <div class="ads-ramp">
                    <span v-for="c in diverging" :key="c" :style="{ background: c }" />
                  </div>
                </div>
              </div>
              <template #use>
                <li>Only where a meaningful zero or target exists — variance to budget, week-on-week change.</li>
                <li>A neutral grey midpoint, so "no change" reads as no signal.</li>
              </template>
              <template #avoid>
                <li>A hue at the midpoint. It makes zero look like a value.</li>
                <li>Unequal arms. If one side spans twice the range, the chart is lying about symmetry.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-status"
              name="Status & severity"
              role="State — good through critical. Reserved meanings that never double as series colours, and inside the monochrome interface they are luminance steps rather than hues."
              :tokens="['--grade-1', '--grade-2', '--grade-3', '--grade-4']"
            >
              <div class="stack">
                <span v-for="g in grades" :key="g.token" class="ads-status" :class="g.token.replace('--grade-', 'g')">
                  <span class="ads-dot" />{{ g.label }}
                </span>
              </div>
              <div class="stack">
                <span class="ads-delta is-up">12.4%</span>
                <span class="ads-delta is-down">3.1%</span>
                <span class="ads-delta is-flat">0.0%</span>
              </div>
              <template #use>
                <li>Always an icon or a label beside the colour. Status is never carried by colour alone.</li>
                <li>Inside the grey interface, severity is brightness: the worse it is, the brighter it is.</li>
              </template>
              <template #avoid>
                <li>Reusing a status colour for a data series — it makes every genuine alert ambiguous.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="c-vision"
              name="Colour vision & contrast"
              role="Roughly one man in twelve has a colour vision deficiency. A palette that ignores that is not a palette, it is a guess — so this one was computed rather than chosen."
              :tokens="['--surface', '--text', '--subdued']"
              wide
            >
              <div class="vision">
                <dl class="ads-dl">
                  <dt>Method</dt><dd>Machado-Oliveira-Fernandes 2009, severity 1.0</dd>
                  <dt>CVD ΔE</dt><dd>8.4 dark · 9.1 light (target ≥ 8, OKLab ×100)</dd>
                  <dt>Normal ΔE</dt><dd>19.3 dark · 19.6 light (floor ≥ 15)</dd>
                  <dt>Marks</dt><dd>≥ 3:1 against the chart surface</dd>
                  <dt>Body text</dt><dd>≥ 4.5:1 — WCAG AA</dd>
                </dl>
                <div class="ads-banner">
                  <span class="glyph"><Icon name="alert" :size="17" /></span>
                  <span>
                    On the light surface, slots 2, 3, 4 and 5 fall below 3:1 as
                    bare marks. That is not dismissable: in light mode those
                    series carry visible direct labels or ship with a table
                    view. The obligation is part of the palette, not a caveat
                    about it.
                  </span>
                </div>
              </div>
              <template #use>
                <li>Pair hue with position, a glyph or a direct label — so the chart still works in greyscale.</li>
                <li>Keep a table view behind every chart. It is the accessible fallback and the thing analysts actually want.</li>
              </template>
              <template #avoid>
                <li>Red/green as the only difference between two states. It is the single most common failure.</li>
                <li>Judging a palette by eye. The maths is cheap and the eye is unreliable.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Layout ════════════════════════════════════════════════ -->
        <section id="layout" class="band">
          <AdsSectionHead
            eyebrow="03 — Layout"
            title="Where things go."
            lede="A dashboard's information architecture is decided before any component is chosen. These three rules settle most of it."
          />

          <div class="specs">
            <AdsSpec
              id="l-grid"
              name="12-column grid"
              role="Twelve divides by 2, 3, 4 and 6, which covers every panel arrangement a dashboard needs without a custom track."
              :tokens="['--gutter', '--max']"
              wide
            >
              <div class="grid-demo">
                <div class="ads-grid12">
                  <span v-for="n in 12" :key="n">{{ n }}</span>
                </div>
                <div class="ads-grid12">
                  <span style="grid-column: span 3">3</span>
                  <span style="grid-column: span 3">3</span>
                  <span style="grid-column: span 3">3</span>
                  <span style="grid-column: span 3">3</span>
                  <span style="grid-column: span 8">8 — primary</span>
                  <span style="grid-column: span 4">4 — detail</span>
                </div>
              </div>
              <template #use>
                <li>One gutter token for the page margin, the gap between cards and the padding inside them.</li>
                <li>A KPI row of four at span 3; a chart-plus-detail split at 8 / 4.</li>
              </template>
              <template #avoid>
                <li>Panels that align to nothing but the window. Full-width bands are why most admin screens have no vertical structure.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="l-scan"
              name="Scan order"
              role="Readers sweep the top edge, then down the left — the F-shape. Put the answer where the eye lands and the granularity where it has to travel."
              :tokens="['--max']"
              wide
            >
              <div class="scan-demo">
                <div class="scan-zone z1"><span class="num">1</span>Top-level answer — KPIs, alerts, the state of things</div>
                <div class="scan-zone z2"><span class="num">2</span>Trend &amp; comparison</div>
                <div class="scan-zone z3"><span class="num">3</span>Detail — tables, logs, the long tail</div>
              </div>
              <template #use>
                <li>One sentence of answer above the fold, not twelve charts of evidence.</li>
                <li>Anything time-critical in the first band; anything exploratory below it.</li>
              </template>
              <template #avoid>
                <li>Burying the primary action past the point anyone is still reading.</li>
                <li>Giving every panel equal visual weight — then the layout has ranked nothing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="l-density"
              name="Density"
              role="Arguments about row height are arguments about two different readers. Make it a setting instead of picking a side."
              :tokens="['--row-h', '--gutter']"
            >
              <div class="ads-segmented">
                <button type="button" class="is-on">Comfortable</button>
                <button type="button">Compact</button>
              </div>
              <span class="dim density-note">34px rows · 24px gutter → 28px rows · 16px gutter</span>
              <template #use>
                <li>Express row height, gutter and font scale as tokens a density mode can swap.</li>
                <li>Remember the choice per user, not per device.</li>
              </template>
              <template #avoid>
                <li>Scaling the comfortable layout down. In compact mode some elements should disappear, not shrink.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Surfaces ══════════════════════════════════════════════ -->
        <section id="surfaces" class="band">
          <AdsSectionHead
            eyebrow="04 — Surfaces"
            title="Containers."
            lede="Three shapes do all the containing: something raised out of the page, something pressed into it, and the frame everything sits on."
          />

          <div class="specs">
            <AdsSpec
              id="ads-card"
              name="Card"
              role="A block of content standing proud of the page. Cards, not strips — alignment comes from one shared gutter, not from rules drawn between full-width bands."
              :tokens="['--raised', '--radius', '--soft-raised', '--gutter']"
            >
              <div class="card demo-card">
                <span class="ads-label">Crawl health</span>
                <span class="num demo-figure">98</span>
                <span class="dim demo-note">of 100 · unchanged</span>
              </div>
              <template #states>
                <div class="card demo-card is-small">Rest</div>
                <div class="card demo-card is-small" style="box-shadow: var(--soft-inset)">Pressed</div>
              </template>
              <template #use>
                <li>Any group of related content, at one radius and one padding.</li>
                <li>Hover states that press in rather than lift — the inversion is the gesture this style is built on.</li>
              </template>
              <template #avoid>
                <li>Nesting a card inside a card. Use a well for the inner level.</li>
                <li>A second radius unless it means a second kind of thing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-well"
              name="Well"
              role="The same shape pressed into the page. Holds things rather than presenting them: inputs, specimens, tracks, grids."
              :tokens="['--surface', '--radius-sm', '--soft-inset']"
            >
              <div class="well demo-well">A well holds content</div>
              <template #use>
                <li>Every input, so a field never reads as a button.</li>
                <li>The background behind a table or a chart inside a card.</li>
              </template>
              <template #avoid>
                <li>Putting a well directly on the canvas — it needs a raised parent to be pressed into.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-tab-seam"
              name="Frame tab"
              role="The selected rail item, cut from the frame's own surface and reaching into the rail with concave fillets. It covers the seam, so rail and content read as one piece of material."
              :tokens="['--surface', '--rail', '--radius']"
              wide
            >
              <div class="seam-demo">
                <div class="seam-rail">
                  <span class="seam-row">Projects</span>
                  <span class="seam-row is-on">
                    <span class="seam-tab">
                      <i class="seam-fillet top" /><i class="seam-fillet bottom" />
                    </span>
                    <span class="seam-label">Results</span>
                  </span>
                  <span class="seam-row">Issues</span>
                </div>
                <div class="seam-frame">The frame</div>
              </div>
              <template #use>
                <li>The single selected destination in a persistent rail.</li>
              </template>
              <template #avoid>
                <li>More than one at a time, and any use where the tab does not actually touch the frame — the fillets then curve into nothing.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Actions ═══════════════════════════════════════════════ -->
        <section id="actions" class="band">
          <AdsSectionHead
            eyebrow="05 — Actions"
            title="Things that do something."
            lede="One accent, spent once per screen. Everything else earns attention through weight and elevation, which is what keeps the accent legible when it appears."
          />

          <div class="specs">
            <AdsSpec
              id="ads-button"
              name="Button"
              role="Three weights. Accent for the one action the screen exists to produce, default for everything else, quiet for actions that should not compete."
              :tokens="['--accent', '--accent-ink', '--raised', '--radius-sm']"
            >
              <button class="btn btn-accent" type="button"><Icon name="plus" :size="18" />New crawl</button>
              <button class="btn" type="button">Export CSV</button>
              <button class="btn btn-quiet" type="button">Cancel</button>
              <template #states>
                <button class="btn btn-accent" type="button">Rest</button>
                <button class="btn btn-accent" type="button" style="filter: brightness(.94)">Hover</button>
                <button class="btn btn-accent" type="button" style="box-shadow: var(--soft-inset-sm); transform: translateY(1px)">Press</button>
                <button class="btn btn-accent" type="button" style="opacity: .45" disabled>Disabled</button>
              </template>
              <template #use>
                <li>Exactly one accent button per screen, on the primary action.</li>
                <li>A verb and its object: <em>Export CSV</em>, not <em>OK</em>.</li>
              </template>
              <template #avoid>
                <li>Two accent buttons side by side. If both matter, neither does.</li>
                <li>Accent on a destructive action — use default and confirm instead.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-icon-button"
              name="Icon button"
              role="A tile-shaped target for an action whose glyph is unambiguous. Always carries an accessible name, because a glyph is not a label."
              :tokens="['--raised', '--radius-sm']"
            >
              <button v-for="g in ['grid', 'chart', 'sliders', 'mail']" :key="g" class="icon-btn" type="button" :aria-label="g">
                <Icon :name="g" :size="18" />
              </button>
              <template #use>
                <li>Toolbar actions where space is tight and the glyph is conventional.</li>
              </template>
              <template #avoid>
                <li>Any action a reader would have to hover to understand.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-segmented"
              name="Segmented control"
              role="A small set of mutually exclusive views, all visible at once. Use it where a select would hide the options and a tab row would imply navigation."
              :tokens="['--surface', '--accent', '--soft-inset-sm']"
            >
              <div class="ads-segmented" role="group" aria-label="Range">
                <button
                  v-for="r in ['24h', '7d', '30d', 'All']"
                  :key="r"
                  type="button"
                  :class="{ 'is-on': segment === r }"
                  :aria-pressed="segment === r"
                  @click="segment = r"
                >{{ r }}</button>
              </div>
              <template #use>
                <li>Two to five options whose labels are short and comparable.</li>
              </template>
              <template #avoid>
                <li>More than five, or labels that wrap. That is a select.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-menu"
              name="Menu"
              role="Row actions and overflow. Everything a reader can do to one record, in one place, so the table does not need a column of buttons."
              :tokens="['--elevated', '--hover', '--soft-raised-lg']"
            >
              <div class="ads-menu">
                <button type="button"><Icon name="arrow" :size="15" />Open detail<span class="shortcut">↵</span></button>
                <button type="button"><Icon name="chart" :size="15" />Compare to last run</button>
                <button type="button"><Icon name="mail" :size="15" />Copy link<span class="shortcut">⌘C</span></button>
                <hr>
                <button type="button"><Icon name="alert" :size="15" />Exclude from crawl</button>
              </div>
              <template #use>
                <li>Group destructive items below a rule, never first.</li>
                <li>Show the keyboard shortcut where one exists — it is how a menu teaches.</li>
              </template>
              <template #avoid>
                <li>Hiding the primary row action in here. If every reader needs it, it belongs in the row.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-link"
              name="Link"
              role="Navigation inside prose. Underlined, because in a system with no spare colour the underline is the only signal available."
              :tokens="['--line-strong', '--accent']"
            >
              <p class="body link-demo">
                The ranked plan explains <a class="ads-link" href="#ads-grid">what to fix first</a>,
                and each job links back to <a class="ads-link" href="#ads-dl">the pages behind it</a>.
              </p>
              <template #use>
                <li>Underline always. Colour alone is not a signal here, and would not be an accessible one anywhere.</li>
              </template>
              <template #avoid>
                <li>Links styled as buttons inside body copy — it breaks the reading line.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Inputs ════════════════════════════════════════════════ -->
        <section id="inputs" class="band">
          <AdsSectionHead
            eyebrow="06 — Inputs"
            title="Things that take a value."
            lede="Every field is a well. A raised input reads as something to press, which is the single most common mistake made with this style."
          />

          <div class="specs">
            <AdsSpec
              id="ads-field"
              name="Text field"
              role="One line of text. Label above, hint below, error replacing the hint rather than appearing beside it."
              :tokens="['--surface', '--soft-inset', '--radius-sm', '--accent']"
            >
              <div class="field-demo">
                <div class="ads-field-group">
                  <label class="ads-label" for="d-url">Start URL</label>
                  <input id="d-url" v-model="field" class="ads-field" type="url" placeholder="https://example.com">
                  <span class="ads-hint">The crawl begins here and follows internal links.</span>
                </div>
                <div class="ads-field-group">
                  <label class="ads-label" for="d-err">Depth limit</label>
                  <input id="d-err" class="ads-field is-invalid" value="-3">
                  <span class="ads-hint">Must be a positive whole number.</span>
                </div>
              </div>
              <template #states>
                <input class="ads-field st" value="Rest" readonly>
                <input class="ads-field st" value="Disabled" disabled>
                <input class="ads-field st is-invalid" value="Invalid" readonly>
              </template>
              <template #use>
                <li>A visible label always — placeholder text disappears exactly when it is needed.</li>
                <li>Error text that says what to do, not that something is wrong.</li>
              </template>
              <template #avoid>
                <li>Placeholder-as-label. It fails for everyone and fails hardest for screen readers.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-number"
              name="Number input"
              role="A figure with steppers, set right-aligned in the data face so it lines up with the values it will be compared against."
              :tokens="['--surface', '--mono', '--line']"
            >
              <div class="ads-number">
                <input v-model.number="count" type="number" min="1" max="999" aria-label="Max URLs">
                <span class="steps">
                  <button type="button" aria-label="Increase" @click="count++">▲</button>
                  <button type="button" aria-label="Decrease" @click="count = Math.max(1, count - 1)">▼</button>
                </span>
              </div>
              <template #use>
                <li>Right-aligned, monospaced, with the unit in the label rather than the field.</li>
              </template>
              <template #avoid>
                <li>A range where a reader needs an exact figure. Give them both or give them this.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-select"
              name="Select, search, textarea"
              role="The remaining text inputs. The chevron is painted into the select's background so the control stays a single element."
              :tokens="['--surface', '--soft-inset', '--subdued']"
            >
              <div class="field-demo">
                <select class="ads-field" aria-label="User agent">
                  <option>Googlebot (smartphone)</option>
                  <option>Chrome 120 · desktop</option>
                </select>
                <div class="ads-search">
                  <Icon name="compass" :size="16" />
                  <input class="ads-field" type="search" placeholder="Filter by URL…" aria-label="Filter by URL">
                </div>
              </div>
              <textarea class="ads-field" rows="3" placeholder="Notes for the next person who opens this crawl…" aria-label="Notes" />
              <template #use>
                <li>A search field whenever a list exceeds roughly twenty rows.</li>
              </template>
              <template #avoid>
                <li>A select for a boolean. That is a switch.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-daterange"
              name="Date range"
              role="The most-used control on any dashboard, and the one most often bolted on last. It belongs in the filter row with the dimension filters, not in a corner."
              :tokens="['--surface', '--mono', '--soft-inset']"
            >
              <div class="ads-daterange">
                <Icon name="compass" :size="15" />
                <span>2026-09-25</span>
                <span class="sep">→</span>
                <span>2026-10-25</span>
              </div>
              <div class="ads-segmented">
                <button type="button">7d</button>
                <button type="button" class="is-on">30d</button>
                <button type="button">90d</button>
                <button type="button">Custom</button>
              </div>
              <template #use>
                <li>Presets beside the custom range — most readers want "last 30 days", not a calendar.</li>
                <li>ISO dates in the data face, so ranges sort and compare visually.</li>
              </template>
              <template #avoid>
                <li>A range that resets on navigation. It belongs in the URL with the rest of the view state.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-choice"
              name="Checkbox, radio, switch"
              role="Three shapes for three meanings: many-of, one-of, and a setting that takes effect the moment it is flipped."
              :tokens="['--accent', '--surface', '--soft-inset-sm']"
            >
              <div class="choice-demo">
                <label class="ads-choice">
                  <input v-model="checks.a" type="checkbox">
                  <span class="ads-box"><Icon name="check" :size="13" /></span>
                  Follow nofollow links
                </label>
                <label class="ads-choice">
                  <input v-model="checks.b" type="checkbox">
                  <span class="ads-box"><Icon name="check" :size="13" /></span>
                  Respect robots.txt
                </label>
                <label v-for="r in ['weekly', 'monthly']" :key="r" class="ads-choice">
                  <input v-model="radio" type="radio" :value="r" name="cadence">
                  <span class="ads-box is-round"><Icon name="check" :size="12" /></span>
                  {{ r }}
                </label>
                <label class="ads-choice">
                  <input v-model="toggles.live" type="checkbox">
                  <span class="ads-switch" />
                  Live updates
                </label>
                <label class="ads-choice">
                  <input v-model="toggles.compact" type="checkbox">
                  <span class="ads-switch" />
                  Compact rows
                </label>
              </div>
              <template #use>
                <li>A switch only where the change applies immediately and needs no save.</li>
              </template>
              <template #avoid>
                <li>A switch inside a form with a submit button. Use a checkbox.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-range"
              name="Range"
              role="A continuous value where the approximate position matters more than the exact figure — but the figure is shown anyway, because somebody always needs it."
              :tokens="['--accent', '--surface', '--pill']"
              wide
            >
              <div class="range-demo">
                <label class="ads-label" for="d-range">Concurrency <span class="num">{{ slider }}</span></label>
                <input id="d-range" v-model.number="slider" class="ads-range" type="range" min="1" max="128">
              </div>
              <template #use>
                <li>Alongside a numeric readout, always.</li>
              </template>
              <template #avoid>
                <li>Precise entry. If a reader needs exactly 47, give them a number field.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-tag"
              name="Tag"
              role="A filter the reader applied and can take off again. Distinct from a status chip, which describes the data and cannot be removed — the dismiss affordance is the whole difference."
              :tokens="['--elevated', '--pill', '--accent']"
            >
              <span v-for="t in tags" :key="t" class="ads-tag">
                {{ t }}
                <button type="button" :aria-label="`Remove ${t}`" @click="tags = tags.filter(x => x !== t)">×</button>
              </span>
              <button v-if="tags.length < 3" class="btn btn-quiet" type="button" @click="tags = ['status: 4xx', 'depth ≤ 3', 'indexable']">Reset</button>
              <template #use>
                <li>One tag per applied filter, so the reader can see and undo the state they are in.</li>
              </template>
              <template #avoid>
                <li>Tags for data attributes. Those are status chips and must not look removable.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Data display ══════════════════════════════════════════ -->
        <section id="data" class="band">
          <AdsSectionHead
            eyebrow="07 — Data display"
            title="The reason the screen exists."
            lede="Every chart here is hand-drawn SVG — no charting library. A chart should match the design system rather than the system bending around a library's defaults."
          />

          <div class="specs">
            <AdsSpec
              id="ads-stat"
              name="Stat tile & delta"
              role="A figure, its direction of travel, and its standing. A number without a comparison is trivia — the reader has no way to know whether it is good."
              :tokens="['--raised', '--mono', '--grade-1…4']"
            >
              <StatTile value="1,284" label="URLs crawled" note="+37 this run" />
              <StatTile value="74" unit="ms" label="Median latency" note="−12% vs last" />
              <div class="stack">
                <span class="ads-delta is-up">12.4%</span>
                <span class="ads-delta is-down">3.1%</span>
                <span class="ads-delta is-flat">0.0%</span>
              </div>
              <template #states>
                <span class="ads-badge">5</span>
                <span class="ads-badge">99+</span>
                <span class="ads-badge is-quiet">draft</span>
              </template>
              <template #use>
                <li>Pair every headline figure with a target, a previous period or a peer.</li>
              </template>
              <template #avoid>
                <li>A tile whose only content is a number. That is a label with extra steps.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-meter"
              name="Meter & progress"
              role="Two shapes often confused. A meter is a quantity against a threshold; a progress bar is a task moving toward a known end. The threshold mark is what separates them."
              :tokens="['--accent', '--surface', '--canvas']"
              wide
            >
              <div class="meter-demo">
                <div v-for="m in [['Budget used', 68, 80], ['Error rate', 91, 40], ['Coverage', 34, 75]]" :key="m[0] as string" class="meter-row">
                  <span class="dim">{{ m[0] }}</span>
                  <span class="ads-meter">
                    <i :style="{ width: `${m[1]}%` }" />
                    <b :style="{ left: `${m[2]}%` }" />
                  </span>
                  <span class="num meter-val">{{ m[1] }}%</span>
                </div>
                <div class="meter-row">
                  <span class="dim">Crawling</span>
                  <span class="ads-progress"><i style="width: 46%" /></span>
                  <span class="num meter-val">46%</span>
                </div>
              </div>
              <template #use>
                <li>A meter wherever a known maximum exists: quota, budget, coverage.</li>
                <li>The threshold mark always. Without it the fill has no meaning.</li>
              </template>
              <template #avoid>
                <li>A meter for an unbounded value. It implies a ceiling that does not exist.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-chart-choice"
              name="Choosing a form"
              role="The decision before the component. Most bad charts are the wrong shape rather than the wrong colour, and a gallery of chart types does not help you pick."
              :tokens="[]"
              wide
            >
              <div class="choice-table">
                <table>
                  <thead>
                    <tr><th>The data's job</th><th>Form</th><th>What decides it</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in chartChoice" :key="row[0]">
                      <td class="c-job">{{ row[0] }}</td>
                      <td class="c-form">{{ row[1] }}</td>
                      <td class="dim">{{ row[2] }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <template #use>
                <li>Pick the form from the job, then the colour. Choosing colour first is how most charts go wrong.</li>
                <li>Consider that the answer may not be a chart — often it is a stat tile or a sentence.</li>
              </template>
              <template #avoid>
                <li>A dual-axis chart. Two measures at different scales means two charts, or index both to a common base.</li>
                <li>Decorative non-data ink: 3D, heavy fills, extra gridlines. Every pixel that is not data competes with the data.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-charts"
              name="Charts"
              role="Four shapes cover nearly everything a dashboard has to say. Position and length first, because the eye reads them faster than digits."
              :tokens="['--accent', '--raised', '--ease']"
              wide
            >
              <div class="chart-demo">
                <Gauge :value="68" :max="100" label="coverage" unit="%" />
                <div class="chart-cell">
                  <span class="ads-label">Trend</span>
                  <Sparkline :points="series" />
                </div>
                <div class="chart-cell">
                  <span class="ads-label">Adoption</span>
                  <Bars :data="adoption" />
                </div>
                <div class="chart-cell">
                  <span class="ads-label">Density</span>
                  <Heatmap :cols="16" :rows="5" />
                </div>
              </div>
              <template #use>
                <li>A sparkline beside every headline figure that has a history.</li>
                <li>Thin marks, recessive axes, direct labels on the values that matter rather than all of them.</li>
              </template>
              <template #avoid>
                <li>Pie charts. Angle is the hardest encoding to compare and there is always a better shape.</li>
                <li>A chart per metric, forever. That is scrolling, not knowing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-grid"
              name="Data grid"
              role="The workhorse. Sortable headers, a keyboard cursor, rows separated by a whisper rather than a rule, and every figure monospaced so columns can be scanned downward."
              :tokens="['--row-h', '--line', '--mono', '--hover']"
              wide
            >
              <DataGrid :columns="gridCols" :rows="gridRows" caption="Crawl results" />
              <template #states>
                <span class="ads-status g2"><span class="ads-dot" />virtualise beyond ~200 rows</span>
              </template>
              <template #use>
                <li>Right-align numbers, left-align text, never centre either.</li>
                <li>Keep units in the header so the digits stay in register.</li>
              </template>
              <template #avoid>
                <li>Row striping. If rows need stripes, they are too tall.</li>
                <li>Rendering every row. Past a few hundred, window it — see Engineering.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-dl"
              name="Structured list"
              role="Key-value detail, which is what a selected row almost always needs. A grid rather than a table, so long values wrap instead of forcing a scroll."
              :tokens="['--font-label', '--mono', '--text-soft']"
            >
              <dl class="ads-dl">
                <dt>Status</dt><dd>200 · indexable</dd>
                <dt>Title</dt><dd>New York Landlord-Tenant Attorneys</dd>
                <dt>Words</dt><dd>1,286</dd>
                <dt>Inlinks</dt><dd>3,762</dd>
                <dt>Last crawled</dt><dd>2026-10-24 14:22</dd>
              </dl>
              <template #use>
                <li>Labels in the label face, values in the data face — so values stay comparable down the column.</li>
              </template>
              <template #avoid>
                <li>A two-column table for this. A table implies rows you can sort; this is one record.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Disclosure ════════════════════════════════════════════ -->
        <section id="disclosure" class="band">
          <AdsSectionHead
            eyebrow="08 — Disclosure"
            title="Summary first, detail on request."
            lede="The central move in a data-rich interface. Show the actionable summary by default and give the reader a way down to full context — without losing their place."
          />

          <div class="specs">
            <AdsSpec
              id="ads-accordion"
              name="Accordion"
              role="The simplest disclosure. Built on native details/summary, so it works before JavaScript arrives and is announced correctly without a single ARIA attribute."
              :tokens="['--surface', '--line', '--soft-inset-sm']"
              wide
            >
              <div class="ads-accordion">
                <details open>
                  <summary>Why this page ranks eighth</summary>
                  <div class="panel">371 pages share near-duplicate content, but they are 278 separate pieces of work — so the job sinks below fixes that one template change would resolve.</div>
                </details>
                <details>
                  <summary>What a fix would involve</summary>
                  <div class="panel">Two template changes and a canonical rule. Roughly a day.</div>
                </details>
                <details>
                  <summary>Pages affected</summary>
                  <div class="panel">371 URLs, listed in the detail drawer.</div>
                </details>
              </div>
              <template #use>
                <li>Reasoning behind a ranked result, where most readers accept the ranking and some want the argument.</li>
              </template>
              <template #avoid>
                <li>Hiding something every reader needs. An accordion is for the minority who ask.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-drawer"
              name="Detail drawer"
              role="A right-hand panel where the selected row explains itself. The table never leaves the screen, so the reader keeps their place in it."
              :tokens="['--raised', '--surface', '--line']"
              wide
            >
              <div class="ads-drawer">
                <div>
                  <span class="ads-label">Results</span>
                  <p class="body drawer-note">The grid stays where it is; selection drives the panel.</p>
                </div>
                <div class="panel">
                  <span class="ads-label">/pricing</span>
                  <dl class="ads-dl">
                    <dt>Code</dt><dd>200</dd>
                    <dt>Words</dt><dd>1,286</dd>
                    <dt>Inlinks</dt><dd>3,762</dd>
                  </dl>
                </div>
              </div>
              <template #use>
                <li>Any table where readers compare a record against its neighbours.</li>
              </template>
              <template #avoid>
                <li>A modal for row detail. It hides the context the reader is working in.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-popover"
              name="Popover"
              role="A small amount of extra context, anchored to what prompted it. More than a tooltip, less than a drawer, and it can contain interactive elements where a tooltip cannot."
              :tokens="['--elevated', '--soft-raised-lg']"
            >
              <div class="ads-popover">
                <span class="ads-label">Link score</span>
                <span class="body">A 0–100 measure of how much of the site's internal link value reaches this page.</span>
                <a class="ads-link" href="#ads-grid">How it is calculated</a>
              </div>
              <template #use>
                <li>Definitions for a column header a reader may not know.</li>
              </template>
              <template #avoid>
                <li>Putting essential information only in here. It is supplementary by definition.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-tree"
              name="Tree view"
              role="Real nesting — site structure, a category hierarchy, a file system. Built on nested lists so the structure lives in the markup and not only in the indentation."
              :tokens="['--line', '--hover', '--mono']"
            >
              <ul class="ads-tree">
                <li>
                  <span><Icon name="grid" :size="14" />/ <span class="count">1,284</span></span>
                  <ul>
                    <li><span><Icon name="layers" :size="14" />blog <span class="count">842</span></span></li>
                    <li>
                      <span><Icon name="layers" :size="14" />docs <span class="count">311</span></span>
                      <ul>
                        <li><span><Icon name="chart" :size="14" />audits <span class="count">45</span></span></li>
                      </ul>
                    </li>
                    <li><span><Icon name="layers" :size="14" />pricing <span class="count">1</span></span></li>
                  </ul>
                </li>
              </ul>
              <template #use>
                <li>Hierarchies readers already picture as a tree — URLs, folders, org charts.</li>
              </template>
              <template #avoid>
                <li>Flat data with a made-up parent level. That is a grouped table.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-steps"
              name="Progress indicator"
              role="Where you are in a sequence with a known end. Distinct from a progress bar: this counts discrete stages, not percentage."
              :tokens="['--accent', '--surface', '--pill']"
              wide
            >
              <ol class="ads-steps">
                <li class="is-done"><span class="pip"><Icon name="check" :size="11" /></span>Configure</li>
                <li class="is-done"><span class="pip"><Icon name="check" :size="11" /></span>Crawl</li>
                <li class="is-now"><span class="pip">3</span>Audit</li>
                <li><span class="pip">4</span>Plan</li>
                <li><span class="pip">5</span>Export</li>
              </ol>
              <template #use>
                <li>Multi-stage jobs where a reader may leave and return.</li>
              </template>
              <template #avoid>
                <li>Sequences with an unknown number of steps — use an indeterminate loader.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Navigation ════════════════════════════════════════════ -->
        <section id="navigation" class="band">
          <AdsSectionHead
            eyebrow="09 — Navigation"
            title="Getting between screens."
            lede="One persistent rail for destinations, tabs for views of the same thing, crumbs for depth. Mixing the three is how dashboards become mazes."
          />

          <div class="specs">
            <AdsSpec
              id="ads-tabs"
              name="Tabs"
              role="Views of one dataset. The underline is the accent's only appearance in a nav context, so a tab row never competes with the primary action."
              :tokens="['--accent', '--line', '--subdued']"
              wide
            >
              <div class="ads-tabs" role="tablist">
                <button
                  v-for="t in ['internal', 'external', 'response codes', 'titles']"
                  :key="t"
                  type="button"
                  role="tab"
                  :aria-selected="tab === t"
                  :class="{ 'is-on': tab === t }"
                  @click="tab = t"
                >{{ t }}</button>
              </div>
              <template #use>
                <li>Filtered views of the same table, where the columns stay put.</li>
              </template>
              <template #avoid>
                <li>Tabs that navigate to different screens. That is the rail's job.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-crumbs"
              name="Breadcrumb & pagination"
              role="Where you are, and which slice you are looking at. Both are monospaced, because both are mostly numbers and paths."
              :tokens="['--subdued', '--accent', '--mono']"
              wide
            >
              <nav class="ads-crumbs" aria-label="Breadcrumb">
                <a href="#">Projects</a><span class="sep">/</span>
                <a href="#">outerbridgelaw.com</a><span class="sep">/</span>
                <a href="#">Results</a><span class="sep">/</span>
                <span aria-current="page">Response codes</span>
              </nav>
              <div class="ads-pager">
                <button type="button" aria-label="Previous">←</button>
                <button v-for="p in [1, 2, 3, 4, 5]" :key="p" type="button" :class="{ 'is-on': page === p }" @click="page = p">{{ p }}</button>
                <button type="button" aria-label="Next">→</button>
              </div>
              <template #use>
                <li>Crumbs once a screen is three levels deep or more.</li>
              </template>
              <template #avoid>
                <li>Infinite scroll in a data table — it loses the reader's place and makes "row 4,000" unreachable.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Feedback ══════════════════════════════════════════════ -->
        <section id="feedback" class="band">
          <AdsSectionHead
            eyebrow="10 — Feedback"
            title="When there is nothing to show yet."
            lede="Latency is a design material and emptiness is a state, not an accident. These components exist because most dashboards treat both as edge cases."
          />

          <div class="specs">
            <AdsSpec
              id="ads-empty"
              name="Empty state"
              role="The first screen every new user sees, and usually the last one designed. It should teach: what appears here, why it is empty, and the one action that fixes it."
              :tokens="['--surface', '--soft-inset', '--raised']"
              wide
            >
              <div class="ads-empty">
                <span class="glyph"><Icon name="chart" :size="22" /></span>
                <h4>No crawls yet</h4>
                <p>Results, issues and the ranked plan all appear here once a crawl has finished. The first one takes about two minutes.</p>
                <button class="btn btn-accent" type="button"><Icon name="plus" :size="18" />New crawl</button>
              </div>
              <template #use>
                <li>Distinguish never-had-data from no-results-for-this-filter — different copy, different action.</li>
                <li>Put the action inside the empty state, not in a toolbar nobody has looked at.</li>
              </template>
              <template #avoid>
                <li>"No data" in grey 12px. That is a dead end at the exact moment a new user is deciding whether this is worth the effort.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-skeleton"
              name="Skeleton"
              role="Holds the layout at the real content's dimensions while the data is in flight, so nothing shifts when it lands."
              :tokens="['--surface', '--elevated']"
              wide
            >
              <div class="skel-demo">
                <div class="ads-skeleton" style="height: 13px; width: 34%" />
                <div class="ads-skeleton" style="height: 30px; width: 58%" />
                <div class="ads-skeleton" style="height: 13px; width: 80%" />
                <div class="ads-skeleton" style="height: 13px; width: 66%" />
              </div>
              <template #use>
                <li>Match the real content's dimensions, or the shift you avoided arrives anyway.</li>
              </template>
              <template #avoid>
                <li>A spinner over the whole page — it throws away a layout the reader had already begun reading.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-loading"
              name="Loading"
              role="For the cases a skeleton cannot cover: an action in flight, or a panel whose shape is not known until the data arrives."
              :tokens="['--accent', '--line-strong']"
            >
              <span class="ads-inline-load"><span class="ads-spinner" />Recrawling 311 URLs…</span>
              <button class="btn" type="button" disabled><span class="ads-spinner" />Exporting</button>
              <template #use>
                <li>Inline, next to the thing that is loading, so the rest of the screen stays usable.</li>
              </template>
              <template #avoid>
                <li>A spinner where the shape is known. That is a skeleton.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-banner"
              name="Banner, toast, tooltip"
              role="Three levels of interruption: a banner stays until resolved, a toast confirms and leaves, a tooltip answers a question only if asked."
              :tokens="['--raised', '--elevated', '--accent']"
              wide
            >
              <div class="feedback-demo">
                <div class="ads-banner">
                  <span class="glyph"><Icon name="alert" :size="17" /></span>
                  <span>This crawl is 14 days old. Figures below describe the site as it was on 11 October.</span>
                </div>
                <div class="row-gap">
                  <div class="ads-toast"><Icon name="check" :size="16" />Export finished · 733 rows</div>
                  <span class="ads-tooltip">Internal links pointing here</span>
                </div>
              </div>
              <template #use>
                <li>A banner for a condition that persists; a toast for something that already happened.</li>
              </template>
              <template #avoid>
                <li>A toast for an error the reader must act on. It will be gone before they read it.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-modal"
              name="Modal"
              role="Blocks everything until answered, so it is reserved for the few moments that genuinely cannot proceed without a decision."
              :tokens="['--raised', '--canvas', '--soft-raised-lg']"
              wide
            >
              <div class="ads-scrim">
                <div class="ads-modal">
                  <span class="ads-label">Confirm</span>
                  <h4 class="modal-title">Delete this project?</h4>
                  <p class="body">Its crawls, history and comparisons go with it. This cannot be undone.</p>
                  <div class="modal-actions">
                    <button class="btn" type="button">Delete project</button>
                    <button class="btn btn-quiet" type="button">Cancel</button>
                  </div>
                </div>
              </div>
              <template #use>
                <li>Destructive confirmations, where the verb goes on the button rather than "OK".</li>
              </template>
              <template #avoid>
                <li>Accent on the destructive action. The accent means "the thing to do", and this is not it.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Patterns ══════════════════════════════════════════════ -->
        <section id="patterns" class="band">
          <AdsSectionHead
            eyebrow="11 — Patterns"
            title="The compositions."
            lede="Components are only half a system. These are the arrangements that recur in every dashboard we build, assembled from the parts above and nothing else."
          />

          <div class="specs">
            <AdsSpec
              id="ads-kpi-row"
              name="KPI row"
              role="The top of nearly every dashboard. Four figures at most — a fifth is a sign the screen has not decided what it is for."
              :tokens="['--gutter', '--raised']"
              wide
            >
              <div class="kpi-row">
                <StatTile value="1,284" label="URLs" note="+37" />
                <StatTile value="98" label="Health" note="of 100" />
                <StatTile value="74" unit="ms" label="Median" note="−12%" />
                <StatTile value="23" label="Issues" note="4 critical" />
              </div>
              <template #use>
                <li>Rank them left to right by how often they are the reason someone opened the screen.</li>
              </template>
              <template #avoid>
                <li>Giving every figure the same weight. Then the row has answered nothing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-filter-bar"
              name="Filter bar & saved views"
              role="One row, above the data, holding every control that changes what is shown. Saved views turn a repeated set of filters into a named thing a team can share."
              :tokens="['--surface', '--elevated', '--pill']"
              wide
            >
              <div class="filter-demo">
                <div class="filter-bar">
                  <div class="ads-search">
                    <Icon name="compass" :size="16" />
                    <input class="ads-field" type="search" placeholder="Filter by URL…" aria-label="Filter">
                  </div>
                  <div class="ads-daterange"><span>30d</span><span class="sep">→</span><span>now</span></div>
                  <div class="ads-segmented">
                    <button type="button" class="is-on">All</button>
                    <button type="button">2xx</button>
                    <button type="button">4xx</button>
                  </div>
                </div>
                <div class="saved-views">
                  <span class="ads-label">Saved</span>
                  <span class="ads-tag">Exec summary<button type="button" aria-label="Remove">×</button></span>
                  <span class="ads-tag">Broken links<button type="button" aria-label="Remove">×</button></span>
                  <button class="btn btn-quiet" type="button"><Icon name="plus" :size="15" />Save this view</button>
                </div>
              </div>
              <template #use>
                <li>Role-based defaults — an executive and an operator should not land on the same configuration.</li>
                <li>Serialise the whole bar into the URL, so a view can be sent, bookmarked and reopened.</li>
              </template>
              <template #avoid>
                <li>Filters scattered across the screen. Readers cannot see the state they are in.</li>
                <li>A saved view that silently stops matching. Say when it last returned nothing.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-table-screen"
              name="Table screen"
              role="Header, tabs, filter bar, grid, pagination. The arrangement that carries most of the working hours in any data product."
              :tokens="['--surface', '--radius', '--row-h']"
              wide
            >
              <div class="screen-demo">
                <div class="screen-demo-head">
                  <div>
                    <h4 class="demo-title ads-display">Results</h4>
                    <span class="dim num">733 rows</span>
                  </div>
                  <button class="btn btn-accent" type="button">Export CSV</button>
                </div>
                <div class="ads-tabs">
                  <button type="button" class="is-on">Internal</button>
                  <button type="button">External</button>
                  <button type="button">Response codes</button>
                </div>
                <div class="filter-bar">
                  <div class="ads-search">
                    <Icon name="compass" :size="16" />
                    <input class="ads-field" type="search" placeholder="Filter by URL…" aria-label="Filter">
                  </div>
                  <div class="ads-segmented">
                    <button type="button" class="is-on">All</button>
                    <button type="button">2xx</button>
                    <button type="button">3xx</button>
                    <button type="button">4xx</button>
                  </div>
                </div>
                <DataGrid :columns="gridCols" :rows="gridRows" caption="Results" />
                <div class="screen-demo-foot">
                  <span class="dim num">1–4 of 733</span>
                  <div class="ads-pager">
                    <button type="button" class="is-on">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <button type="button">→</button>
                  </div>
                </div>
              </div>
              <template #use>
                <li>Inline actions in the row — a status toggle, a batch select — so a decision does not need a round trip to another screen.</li>
              </template>
              <template #avoid>
                <li>A full-bleed table. Inside a card it can have a header that stays put.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="ads-disclosure-pattern"
              name="Summary → detail"
              role="The pattern the whole system is arranged around: a ranked answer at the top, the reasoning one level down, the raw rows two levels down — and the reader never loses their place."
              :tokens="['--raised', '--surface']"
              wide
            >
              <div class="ladder">
                <div class="rung">
                  <span class="num rung-n">1</span>
                  <div><strong>Answer.</strong> One ranked list. "Fix the alt text on the blog template — 823 pages, two changes."</div>
                </div>
                <div class="rung">
                  <span class="num rung-n">2</span>
                  <div><strong>Reasoning.</strong> An accordion or drawer: why this ranks first, what the score is made of.</div>
                </div>
                <div class="rung">
                  <span class="num rung-n">3</span>
                  <div><strong>Evidence.</strong> The grid, filtered to the 823 rows, with the filter visible as a tag.</div>
                </div>
              </div>
              <template #use>
                <li>Each level reachable in one click and leaveable in one — a drawer, not a new screen.</li>
              </template>
              <template #avoid>
                <li>Starting at level three. Ten thousand rows is not a to-do list.</li>
              </template>
            </AdsSpec>
          </div>
        </section>

        <!-- ═══ Engineering ═══════════════════════════════════════════ -->
        <section id="engineering" class="band">
          <AdsSectionHead
            eyebrow="12 — Engineering"
            title="At ten thousand rows, rendering is a design decision."
            lede="This section is the clearest reason ADS is narrow. A general-purpose system cannot take positions on data volume, because it does not know whether you have twelve rows or a million. We do."
          />

          <div class="specs">
            <AdsSpec
              id="e-virtual"
              name="Virtualisation"
              role="Render the rows in the viewport and a small buffer, not the dataset. Past a few hundred rows this is the difference between a grid and a frozen tab."
              :tokens="['--row-h']"
              wide
            >
              <pre class="ads-code"><span class="tok">// A fixed --row-h is what makes windowing cheap: the scroll height is</span>
<span class="tok">// arithmetic rather than measurement, so no row has to be laid out</span>
<span class="tok">// just to know where it sits.</span>
const rowH   = 34
const first  = Math.floor(scrollTop / rowH)
const count  = Math.ceil(viewportH / rowH) + 8  <span class="tok">// overscan</span>
const offset = first * rowH</pre>
              <template #use>
                <li>Fixed row heights, so the scroll position is arithmetic and never a measurement pass.</li>
                <li>Keep real table semantics — a virtualised grid still needs rows a screen reader can walk.</li>
              </template>
              <template #avoid>
                <li>Virtualising a list of twelve. The complexity is only worth it past a few hundred.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="e-loading"
              name="Loading strategy"
              role="Above-the-fold figures immediately, everything else streamed. A screen that waits for its slowest query is as slow as its slowest query."
              :tokens="['--surface']"
              wide
            >
              <div class="load-demo">
                <div class="load-row"><span class="ads-label">0ms</span><span class="load-bar now">KPI row — blocking, cached</span></div>
                <div class="load-row"><span class="ads-label">+120ms</span><span class="load-bar">Charts — streamed</span></div>
                <div class="load-row"><span class="ads-label">+400ms</span><span class="load-bar dim-bar">Grid page 1 — streamed</span></div>
                <div class="load-row"><span class="ads-label">idle</span><span class="load-bar dim-bar">History, exports — prefetched</span></div>
              </div>
              <template #use>
                <li>Skeleton each panel at its real dimensions so nothing shifts as the waves land.</li>
                <li>Mark stale or partial data explicitly, with the time it was last refreshed.</li>
              </template>
              <template #avoid>
                <li>One request that blocks the whole screen. Partial answers beat a blocked page — as long as a partial answer never looks complete.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="e-state"
              name="State & caching"
              role="View state belongs in the URL; fetched data belongs in a cache keyed by it. A view that cannot be sent to a colleague gets rebuilt by hand, and people take screenshots instead."
              :tokens="[]"
              wide
            >
              <pre class="ads-code">/results?tab=internal&amp;code=4xx&amp;sort=-inlinks&amp;from=2026-09-25

<span class="tok">// The query string is the cache key. Back, forward, refresh and</span>
<span class="tok">// "send me that link" all work for free.</span></pre>
              <template #use>
                <li>Keep the parameters legible — people do edit them by hand.</li>
                <li>Cache by the serialised view, so returning to a tab is instant.</li>
              </template>
              <template #avoid>
                <li>A base64 blob. Shareable, but nobody can fix one by hand.</li>
              </template>
            </AdsSpec>

            <AdsSpec
              id="e-realtime"
              name="Real-time"
              role="Push only what is genuinely time-critical. A dashboard where every figure flickers is harder to read than one that updates on a timer and says when it last did."
              :tokens="['--accent']"
              wide
            >
              <dl class="ads-dl">
                <dt>WebSocket</dt><dd>bidirectional, high-frequency — live crawl progress</dd>
                <dt>SSE</dt><dd>one-way server push — alert feeds, job status</dd>
                <dt>Polling</dt><dd>everything else — background metrics, 30–60s</dd>
                <dt>Never</dt><dd>a figure that moves while someone is reading it aloud</dd>
              </dl>
              <template #use>
                <li>Show the last-updated time beside anything live. "When was this true?" is the first question.</li>
                <li>Let the reader pause the stream — the live updates switch exists for a reason.</li>
              </template>
              <template #avoid>
                <li>Animating a figure on every tick. The movement reads as change even when the value has not changed.</li>
              </template>
            </AdsSpec>
          </div>

          <div v-reveal class="checklist card">
            <span class="ads-label">Before you call it finished</span>
            <ul>
              <li v-for="(c, i) in checklist" :key="i">
                <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>{{ c }}
              </li>
            </ul>
          </div>
        </section>

        <footer class="ads-foot">
          <p class="body">
            ADS v1.0 · {{ adsComponentCount }} entries · four families,
            hand-drawn charts, no component library. Tokens live in
            <code>app/assets/css/main.css</code>, component classes in
            <code>app/assets/css/ads.css</code>, and the contents in
            <code>app/composables/useAdsManifest.ts</code>. The data palette
            was validated against both surfaces rather than chosen by eye.
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding: 0 clamp(20px, 4vw, 48px);
}

/* ─── Masthead ─────────────────────────────────────────────────────────── */

.masthead {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: clamp(28px, 4vw, 44px) 0 26px;
  border-bottom: 1px solid var(--line);
}

.screen-title {
  font-size: clamp(2.2rem, 5vw, 3.1rem);
  font-variation-settings: 'opsz' 40;
}

.screen-sub {
  margin-top: 6px;
  font-size: 0.78rem;
  color: var(--subdued);
}

.screen-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ─── Index column + content ───────────────────────────────────────────── */

.ads-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 40px;
}

/* The index needs room before it earns its place; below this the rail's
   group list is enough, and the column would only squeeze the specimens. */
@media (min-width: 1100px) {
  .ads-shell {
    grid-template-columns: 206px minmax(0, 1fr);
    gap: 48px;
    align-items: start;
  }
}

/* The index is the page's only navigation now, so it is never hidden —
   above 1100px it is the sticky column, below it a disclosure. */
.index-col {
  display: block;
  margin-bottom: 8px;
}

@media (min-width: 1100px) {
  .index-col {
    display: grid;
    margin-bottom: 0;
  }
}

.content {
  min-width: 0;
}

/* ─── Intro ────────────────────────────────────────────────────────────── */

.intro {
  padding: clamp(36px, 5vw, 52px) 0;
  display: grid;
  gap: 32px;
}

.intro .lede {
  max-width: 66ch;
}

.intro-rules {
  display: grid;
  gap: 20px;
}

@media (min-width: 720px) {
  .intro-rules {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.intro-rule {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.rule-n {
  font-size: 0.76rem;
  color: var(--accent);
  padding-top: 3px;
}

.rule-name {
  margin: 0 0 5px;
  font-family: var(--font-display);
  font-size: 1.02rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

.compare strong {
  color: var(--text);
  font-weight: 560;
}

/* ─── Bands ────────────────────────────────────────────────────────────── */

.band {
  padding: clamp(52px, 7vw, 80px) 0;
  border-top: 1px solid var(--line);
  scroll-margin-top: 20px;
}

.specs {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--gutter);
}

/* ─── Foundations ──────────────────────────────────────────────────────── */

.found-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--gutter);
}

@media (min-width: 880px) {
  .found-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .found.wide {
    grid-column: 1 / -1;
  }
}

.found {
  display: grid;
  gap: 13px;
  align-content: start;
  scroll-margin-top: 24px;
}

.found-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text);
}

.found .body {
  font-size: 0.87rem;
  max-width: 54ch;
}

.glyph-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 18px 14px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}

.glyph-grid li {
  display: grid;
  justify-items: center;
  gap: 9px;
}

.glyph-tile {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-raised-sm);
  color: var(--text);
  transition: box-shadow 0.25s var(--ease), transform 0.25s var(--ease);
}

.glyph-grid li:hover .glyph-tile {
  box-shadow: var(--soft-inset-sm);
  transform: scale(0.97);
}

.glyph-grid code {
  font-size: 0.68rem;
  color: var(--subdued);
}

.swatches {
  display: grid;
  gap: 8px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.swatches li {
  display: grid;
  grid-template-columns: 30px minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  font-size: 0.78rem;
}

.sw {
  height: 24px;
  border-radius: 7px;
  box-shadow: var(--soft-raised-sm);
}

.swatches code,
.motion-list code,
.depth code,
.radius code {
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--text-soft);
}

.depths,
.radii {
  display: grid;
  gap: 12px;
  margin-top: 4px;
}

.depth {
  display: grid;
  grid-template-columns: 62px minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  font-size: 0.78rem;
}

.depth-box {
  display: grid;
  place-items: center;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  font-family: var(--mono);
  font-size: 0.66rem;
  color: var(--subdued);
}

.radius {
  display: grid;
  grid-template-columns: 44px minmax(0, auto) minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  font-size: 0.78rem;
}

.radius-box {
  height: 38px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
}

.type-list {
  display: grid;
  gap: 18px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}

.type-list li {
  display: grid;
  gap: 6px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.type-list li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.type-sample {
  color: var(--text);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.type-note {
  font-family: var(--mono);
  font-size: 0.7rem;
}

.motion-list {
  display: grid;
  gap: 9px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
}

.motion-list li {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 4px 14px;
  font-size: 0.8rem;
  color: var(--text-soft);
  padding-bottom: 9px;
  border-bottom: 1px solid var(--line);
}

.motion-list li:last-child {
  border-bottom: 0;
}

.motion-list .dim {
  grid-column: 1 / -1;
  font-size: 0.73rem;
}

/* ─── Colour ───────────────────────────────────────────────────────────── */

.thesis {
  display: grid;
  gap: 22px;
  width: 100%;
}

@media (min-width: 640px) {
  .thesis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.thesis-col {
  display: grid;
  gap: 9px;
  align-content: start;
}

.series-block,
.ramps {
  display: grid;
  gap: 24px;
  width: 100%;
}

.series-block > div,
.ramps > div {
  display: grid;
  gap: 11px;
}

.vision {
  display: grid;
  gap: 20px;
  width: 100%;
}

@media (min-width: 760px) {
  .vision {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: 28px;
  }
}

.brand-block {
  display: grid;
  gap: 24px;
  width: 100%;
}

.brand-block > div:not(.ads-banner) {
  display: grid;
  gap: 12px;
}

.brand-row {
  display: grid;
  gap: 14px;
}

@media (min-width: 620px) {
  .brand-row {
    grid-template-columns: repeat(auto-fit, minmax(min(230px, 100%), 1fr));
  }
}

.brand-card {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 14px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

.brand-chip {
  width: 34px;
  height: 46px;
  border-radius: 9px;
  box-shadow: var(--soft-raised-sm);
}

.brand-chip.is-light {
  width: 18px;
}

.brand-meta {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 0.97rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
}

.brand-meta code {
  font-family: var(--mono);
  font-size: 0.68rem;
  color: var(--text-soft);
}

.brand-meta .dim {
  font-size: 0.78rem;
}

.brand-de {
  font-size: 0.66rem;
  color: var(--subdued);
}

/* ─── Layout ───────────────────────────────────────────────────────────── */

.grid-demo,
.scan-demo {
  display: grid;
  gap: 14px;
  width: 100%;
}

.scan-demo {
  gap: 8px;
}

.scan-zone {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.85rem;
  color: var(--text-soft);
}

.scan-zone .num {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  flex: none;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.68rem;
}

.scan-zone.z2 {
  opacity: 0.78;
}

.scan-zone.z3 {
  opacity: 0.56;
}

.density-note {
  font-family: var(--mono);
  font-size: 0.74rem;
}

/* ─── Specimen helpers ─────────────────────────────────────────────────── */

.demo-card {
  display: grid;
  gap: 5px;
  min-width: 190px;
}

.demo-card.is-small {
  padding: 14px 18px;
  font-size: 0.85rem;
  color: var(--text-soft);
  min-width: 0;
}

.demo-figure {
  font-size: 1.7rem;
  font-weight: 500;
  letter-spacing: -0.03em;
}

.demo-note {
  font-size: 0.75rem;
}

.demo-well {
  padding: 20px 24px;
  font-size: 0.88rem;
  color: var(--subdued);
}

.icon-btn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
  transition:
    color 0.25s var(--ease),
    box-shadow 0.25s var(--ease);
}

.icon-btn:hover {
  color: var(--accent);
}

.icon-btn:active {
  box-shadow: var(--soft-inset-sm);
}

.link-demo {
  max-width: 54ch;
  margin: 0;
}

.field-demo {
  display: grid;
  gap: 16px;
  width: 100%;
}

@media (min-width: 640px) {
  .field-demo {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.ads-field.st {
  width: auto;
  max-width: 130px;
  font-size: 0.8rem;
  padding: 8px 11px;
}

.choice-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 26px;
}

.range-demo {
  display: grid;
  gap: 11px;
  width: 100%;
}

.range-demo label {
  display: flex;
  justify-content: space-between;
}

.stack {
  display: grid;
  gap: 8px;
}

.meter-demo {
  display: grid;
  gap: 13px;
  width: 100%;
}

.meter-row {
  display: grid;
  grid-template-columns: minmax(70px, 110px) minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  font-size: 0.82rem;
}

.meter-val {
  font-size: 0.76rem;
  color: var(--text-soft);
}

.choice-table {
  width: 100%;
  overflow-x: auto;
}

.choice-table table {
  width: 100%;
  min-width: 540px;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.choice-table th {
  text-align: left;
  padding: 0 12px 10px;
  font-family: var(--font-label);
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subdued);
  border-bottom: 1px solid var(--line);
}

.choice-table td {
  padding: 11px 12px;
  border-bottom: 1px solid var(--line);
  vertical-align: top;
  color: var(--text-soft);
}

.choice-table tr:last-child td {
  border-bottom: 0;
}

.c-job {
  color: var(--text);
  white-space: nowrap;
}

.c-form {
  font-family: var(--mono);
  font-size: 0.78rem;
}

.chart-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 26px;
  align-items: center;
}

@media (min-width: 680px) {
  .chart-demo {
    grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr);
  }
  .chart-demo > :last-child {
    grid-column: 2 / -1;
  }
}

.chart-cell {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.drawer-note {
  margin: 8px 0 0;
  font-size: 0.84rem;
}

.skel-demo,
.feedback-demo,
.filter-demo {
  display: grid;
  gap: 14px;
  width: 100%;
}

.row-gap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.modal-title {
  margin: 7px 0 8px;
  font-family: var(--font-display);
  font-size: 1.16rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--text);
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

/* ─── Patterns ─────────────────────────────────────────────────────────── */

.kpi-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  width: 100%;
}

@media (min-width: 560px) {
  .kpi-row {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.filter-bar .ads-search {
  flex: 1 1 200px;
}

.saved-views {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
}

.screen-demo {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
  width: 100%;
}

.screen-demo-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-title {
  margin: 0 0 3px;
  font-size: 1.4rem;
  font-variation-settings: 'opsz' 18;
  color: var(--text);
}

.screen-demo-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.78rem;
}

.ladder {
  display: grid;
  gap: 10px;
  width: 100%;
}

.rung {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.87rem;
  color: var(--subdued);
}

.rung strong {
  color: var(--text);
  font-weight: 560;
}

.rung-n {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--accent-ink);
  font-size: 0.68rem;
}

/* ─── Engineering ──────────────────────────────────────────────────────── */

.load-demo {
  display: grid;
  gap: 9px;
  width: 100%;
}

.load-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
}

.load-bar {
  padding: 9px 13px;
  border-radius: 9px;
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
  font-size: 0.82rem;
  color: var(--text-soft);
}

.load-bar.now {
  background: var(--accent);
  color: var(--accent-ink);
}

.load-bar.dim-bar {
  opacity: 0.6;
}

.checklist {
  margin-top: var(--gutter);
  display: grid;
  gap: 14px;
}

.checklist ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.checklist li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  font-size: 0.88rem;
  color: var(--subdued);
}

.checklist .num {
  color: var(--accent);
  font-size: 0.74rem;
  padding-top: 2px;
}

/* ─── Seam demo ────────────────────────────────────────────────────────── */

.seam-demo {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  min-height: 170px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--rail);
  width: 100%;
}

.seam-rail {
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 14px 0;
  position: relative;
}

.seam-row {
  position: relative;
  display: flex;
  align-items: center;
  height: 44px;
  padding-left: 18px;
  font-size: 0.88rem;
  color: var(--subdued);
}

.seam-row.is-on {
  color: var(--text);
  font-weight: 600;
}

.seam-label {
  position: relative;
  z-index: 1;
}

.seam-tab {
  position: absolute;
  inset: 0 -2px 0 8px;
  border-radius: 16px 0 0 16px;
  background: var(--surface);
}

.seam-fillet {
  position: absolute;
  right: 0;
  width: 12px;
  height: 12px;
}

.seam-fillet.top {
  top: -12px;
  background: radial-gradient(circle 12px at top left, transparent 12px, var(--surface) 12px);
}

.seam-fillet.bottom {
  bottom: -12px;
  background: radial-gradient(circle 12px at bottom left, transparent 12px, var(--surface) 12px);
}

.seam-frame {
  display: grid;
  place-items: center;
  background: var(--surface);
  color: var(--subdued);
  font-size: 0.82rem;
}

/* ─── Foot ─────────────────────────────────────────────────────────────── */

.ads-foot {
  padding: 40px 0 16px;
  border-top: 1px solid var(--line);
}

.ads-foot code {
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-soft);
}
</style>

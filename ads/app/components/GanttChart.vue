<script setup lang="ts">
// The engagement, as a Gantt chart.
//
// Two things make it worth building rather than drawing: the length control
// rescales the whole plan, because a four-week job and a twelve-week job are
// the same shape at different sizes; and the marker can be dragged across the
// timeline to ask "what is happening in week six?" — which is the only
// question anyone actually brings to a Gantt chart.
//
// Phase extents are stored as fractions of the engagement rather than dates,
// so one set of numbers serves every duration and the bars are positioned in
// percentages that need no measuring.

type Phase = {
  name: string
  tech?: string
  from: number
  to: number
  detail: string
}

const phases: Phase[] = [
  {
    name: 'Discovery & read',
    from: 0,
    to: 0.12,
    detail: 'We use the product the way your users do and write down every question the screen implies but does not answer.',
  },
  {
    name: 'Information design',
    from: 0.08,
    to: 0.3,
    detail: 'The decisions the interface exists to support, ranked. Mostly argument rather than pixels, and where most of the value is.',
  },
  {
    name: 'Design system',
    tech: 'Flutter',
    from: 0.22,
    to: 0.5,
    detail: 'Tokens, surfaces and type as a themed library — light, dark and density modes from one source.',
  },
  {
    name: 'Interface build',
    tech: 'Flutter',
    from: 0.38,
    to: 0.84,
    detail: 'Screens assembled from the system and reviewed in a branch. Design and front-end code happen together, never as a handover.',
  },
  {
    name: 'Engine & data',
    tech: 'Rust',
    from: 0.3,
    to: 0.72,
    detail: 'The work behind the chart: queries, aggregation and whatever has to stay fast when the dataset stops being a demo.',
  },
  {
    name: 'Platform build',
    tech: 'iOS',
    from: 0.58,
    to: 0.9,
    detail: 'Native shell, platform conventions and the parts of the interface that should not be a web view.',
  },
  {
    name: 'Testing & access',
    from: 0.62,
    to: 0.96,
    detail: 'Keyboard paths, contrast, reduced motion and screen readers — checked against the build rather than promised in a deck.',
  },
  {
    name: 'Handover',
    from: 0.88,
    to: 1,
    detail: 'Tokens, components and the reasoning behind them, written down so the next person does not have to guess.',
  },
]

// from-index → to-index. Drawn as elbows, the way a real Gantt shows that one
// piece of work cannot begin until another has produced something.
const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 4],
  [4, 5],
  [3, 6],
  [6, 7],
]

const durations = [
  { weeks: 4, label: '1 month' },
  { weeks: 8, label: '2 months' },
  { weeks: 12, label: '3 months' },
]

const weeks = ref(8)
// Where the scrub marker sits, as a fraction of the engagement.
const at = ref(0.42)
const selected = ref<number | null>(null)
const track = ref<HTMLElement>()

const ROW = 46 // row height in px; the link elbows do their y arithmetic on it

const weekCols = computed(() => Array.from({ length: weeks.value }, (_, i) => i + 1))
const currentWeek = computed(() => Math.max(1, Math.ceil(at.value * weeks.value)))

const active = computed(() =>
  phases.filter((p) => at.value >= p.from && at.value <= p.to).map((p) => p.name),
)

function weekRange(p: Phase) {
  const first = Math.max(1, Math.ceil(p.from * weeks.value) || 1)
  const last = Math.max(first, Math.ceil(p.to * weeks.value))
  return first === last ? `wk ${first}` : `wk ${first}–${last}`
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`

// ─── The marker ──────────────────────────────────────────────────────────

function fractionFrom(clientX: number) {
  const rect = track.value!.getBoundingClientRect()
  return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
}

function onPointerDown(e: PointerEvent) {
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  at.value = fractionFrom(e.clientX)
}

function onPointerMove(e: PointerEvent) {
  // buttons is 0 unless a button is held, which is what keeps this from
  // following the pointer around after the drag has finished.
  if (e.buttons === 0) return
  at.value = fractionFrom(e.clientX)
}

function onKey(e: KeyboardEvent) {
  const step = 1 / (weeks.value * 2)
  if (e.key === 'ArrowRight') at.value = Math.min(1, at.value + step)
  else if (e.key === 'ArrowLeft') at.value = Math.max(0, at.value - step)
  else if (e.key === 'Home') at.value = 0
  else if (e.key === 'End') at.value = 1
  else return
  e.preventDefault()
}

// ─── Links ───────────────────────────────────────────────────────────────

// Each elbow is two absolutely-positioned rules rather than an SVG overlay,
// because the x coordinates are percentages of a flexible track and the y
// coordinates are multiples of a fixed row height. Mixing those units inside
// one SVG viewBox means measuring the track on every resize; in CSS it costs
// nothing.
const elbows = computed(() =>
  links.map(([a, b]) => {
    const from = phases[a]!
    const to = phases[b]!
    const top = Math.min(a, b) * ROW + ROW / 2
    const height = Math.abs(b - a) * ROW
    return {
      key: `${a}-${b}`,
      x: pct(from.to),
      top,
      height,
      armTop: b * ROW + ROW / 2,
      armWidth: pct(Math.max(0, to.from - from.to)),
    }
  }),
)
</script>

<template>
  <div class="ads-gantt-chart card">
    <header class="ads-gantt-chart__head">
      <div>
        <span class="eyebrow">Typical engagement</span>
        <h3 class="h3">{{ durations.find((d) => d.weeks === weeks)?.label }}, start to handover</h3>
      </div>
      <div class="ads-segmented" role="group" aria-label="Engagement length">
        <button
          v-for="d in durations"
          :key="d.weeks"
          type="button"
          :class="{ 'is-on': weeks === d.weeks }"
          :aria-pressed="weeks === d.weeks"
          @click="weeks = d.weeks"
        >
          {{ d.label }}
        </button>
      </div>
    </header>

    <div class="ads-gantt-chart__scroller">
      <div class="ads-gantt-chart__chart">
        <!-- Left column: the phase list -->
        <div class="ads-gantt-chart__names">
          <div class="ads-gantt-chart__col-head">
            <span class="eyebrow">Phase</span>
            <span class="eyebrow">Weeks</span>
          </div>
          <button
            v-for="(p, i) in phases"
            :key="p.name"
            type="button"
            class="ads-gantt-chart__name-row"
            :class="{ 'is-active': active.includes(p.name), 'is-picked': selected === i }"
            :aria-expanded="selected === i"
            @click="selected = selected === i ? null : i"
          >
            <span class="ads-gantt-chart__name">
              {{ p.name }}
              <span v-if="p.tech" class="ads-gantt-chart__tech num">{{ p.tech }}</span>
            </span>
            <span class="ads-gantt-chart__weeks num">{{ weekRange(p) }}</span>
          </button>
        </div>

        <!-- Right column: the timeline -->
        <div class="ads-gantt-chart__lanes">
          <TransitionGroup tag="div" name="ads-gantt-chart__col" class="ads-gantt-chart__col-head ads-gantt-chart__weeks-head">
            <span
              v-for="w in weekCols"
              :key="w"
              class="ads-gantt-chart__week num"
              :style="{ width: pct(1 / weeks) }"
            >{{ w }}</span>
          </TransitionGroup>

          <div
            ref="track"
            class="ads-gantt-chart__track"
            :style="{ '--cols': weeks }"
            role="slider"
            tabindex="0"
            :aria-valuemin="1"
            :aria-valuemax="weeks"
            :aria-valuenow="currentWeek"
            :aria-valuetext="`Week ${currentWeek} of ${weeks}`"
            aria-label="Scrub the timeline"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @keydown="onKey"
          >
            <!-- Dependency elbows, drawn under the bars -->
            <span
              v-for="e in elbows"
              :key="e.key"
              class="ads-gantt-chart__elbow-v"
              :style="{ left: e.x, top: `${e.top}px`, height: `${e.height}px` }"
            />
            <span
              v-for="e in elbows"
              :key="`${e.key}-arm`"
              class="ads-gantt-chart__elbow-h"
              :style="{ left: e.x, top: `${e.armTop}px`, width: e.armWidth }"
            />

            <div
              v-for="(p, i) in phases"
              :key="p.name"
              class="ads-gantt-chart__lane"
              :style="{ height: `${ROW}px` }"
            >
              <span
                class="ads-gantt-chart__bar"
                :class="{ 'is-active': active.includes(p.name), 'is-picked': selected === i }"
                :style="{ left: pct(p.from), width: pct(p.to - p.from) }"
                @click.stop="selected = selected === i ? null : i"
              >
                <span class="ads-gantt-chart__bar-label">{{ p.tech || p.name }}</span>
              </span>
            </div>

            <!-- The scrub marker -->
            <span class="ads-gantt-chart__marker" :style="{ left: pct(at) }">
              <span class="ads-gantt-chart__flag num">wk {{ currentWeek }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <footer class="ads-gantt-chart__foot">
      <p class="body ads-gantt-chart__readout">
        <span class="eyebrow">Week {{ currentWeek }}</span>
        <TransitionGroup tag="span" name="ads-gantt-chart__phase" class="ads-gantt-chart__active-list">
          <span v-for="name in active" :key="name" class="ads-gantt-chart__active-item">{{ name }}</span>
          <span v-if="!active.length" key="none" class="dim">Nothing scheduled — drag the marker.</span>
        </TransitionGroup>
      </p>
      <Transition name="ads-gantt-chart__detail">
        <p v-if="selected !== null" class="body ads-gantt-chart__detail">
          <strong>{{ phases[selected]!.name }}.</strong>
          {{ phases[selected]!.detail }}
        </p>
      </Transition>
    </footer>
  </div>
</template>

<style scoped>
.ads-gantt-chart {
  display: grid;
  gap: 22px;
  padding: clamp(20px, 3vw, 28px);
}

.ads-gantt-chart__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ads-gantt-chart__head .eyebrow {
  margin-bottom: 7px;
}

/* ─── Frame ────────────────────────────────────────────────────────────── */

/* A Gantt cannot be made narrow enough for a phone without becoming useless,
   so below its minimum it scrolls sideways and the phase names stay put. */
.ads-gantt-chart__scroller {
  overflow-x: auto;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  padding: 4px;
}

.ads-gantt-chart__chart {
  display: grid;
  grid-template-columns: minmax(232px, 252px) minmax(430px, 1fr);
  min-width: 690px;
}

.ads-gantt-chart__col-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: 0 12px;
  border-bottom: 1px solid var(--line);
}

/* ─── Phase list ───────────────────────────────────────────────────────── */

.ads-gantt-chart__names {
  position: sticky;
  left: 0;
  z-index: 3;
  background: var(--surface);
  border-right: 1px solid var(--line);
}

.ads-gantt-chart__name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  height: 46px;
  padding: 0 12px;
  text-align: left;
  font-size: 0.87rem;
  color: var(--text-soft);
  border-bottom: 1px solid var(--line);
  transition:
    color var(--dur-control) var(--ease),
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-gantt-chart__name-row:last-child {
  border-bottom: 0;
}

.ads-gantt-chart__name-row:hover {
  color: var(--text);
  background: var(--hover);
}

/* The phases running at the marker's position. */
.ads-gantt-chart__name-row.is-active {
  color: var(--text);
  box-shadow: inset 2px 0 0 var(--accent);
}

.ads-gantt-chart__name-row.is-picked {
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

.ads-gantt-chart__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ads-gantt-chart__tech {
  font-size: 0.64rem;
  letter-spacing: 0.06em;
  padding: 2px 7px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
  flex: none;
}

.ads-gantt-chart__weeks {
  font-size: 0.7rem;
  color: var(--subdued);
  flex: none;
}

/* ─── Timeline ─────────────────────────────────────────────────────────── */

.ads-gantt-chart__weeks-head {
  padding: 0;
}

.ads-gantt-chart__week {
  display: grid;
  place-items: center;
  font-size: 0.68rem;
  color: var(--subdued);
  flex: none;
}

.ads-gantt-chart__track {
  position: relative;
  /* Week gridlines, drawn rather than marked up — one element instead of
     twelve, and they resize with the column count. */
  background-image: linear-gradient(to right, var(--line) 1px, transparent 1px);
  background-size: calc(100% / var(--cols)) 100%;
  cursor: ew-resize;
  touch-action: pan-y;
}

.ads-gantt-chart__track:focus-visible {
  outline-offset: -2px;
}

.ads-gantt-chart__lane {
  position: relative;
  border-bottom: 1px solid var(--line);
}

.ads-gantt-chart__lane:last-of-type {
  border-bottom: 0;
}

.ads-gantt-chart__bar {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  height: 26px;
  display: flex;
  align-items: center;
  padding: 0 11px;
  border-radius: var(--pill);
  background: var(--elevated);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
  cursor: pointer;
  overflow: hidden;
  transition:
    background var(--dur-control) var(--ease),
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-gantt-chart__bar:hover {
  color: var(--text);
}

/* Running at the marker: the bar takes the accent. With no hue to spend,
   being the brightest thing in the row is the whole signal. */
.ads-gantt-chart__bar.is-active {
  background: var(--accent);
  color: var(--accent-ink);
}

.ads-gantt-chart__bar.is-picked {
  box-shadow: var(--soft-inset-sm);
}

.ads-gantt-chart__bar-label {
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Elbows ───────────────────────────────────────────────────────────── */

.ads-gantt-chart__elbow-v,
.ads-gantt-chart__elbow-h {
  position: absolute;
  background: var(--subdued);
  opacity: 0.75;
  pointer-events: none;
}

.ads-gantt-chart__elbow-v {
  width: 1px;
}

/* A dot where the connector meets the dependent row. A bare hairline reads
   as a stray gridline; the dot is what makes it read as an arrival. */
.ads-gantt-chart__elbow-v::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: -2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--subdued);
}

.ads-gantt-chart__elbow-h {
  height: 1px;
}

/* ─── Marker ───────────────────────────────────────────────────────────── */

.ads-gantt-chart__marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--accent);
  pointer-events: none;
}

/* A hairline is easy to lose against the gridlines, so the marker carries a
   soft glow of its own. */
.ads-gantt-chart__marker::before {
  content: '';
  position: absolute;
  inset: 0 -6px;
  background: var(--accent);
  opacity: 0.12;
  filter: blur(5px);
}

.ads-gantt-chart__flag {
  position: absolute;
  top: -31px;
  left: 50%;
  translate: -50% 0;
  font-size: 0.64rem;
  padding: 3px 9px;
  border-radius: var(--pill);
  background: var(--accent);
  color: var(--accent-ink);
  white-space: nowrap;
}

/* ─── Readout ──────────────────────────────────────────────────────────── */

.ads-gantt-chart__foot {
  display: grid;
  gap: 12px;
}

/* Week columns, entering and leaving as the length changes. Absolute
   positioning on the leaving element keeps the remaining columns from
   jumping while it fades. */
.ads-gantt-chart__col-enter-active,
.ads-gantt-chart__col-leave-active {
  transition:
    opacity var(--dur-move) var(--ease),
    transform var(--dur-move) var(--ease);
}

.ads-gantt-chart__col-enter-from,
.ads-gantt-chart__col-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.ads-gantt-chart__col-leave-active {
  position: absolute;
}

/* Phase names arriving and leaving as the marker is dragged. */
.ads-gantt-chart__active-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
}

.ads-gantt-chart__active-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ads-gantt-chart__active-item:not(:last-child)::after {
  content: '·';
  color: var(--subdued);
}

.ads-gantt-chart__phase-enter-active,
.ads-gantt-chart__phase-leave-active {
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-gantt-chart__phase-enter-from,
.ads-gantt-chart__phase-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

.ads-gantt-chart__phase-leave-active {
  position: absolute;
}

.ads-gantt-chart__phase-move {
  transition: transform var(--dur-control) var(--ease);
}

.ads-gantt-chart__readout {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.88rem;
}

.ads-gantt-chart__detail {
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  font-size: 0.88rem;
  max-width: 68ch;
}

.ads-gantt-chart__detail strong {
  color: var(--text);
  font-weight: 540;
}

.ads-gantt-chart__detail-enter-active,
.ads-gantt-chart__detail-leave-active {
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-gantt-chart__detail-enter-from,
.ads-gantt-chart__detail-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

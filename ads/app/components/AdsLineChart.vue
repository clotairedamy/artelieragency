<script setup lang="ts">
// A line chart for a trend over an ordered axis. Hue is spent only on the
// lines, in slot order (--series-1 first); past eight, the remainder is summed
// into a grey "Other" rather than inventing a ninth colour. Everything that is
// text — the scale, the axis ends, the key — is in the text tokens, never in a
// series colour, and the scale is recessive: two figures and one baseline, no
// grid, no area fill. `label` names the figure and carries the unit
// ("Sessions per day, thousands"); the same data sits in a table for screen
// readers.
export type LineSeries = { name: string; points: number[] }
const props = withDefaults(
  defineProps<{
    label: string
    series?: LineSeries[]
    points?: number[]
    labels?: string[]
    height?: number
  }>(),
  { series: () => [], points: () => [], labels: () => [], height: 160 },
)

const W = 600
const H = 160
const PAD = 6
const MAX_SLOTS = 8

const fmt = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 2 })

type Drawn = LineSeries & { colour: string; other: boolean }

const drawn = computed<Drawn[]>(() => {
  const all = props.series.length ? props.series : props.points.length ? [{ name: props.label, points: props.points }] : []
  const kept: Drawn[] = all.slice(0, MAX_SLOTS).map((s, i) => ({ ...s, colour: `var(--series-${i + 1})`, other: false }))
  const rest = all.slice(MAX_SLOTS)
  if (rest.length) {
    const len = Math.max(...rest.map((s) => s.points.length))
    const sum = Array.from({ length: len }, (_, i) => rest.reduce((t, s) => t + (s.points[i] ?? 0), 0))
    kept.push({ name: 'Other', points: sum, colour: 'var(--subdued)', other: true })
  }
  return kept
})

const length = computed(() => Math.max(0, ...drawn.value.map((s) => s.points.length)))

const scale = computed(() => {
  const values = drawn.value.flatMap((s) => s.points)
  if (!values.length) return { min: 0, max: 0 }
  return { min: Math.min(...values), max: Math.max(...values) }
})

function path(points: number[]) {
  if (points.length < 2) return ''
  const { min, max } = scale.value
  const span = max - min || 1
  const step = W / Math.max(length.value - 1, 1)
  return points
    .map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(1)} ${(H - PAD - ((v - min) / span) * (H - PAD * 2)).toFixed(1)}`)
    .join(' ')
}

const xLabels = computed(() =>
  Array.from({ length: length.value }, (_, i) => props.labels[i] ?? String(i + 1)),
)
</script>

<template>
  <figure class="ads-line-chart" :aria-label="label">
    <div class="ads-line-chart__plot" aria-hidden="true">
      <div class="ads-line-chart__scale num">
        <span>{{ fmt(scale.max) }}</span>
        <span>{{ fmt(scale.min) }}</span>
      </div>
      <svg
        class="ads-line-chart__svg"
        :viewBox="`0 0 ${W} ${H}`"
        preserveAspectRatio="none"
        :style="{ height: `${height}px` }"
        focusable="false"
      >
        <line class="ads-line-chart__baseline" x1="0" :y1="H - 0.5" :x2="W" :y2="H - 0.5" vector-effect="non-scaling-stroke" />
        <g class="ads-line-chart__lines">
          <path
            v-for="s in drawn"
            :key="s.name"
            :d="path(s.points)"
            fill="none"
            :stroke="s.colour"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
      <div v-if="length" class="ads-line-chart__axis num">
        <span>{{ xLabels[0] }}</span>
        <span>{{ xLabels[length - 1] }}</span>
      </div>
    </div>

    <ul class="ads-line-chart__key" aria-hidden="true">
      <li v-for="s in drawn" :key="s.name" class="ads-line-chart__entry">
        <span class="ads-line-chart__swatch" :style="{ background: s.colour }" />
        <span class="ads-line-chart__name">{{ s.name }}</span>
        <span class="ads-line-chart__last num">{{ fmt(s.points[s.points.length - 1] ?? 0) }}</span>
      </li>
    </ul>

    <table class="sr-only">
      <caption>{{ label }}</caption>
      <thead>
        <tr>
          <th scope="col">Point</th>
          <th v-for="s in drawn" :key="s.name" scope="col">{{ s.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(x, i) in xLabels" :key="i">
          <th scope="row">{{ x }}</th>
          <td v-for="s in drawn" :key="s.name">{{ s.points[i] == null ? '' : fmt(s.points[i]!) }}</td>
        </tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.ads-line-chart {
  display: grid;
  gap: var(--sp-3);
  margin: 0;
}

.ads-line-chart__plot {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  column-gap: var(--sp-2);
}

.ads-line-chart__scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 0.68rem;
  color: var(--subdued);
}

.ads-line-chart__svg {
  display: block;
  width: 100%;
  overflow: visible;
}

.ads-line-chart__baseline {
  stroke: var(--line);
  stroke-width: 1;
}

.ads-line-chart__lines {
  animation: ads-line-chart-draw var(--dur-enter) var(--ease);
}

.ads-line-chart__axis {
  grid-column: 2;
  display: flex;
  justify-content: space-between;
  padding-top: var(--sp-1);
  font-size: 0.68rem;
  color: var(--subdued);
}

.ads-line-chart__key {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2) var(--sp-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ads-line-chart__entry {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.8rem;
}

.ads-line-chart__swatch {
  width: 12px;
  height: 3px;
  border-radius: var(--pill);
}

.ads-line-chart__name {
  color: var(--text-soft);
}

.ads-line-chart__last {
  color: var(--text);
}

/* The lines draw left to right, once, on arrival. */
@keyframes ads-line-chart-draw {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
</style>

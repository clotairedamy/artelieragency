<script setup lang="ts">
// A density grid. Magnitude is carried by the four luminance grades — the
// channel the eye reads fastest, and the one dense data keeps when hue would
// be noise: forty cells in three hues is a pattern, not a reading. Brighter is
// more, in either theme, because the grade tokens invert with it.
//
// The grid takes real values and quantises them itself into five steps: an
// empty well for nothing, then grades one to four. The axes are recessive —
// small, subdued, only as many labels as are given — and a compact legend
// says which end is which. The accessible name carries the shape and range,
// since a reader cannot inspect four hundred cells one by one.
const props = withDefaults(
  defineProps<{
    values: number[][]
    label: string
    rowLabels?: string[]
    colLabels?: string[]
    max?: number
    unit?: string
  }>(),
  { rowLabels: undefined, colLabels: undefined, max: undefined, unit: '' },
)

const flat = computed(() => props.values.flat())
const top = computed(() => props.max ?? Math.max(...flat.value, 0))
const low = computed(() => (flat.value.length ? Math.min(...flat.value) : 0))
const fmt = (n: number) => `${n.toLocaleString('en-GB')}${props.unit}`

// 0 → the empty well; anything above zero lands on grade 1–4.
function step(v: number) {
  if (v <= 0 || top.value <= 0) return 0
  return Math.max(1, Math.min(4, Math.ceil((v / top.value) * 4)))
}

// Every row shares one column template so the axis labels and the cells line
// up; the row-label column is fixed rather than max-content for the same reason.
const columns = computed(() => {
  const n = props.values[0]?.length ?? 0
  return `${props.rowLabels?.length ? '3.5rem ' : ''}repeat(${n}, minmax(0, 1fr))`
})

const name = computed(() => {
  const rows = props.values.length
  const cols = props.values[0]?.length ?? 0
  if (!rows || !cols) return `${props.label}: no data`
  return `${props.label}: ${rows} by ${cols} grid, values ${fmt(low.value)} to ${fmt(top.value)}`
})
</script>

<template>
  <figure class="ads-heatmap">
    <div class="ads-heatmap__plot sweep" role="img" :aria-label="name">
      <div v-if="colLabels?.length" class="ads-heatmap__row" :style="{ gridTemplateColumns: columns }" aria-hidden="true">
        <span v-if="rowLabels?.length" class="ads-heatmap__axis" />
        <span v-for="(c, x) in colLabels" :key="x" class="ads-heatmap__axis ads-heatmap__axis-col">{{ c }}</span>
      </div>
      <div v-for="(row, y) in values" :key="y" class="ads-heatmap__row" :style="{ gridTemplateColumns: columns }">
        <span v-if="rowLabels?.length" class="ads-heatmap__axis" aria-hidden="true">{{ rowLabels[y] }}</span>
        <span
          v-for="(v, x) in row"
          :key="x"
          class="ads-heatmap__cell"
          :class="`is-step-${step(v)}`"
          :title="`${rowLabels?.[y] ?? `Row ${y + 1}`}, ${colLabels?.[x] ?? `column ${x + 1}`}: ${fmt(v)}`"
        />
      </div>
    </div>
    <figcaption class="ads-heatmap__legend" aria-hidden="true">
      <span class="num">{{ fmt(low) }}</span>
      <span v-for="s in 5" :key="s" class="ads-heatmap__cell ads-heatmap__key" :class="`is-step-${s - 1}`" />
      <span class="num">{{ fmt(top) }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.ads-heatmap {
  display: grid;
  gap: var(--sp-3);
  margin: 0;
}

.ads-heatmap__plot {
  display: grid;
  gap: var(--sp-1);
}

.ads-heatmap__row {
  display: grid;
  align-items: center;
  gap: var(--sp-1);
}

/* Recessive axes: small mono, subdued, never competing with the cells. */
.ads-heatmap__axis {
  font-family: var(--mono);
  font-size: 0.6rem;
  color: var(--subdued);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ads-heatmap__axis-col {
  text-align: center;
}

.ads-heatmap__cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: var(--line);
  transition: background-color var(--dur-move) var(--ease);
}

.ads-heatmap__cell.is-step-1 { background: var(--grade-1); }
.ads-heatmap__cell.is-step-2 { background: var(--grade-2); }
.ads-heatmap__cell.is-step-3 { background: var(--grade-3); }
.ads-heatmap__cell.is-step-4 { background: var(--grade-4); }

.ads-heatmap__legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--sp-1);
  font-size: 0.62rem;
  color: var(--subdued);
}

.ads-heatmap__key {
  width: 10px;
}
</style>

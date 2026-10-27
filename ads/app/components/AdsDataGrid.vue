<script setup lang="ts">
// The table from the app, on the web.
//
// Rows are separated by a whisper rather than a rule — never striped, because
// a stripe is a second signal competing with the cursor and the grades.
// Numeric columns are right-aligned in tabular figures so they read by
// magnitude down the page; text stays left. A column's unit lives in its
// header, once, not in every cell. The header sorts, and a keyboard cursor
// moves with the arrow keys; Enter (or a click) selects the row, which is the
// cue to open it in a drawer beside the table — never in a modal over it.
export type Row = Record<string, string | number>

export type GridColumn = {
  key: string
  label: string
  /** Shown in the header after the label: "Latency (ms)". */
  unit?: string
  /** Right-aligned, tabular. Inferred when every value in the column is a number. */
  numeric?: boolean
  /** Monospaced but left-aligned: identifiers, hashes, paths. */
  mono?: boolean
  /** Values 1–4 rendered as a luminance grade with a dot and a word. */
  grade?: boolean
  format?: (v: string | number) => string
}

const props = defineProps<{
  columns: GridColumn[]
  rows: Row[]
  caption?: string
}>()

const emit = defineEmits<{ select: [row: Row, index: number] }>()

const sortKey = ref<string | null>(null)
const sortAsc = ref(true)
const cursor = ref(-1)
const wrap = ref<HTMLElement | null>(null)

const isNumeric = (c: GridColumn) =>
  !c.grade && (c.numeric ?? (props.rows.length > 0 && props.rows.every((r) => typeof r[c.key] === 'number')))

const cells = computed(() => props.columns.map((c) => ({ ...c, isNum: isNumeric(c) })))

const display = (c: GridColumn & { isNum: boolean }, v: string | number | undefined) => {
  if (v === undefined || v === null) return '—'
  if (c.format) return c.format(v)
  return c.isNum && typeof v === 'number' ? v.toLocaleString('en-GB') : String(v)
}

const sorted = computed(() => {
  if (!sortKey.value) return props.rows
  const key = sortKey.value
  return [...props.rows].sort((a, b) => {
    const x = a[key]
    const y = b[key]
    const cmp = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
    return sortAsc.value ? cmp : -cmp
  })
})

watch(
  () => props.rows,
  () => {
    if (cursor.value >= props.rows.length) cursor.value = props.rows.length - 1
  },
)

function sortBy(key: string) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function move(to: number) {
  const last = sorted.value.length - 1
  cursor.value = Math.max(0, Math.min(last, to))
  nextTick(() => {
    wrap.value?.querySelectorAll('tbody tr')[cursor.value]?.scrollIntoView({ block: 'nearest' })
  })
}

function select(i: number) {
  const row = sorted.value[i]
  if (row) emit('select', row, i)
}

function onKey(e: KeyboardEvent) {
  const page = 10
  const at = cursor.value
  if (e.key === 'ArrowDown') move(at + 1)
  else if (e.key === 'ArrowUp') move(at - 1)
  else if (e.key === 'PageDown') move(at + page)
  else if (e.key === 'PageUp') move(at - page)
  else if (e.key === 'Home') move(0)
  else if (e.key === 'End') move(sorted.value.length - 1)
  else if (e.key === 'Enter' && at >= 0) select(at)
  else return
  e.preventDefault()
}

// Four luminance steps stand in for severity. There is no red here, so the
// rule is simply: the worse it is, the brighter it is — and the word says it.
const gradeLabel = ['', 'low', 'medium', 'high', 'critical']
const asGrade = (v: string | number | undefined) => Math.max(1, Math.min(4, Number(v) || 1)) as 1 | 2 | 3 | 4

// The cursor is announced, since a moving highlight is invisible to a
// screen reader: the first column names the row.
const announce = computed(() => {
  const r = sorted.value[cursor.value]
  const first = cells.value[0]
  if (!r || !first) return ''
  return `${display(first, r[first.key])}, row ${cursor.value + 1} of ${sorted.value.length}`
})
</script>

<template>
  <div
    ref="wrap"
    class="ads-data-grid"
    tabindex="0"
    role="group"
    :aria-label="`${caption ?? 'Data table'}. Arrow keys move, Enter opens the row.`"
    @keydown="onKey"
  >
    <table class="ads-data-grid__table">
      <caption v-if="caption" class="sr-only">{{ caption }}</caption>
      <thead>
        <tr>
          <th
            v-for="c in cells"
            :key="c.key"
            scope="col"
            class="ads-data-grid__th"
            :class="{ 'is-num': c.isNum }"
            :aria-sort="sortKey === c.key ? (sortAsc ? 'ascending' : 'descending') : 'none'"
          >
            <button type="button" class="ads-data-grid__sort" @click="sortBy(c.key)">
              {{ c.label }}<span v-if="c.unit" class="ads-data-grid__unit"> ({{ c.unit }})</span>
              <span
                class="ads-data-grid__caret"
                :class="{ 'is-active': sortKey === c.key, 'is-desc': sortKey === c.key && !sortAsc }"
                aria-hidden="true"
              >↑</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(r, i) in sorted"
          :key="i"
          class="ads-data-grid__row"
          :class="{ 'is-cursor': cursor === i }"
          :aria-current="cursor === i ? 'true' : undefined"
          @mouseenter="cursor = i"
          @click="select(i)"
        >
          <td
            v-for="c in cells"
            :key="c.key"
            class="ads-data-grid__td"
            :class="{ 'is-num': c.isNum, num: c.isNum || c.mono }"
          >
            <AdsStatus v-if="c.grade" :grade="asGrade(r[c.key])" :label="gradeLabel[asGrade(r[c.key])]!" />
            <template v-else>{{ display(c, r[c.key]) }}</template>
          </td>
        </tr>
      </tbody>
    </table>
    <span class="sr-only" aria-live="polite">{{ announce }}</span>
  </div>
</template>

<style scoped>
.ads-data-grid {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  padding: 6px var(--sp-1);
  overflow-x: auto;
}

.ads-data-grid__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
  min-width: 540px;
}

.ads-data-grid__th {
  text-align: left;
  font-weight: 450;
  padding: 0;
}

.ads-data-grid__sort {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 14px;
  font-family: var(--font-label);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease);
}

.ads-data-grid__th.is-num .ads-data-grid__sort {
  justify-content: flex-end;
}

.ads-data-grid__sort:hover {
  color: var(--text);
}

/* Units are read once, in the header, quieter than the label they qualify. */
.ads-data-grid__unit {
  text-transform: none;
  letter-spacing: 0.04em;
}

.ads-data-grid__caret {
  opacity: 0;
  font-size: 0.8rem;
  transition:
    opacity var(--dur-control) var(--ease),
    transform var(--dur-control) var(--ease);
}

.ads-data-grid__caret.is-active {
  opacity: 1;
  color: var(--accent);
}

.ads-data-grid__caret.is-desc {
  transform: rotate(180deg);
}

.ads-data-grid__row {
  cursor: default;
}

.ads-data-grid__td {
  padding: 0 14px;
  height: var(--row-h);
  text-align: left;
  color: var(--text-soft);
  border-top: 1px solid var(--line);
  white-space: nowrap;
}

.ads-data-grid__td.is-num {
  text-align: right;
}

.ads-data-grid__row.is-cursor .ads-data-grid__td {
  color: var(--text);
  background: var(--hover);
}

/* The cursor bar is drawn as a box-shadow rather than a border, because a
   border on the focused row shrinks that row's content box and shifts every
   column by exactly its own width. */
.ads-data-grid__row.is-cursor .ads-data-grid__td:first-child {
  box-shadow: inset 2px 0 0 var(--accent);
}
</style>

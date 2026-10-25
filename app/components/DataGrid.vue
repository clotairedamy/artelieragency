<script setup lang="ts">
// The table from the app, on the web.
//
// Rows are separated by a whisper rather than a rule, numbers are monospaced
// so columns can be scanned downward, the header sorts, and a keyboard cursor
// moves with the arrow keys. The section of this site that argues most tables
// are unreadable had better ship a readable one.
export type Row = Record<string, string | number>

const props = defineProps<{
  columns: { key: string; label: string; align?: 'end'; mono?: boolean; grade?: boolean }[]
  rows: Row[]
  caption?: string
}>()

const sortKey = ref<string | null>(null)
const sortAsc = ref(true)
const cursor = ref(-1)

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

function sortBy(key: string) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  e.preventDefault()
  const next = cursor.value + (e.key === 'ArrowDown' ? 1 : -1)
  cursor.value = Math.max(0, Math.min(sorted.value.length - 1, next))
}

// Four luminance steps stand in for severity. There is no red here, so the
// rule is simply: the worse it is, the brighter it is.
const gradeLabel = ['', 'low', 'medium', 'high', 'critical']
</script>

<template>
  <div
    class="grid-wrap"
    tabindex="0"
    role="group"
    :aria-label="caption ?? 'Data table'"
    @keydown="onKey"
  >
    <table>
      <caption v-if="caption" class="sr-only">{{ caption }}</caption>
      <thead>
        <tr>
          <th
            v-for="c in columns"
            :key="c.key"
            :class="{ end: c.align === 'end' }"
            :aria-sort="sortKey === c.key ? (sortAsc ? 'ascending' : 'descending') : 'none'"
          >
            <button type="button" @click="sortBy(c.key)">
              {{ c.label }}
              <span class="caret" :class="{ on: sortKey === c.key, desc: sortKey === c.key && !sortAsc }">↑</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(r, i) in sorted"
          :key="i"
          :class="{ cursor: cursor === i }"
          @mouseenter="cursor = i"
        >
          <td
            v-for="c in columns"
            :key="c.key"
            :class="{ end: c.align === 'end', num: c.mono }"
          >
            <span v-if="c.grade" class="grade" :style="{ opacity: 0.4 + Number(r[c.key]) * 0.15 }">
              <span class="dot" />
              {{ gradeLabel[Number(r[c.key])] }}
            </span>
            <template v-else>{{ r[c.key] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.grid-wrap {
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
  padding: 6px 4px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
  min-width: 540px;
}

th {
  text-align: left;
  font-weight: 450;
  padding: 0;
}

th button {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 14px;
  font-family: var(--mono);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--subdued);
  transition: color 0.25s var(--ease);
}

th.end button {
  justify-content: flex-end;
}

th button:hover {
  color: var(--text);
}

.caret {
  opacity: 0;
  font-size: 0.8rem;
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease);
}

.caret.on {
  opacity: 1;
  color: var(--accent);
}

.caret.desc {
  transform: rotate(180deg);
}

td {
  padding: 0 14px;
  height: var(--row-h);
  color: var(--text-soft);
  border-top: 1px solid var(--line);
  white-space: nowrap;
}

td.end {
  text-align: right;
}

tr.cursor td {
  color: var(--text);
  background: var(--hover);
}

/* The cursor bar is drawn as a box-shadow rather than a border, because a
   border on the focused row shrinks that row's content box and shifts every
   column by exactly its own width. */
tr.cursor td:first-child {
  box-shadow: inset 2px 0 0 var(--accent);
}

.grade {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--mono);
  font-size: 0.72rem;
  color: var(--text);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
</style>

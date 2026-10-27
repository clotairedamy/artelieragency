<script setup lang="ts">
// A month grid for picking one day. Dates are ISO — the month reads
// "2026-10", the value is "2026-10-27" — and every figure is in the data face
// so the columns line up. It is a real grid: arrows move a day or a week,
// PageUp/PageDown move a month, Home/End go to the week's ends, and each day is
// a button that reads out its full date. The chosen day takes the accent; today
// is pressed in, so the two never depend on colour to be told apart.
withDefaults(defineProps<{ label?: string }>(), { label: 'Calendar' })
const value = defineModel<string>({ default: '' })

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function iso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
function parse(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null
}

const todayIso = iso(new Date())
// The month on view, as YYYY-MM. Left unbound, it opens on the chosen day's
// month, or this month.
const month = defineModel<string>('month', { default: '' })
if (!month.value) month.value = (value.value || todayIso).slice(0, 7)

const uid = useId()
const grid = ref<HTMLElement>()
const focusIso = ref(value.value || (month.value === todayIso.slice(0, 7) ? todayIso : `${month.value}-01`))

const WEEKDAYS = [
  ['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'],
  ['Fr', 'Friday'], ['Sa', 'Saturday'], ['Su', 'Sunday'],
] as const

const weeks = computed(() => {
  const [y, m] = month.value.split('-').map(Number) as [number, number]
  const first = new Date(y, m - 1, 1)
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const count = new Date(y, m, 0).getDate()
  const cells: (string | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= count; d++) cells.push(`${month.value}-${pad(d)}`)
  while (cells.length % 7) cells.push(null)
  const out: (string | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
  return out
})

// Keep the roving focus inside the month on view.
watch(month, (m) => {
  if (focusIso.value.slice(0, 7) !== m) {
    const day = Math.min(Number(focusIso.value.slice(8)) || 1, new Date(Number(m.slice(0, 4)), Number(m.slice(5)), 0).getDate())
    focusIso.value = `${m}-${pad(day)}`
  }
})

watch(value, (v) => {
  if (v && parse(v)) {
    focusIso.value = v
    month.value = v.slice(0, 7)
  }
})

function shiftMonth(n: number) {
  const [y, m] = month.value.split('-').map(Number) as [number, number]
  const d = new Date(y, m - 1 + n, 1)
  month.value = iso(d).slice(0, 7)
}

async function moveTo(d: Date) {
  focusIso.value = iso(d)
  month.value = focusIso.value.slice(0, 7)
  await nextTick()
  grid.value?.querySelector<HTMLElement>(`[data-iso="${focusIso.value}"]`)?.focus()
}

function onKeydown(e: KeyboardEvent) {
  const d = parse(focusIso.value)
  if (!d) return
  const dow = (d.getDay() + 6) % 7
  const step: Record<string, () => void> = {
    ArrowLeft: () => d.setDate(d.getDate() - 1),
    ArrowRight: () => d.setDate(d.getDate() + 1),
    ArrowUp: () => d.setDate(d.getDate() - 7),
    ArrowDown: () => d.setDate(d.getDate() + 7),
    Home: () => d.setDate(d.getDate() - dow),
    End: () => d.setDate(d.getDate() + (6 - dow)),
    PageUp: () => d.setMonth(d.getMonth() - (e.shiftKey ? 12 : 1)),
    PageDown: () => d.setMonth(d.getMonth() + (e.shiftKey ? 12 : 1)),
  }
  const fn = step[e.key]
  if (!fn) return
  e.preventDefault()
  fn()
  moveTo(d)
}

function pick(day: string) {
  value.value = day
  focusIso.value = day
}
</script>

<template>
  <div class="ads-calendar" role="group" :aria-labelledby="`${uid}-month`">
    <div class="ads-calendar__head">
      <button type="button" class="ads-calendar__nav" aria-label="Previous month" @click="shiftMonth(-1)">
        <Icon name="arrow" :size="14" style="transform: rotate(180deg)" />
      </button>
      <p :id="`${uid}-month`" class="ads-calendar__month" aria-live="polite">
        <span class="sr-only">{{ label }}, </span>{{ month }}
      </p>
      <button type="button" class="ads-calendar__nav" aria-label="Next month" @click="shiftMonth(1)">
        <Icon name="arrow" :size="14" />
      </button>
    </div>
    <table ref="grid" class="ads-calendar__grid" role="grid" :aria-labelledby="`${uid}-month`" @keydown="onKeydown">
      <thead>
        <tr>
          <th v-for="[short, full] in WEEKDAYS" :key="short" scope="col" class="ads-calendar__weekday">
            <abbr :title="full">{{ short }}</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, w) in weeks" :key="w">
          <td v-for="(day, i) in week" :key="i" role="gridcell" :aria-selected="day ? day === value : undefined">
            <button
              v-if="day"
              type="button"
              class="ads-calendar__day"
              :class="{ 'is-on': day === value, 'is-today': day === todayIso }"
              :data-iso="day"
              :tabindex="day === focusIso ? 0 : -1"
              :aria-label="day"
              :aria-current="day === todayIso ? 'date' : undefined"
              :aria-pressed="day === value"
              @click="pick(day)"
              @focus="focusIso = day"
            >{{ Number(day.slice(8)) }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.ads-calendar {
  width: fit-content;
  padding: var(--sp-4);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-calendar__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.ads-calendar__month {
  margin: 0;
  font-family: var(--mono);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.ads-calendar__nav {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
  transition: color var(--dur-control) var(--ease), box-shadow var(--dur-control) var(--ease);
}

.ads-calendar__nav:hover {
  color: var(--accent);
}

.ads-calendar__nav:active {
  box-shadow: var(--soft-inset-sm);
}

.ads-calendar__grid {
  border-collapse: separate;
  border-spacing: 2px;
}

.ads-calendar__weekday {
  height: 28px;
  font-family: var(--font-label);
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--subdued);
}

.ads-calendar__weekday abbr {
  text-decoration: none;
}

.ads-calendar__day {
  display: grid;
  place-items: center;
  width: 34px;
  height: 32px;
  border-radius: 9px;
  color: var(--text-soft);
  font-family: var(--mono);
  font-size: 0.82rem;
  font-variant-numeric: tabular-nums;
  transition: color var(--dur-control) var(--ease), box-shadow var(--dur-control) var(--ease);
}

.ads-calendar__day:hover {
  color: var(--accent);
}

.ads-calendar__day:active,
.ads-calendar__day.is-today {
  box-shadow: var(--soft-inset-sm);
}

.ads-calendar__day.is-today {
  color: var(--text);
}

.ads-calendar__day.is-on {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: none;
}
</style>

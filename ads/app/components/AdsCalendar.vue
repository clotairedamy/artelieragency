<script setup lang="ts">
// A month calendar. `value` is an ISO day (YYYY-MM-DD).
withDefaults(defineProps<{ value?: string; monthLabel?: string; days?: (number | null)[] }>(), {
  value: '',
  monthLabel: '',
  days: () => {
    // Simple 30-day month starting on Monday.
    const out: (number | null)[] = [null, null]
    for (let i = 1; i <= 30; i++) out.push(i)
    return out
  },
})
const emit = defineEmits<{ (e: 'update:value', v: string): void }>()
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
</script>

<template>
  <div class="calendar">
    <p v-if="monthLabel" class="cal-month">{{ monthLabel }}</p>
    <div class="cal-grid">
      <span v-for="w in WEEKDAYS" :key="w" class="cal-wd">{{ w }}</span>
      <button
        v-for="(d, i) in days"
        :key="i"
        type="button"
        class="cal-day"
        :class="{ empty: d == null, on: d != null && String(d).padStart(2, '0') === value.slice(-2) }"
        :disabled="d == null"
        @click="d != null && emit('update:value', String(d).padStart(2, '0'))"
      >{{ d ?? '' }}</button>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  width: fit-content;
  padding: 16px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.cal-month {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text);
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 34px);
  gap: 2px;
}

.cal-wd {
  display: grid;
  place-items: center;
  height: 28px;
  font-family: var(--mono);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--subdued);
}

.cal-day {
  display: grid;
  place-items: center;
  height: 32px;
  border-radius: 9px;
  color: var(--text-soft);
  font-family: var(--mono);
  font-size: 0.82rem;
}

.cal-day:hover:not(.empty) {
  background: var(--hover);
  color: var(--text);
}

.cal-day.empty {
  cursor: default;
}

.cal-day.on {
  color: var(--accent-ink);
  background: var(--accent);
}
</style>

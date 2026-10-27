<script setup lang="ts">
// A bar chart where value maps to luminance as well as height. With no hue to
// spend, brightness is the second channel — the tallest bar is also the
// brightest, so the ranking survives being glanced at.
//
// Every bar carries its category and its figure as real text, so the rows are
// their own table fallback; `label` names the whole figure ("Sessions by day,
// thousands") and is where the unit lives, not in every row.
const props = defineProps<{ data: { label: string; value: number }[]; label: string }>()
const max = computed(() => Math.max(...props.data.map((d) => d.value), 1))
const fmt = (n: number) => n.toLocaleString('en-GB')
</script>

<template>
  <div class="ads-bars" role="figure" :aria-label="label">
    <div v-for="(d, i) in data" :key="d.label" class="ads-bars__row">
      <span class="ads-bars__label">{{ d.label }}</span>
      <span class="ads-bars__track" aria-hidden="true">
        <span
          class="ads-bars__bar grow"
          :style="{
            width: `${(d.value / max) * 100}%`,
            opacity: 0.35 + (d.value / max) * 0.65,
            '--d': `${i * 90}ms`,
          }"
        />
      </span>
      <span class="num ads-bars__value">{{ fmt(d.value) }}</span>
    </div>
  </div>
</template>

<style scoped>
.ads-bars {
  display: grid;
  gap: var(--sp-3);
}

.ads-bars__row {
  display: grid;
  grid-template-columns: 1fr 2.1fr auto;
  align-items: center;
  gap: var(--sp-3);
  font-size: 0.85rem;
}

.ads-bars__label {
  color: var(--subdued);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ads-bars__track {
  height: 9px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.ads-bars__bar {
  display: block;
  height: 100%;
  border-radius: var(--pill);
  background: var(--accent);
  transition: width var(--dur-enter) var(--ease);
}

/* Figures right-aligned, so a column of them reads by magnitude. */
.ads-bars__value {
  font-size: 0.78rem;
  color: var(--text-soft);
  min-width: 2.4ch;
  text-align: right;
}
</style>

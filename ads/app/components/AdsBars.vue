<script setup lang="ts">
// A bar chart where value maps to luminance as well as height. With no hue to
// spend, brightness is the second channel — the tallest bar is also the
// brightest, so the ranking survives being glanced at.
const props = defineProps<{ data: { label: string; value: number }[] }>()
const max = computed(() => Math.max(...props.data.map((d) => d.value), 1))
</script>

<template>
  <div class="bars">
    <div v-for="(d, i) in data" :key="d.label" class="row">
      <span class="lab">{{ d.label }}</span>
      <span class="track">
        <span
          class="bar grow"
          :style="{
            width: `${(d.value / max) * 100}%`,
            opacity: 0.35 + (d.value / max) * 0.65,
            '--d': `${i * 90}ms`,
          }"
        />
      </span>
      <span class="num val">{{ d.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.bars {
  display: grid;
  gap: 11px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 2.1fr auto;
  align-items: center;
  gap: 14px;
  font-size: 0.85rem;
}

.lab {
  color: var(--subdued);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track {
  height: 9px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  overflow: hidden;
}

.bar {
  display: block;
  height: 100%;
  border-radius: var(--pill);
  background: var(--accent);
  transition: width 0.8s var(--ease);
}

.val {
  font-size: 0.78rem;
  color: var(--text-soft);
  min-width: 2.4ch;
  text-align: right;
}
</style>

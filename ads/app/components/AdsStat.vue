<script setup lang="ts">
// A KPI tile. The number is monospaced and large, the label is small and
// quiet, and the delta earns its space only when there is one.
withDefaults(
  defineProps<{ value: string | number; label: string; unit?: string; note?: string }>(),
  { unit: '', note: '' },
)
</script>

<template>
  <div class="tile card-press">
    <span class="eyebrow">{{ label }}</span>
    <span class="num value">{{ value }}<span v-if="unit" class="unit">{{ unit }}</span></span>
    <span v-if="note" class="note num">{{ note }}</span>
  </div>
</template>

<style scoped>
.tile {
  display: grid;
  gap: 7px;
  align-content: start;
  padding: 18px 20px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition: box-shadow 0.4s var(--ease);
}

.tile:hover {
  box-shadow: var(--soft-inset-sm);
}

/* A viewport reading like 1440×900 is a lot of monospaced characters for a
   half-width tile, so the number gives way before the box does. */
.value {
  font-size: clamp(1.1rem, 4.4cqw, 1.62rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.unit {
  font-size: 0.8rem;
  color: var(--subdued);
  margin-left: 2px;
}

.note {
  font-size: 0.7rem;
  color: var(--subdued);
}
</style>

<script setup lang="ts">
// A KPI tile. The number is monospaced and large, the label is small and
// quiet — and the figure always travels with a comparison, because a number
// on its own is a label with extra steps. Give it a delta, the previous
// period, a target, or at the very least a note saying what it is against.
const props = withDefaults(
  defineProps<{
    value: string | number
    label: string
    unit?: string
    /** The change, already formatted ("12.4%"). Read with `direction`. */
    delta?: string
    direction?: 'up' | 'down' | 'flat'
    /** The same figure last period, shown as "prev …". */
    previous?: string | number
    /** What the figure is aiming at, shown as "target …". */
    target?: string | number
    /** A free-form comparison: "+37 this run", "of 100". */
    note?: string
  }>(),
  { unit: '', delta: '', direction: 'flat', previous: undefined, target: undefined, note: '' },
)

const hasComparison = computed(
  () => !!props.delta || props.previous !== undefined || props.target !== undefined || !!props.note,
)

if (import.meta.dev && !hasComparison.value) {
  console.warn(`[AdsStat] "${props.label}" has no comparison — pass delta, previous, target or note.`)
}
</script>

<template>
  <div class="ads-stat card-press">
    <span class="eyebrow">{{ label }}</span>
    <span class="num ads-stat__value">{{ value }}<span v-if="unit" class="ads-stat__unit">{{ unit }}</span></span>
    <span v-if="hasComparison" class="ads-stat__compare">
      <AdsDelta v-if="delta" :direction="direction" :value="delta" />
      <span v-if="previous !== undefined" class="num ads-stat__note">prev {{ previous }}{{ unit }}</span>
      <span v-if="target !== undefined" class="num ads-stat__note">target {{ target }}{{ unit }}</span>
      <span v-if="note" class="num ads-stat__note">{{ note }}</span>
    </span>
  </div>
</template>

<style scoped>
.ads-stat {
  display: grid;
  gap: var(--sp-2);
  align-content: start;
  padding: var(--sp-4) var(--sp-5);
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  transition: box-shadow var(--dur-control) var(--ease);
}

.ads-stat:hover {
  box-shadow: var(--soft-inset-sm);
}

/* A viewport reading like 1440×900 is a lot of monospaced characters for a
   half-width tile, so the number gives way before the box does. */
.ads-stat__value {
  font-size: clamp(1.1rem, 4.4cqw, 1.62rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.ads-stat__unit {
  font-size: 0.8rem;
  color: var(--subdued);
  margin-left: 2px;
}

.ads-stat__compare {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--sp-1) var(--sp-3);
}

.ads-stat__note {
  font-size: 0.7rem;
  color: var(--subdued);
}
</style>

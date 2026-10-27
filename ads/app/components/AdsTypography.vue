<script setup lang="ts">
// Text in one of the system's type roles. The chrome is grey so the data can
// be coloured — roles stay quiet unless told otherwise.
withDefaults(
  defineProps<{ as?: string; role?: 'display' | 'title' | 'heading' | 'body' | 'lede' | 'eyebrow' | 'caption' | 'mono' }>(),
  { as: 'p', role: 'body' },
)
</script>

<template>
  <component :is="as" class="type" :class="`type-${role}`"><slot /></component>
</template>

<style scoped>
.type {
  margin: 0;
}

.type-display {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
}

.type-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--text);
}

.type-heading {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
  color: var(--text);
}

.type-body {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-soft);
}

.type-lede {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text);
}

.type-eyebrow {
  font-family: var(--mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--subdued);
}

.type-caption {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--subdued);
}

.type-mono {
  font-family: var(--mono);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}
</style>

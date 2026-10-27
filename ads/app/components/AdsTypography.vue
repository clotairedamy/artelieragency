<script setup lang="ts">
// Text in one of the system's type roles, so a page never invents a size. Each
// role has one face: display for headlines, UI for reading, the label face for
// eyebrows, the data face for figures. Roles stay in text tokens — the chrome
// is grey so the data can be coloured. `as` picks the element, so a display
// line can still be the page's h1.
withDefaults(
  defineProps<{ as?: string; role?: 'display' | 'title' | 'heading' | 'body' | 'lede' | 'eyebrow' | 'caption' | 'mono' }>(),
  { as: 'p', role: 'body' },
)
</script>

<template>
  <component :is="as" class="ads-typography" :class="`is-${role}`"><slot /></component>
</template>

<style scoped>
.ads-typography {
  margin: 0;
}

.ads-typography.is-display {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--text);
}

.ads-typography.is-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--text);
}

.ads-typography.is-heading {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
  color: var(--text);
}

.ads-typography.is-body {
  font-family: var(--font);
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-soft);
}

.ads-typography.is-lede {
  font-family: var(--font);
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text);
}

/* Eyebrows are labels, so they take the label face, as `.ads-label` does. */
.ads-typography.is-eyebrow {
  font-family: var(--font-label);
  font-size: 0.66rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--subdued);
}

.ads-typography.is-caption {
  font-family: var(--font);
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--subdued);
}

.ads-typography.is-mono {
  font-family: var(--mono);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
  color: var(--text);
}
</style>

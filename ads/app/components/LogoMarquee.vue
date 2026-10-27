<script setup lang="ts">
// A row of wordmarks, for "used by" or partner logos. Kept monochrome so they
// do not compete with the data; the accent is not spent here.
//
// It wraps rather than scrolls. A logo row is read once, and a strip that
// moves forever costs every reader attention to show the same six names —
// so there is nothing here for reduced motion to stop.
withDefaults(defineProps<{ names?: string[] }>(), {
  names: () => ['Northwind', 'Vantage', 'Halo', 'Meridian', 'Atlas', 'Orbital'],
})
</script>

<template>
  <ul class="ads-logo-marquee" role="list">
    <li v-for="(n, i) in names" :key="i" class="ads-logo-marquee__name">{{ n }}</li>
  </ul>
</template>

<style scoped>
.ads-logo-marquee {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3) var(--sp-7);
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ads-logo-marquee__name {
  font-family: var(--font-label);
  font-size: 0.82rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--subdued);
  white-space: nowrap;
}
</style>

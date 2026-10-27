<script setup lang="ts">
// The five pigments — the brand and semantic colours — at the values each
// theme actually uses. The only hue in the whole system.
export type Pigment = { name: string; role: string; dark: string; light: string }

withDefaults(defineProps<{ pigments?: Pigment[]; entries?: number; groups?: number }>(), {
  pigments: () => [
    { name: 'Tyrian', role: 'Primary', dark: '#b66dcc', light: '#8a4e9c' },
    { name: 'Verdigris', role: 'Secondary', dark: '#2b96a4', light: '#006981' },
    { name: 'Celadon', role: 'Success', dark: '#7bc062', light: '#317905' },
    { name: 'Orpiment', role: 'Warning', dark: '#d88c00', light: '#9d5500' },
    { name: 'Vermilion', role: 'Danger', dark: '#e55458', light: '#9e001f' },
  ],
  entries: 56,
  groups: 12,
})
</script>

<template>
  <div class="well palette">
    <dl class="palette-stats">
      <div><dt class="num">{{ entries }}</dt><dd>entries</dd></div>
      <div><dt class="num">{{ groups }}</dt><dd>groups</dd></div>
      <div><dt class="num">{{ pigments.length }}</dt><dd>pigments</dd></div>
    </dl>
    <ul class="palette-swatches">
      <li v-for="p in pigments" :key="p.name" class="sw" :style="{ '--d': p.dark, '--l': p.light }">
        <span class="sw-chip" />
        <span class="sw-name">{{ p.name }}</span>
        <span class="sw-role">{{ p.role }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.palette {
  display: grid;
  gap: 18px;
  padding: 20px 22px;
}

.palette-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.palette-stats dt {
  font-family: var(--font-display);
  font-size: 1.7rem;
  line-height: 1;
  color: var(--text);
}

.palette-stats dd {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: var(--subdued);
}

.palette-swatches {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.sw {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.sw-chip {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: var(--l);
  box-shadow: var(--soft-raised-sm);
}

[data-theme='dark'] .sw-chip {
  background: var(--d);
}

.sw-name {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--text);
}

.sw-role {
  font-family: var(--mono);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subdued);
}
</style>

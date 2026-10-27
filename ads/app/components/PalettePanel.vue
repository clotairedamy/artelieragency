<script setup lang="ts">
// The five pigments — the brand and semantic colours — at the values each
// theme actually uses. The only hue in the whole system.
//
// Each chip paints its token rather than a copied hex, so the panel can never
// disagree with the sheet it documents, and it re-steps with the theme for
// free. The set is closed: a pigment is one of the five tokens or it is not a
// pigment.
export type PigmentToken = '--brand-primary' | '--brand-secondary' | '--ok' | '--warn' | '--bad'
export type Pigment = { name: string; role: string; token: PigmentToken }

withDefaults(defineProps<{ pigments?: Pigment[]; entries?: number; groups?: number }>(), {
  pigments: () => [
    { name: 'Tyrian', role: 'Primary', token: '--brand-primary' },
    { name: 'Verdigris', role: 'Secondary', token: '--brand-secondary' },
    { name: 'Celadon', role: 'Success', token: '--ok' },
    { name: 'Orpiment', role: 'Warning', token: '--warn' },
    { name: 'Vermilion', role: 'Danger', token: '--bad' },
  ],
  entries: 56,
  groups: 12,
})
</script>

<template>
  <div class="well ads-palette-panel">
    <dl class="ads-palette-panel__stats">
      <div><dt>Entries</dt><dd class="num">{{ entries }}</dd></div>
      <div><dt>Groups</dt><dd class="num">{{ groups }}</dd></div>
      <div><dt>Pigments</dt><dd class="num">{{ pigments.length }}</dd></div>
    </dl>
    <ul class="ads-palette-panel__swatches">
      <li v-for="p in pigments" :key="p.name" class="ads-palette-panel__swatch">
        <span class="ads-palette-panel__chip" :style="{ background: `var(${p.token})` }" />
        <span class="ads-palette-panel__name">{{ p.name }}</span>
        <span class="ads-palette-panel__role">{{ p.role }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ads-palette-panel {
  display: grid;
  gap: 18px;
  padding: 20px 22px;
}

.ads-palette-panel__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--sp-2);
  margin: 0;
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--line);
}

/* Figure above its label: the reading order is label then figure, the
   visual order is the other way round. */
.ads-palette-panel__stats > div {
  display: flex;
  flex-direction: column-reverse;
  gap: var(--sp-1);
}

.ads-palette-panel__stats dt {
  font-size: 0.8rem;
  color: var(--subdued);
}

.ads-palette-panel__stats dd {
  margin: 0;
  font-size: 1.7rem;
  line-height: 1;
  color: var(--text);
}

.ads-palette-panel__swatches {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.ads-palette-panel__swatch {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--sp-3);
}

.ads-palette-panel__chip {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  box-shadow: var(--soft-raised-sm);
}

.ads-palette-panel__name {
  font-family: var(--font-display);
  font-size: 1rem;
  color: var(--text);
}

.ads-palette-panel__role {
  font-family: var(--font-label);
  font-size: 0.64rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subdued);
}
</style>

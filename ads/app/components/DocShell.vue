<script setup lang="ts">
// A documentation layout: a sticky sidebar of sections and a reading column.
// The sidebar is rail-wide, so docs and the dashboard line up; on a phone it
// drops below the reading column, behind a hairline.
</script>

<template>
  <div class="ads-doc-shell">
    <aside class="ads-doc-shell__aside">
      <slot name="aside" />
    </aside>
    <div class="ads-doc-shell__main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ads-doc-shell {
  display: grid;
  grid-template-columns: var(--rail-w) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}

.ads-doc-shell__aside {
  position: sticky;
  top: calc(var(--sp-8) + var(--sp-5));
  align-self: start;
  max-height: calc(100vh - var(--sp-8) - var(--sp-7));
  overflow-y: auto;
  padding: var(--sp-1);
}

.ads-doc-shell__main {
  min-width: 0;
  max-width: 780px;
}

@media (max-width: 900px) {
  .ads-doc-shell {
    grid-template-columns: 1fr;
  }
  .ads-doc-shell__aside {
    position: static;
    max-height: none;
    order: 2;
    padding-top: var(--sp-6);
    border-top: 1px solid var(--line);
  }
}
</style>

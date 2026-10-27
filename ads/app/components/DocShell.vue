<script setup lang="ts">
// A documentation layout: a sticky sidebar of sections and a reading column.
</script>

<template>
  <div class="docs">
    <aside class="side">
      <slot name="aside" />
    </aside>
    <div class="main">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.docs {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}

.side {
  position: sticky;
  top: 96px;
  align-self: start;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 4px;
}

.main {
  min-width: 0;
  max-width: 780px;
}

@media (max-width: 900px) {
  .docs {
    grid-template-columns: 1fr;
  }
  .side {
    position: static;
    max-height: none;
    order: 2;
    padding-top: 32px;
    border-top: 1px solid var(--line);
  }
}
</style>

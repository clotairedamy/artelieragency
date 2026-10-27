<script setup lang="ts">
// A card that appears beside its trigger on hover or focus.
</script>

<template>
  <div class="hovercard">
    <span class="trigger"><slot name="trigger" /></span>
    <div class="card-pop" role="tooltip"><slot /></div>
  </div>
</template>

<style scoped>
.hovercard {
  position: relative;
  display: inline-block;
}

.card-pop {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  min-width: 220px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s var(--ease), visibility 0.2s;
}

.hovercard:hover .card-pop,
.hovercard:focus-within .card-pop {
  opacity: 1;
  visibility: visible;
}
</style>

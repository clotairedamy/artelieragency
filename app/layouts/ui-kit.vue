<script setup lang="ts">
// The Artelier UI Kit's docs. Every other page lists its sections in the
// rail; here the rail lists the kit's categories, each a page of its own, so
// the docs move the way the rest of the site does. The switch between the Vue
// and Rust kits sits above the list, and at the top of the page on a phone,
// where there is no rail.
const { sections, kit } = useUiKit()
</script>

<template>
  <DashShell :sections="sections" :nav-label="kit.name">
    <template #tools><UiKitLaunch /></template>
    <template #rail><UiKitSwitch class="ui-kit-layout__rail-switch" /></template>
    <div class="ui-kit-layout">
      <UiKitSwitch class="ui-kit-layout__page-switch" />
      <slot />
    </div>
    <StudioFooter />
  </DashShell>
</template>

<style scoped>
.ui-kit-layout {
  padding: clamp(20px, 4vw, 40px);
}

.ui-kit-layout__page-switch {
  margin-bottom: var(--sp-5);
}

@media (min-width: 900px) {
  .ui-kit-layout__page-switch {
    display: none;
  }
}
</style>

<script setup lang="ts">
// Vue or Rust: the two kits share one set of categories, so the switch keeps
// you on the page you were reading and only changes the language. Links, not
// tabs: each kit is its own set of pages, and the back button should undo a
// switch. The current kit is raised out of the well, the way a pressed
// segment is drawn everywhere else, and gets no accent.
const { kits, kit, sameIn } = useUiKit()
</script>

<template>
  <nav class="ui-kit-switch" aria-label="Kit">
    <NuxtLink
      v-for="k in kits"
      :key="k.to"
      :to="sameIn(k)"
      class="ui-kit-switch__kit"
      :class="{ 'is-current': k.to === kit.to }"
      :aria-current="k.to === kit.to ? 'true' : undefined"
      :aria-label="k.name"
    >
      <Icon :name="k.icon" :size="16" />
      <span class="ui-kit-switch__label">{{ k.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.ui-kit-switch {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  gap: var(--sp-1);
  padding: var(--sp-1);
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ui-kit-switch__kit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  height: 38px;
  border-radius: calc(var(--radius-sm) - 4px);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--subdued);
  transition:
    color var(--dur-control) var(--ease),
    background var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ui-kit-switch__kit:hover {
  color: var(--accent);
}

.ui-kit-switch__kit.is-current {
  color: var(--text);
  font-weight: 600;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

/* In the rail it indents like the rows below it, and lines up with their
   tiles' left edge. Collapsed, the two kits stack and keep only their
   glyphs, in the tile column. */
.ui-kit-switch.ui-kit-layout__rail-switch {
  margin: 0 20px;
}

/* Wholly inside :global(). Vue keeps only what is in the brackets, so
   `:global(.x) .y` compiles to plain `.x` and hid the whole shell. */
:global(.ads-dash-shell.is-collapsed .ui-kit-switch.ui-kit-layout__rail-switch) {
  grid-auto-flow: row;
  margin: 0 20px;
  width: 48px;
}

:global(.ads-dash-shell.is-collapsed .ui-kit-layout__rail-switch .ui-kit-switch__label) {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>

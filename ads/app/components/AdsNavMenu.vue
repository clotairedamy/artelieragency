<script setup lang="ts">
// A navigation menu: links with an optional dropdown, plus an accent slot.
export type NavLink = { label: string; to: string; children?: { label: string; to: string }[] }
defineProps<{ links: NavLink[] }>()
const open = ref<string | null>(null)
</script>

<template>
  <nav class="navmenu" aria-label="Primary">
    <div v-for="l in links" :key="l.label" class="nm-group" @mouseenter="open = l.label" @mouseleave="open = null">
      <NuxtLink :to="l.to" class="nm-item" :class="{ has: l.children?.length }">
        {{ l.label }}
        <Icon v-if="l.children?.length" name="chevron" :size="13" />
      </NuxtLink>
      <div v-if="open === l.label && l.children?.length" class="nm-drop">
        <NuxtLink v-for="c in l.children" :key="c.label" :to="c.to" class="nm-sub">{{ c.label }}</NuxtLink>
      </div>
    </div>
    <slot />
  </nav>
</template>

<style scoped>
.navmenu {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nm-group {
  position: relative;
}

.nm-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 14px;
  border-radius: var(--pill);
  color: var(--text-soft);
  font-size: 0.92rem;
  white-space: nowrap;
  transition: color 0.2s var(--ease), background 0.2s var(--ease);
}

.nm-item:hover {
  color: var(--text);
  background: var(--hover);
}

.nm-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  min-width: 190px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
}

.nm-sub {
  padding: 9px 12px;
  border-radius: 9px;
  color: var(--text-soft);
  font-size: 0.88rem;
}

.nm-sub:hover {
  background: var(--hover);
  color: var(--text);
}
</style>

<script setup lang="ts">
// A horizontal menu bar. Items may be plain links or dropdown groups.
export type MenubarItem = { label: string; to?: string; children?: { label: string; to?: string }[] }
defineProps<{ items: MenubarItem[] }>()
const open = ref<string | null>(null)
</script>

<template>
  <nav class="menubar" aria-label="Menu">
    <template v-for="it in items" :key="it.label">
      <NuxtLink v-if="it.to && !it.children" :to="it.to" class="mb-item">{{ it.label }}</NuxtLink>
      <div v-else class="mb-group" @mouseenter="open = it.label" @mouseleave="open = null">
        <button type="button" class="mb-item" :aria-expanded="open === it.label">{{ it.label }} <Icon name="chevron" :size="13" /></button>
        <div v-if="open === it.label" class="mb-menu">
          <NuxtLink v-for="c in it.children" :key="c.label" :to="c.to!" class="mb-sub">{{ c.label }}</NuxtLink>
        </div>
      </div>
    </template>
  </nav>
</template>

<style scoped>
.menubar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: var(--pill);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
}

.mb-group {
  position: relative;
}

.mb-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--pill);
  color: var(--text-soft);
  font-size: 0.9rem;
  white-space: nowrap;
}

.mb-item:hover {
  color: var(--text);
  background: var(--hover);
}

.mb-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 20;
  display: grid;
  gap: 2px;
  min-width: 180px;
  padding: 6px;
  border-radius: var(--radius-sm);
  background: var(--raised);
  box-shadow: var(--soft-raised);
}

.mb-sub {
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-soft);
  font-size: 0.88rem;
}

.mb-sub:hover {
  background: var(--hover);
  color: var(--text);
}
</style>

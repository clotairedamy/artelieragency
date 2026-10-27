<script setup lang="ts">
// A help-centre sidebar: pages grouped by section. Prop-driven, so it works
// with Nuxt Content or a plain array.
export type DocPage = { title: string; path: string }
export type DocGroup = { section: string; pages: DocPage[] }

defineProps<{ groups: DocGroup[]; home?: { to: string; label: string } }>()

const route = useRoute()
</script>

<template>
  <nav class="docs-nav" aria-label="Docs">
    <NuxtLink v-if="home" :to="home.to" class="home" :class="{ on: route.path === home.to }">
      {{ home.label }}
    </NuxtLink>
    <div v-for="g in groups" :key="g.section" class="group">
      <span class="eyebrow">{{ g.section }}</span>
      <NuxtLink v-for="p in g.pages" :key="p.path" :to="p.path" :class="{ on: route.path === p.path }">
        {{ p.title }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.docs-nav {
  display: grid;
  gap: 26px;
  align-content: start;
}

.group {
  display: grid;
  gap: 2px;
}

.group .eyebrow {
  font-size: 0.64rem;
  margin-bottom: 8px;
}

a {
  padding: 8px 14px;
  border-radius: 11px;
  font-size: 0.9rem;
  color: var(--text-soft);
  transition: color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.3s var(--ease);
}

a:hover {
  color: var(--text);
}

a.on {
  color: var(--text);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.home {
  font-weight: 500;
  color: var(--text);
}
</style>

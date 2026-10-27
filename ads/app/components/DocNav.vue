<script setup lang="ts">
// A help-centre sidebar: pages grouped by section. Prop-driven, so it works
// with Nuxt Content or a plain array. The current page is pressed into the
// rail — the shadow inversion, not a colour — and announced with
// aria-current.
export type DocPage = { title: string; path: string }
export type DocGroup = { section: string; pages: DocPage[] }

defineProps<{ groups: DocGroup[]; home?: { to: string; label: string } }>()

const route = useRoute()
const uid = useId()
</script>

<template>
  <nav class="ads-doc-nav" aria-label="Docs">
    <NuxtLink
      v-if="home"
      :to="home.to"
      class="ads-doc-nav__link ads-doc-nav__home"
      :class="{ 'is-active': route.path === home.to }"
      :aria-current="route.path === home.to ? 'page' : undefined"
    >
      {{ home.label }}
    </NuxtLink>
    <div v-for="(g, gi) in groups" :key="g.section" class="ads-doc-nav__group">
      <span :id="`${uid}-${gi}`" class="eyebrow ads-doc-nav__heading">{{ g.section }}</span>
      <ul class="ads-doc-nav__list" role="list" :aria-labelledby="`${uid}-${gi}`">
        <li v-for="p in g.pages" :key="p.path">
          <NuxtLink
            :to="p.path"
            class="ads-doc-nav__link"
            :class="{ 'is-active': route.path === p.path }"
            :aria-current="route.path === p.path ? 'page' : undefined"
          >
            {{ p.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.ads-doc-nav {
  display: grid;
  gap: var(--sp-5);
  align-content: start;
}

.ads-doc-nav__group {
  display: grid;
}

.ads-doc-nav__heading {
  font-size: 0.64rem;
  margin-bottom: var(--sp-2);
}

.ads-doc-nav__list {
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ads-doc-nav__link {
  display: block;
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text-soft);
  transition:
    color var(--dur-control) var(--ease),
    box-shadow var(--dur-control) var(--ease);
}

.ads-doc-nav__link:hover {
  color: var(--text);
}

.ads-doc-nav__link.is-active {
  color: var(--text);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
}

.ads-doc-nav__home {
  font-weight: 500;
  color: var(--text);
}
</style>

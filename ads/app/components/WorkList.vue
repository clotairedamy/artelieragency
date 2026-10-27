<script setup lang="ts">
// The work as a list: a mark, what it is in a line, and where it lives.
// A row without an address is plain text — never a link to nowhere.
export type WorkItem = { name: string; kind: string; words: string; href?: string }

defineProps<{ items: WorkItem[] }>()
</script>

<template>
  <ul class="ads-work-list">
    <li v-for="p in items" :key="p.name" class="ads-work-list__row">
      <component :is="p.href ? 'a' : 'div'" :href="p.href" class="ads-work-list__link" :class="{ 'is-static': !p.href }">
        <ProjectLogo :word="p.name.slice(0, 1)" :size="48" aria-hidden="true" />
        <span class="ads-work-list__text">
          <span class="ads-work-list__kind">{{ p.kind }}</span>
          <span class="ads-work-list__name">{{ p.name }}</span>
          <span class="ads-work-list__words">{{ p.words }}</span>
        </span>
        <span v-if="p.href" class="ads-work-list__go">Read the case study <Icon name="arrow" :size="15" /></span>
      </component>
    </li>
  </ul>
</template>

<style scoped>
.ads-work-list {
  display: grid;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.ads-work-list__row + .ads-work-list__row {
  border-top: 1px solid var(--line);
}

.ads-work-list__link {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 14px 18px;
  padding: 14px var(--sp-4);
  border-radius: var(--radius);
  color: var(--text);
  transition: background var(--dur-control) var(--ease);
}

.ads-work-list__link:not(.is-static):hover {
  background: var(--hover);
}

.ads-work-list__text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.ads-work-list__kind {
  font-family: var(--font-label);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
}

.ads-work-list__name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.2vw, 1.6rem);
  font-weight: 540;
  letter-spacing: -0.015em;
  line-height: 1.15;
}

.ads-work-list__words {
  max-width: 52ch;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.ads-work-list__go {
  grid-column: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  color: var(--text-soft);
}

.ads-work-list__link:hover .ads-work-list__go {
  color: var(--text);
}

@media (min-width: 760px) {
  .ads-work-list__link {
    grid-template-columns: 48px minmax(0, 1fr) auto;
  }
  .ads-work-list__go {
    grid-column: 3;
    justify-self: end;
  }
}
</style>

<script setup lang="ts">
// The work as a list: a mark, what it is in a line, and where it lives.
export type WorkItem = { name: string; kind: string; words: string; href?: string }

defineProps<{ items: WorkItem[] }>()
</script>

<template>
  <ul class="wl">
    <li v-for="p in items" :key="p.name" class="wl-row">
      <a :href="p.href ?? '#'" class="wl-link">
        <ProjectLogo :word="p.name.slice(0, 1)" :size="48" />
        <span class="wl-text">
          <span class="wl-kind">{{ p.kind }}</span>
          <span class="wl-name">{{ p.name }}</span>
          <span class="wl-words">{{ p.words }}</span>
        </span>
        <span class="wl-go">Read the case study <Icon name="arrow" :size="15" /></span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.wl {
  display: grid;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.wl-row + .wl-row {
  border-top: 1px solid var(--line);
}

.wl-link {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 14px 18px;
  padding: 14px 16px;
  border-radius: var(--radius);
  color: var(--text);
  transition: background 0.2s var(--ease);
}

.wl-link:hover {
  background: var(--hover);
}

.wl-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.wl-kind {
  font-family: var(--mono);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
}

.wl-name {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.2vw, 1.6rem);
  font-weight: 540;
  letter-spacing: -0.015em;
  line-height: 1.15;
}

.wl-words {
  max-width: 52ch;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-soft);
}

.wl-go {
  grid-column: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.84rem;
  color: var(--text-soft);
}

.wl-link:hover .wl-go {
  color: var(--text);
}

@media (min-width: 760px) {
  .wl-link {
    grid-template-columns: 48px minmax(0, 1fr) auto;
  }
  .wl-go {
    grid-column: 3;
    justify-self: end;
  }
}
</style>

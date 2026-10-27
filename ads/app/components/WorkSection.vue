<script setup lang="ts">
// The work as a grid of project cards: kind, name, description, and tags.
// The tags are labels, not filters, so they read as plain chips.
export type WorkCard = { name: string; kind: string; description: string; tags: string[]; href?: string }

defineProps<{ items: WorkCard[] }>()
</script>

<template>
  <section class="ads-work-section">
    <div class="ads-work-section__grid">
      <article v-for="p in items" :key="p.name" class="card ads-work-section__card">
        <span class="ads-work-section__kind">{{ p.kind }}</span>
        <div class="ads-work-section__title-row">
          <h3 class="ads-work-section__name">{{ p.name }}</h3>
          <a
            v-if="p.href"
            :href="p.href"
            target="_blank"
            rel="noopener"
            class="ads-work-section__link"
            :aria-label="`Live site: ${p.name} (opens in a new tab)`"
          >Live ↗</a>
        </div>
        <p class="ads-work-section__desc">{{ p.description }}</p>
        <div class="ads-work-section__tags">
          <span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.ads-work-section__grid {
  display: grid;
  gap: var(--gutter);
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
}

.ads-work-section__card {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 26px;
}

.ads-work-section__kind {
  font-family: var(--font-label);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
}

.ads-work-section__title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-3);
}

.ads-work-section__name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.ads-work-section__link {
  font-size: 0.8rem;
  color: var(--text-soft);
  white-space: nowrap;
  transition: color var(--dur-control) var(--ease);
}

.ads-work-section__link:hover {
  color: var(--text);
}

.ads-work-section__desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-soft);
  margin: 0;
}

.ads-work-section__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-top: var(--sp-1);
}
</style>

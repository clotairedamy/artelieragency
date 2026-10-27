<script setup lang="ts">
// The work as a grid of project cards: kind, name, description, and tags.
export type WorkCard = { name: string; kind: string; description: string; tags: string[]; href?: string }

defineProps<{ items: WorkCard[] }>()
</script>

<template>
  <section class="work">
    <div class="work-grid">
      <article v-for="p in items" :key="p.name" class="work-card card">
        <span class="card-eyebrow">{{ p.kind }}</span>
        <div class="card-title-row">
          <h3 class="card-name">{{ p.name }}</h3>
          <a v-if="p.href" :href="p.href" target="_blank" rel="noopener" class="card-link">Live ↗</a>
        </div>
        <p class="card-desc">{{ p.description }}</p>
        <div class="card-tags">
          <span v-for="t in p.tags" :key="t" class="chip">{{ t }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.work-grid {
  display: grid;
  gap: var(--gutter);
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
}

.work-card {
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 26px;
}

.card-eyebrow {
  font-family: var(--mono);
  font-size: 0.64rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--subdued);
}

.card-title-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.card-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
}

.card-link {
  font-size: 0.8rem;
  color: var(--text-soft);
  white-space: nowrap;
}

.card-link:hover {
  color: var(--text);
}

.card-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-soft);
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
</style>

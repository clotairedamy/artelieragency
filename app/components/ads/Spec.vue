<script setup lang="ts">
// One component, one block, always the same five parts in the same order:
//
//   identity → specimen → states → rules → tokens
//
// Carbon splits this across Overview / Style / Code / Accessibility tabs,
// which means four clicks to answer "what does this look like when it is
// disabled, and may I use it here?" — a question that should be answerable
// by looking. Everything about a component lives in one block here, and the
// rhythm never changes, so the third component you read is faster than the
// first.
//
// The tokens row is the part Carbon has no equivalent for. Knowing which
// custom properties a component consumes is what makes a system themeable
// rather than merely documented: change the token, and every component
// listing it moves together.
defineProps<{
  id: string
  name: string
  role: string
  /** CSS custom properties this component reads. */
  tokens?: string[]
  /** Wider specimen area for charts and grids. */
  wide?: boolean
}>()
</script>

<template>
  <article :id="id" class="spec">
    <header class="spec-head">
      <div class="identity">
        <span class="ads-label spec-id">{{ id }}</span>
        <h3 class="spec-name">{{ name }}</h3>
      </div>
      <p class="spec-role">{{ role }}</p>
    </header>

    <div class="specimen" :class="{ wide }">
      <slot />
    </div>

    <div class="spec-body">
      <section v-if="$slots.states" class="col states-col">
        <h4 class="ads-label">States</h4>
        <div class="states"><slot name="states" /></div>
      </section>

      <section v-if="$slots.use" class="col">
        <h4 class="ads-label">Use it</h4>
        <ul class="rules"><slot name="use" /></ul>
      </section>

      <section v-if="$slots.avoid" class="col">
        <h4 class="ads-label avoid-label">Avoid</h4>
        <ul class="rules avoid"><slot name="avoid" /></ul>
      </section>
    </div>

    <footer v-if="tokens?.length" class="spec-tokens">
      <span class="ads-label">Tokens</span>
      <code v-for="t in tokens" :key="t">{{ t }}</code>
    </footer>
  </article>
</template>

<style scoped>
.spec {
  display: grid;
  /* Grid and flex items default to `min-width: auto`, which lets a wide
     child — a 540px table, a 16-column heatmap — push its track past the
     viewport. The panel clips rather than scrolls, so that overflow is lost
     content rather than a scrollbar. Every track down the chain is pinned
     to minmax(0, …) instead. */
  min-width: 0;
  gap: 20px;
  padding: clamp(18px, 2.4vw, 26px);
  border-radius: var(--radius);
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  scroll-margin-top: 28px;
}

/* ─── Identity ─────────────────────────────────────────────────────────── */

.spec-head {
  display: grid;
  gap: 9px;
}

.identity {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12px;
}

.spec-id {
  padding: 3px 8px;
  border-radius: 6px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  font-size: 0.57rem;
}

.spec-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.22rem;
  font-weight: 600;
  letter-spacing: -0.028em;
  font-variation-settings: 'opsz' 20;
  color: var(--text);
}

.spec-role {
  margin: 0;
  max-width: 68ch;
  font-size: 0.92rem;
  color: var(--subdued);
}

/* ─── Specimen ─────────────────────────────────────────────────────────── */

/* The specimen sits in a well, which separates the thing being documented
   from the page documenting it. Without it, a card component on a card
   background is invisible. */
.specimen {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 26px;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset);
}

.specimen.wide {
  display: block;
}

/* ─── Body ─────────────────────────────────────────────────────────────── */

.spec-body {
  display: grid;
  gap: 22px;
}

@media (min-width: 760px) {
  .spec-body {
    grid-template-columns: repeat(auto-fit, minmax(min(210px, 100%), 1fr));
  }
}

.col {
  min-width: 0;
  display: grid;
  gap: 10px;
  align-content: start;
}

.states {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 18px;
  align-items: center;
}

.rules {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.86rem;
  color: var(--subdued);
}

.rules :deep(li) {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px;
  align-items: start;
}

.rules :deep(li)::before {
  content: '+';
  font-family: var(--mono);
  font-size: 0.8rem;
  color: var(--text-soft);
  line-height: 1.5;
}

.avoid :deep(li)::before {
  content: '−';
  color: var(--grade-2);
}

.avoid-label {
  opacity: 0.75;
}

/* ─── Tokens ───────────────────────────────────────────────────────────── */

.spec-tokens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.spec-tokens code {
  padding: 3px 9px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  font-size: 0.7rem;
  color: var(--text-soft);
}
</style>

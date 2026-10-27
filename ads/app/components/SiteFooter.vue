<script setup lang="ts">
// The footer: brand and description, link columns, and a legal bar.
export type FooterColumn = { title: string; links: { to: string; label: string }[] }

const props = withDefaults(
  defineProps<{ description?: string; columns?: FooterColumn[] }>(),
  {
    description: 'A dashboard and data-UI studio. The chrome is grey so the data can be coloured.',
    columns: () => [
      {
        title: 'Kit',
        links: [
          { to: '/', label: 'Landing' },
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/contact', label: 'Contact form' },
        ],
      },
      {
        title: 'Design system',
        links: [
          { to: '/', label: 'Tokens' },
          { to: '/', label: 'Components' },
          { to: '/', label: 'Sections' },
        ],
      },
      {
        title: 'Studio',
        links: [
          { to: '/contact', label: 'Start a project' },
          { to: '/', label: 'Privacy' },
          { to: '/', label: 'Contact' },
        ],
      },
    ],
  },
)

const year = new Date().getFullYear()

function toTop() {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
}
</script>

<template>
  <footer class="footer">
    <div class="max inner">
      <div class="grid">
        <div class="about">
          <BrandMark />
          <p class="desc">{{ props.description }}</p>
        </div>

        <nav v-for="col in columns" :key="col.title" class="col" :aria-label="col.title">
          <span class="eyebrow">{{ col.title }}</span>
          <NuxtLink v-for="l in col.links" :key="l.to + l.label" :to="l.to">{{ l.label }}</NuxtLink>
        </nav>
      </div>

      <div class="legal">
        <span>© {{ year }} Artelier</span>
        <button type="button" class="top" @click="toTop">
          Back to top
          <span class="top-round"><Icon name="arrow" :size="15" style="rotate: -90deg" /></span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 72px 0 0;
  border-top: 1px solid var(--line);
}

.inner {
  padding: 0 clamp(20px, 4vw, 48px);
}

.grid {
  display: grid;
  grid-template-columns: 1.6fr repeat(3, 1fr);
  gap: 48px;
  padding-bottom: 56px;
}

.about {
  display: grid;
  gap: 18px;
  align-content: start;
  justify-items: start;
  max-width: 320px;
}

.desc {
  font-size: 0.94rem;
  color: var(--subdued);
}

.col {
  display: grid;
  gap: 12px;
  align-content: start;
  justify-items: start;
}

.col .eyebrow {
  margin-bottom: 8px;
}

.col a {
  padding-bottom: 2px;
  color: var(--text-soft);
  font-size: 0.94rem;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition:
    color 0.2s,
    background-size 0.35s var(--ease);
}

.col a:hover {
  color: var(--text);
  background-size: 100% 1px;
}

.legal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding: 28px 0;
  border-top: 1px solid var(--line-strong);
  font-size: 0.86rem;
  color: var(--subdued);
}

.top {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text-soft);
}

.top:hover {
  color: var(--text);
}

.top-round {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--raised);
  box-shadow: var(--soft-raised-sm);
  color: var(--text-soft);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
  .about {
    grid-column: 1 / -1;
  }
}
</style>

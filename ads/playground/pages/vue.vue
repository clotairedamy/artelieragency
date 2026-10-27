<script setup lang="ts">
// The Vue kit: the four rules, the component categories, and how to compose.
const rules = [
  'The chrome is grey so the data can be coloured.',
  'Depth is the only decoration.',
  'Numbers are monospaced.',
  'Every component names its tokens.',
]

const categories = [
  { to: '/surfaces', label: 'Surfaces', icon: 'compass', desc: 'Card, well, frame tab' },
  { to: '/actions', label: 'Actions', icon: 'plus', desc: 'Button, menu, segmented' },
  { to: '/inputs', label: 'Inputs', icon: 'sliders', desc: 'Field, choice, range, tag' },
  { to: '/data-display', label: 'Data display', icon: 'chart', desc: 'Stat, meter, charts, grid' },
  { to: '/disclosure', label: 'Disclosure', icon: 'flow', desc: 'Accordion, drawer, tree' },
  { to: '/navigation', label: 'Navigation', icon: 'arrow', desc: 'Tabs, crumbs, pager' },
  { to: '/feedback', label: 'Feedback', icon: 'alert', desc: 'Empty, skeleton, modal' },
  { to: '/patterns', label: 'Patterns', icon: 'check', desc: 'KPI row, table screen' },
  { to: '/sections', label: 'Page sections', icon: 'layers', desc: 'Nav, hero, footer' },
  { to: '/docs', label: 'Docs', icon: 'code', desc: 'Doc shell, callout, window' },
]

const installCode = `// nuxt.config.ts
export default defineNuxtConfig({
  css: [
    '@fontsource-variable/bricolage-grotesque',
    '@fontsource-variable/inter-tight',
    '@fontsource-variable/martian-mono',
    '@fontsource-variable/jetbrains-mono',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/ads.css',
    '~/assets/css/ads-utility.css',
  ],
})`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-3">
      <p class="eyebrow">Artelier Design System</p>
      <h1 class="headline face-display">Artelier Vue</h1>
      <p class="lede measure">
        The Vue / Nuxt kit — tokens, a utility layer, and {{ categories.length }}
        component categories. Pick a category below, or copy the component
        source from any page.
      </p>
    </header>

    <div class="grid grid-2">
      <div v-for="r in rules" :key="r" class="card card-press">
        <p class="size-md ink">{{ r }}</p>
      </div>
    </div>

    <section class="stack gap-3">
      <h2 class="h3">Component categories</h2>
      <div class="cat-grid">
        <NuxtLink v-for="c in categories" :key="c.to" :to="c.to" class="cat card card-press">
          <span class="cat-glyph"><Icon :name="c.icon" :size="19" /></span>
          <span class="cat-text">
            <span class="cat-label">{{ c.label }}</span>
            <span class="cat-desc">{{ c.desc }}</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <ComponentDoc
      id="install"
      name="Installation"
      description="One-time setup: copy the stylesheets and fonts into your Nuxt project."
      :code="installCode"
    />
  </div>
</template>

<style scoped>
.headline {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}

.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.cat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.cat-glyph {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 12px;
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.cat-text {
  display: grid;
  gap: 2px;
}

.cat-label {
  font-weight: 540;
  color: var(--text);
}

.cat-desc {
  font-size: 0.8rem;
  color: var(--subdued);
}
</style>

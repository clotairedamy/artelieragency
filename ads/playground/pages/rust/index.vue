<script setup lang="ts">
// The Rust (Dioxus) kit landing — mirrors the Vue landing, linking to the same
// categories but with Rust content.
const categories = [
  { to: '/rust/surfaces', label: 'Surfaces', icon: 'compass', desc: 'Card, well, frame tab' },
  { to: '/rust/actions', label: 'Actions', icon: 'plus', desc: 'Button, menu, segmented' },
  { to: '/rust/inputs', label: 'Inputs', icon: 'sliders', desc: 'Field, choice, range, tag' },
  { to: '/rust/data-display', label: 'Data display', icon: 'chart', desc: 'Stat, meter, charts, grid' },
  { to: '/rust/disclosure', label: 'Disclosure', icon: 'flow', desc: 'Accordion, drawer, tree' },
  { to: '/rust/navigation', label: 'Navigation', icon: 'arrow', desc: 'Tabs, crumbs, pager' },
  { to: '/rust/feedback', label: 'Feedback', icon: 'alert', desc: 'Empty, skeleton, modal' },
  { to: '/rust/patterns', label: 'Patterns', icon: 'check', desc: 'KPI row, table screen' },
]

const installCode = `// Cargo.toml
[dependencies]
ads = { path = "../ads/ads-rs" }
dioxus = { version = "=0.7.9", features = ["web"] }`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-3">
      <p class="eyebrow">Artelier Design System</p>
      <h1 class="headline face-display">Artelier Rust</h1>
      <p class="lede measure">
        The same kit in Dioxus 0.7 — same classes, same five stylesheets, same
        look. Pick a category below to see the Rust components rendered.
      </p>
    </header>

    <div class="grid grid-2">
      <div v-for="(r, i) in ['Renders the same classes', 'Shares the same CSS', 'Same tokens, same look', 'Dioxus #[component] + rsx!']" :key="i" class="card card-press">
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
      description="Add the crate and Dioxus, and include the five stylesheets in assets/css/."
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

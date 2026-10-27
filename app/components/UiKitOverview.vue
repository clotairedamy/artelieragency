<script setup lang="ts">
// The UI Kit's front page, shared by both kits. It is a showcase, not a
// product page: nothing here is offered for download or licensed for use.
// It shows how the studio builds — one design system, written twice, and
// driven through a model — and the code is open to read because the code is
// the evidence.
const { kits, kit } = useUiKit()
const rust = computed(() => kit.value.label === 'Rust')

const parts = computed(() => [
  {
    to: '/ui-kit/all',
    icon: 'system',
    title: 'Vue',
    body: 'The web kit, as a Nuxt layer. Every Artelier site and dashboard is built on it, this one included.',
  },
  {
    to: '/ui-kit/rust/all',
    icon: 'engine',
    title: 'Rust',
    body: 'The same kit in Dioxus, for desktop and native apps. Same classes, same stylesheets, same look.',
  },
  {
    to: `${kit.value.to}/mcp`,
    icon: 'signal',
    title: 'MCP server',
    body: 'How new work starts: a model handed the real components and the rules, building screens from them.',
  },
])

const rules = [
  'The chrome is grey so the data can be coloured.',
  'Depth is the only decoration.',
  'One accent per screen, never on a destructive action.',
  'Numbers are monospaced, and status is never colour alone.',
]

// What each category holds, for the cards. The list itself comes from the
// app config, so the cards, the rail and the phone tab bar never disagree.
const holds: Record<string, string> = {
  surfaces: 'Card, well, frame tab',
  actions: 'Button, menu, segmented',
  inputs: 'Field, choice, range, tag',
  'data-display': 'Stat, meter, charts, grid',
  disclosure: 'Accordion, drawer, tree',
  navigation: 'Tabs, crumbs, pager',
  feedback: 'Empty, skeleton, modal',
  patterns: 'KPI row, table screen',
  elements: 'Dialogs, pickers, menus, chat',
  sections: 'Nav, hero, footer',
  docs: 'Doc shell, callout, window',
}
const categories = computed(() =>
  kit.value.categories
    .map((c) => ({ ...c, slug: c.to.slice(kit.value.to.length + 1) }))
    .filter((c) => c.slug in holds),
)

const wiring = computed(() =>
  rust.value
    ? `# Cargo.toml — a Rust project takes the kit as a path dependency, and
# its five stylesheets from assets/css/.
[dependencies]
ads = { path = "../ads/ads-rs" }
dioxus = { version = "=0.7.9", features = ["desktop"] }`
    : `// nuxt.config.ts — a studio project takes the kit as a Nuxt layer.
// Tokens, fonts, stylesheets, components and composables arrive with it.
export default defineNuxtConfig({
  extends: ['./ads'],
})`,
)
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-3">
      <p class="eyebrow">Artelier UI Kit · {{ kit.label }}</p>
      <h1 class="ui-kit-overview__title face-display">How the studio builds.</h1>
      <p class="lede measure">
        Every Artelier screen is made from one kit of components, written twice:
        in Vue for the web and in Rust for native apps. It is shown here with
        its code, component by component, so the work can be judged by how it
        is made, not only by how it looks.
      </p>
    </header>

    <Callout>
      A look inside, not a library. The kit is the studio's own: there is no
      package to install and no licence to use it under. The source is here
      to be read.
    </Callout>

    <section class="stack gap-3" aria-labelledby="kit-parts">
      <h2 id="kit-parts" class="h3">One system, three parts</h2>
      <div class="ui-kit-overview__parts">
        <NuxtLink v-for="p in parts" :key="p.title" :to="p.to" class="card card-press ui-kit-overview__part">
          <span class="ui-kit-overview__glyph"><Icon :name="p.icon" :size="19" /></span>
          <span class="ui-kit-overview__name">{{ p.title }}</span>
          <span class="body">{{ p.body }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="stack gap-3" aria-labelledby="kit-rules">
      <h2 id="kit-rules" class="h3">The rules every component follows</h2>
      <ul class="ui-kit-overview__rules">
        <li v-for="r in rules" :key="r" class="card">{{ r }}</li>
      </ul>
    </section>

    <section class="stack gap-3" aria-labelledby="kit-categories">
      <h2 id="kit-categories" class="h3">The {{ kit.label }} components</h2>
      <div class="ui-kit-overview__cats">
        <NuxtLink v-for="c in categories" :key="c.to" :to="c.to" class="card card-press ui-kit-overview__cat">
          <span class="ui-kit-overview__glyph"><Icon :name="c.icon" :size="19" /></span>
          <span class="ui-kit-overview__text">
            <span class="ui-kit-overview__name">{{ c.label }}</span>
            <span class="ui-kit-overview__holds">{{ holds[c.slug] }}</span>
          </span>
        </NuxtLink>
      </div>
      <p class="body">
        The same categories exist in
        <template v-for="(k, i) in kits.filter((k) => k.to !== kit.to)" :key="k.to">
          <template v-if="i">, </template><NuxtLink :to="k.to" class="ads-link">{{ k.name }}</NuxtLink></template>.
      </p>
    </section>

    <ComponentDoc
      id="wiring"
      name="How a project takes it"
      :description="rust ? 'A Dioxus app depends on the crate and links the shared stylesheets.' : 'A Nuxt app extends the kit as a layer; nothing is copied by hand.'"
      :language="rust ? 'toml' : 'ts'"
      :code="wiring"
    />
  </div>
</template>

<style scoped>
.ui-kit-overview__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.ui-kit-overview__parts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--sp-4);
}

.ui-kit-overview__part {
  display: grid;
  align-content: start;
  gap: var(--sp-2);
}

.ui-kit-overview__rules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-4);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ui-kit-overview__rules li {
  color: var(--text);
}

.ui-kit-overview__cats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--sp-4);
}

.ui-kit-overview__cat {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ui-kit-overview__glyph {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: var(--radius-sm);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--text-soft);
}

.ui-kit-overview__text {
  display: grid;
  gap: 2px;
}

.ui-kit-overview__name {
  font-weight: 540;
  color: var(--text);
}

.ui-kit-overview__holds {
  font-size: 0.8rem;
  color: var(--subdued);
}
</style>

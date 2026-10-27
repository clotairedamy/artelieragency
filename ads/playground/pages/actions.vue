<script setup lang="ts">
const seg = ref('7d')
const menuItems = [
  { label: 'Open detail', icon: 'arrow', shortcut: '↵' },
  { label: 'Compare to last run', icon: 'chart' },
  { label: 'Copy link', icon: 'mail', shortcut: '⌘C' },
  { label: 'Exclude from crawl', icon: 'alert', destructive: true },
]

const buttonCode = `<AdsButton variant="accent" icon="plus">New crawl</AdsButton>
<AdsButton>Export CSV</AdsButton>
<AdsButton variant="quiet">Cancel</AdsButton>
<AdsButton destructive>Delete project</AdsButton>`

const iconButtonCode = `<AdsIconButton icon="grid" label="Grid" />
<AdsIconButton icon="chart" label="Chart" />`

const segmentedCode = `<AdsSegmented v-model="range" label="Range" :options="[
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
]" />`

const menuCode = `<AdsMenu label="Row actions" :items="[
  { label: 'Exclude from crawl', icon: 'alert', destructive: true },
  { label: 'Open detail', icon: 'arrow', shortcut: '↵' },
]" />
<!-- Destructive items are always moved last, below a rule. -->`

const linkCode = `<p class="body">The ranked plan explains <a class="ads-link" href="#">what to fix first</a>.</p>`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Actions</p>
      <h1 class="title face-display">Actions</h1>
      <p class="lede">One accent, spent once per screen. Everything else earns attention through weight and elevation.</p>
    </header>

    <ComponentDoc
      id="adsbutton"
      name="AdsButton"
      description="Three weights. Accent for the one action the screen exists to produce, default for everything else, quiet for actions that should not compete."
      :code="buttonCode"
      :props="[
        { name: 'variant', type: 'default | accent | quiet', default: 'default' },
        { name: 'size', type: 'sm | md', default: 'md' },
        { name: 'icon', type: 'string', default: '—', desc: 'Glyph name from utils/glyphs.' },
        { name: 'loading', type: 'boolean', default: 'false', desc: 'Spinner in place of the icon; sets aria-busy.' },
        { name: 'destructive', type: 'boolean', default: 'false', desc: 'Never accent: forces the default weight. Label it with the verb (Delete project).' },
        { name: 'disabled', type: 'boolean', default: 'false' },
      ]"
    >
      <AdsButton variant="accent" icon="plus">New crawl</AdsButton>
      <AdsButton>Export CSV</AdsButton>
      <AdsButton variant="quiet">Cancel</AdsButton>
      <AdsButton destructive>Delete project</AdsButton>
    </ComponentDoc>

    <ComponentDoc
      id="adsiconbutton"
      name="AdsIconButton"
      description="A tile-shaped target for an action whose glyph is unambiguous. Always carries an accessible name."
      :code="iconButtonCode"
      :props="[
        { name: 'icon', type: 'string', default: '—' },
        { name: 'label', type: 'string', default: '—', desc: 'Accessible name (required).' },
        { name: 'round', type: 'boolean', default: 'false' },
        { name: 'accent', type: 'boolean', default: 'false' },
      ]"
    >
      <AdsIconButton icon="grid" label="Grid" />
      <AdsIconButton icon="chart" label="Chart" />
      <AdsIconButton icon="mail" label="Mail" />
    </ComponentDoc>

    <ComponentDoc
      id="adssegmented"
      name="AdsSegmented"
      description="Two to five mutually exclusive views, all visible at once. Use it where a select would hide the options; more than five, or labels that wrap, is a select."
      :code="segmentedCode"
      :props="[
        { name: 'modelValue', type: 'string | number', default: '—' },
        { name: 'options', type: '{ label, value }[]', default: '—', desc: '2–5 short, comparable labels.' },
        { name: 'label', type: 'string', default: '— (required)', desc: 'Accessible name of the group.' },
      ]"
    >
      <AdsSegmented v-model="seg" label="Range" :options="[{ label: '24h', value: '24h' }, { label: '7d', value: '7d' }, { label: '30d', value: '30d' }]" />
    </ComponentDoc>

    <ComponentDoc
      id="adsmenu"
      name="AdsMenu"
      description="Row actions and overflow. Everything a reader can do to one record, in one place. Destructive items go last, below a rule; shortcuts show beside their item."
      :code="menuCode"
      :props="[
        { name: 'items', type: '{ label, icon?, shortcut?, destructive?, action? }[]', default: '—', desc: 'destructive items are moved last, below a rule. Use label --- for a divider.' },
        { name: 'label', type: 'string', default: '— (required)', desc: 'Accessible name of the menu.' },
      ]"
    >
      <AdsMenu label="Row actions" :items="menuItems" />
    </ComponentDoc>

    <ComponentDoc
      id="adslink"
      name="Link"
      description="Navigation inside prose. Underlined, because in a system with no spare colour the underline is the only signal available."
      :code="linkCode"
      :props="[{ name: 'class', type: 'CSS class', default: '.ads-link' }]"
    >
      <p class="body">The ranked plan explains <a class="ads-link" href="#">what to fix first</a>, and each job links back to <a class="ads-link" href="#">the pages behind it</a>.</p>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>

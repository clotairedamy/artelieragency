<script setup lang="ts">
// Documentation components: the pieces a docs or help-centre site is built from.

const shellCode = `<DocShell>
  <template #aside><DocNav :groups="groups" /></template>
  <ContentDoc />  <!-- or any markdown renderer -->
</DocShell>`

const navCode = `<DocNav
  home="{ to: '/docs', label: 'Help centre' }"
  :groups="[{ section: 'Getting started', pages: [{ title: 'Installing', path: '/docs/installing' }] }]" />`

const calloutCode = `<Callout type="tip">A tip worth knowing.</Callout>
<Callout type="warning">This changes how results are read.</Callout>`

const windowCode = `<AppWindow src="/shot.png" alt="The results table" />`

const screenshotCode = `<Screenshot src="/shot.png" alt="The results table" caption="The results table." />`

const navGroups = [
  { section: 'Getting started', pages: [{ title: 'Installing', path: '/docs/installing' }, { title: 'Your first crawl', path: '/docs/your-first-crawl' }] },
  { section: 'Reference', pages: [{ title: 'Results table', path: '/docs/results-table' }, { title: 'Keyboard shortcuts', path: '/docs/keyboard-shortcuts' }] },
]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Docs</p>
      <h1 class="title face-display">Documentation</h1>
      <p class="lede">The shell, the sidebar, and the content pieces a docs site is assembled from.</p>
    </header>

    <ComponentDoc
      id="docshell"
      name="DocShell"
      description="A documentation layout: a sticky sidebar and a reading column."
      :code="shellCode"
      :props="[{ name: 'aside', type: 'slot', default: '—' }, { name: 'default', type: 'slot', default: '—' }]"
    >
      <div class="block"><DocShell><template #aside><DocNav :groups="navGroups" :home="{ to: '/docs', label: 'Help centre' }" /></template><p class="ink-subdued pad-3">The reading column.</p></DocShell></div>
    </ComponentDoc>

    <ComponentDoc
      id="docnav"
      name="DocNav"
      description="A help-centre sidebar, pages grouped by section. Prop-driven, so it works with Nuxt Content or a plain array."
      :code="navCode"
      :props="[
        { name: 'groups', type: '{ section, pages: { title, path }[] }[]', default: '—' },
        { name: 'home', type: '{ to, label }', default: '—' },
      ]"
    >
      <div class="block" style="max-width: 280px"><DocNav :groups="navGroups" :home="{ to: '/docs', label: 'Help centre' }" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="callout"
      name="Callout"
      description="A docs callout. The edge and label carry the tone, and every tone carries a glyph."
      :code="calloutCode"
      :props="[{ name: 'type', type: 'note | tip | warning', default: 'note' }]"
    >
      <div class="block stack gap-3">
        <Callout type="note">A plain note.</Callout>
        <Callout type="tip">A tip worth knowing.</Callout>
        <Callout type="warning">This changes how results are read.</Callout>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="appwindow"
      name="AppWindow"
      description="A screenshot in a soft window frame. The first traffic dot carries the accent."
      :code="windowCode"
      :props="[
        { name: 'src / alt', type: 'string', default: '—' },
        { name: 'width / height', type: 'number', default: '1440 / 900' },
        { name: 'eager', type: 'boolean', default: 'false' },
      ]"
    >
      <div class="block" style="max-width: 420px"><AppWindow src="https://placehold.co/640x360/2e2e33/f3f3f5?text=results+table" alt="The results table" :width="640" :height="360" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="screenshot"
      name="Screenshot"
      description="A screenshot figure: the window frame plus an optional caption."
      :code="screenshotCode"
      :props="[
        { name: 'src / alt', type: 'string', default: '—' },
        { name: 'caption', type: 'string', default: '' },
      ]"
    >
      <div class="block" style="max-width: 420px"><Screenshot src="https://placehold.co/640x360/2e2e33/f3f3f5?text=results" alt="The results table" caption="The results table." /></div>
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

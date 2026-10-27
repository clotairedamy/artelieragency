<script setup lang="ts">
const tab = ref('internal')
const page = ref(2)

const tabsCode = `<AdsTabs v-model="tab" label="Links" controls="links-table" :tabs="[
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
]" />`

const crumbsCode = `<AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'outerbridgelaw.com', to: '/p/1' }, { label: 'Response codes' }]" />`

const pagerCode = `<AdsPager v-model:page="page" :pages="24" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Navigation</p>
      <h1 class="title face-display">Navigation</h1>
      <p class="lede">Getting between screens: one rail for destinations, tabs for views of the same thing, crumbs for depth.</p>
    </header>

    <ComponentDoc
      id="adstabs"
      name="AdsTabs"
      description="Filtered views of one dataset, where the columns stay put — not navigation between screens, which is the rail's job. The underline is the accent's only appearance in a nav context. Arrow keys move between tabs."
      :code="tabsCode"
      :props="[
        { name: 'modelValue', type: 'string | number', default: '—' },
        { name: 'tabs', type: '{ label, value }[]', default: '—' },
        { name: 'label', type: 'string', default: '— (required)', desc: 'Accessible name of the tab row.' },
        { name: 'controls', type: 'string', default: '—', desc: 'id of the table the tabs filter (aria-controls).' },
      ]"
    >
      <div class="block"><AdsTabs v-model="tab" label="Links" :tabs="[{ label: 'Internal', value: 'internal' }, { label: 'External', value: 'external' }, { label: 'Response codes', value: 'codes' }]" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adscrumbs"
      name="AdsCrumbs"
      description="Where you are, once a screen is three levels deep or more. The last crumb is the current page."
      :code="crumbsCode"
      :props="[{ name: 'items', type: '{ label, to? }[]', default: '—', desc: 'The last item is marked aria-current=page.' }]"
    >
      <AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'outerbridgelaw.com', to: '/navigation' }, { label: 'Response codes' }]" />
    </ComponentDoc>

    <ComponentDoc
      id="adspager"
      name="AdsPager"
      description="Which slice you are looking at. Page numbers are figures, so they are monospaced. Past seven pages it keeps the ends and the current page's neighbours, so every page stays reachable."
      :code="pagerCode"
      :props="[
        { name: 'page', type: 'number (v-model:page)', default: '1' },
        { name: 'pages', type: 'number', default: '1' },
        { name: '@change', type: '(page: number)', default: '—', desc: 'Also emitted as update:page.' },
      ]"
    >
      <AdsPager v-model:page="page" :pages="24" />
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

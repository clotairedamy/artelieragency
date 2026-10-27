<script setup lang="ts">
const tab = ref('internal')
const page = ref(2)

const tabsCode = `<AdsTabs v-model="tab" :tabs="[
  { label: 'Internal', value: 'internal' },
  { label: 'External', value: 'external' },
]" />`

const crumbsCode = `<AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'Results' }]" />`

const pagerCode = `<AdsPager :page="2" :pages="5" @change="page = $event" />`
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
      description="Views of one dataset. The underline is the accent's only appearance in a nav context."
      :code="tabsCode"
      :props="[
        { name: 'modelValue', type: 'string | number', default: '—' },
        { name: 'tabs', type: '{ label, value }[]', default: '—' },
      ]"
    >
      <div class="block"><AdsTabs v-model="tab" :tabs="[{ label: 'Internal', value: 'internal' }, { label: 'External', value: 'external' }, { label: 'Response codes', value: 'codes' }]" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adscrumbs"
      name="AdsCrumbs"
      description="Where you are. Monospaced, because breadcrumbs are mostly paths."
      :code="crumbsCode"
      :props="[{ name: 'items', type: '{ label, to? }[]', default: '—' }]"
    >
      <AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'outerbridgelaw.com' }, { label: 'Response codes' }]" />
    </ComponentDoc>

    <ComponentDoc
      id="adspager"
      name="AdsPager"
      description="Which slice you are looking at. Monospaced, with the current page on the accent."
      :code="pagerCode"
      :props="[
        { name: 'page', type: 'number', default: '1' },
        { name: 'pages', type: 'number', default: '1' },
      ]"
    >
      <div class="stack gap-2"><AdsPager :page="page" :pages="5" @change="page = $event" /><span class="dim size-sm">page {{ page }}</span></div>
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

<script setup lang="ts">
const accordionCode = `<AdsAccordion :items="[
  { title: 'Why this page ranks eighth', body: '371 pages share near-duplicate content…' },
]" />`

const drawerCode = `<AdsDrawer :open="!!row" :title="row?.page" @close="row = null">
  <AdsDataGrid :columns="columns" :rows="rows" @select="(r) => (row = r)" />
  <template #panel><AdsDl :items="rowDetail" /></template>
</AdsDrawer>`

const popoverCode = `<AdsPopover
  trigger-label="Explain link score"
  label="Link score"
  body="A 0–100 measure of internal link value."
  :link="{ label: 'How it is calculated' }" />`

// The drawer demo: a grid whose selected row explains itself beside it.
type PageRow = { page: string; code: number; words: number; inlinks: number }
const pageColumns = [
  { key: 'page', label: 'Page', mono: true },
  { key: 'code', label: 'Code', mono: true, numeric: false },
  { key: 'words', label: 'Words' },
  { key: 'inlinks', label: 'Inlinks' },
]
const pageRows: PageRow[] = [
  { page: '/blog/launch', code: 200, words: 1286, inlinks: 3762 },
  { page: '/pricing', code: 200, words: 642, inlinks: 1904 },
  { page: '/old-docs', code: 301, words: 0, inlinks: 88 },
]
const row = ref<PageRow | null>(pageRows[0]!)
const rowDetail = computed(() =>
  row.value
    ? [
        { term: 'Code', value: String(row.value.code) },
        { term: 'Words', value: row.value.words.toLocaleString('en-GB') },
        { term: 'Inlinks', value: row.value.inlinks.toLocaleString('en-GB') },
      ]
    : [],
)

const treeCode = `<AdsTree :nodes="[{ label: '/', children: [{ label: 'blog', count: 842 }] }]" />`

const stepsCode = `<AdsSteps :steps="[
  { label: 'Configure', state: 'done' },
  { label: 'Crawl', state: 'done' },
  { label: 'Audit', state: 'now' },
  { label: 'Plan', state: 'todo' },
]" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Disclosure</p>
      <h1 class="title face-display">Disclosure</h1>
      <p class="lede">Summary first, detail on request — without losing the reader's place.</p>
    </header>

    <ComponentDoc
      id="accordion"
      name="AdsAccordion"
      description="The simplest disclosure. Native details/summary, so it works before JavaScript and is announced correctly."
      :code="accordionCode"
      :props="[{ name: 'items', type: '{ title, body }[]', default: '—' }]"
    >
      <div class="block"><AdsAccordion :items="[{ title: 'Why this page ranks eighth', body: '371 pages share near-duplicate content, but they are 278 separate pieces of work.' }, { title: 'What a fix would involve', body: 'Two template changes and a canonical rule. Roughly a day.' }]" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="drawer"
      name="AdsDrawer"
      description="Row detail: a right-hand panel where the selected row explains itself, so the table never leaves the screen. Row detail never opens in a modal. Given @close, it carries a close button and Escape closes it; focus moves into the panel on open and back on close."
      :code="drawerCode"
      :props="[
        { name: 'title', type: 'string', default: '—', desc: 'Shown at the top of the panel and used as its accessible name.' },
        { name: 'open', type: 'boolean', default: 'true', desc: 'Closed, the main slot takes the full width.' },
        { name: '@close', type: '() => void', default: '—', desc: 'Adds the close button and Escape.' },
        { name: '#panel', type: 'slot', default: '—', desc: 'The detail — usually AdsDl.' },
      ]"
    >
      <div class="block">
        <AdsDrawer :open="!!row" :title="row?.page" @close="row = null">
          <AdsDataGrid :columns="pageColumns" :rows="pageRows" caption="Crawled pages" @select="(r) => (row = r as PageRow)" />
          <template #panel><AdsDl :items="rowDetail" /></template>
        </AdsDrawer>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="popover"
      name="AdsPopover"
      description="Supplementary context only, anchored to what prompted it. More than a tooltip, less than a drawer — and nothing needed to finish the task may live only in here. Row detail goes in the drawer. With trigger-label it brings its own button; Escape or a click outside closes it and focus returns."
      :code="popoverCode"
      :props="[
        { name: 'triggerLabel', type: 'string', default: '—', desc: 'Renders a button that opens the popover. Without it, a static card.' },
        { name: 'label', type: 'string', default: '' },
        { name: 'body', type: 'string', default: '' },
        { name: 'link', type: '{ label, to? }', default: '—' },
      ]"
    >
      <div class="row gap-6 wrap items-start">
        <AdsPopover trigger-label="Explain link score" label="Link score" body="A 0–100 measure of how much of the site's internal link value reaches this page." :link="{ label: 'How it is calculated' }" />
        <AdsPopover label="Link score" body="A 0–100 measure of how much of the site's internal link value reaches this page." :link="{ label: 'How it is calculated' }" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="tree"
      name="AdsTree"
      description="Real nesting — site structure, a category hierarchy, a file system. Built on nested lists."
      :code="treeCode"
      :props="[{ name: 'nodes', type: '{ label, count?, children? }[]', default: '—' }]"
    >
      <div class="block" style="max-width: 320px"><AdsTree :nodes="[{ label: '/', children: [{ label: 'blog', count: 842 }, { label: 'docs', count: 311 }] }]" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="steps"
      name="AdsSteps"
      description="Where you are in a sequence with a known end. Counts discrete stages, not percentage. The current step is marked aria-current, and every state is spoken as well as drawn."
      :code="stepsCode"
      :props="[{ name: 'steps', type: '{ label, state? }[]', default: '—', desc: 'state: done | now | todo' }]"
    >
      <div class="block"><AdsSteps :steps="[{ label: 'Configure', state: 'done' }, { label: 'Crawl', state: 'done' }, { label: 'Audit', state: 'now' }, { label: 'Plan', state: 'todo' }]" /></div>
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

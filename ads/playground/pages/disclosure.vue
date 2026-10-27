<script setup lang="ts">
const accordionCode = `<AdsAccordion :items="[
  { title: 'Why this page ranks eighth', body: '371 pages share near-duplicate content…' },
]" />`

const drawerCode = `<AdsDrawer>
  <AdsDataGrid :columns="columns" :rows="rows" />
  <template #panel><AdsDl :items="detail" /></template>
</AdsDrawer>`

const popoverCode = `<AdsPopover label="Link score" body="A 0–100 measure of internal link value." link="{ label: 'How it is calculated' }" />`

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
      description="A right-hand panel where the selected row explains itself. The table never leaves the screen."
      :code="drawerCode"
    >
      <div class="block"><AdsDrawer><p class="ink-subdued pad-3">The grid stays where it is; selection drives the panel.</p><template #panel><AdsDl :items="[{ term: 'Code', value: '200' }, { term: 'Words', value: '1,286' }, { term: 'Inlinks', value: '3,762' }]" /></template></AdsDrawer></div>
    </ComponentDoc>

    <ComponentDoc
      id="popover"
      name="AdsPopover"
      description="A little extra context anchored to what prompted it. More than a tooltip, less than a drawer."
      :code="popoverCode"
      :props="[
        { name: 'label', type: 'string', default: '' },
        { name: 'body', type: 'string', default: '' },
        { name: 'link', type: '{ label, to? }', default: '—' },
      ]"
    >
      <AdsPopover label="Link score" body="A 0–100 measure of how much of the site's internal link value reaches this page." :link="{ label: 'How it is calculated' }" />
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
      description="Where you are in a sequence with a known end. Counts discrete stages, not percentage."
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

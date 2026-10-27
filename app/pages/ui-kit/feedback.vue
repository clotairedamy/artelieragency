<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Feedback and overlays · Artelier UI Kit for Vue',
  description: 'Empty states, loading, confirmations and the things that float above.',
  path: '/ui-kit/feedback',
})

const open = ref(false)
const toast = useToast()

const emptyCode = `<!-- Never had data: the action creates something. -->
<AdsEmpty kind="first-run" title="No crawls yet" body="Results appear here once a crawl has finished.">
  <AdsButton variant="accent" icon="plus">New crawl</AdsButton>
</AdsEmpty>

<!-- A filter matched nothing: the action clears it. -->
<AdsEmpty kind="no-results" title="No pages match these filters" body="Nothing in this crawl is both 4xx and indexable.">
  <AdsButton>Clear filters</AdsButton>
</AdsEmpty>`

const skeletonCode = `<AdsSkeleton width="100%" height="16px" />`

const loadingCode = `<AdsLoading text="Recrawling 311 URLs…" />`

const bannerCode = `<AdsBanner text="This crawl is 14 days old. Figures describe the site as it was on 2026-10-11." />
<AdsBanner tone="bad" text="The last export failed: the sitemap could not be read.">
  <template #actions><AdsButton size="sm">Retry export</AdsButton></template>
</AdsBanner>`

const toastCode = `// app.vue
<AdsToastHost />

// anywhere — for something that already happened
const toast = useToast()
toast.push('Export finished · 733 rows', 'check')

// An error the reader must act on is a banner, not a toast:
// useToast() has no error glyph to give it.`

const modalCode = `const open = ref(false)
<AdsModal v-model:open="open" title="Delete this project?">
  <p>Its crawls, history and comparisons go with it. This cannot be undone.</p>
  <AdsButton destructive @click="remove">Delete project</AdsButton>
  <AdsButton variant="quiet" @click="open = false">Cancel</AdsButton>
</AdsModal>`

const tooltipCode = `<AdsTooltip text="Copies the embed code to the clipboard">
  <AdsIconButton icon="code" label="Copy embed code" />
</AdsTooltip>`

const drawerCode = `<AdsDrawer>
  <AdsDataGrid :columns="columns" :rows="rows" />
  <template #panel><AdsDl :items="detail" /></template>
</AdsDrawer>`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Feedback & overlays</p>
      <h1 class="title face-display">Feedback & overlays</h1>
      <p class="lede">Empty states, loading, confirmations and the things that float above.</p>
    </header>

    <ComponentDoc
      id="adsempty"
      name="AdsEmpty"
      description="The first screen every new user sees, so it gets a component rather than a grey sentence."
      :code="emptyCode"
      :props="[
        { name: 'kind', type: 'first-run | no-results', default: 'first-run', desc: 'Never had data, or a filter matched nothing. Different glyph, different copy, different action.' },
        { name: 'icon', type: 'string', default: 'by kind', desc: 'discovery (first-run) / compass (no-results).' },
        { name: 'title', type: 'string', default: '—' },
        { name: 'body', type: 'string', default: '' },
        { name: 'default slot', type: 'action', default: '—', desc: 'The action that fills it. Expected — warns in development when missing.' },
      ]"
    >
      <div class="block stack gap-4">
        <AdsEmpty kind="first-run" title="No crawls yet" body="Results, issues and the ranked plan all appear here once a crawl has finished."><AdsButton size="sm" variant="accent" icon="plus">New crawl</AdsButton></AdsEmpty>
        <AdsEmpty kind="no-results" title="No pages match these filters" body="Nothing in this crawl is both 4xx and indexable."><AdsButton size="sm">Clear filters</AdsButton></AdsEmpty>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsskeleton"
      name="AdsSkeleton"
      description="Holds the layout at the real content's dimensions, so nothing shifts when data lands."
      :code="skeletonCode"
      :props="[
        { name: 'width / height', type: 'string', default: '100% / 1em' },
        { name: 'pill', type: 'boolean', default: 'false' },
      ]"
    >
      <div class="block stack gap-3" style="max-width: 320px"><AdsSkeleton height="14px" /><AdsSkeleton width="70%" height="14px" /><AdsSkeleton height="14px" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adsloading"
      name="AdsLoading"
      description="For the cases a skeleton cannot cover: an action in flight, or a panel whose shape is not known until the data arrives."
      :code="loadingCode"
      :props="[
        { name: 'text', type: 'string', default: '— (required)', desc: 'What is loading. A spinner alone tells nobody anything.' },
        { name: 'size', type: 'number', default: '18' },
      ]"
    >
      <AdsLoading text="Recrawling 311 URLs…" />
      <AdsButton loading>Exporting</AdsButton>
    </ComponentDoc>

    <ComponentDoc
      id="adsbanner"
      name="AdsBanner"
      description="A condition that persists, and stays until it is resolved — the place for an error the reader must act on. The glyph and a word carry the state, so it survives without its colour."
      :code="bannerCode"
      :props="[
        { name: 'text', type: 'string', default: '—' },
        { name: 'tone', type: 'info | warn | bad', default: 'info', desc: 'bad is announced as an alert.' },
        { name: 'icon', type: 'string', default: 'by tone', desc: 'signal (info) / alert (warn, bad).' },
        { name: '#actions', type: 'slot', default: '—', desc: 'The action that resolves it.' },
      ]"
    >
      <div class="block stack gap-3">
        <AdsBanner text="This crawl is 14 days old. Figures describe the site as it was on 2026-10-11." />
        <AdsBanner tone="bad" text="The last export failed: the sitemap could not be read."><template #actions><AdsButton size="sm">Retry export</AdsButton></template></AdsBanner>
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adstoast"
      name="AdsToastHost"
      description="Confirms something that already happened, then leaves. Mount once, then call useToast().push(text, icon?) from anywhere. Never for an error the reader must act on — that is a banner."
      :code="toastCode"
      :props="[
        { name: 'push(text, icon?)', type: 'icon: check | mail | code | arrow | layers', default: 'check', desc: 'No error glyph, by design.' },
      ]"
    >
      <AdsButton icon="check" @click="toast.push('Export finished · 733 rows', 'check')">Export CSV</AdsButton>
    </ComponentDoc>

    <ComponentDoc
      id="adsmodal"
      name="AdsModal"
      description="Blocks everything until answered, so it is kept for decisions that cannot wait — a destructive confirmation, with the verb on a default-weight button, never the accent. Row detail is a drawer. Closes on Escape and scrim click; focus moves in, stays in, and returns."
      :code="modalCode"
      :props="[
        { name: 'open', type: 'boolean (v-model:open)', default: 'false' },
        { name: 'title', type: 'string', default: '— (required)', desc: 'Names the dialog (aria-labelledby).' },
        { name: 'width', type: 'string', default: '', desc: 'CSS max-width override.' },
      ]"
    >
      <AdsButton @click="open = true">Delete project…</AdsButton>
      <AdsModal v-model:open="open" title="Delete this project?">
        <p class="ink-subdued mar-b-4">Its crawls, history and comparisons go with it. This cannot be undone.</p>
        <div class="row gap-3">
          <AdsButton destructive @click="open = false">Delete project</AdsButton>
          <AdsButton variant="quiet" @click="open = false">Cancel</AdsButton>
        </div>
      </AdsModal>
    </ComponentDoc>

    <ComponentDoc
      id="adstooltip"
      name="AdsTooltip"
      description="Answers a question only if asked: on hover or focus, described to assistive tech, dismissed with Escape. The trigger is the default slot. Never the only way to learn what a control does."
      :code="tooltipCode"
      :props="[
        { name: 'text', type: 'string', default: '—' },
        { name: 'position', type: 'top | bottom', default: 'top' },
      ]"
    >
      <AdsTooltip text="Copies the embed code to the clipboard"><AdsIconButton icon="code" label="Copy embed code" /></AdsTooltip>
    </ComponentDoc>

    <ComponentDoc
      id="adsdrawer"
      name="AdsDrawer"
      description="A right-hand detail panel — where a selected row explains itself."
      :code="drawerCode"
    >
      <div class="block"><AdsDrawer><p class="ink-subdued pad-3">The main table goes here.</p><template #panel><AdsDl :items="[{ term: 'Region', value: 'NA + EU' }, { term: 'Owner', value: 'Growth' }]" /></template></AdsDrawer></div>
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

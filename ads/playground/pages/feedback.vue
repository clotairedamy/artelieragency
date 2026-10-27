<script setup lang="ts">
const open = ref(false)
const toast = useToast()

const emptyCode = `<AdsEmpty icon="discovery" title="Nothing here yet" body="Add your first project." />`

const skeletonCode = `<AdsSkeleton width="100%" height="16px" />`

const loadingCode = `<AdsLoading text="Recrawling 311 URLs…" />`

const bannerCode = `<AdsBanner icon="alert" text="Your trial ends in 3 days." />`

const toastCode = `// app.vue
<AdsToastHost />

// anywhere
const toast = useToast()
toast.push('Copied', 'check')`

const modalCode = `const open = ref(false)
<AdsModal v-model="open" title="Confirm">
  <p>Are you sure?</p>
</AdsModal>`

const tooltipCode = `<AdsTooltip text="Copies to clipboard">
  <AdsIconButton icon="code" label="Copy" />
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
        { name: 'icon', type: 'string', default: 'discovery' },
        { name: 'title', type: 'string', default: '—' },
        { name: 'body', type: 'string', default: '' },
      ]"
    >
      <div class="block"><AdsEmpty icon="discovery" title="Nothing here yet" body="Add your first project and it will show up here."><AdsButton size="sm" variant="accent" icon="plus">New project</AdsButton></AdsEmpty></div>
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
      :props="[{ name: 'text', type: 'string', default: '' }]"
    >
      <AdsLoading text="Recrawling 311 URLs…" />
      <AdsButton loading>Exporting</AdsButton>
    </ComponentDoc>

    <ComponentDoc
      id="adsbanner"
      name="AdsBanner"
      description="A callout with a glyph and an accent edge."
      :code="bannerCode"
      :props="[
        { name: 'text', type: 'string', default: '—' },
        { name: 'icon', type: 'string', default: 'alert' },
      ]"
    >
      <div class="block"><AdsBanner icon="alert" text="Your trial ends in 3 days. Add a payment method to keep going." /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adstoast"
      name="AdsToastHost"
      description="Mount once, then call useToast().push() from anywhere."
      :code="toastCode"
    >
      <AdsButton icon="check" @click="toast.push('Saved', 'check')">Show a toast</AdsButton>
    </ComponentDoc>

    <ComponentDoc
      id="adsmodal"
      name="AdsModal"
      description="A modal on a scrim. Closes on Escape and scrim click; focus moves in."
      :code="modalCode"
      :props="[
        { name: 'open', type: 'boolean (v-model)', default: 'false' },
        { name: 'title', type: 'string', default: '' },
        { name: 'width', type: 'string', default: '', desc: 'CSS max-width override.' },
      ]"
    >
      <AdsButton @click="open = true">Open modal</AdsButton>
      <AdsModal v-model="open" title="Confirm">
        <p class="ink-subdued mar-b-4">This action cannot be undone.</p>
        <div class="row gap-3">
          <AdsButton @click="open = false">Cancel</AdsButton>
          <AdsButton variant="accent" @click="open = false">Confirm</AdsButton>
        </div>
      </AdsModal>
    </ComponentDoc>

    <ComponentDoc
      id="adstooltip"
      name="AdsTooltip"
      description="A bubble on hover/focus. The trigger is the default slot."
      :code="tooltipCode"
      :props="[
        { name: 'text', type: 'string', default: '—' },
        { name: 'position', type: 'top | bottom', default: 'top' },
      ]"
    >
      <AdsTooltip text="Copies to clipboard"><AdsIconButton icon="code" label="Copy" /></AdsTooltip>
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

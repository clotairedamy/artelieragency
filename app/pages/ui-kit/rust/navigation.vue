<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Navigation · Artelier UI Kit for Rust',
  description: 'Getting between screens.',
  path: '/ui-kit/rust/navigation',
})
const { usage, source } = useRustDocs()
const tab = ref('internal')
const page = ref(4)
const tabOptions = [{ label: 'Internal', value: 'internal' }, { label: 'External', value: 'external' }]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Navigation</p>
      <h1 class="title face-display">Navigation</h1>
      <p class="lede">Getting between screens.</p>
    </header>

    <RustDoc id="r-tabs" name="AdsTabs" :code="usage.AdsTabs" file="ui/group.rs" :source="source('ui/group.rs')"><AdsTabs v-model="tab" :tabs="tabOptions" label="Links" /></RustDoc>
    <RustDoc id="r-crumbs" name="AdsCrumbs" :code="usage.AdsCrumbs" file="ui/nav.rs" :source="source('ui/nav.rs')"><AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'CrawlStat', to: '/' }, { label: 'Results' }]" /></RustDoc>
    <RustDoc id="r-pager" name="AdsPager" :code="usage.AdsPager" file="ui/nav.rs" :source="source('ui/nav.rs')"><AdsPager v-model:page="page" :pages="12" /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

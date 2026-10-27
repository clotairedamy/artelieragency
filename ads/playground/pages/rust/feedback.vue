<script setup lang="ts">
const { usage, source } = useRustDocs()
const modalOpen = ref(false)
const toast = useToast()
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Feedback</p>
      <h1 class="title face-display">Feedback</h1>
      <p class="lede">When there is nothing to show yet.</p>
    </header>

    <RustDoc id="r-empty" name="AdsEmpty" :code="usage.AdsEmpty" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><div class="stack gap-3 block"><AdsEmpty title="No crawls yet" body="Results appear here once a crawl has finished."><AdsButton variant="accent" size="sm" icon="plus">New crawl</AdsButton></AdsEmpty><AdsEmpty kind="no-results" title="Nothing matches these filters"><AdsButton size="sm">Clear filters</AdsButton></AdsEmpty></div></RustDoc>
    <RustDoc id="r-skeleton" name="AdsSkeleton" :code="usage.AdsSkeleton" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><div class="stack gap-2 block" style="max-width: 280px"><AdsSkeleton height="13px" /><AdsSkeleton width="70%" height="13px" /></div></RustDoc>
    <RustDoc id="r-loading" name="AdsLoading" :code="usage.AdsLoading" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><AdsLoading text="Recrawling 311 URLs…" /></RustDoc>
    <RustDoc id="r-banner" name="AdsBanner" :code="usage.AdsBanner" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><div class="stack gap-3 block"><AdsBanner text="This crawl is 14 days old." /><AdsBanner tone="bad" text="The last crawl failed: robots.txt blocked it."><template #actions><AdsButton size="sm">Retry</AdsButton></template></AdsBanner></div></RustDoc>
    <RustDoc id="r-tooltip" name="AdsTooltip" :code="usage.AdsTooltip" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><AdsTooltip text="Internal links pointing here"><AdsIconButton icon="code" label="Copy" /></AdsTooltip></RustDoc>
    <RustDoc id="r-modal" name="AdsModal" :code="usage.AdsModal" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><AdsButton @click="modalOpen = true">Delete project…</AdsButton><AdsModal v-model:open="modalOpen" title="Delete this project?"><p class="ink-subdued mar-b-3">This cannot be undone.</p><div class="row gap-3"><AdsButton destructive @click="modalOpen = false">Delete project</AdsButton><AdsButton variant="quiet" @click="modalOpen = false">Cancel</AdsButton></div></AdsModal></RustDoc>
    <RustDoc id="r-toast" name="AdsToastHost" :code="usage.AdsToastHost" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><AdsButton icon="check" @click="toast.push('Export finished · 733 rows', 'check')">Export CSV</AdsButton></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

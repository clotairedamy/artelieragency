<script setup lang="ts">
const { usage, source } = useRustDocs()
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Disclosure</p>
      <h1 class="title face-display">Disclosure</h1>
      <p class="lede">Summary first, detail on request.</p>
    </header>

    <RustDoc id="r-accordion" name="AdsAccordion" :code="usage.AdsAccordion" file="ui/disclosure.rs" :source="source('ui/disclosure.rs')"><div class="block"><AdsAccordion :items="[{ title: 'Why is the chrome grey?', body: 'So colour means something when it appears.' }]" /></div></RustDoc>
    <RustDoc id="r-steps" name="AdsSteps" :code="usage.AdsSteps" file="ui/disclosure.rs" :source="source('ui/disclosure.rs')"><AdsSteps :steps="[{ label: 'Configure', state: 'done' }, { label: 'Audit', state: 'now' }]" /></RustDoc>
    <RustDoc id="r-tree" name="AdsTree" :code="usage.AdsTree" file="ui/disclosure.rs" :source="source('ui/disclosure.rs')"><AdsTree :nodes="[{ label: '/', children: [{ label: 'blog', count: 842 }] }]" /></RustDoc>
    <RustDoc id="r-drawer" name="AdsDrawer" :code="usage.AdsDrawer" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><div class="block"><AdsDrawer><p class="ink-subdued pad-3">The grid stays where it is.</p><template #panel><AdsDl :items="[{ term: 'Code', value: '200' }]" /></template></AdsDrawer></div></RustDoc>
    <RustDoc id="r-popover" name="AdsPopover" :code="usage.AdsPopover" file="ui/feedback.rs" :source="source('ui/feedback.rs')"><AdsPopover label="Link score" body="A 0–100 measure of internal link value." /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

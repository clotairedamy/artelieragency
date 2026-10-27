<script setup lang="ts">
const { usage, source } = useRustDocs()
const seg = ref('7d')
const tab = ref('internal')
const segOptions = [{ label: '24h', value: '24h' }, { label: '7d', value: '7d' }, { label: '30d', value: '30d' }]
const tabOptions = [{ label: 'Internal', value: 'internal' }, { label: 'External', value: 'external' }]
const menuItems = [{ label: 'Duplicate', icon: 'layers' }, { label: '---' }, { label: 'Delete', icon: 'alert' }]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Actions</p>
      <h1 class="title face-display">Actions</h1>
      <p class="lede">One accent, spent once per screen.</p>
    </header>

    <RustDoc id="r-button" name="AdsButton" :code="usage.AdsButton" file="ui/button.rs" :source="source('ui/button.rs')"><AdsButton variant="accent" icon="plus">New crawl</AdsButton><AdsButton>Export CSV</AdsButton><AdsButton variant="quiet">Cancel</AdsButton></RustDoc>
    <RustDoc id="r-iconbutton" name="AdsIconButton" :code="usage.AdsIconButton" file="ui/button.rs" :source="source('ui/button.rs')"><AdsIconButton icon="mail" label="Email" /><AdsIconButton icon="grid" label="Grid" /></RustDoc>
    <RustDoc id="r-segmented" name="AdsSegmented" :code="usage.AdsSegmented" file="ui/group.rs" :source="source('ui/group.rs')"><AdsSegmented v-model="seg" :options="segOptions" /></RustDoc>
    <RustDoc id="r-tabs" name="AdsTabs" :code="usage.AdsTabs" file="ui/group.rs" :source="source('ui/group.rs')"><AdsTabs v-model="tab" :tabs="tabOptions" /></RustDoc>
    <RustDoc id="r-menu" name="AdsMenu" :code="usage.AdsMenu" file="ui/group.rs" :source="source('ui/group.rs')"><AdsMenu :items="menuItems" /></RustDoc>
    <RustDoc id="r-theme" name="AdsThemeToggle" :code="usage.AdsThemeToggle" file="ui/brand.rs" :source="source('ui/brand.rs')"><AdsThemeToggle /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

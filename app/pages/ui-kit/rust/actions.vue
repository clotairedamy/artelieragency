<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Actions · Artelier UI Kit for Rust',
  description: 'One accent, spent once per screen.',
  path: '/ui-kit/rust/actions',
})
const { usage, source } = useRustDocs()
const seg = ref('7d')
const segOptions = [{ label: '24h', value: '24h' }, { label: '7d', value: '7d' }, { label: '30d', value: '30d' }]
const menuItems = [{ label: 'Duplicate', icon: 'layers', shortcut: '⌘D' }, { label: 'Delete', icon: 'alert', destructive: true }]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Actions</p>
      <h1 class="title face-display">Actions</h1>
      <p class="lede">One accent, spent once per screen.</p>
    </header>

    <RustDoc id="r-button" name="AdsButton" :code="usage.AdsButton" file="ui/button.rs" :source="source('ui/button.rs')"><AdsButton variant="accent" icon="plus">New crawl</AdsButton><AdsButton variant="quiet">Cancel</AdsButton><AdsButton destructive>Delete project</AdsButton></RustDoc>
    <RustDoc id="r-iconbutton" name="AdsIconButton" :code="usage.AdsIconButton" file="ui/button.rs" :source="source('ui/button.rs')"><AdsIconButton icon="mail" label="Email" /><AdsIconButton icon="grid" label="Grid" /></RustDoc>
    <RustDoc id="r-segmented" name="AdsSegmented" :code="usage.AdsSegmented" file="ui/group.rs" :source="source('ui/group.rs')"><AdsSegmented v-model="seg" :options="segOptions" label="Range" /></RustDoc>
    <RustDoc id="r-menu" name="AdsMenu" :code="usage.AdsMenu" file="ui/group.rs" :source="source('ui/group.rs')"><AdsMenu :items="menuItems" label="Row actions" /></RustDoc>
    <RustDoc id="r-theme" name="AdsThemeToggle" :code="usage.AdsThemeToggle" file="ui/brand.rs" :source="source('ui/brand.rs')"><AdsThemeToggle /></RustDoc>
    <RustDoc id="r-brandmark" name="BrandMark" :code="usage.BrandMark" file="ui/brand.rs" :source="source('ui/brand.rs')"><BrandMark :size="40" /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

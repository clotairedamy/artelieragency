<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Surfaces · Artelier UI Kit for Rust',
  description: 'Cards stand proud of the page; wells are pressed into it. Both are CSS classes, shared with Vue.',
  path: '/ui-kit/rust/surfaces',
})
// Rust surfaces — Card and Well are CSS classes shared with Vue (the same
// five stylesheets); FrameTab is a component.
const { usage, source } = useRustDocs()
const cardCode = `div { class: "card", style: "padding:24px",
    span { class: "ads-label", "Crawl health" }
    span { class: "num", "98" }
}`
const wellCode = `div { class: "well", style: "padding:16px 20px", "A well holds content" }`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Surfaces</p>
      <h1 class="title face-display">Surfaces</h1>
      <p class="lede">Cards stand proud of the page; wells are pressed into it. Both are CSS classes, shared with Vue.</p>
    </header>

    <RustDoc id="r-card" name="Card" description="A block of content standing proud of the page." :code="cardCode" file="assets/css/base.css" :source="'(CSS class — .card, defined in base.css)'">
      <div class="card" style="padding: 24px"><span class="ads-label">Crawl health</span><span class="num" style="font-size: 2rem">98</span><span class="dim">of 100 · unchanged</span></div>
    </RustDoc>

    <RustDoc id="r-well" name="Well" description="The same shape pressed into the page." :code="wellCode" file="assets/css/base.css" :source="'(CSS class — .well, defined in base.css)'">
      <div class="well" style="padding: 16px 20px">A well holds content</div>
      <input class="ads-field" value="Every input is a well" readonly style="max-width: 240px" />
    </RustDoc>

    <RustDoc id="r-frametab" name="FrameTab" description="The selected rail item, cut from the frame's own surface and reaching into the rail with concave fillets." :code="usage.FrameTab" file="ui/frame_tab.rs" :source="source('ui/frame_tab.rs')">
      <div class="block"><FrameTab :items="['Projects', 'Results', 'Issues']" :active="1">The frame</FrameTab></div>
    </RustDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>

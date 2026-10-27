<script setup lang="ts">
// Rust surfaces — Card and Well are CSS classes shared with Vue (the same
// five stylesheets). FrameTab is not ported to Rust yet.
const cardCode = `div { class: "card", style: "padding:24px",
    span { class: "ads-label", "Crawl health" }
    span { class: "num", "98" }
}`
const wellCode = `div { class: "well", style: "padding:16px 20px", "A well holds content" }`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Surfaces</p>
      <h1 class="title face-display">Surfaces</h1>
      <p class="lede">Cards stand proud of the page; wells are pressed into it. These are CSS classes, shared with Vue.</p>
    </header>

    <RustDoc id="r-card" name="Card" description="A block of content standing proud of the page." :code="cardCode" file="assets/css/base.css" :source="'(CSS class — .card, defined in base.css)'">
      <div class="card" style="padding: 24px"><span class="ads-label">Crawl health</span><span class="num" style="font-size: 2rem">98</span><span class="dim">of 100 · unchanged</span></div>
    </RustDoc>

    <RustDoc id="r-well" name="Well" description="The same shape pressed into the page." :code="wellCode" file="assets/css/base.css" :source="'(CSS class — .well, defined in base.css)'">
      <div class="well" style="padding: 16px 20px">A well holds content</div>
      <input class="ads-field" value="Every input is a well" readonly style="max-width: 240px" />
    </RustDoc>

    <div class="card pad-4">
      <p class="ink-subdued size-sm">
        <strong class="ink">FrameTab</strong> is documented in the Vue Surfaces
        page but not ported to Dioxus yet — it is the one surface component
        still Vue-only.
      </p>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>

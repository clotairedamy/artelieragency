<script setup lang="ts">
const cardCode = `<div class="card">
  <span class="ads-label">Crawl health</span>
  <span class="num demo-figure">98</span>
  <span class="dim">of 100 · unchanged</span>
</div>`

const wellCode = `<div class="well">A well holds content</div>`

const frameTabCode = `<FrameTab :items="['Projects', 'Results', 'Issues']" :active="1">
  The frame
</FrameTab>`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Surfaces</p>
      <h1 class="title face-display">Surfaces</h1>
      <p class="lede">Cards stand proud of the page; wells are pressed into it. Depth is the only decoration.</p>
    </header>

    <ComponentDoc
      id="card"
      name="Card"
      description="A block of content standing proud of the page. Cards, not strips — alignment comes from one shared gutter, not rules drawn between bands."
      :code="cardCode"
      :props="[{ name: 'class', type: 'CSS class', default: '.card', desc: 'Nest a well, not a second card.' }]"
    >
      <div class="card pad-5 stack gap-2"><span class="ads-label">Crawl health</span><span class="num size-3xl">98</span><span class="dim">of 100 · unchanged</span></div>
      <div class="card pad-5 stack gap-2" style="box-shadow: var(--soft-inset)"><span class="ads-label">Pressed</span><span class="dim">hover / focus-within</span></div>
    </ComponentDoc>

    <ComponentDoc
      id="well"
      name="Well"
      description="The same shape pressed into the page. Holds things rather than presenting them: inputs, specimens, tracks, grids."
      :code="wellCode"
      :props="[{ name: 'class', type: 'CSS class', default: '.well', desc: 'Needs a raised parent to be pressed into.' }]"
    >
      <div class="well pad-4">A well holds content</div>
      <input class="ads-field" value="Every input is a well" readonly style="max-width: 240px" />
    </ComponentDoc>

    <ComponentDoc
      id="frametab"
      name="FrameTab"
      description="The selected rail item, cut from the frame's own surface and reaching into the rail with concave fillets. Covers the seam so rail and content read as one piece."
      :code="frameTabCode"
      :props="[
        { name: 'items', type: 'string[]', default: '—', desc: 'Rail destinations.' },
        { name: 'active', type: 'number', default: '—', desc: 'The single selected index.' },
      ]"
    >
      <div class="block"><FrameTab :items="['Projects', 'Results', 'Issues']" :active="1">The frame</FrameTab></div>
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

<script setup lang="ts">
const { usage, source } = useRustDocs()
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Docs</p>
      <h1 class="title face-display">Docs</h1>
      <p class="lede">The documentation building blocks, in rsx!.</p>
    </header>

    <RustDoc id="r-docshell" name="DocShell" description="A docs shell: a sidebar and a reading column." :code="usage.DocShell" file="blocks/docs.rs" :source="source('blocks/docs.rs')"><div class="block"><DocShell><template #aside><DocNav :groups="[{ section: 'Guides', pages: [{ title: 'Start', path: '/vue' }] }]" /></template><p class="body">Content.</p></DocShell></div></RustDoc>
    <RustDoc id="r-docnav" name="DocNav" description="A help-centre sidebar: pages grouped by section." :code="usage.DocNav" file="blocks/docs.rs" :source="source('blocks/docs.rs')"><DocNav :home="{ to: '/vue', label: 'Home' }" :groups="[{ section: 'Guides', pages: [{ title: 'Start', path: '/vue' }, { title: 'Components', path: '/vue/components' }] }]" /></RustDoc>
    <RustDoc id="r-callout" name="Callout" description="A note, tip, or warning." :code="usage.Callout" file="blocks/docs.rs" :source="source('blocks/docs.rs')"><Callout type="tip">A note worth reading.</Callout></RustDoc>
    <RustDoc id="r-appwindow" name="AppWindow" description="A framed app window." :code="usage.AppWindow" file="blocks/docs.rs" :source="source('blocks/docs.rs')"><div style="max-width:360px"><AppWindow src="https://via.placeholder.com/640x360" alt="Screenshot" /></div></RustDoc>
    <RustDoc id="r-screenshot" name="Screenshot" description="A screenshot with a caption." :code="usage.Screenshot" file="blocks/docs.rs" :source="source('blocks/docs.rs')"><div style="max-width:360px"><Screenshot src="https://via.placeholder.com/640x360" alt="Screenshot" caption="The results table." /></div></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

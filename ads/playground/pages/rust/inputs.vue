<script setup lang="ts">
const { usage, source } = useRustDocs()
const agree = ref(true)
const email = ref('')
const range = ref(50)
const num = ref(3)
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Inputs</p>
      <h1 class="title face-display">Inputs</h1>
      <p class="lede">Things that take a value. Every field is a well.</p>
    </header>

    <RustDoc id="r-field" name="AdsField" :code="usage.AdsField" file="ui/field.rs" :source="source('ui/field.rs')"><div class="stack gap-3 block" style="max-width: 320px"><AdsField v-model="email" label="Email" hint="We never share it." /></div></RustDoc>
    <RustDoc id="r-daterange" name="AdsDaterange" :code="usage.AdsDaterange" file="ui/field.rs" :source="source('ui/field.rs')"><AdsDaterange from="2026-09-25" to="2026-10-25" /></RustDoc>
    <RustDoc id="r-choice" name="AdsChoice" :code="usage.AdsChoice" file="ui/choice.rs" :source="source('ui/choice.rs')"><AdsChoice v-model="agree" label="I agree to the terms" /><AdsChoice kind="switch" label="Email me" :model-value="false" /></RustDoc>
    <RustDoc id="r-range" name="AdsRange" :code="usage.AdsRange" file="ui/choice.rs" :source="source('ui/choice.rs')"><div class="block" style="max-width: 300px"><AdsRange v-model="range" label="Concurrency" /></div></RustDoc>
    <RustDoc id="r-number" name="AdsNumber" :code="usage.AdsNumber" file="ui/choice.rs" :source="source('ui/choice.rs')"><AdsNumber v-model="num" :min="0" :max="10" label="Count" /></RustDoc>
    <RustDoc id="r-tag" name="AdsTag" :code="usage.AdsTag" file="ui/chip.rs" :source="source('ui/chip.rs')"><AdsTag label="status: 4xx" /><AdsTag label="depth ≤ 3" /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

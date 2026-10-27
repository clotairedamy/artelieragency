<script setup lang="ts">
const { usage, source } = useRustDocs()
const bars = [{ label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 51 }]
const spark = [12, 19, 15, 24, 31, 27, 38]
const gridColumns = [{ key: 'name', label: 'Page', mono: true }, { key: 'views', label: 'Views' }, { key: 'sev', label: 'Severity', grade: true }]
const gridRows = [{ name: '/overview', views: 18240, sev: 1 }, { name: '/pricing', views: 9312, sev: 3 }]
// Deterministic, so the server and client renders agree.
const heat = Array.from({ length: 5 }, (_, y) =>
  Array.from({ length: 16 }, (_, x) => Math.round((Math.sin(x / 3.1 + y / 1.7) * 0.5 + 0.5) * 40)),
)
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Data display</p>
      <h1 class="title face-display">Data display</h1>
      <p class="lede">The reason the screen exists. Numbers are monospaced.</p>
    </header>

    <RustDoc id="r-stat" name="AdsStat" :code="usage.AdsStat" file="ui/stat.rs" :source="source('ui/stat.rs')"><AdsStat value="1,284" label="URLs crawled" delta="+37" direction="up" /><AdsStat value="74" label="Median latency" unit="ms" :previous="84" /></RustDoc>
    <RustDoc id="r-delta" name="AdsDelta" :code="usage.AdsDelta" file="ui/chip.rs" :source="source('ui/chip.rs')"><AdsDelta direction="up" value="12.4%" /><AdsDelta direction="down" value="3.1%" /></RustDoc>
    <RustDoc id="r-badge" name="AdsBadge" :code="usage.AdsBadge" file="ui/chip.rs" :source="source('ui/chip.rs')"><AdsBadge :value="5" label="unread" /><AdsBadge value="draft" quiet /></RustDoc>
    <RustDoc id="r-status" name="AdsStatus" :code="usage.AdsStatus" file="ui/chip.rs" :source="source('ui/chip.rs')"><AdsStatus label="Healthy" :grade="1" /><AdsStatus label="Critical" :grade="4" /><AdsStatus label="Job failed" tone="bad" /></RustDoc>
    <RustDoc id="r-meter" name="AdsMeter" :code="usage.AdsMeter" file="ui/stat.rs" :source="source('ui/stat.rs')"><div class="block" style="max-width: 320px"><AdsMeter :value="68" :max="100" :threshold="80" label="Budget used" unit="%" /></div></RustDoc>
    <RustDoc id="r-progress" name="AdsProgress" :code="usage.AdsProgress" file="ui/stat.rs" :source="source('ui/stat.rs')"><div class="block" style="max-width: 320px"><AdsProgress :value="46" label="Crawling" /></div></RustDoc>
    <RustDoc id="r-dl" name="AdsDl" :code="usage.AdsDl" file="ui/stat.rs" :source="source('ui/stat.rs')"><AdsDl :items="[{ term: 'Status', value: '200 · indexable' }, { term: 'Words', value: '1,286' }]" /></RustDoc>
    <RustDoc id="r-grid" name="AdsDataGrid" :code="usage.AdsDataGrid" file="ui/stat.rs" :source="source('ui/stat.rs')"><div class="block"><AdsDataGrid :columns="gridColumns" :rows="gridRows" caption="Top pages" /></div></RustDoc>
    <RustDoc id="r-chartchoice" name="ChartChoice" :code="usage.ChartChoice" file="charts/chart_choice.rs" :source="source('charts/chart_choice.rs')"><div class="block"><ChartChoice /></div></RustDoc>
    <RustDoc id="r-bars" name="AdsBars" :code="usage.AdsBars" file="charts/bar.rs" :source="source('charts/bar.rs')"><div class="block"><AdsBars :data="bars" label="Crawls by weekday" /></div></RustDoc>
    <RustDoc id="r-spark" name="AdsSparkline" :code="usage.AdsSparkline" file="charts/sparkline.rs" :source="source('charts/sparkline.rs')"><div class="block"><AdsSparkline :points="spark" label="Sessions, last 7 weeks" /></div></RustDoc>
    <RustDoc id="r-gauge" name="AdsGauge" :code="usage.AdsGauge" file="charts/gauge.rs" :source="source('charts/gauge.rs')"><AdsGauge :value="68" :max="100" :threshold="80" label="coverage" unit="%" /></RustDoc>
    <RustDoc id="r-heatmap" name="AdsHeatmap" :code="usage.AdsHeatmap" file="charts/heatmap.rs" :source="source('charts/heatmap.rs')"><div class="block"><AdsHeatmap :values="heat" label="Crawl errors by weekday and hour" /></div></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

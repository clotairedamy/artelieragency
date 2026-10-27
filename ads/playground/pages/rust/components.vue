<script setup lang="ts">
// The Rust index: the same component set, pointing at the Rust pages.
const groups = [
  { title: 'Surfaces', to: '/rust/surfaces', items: ['Card', 'Well', 'FrameTab'] },
  { title: 'Actions', to: '/rust/actions', items: ['Button', 'IconButton', 'Segmented', 'Menu'] },
  { title: 'Inputs', to: '/rust/inputs', items: ['Field', 'Choice', 'Range', 'Number', 'Daterange', 'Tag'] },
  { title: 'Data display', to: '/rust/data-display', items: ['Bars', 'Sparkline', 'Gauge', 'Heatmap', 'DataGrid', 'Stat', 'Progress', 'Badge'] },
  { title: 'Disclosure', to: '/rust/disclosure', items: ['Accordion', 'Drawer', 'Popover', 'Steps', 'Tree'] },
  { title: 'Navigation', to: '/rust/navigation', items: ['Crumbs', 'Pager', 'Tabs'] },
  { title: 'Feedback', to: '/rust/feedback', items: ['Banner', 'Toast', 'Tooltip', 'Skeleton', 'Empty', 'Modal'] },
  { title: 'Patterns', to: '/rust/patterns', items: ['KpiRow', 'FilterBar', 'TableScreen', 'DashShell', 'CommandPalette'] },
  { title: 'Elements', to: '/rust/elements', items: ['Typography', 'AspectRatio', 'Bubble', 'Item', 'Marker', 'Kbd', 'InputGroup', 'InputOtp', 'Select', 'Combobox', 'Sheet', 'Calendar', 'Trace', 'Questionnaire', 'Message', '…'] },
  { title: 'Page sections', to: '/rust/sections', items: ['SiteNav', 'HeroSection', 'ContentSection', 'ImageSection', 'FeatureGrid', 'LogoMarquee', 'PricingSection', 'FaqSection', 'CtaBand', 'ContactForm', 'SiteFooter', 'ScreenTour', 'WorkList', '…'] },
  { title: 'Docs', to: '/rust/docs', items: ['DocShell', 'DocNav', 'Callout', 'AppWindow', 'Screenshot'] },
]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Index</p>
      <h1 class="title face-display">All components</h1>
      <p class="lede">Everything in the Rust kit, grouped by category.</p>
    </header>

    <div class="stack gap-5">
      <section v-for="g in groups" :key="g.title" class="group">
        <NuxtLink :to="g.to" class="group-head">
          <h2 class="h3">{{ g.title }}</h2>
          <Icon name="chevron" :size="14" />
        </NuxtLink>
        <div class="chips">
          <span v-for="it in g.items" :key="it" class="chip">{{ it }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }

.group {
  display: grid;
  gap: 10px;
}

.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
  width: fit-content;
}

.group-head:hover {
  color: var(--accent);
}

.group-head .h3 {
  margin: 0;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>

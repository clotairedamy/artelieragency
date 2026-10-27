<script setup lang="ts">
// One searchable index of every component, by its familiar name, its ADS
// name, and where it lives.
type Entry = { name: string; ads: string; page: string; to: string }

const entries: Entry[] = [
  { name: 'Alert', ads: 'AdsBanner', page: 'Feedback', to: '/feedback' },
  { name: 'Alert Dialog', ads: 'AdsAlertDialog', page: 'Elements', to: '/elements' },
  { name: 'Aspect Ratio', ads: 'AdsAspectRatio', page: 'Elements', to: '/elements' },
  { name: 'Attachment', ads: 'AdsAttachment', page: 'Elements', to: '/elements' },
  { name: 'Avatar', ads: 'AdsAvatar', page: 'Elements', to: '/elements' },
  { name: 'Badge', ads: 'AdsBadge', page: 'Data display', to: '/data-display' },
  { name: 'Breadcrumb', ads: 'AdsCrumbs', page: 'Navigation', to: '/navigation' },
  { name: 'Bubble', ads: 'AdsBubble', page: 'Elements', to: '/elements' },
  { name: 'Button', ads: 'AdsButton', page: 'Actions', to: '/actions' },
  { name: 'Button Group', ads: 'AdsToggleGroup', page: 'Elements', to: '/elements' },
  { name: 'Calendar', ads: 'AdsCalendar', page: 'Elements', to: '/elements' },
  { name: 'Card', ads: 'Card', page: 'Surfaces', to: '/surfaces' },
  { name: 'Carousel', ads: 'AdsCarousel', page: 'Elements', to: '/elements' },
  { name: 'Chart', ads: 'AdsBars · Sparkline · Gauge · Heatmap · LineChart', page: 'Data display', to: '/data-display' },
  { name: 'Checkbox', ads: 'AdsChoice', page: 'Inputs', to: '/inputs' },
  { name: 'Code Block', ads: 'AdsCodeBlock', page: 'Elements', to: '/elements' },
  { name: 'Collapsible', ads: 'AdsCollapsible', page: 'Elements', to: '/elements' },
  { name: 'Combobox', ads: 'AdsCombobox', page: 'Elements', to: '/elements' },
  { name: 'Command', ads: 'CommandPalette', page: 'Patterns', to: '/patterns' },
  { name: 'Context Menu', ads: 'AdsContextMenu', page: 'Elements', to: '/elements' },
  { name: 'Data Table', ads: 'AdsDataGrid', page: 'Data display', to: '/data-display' },
  { name: 'Date Picker', ads: 'AdsDatePicker', page: 'Elements', to: '/elements' },
  { name: 'Dialog', ads: 'AdsModal', page: 'Feedback', to: '/feedback' },
  { name: 'Direction', ads: 'AdsDirection', page: 'Elements', to: '/elements' },
  { name: 'Drawer', ads: 'AdsDrawer', page: 'Disclosure', to: '/disclosure' },
  { name: 'Dropdown Menu', ads: 'AdsMenu', page: 'Actions', to: '/actions' },
  { name: 'Empty', ads: 'AdsEmpty', page: 'Feedback', to: '/feedback' },
  { name: 'Field', ads: 'AdsField', page: 'Inputs', to: '/inputs' },
  { name: 'Hover Card', ads: 'AdsHoverCard', page: 'Elements', to: '/elements' },
  { name: 'Input', ads: 'AdsField', page: 'Inputs', to: '/inputs' },
  { name: 'Input Group', ads: 'AdsInputGroup', page: 'Elements', to: '/elements' },
  { name: 'Input OTP', ads: 'AdsInputOtp', page: 'Elements', to: '/elements' },
  { name: 'Item', ads: 'AdsItem', page: 'Elements', to: '/elements' },
  { name: 'Kbd', ads: 'AdsKbd', page: 'Elements', to: '/elements' },
  { name: 'Label', ads: 'AdsLabel', page: 'Elements', to: '/elements' },
  { name: 'Marker', ads: 'AdsMarker', page: 'Elements', to: '/elements' },
  { name: 'Menubar', ads: 'AdsMenubar', page: 'Elements', to: '/elements' },
  { name: 'Message', ads: 'AdsMessage', page: 'Elements', to: '/elements' },
  { name: 'Message Scroller', ads: 'AdsMessageScroller', page: 'Elements', to: '/elements' },
  { name: 'Native Select', ads: 'AdsNativeSelect', page: 'Elements', to: '/elements' },
  { name: 'Navigation Menu', ads: 'AdsNavMenu', page: 'Elements', to: '/elements' },
  { name: 'Pagination', ads: 'AdsPager', page: 'Navigation', to: '/navigation' },
  { name: 'Popover', ads: 'AdsPopover', page: 'Disclosure', to: '/disclosure' },
  { name: 'Progress', ads: 'AdsProgress', page: 'Data display', to: '/data-display' },
  { name: 'Questionnaire', ads: 'AdsQuestionnaire', page: 'Elements', to: '/elements' },
  { name: 'Radio Group', ads: 'AdsChoice', page: 'Inputs', to: '/inputs' },
  { name: 'Resizable', ads: 'AdsResizable', page: 'Elements', to: '/elements' },
  { name: 'Scroll Area', ads: 'AdsScrollArea', page: 'Elements', to: '/elements' },
  { name: 'Select', ads: 'AdsSelect', page: 'Elements', to: '/elements' },
  { name: 'Separator', ads: 'AdsSeparator', page: 'Elements', to: '/elements' },
  { name: 'Sheet', ads: 'AdsSheet', page: 'Elements', to: '/elements' },
  { name: 'Sidebar', ads: 'DashShell', page: 'Patterns', to: '/patterns' },
  { name: 'Skeleton', ads: 'AdsSkeleton', page: 'Feedback', to: '/feedback' },
  { name: 'Slider', ads: 'AdsRange', page: 'Inputs', to: '/inputs' },
  { name: 'Spinner', ads: 'AdsSpinner', page: 'Elements', to: '/elements' },
  { name: 'Switch', ads: 'AdsChoice', page: 'Inputs', to: '/inputs' },
  { name: 'Table', ads: 'AdsDataGrid', page: 'Data display', to: '/data-display' },
  { name: 'Tabs', ads: 'AdsTabs', page: 'Navigation', to: '/navigation' },
  { name: 'Textarea', ads: 'AdsField', page: 'Inputs', to: '/inputs' },
  { name: 'Toast', ads: 'AdsToastHost', page: 'Feedback', to: '/feedback' },
  { name: 'Toggle', ads: 'AdsToggle', page: 'Elements', to: '/elements' },
  { name: 'Toggle Group', ads: 'AdsToggleGroup', page: 'Elements', to: '/elements' },
  { name: 'Tooltip', ads: 'AdsTooltip', page: 'Feedback', to: '/feedback' },
  { name: 'Trace', ads: 'AdsTrace', page: 'Elements', to: '/elements' },
]

const query = ref('')
const filtered = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return entries
  return entries.filter((e) => `${e.name} ${e.ads} ${e.page}`.toLowerCase().includes(q))
})
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Index</p>
      <h1 class="title face-display">All components</h1>
      <p class="lede">Every component, by the name you know, the ADS name, and where it lives. {{ entries.length }} in total.</p>
    </header>

    <div class="search">
      <Icon name="discovery" :size="18" />
      <input v-model="query" class="search-input" type="search" placeholder="Filter components… (e.g. “select”, “dialog”, “chart”)">
    </div>

    <div class="index">
      <NuxtLink v-for="e in filtered" :key="e.name" :to="e.to" class="row">
        <span class="row-name">{{ e.name }}</span>
        <span class="row-ads num">{{ e.ads }}</span>
        <span class="row-page">{{ e.page }}</span>
        <Icon name="chevron" :size="14" class="row-chev" />
      </NuxtLink>
      <p v-if="!filtered.length" class="empty dim">Nothing matches “{{ query }}”.</p>
    </div>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 14px;
  border-radius: var(--pill);
  background: var(--surface);
  box-shadow: var(--soft-inset-sm);
  color: var(--subdued);
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  color: var(--text);
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--subdued);
}

.index {
  display: grid;
  gap: 2px;
}

.row {
  display: grid;
  grid-template-columns: minmax(160px, 1fr) auto minmax(80px, 0.4fr) auto;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-soft);
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}

.row:hover {
  background: var(--hover);
  color: var(--text);
}

.row-name {
  font-weight: 500;
  color: var(--text);
}

.row-ads {
  font-size: 0.8rem;
  color: var(--subdued);
  text-align: right;
}

.row-page {
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--subdued);
  text-align: right;
}

.row-chev {
  color: var(--subdued);
}

.empty {
  padding: 20px;
  text-align: center;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr auto;
  }
  .row-ads {
    display: none;
  }
}
</style>

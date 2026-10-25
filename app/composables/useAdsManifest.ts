/**
 * The ADS contents, in one place: the rail reads the groups, the index reads
 * the components, and the page anchors against the same ids.
 *
 * Ordered by where a thing appears on a screen and what job it does, not
 * alphabetically. An alphabetical list puts Accordion next to AI label next
 * to Breadcrumb — three components with nothing to do with each other — and
 * is only useful to a reader who already knows the name of the thing they
 * are looking for. Someone designing a table wants every table-shaped
 * component together.
 */
export type AdsItem = { id: string; label: string }
export type AdsGroup = { id: string; label: string; icon: string; items: AdsItem[] }

export const adsGroups: AdsGroup[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    icon: 'layers',
    items: [
      { id: 'f-value', label: 'Value scale' },
      { id: 'f-elevation', label: 'Elevation' },
      { id: 'f-radius', label: 'Radius' },
      { id: 'f-type', label: 'Type' },
      { id: 'f-motion', label: 'Motion' },
    ],
  },
  {
    id: 'colour',
    label: 'Colour',
    icon: 'spark',
    items: [
      { id: 'c-thesis', label: 'Why the chrome is grey' },
      { id: 'c-brand', label: 'Brand & semantic' },
      { id: 'c-categorical', label: 'Categorical' },
      { id: 'c-sequential', label: 'Sequential & ordinal' },
      { id: 'c-diverging', label: 'Diverging' },
      { id: 'c-status', label: 'Status' },
      { id: 'c-vision', label: 'Colour vision & contrast' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'grid',
    items: [
      { id: 'l-grid', label: '12-column grid' },
      { id: 'l-scan', label: 'Scan order' },
      { id: 'l-density', label: 'Density' },
    ],
  },
  {
    id: 'surfaces',
    label: 'Surfaces',
    icon: 'compass',
    items: [
      { id: 'ads-card', label: 'Card' },
      { id: 'ads-well', label: 'Well' },
      { id: 'ads-tab-seam', label: 'Frame tab' },
    ],
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: 'plus',
    items: [
      { id: 'ads-button', label: 'Button' },
      { id: 'ads-icon-button', label: 'Icon button' },
      { id: 'ads-segmented', label: 'Segmented control' },
      { id: 'ads-menu', label: 'Menu' },
      { id: 'ads-link', label: 'Link' },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    icon: 'sliders',
    items: [
      { id: 'ads-field', label: 'Text field' },
      { id: 'ads-number', label: 'Number input' },
      { id: 'ads-select', label: 'Select, search, textarea' },
      { id: 'ads-daterange', label: 'Date range' },
      { id: 'ads-choice', label: 'Checkbox, radio, switch' },
      { id: 'ads-range', label: 'Range' },
      { id: 'ads-tag', label: 'Tag' },
    ],
  },
  {
    id: 'data',
    label: 'Data display',
    icon: 'chart',
    items: [
      { id: 'ads-stat', label: 'Stat tile & delta' },
      { id: 'ads-meter', label: 'Meter & progress' },
      { id: 'ads-chart-choice', label: 'Choosing a form' },
      { id: 'ads-charts', label: 'Charts' },
      { id: 'ads-grid', label: 'Data grid' },
      { id: 'ads-dl', label: 'Structured list' },
    ],
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    icon: 'flow',
    items: [
      { id: 'ads-accordion', label: 'Accordion' },
      { id: 'ads-drawer', label: 'Detail drawer' },
      { id: 'ads-popover', label: 'Popover' },
      { id: 'ads-tree', label: 'Tree view' },
      { id: 'ads-steps', label: 'Progress indicator' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: 'arrow',
    items: [
      { id: 'ads-tabs', label: 'Tabs' },
      { id: 'ads-crumbs', label: 'Breadcrumb & pagination' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: 'alert',
    items: [
      { id: 'ads-empty', label: 'Empty state' },
      { id: 'ads-skeleton', label: 'Skeleton' },
      { id: 'ads-loading', label: 'Loading' },
      { id: 'ads-banner', label: 'Banner, toast, tooltip' },
      { id: 'ads-modal', label: 'Modal' },
    ],
  },
  {
    id: 'patterns',
    label: 'Patterns',
    icon: 'check',
    items: [
      { id: 'ads-kpi-row', label: 'KPI row' },
      { id: 'ads-filter-bar', label: 'Filter bar & saved views' },
      { id: 'ads-table-screen', label: 'Table screen' },
      { id: 'ads-disclosure-pattern', label: 'Summary → detail' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: 'code',
    items: [
      { id: 'e-virtual', label: 'Virtualisation' },
      { id: 'e-loading', label: 'Loading strategy' },
      { id: 'e-state', label: 'State & caching' },
      { id: 'e-realtime', label: 'Real-time' },
    ],
  },
]

/** Flat count for the masthead, so the figure can never go stale. */
export const adsComponentCount = adsGroups.reduce((n, g) => n + g.items.length, 0)

/** Auto-imported accessor, so components take the manifest the same way. */
export function useAdsManifest() {
  return { adsGroups, adsComponentCount }
}

/**
 * The one piece of "where am I" state on the design system page.
 *
 * The rail and the in-page index are two granularities of a single
 * location, like a breadcrumb — not two navigations. They used to run an
 * IntersectionObserver each, with different root margins, so they drifted
 * apart and the rail would say "Colour" while the index said "Categorical".
 * Now the index owns the observer and writes here; the rail derives its
 * group from this. They cannot disagree.
 */
export function useAdsActive() {
  return useState<string>('ads-active', () => '')
}

/** The group that contains a component id. */
export function adsGroupOf(itemId: string) {
  return adsGroups.find((g) => g.items.some((i) => i.id === itemId))?.id ?? ''
}

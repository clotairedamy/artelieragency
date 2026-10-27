// The ADS component catalog — the single source of truth the MCP server reads
// from. Each entry is the machine-readable schema for one component: its name,
// category, description, props, slots, emits, a usage example and the file it
// lives in (so the server can also return the full source).

export type PropDef = {
  name: string
  type: string
  default?: string
  description?: string
}

export type ComponentDef = {
  name: string
  category: string
  description: string
  file: string
  props?: PropDef[]
  slots?: string[]
  emits?: string[]
  usage: string
  /** Whether the component is a CSS class rather than a .vue file. */
  cssClass?: boolean
}

export const categories = [
  'Surfaces',
  'Actions',
  'Inputs',
  'Data display',
  'Disclosure',
  'Navigation',
  'Feedback',
  'Patterns',
  'Docs',
  'Page sections',
  'Primitives',
] as const

export const components: ComponentDef[] = [
  // ─── Surfaces ──────────────────────────────────────────────────────────
  {
    name: 'Card',
    category: 'Surfaces',
    description: 'A block of content standing proud of the page. Cards, not strips. Nest a well, not a second card.',
    file: 'Card.css',
    cssClass: true,
    usage: `<div class="card">…</div>`,
  },
  {
    name: 'Well',
    category: 'Surfaces',
    description: 'The same shape pressed into the page. Holds things rather than presenting them: inputs, specimens, tracks, grids.',
    file: 'Well.css',
    cssClass: true,
    usage: `<div class="well">…</div>`,
  },
  {
    name: 'FrameTab',
    category: 'Surfaces',
    description: 'The selected rail item, cut from the frame surface with concave fillets, so rail and content read as one piece.',
    file: 'FrameTab.vue',
    props: [
      { name: 'items', type: 'string[]', description: 'Rail destinations.' },
      { name: 'active', type: 'number', description: 'The single selected index.' },
    ],
    slots: ['default'],
    usage: `<FrameTab :items="['Projects', 'Results', 'Issues']" :active="1">The frame</FrameTab>`,
  },

  // ─── Actions ───────────────────────────────────────────────────────────
  {
    name: 'AdsButton',
    category: 'Actions',
    description: 'Three weights: accent for the one action the screen exists to produce, default for everything else, quiet for actions that should not compete.',
    file: 'AdsButton.vue',
    props: [
      { name: 'variant', type: "'default' | 'accent' | 'quiet'", default: 'default' },
      { name: 'size', type: "'sm' | 'md'", default: 'md' },
      { name: 'icon', type: 'string', description: 'Glyph name from utils/glyphs.' },
      { name: 'loading', type: 'boolean', default: 'false' },
      { name: 'disabled', type: 'boolean', default: 'false' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: 'button' },
    ],
    slots: ['default'],
    usage: `<AdsButton variant="accent" icon="arrow">Start a project</AdsButton>`,
  },
  {
    name: 'AdsIconButton',
    category: 'Actions',
    description: 'A tile-shaped target for an action whose glyph is unambiguous. Always carries an accessible name.',
    file: 'AdsIconButton.vue',
    props: [
      { name: 'icon', type: 'string' },
      { name: 'label', type: 'string', description: 'Accessible name (required).' },
      { name: 'round', type: 'boolean', default: 'false' },
      { name: 'accent', type: 'boolean', default: 'false' },
    ],
    usage: `<AdsIconButton icon="mail" label="Email" />`,
  },
  {
    name: 'AdsSegmented',
    category: 'Actions',
    description: 'A small set of mutually exclusive views, all visible at once.',
    file: 'AdsSegmented.vue',
    props: [
      { name: 'modelValue', type: 'string | number' },
      { name: 'options', type: '{ label, value }[]' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsSegmented v-model="range" :options="[{ label: '7d', value: '7d' }]" />`,
  },
  {
    name: 'AdsMenu',
    category: 'Actions',
    description: 'Row actions and overflow. Everything a reader can do to one record, in one place.',
    file: 'AdsMenu.vue',
    props: [{ name: 'items', type: '{ label, icon?, shortcut?, action? }[]', description: "Use label '---' for a divider." }],
    usage: `<AdsMenu :items="[{ label: 'Duplicate', icon: 'layers' }]" />`,
  },
  {
    name: 'Link',
    category: 'Actions',
    description: 'Navigation inside prose. Underlined, because in a system with no spare colour the underline is the only signal.',
    file: 'Link.css',
    cssClass: true,
    usage: `<a class="ads-link" href="#">what to fix first</a>`,
  },
  {
    name: 'AdsThemeToggle',
    category: 'Actions',
    description: 'Light/dark switch, wired to useTheme().',
    file: 'AdsThemeToggle.vue',
    usage: `<AdsThemeToggle />`,
  },

  // ─── Inputs ────────────────────────────────────────────────────────────
  {
    name: 'AdsField',
    category: 'Inputs',
    description: 'A labelled text input, textarea, select or search. Label above, hint below, error replacing the hint.',
    file: 'AdsField.vue',
    props: [
      { name: 'label', type: 'string' },
      { name: 'modelValue', type: 'string | number' },
      { name: 'type', type: "'text' | 'email' | 'password' | 'tel' | 'number' | 'search' | 'date' | 'textarea' | 'select'", default: 'text' },
      { name: 'hint', type: 'string' },
      { name: 'error', type: 'string', description: 'Shows the error state and message.' },
      { name: 'options', type: '{ label, value }[]', description: 'For select.' },
      { name: 'placeholder', type: 'string' },
      { name: 'required', type: 'boolean', default: 'false' },
      { name: 'disabled', type: 'boolean', default: 'false' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsField v-model="email" label="Email" type="email" hint="We never share it." />`,
  },
  {
    name: 'AdsNumber',
    category: 'Inputs',
    description: 'A figure with steppers, right-aligned and monospaced so it lines up with the values it will be compared against.',
    file: 'AdsNumber.vue',
    props: [
      { name: 'modelValue', type: 'number' },
      { name: 'min', type: 'number', default: '0' },
      { name: 'max', type: 'number', default: 'Infinity' },
      { name: 'step', type: 'number', default: '1' },
      { name: 'label', type: 'string' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsNumber v-model="count" :min="0" :max="10" label="Count" />`,
  },
  {
    name: 'AdsDaterange',
    category: 'Inputs',
    description: 'The most-used control on any dashboard. ISO dates in the data face, presets beside them.',
    file: 'AdsDaterange.vue',
    props: [
      { name: 'from', type: 'string', default: 'ISO date' },
      { name: 'to', type: 'string', default: 'ISO date' },
      { name: 'presets', type: 'string[]', default: "['7d', '30d', '90d', 'Custom']" },
      { name: 'modelValue', type: 'string' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsDaterange v-model="range" from="2026-09-25" to="2026-10-25" />`,
  },
  {
    name: 'AdsChoice',
    category: 'Inputs',
    description: 'Three shapes for three meanings: many-of (checkbox), one-of (radio), and a setting that takes effect the moment it is flipped (switch).',
    file: 'AdsChoice.vue',
    props: [
      { name: 'kind', type: "'checkbox' | 'radio' | 'switch'", default: 'checkbox' },
      { name: 'label', type: 'string' },
      { name: 'modelValue', type: 'boolean', default: 'false' },
      { name: 'name', type: 'string', description: 'For radio groups.' },
      { name: 'value', type: 'string | number', description: 'For radio groups.' },
    ],
    slots: ['default'],
    emits: ['update:modelValue'],
    usage: `<AdsChoice v-model="agree" kind="checkbox">I agree</AdsChoice>`,
  },
  {
    name: 'AdsRange',
    category: 'Inputs',
    description: 'A continuous value where the approximate position matters more than the exact figure.',
    file: 'AdsRange.vue',
    props: [
      { name: 'modelValue', type: 'number' },
      { name: 'min', type: 'number', default: '0' },
      { name: 'max', type: 'number', default: '100' },
      { name: 'step', type: 'number', default: '1' },
      { name: 'label', type: 'string' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsRange v-model="volume" :min="0" :max="100" label="Volume" />`,
  },
  {
    name: 'AdsTag',
    category: 'Inputs',
    description: 'A filter the reader applied and can take off again. Distinct from a status chip, which cannot be removed.',
    file: 'AdsTag.vue',
    props: [
      { name: 'label', type: 'string' },
      { name: 'removable', type: 'boolean', default: 'true' },
    ],
    emits: ['remove'],
    usage: `<AdsTag label="status: 4xx" @remove="…" />`,
  },

  // ─── Data display ──────────────────────────────────────────────────────
  {
    name: 'AdsStat',
    category: 'Data display',
    description: 'A figure, its direction of travel, and its standing. A number without a comparison is trivia.',
    file: 'AdsStat.vue',
    props: [
      { name: 'value', type: 'string | number' },
      { name: 'label', type: 'string' },
      { name: 'unit', type: 'string' },
      { name: 'note', type: 'string' },
    ],
    usage: `<AdsStat value="1,284" label="URLs crawled" note="+37 this run" />`,
  },
  {
    name: 'AdsDelta',
    category: 'Data display',
    description: 'A change against the previous period. The direction glyph is mandatory.',
    file: 'AdsDelta.vue',
    props: [
      { name: 'direction', type: "'up' | 'down' | 'flat'", default: 'flat' },
      { name: 'value', type: 'string' },
    ],
    usage: `<AdsDelta direction="up" value="12.4%" />`,
  },
  {
    name: 'AdsBadge',
    category: 'Data display',
    description: 'A count or code pill. Accent is the one number that matters; quiet sits in the chrome.',
    file: 'AdsBadge.vue',
    props: [
      { name: 'value', type: 'string | number' },
      { name: 'quiet', type: 'boolean', default: 'false' },
    ],
    usage: `<AdsBadge :value="5" />`,
  },
  {
    name: 'AdsStatus',
    category: 'Data display',
    description: 'Severity in a monochrome system is luminance: the worse it is, the brighter it is. Always carries a glyph (dot).',
    file: 'AdsStatus.vue',
    props: [
      { name: 'label', type: 'string' },
      { name: 'grade', type: '1 | 2 | 3 | 4', default: '1' },
    ],
    usage: `<AdsStatus label="Critical" :grade="4" />`,
  },
  {
    name: 'AdsMeter',
    category: 'Data display',
    description: 'A quantity against a threshold. The threshold mark is what makes the fill meaningful.',
    file: 'AdsMeter.vue',
    props: [
      { name: 'value', type: 'number' },
      { name: 'max', type: 'number', default: '100' },
      { name: 'threshold', type: 'number', description: 'Draws the mark.' },
      { name: 'label', type: 'string' },
    ],
    usage: `<AdsMeter :value="68" :max="100" :threshold="80" label="Budget used" />`,
  },
  {
    name: 'AdsProgress',
    category: 'Data display',
    description: 'A task moving toward completion. Distinct from a meter (a quantity against a threshold).',
    file: 'AdsProgress.vue',
    props: [
      { name: 'value', type: 'number' },
      { name: 'max', type: 'number', default: '100' },
    ],
    usage: `<AdsProgress :value="46" :max="100" />`,
  },
  {
    name: 'ChartChoice',
    category: 'Data display',
    description: 'The decision before the component: pick the chart form from the job, not from a gallery.',
    file: 'ChartChoice.vue',
    props: [{ name: 'rows', type: '[job, form, decides][]', default: '8 rows' }],
    usage: `<ChartChoice />`,
  },
  {
    name: 'AdsBars',
    category: 'Data display',
    description: 'A bar chart where value maps to luminance as well as height.',
    file: 'AdsBars.vue',
    props: [{ name: 'data', type: '{ label, value }[]' }],
    usage: `<AdsBars :data="[{ label: 'Mon', value: 42 }]" />`,
  },
  {
    name: 'AdsSparkline',
    category: 'Data display',
    description: 'A sparkline with an inspection crosshair — point or drag to read values.',
    file: 'AdsSparkline.vue',
    props: [
      { name: 'points', type: 'number[]' },
      { name: 'fill', type: 'boolean', default: 'true' },
      { name: 'unit', type: 'string' },
      { name: 'label', type: '(i: number) => string' },
    ],
    usage: `<AdsSparkline :points="[12, 19, 15, 24]" unit="k" />`,
  },
  {
    name: 'AdsGauge',
    category: 'Data display',
    description: 'A dial for a changing rate — the eye reads the needle before the digits.',
    file: 'AdsGauge.vue',
    props: [
      { name: 'value', type: 'number' },
      { name: 'max', type: 'number', default: '100' },
      { name: 'label', type: 'string' },
      { name: 'unit', type: 'string' },
    ],
    usage: `<AdsGauge :value="68" :max="100" label="coverage" unit="%" />`,
  },
  {
    name: 'AdsHeatmap',
    category: 'Data display',
    description: 'A density grid. Value maps to opacity — the channel a monochrome palette has left.',
    file: 'AdsHeatmap.vue',
    props: [
      { name: 'cols', type: 'number', default: '24' },
      { name: 'rows', type: 'number', default: '7' },
    ],
    usage: `<AdsHeatmap :cols="16" :rows="5" />`,
  },
  {
    name: 'AdsDataGrid',
    category: 'Data display',
    description: 'The workhorse table: sortable headers, a keyboard cursor, rows separated by a whisper, figures monospaced.',
    file: 'AdsDataGrid.vue',
    props: [
      { name: 'columns', type: '{ key, label, align?, mono?, grade? }[]' },
      { name: 'rows', type: 'Record<string, string | number>[]' },
      { name: 'caption', type: 'string' },
    ],
    usage: `<AdsDataGrid :columns="columns" :rows="rows" caption="Results" />`,
  },
  {
    name: 'AdsDl',
    category: 'Data display',
    description: 'Key-value detail — what a selected row almost always needs. A grid, not a table, so values wrap.',
    file: 'AdsDl.vue',
    props: [{ name: 'items', type: '{ term, value }[]' }],
    usage: `<AdsDl :items="[{ term: 'Status', value: '200 · indexable' }]" />`,
  },

  // ─── Disclosure ────────────────────────────────────────────────────────
  {
    name: 'AdsAccordion',
    category: 'Disclosure',
    description: 'The simplest disclosure. Native details/summary, so it works before JS and is announced correctly.',
    file: 'AdsAccordion.vue',
    props: [{ name: 'items', type: '{ title, body }[]' }],
    usage: `<AdsAccordion :items="[{ title: 'Why this page ranks eighth', body: '…' }]" />`,
  },
  {
    name: 'AdsDrawer',
    category: 'Disclosure',
    description: 'A right-hand panel where the selected row explains itself. The table never leaves the screen.',
    file: 'AdsDrawer.vue',
    slots: ['default', 'panel'],
    usage: `<AdsDrawer>\n  <AdsDataGrid :columns="columns" :rows="rows" />\n  <template #panel><AdsDl :items="detail" /></template>\n</AdsDrawer>`,
  },
  {
    name: 'AdsPopover',
    category: 'Disclosure',
    description: 'A little extra context anchored to what prompted it. More than a tooltip, less than a drawer.',
    file: 'AdsPopover.vue',
    props: [
      { name: 'label', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'link', type: '{ label, to? }' },
    ],
    slots: ['default'],
    usage: `<AdsPopover label="Link score" body="A 0–100 measure." />`,
  },
  {
    name: 'AdsTree',
    category: 'Disclosure',
    description: 'Real nesting — site structure, a category hierarchy, a file system. Built on nested lists.',
    file: 'AdsTree.vue',
    props: [{ name: 'nodes', type: '{ label, count?, children? }[]' }],
    usage: `<AdsTree :nodes="[{ label: '/', children: [{ label: 'blog', count: 842 }] }]" />`,
  },
  {
    name: 'AdsSteps',
    category: 'Disclosure',
    description: 'Where you are in a sequence with a known end. Counts discrete stages, not percentage.',
    file: 'AdsSteps.vue',
    props: [{ name: 'steps', type: "{ label, state?: 'done' | 'now' | 'todo' }[]" }],
    usage: `<AdsSteps :steps="[{ label: 'Configure', state: 'done' }]" />`,
  },

  // ─── Navigation ────────────────────────────────────────────────────────
  {
    name: 'AdsTabs',
    category: 'Navigation',
    description: 'Views of one dataset. The underline is the accent\u2019s only appearance in a nav context.',
    file: 'AdsTabs.vue',
    props: [
      { name: 'modelValue', type: 'string | number' },
      { name: 'tabs', type: '{ label, value }[]' },
    ],
    emits: ['update:modelValue'],
    usage: `<AdsTabs v-model="tab" :tabs="[{ label: 'Internal', value: 'internal' }]" />`,
  },
  {
    name: 'AdsCrumbs',
    category: 'Navigation',
    description: 'Where you are. Monospaced, because breadcrumbs are mostly paths.',
    file: 'AdsCrumbs.vue',
    props: [{ name: 'items', type: '{ label, to? }[]' }],
    usage: `<AdsCrumbs :items="[{ label: 'Projects', to: '/' }, { label: 'Results' }]" />`,
  },
  {
    name: 'AdsPager',
    category: 'Navigation',
    description: 'Which slice you are looking at. Monospaced, with the current page on the accent.',
    file: 'AdsPager.vue',
    props: [
      { name: 'page', type: 'number', default: '1' },
      { name: 'pages', type: 'number', default: '1' },
    ],
    emits: ['change'],
    usage: `<AdsPager :page="2" :pages="5" @change="page = $event" />`,
  },

  // ─── Feedback ──────────────────────────────────────────────────────────
  {
    name: 'AdsEmpty',
    category: 'Feedback',
    description: 'The first screen every new user sees. It should teach: what appears here, why it is empty, and the one action that fixes it.',
    file: 'AdsEmpty.vue',
    props: [
      { name: 'icon', type: 'string', default: 'discovery' },
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
    ],
    slots: ['default'],
    usage: `<AdsEmpty icon="chart" title="No crawls yet" body="…"><AdsButton variant="accent">New crawl</AdsButton></AdsEmpty>`,
  },
  {
    name: 'AdsSkeleton',
    category: 'Feedback',
    description: 'Holds the layout at the real content\u2019s dimensions, so nothing shifts when data lands.',
    file: 'AdsSkeleton.vue',
    props: [
      { name: 'width', type: 'string', default: '100%' },
      { name: 'height', type: 'string', default: '1em' },
      { name: 'pill', type: 'boolean', default: 'false' },
    ],
    usage: `<AdsSkeleton width="100%" height="16px" />`,
  },
  {
    name: 'AdsLoading',
    category: 'Feedback',
    description: 'For the cases a skeleton cannot cover: an action in flight, or a panel whose shape is not known yet.',
    file: 'AdsLoading.vue',
    props: [{ name: 'text', type: 'string' }],
    slots: ['default'],
    usage: `<AdsLoading text="Recrawling 311 URLs…" />`,
  },
  {
    name: 'AdsBanner',
    category: 'Feedback',
    description: 'A callout for a condition that persists, with a glyph and an accent edge.',
    file: 'AdsBanner.vue',
    props: [
      { name: 'text', type: 'string' },
      { name: 'icon', type: 'string', default: 'alert' },
    ],
    slots: ['actions'],
    usage: `<AdsBanner icon="alert" text="This crawl is 14 days old." />`,
  },
  {
    name: 'AdsToastHost',
    category: 'Feedback',
    description: 'Mount once, then call useToast().push() from anywhere. Toasts stack and leave on their own.',
    file: 'AdsToastHost.vue',
    usage: `<AdsToastHost />\n// anywhere\nconst toast = useToast()\ntoast.push('Saved', 'check')`,
  },
  {
    name: 'AdsTooltip',
    category: 'Feedback',
    description: 'A bubble on hover/focus that answers a question only if asked.',
    file: 'AdsTooltip.vue',
    props: [
      { name: 'text', type: 'string' },
      { name: 'position', type: "'top' | 'bottom'", default: 'top' },
    ],
    slots: ['default'],
    usage: `<AdsTooltip text="Copies to clipboard"><AdsIconButton icon="code" label="Copy" /></AdsTooltip>`,
  },
  {
    name: 'AdsModal',
    category: 'Feedback',
    description: 'Blocks everything until answered. Reserved for the few moments that cannot proceed without a decision. Never put the accent on a destructive action.',
    file: 'AdsModal.vue',
    props: [
      { name: 'open', type: 'boolean (v-model)', default: 'false' },
      { name: 'title', type: 'string' },
      { name: 'width', type: 'string', description: 'CSS max-width override.' },
    ],
    slots: ['default', 'close'],
    usage: `<AdsModal v-model="open" title="Delete this project?">…</AdsModal>`,
  },

  // ─── Patterns ──────────────────────────────────────────────────────────
  {
    name: 'KpiRow',
    category: 'Patterns',
    description: 'The top of nearly every dashboard. Four figures at most, ranked left to right.',
    file: 'KpiRow.vue',
    props: [
      { name: 'stats', type: '{ value, label, unit?, note? }[]' },
      { name: 'columns', type: '2 | 3 | 4', default: '4' },
    ],
    usage: `<KpiRow :stats="[{ value: '1,284', label: 'URLs', note: '+37' }]" />`,
  },
  {
    name: 'FilterBar',
    category: 'Patterns',
    description: 'One row, above the data, holding every control that changes what is shown. Saved views turn filters into a named thing a team can share.',
    file: 'FilterBar.vue',
    props: [
      { name: 'placeholder', type: 'string', default: 'Filter by URL…' },
      { name: 'tags', type: 'string[]' },
      { name: 'segments', type: 'string[]' },
      { name: 'segment', type: 'string' },
      { name: 'from', type: 'string', default: '30d' },
      { name: 'to', type: 'string', default: 'now' },
    ],
    emits: ['update:segment', 'remove-tag', 'save'],
    usage: `<FilterBar :tags="['Exec summary']" :segments="['All', '2xx', '4xx']" />`,
  },
  {
    name: 'TableScreen',
    category: 'Patterns',
    description: 'Header, tabs, filter bar, grid, pagination. The arrangement that carries most of the working hours in any data product.',
    file: 'TableScreen.vue',
    props: [
      { name: 'title', type: 'string' },
      { name: 'count', type: 'string' },
      { name: 'actionLabel', type: 'string', default: 'Export CSV' },
      { name: 'tabs', type: 'string[]' },
      { name: 'tab', type: 'string' },
      { name: 'columns', type: '{ key, label, align?, mono?, grade? }[]' },
      { name: 'rows', type: 'Record<string, string | number>[]' },
    ],
    slots: ['filters', 'footer'],
    emits: ['update:tab', 'action'],
    usage: `<TableScreen title="Results" count="733 rows" :tabs="['Internal', 'External']" :columns="columns" :rows="rows" />`,
  },
  {
    name: 'SummaryDetail',
    category: 'Patterns',
    description: 'The pattern the whole system is arranged around: a ranked answer at the top, the reasoning one level down, the raw rows two levels down.',
    file: 'SummaryDetail.vue',
    props: [{ name: 'rungs', type: '{ title, body }[]', default: 'Answer / Reasoning / Evidence' }],
    usage: `<SummaryDetail />`,
  },

  // ─── Docs ──────────────────────────────────────────────────────────────
  {
    name: 'DocShell',
    category: 'Docs',
    description: 'A documentation layout: a sticky sidebar of sections and a reading column.',
    file: 'DocShell.vue',
    slots: ['aside', 'default'],
    usage: `<DocShell>\n  <template #aside><DocNav :groups="groups" /></template>\n  <ContentDoc />\n</DocShell>`,
  },
  {
    name: 'DocNav',
    category: 'Docs',
    description: 'A help-centre sidebar, pages grouped by section. Prop-driven, so it works with Nuxt Content or a plain array.',
    file: 'DocNav.vue',
    props: [
      { name: 'groups', type: '{ section, pages: { title, path }[] }[]' },
      { name: 'home', type: '{ to, label }' },
    ],
    usage: `<DocNav :groups="[{ section: 'Getting started', pages: [{ title: 'Installing', path: '/docs/installing' }] }]" />`,
  },
  {
    name: 'Callout',
    category: 'Docs',
    description: 'A docs callout. The edge and label carry the tone, and every tone carries a glyph.',
    file: 'Callout.vue',
    props: [{ name: 'type', type: "'note' | 'tip' | 'warning'", default: 'note' }],
    slots: ['default'],
    usage: `<Callout type="warning">This changes how results are read.</Callout>`,
  },
  {
    name: 'AppWindow',
    category: 'Docs',
    description: 'A screenshot in a soft window frame. The first traffic dot carries the accent.',
    file: 'AppWindow.vue',
    props: [
      { name: 'src', type: 'string' },
      { name: 'alt', type: 'string' },
      { name: 'width', type: 'number', default: '1440' },
      { name: 'height', type: 'number', default: '900' },
      { name: 'eager', type: 'boolean', default: 'false' },
    ],
    usage: `<AppWindow src="/shot.png" alt="The results table" />`,
  },
  {
    name: 'Screenshot',
    category: 'Docs',
    description: 'A screenshot figure: the window frame plus an optional caption.',
    file: 'Screenshot.vue',
    props: [
      { name: 'src', type: 'string' },
      { name: 'alt', type: 'string' },
      { name: 'caption', type: 'string' },
    ],
    usage: `<Screenshot src="/shot.png" alt="The results table" caption="The results table." />`,
  },

  // ─── Page sections ─────────────────────────────────────────────────────
  {
    name: 'SiteNav',
    category: 'Page sections',
    description: 'Sticky navigation: brand, links, one accent CTA and the theme switch. Collapses to a burger on a phone.',
    file: 'SiteNav.vue',
    props: [
      { name: 'links', type: '{ to, label }[]' },
      { name: 'ctaTo', type: 'string', default: '/contact' },
      { name: 'ctaLabel', type: 'string', default: 'Start a project' },
    ],
    usage: `<SiteNav :links="[{ to: '/', label: 'Overview' }]" cta-to="/contact" cta-label="Start a project" />`,
  },
  {
    name: 'SiteFooter',
    category: 'Page sections',
    description: 'Brand, link columns and a legal bar with back-to-top.',
    file: 'SiteFooter.vue',
    props: [
      { name: 'description', type: 'string' },
      { name: 'columns', type: '{ title, links: { to, label }[] }[]' },
    ],
    usage: `<SiteFooter :columns="[{ title: 'Product', links: [{ to: '/', label: 'Docs' }] }]" />`,
  },
  {
    name: 'HeroSection',
    category: 'Page sections',
    description: 'A big display headline over an optional visual. Actions and visual are slots.',
    file: 'HeroSection.vue',
    props: [
      { name: 'eyebrow', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'lead', type: 'string' },
      { name: 'align', type: "'center' | 'left'", default: 'center' },
    ],
    slots: ['actions', 'visual'],
    usage: `<HeroSection eyebrow="Studio" title="The dashboard your users live in" lead="…"><template #actions>…</template></HeroSection>`,
  },
  {
    name: 'ContentSection',
    category: 'Page sections',
    description: 'A titled block — eyebrow, headline, lede — with any body in the default slot.',
    file: 'ContentSection.vue',
    props: [
      { name: 'eyebrow', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'lead', type: 'string' },
      { name: 'align', type: "'center' | 'left'", default: 'left' },
    ],
    slots: ['default'],
    usage: `<ContentSection eyebrow="Why" title="A system, not a style guide"><FeatureGrid :features="features" /></ContentSection>`,
  },
  {
    name: 'ImageSection',
    category: 'Page sections',
    description: 'Copy on one side, a soft-framed visual on the other. `flip` swaps them.',
    file: 'ImageSection.vue',
    props: [
      { name: 'eyebrow', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'flip', type: 'boolean', default: 'false' },
    ],
    slots: ['actions', 'default'],
    usage: `<ImageSection eyebrow="Soft UI" title="Depth is the only decoration" body="…" flip><AdsGauge :value="64" label="Scroll" unit="%" /></ImageSection>`,
  },
  {
    name: 'FeatureGrid',
    category: 'Page sections',
    description: 'A responsive grid of feature cards — glyph, title, line of body.',
    file: 'FeatureGrid.vue',
    props: [
      { name: 'features', type: '{ icon, title, body }[]' },
      { name: 'columns', type: '2 | 3 | 4', default: '3' },
    ],
    usage: `<FeatureGrid :features="[{ icon: 'gauge', title: 'Grey chrome', body: '…' }]" :columns="3" />`,
  },
  {
    name: 'LogoMarquee',
    category: 'Page sections',
    description: 'A quiet row of wordmarks, kept monochrome so they never compete with data.',
    file: 'LogoMarquee.vue',
    props: [{ name: 'names', type: 'string[]' }],
    usage: `<LogoMarquee :names="['Northwind', 'Vantage', 'Halo']" />`,
  },
  {
    name: 'PricingSection',
    category: 'Page sections',
    description: 'Pricing cards. The featured plan earns the one accent.',
    file: 'PricingSection.vue',
    props: [{ name: 'plans', type: '{ name, price, period?, description, features[], cta, featured? }[]' }],
    emits: ['select'],
    usage: `<PricingSection :plans="plans" @select="onSelect" />`,
  },
  {
    name: 'FaqSection',
    category: 'Page sections',
    description: 'Frequently asked questions on an accordion.',
    file: 'FaqSection.vue',
    props: [{ name: 'faqs', type: '{ title, body }[]' }],
    usage: `<FaqSection :faqs="[{ title: 'Why grey?', body: '…' }]" />`,
  },
  {
    name: 'CtaBand',
    category: 'Page sections',
    description: 'The closing call to action — one raised card, one accent button.',
    file: 'CtaBand.vue',
    props: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'ctaLabel', type: 'string', default: 'Start a project' },
      { name: 'ctaTo', type: 'string', default: '/contact' },
      { name: 'secondaryLabel', type: 'string' },
      { name: 'secondaryTo', type: 'string' },
    ],
    usage: `<CtaBand title="Build the dashboard your users live in" cta-to="/contact" />`,
  },
  {
    name: 'ContactForm',
    category: 'Page sections',
    description: 'A full contact form (name, email, phone, message, consent) with a toast on submit.',
    file: 'ContactForm.vue',
    usage: `<ContactForm />`,
  },

  // ─── Primitives ────────────────────────────────────────────────────────
  {
    name: 'BrandMark',
    category: 'Primitives',
    description: 'The Artelier mark: a raised tile with the value dot, and the wordmark.',
    file: 'BrandMark.vue',
    props: [{ name: 'wordmark', type: 'boolean', default: 'true' }],
    usage: `<BrandMark />`,
  },
  {
    name: 'Icon',
    category: 'Primitives',
    description: 'Inline SVG glyph on a 24px grid, 1.6 stroke, round caps. Names live in utils/glyphs.ts.',
    file: 'Icon.vue',
    props: [
      { name: 'name', type: 'string', description: 'One of: grid, alert, layers, sliders, chart, flow, compass, mail, arrow, chevrons, check, plus, code, spark, dashboard, signal, growth, gauge, discovery, blueprint, system, prototype, handoff, table, audit, access, theme, engine' },
      { name: 'size', type: 'number', default: '20' },
    ],
    usage: `<Icon name="chart" :size="20" />`,
  },
]

export function findComponent(name: string) {
  return components.find((c) => c.name.toLowerCase() === name.toLowerCase())
}

export function listComponents(category?: string) {
  if (!category) return components
  return components.filter((c) => c.category.toLowerCase() === category.toLowerCase())
}

// What cannot be derived from the source: which documentation category each
// component belongs to, a short description where the header comment is too
// long to scan, and the three surfaces that are CSS classes rather than
// components. Everything else (props, emits, slots, models, types, examples)
// is read from the SFCs, the Rust crate and the docs pages at runtime.
//
// When you add a component, add one line to `categoryOf`. The server reports
// any component that has no category.

export const categories = [
  'Surfaces',
  'Actions',
  'Inputs',
  'Data display',
  'Disclosure',
  'Navigation',
  'Feedback',
  'Patterns',
  'Elements',
  'Page sections',
  'Docs',
  'Site chrome',
] as const

export type Category = (typeof categories)[number]

export const categoryNotes: Record<Category, string> = {
  Surfaces: 'Card, well and frame tab: the shapes everything else sits on.',
  Actions: 'Buttons, menus, segmented controls. One accent action per screen.',
  Inputs: 'Fields and controls. Inputs are wells; every field has a visible label.',
  'Data display': 'Figures, deltas, meters, charts and the data grid.',
  Disclosure: 'Accordion, drawer, popover, tree, steps.',
  Navigation: 'Tabs (filtered views of one table), crumbs, pager.',
  Feedback: 'Empty states, skeletons, loading, banners, toasts, tooltips, modals.',
  Patterns: 'Dashboard arrangements: KPI row, filter bar, table screen, summary to detail.',
  Elements: 'The wider set of atoms: dialogs, pickers, selects, menus, chat, typography.',
  'Page sections': 'Marketing-page sections: nav, hero, features, pricing, footer.',
  Docs: 'Help-centre building blocks: doc shell, nav, callout, app window, screenshot.',
  'Site chrome': "The studio site's own furniture: shell, palette, mark, wordmark. Usable, but specific.",
}

export const categoryOf: Record<string, Category> = {
  FrameTab: 'Surfaces',

  AdsButton: 'Actions',
  AdsIconButton: 'Actions',
  AdsSegmented: 'Actions',
  AdsMenu: 'Actions',
  AdsThemeToggle: 'Actions',

  AdsField: 'Inputs',
  AdsNumber: 'Inputs',
  AdsDaterange: 'Inputs',
  AdsChoice: 'Inputs',
  AdsRange: 'Inputs',
  AdsTag: 'Inputs',

  AdsStat: 'Data display',
  CountUp: 'Data display',
  AdsDelta: 'Data display',
  AdsBadge: 'Data display',
  AdsStatus: 'Data display',
  AdsMeter: 'Data display',
  AdsProgress: 'Data display',
  ChartChoice: 'Data display',
  AdsSparkline: 'Data display',
  AdsBars: 'Data display',
  AdsGauge: 'Data display',
  AdsHeatmap: 'Data display',
  AdsDl: 'Data display',
  AdsDataGrid: 'Data display',

  AdsAccordion: 'Disclosure',
  AdsDrawer: 'Disclosure',
  AdsPopover: 'Disclosure',
  AdsTree: 'Disclosure',
  AdsSteps: 'Disclosure',

  AdsTabs: 'Navigation',
  AdsCrumbs: 'Navigation',
  AdsPager: 'Navigation',

  AdsEmpty: 'Feedback',
  AdsSkeleton: 'Feedback',
  AdsLoading: 'Feedback',
  AdsBanner: 'Feedback',
  AdsToastHost: 'Feedback',
  AdsModal: 'Feedback',
  AdsTooltip: 'Feedback',

  KpiRow: 'Patterns',
  FilterBar: 'Patterns',
  TableScreen: 'Patterns',
  DashEmpty: 'Patterns',
  SummaryDetail: 'Patterns',
  GanttChart: 'Patterns',

  AdsToggle: 'Elements',
  AdsToggleGroup: 'Elements',
  AdsAvatar: 'Elements',
  AdsSeparator: 'Elements',
  AdsCollapsible: 'Elements',
  AdsDatePicker: 'Elements',
  AdsLineChart: 'Elements',
  AdsAlertDialog: 'Elements',
  AdsTypography: 'Elements',
  AdsAspectRatio: 'Elements',
  AdsLabel: 'Elements',
  AdsKbd: 'Elements',
  AdsCodeBlock: 'Elements',
  AdsMarker: 'Elements',
  AdsDirection: 'Elements',
  AdsItem: 'Elements',
  AdsBubble: 'Elements',
  AdsInputGroup: 'Elements',
  AdsInputOtp: 'Elements',
  AdsNativeSelect: 'Elements',
  AdsSelect: 'Elements',
  AdsCombobox: 'Elements',
  AdsAttachment: 'Elements',
  AdsHoverCard: 'Elements',
  AdsSheet: 'Elements',
  AdsContextMenu: 'Elements',
  AdsMenubar: 'Elements',
  AdsNavMenu: 'Elements',
  AdsCalendar: 'Elements',
  AdsCarousel: 'Elements',
  AdsTrace: 'Elements',
  AdsQuestionnaire: 'Elements',
  AdsResizable: 'Elements',
  AdsScrollArea: 'Elements',
  AdsSpinner: 'Elements',
  AdsMessage: 'Elements',
  AdsMessageScroller: 'Elements',
  Icon: 'Elements',

  SiteNav: 'Page sections',
  SiteFooter: 'Page sections',
  HeroSection: 'Page sections',
  ContentSection: 'Page sections',
  ImageSection: 'Page sections',
  FeatureGrid: 'Page sections',
  LogoMarquee: 'Page sections',
  Marquee: 'Page sections',
  PricingSection: 'Page sections',
  FaqSection: 'Page sections',
  CtaBand: 'Page sections',
  ContactForm: 'Page sections',
  ScreenTour: 'Page sections',
  StatementSection: 'Page sections',
  StorySection: 'Page sections',
  WorkList: 'Page sections',
  WorkSection: 'Page sections',

  DocShell: 'Docs',
  DocNav: 'Docs',
  Callout: 'Docs',
  AppWindow: 'Docs',
  Screenshot: 'Docs',

  DashShell: 'Site chrome',
  MobileNav: 'Site chrome',
  CommandPalette: 'Site chrome',
  PalettePanel: 'Site chrome',
  ThemeLab: 'Site chrome',
  BrandMark: 'Site chrome',
  Wordmark: 'Site chrome',
  ProjectLogo: 'Site chrome',
  BlogMeta: 'Site chrome',
  LocalTime: 'Site chrome',
  RevealHeading: 'Site chrome',
}

/**
 * Short descriptions, only where the docs page has none and the header comment
 * is too long (or too short) to scan. These win over the docs description,
 * which wins over the header's first paragraph.
 */
export const curatedDescriptions: Record<string, string> = {
  AdsThemeToggle: 'The light/dark switch: one glyph that morphs between sun and crescent. Icon-only, so it carries its own accessible name.',
  BrandMark: 'The Artelier mark, one filled path in currentColor. Identity only: it follows the theme like text.',
  DashShell: 'The application window: a collapsible rail on the left and the page on a raised frame beside it.',
  CommandPalette: 'The command palette (Cmd/Ctrl+K): every section, page and frequent action behind one filtering field.',
  Wordmark: 'The studio name set small in the display face. Beside BrandMark, the mark is the logo and this only spells it out.',
  ThemeLab: 'A live editor for the theme tokens, for exploring the system rather than for product screens.',
}

/** The surfaces that are CSS classes, not components. */
export type CssClassEntry = { name: string; className: string; category: Category; description: string; usage: string }

export const cssClasses: CssClassEntry[] = [
  {
    name: 'Card',
    className: 'card',
    category: 'Surfaces',
    description: 'A block of content standing proud of the page. Nest a well inside a card, not a second card.',
    usage: '<div class="card">…</div>',
  },
  {
    name: 'Well',
    className: 'well',
    category: 'Surfaces',
    description: 'The same shape pressed into the page. Holds things rather than presenting them: inputs, specimens, tracks, grids.',
    usage: '<div class="well">…</div>',
  },
  {
    name: 'Link',
    className: 'ads-link',
    category: 'Actions',
    description: 'Navigation inside prose. Underlined: with no spare colour in the chrome, the underline is the signal.',
    usage: '<a class="ads-link" href="/plan">what to fix first</a>',
  },
]

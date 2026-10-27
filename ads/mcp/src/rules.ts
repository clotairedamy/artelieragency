// The Artelier design rules, compressed for a model to read before it writes a
// screen. Distilled from the kit's spec and the rules page; the tokens and
// classes they name are checked against the CSS by `get_design_rules`.

export type RuleSection = { title: string; rules: string[] }

export const designRules: RuleSection[] = [
  {
    title: 'Colour',
    rules: [
      'The chrome is grey so the data can be coloured. Interface = greyscale; hue only inside a plot area.',
      'Brand colours (--brand-primary, --brand-secondary) only on the mark and identity moments; never a surface, toolbar, button or selection fill.',
      'No arbitrary colour props. Use the closed sets the components offer (tone ok/warn/bad, grade 1-4).',
    ],
  },
  {
    title: 'Depth',
    rules: [
      'Depth is the only decoration. No borders round boxes, no accent stripes, no gradients. Shape comes from the shadow tokens (--soft-raised*, --soft-inset*) on a surface the same colour as its parent.',
      'A 1px var(--line) hairline between rows of a list or table is allowed; box outlines are not.',
      'Cards and buttons are raised (.card, .btn); inputs and tracks are wells (.well). Nest a well in a card, never a card in a card.',
    ],
  },
  {
    title: 'Accent',
    rules: [
      'The accent is white in dark mode, near-black in light (--accent, --accent-ink).',
      'Exactly one accent action per screen.',
      'Never put the accent on a destructive action. Destructive = default style + a confirm whose button says the verb ("Delete project", never "OK").',
    ],
  },
  {
    title: 'Numbers',
    rules: [
      'Every figure is monospaced: .num, or font-family: var(--mono) with tabular-nums. Counts, dates, durations, codes, prices, percentages, times.',
      'In tables numbers are right-aligned, text left-aligned, never centred. Units live in the header, not in every cell. Dates are ISO (2026-03-14).',
    ],
  },
  {
    title: 'Status',
    rules: [
      'Status is never carried by colour alone: always a glyph and/or a text label beside it.',
      'Semantic colours (--ok, --warn, --bad) only for state. Inside dense data use the luminance grades --grade-1..4 (worse = brighter). Never use a status colour as a data series.',
    ],
  },
  {
    title: 'Tokens',
    rules: [
      'Name a token for every value: --radius*, --pill, --sp-1..8, --gutter, --ease, --dur-*, --font*, --mono, surface and text tokens. No hard-coded colour, radius, shadow, font, easing or spacing.',
      'Prefer the utility classes (get_utility_classes) to inline styles.',
    ],
  },
  {
    title: 'Type',
    rules: [
      'Four roles: display = --font-display (headlines), UI = --font, labels and eyebrows = --font-label (.ads-label, .eyebrow), data = --mono.',
      'Sentence case, British spelling ("colour"). Buttons are a verb + object ("Export CSV"), never "OK" or "Submit".',
    ],
  },
  {
    title: 'Accessibility',
    rules: [
      'Every interactive element is a real <button>, <a> or input, reachable by keyboard, with the global :focus-visible ring left in place.',
      'Icon-only controls take a required label (rendered as aria-label). Fields take a required visible label; a placeholder is never the label.',
      'Menus, tabs and dialogs carry their roles and aria-* state; Escape closes overlays and focus returns. Respect prefers-reduced-motion.',
    ],
  },
  {
    title: 'Motion',
    rules: [
      'One curve: var(--ease). Durations: --dur-control (hover, press), --dur-move (rails, tabs, drawers), --dur-enter (reveal, chart draw).',
      'Hover presses in (shadow inversion) or brightens text to --accent. It never lifts or recolours with hue. Never animate a value on every tick.',
    ],
  },
  {
    title: 'Charts',
    rules: [
      'No pies, donuts, dual axes, 3D, heavy fills or extra gridlines.',
      'Series colours in fixed slot order --series-1..8, never picked per value; a ninth series becomes "Other". Sequential ramps ordered by lightness; diverging ramps have a grey midpoint.',
      'Text is never in a series colour; the mark beside it carries identity. Label the values that matter directly.',
      'Every chart has an accessible name (role="img" + aria-label, or a <title>), ideally with a table fallback.',
    ],
  },
  {
    title: 'Patterns',
    rules: [
      'A stat tile pairs its figure with a comparison (target, previous period or delta). A bare number is a label with extra steps.',
      'Meters always show their threshold mark.',
      'Tabs are filtered views of one table, not navigation. Use links or the nav for navigation.',
      'Tags are removable filters; status chips must not look removable.',
      'A switch applies immediately: no switch inside a form that has a submit button.',
      'Segmented controls hold 2 to 5 short options.',
      'Menus put destructive items last, below a rule, and show shortcuts.',
      'Empty states carry the action and distinguish "never had data" from "no results".',
      'Skeletons match the real content\'s dimensions.',
      'Toasts never carry an error the reader must act on; that is a banner.',
      'Row detail opens in a drawer, not a modal. Data grids have no row striping.',
    ],
  },
  {
    title: 'Class naming',
    rules: [
      'Component classes: root ads-<kebab-name>, parts ads-<kebab-name>__<part>, states is-<state> compounded with a prefixed class (.ads-banner__glyph.is-warn). Keyframes start with the prefix.',
      'Global classes (.btn, .card, .well, .num, .eyebrow, .ads-label, .ads-field, utilities) may be used in markup and referenced as context, never restyled bare.',
      'Only use classes that exist in the kit CSS; never invent class names. Prefer the components to hand-written markup.',
    ],
  },
]

/** One-line reminders attached to a component's schema. */
const reminders: [RegExp, string][] = [
  [/^(AdsButton)$/, 'One accent button per screen, never on a destructive action; destructive actions use `destructive` with the default variant and a confirm that names the verb.'],
  [/^(AdsAlertDialog)$/, 'The confirm button says the verb ("Delete project", never "OK"); never the accent when the action is destructive.'],
  [/^(AdsMenu|AdsContextMenu|AdsMenubar)$/, 'Destructive items go last, below a rule; show shortcuts in mono.'],
  [/^(AdsIconButton|AdsThemeToggle)$/, 'Icon-only: the label is required and becomes the aria-label.'],
  [/^(AdsField|AdsNumber|AdsDaterange|AdsNativeSelect|AdsSelect|AdsCombobox|AdsInputGroup|AdsInputOtp|AdsDatePicker)$/, 'Fields are wells with a visible label; a placeholder is never the label. Figures inside are mono.'],
  [/^(AdsChoice|AdsToggle)$/, 'A switch applies immediately; never put one inside a form with a submit button.'],
  [/^(AdsSegmented|AdsToggleGroup)$/, 'Two to five short options.'],
  [/^(AdsTag)$/, 'Tags are removable filters; for status use AdsStatus or AdsBadge, which must not look removable.'],
  [/^(AdsStatus|AdsBadge|AdsMarker|AdsBanner|Callout)$/, 'Status is never colour alone: keep the glyph or the text label beside the colour.'],
  [/^(AdsStat|KpiRow|CountUp)$/, 'Pair every figure with a comparison (target, previous period or delta); numbers are mono.'],
  [/^(AdsDelta)$/, 'Direction is shown by glyph as well as colour; the figure is mono.'],
  [/^(AdsMeter|AdsGauge|AdsProgress)$/, 'Always show the threshold mark; the value is mono and labelled, not colour alone.'],
  [/^(AdsBars|AdsSparkline|AdsHeatmap|AdsLineChart|GanttChart|ChartChoice|AdsTrace)$/, 'No pies, dual axes or 3D; series colours in slot order (--series-1..8); text never in a series colour; give the chart an accessible name.'],
  [/^(AdsDataGrid|TableScreen)$/, 'Numbers right-aligned and mono, text left, never centred; units in the header; no row striping; row detail opens in a drawer.'],
  [/^(AdsTabs)$/, 'Tabs filter one table; they are not navigation.'],
  [/^(AdsDrawer|SummaryDetail)$/, 'Row detail belongs in a drawer, not a modal.'],
  [/^(AdsModal|AdsSheet)$/, 'Modals are for decisions that block; row detail goes in a drawer. Escape closes and focus returns.'],
  [/^(AdsToastHost)$/, 'Toasts confirm; an error the reader must act on is a banner, not a toast.'],
  [/^(AdsEmpty|DashEmpty)$/, 'Carry the action, and say whether there has never been data or the filter found none.'],
  [/^(AdsSkeleton|AdsLoading)$/, 'Match the real content\'s dimensions.'],
  [/^(AdsTooltip|AdsHoverCard|AdsPopover)$/, 'Never put the only copy of essential information or an action in a hover surface.'],
  [/^(BrandMark|Wordmark|ProjectLogo)$/, 'Brand colour belongs on the mark and identity moments only, never on chrome.'],
  [/^(AdsCrumbs|AdsPager|AdsNavMenu|SiteNav|DocNav|MobileNav)$/, 'Navigation is links, with aria-current on the current page; page numbers are mono.'],
]

export function ruleFor(name: string): string {
  for (const [re, text] of reminders) if (re.test(name)) return text
  return 'Grey chrome, depth not borders, one accent per screen, figures in mono, status never by colour alone.'
}

export function rulesAsText(): string {
  return designRules.map((s) => `## ${s.title}\n${s.rules.map((r) => `- ${r}`).join('\n')}`).join('\n\n')
}

// The ADS design tokens, grouped and described for an LLM. Values are the
// dark theme (the canonical one); the light theme overrides live in
// app/assets/css/tokens.css under `:root:not([data-theme='dark'])` and can be
// listed with `list_design_tokens`.

export type Token = {
  name: string
  value: string
  description?: string
}

export type TokenGroup = {
  group: string
  description: string
  tokens: Token[]
}

export const tokenGroups: TokenGroup[] = [
  {
    group: 'surfaces',
    description: 'The six value steps, darkest to lightest. Neumorphism needs a mid-tone so a shadow has room to go lighter and darker.',
    tokens: [
      { name: '--canvas', value: '#131315', description: 'Behind everything' },
      { name: '--rail', value: '#171719', description: 'The sidebar' },
      { name: '--surface', value: '#1e1e22', description: 'The frame, and every well' },
      { name: '--raised', value: '#26262a', description: 'Cards' },
      { name: '--elevated', value: '#2e2e33', description: 'Chips, bars, overlays' },
      { name: '--hover', value: '#303036', description: 'Row hover' },
    ],
  },
  {
    group: 'lines',
    description: 'Nearly invisible separators: rows are separated by a whisper, not a rule.',
    tokens: [
      { name: '--line', value: '#2c2c31', description: 'Row separators' },
      { name: '--line-strong', value: '#3a3a41', description: 'Stronger rules' },
    ],
  },
  {
    group: 'text',
    description: 'Text greys. --subdued clears 4.6:1 on --surface (AA).',
    tokens: [
      { name: '--text', value: '#f3f3f5', description: 'Primary text' },
      { name: '--text-soft', value: '#c8c8ce', description: 'Secondary text' },
      { name: '--subdued', value: '#8b8b93', description: 'Tertiary / hints' },
    ],
  },
  {
    group: 'accent',
    description: 'The one accent on the page. White in dark mode, near-black in light. Reserved for the single action per screen.',
    tokens: [
      { name: '--accent', value: '#ffffff', description: 'The accent surface' },
      { name: '--accent-ink', value: '#15151a', description: 'Text on an accent fill' },
      { name: '--accent-glow', value: '0 0 28px rgb(255 255 255 / 0.14)', description: 'Accent glow shadow' },
    ],
  },
  {
    group: 'brand',
    description: 'Identity only, never a chrome fill. Chosen in OKLCH, checked against 45 known brand colours.',
    tokens: [
      { name: '--brand-primary', value: '#b66dcc', description: 'Tyrian — the mark, identity moments' },
      { name: '--brand-secondary', value: '#2b96a4', description: 'Verdigris — supporting identity' },
    ],
  },
  {
    group: 'semantic',
    description: 'Locked meanings, always with a glyph. Never borrow from the brand set.',
    tokens: [
      { name: '--ok', value: '#7bc062', description: 'Celadon — completed, healthy, within target' },
      { name: '--warn', value: '#d88c00', description: 'Orpiment — approaching a threshold, stale, pending' },
      { name: '--bad', value: '#e55458', description: 'Vermilion — failed, destructive, over threshold' },
    ],
  },
  {
    group: 'grade',
    description: 'Luminance steps that stand in for severity. Monochrome has no red: the worse it is, the brighter it is.',
    tokens: [
      { name: '--grade-4', value: '#f3f3f5', description: 'Critical (brightest)' },
      { name: '--grade-3', value: '#b9b9c1', description: 'High' },
      { name: '--grade-2', value: '#86868e', description: 'Medium' },
      { name: '--grade-1', value: '#5c5c64', description: 'Low (dimmest)' },
    ],
  },
  {
    group: 'elevation',
    description: 'Shadow pairs: two darks (a tight contact shadow and a wide soft fall) plus a light highlight. The whole soft-UI trick.',
    tokens: [
      { name: '--soft-raised', value: '3.6px 4.8px 8.4px var(--shade), 8px 8px 28px var(--shade-soft), -5.2px -5.2px 21px var(--highlight)', description: 'Cards' },
      { name: '--soft-raised-sm', value: '1.8px 2.4px 4.2px var(--shade), 4px 4px 14px var(--shade-soft), -2.6px -2.6px 11px var(--highlight)', description: 'Controls, rows' },
      { name: '--soft-raised-lg', value: '5.8px 7.7px 13.4px var(--shade), 13px 13px 45px var(--shade-soft), -8.3px -8.3px 34px var(--highlight)', description: 'The frame, overlays' },
      { name: '--soft-inset', value: 'inset 3.2px 3.2px 8px var(--shade), inset -3.2px -3.2px 8px var(--highlight)', description: 'Wells, fields' },
      { name: '--soft-inset-sm', value: 'inset 2px 2px 5px var(--shade), inset -2px -2px 5px var(--highlight)', description: 'Small wells' },
    ],
  },
  {
    group: 'radius',
    description: 'Large on purpose: soft UI reads as moulded rather than drawn.',
    tokens: [
      { name: '--radius-lg', value: '26px', description: 'The frame' },
      { name: '--radius', value: '20px', description: 'Cards' },
      { name: '--radius-sm', value: '13px', description: 'Controls' },
      { name: '--pill', value: '999px', description: 'Chips, meters' },
    ],
  },
  {
    group: 'spacing',
    description: 'A 4px scale. --sp-5 (24px) is the shared gutter.',
    tokens: [
      { name: '--sp-1', value: '4px' },
      { name: '--sp-2', value: '8px' },
      { name: '--sp-3', value: '12px' },
      { name: '--sp-4', value: '16px' },
      { name: '--sp-5', value: '24px', description: 'The gutter' },
      { name: '--sp-6', value: '32px' },
      { name: '--sp-7', value: '48px' },
      { name: '--sp-8', value: '72px' },
    ],
  },
  {
    group: 'typography',
    description: 'Four families, each with a job.',
    tokens: [
      { name: '--font-display', value: "'Bricolage Grotesque Variable', ui-sans-serif, sans-serif", description: 'Headlines, personality' },
      { name: '--font', value: "'Inter Tight Variable', ui-sans-serif, sans-serif", description: 'UI body' },
      { name: '--font-label', value: "'Martian Mono Variable', ui-monospace, monospace", description: 'Eyebrows, labels' },
      { name: '--mono', value: "'JetBrains Mono Variable', ui-monospace, monospace", description: 'Data, figures' },
    ],
  },
  {
    group: 'motion',
    description: 'One easing curve everywhere; three durations by travel distance.',
    tokens: [
      { name: '--ease', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      { name: '--dur-control', value: '0.28s', description: 'Hover, press, check' },
      { name: '--dur-move', value: '0.42s', description: 'The rail, the tab' },
      { name: '--dur-enter', value: '0.75s', description: 'Reveal, chart draw' },
    ],
  },
  {
    group: 'layout',
    description: 'Shared metrics.',
    tokens: [
      { name: '--gutter', value: '24px', description: 'Space between cards' },
      { name: '--rail-w', value: '232px', description: 'Sidebar width' },
      { name: '--row-h', value: '34px', description: 'Data row height' },
      { name: '--max', value: '1080px', description: 'Content max width' },
    ],
  },
  {
    group: 'categorical',
    description: 'Eight hues in a fixed, colour-blindness-safe order. Assign slot 1, 2, 3… by entity, never cycle, never pick by eye.',
    tokens: [
      { name: '--series-1', value: '#3987e5', description: 'blue' },
      { name: '--series-2', value: '#d95926', description: 'orange' },
      { name: '--series-3', value: '#199e70', description: 'aqua' },
      { name: '--series-4', value: '#c98500', description: 'yellow' },
      { name: '--series-5', value: '#d55181', description: 'magenta' },
      { name: '--series-6', value: '#008300', description: 'green' },
      { name: '--series-7', value: '#9085e9', description: 'violet' },
      { name: '--series-8', value: '#e66767', description: 'red' },
    ],
  },
  {
    group: 'sequential',
    description: 'One hue, light to dark. Order steps by lightness so magnitude survives a greyscale print.',
    tokens: [
      { name: '--seq-1', value: '#0e2a47' },
      { name: '--seq-2', value: '#143c66' },
      { name: '--seq-3', value: '#1a5088' },
      { name: '--seq-4', value: '#2466ab' },
      { name: '--seq-5', value: '#2f7ccb' },
      { name: '--seq-6', value: '#5a9bdb' },
      { name: '--seq-7', value: '#8cbaea' },
    ],
  },
  {
    group: 'diverging',
    description: 'Two hues meeting at a neutral grey midpoint (--div-4 is the midpoint, never a hue).',
    tokens: [
      { name: '--div-1', value: '#b5461f' },
      { name: '--div-2', value: '#d08a5e' },
      { name: '--div-3', value: '#e0bda6' },
      { name: '--div-4', value: '#86868e' },
      { name: '--div-5', value: '#a9c3d8' },
      { name: '--div-6', value: '#5a9bdb' },
      { name: '--div-7', value: '#2466ab' },
    ],
  },
]

export function listTokens(group?: string) {
  if (!group) return tokenGroups
  return tokenGroups.filter((g) => g.group === group)
}

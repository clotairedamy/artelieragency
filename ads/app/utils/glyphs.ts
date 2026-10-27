// Every glyph on the site, on a 24px grid.
//
// A glyph is either a single path — the utility set: arrows, checks, mail —
// or a list of layers, which is how Artelier's own glyphs are drawn. Those
// follow three rules:
//
// * Two tones. Containers — frames, tracks, rings — are drawn `soft`, at low
//   opacity; the thing the glyph is about is drawn at full strength. Same
//   idea as the interface: grey chrome, the data in front.
// * Round corners. Frames take a 3.5 radius, so a glyph reads as a scaled
//   card from the UI rather than a box from a stock set.
// * The point. Where a glyph has a value worth marking, it gets a small solid
//   dot, so the eye lands on the value before the chrome.
//
// Kept outside Icon.vue so scripts/export-icons.mjs can read it too.

export type Layer =
  | { d: string; soft?: boolean; fill?: boolean }
  | { rect: [x: number, y: number, w: number, h: number, r: number]; soft?: boolean }
  | { circle: [cx: number, cy: number, r: number]; soft?: boolean; fill?: boolean }

export type Glyph = string | Layer[]

export const glyphs: Record<string, Glyph> = {
  // Utility.
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  alert: 'M12 4 2.5 20.5h19zM12 10v4M12 17.5v.5',
  layers: 'M12 3 3 8l9 5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M8 14.5v5',
  chart: 'M4 20V9M9.5 20V4M15 20v-7M20.5 20v-4',
  flow: 'M5 6h6a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3h2M3 6h1M19 18h2M16 3l3 3-3 3',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
  chevrons: 'M13 6l-6 6 6 6M19 6l-6 6 6 6',
  check: 'M4 12.5l5 5L20 6.5',
  plus: 'M12 5v14M5 12h14',
  code: 'M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18',

  // Artelier.
  dashboard: [
    { rect: [3, 4, 18, 16, 3.5], soft: true },
    { d: 'M8.5 4v16', soft: true },
    { d: 'M11.5 15.5 14 12.5l2.5 1.75 2-4' },
    { circle: [18.5, 10.25, 1.4], fill: true },
  ],
  signal: [
    { d: 'M3.5 20h17', soft: true },
    { d: 'M4 15.5 7.5 12.5l3 2L15 7.5l5 4.5' },
    { circle: [15, 7.5, 1.6], fill: true },
  ],
  growth: [
    { d: 'M5.5 19.5V16M9.5 19.5v-6M13.5 19.5V11', soft: true },
    { d: 'M17.5 19.5V9' },
    { circle: [17.5, 5, 1.6], fill: true },
  ],
  gauge: [
    { d: 'M4.5 17a7.5 7.5 0 0 1 15 0', soft: true },
    { d: 'M4.5 17a7.5 7.5 0 0 1 11.25-6.5' },
    { d: 'M12 17l3.25-4' },
    { circle: [12, 17, 1.6], fill: true },
  ],
  discovery: [
    { circle: [10.5, 10.5, 6.5] },
    { d: 'M15.5 15.5 20 20' },
    { d: 'M8 12.5l2.5-4.5 2.5 4.5', soft: true },
  ],
  blueprint: [
    { rect: [3, 4, 18, 16, 3.5], soft: true },
    { d: 'M3 9h18', soft: true },
    { rect: [6.5, 12, 5, 4.5, 1.25] },
    { d: 'M14.5 12.75h3M14.5 15.75h2' },
  ],
  system: [
    { rect: [3.5, 3.5, 7, 7, 2] },
    { rect: [13.5, 3.5, 7, 7, 2], soft: true },
    { rect: [3.5, 13.5, 7, 7, 2], soft: true },
    { circle: [17, 17, 3.5] },
    { circle: [17, 17, 1.1], fill: true },
  ],
  prototype: [
    { rect: [3, 4, 18, 13, 3.5], soft: true },
    { d: 'M12.5 11 19 13.5l-2.75 1.1L15.1 17.4z' },
  ],
  handoff: [
    { rect: [3, 4, 18, 16, 3.5], soft: true },
    { d: 'M10 9.5 7.5 12l2.5 2.5M14 9.5l2.5 2.5-2.5 2.5' },
  ],
  table: [
    { rect: [3, 4, 18, 16, 3.5], soft: true },
    { d: 'M3 9h18', soft: true },
    { d: 'M7 12.75h3M13.5 12.75H17M7 16h3M13.5 16h2' },
  ],
  audit: [
    { rect: [5, 4.5, 14, 16, 3], soft: true },
    { d: 'M9.5 4.5V3.75h5v.75' },
    { d: 'M9 12.75 11.25 15 15.5 10.5' },
  ],
  access: [
    { circle: [12, 12, 9], soft: true },
    { circle: [12, 7.5, 1.4], fill: true },
    { d: 'M8 10.5h8M12 10.5V14l-2.5 4.25M12 14l2.5 4.25' },
  ],
  theme: [
    { circle: [12, 12, 8.5] },
    { d: 'M12 3.5a8.5 8.5 0 0 1 0 17z', fill: true },
  ],
  engine: [
    { d: 'M12 2.75l8 4.6v9.3l-8 4.6-8-4.6v-9.3z', soft: true },
    { d: 'M13 6.75 9.5 12.5H14l-3.5 5.75' },
  ],
}

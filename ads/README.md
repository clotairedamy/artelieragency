# ADS — Artelier Design System

A monochrome soft-UI kit for Nuxt (3 & 4). Not a Tailwind port, not a
general-purpose framework — ADS is narrow on purpose, for data-rich screens:
tokens, a utility layer, components and dashboard patterns, built from the
rules at [artelier.agency/design-system](https://artelier.agency/design-system).

> The four rules it encodes:
> 1. The chrome is grey so the data can be coloured.
> 2. Depth is the only decoration.
> 3. Numbers are monospaced.
> 4. Every component names its tokens.

## What's inside

```
ADS/
├── app/
│   ├── assets/css/
│   │   ├── tokens.css       # every --token (surfaces, shadows, palettes, spacing)
│   │   ├── base.css         # reset, type roles, .btn .card .well .chip .grid
│   │   ├── ads.css          # the ads-* component layer
│   │   └── ads-utility.css  # the utility layer (paint-*, ink-*, lift/press, …)
│   ├── components/          # every component as a single, editable .vue file
│   ├── composables/         # useTheme, useToast, useOverlays
│   ├── plugins/reveal.ts    # v-reveal scroll-in directive
│   └── utils/glyphs.ts      # the icon set (24px grid, 1.6 stroke)
└── playground/              # the reference site (see below)
```

## Install

Copy the four stylesheets, the fonts, and the support files into your project,
then add them to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: [
    '@fontsource-variable/bricolage-grotesque',
    '@fontsource-variable/inter-tight',
    '@fontsource-variable/martian-mono',
    '@fontsource-variable/jetbrains-mono',
    '~/assets/css/tokens.css',
    '~/assets/css/base.css',
    '~/assets/css/ads.css',
    '~/assets/css/ads-utility.css',
  ],
})
```

Then copy any component from its page in the reference site and paste it into
`app/components/`. Components use `Icon` and the glyphs, so keep
`app/components/Icon.vue` and `app/utils/glyphs.ts` too.

> Prefer everything at once? The repo is also a Nuxt **layer**:
> `extends: ['../ads']` in a consuming app. Components still auto-import.

## Reference site

`playground/` is the reference: a rail of sections (surfaces, actions, inputs,
data display, disclosure, navigation, feedback, patterns), each component with
a live preview, a copy button for the usage, and a copy button for the whole
component file.

```bash
cd ADS/playground
npm install
npm run dev      # http://localhost:3000
```

## Components

**Surfaces** — `Card` · `Well` · `FrameTab`

**Actions** — `AdsButton` · `AdsIconButton` · `AdsSegmented` · `AdsMenu` ·
`AdsLink` (class)

**Inputs** — `AdsField` · `AdsNumber` · `AdsDaterange` · `AdsChoice`
(checkbox / radio / switch) · `AdsRange` · `AdsTag`

**Data display** — `AdsStat` · `AdsDelta` · `AdsMeter` · `AdsProgress` ·
`ChartChoice` · `AdsBars` · `AdsSparkline` · `AdsGauge` · `AdsHeatmap` ·
`AdsDataGrid` · `AdsDl`

**Disclosure** — `AdsAccordion` · `AdsDrawer` · `AdsPopover` · `AdsTree` ·
`AdsSteps`

**Navigation** — `AdsTabs` · `AdsCrumbs` · `AdsPager`

**Feedback** — `AdsEmpty` · `AdsSkeleton` · `AdsLoading` · `AdsBanner` ·
`AdsToastHost` · `AdsTooltip` · `AdsModal`

**Patterns** — `KpiRow` · `FilterBar` · `TableScreen` · `SummaryDetail`

**Page sections** (marketing extensions) — `SiteNav` · `SiteFooter` ·
`HeroSection` · `ContentSection` · `ImageSection` · `FeatureGrid` ·
`LogoMarquee` · `PricingSection` · `FaqSection` · `CtaBand` · `ContactForm`

## The two ways to compose

**Classes** (utility + component layers, from the markup):

```html
<div class="paint-raised lift round pad-5">
  <p class="eyebrow">Status</p>
  <span class="num size-xl">1,284</span>
</div>
<input class="ads-field" placeholder="Search…" />
```

**Components** (stateful, labelled, accessible):

```html
<AdsButton variant="accent" icon="arrow">Start a project</AdsButton>
<AdsField v-model="email" label="Email" type="email" />
<AdsSparkline :points="[12, 19, 15, 24]" />
```

## Utility cheatsheet

| Prefix | Property | Example |
| --- | --- | --- |
| `paint-*` / `ink-*` | background / color | `.paint-raised` `.ink-subdued` |
| `lift` / `press` | shadow out / in | `.lift` `.lift-lg` `.press-sm` |
| `round-*` | radius | `.round-sm` `.round-pill` |
| `pad-*` `mar-*` `gap-*` | spacing (4px scale) | `.pad-5` `.mar-x-auto` `.gap-3` |
| `row` / `stack` | flex | `.row.between.items-center` |
| `grid-N` / `cols-12 span-N` | grid | `.grid-3` `.cols-12` `.span-8` |
| `face-*` `size-*` | typography | `.face-display` `.size-3xl` |

## Theming

Every class reads a token from `tokens.css`, never a hard-coded value — change
`--accent` or `--radius` and the whole kit follows. Light is the default; dark
applies via `data-theme="dark"`.

## MCP server

The `mcp/` folder exposes the kit over the Model Context Protocol, so an LLM
(Cursor, Claude Desktop, any MCP client) queries the component catalog, token
schemas and sources instead of guessing classes or props.

```bash
cd ADS/mcp
npm install
npm run build
node dist/index.js   # MCP over stdio
```

Tools: `list_categories`, `list_components`, `get_component_schema`,
`list_design_tokens`, `get_utility_classes`, `list_icons`. See
[mcp/README.md](mcp/README.md).

## Rust (Dioxus)

`ads-rs/` is the same kit in **Dioxus 0.7** — same classes, same five
stylesheets, same look. `cargo check` in `ads-rs/` to verify.

```toml
[dependencies]
ads = { path = "../ads/ads-rs" }
dioxus = { version = "=0.7.9", features = ["web"] }
```

See [ads-rs/README.md](ads-rs/README.md).

## Sources

- Rules: [artelier.agency/design-system](https://artelier.agency/design-system)
- Source: [clotairedamy/artelieragency](https://github.com/clotairedamy/artelieragency)

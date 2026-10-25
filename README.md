# artelier.agency

The marketing site for **Artelier**, a dashboard and data-UI studio. Nuxt 4,
generated as a fully static site, hosted on GitHub Pages.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run generate   # static build into .output/public
npm run preview    # serve the static build
```

## The idea

The site does not describe dashboards or show pictures of them. It *is* one.
The chrome is a dashboard shell — a rail that collapses to icons, content
floating in one rounded panel — and every section is a working component
rather than a screenshot: a sortable data grid, hand-drawn charts, and a
telemetry panel in the hero reading real measurements from the visit in
progress. For a studio with no case studies yet, the page has to be the
portfolio.

## ADS — the design system

`/design-system` is the whole system: **55 entries across 12 groups** —
foundations, colour, layout, surfaces, actions, inputs, data display,
disclosure, navigation, feedback, patterns and engineering — each with a live
specimen rather than a picture of one. The contents live in
`app/composables/useAdsManifest.ts`, which drives the rail, the sticky index
column and the entry count, so none of the three can go stale.

### How it differs from Carbon / Material / Fluent

Those systems are general-purpose, so they have to leave the decisions to
you. ADS is for data-rich screens only, which lets it take positions:

| | General-purpose | ADS |
| --- | --- | --- |
| Contents | Alphabetical — Accordion, AI label, Breadcrumb | Grouped by job, ordered by where a thing appears on screen |
| A component's docs | Split across Overview / Style / Code / Accessibility tabs | One block, five parts: identity → specimen → states → rules → **tokens** |
| Colour | A themeable palette you supply | One palette, computed and validated against both surfaces |
| Charts | A gallery of chart types | A chart-selection table — the job picks the form |
| Data volume | Not addressed | An Engineering section: virtualisation, loading waves, state, real-time |

The tokens row has no equivalent elsewhere. Knowing which custom properties a
component consumes is what makes a system themeable rather than merely
documented.

### Brand palette

Five colours Artelier keeps, named after pigments because they were chosen
the way an atelier chooses pigments:

| Role | Pigment | Dark | Light | Token |
| --- | --- | --- | --- | --- |
| Primary | Tyrian | `#b66dcc` | `#8a4e9c` | `--brand-primary` |
| Secondary | Verdigris | `#2b96a4` | `#006981` | `--brand-secondary` |
| Success | Celadon | `#7bc062` | `#317905` | `--ok` |
| Warning | Orpiment | `#d88c00` | `#9d5500` | `--warn` |
| Danger | Vermilion | `#e55458` | `#9e001f` | `--bad` |

Derived in OKLCH and checked three ways: ≥4.5:1 against its own surface,
≥15 ΔE from every other role (≥12 among the semantics, which always carry a
glyph), and — for the brand pair — ≥8.7 ΔE from 45 well-known software brand
colours.

Finding the brand hues meant mapping the whole wheel first. The green → teal
→ blue band (H 140–240) is saturated: every attempt there landed within ΔE 10
of Tailwind, Supabase, Shopify, Okabe-Ito or Salesforce. The open gaps are
plum (300–330), rose (330–356) and olive (104–124). Rose and olive are
unusable because danger and warning own those hues, which leaves plum — which
happens to be Tyrian purple.

The semantic three are deliberately *close* to the conventional green/amber/
red (Celadon is 6.1 ΔE from Supabase's green, Vermilion 3.0 from Tailwind's).
That is the point: a success colour nobody recognises is a failed success
colour. Uniqueness belongs to the brand pair, where being unfamiliar costs
nothing.

Where they may appear: the mark, identity moments, and state. **Never as a
chrome fill** — the interface is grey so these five mean something when they
show up. Inside dense data the luminance grades still apply; three hues
repeated down four hundred rows is noise, not meaning.

### Data colour

The interface is greyscale **so that the data can be the only coloured thing
on screen**. Interface colour and data colour compete for one perceptual
channel; ADS gives the whole channel to the plot area.

The data palette is computed, not chosen: eight categorical hues in a fixed
order, plus sequential, monochrome, diverging and status ramps. Validated
against both ADS surfaces (`#1e1e22` and `#ececef`) under Machado-Oliveira-
Fernandes CVD simulation — worst adjacent ΔE 8.4 dark / 9.1 light against a
target of 8, normal-vision ΔE 19.3 / 19.6 against a floor of 15.

One obligation came back from the light-mode run and is documented on the
page rather than buried: **slots 2–5 fall below 3:1 as bare marks on the
light surface**, so in light mode those series carry visible direct labels or
ship with a table view.

### Type

Four families, each with a job:

| Role | Face | Why |
| --- | --- | --- |
| Display | Bricolage Grotesque Variable | An optical-size axis, so a 64px headline gets tighter apertures than a 20px one without a second file |
| UI | Inter Tight Variable | Stays legible at 13px in a dense grid, which the display face would not |
| Label | Martian Mono Variable | Its width axis holds letterspaced small caps together |
| Data | JetBrains Mono Variable | Drawn for figures; tabular by default |

Four families is real weight. They are all variable and self-hosted, and the
browser only fetches the subsets it needs, but if the budget tightens the
label face is the first to go.

### Implementation

Most components are classes in `ads.css`, not Vue components, because the
system is token-driven and most of them are a box with a shadow and a radius.
A class works from Vue, from a Flutter web view or from a plain template, and
it cannot drift from the tokens. Only the pieces needing state or
arithmetic — the charts, the grid, the gauge — are components.

## Design system

Monochrome soft UI, ported from the CrawlStat desktop app's Flutter theme
(`app/lib/src/theme/soft.dart`). Nothing has a border; shape comes from two
shadows — light up-left, dark down-right — on a surface the same colour as
its background. Flip them and a button becomes a hole.

Two rules hold the monochrome version together:

1. **White is the accent.** The brightest value on screen is reserved for the
   one thing we want clicked.
2. **Depth is the only decoration.** Hierarchy is elevation and value, never
   colour.

Every token lives in `app/assets/css/main.css` and can be changed live from
the theme lab on the home page — which is the point of shipping a system as
tokens rather than as finished screens.

## Where things live

| What | Where |
| --- | --- |
| The one-pager | `app/pages/index.vue` |
| ADS — the design system | `app/pages/design-system.vue` |
| Enquiry form, privacy | `app/pages/contact.vue`, `app/pages/privacy.vue` |
| Design tokens | `app/assets/css/main.css` |
| ADS component classes | `app/assets/css/ads.css` |
| ADS spec block | `app/components/ads/Spec.vue` |
| ADS contents (rail + index) | `app/composables/useAdsManifest.ts` |
| Studio name, email, nav | `app/app.config.ts` |
| Dashboard shell (rail + panel) | `app/components/DashShell.vue` |
| Charts and widgets | `app/components/{Gauge,Sparkline,Bars,Heatmap,DataGrid}.vue` |
| Interactive Gantt (phases, links, scrubber) | `app/components/GanttChart.vue` |
| Live token controls | `app/components/ThemeLab.vue` |
| Session telemetry | `app/composables/usePageMetrics.ts` |
| Sitemap | `server/routes/sitemap.xml.ts` |
| Principles document (not published) | `docs/dashboard-ux-principles.pdf` |

No chart library and no icon package — both are hand-drawn SVG, which is why
the whole site is a few hundred kilobytes.

## The principles document

`docs/dashboard-ux-principles.pdf` is a nine-page piece on designing
dashboards for data-rich applications — twelve principles, the reasoning
behind each, and what each one implies in practice. It is **deliberately not
part of the site**: only `public/` is published, so nothing in `docs/` ever
reaches the build. It is there to be sent to a prospect, attached to a
proposal or printed.

It is set light-on-white rather than in the site's dark theme, because a
document people print should not cost a toner cartridge to read.

## Notes

- **The enquiry form has no backend.** GitHub Pages cannot run functions, so
  `contact.vue` composes a message in the visitor's own mail client. If you
  want real form submissions, either move the site to Vercel or Cloudflare
  and add a server route, or point the form at a form service.
- **The engagement plan lives in `GanttChart.vue`.** Phase extents are stored
  as fractions of the engagement rather than dates, which is why one set of
  numbers serves the four-, eight- and twelve-week views. Edit `phases` and
  `links` there to change the process.
- **Telemetry stays in the browser.** The hero's numbers are measured and
  discarded; nothing is transmitted, and there is no analytics.

## Deploy (GitHub Pages)

1. Create a GitHub repository and push this folder to its `main` branch.
2. **Settings → Pages → Source** → **GitHub Actions**. Every push to `main`
   then builds and deploys via `.github/workflows/deploy.yml`.
3. **Settings → Pages → Custom domain** → `artelier.agency`. `public/CNAME`
   already contains it. At your DNS provider:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<your-user>.github.io`
4. Once the certificate is issued, tick **Enforce HTTPS**.

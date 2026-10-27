import { readFileSync } from 'node:fs'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { categories, components, findComponent, listComponents } from './catalog.js'
import { listTokens } from './tokens.js'
import { componentHtml } from './renders.js'
import { ROOT, buildHtmlDocument, extractStyles } from './html.js'

function readComponentSource(def: { file: string; cssClass?: boolean; name: string }) {
  if (def.cssClass) {
    return `CSS class (not a .vue file). The styles live in app/assets/css/base.css / ads.css.`
  }
  try {
    return readFileSync(`${ROOT}/app/components/${def.file}`, 'utf8')
  } catch {
    return `Source not found for ${def.file}.`
  }
}

function text(payload: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(payload, null, 2) }] }
}

function notFound(name: string) {
  return {
    content: [{ type: 'text' as const, text: `Unknown component "${name}". Use list_components to see the catalog.` }],
    isError: true,
  }
}

const server = new McpServer({
  name: 'artelier-ads',
  version: '1.1.0',
})

// ─── Catalog ──────────────────────────────────────────────────────────────
server.registerTool(
  'list_categories',
  { description: 'List the ADS component categories, in the design system\u2019s own order.' },
  async () => text(categories),
)

server.registerTool(
  'list_components',
  {
    description: 'List every component in the ADS kit. Optionally filter by category. Returns name, category and description.',
    inputSchema: { category: z.string().optional().describe('A category from list_categories, e.g. "Inputs".') },
  },
  async ({ category }) =>
    text(listComponents(category).map((c) => ({ name: c.name, category: c.category, description: c.description }))),
)

server.registerTool(
  'get_component_schema',
  {
    description:
      'Return the full schema for one component: description, props (name/type/default/description), slots, emits, a usage example and the complete source. Use this before emitting code, so generated markup uses only real props and slots.',
    inputSchema: { name: z.string().describe('Component name, e.g. "AdsButton", "KpiRow", "SiteNav".') },
  },
  async ({ name }) => {
    const c = findComponent(name)
    if (!c) return notFound(name)
    return text({
      name: c.name,
      category: c.category,
      description: c.description,
      props: c.props ?? [],
      slots: c.slots ?? [],
      emits: c.emits ?? [],
      usage: c.usage,
      source: readComponentSource(c),
    })
  },
)

// ─── Tokens ───────────────────────────────────────────────────────────────
server.registerTool(
  'list_design_tokens',
  {
    description:
      'List the ADS design tokens, grouped (surfaces, text, accent, brand, semantic, grade, elevation, radius, spacing, typography, motion, layout, and the data palettes). Optionally filter by group. Use these instead of hard-coding colours, shadows or spacing.',
    inputSchema: { group: z.string().optional().describe('A token group name, e.g. "semantic", "categorical".') },
  },
  async ({ group }) => text(listTokens(group)),
)

server.registerTool(
  'get_utility_classes',
  {
    description:
      'Return the ADS utility-class vocabulary (paint-*, ink-*, lift/press, round-*, pad/mar/gap, row/stack, grid, face/size). Use these to compose layouts instead of arbitrary inline styles.',
  },
  async () =>
    text({
      paint: 'background — .paint-canvas .paint-rail .paint-surface .paint-raised .paint-elevated .paint-hover .paint-accent .paint-ok .paint-warn .paint-bad .paint-series-1…8 .paint-seq-1…7 .paint-div-1…7',
      ink: 'text colour — .ink .ink-soft .ink-subdued .ink-accent .ink-ok .ink-warn .ink-bad',
      elevation: '.lift .lift-sm .lift-lg (raised) · .press .press-sm (pressed) · .flat',
      radius: '.round .round-lg .round-sm .round-pill',
      spacing: '.pad-N .mar-N .gap-N (N=1…8, 4px scale) · sides: -x -y -t -r -b -l · .mar-x-auto',
      layout: '.row (flex) .stack (column) .grid .grid-2/3/4/6/12 .cols-12 .span-N .max .measure',
      type: '.face-display .face-ui .face-label .face-mono · .size-xs…size-4xl · .num .eyebrow .lede .body',
    }),
)

// ─── Icons ────────────────────────────────────────────────────────────────
const iconNames = [
  'grid', 'alert', 'layers', 'sliders', 'chart', 'flow', 'compass', 'mail', 'arrow', 'chevrons',
  'check', 'plus', 'code', 'spark', 'dashboard', 'signal', 'growth', 'gauge', 'discovery',
  'blueprint', 'system', 'prototype', 'handoff', 'table', 'audit', 'access', 'theme', 'engine',
]

server.registerTool(
  'list_icons',
  { description: 'List the available icon names for the Icon component.' },
  async () => text(iconNames),
)

// ─── Rendering & composition ──────────────────────────────────────────────
const themeSchema = z.enum(['light', 'dark']).optional().describe('Theme. Defaults to light.')

server.registerTool(
  'render_component',
  {
    description:
      'Render a single component as a self-contained HTML document (real ADS CSS inlined, plus the component\u2019s own styles). Save the returned `html` to a file and open it, or show it in an iframe/canvas. `props` keys map to the component\u2019s props.',
    inputSchema: {
      name: z.string().describe('Component name, e.g. "AdsButton", "KpiRow".'),
      props: z.record(z.string(), z.unknown()).optional().describe('Props to pass, e.g. {"variant":"accent","label":"Save"}.'),
      theme: themeSchema,
    },
  },
  async ({ name, props = {}, theme }) => {
    const c = findComponent(name)
    if (!c) return notFound(name)
    const body = componentHtml(c.name, props)
    const styles = c.cssClass ? '' : extractStyles(readComponentSource(c))
    const html = buildHtmlDocument(c.name, body, styles, theme ?? 'light')
    return text({ component: c.name, theme: theme ?? 'light', html })
  },
)

server.registerTool(
  'compose_layout',
  {
    description:
      'Compose a full screen by stacking components in order. Provide a list of { component, props } blocks (e.g. SiteNav, HeroSection, KpiRow, TableScreen) and get a self-contained HTML document back.',
    inputSchema: {
      sections: z
        .array(z.object({ component: z.string(), props: z.record(z.string(), z.unknown()).optional() }))
        .describe('Ordered blocks. The first component renders at the top.'),
      theme: themeSchema,
    },
  },
  async ({ sections, theme }) => {
    const parts: string[] = []
    const styles: string[] = []
    for (const s of sections) {
      const c = findComponent(s.component)
      if (!c) {
        parts.push(`<p class="body">Unknown component: ${s.component}</p>`)
        continue
      }
      parts.push(componentHtml(c.name, s.props ?? {}))
      if (!c.cssClass) styles.push(extractStyles(readComponentSource(c)))
    }
    const html = buildHtmlDocument('Composed screen', parts.join('\n'), styles.join('\n'), theme ?? 'light')
    return text({ sections: sections.map((s) => s.component), theme: theme ?? 'light', html })
  },
)

const transport = new StdioServerTransport()
await server.connect(transport)

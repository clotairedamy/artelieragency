#!/usr/bin/env node
// The Artelier UI Kit MCP server. It reads the kit from disk on every call:
// the Vue SFCs, the Rust crate, the docs pages and the CSS. Nothing about a
// component's API is written down here, so the server cannot drift from the
// kit it describes.

// stdout carries the protocol, so anything a component logs goes to stderr.
console.log = (...args: unknown[]) => console.error(...args)
console.info = (...args: unknown[]) => console.error(...args)

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { categories, categoryNotes, categoryOf, cssClasses, curatedDescriptions, type CssClassEntry } from './catalog.js'
import { readDocs, type DocEntry, type DocsIndex } from './docs.js'
import { iconNames, utilityClasses } from './extras.js'
import { classesIn, readGlobalCss, readRustComponentsCss } from './html.js'
import { ADS_ROOT, RUST_ROOT, rel } from './paths.js'
import { compose, render, type RenderNode } from './render.js'
import { designRules, ruleFor, rulesAsText } from './rules.js'
import { readRustCrate, typesFor, useLine, type RustComponent, type RustCrate } from './rust.js'
import { rustSetup, vueSetup } from './setup.js'
import { listTokens, readCssTokens } from './tokens.js'
import { allVueComponents, firstParagraph, prose, readVueComponent, vueComponentNames, type VueSchema } from './vue.js'

const VERSION = '2.0.0'

// ─── Helpers ──────────────────────────────────────────────────────────────

type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean }

function json(payload: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] }
}

function fail(message: string, extra: Record<string, unknown> = {}): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify({ error: message, ...extra }, null, 2) }], isError: true }
}

/** Run a tool body; an exception becomes a readable error, never a crash. */
function safe<A>(fn: (args: A) => Promise<ToolResult>) {
  return async (args: A): Promise<ToolResult> => {
    try {
      return await fn(args)
    } catch (e) {
      return fail(`Internal error: ${(e as Error).message}`)
    }
  }
}

type Kit = 'vue' | 'rust'
const kitSchema = z.enum(['vue', 'rust']).optional().describe('Which kit: "vue" (the Nuxt layer, default) or "rust" (the Dioxus crate).')

const snake = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase()
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const norm = (s: string) => s.toLowerCase().replace(/[-_\s]/g, '')

function docsIndex(): DocsIndex {
  return readDocs(new Set(vueComponentNames()))
}

function rustCrate(): RustCrate | null {
  try {
    return readRustCrate()
  } catch {
    return null
  }
}

/** Find a name: exact, case-insensitive, kebab-case, with or without the Ads prefix. */
function resolveName(input: string, names: string[]): string | null {
  const n = norm(input)
  return names.find((c) => c === input) ?? names.find((c) => norm(c) === n) ?? names.find((c) => norm(c) === `ads${n}`) ?? null
}

function suggestions(input: string, names: string[]): string[] {
  const n = norm(input).replace(/^ads/, '')
  if (!n) return []
  return names.filter((c) => norm(c).includes(n) || n.includes(norm(c).replace(/^ads/, ''))).slice(0, 8)
}

function describe(name: string, vue: VueSchema | null, doc?: DocEntry): string {
  return curatedDescriptions[name] ?? doc?.description ?? vue?.summary ?? ''
}

function cssEntry(name: string): CssClassEntry | undefined {
  const n = norm(name)
  return cssClasses.find((c) => norm(c.name) === n || norm(c.className) === n || `.${norm(c.className)}` === n)
}

/** How a Vue component's props line up with its Rust port. */
function parity(vue: VueSchema, rust: RustComponent) {
  const vueProps = vue.props.map((p) => ({ ...p, rustName: p.name === 'modelValue' ? 'value' : snake(p.name) }))
  const rustProps = rust.props.filter((p) => !p.event && p.name !== 'children' && p.name !== 'class')
  const rustNames = new Set(rustProps.map((p) => p.name))
  const vueNames = new Set(vueProps.map((p) => p.rustName))
  // A Vue prop whose name is a Rust keyword (type, for, …) is ported with a
  // prefix: Vue `type` is Rust `button_type`. Pair those rather than report them.
  const renamed: string[] = []
  for (const p of vueProps) {
    if (rustNames.has(p.rustName)) continue
    const alt = rustProps.find((r) => r.name.endsWith(`_${p.rustName}`) && !vueNames.has(r.name))
    if (alt) {
      renamed.push(`${p.name} → ${alt.name}`)
      vueNames.add(alt.name)
      p.rustName = alt.name
    }
  }
  const missingInRust = vueProps.filter((p) => !rustNames.has(p.rustName)).map((p) => (p.rustName === p.name ? p.name : `${p.name} (${p.rustName})`))
  const extraInRust = rustProps.filter((p) => !vueNames.has(p.name)).map((p) => p.name)
  const requiredDiffers = vueProps.flatMap((p) => {
    const r = rustProps.find((x) => x.name === p.rustName)
    return r && r.required !== p.required ? [`${p.name}: Vue ${p.required ? 'required' : 'optional'}, Rust ${r.required ? 'required' : 'optional'}`] : []
  })
  const slotsNote = vue.slots.length > 0 && !rust.children ? `Vue has slots (${vue.slots.join(', ')}); the Rust port takes no children.` : undefined
  return {
    inSync: !missingInRust.length && !extraInRust.length && !requiredDiffers.length && !slotsNote,
    ...(renamed.length ? { renamed } : {}),
    ...(missingInRust.length ? { missingInRust } : {}),
    ...(extraInRust.length ? { extraInRust } : {}),
    ...(requiredDiffers.length ? { requiredDiffers } : {}),
    ...(slotsNote ? { slots: slotsNote } : {}),
  }
}

/** The docs page's props table compared with the real props. */
function docsDrift(vue: VueSchema, doc?: DocEntry) {
  if (!doc?.props?.length) return undefined
  const camel = (s: string) => s.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
  const documented = doc.props.map((p) => String(p.name ?? '').trim()).filter(Boolean)
  const toProp = (n: string) => (/^v-model$/.test(n) ? 'modelValue' : camel(n.replace(/^v-model:/, '').replace(/^[:@]/, '')))
  const real = new Set(vue.props.map((p) => p.name))
  const other = new Set([...vue.emits.map((e) => e.name), ...vue.slots])
  const notReal = documented.filter((n) => !real.has(toProp(n)) && !other.has(n.replace(/^[@#]/, '')) && !other.has(toProp(n)))
  const docSet = new Set(documented.map(toProp))
  const undocumented = vue.props.filter((p) => !docSet.has(p.name)).map((p) => p.name)
  if (!notReal.length && !undocumented.length) return { inSync: true }
  return { inSync: false, ...(notReal.length ? { documentedButNotProps: notReal } : {}), ...(undocumented.length ? { propsMissingFromTable: undocumented } : {}), page: doc.page }
}

function matchCategory(input: string | undefined) {
  if (!input) return { ok: true as const, value: undefined }
  const hit = categories.find((c) => norm(c) === norm(input))
  return hit ? { ok: true as const, value: hit } : { ok: false as const, value: undefined }
}

// ─── Server ───────────────────────────────────────────────────────────────

const server = new McpServer({ name: 'artelier-ui-kit', version: VERSION })

server.registerTool(
  'list_categories',
  { description: 'The component categories of the Artelier UI Kit, in the order the docs use, with how many components each holds.' },
  safe(async () => {
    const vue = vueComponentNames()
    const count = (c: string) => vue.filter((n) => categoryOf[n] === c).length + cssClasses.filter((x) => x.category === c).length
    return json({
      categories: categories.map((c) => ({ name: c, components: count(c), note: categoryNotes[c] })),
      uncategorised: vue.filter((n) => !categoryOf[n]),
    })
  }),
)

server.registerTool(
  'list_components',
  {
    description:
      'Every component in the Artelier UI Kit with its category, a one-line description and its required props. kit "vue" (default) lists the Nuxt layer’s components; kit "rust" lists the Dioxus crate’s components with their module paths and any names missing from either kit. Call get_component_schema before using one.',
    inputSchema: {
      kit: kitSchema,
      category: z.string().optional().describe('Only one category from list_categories, e.g. "Inputs".'),
    },
  },
  safe(async ({ kit = 'vue', category }: { kit?: Kit; category?: string }) => {
    const cat = matchCategory(category)
    if (!cat.ok) return fail(`Unknown category "${category}".`, { categories })
    const docs = docsIndex()
    if (kit === 'vue') {
      const comps = allVueComponents().map((v) => ({
        name: v.name,
        category: categoryOf[v.name] ?? null,
        description: describe(v.name, v, docs.vue.get(v.name)),
        required: v.props.filter((p) => p.required).map((p) => p.name),
      }))
      const classes = cssClasses.map((c) => ({ name: c.name, category: c.category, description: c.description, cssClass: `.${c.className}` }))
      const rows = [...comps, ...classes].filter((c) => !cat.value || c.category === cat.value)
      return json({
        kit: 'vue',
        count: rows.length,
        coverage: { components: comps.length, withCategory: comps.filter((c) => c.category).length, uncategorised: comps.filter((c) => !c.category).map((c) => c.name) },
        components: rows,
      })
    }
    const crate = rustCrate()
    if (!crate || !crate.components.size) {
      return fail(`The Rust crate could not be read at ${rel(RUST_ROOT)}.`, { parseErrors: crate?.errors ?? [], hint: 'Set ARTELIER_ADS_RS to the crate folder, or use kit "vue".' })
    }
    const vueNames = new Set(vueComponentNames())
    const rows = [...crate.components.values()]
      .map((c) => ({
        name: c.name,
        path: c.path,
        category: categoryOf[c.name] ?? null,
        description: firstParagraph(c.doc) || describe(c.name, readVueComponent(c.name), docs.vue.get(c.name)),
        required: c.props.filter((p) => p.required).map((p) => p.name),
      }))
      .filter((c) => !cat.value || c.category === cat.value)
      .sort((a, b) => a.name.localeCompare(b.name))
    return json({
      kit: 'rust',
      crate: crate.crateName,
      count: rows.length,
      coverage: {
        rustComponents: crate.components.size,
        vueComponents: vueNames.size,
        onlyInRust: [...crate.components.keys()].filter((n) => !vueNames.has(n)),
        onlyInVue: [...vueNames].filter((n) => !crate.components.has(n)),
      },
      ...(crate.errors.length ? { parseErrors: crate.errors } : {}),
      components: rows,
    })
  }),
)

server.registerTool(
  'get_component_schema',
  {
    description:
      'The exact API of one component, read from its source: props (type, required, default, description), emits or event handlers, slots or children, the types the props use, a working example from the docs, the design rule that applies, and where the Vue and Rust versions differ. Use it before writing code so you only use real props.',
    inputSchema: {
      name: z.string().describe('Component name, e.g. "AdsButton", "KpiRow". "Button" and "ads-button" also resolve.'),
      kit: kitSchema,
      includeSource: z.boolean().optional().describe('Vue only: include the whole .vue file. Default false. (Rust always includes the component function.)'),
    },
  },
  safe(async ({ name, kit = 'vue', includeSource = false }: { name: string; kit?: Kit; includeSource?: boolean }) => {
    const css = cssEntry(name)
    if (css) {
      return json({
        name: css.name,
        kit,
        kind: 'css-class',
        className: `.${css.className}`,
        category: css.category,
        description: css.description,
        rule: ruleFor(css.name),
        usage: { code: kit === 'rust' ? `div { class: "${css.className}", "…" }` : css.usage },
        definedInCss: classesIn(readGlobalCss()).has(css.className),
      })
    }
    const docs = docsIndex()
    const vueNames = vueComponentNames()

    if (kit === 'rust') {
      const crate = rustCrate()
      if (!crate || !crate.components.size) {
        return fail(`The Rust crate could not be read at ${rel(RUST_ROOT)}.`, { parseErrors: crate?.errors ?? [], hint: 'Use kit "vue", or set ARTELIER_ADS_RS.' })
      }
      const names = [...crate.components.keys()]
      const hit = resolveName(name, names)
      if (!hit) {
        const inVue = resolveName(name, vueNames)
        return fail(inVue ? `${inVue} is in the Vue kit but has no Rust port yet.` : `No Rust component "${name}".`, { didYouMean: suggestions(name, names) })
      }
      const c = crate.components.get(hit)!
      const types = typesFor(crate, c)
      const vue = readVueComponent(hit)
      const doc = docs.rust.get(hit)
      return json({
        name: c.name,
        kit: 'rust',
        path: c.path,
        use: useLine(c, types),
        category: categoryOf[c.name] ?? null,
        description: firstParagraph(c.doc) || describe(c.name, vue, docs.vue.get(c.name)),
        doc: prose(c.doc) || undefined,
        rule: ruleFor(c.name),
        props: c.props,
        children: c.children,
        types,
        usage: doc?.code ? { code: doc.code, from: doc.page } : null,
        vue: vue ? { parity: parity(vue, c), note: 'camelCase compared with snake_case; Vue modelValue maps to Rust value; event handlers and class are left out.' } : 'No Vue component of this name.',
        file: `${rel(c.file.startsWith('/') ? c.file : `${RUST_ROOT}/${c.file}`)}:${c.line}`,
        source: c.source,
        ...(crate.errors.length ? { crateParseErrors: crate.errors } : {}),
        notes: [
          'Props with required: false can be left out. Option<T> props take a T directly.',
          'Stateful controls are controlled: pass the value and an on* handler (or a Signal) where Vue uses v-model.',
        ],
      })
    }

    const hit = resolveName(name, vueNames)
    if (!hit) return fail(`No Vue component "${name}".`, { didYouMean: suggestions(name, vueNames), hint: 'list_components shows every name.' })
    const v = readVueComponent(hit)!
    const doc = docs.vue.get(hit)
    const crate = rustCrate()
    const rust = crate?.components.get(hit)
    return json({
      name: v.name,
      kit: 'vue',
      category: categoryOf[v.name] ?? null,
      description: describe(v.name, v, doc),
      rule: ruleFor(v.name),
      props: v.props,
      emits: v.emits,
      slots: v.slots,
      ...(Object.keys(v.types).length ? { types: v.types } : {}),
      ...(v.exportedTypes.length ? { exportedTypes: { names: v.exportedTypes, import: `import type { ${v.exportedTypes.join(', ')} } from '~/components/${v.name}.vue'` } } : {}),
      usage: doc?.code ? { code: doc.code, from: doc.page } : null,
      why: prose(v.header) || undefined,
      ...(docsDrift(v, doc) ? { docsTable: docsDrift(v, doc) } : {}),
      rust: rust ? { path: rust.path, parity: parity(v, rust) } : crate?.components.size ? 'No Rust port yet.' : 'Rust crate not readable.',
      file: rel(v.file),
      ...(v.errors.length ? { parseErrors: v.errors } : {}),
      ...(includeSource ? { source: v.source } : {}),
      notes: ['Components auto-import in a Nuxt app that extends the layer: no import lines needed.'],
    })
  }),
)

server.registerTool(
  'get_design_rules',
  {
    description:
      'The Artelier design rules, compact: grey chrome and coloured data, depth not borders, one accent per screen and never on a destructive action, mono numbers, status never by colour alone, a token for every value, four type roles, motion tokens, chart rules, patterns and class naming. Read once before composing a screen.',
    inputSchema: { topic: z.string().optional().describe('Only one section, e.g. "Charts", "Accent", "Patterns".') },
  },
  safe(async ({ topic }: { topic?: string }) => {
    const sections = topic ? designRules.filter((s) => norm(s.title).includes(norm(topic))) : designRules
    if (!sections.length) return fail(`No rules section "${topic}".`, { sections: designRules.map((s) => s.title) })
    const text = topic ? sections.map((s) => `## ${s.title}\n${s.rules.map((r) => `- ${r}`).join('\n')}`).join('\n\n') : rulesAsText()
    // Check every token and class the rules name against the CSS, so a rule
    // never points at something the kit has dropped.
    const tokens = [...readCssTokens().tokens.map((t) => t.name)]
    const classes = new Set([...classesIn(readGlobalCss()), ...classesIn(readRustComponentsCss()), ...allVueComponents().flatMap((v) => v.styleClasses)])
    const missing = new Set<string>()
    for (const m of text.matchAll(/(--[a-z][\w-]*?)(-?\*|\.\.\d+)?(?![\w-])/g)) {
      const t = m[1]!
      const ok = m[2]?.includes('*') ? tokens.some((x) => x.startsWith(t)) : tokens.includes(t)
      if (!ok) missing.add(t)
    }
    for (const m of text.matchAll(/(?<=[\s(,])\.([a-z][\w-]*)/g)) if (!classes.has(m[1]!)) missing.add(`.${m[1]}`)
    return json({ rules: text, ...(missing.size ? { notInCss: [...missing] } : {}) })
  }),
)

server.registerTool(
  'get_setup',
  {
    description: 'How to install the kit in a project. kit "vue": copy the Nuxt layer and extend it. kit "rust": add the crate as a path dependency and load its stylesheets.',
    inputSchema: { kit: z.enum(['vue', 'rust']).describe('Which kit to set up: "vue" or "rust".') },
  },
  safe(async ({ kit }: { kit: Kit }) => {
    const docs = docsIndex()
    if (kit === 'rust') return json(rustSetup(docs.rust.get('AdsButton')?.code))
    const ex = docs.vue.get('AdsButton')?.code
    return json(vueSetup(ex ? `<template>\n  ${ex.split('\n').join('\n  ')}\n</template>` : undefined))
  }),
)

server.registerTool(
  'list_design_tokens',
  {
    description:
      'The design tokens with their light and dark values, read from tokens.css and grouped (surfaces, lines, text, accent, brand, semantic, grade, elevation, radius, spacing, typography, motion, layout, data palettes). Use the names, never the raw values.',
    inputSchema: { group: z.string().optional().describe('One group, e.g. "semantic", "categorical", "spacing".') },
  },
  safe(async ({ group }: { group?: string }) => json(listTokens(group))),
)

server.registerTool(
  'get_utility_classes',
  {
    description:
      'The utility classes (paint-*, ink-*, lift/press, round-*, pad/mar/gap, row/stack, grid, face/size …) grouped the way ads-utility.css groups them, plus the global classes from base.css. Use them to lay out a screen instead of inline styles.',
  },
  safe(async () => json(utilityClasses())),
)

server.registerTool(
  'list_icons',
  { description: 'The icon names the Icon component accepts, from the glyph set, with the Rust port’s list and any difference between them.' },
  safe(async () => json(iconNames())),
)

// ─── Rendering ────────────────────────────────────────────────────────────

const themeSchema = z.enum(['light', 'dark']).optional().describe('Theme. Light is the default.')
const propsSchema = z.record(z.string(), z.unknown())

type SlotIn = string | NodeIn | (string | NodeIn)[]
type NodeIn = { component: string; props?: Record<string, unknown>; slots?: Record<string, SlotIn> }
const nodeSchema: z.ZodType<NodeIn> = z.lazy(() =>
  z.object({
    component: z.string().describe('A component name, or Card / Well / Link.'),
    props: propsSchema.optional(),
    slots: z.record(z.string(), slotSchema).optional(),
  }),
)
const slotSchema: z.ZodType<SlotIn> = z.lazy(() => z.union([z.string(), nodeSchema, z.array(z.union([z.string(), nodeSchema]))]))

/** Resolve names in a block tree and check props and slots against the schemas. */
function checkTree(nodes: NodeIn[], problems: string[]): RenderNode[] {
  const names = vueComponentNames()
  const fix = (n: NodeIn): RenderNode | null => {
    const css = cssEntry(n.component)
    const kids = (s: SlotIn | undefined): (string | RenderNode)[] => {
      const out: (string | RenderNode)[] = []
      for (const x of s === undefined ? [] : Array.isArray(s) ? s : [s]) {
        const r = typeof x === 'string' ? x : fix(x)
        if (r) out.push(r)
      }
      return out
    }
    if (css) {
      const tag = css.className === 'ads-link' ? 'a' : 'div'
      return { component: tag, props: { ...(n.props ?? {}), class: css.className }, slots: { default: kids(n.slots?.default) } }
    }
    const hit = resolveName(n.component, names)
    if (!hit) {
      const did = suggestions(n.component, names)
      problems.push(`Unknown component "${n.component}"${did.length ? ` (did you mean ${did.join(', ')}?)` : ''}; left out.`)
      return null
    }
    const v = readVueComponent(hit)!
    const props = n.props ?? {}
    const known = new Set(v.props.flatMap((p) => [p.name, kebab(p.name)]))
    const unknown = Object.keys(props).filter((k) => !known.has(k) && !['class', 'style', 'id'].includes(k) && !/^(aria|data)-/.test(k))
    if (unknown.length) problems.push(`${hit}: no prop ${unknown.join(', ')}; it falls through as an HTML attribute. Props: ${v.props.map((p) => p.name).join(', ') || 'none'}.`)
    const missing = v.props.filter((p) => p.required && !(p.name in props) && !(kebab(p.name) in props)).map((p) => p.name)
    if (missing.length) problems.push(`${hit}: missing required prop ${missing.join(', ')}.`)
    const slots: Record<string, (string | RenderNode)[]> = {}
    for (const [k, s] of Object.entries(n.slots ?? {})) {
      if (!v.slots.includes(k) && !v.slots.some((x) => x.startsWith('[dynamic'))) problems.push(`${hit}: no slot "${k}". Slots: ${v.slots.join(', ') || 'none'}.`)
      slots[k] = kids(s)
    }
    return { component: hit, props, slots }
  }
  return nodes.flatMap((n) => fix(n) ?? [])
}

server.registerTool(
  'render_component',
  {
    description:
      'Render one Vue component to a self-contained HTML page with the kit’s real CSS, by running the component itself. With no props it renders the docs example. Every class in the output is checked against the kit CSS. If the component cannot render statically you get a message saying so, never an approximation. The Rust kit emits the same classes, so the render is its visual reference too.',
    inputSchema: {
      name: z.string().describe('Component name, e.g. "AdsButton", "KpiRow", or Card / Well / Link.'),
      props: propsSchema.optional().describe('Props by their Vue names, e.g. {"variant":"accent","icon":"plus"}.'),
      slots: z.record(z.string(), slotSchema).optional().describe('Slot content: HTML strings or nested { component, props, slots }, e.g. {"default":"Export CSV"}.'),
      theme: themeSchema,
      kit: kitSchema,
    },
  },
  safe(async ({ name, props, slots, theme = 'light', kit = 'vue' }: { name: string; props?: Record<string, unknown>; slots?: Record<string, SlotIn>; theme?: 'light' | 'dark'; kit?: Kit }) => {
    const rustNote = kit === 'rust' ? 'Rendered from the Vue component. The Rust port emits the same classes, so this is its visual reference; Rust code itself is not rendered statically.' : undefined
    const css = cssEntry(name)
    const names = vueComponentNames()
    const hit = css ? css.name : resolveName(name, names)
    if (!hit) return fail(`No component "${name}".`, { didYouMean: suggestions(name, names) })

    const problems: string[] = []
    const custom = props !== undefined || slots !== undefined
    const example = css ? undefined : docsIndex().vue.get(hit)?.code
    let result
    let from: string
    if (css && !custom) {
      result = await render({ kind: 'nodes', nodes: checkTree([{ component: css.name, slots: { default: css.name } }], problems) }, hit, theme)
      from = 'class example'
    } else if (!custom && example) {
      result = await render({ kind: 'template', template: example }, hit, theme)
      from = 'docs example'
      if (!result.ok) {
        const alone = await render({ kind: 'nodes', nodes: [{ component: hit }] }, hit, theme)
        if (alone.ok) {
          result = alone
          from = 'defaults (the docs example needs page state)'
        }
      }
    } else {
      result = await render({ kind: 'nodes', nodes: checkTree([{ component: hit, props, slots }], problems) }, hit, theme)
      from = custom ? 'props' : 'defaults'
    }
    return json({
      component: hit,
      kit,
      ok: result.ok,
      renderedFrom: from,
      theme,
      ...(rustNote ? { note: rustNote } : {}),
      ...(result.message ? { message: result.message } : {}),
      ...(problems.length ? { problems } : {}),
      ...(result.warnings.length ? { warnings: result.warnings } : {}),
      classCheck: result.classCheck,
      components: result.components,
      ...(result.ok ? { markup: result.markup, html: result.html } : {}),
    })
  }),
)

server.registerTool(
  'compose_layout',
  {
    description:
      'Compose a screen from Vue components in order (e.g. SiteNav, HeroSection, KpiRow, TableScreen) into one self-contained HTML page. Each block is { component, props, slots }; slots take HTML or nested blocks; Card / Well / Link wrap their slot in the class. Props are checked against the schemas; blocks that cannot render are reported, never faked.',
    inputSchema: {
      sections: z.array(nodeSchema).min(1).describe('Ordered blocks, top first.'),
      title: z.string().optional().describe('Page title.'),
      theme: themeSchema,
    },
  },
  safe(async ({ sections, title = 'Composed screen', theme = 'light' }: { sections: NodeIn[]; title?: string; theme?: 'light' | 'dark' }) => {
    const problems: string[] = []
    const nodes = checkTree(sections, problems)
    if (!nodes.length) return fail('Nothing to render.', { problems })
    const result = await compose(nodes, title, theme)
    return json({
      ok: result.ok,
      title,
      theme,
      sections: sections.map((s) => s.component),
      ...(result.message ? { message: result.message } : {}),
      ...(problems.length ? { problems } : {}),
      ...(result.failed?.length ? { failed: result.failed } : {}),
      ...(result.warnings.length ? { warnings: result.warnings } : {}),
      classCheck: result.classCheck,
      components: result.components,
      ...(result.ok ? { html: result.html } : {}),
    })
  }),
)

if (!vueComponentNames().length) console.error(`artelier-ui-kit: no components found under ${ADS_ROOT}/app/components. Set ARTELIER_ADS_ROOT.`)

await server.connect(new StdioServerTransport())

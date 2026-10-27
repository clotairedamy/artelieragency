// Static renders of the Vue kit, made by the kit itself: each SFC is compiled
// for server rendering (vue/compiler-sfc), evaluated against small stand-ins
// for the Nuxt runtime (useState, useRoute, useAppConfig, NuxtLink, …) and
// rendered with vue/server-renderer. The markup is therefore exactly what the
// component emits today; nothing is hand-maintained. Every class in the output
// is then checked against the kit's CSS.
//
// When a component cannot render outside a browser, the result says so and
// points at the schema instead of guessing.
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import ts from 'typescript'
import * as Vue from 'vue'
import * as ServerRenderer from 'vue/server-renderer'
import { compileScript, compileTemplate, parse as parseSfc } from 'vue/compiler-sfc'
import { buildHtmlDocument, classesIn, classesUsed, descope, readGlobalCss, SCAFFOLD_CLASSES } from './html.js'
import { ADS_ROOT, VUE_COMPONENTS_DIR, cached, exists, readText, rel, walk } from './paths.js'
import { readVueComponent, vueComponentNames } from './vue.js'

const nodeRequire = createRequire(import.meta.url)
const APP_DIR = join(ADS_ROOT, 'app')

// ─── Module loader ────────────────────────────────────────────────────────

type Mod = { exports: any }
const compiled = new Map<string, { m: number; v: string }>()
const evaluated = new Map<string, { code: string; mod: Mod }>()

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(16)
}

function toCommonJs(code: string, file: string): string {
  // import.meta is ESM-only; give the module a server-side stand-in.
  const src = code.replace(/\bimport\.meta\b/g, '__importMeta')
  return ts.transpileModule(src, {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, isolatedModules: true },
  }).outputText
}

/** Compile an SFC source for SSR into CommonJS. */
export function compileSfc(source: string, filename: string): string {
  const { descriptor, errors } = parseSfc(source, { filename })
  if (errors.length) throw new Error(`SFC parse error in ${rel(filename)}: ${errors[0] instanceof Error ? errors[0].message : String(errors[0])}`)
  const id = hash(filename)
  if (descriptor.scriptSetup || descriptor.script) {
    const script = compileScript(descriptor, {
      id,
      inlineTemplate: true,
      genDefaultAs: '__sfc__',
      templateOptions: { ssr: true, ssrCssVars: [] },
    })
    let code = script.content
    if (!descriptor.scriptSetup && descriptor.template) {
      const tpl = compileTemplate({ source: descriptor.template.content, filename, id, ssr: true, ssrCssVars: [] })
      code += `\n${tpl.code}\n__sfc__.ssrRender = ssrRender`
    }
    return toCommonJs(`${code}\nexport default __sfc__`, filename)
  }
  const tpl = compileTemplate({ source: descriptor.template?.content ?? '', filename, id, ssr: true, ssrCssVars: [] })
  if (tpl.errors.length) throw new Error(`Template error: ${String(tpl.errors[0])}`)
  return toCommonJs(`${tpl.code}\nexport default { ssrRender }`, filename)
}

function compileFile(file: string): string {
  return cached(compiled, file, () => {
    const src = readText(file) ?? ''
    return file.endsWith('.vue') ? compileSfc(src, file) : toCommonJs(src, file)
  })
}

function resolveFile(spec: string, from: string): string | null {
  let base: string
  if (spec.startsWith('.')) base = resolve(dirname(from), spec)
  else if (spec.startsWith('~~/') || spec.startsWith('@@/')) base = resolve(ADS_ROOT, spec.slice(3))
  else if (spec.startsWith('~/') || spec.startsWith('@/')) base = resolve(APP_DIR, spec.slice(2))
  else return null
  for (const c of [base, `${base}.ts`, `${base}.js`, `${base}.vue`, join(base, 'index.ts')]) {
    if (/\.(ts|js|vue|mjs)$/.test(c) && exists(c)) return c
  }
  return null
}

const NUXT_VIRTUAL = /^(#imports|#app|#components|nuxt\/app|#build\/.*|nuxt)$/

function makeRequire(from: string, auto: Record<string, unknown>) {
  return (spec: string): unknown => {
    if (spec === 'vue' || spec === '@vue/runtime-core' || spec === '@vue/runtime-dom') return Vue
    if (spec === 'vue/server-renderer' || spec === '@vue/server-renderer') return ServerRenderer
    if (NUXT_VIRTUAL.test(spec)) return { ...auto, __esModule: true }
    const file = resolveFile(spec, from)
    if (file) return loadModule(file, auto).exports
    return nodeRequire(spec)
  }
}

function evaluate(code: string, file: string, auto: Record<string, unknown>): Mod {
  const names = Object.keys(auto).filter((n) => /^[A-Za-z_$][\w$]*$/.test(n))
  // The module body runs in an inner function so its own declarations may
  // shadow an auto-import of the same name.
  const factory = new Function('__auto', `const { ${names.join(', ')} } = __auto;\nreturn function (require, exports, module) {\n${code}\n}`)
  const mod: Mod = { exports: {} }
  factory(auto)(makeRequire(file, auto), mod.exports, mod)
  return mod
}

function loadModule(file: string, auto: Record<string, unknown>): Mod {
  const code = compileFile(file)
  const hit = evaluated.get(file)
  if (hit && hit.code === code) return hit.mod
  const mod = evaluate(code, file, auto)
  evaluated.set(file, { code, mod })
  return mod
}

// ─── The Nuxt runtime, as far as the kit uses it ──────────────────────────

const STATE = Symbol('ads-mcp-state')

function stateMap(): Map<string, Vue.Ref<unknown>> {
  const app = Vue.getCurrentInstance()?.appContext.app as any
  if (!app) return new Map()
  return (app[STATE] ??= new Map())
}

function useState<T>(key: string | (() => T), init?: () => T): Vue.Ref<T> {
  if (typeof key === 'function') {
    init = key
    key = '$anon'
  }
  const map = stateMap()
  if (!map.has(key)) map.set(key, Vue.ref(init ? init() : undefined))
  return map.get(key) as Vue.Ref<T>
}

const route = { path: '/', fullPath: '/', hash: '', query: {}, params: {}, name: 'index', meta: {}, matched: [] }

const NuxtLink = Vue.defineComponent({
  name: 'NuxtLink',
  inheritAttrs: false,
  props: { to: [String, Object], href: String, external: Boolean, target: String, rel: String, activeClass: String, exactActiveClass: String, prefetch: Boolean, noPrefetch: Boolean, replace: Boolean, custom: Boolean },
  setup(props, { slots, attrs }) {
    return () => {
      const to = props.to ?? props.href
      const href = typeof to === 'string' ? to : ((to as any)?.path ?? '#')
      return Vue.h('a', { ...attrs, href, target: props.target, rel: props.rel }, slots.default?.({ href, navigate: () => {}, isActive: false, isExactActive: false }))
    }
  },
})

const ClientOnly = Vue.defineComponent({
  name: 'ClientOnly',
  setup(_, { slots }) {
    // On the server Nuxt renders the fallback, never the content.
    return () => slots.fallback?.() ?? slots.placeholder?.() ?? null
  },
})

let autoCache: { key: string; v: Record<string, unknown> } | null = null

/** What a component may use without importing it: Vue, Nuxt and the layer's own composables and utils. */
function autoImports(): Record<string, unknown> {
  const extra = [...walk(join(APP_DIR, 'composables'), ['.ts']), ...walk(join(APP_DIR, 'utils'), ['.ts']), join(ADS_ROOT, 'app.config.ts')]
  const key = extra.map((f) => `${f}@${readText(f)?.length ?? -1}`).join('|')
  if (autoCache?.key === key) return autoCache.v
  const auto: Record<string, unknown> = {
    ...Vue,
    __importMeta: { client: false, server: true, dev: true, browser: false, env: {}, url: '' },
    useState,
    useRoute: () => Vue.reactive({ ...route }),
    useRouter: () => ({ push: async () => {}, replace: async () => {}, back: () => {}, forward: () => {}, go: () => {}, currentRoute: Vue.ref(route), resolve: (to: unknown) => ({ href: typeof to === 'string' ? to : '/' }) }),
    navigateTo: async () => {},
    useHead: () => {},
    useSeoMeta: () => {},
    useServerSeoMeta: () => {},
    definePageMeta: () => {},
    defineNuxtPlugin: (f: unknown) => f,
    defineAppConfig: (c: unknown) => c,
    useRuntimeConfig: () => ({ public: {}, app: { baseURL: '/' } }),
    useCookie: () => Vue.ref(null),
    useNuxtApp: () => ({ $router: {}, hook: () => {}, vueApp: Vue.getCurrentInstance()?.appContext.app }),
    useRequestURL: () => new URL('http://localhost/'),
    useAppConfig: () => ({}),
    NuxtLink,
    ClientOnly,
  }
  // Composables and utils first, so they can use the stubs above.
  for (const f of extra.slice(0, -1)) {
    try {
      Object.assign(auto, loadModule(f, auto).exports)
    } catch {
      // A composable that cannot load on the server only matters if a render uses it.
    }
  }
  try {
    const cfg = loadModule(join(ADS_ROOT, 'app.config.ts'), auto).exports.default ?? {}
    auto.useAppConfig = () => cfg
  } catch {
    // No app config: components fall back to their own defaults.
  }
  delete (auto as any).default
  autoCache = { key, v: auto }
  return auto
}

// ─── Components ───────────────────────────────────────────────────────────

// After the CommonJS transform a call reads `(0, vue_1.resolveComponent)("Icon")`.
const RESOLVE = /resolveComponent\)?\("([^"]+)"/g
const DIRECTIVE = /resolveDirective\)?\("([^"]+)"/g

function pascal(name: string): string {
  return name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase())
}

/** Register a component and, transitively, every component and directive its template resolves. */
function register(app: Vue.App, code: string, known: Set<string>, auto: Record<string, unknown>, done: Set<string>, errors: string[]) {
  for (const m of code.matchAll(DIRECTIVE)) {
    if (!app._context.directives[m[1]!]) app.directive(m[1]!, { getSSRProps: () => ({}) })
  }
  for (const m of code.matchAll(RESOLVE)) {
    const name = known.has(m[1]!) ? m[1]! : pascal(m[1]!)
    if (done.has(name) || !known.has(name)) continue
    done.add(name)
    const file = join(VUE_COMPONENTS_DIR, `${name}.vue`)
    try {
      const mod = loadModule(file, auto)
      app.component(name, mod.exports.default)
      register(app, compileFile(file), known, auto, done, errors)
    } catch (e) {
      errors.push(`${name}: ${(e as Error).message}`)
    }
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────

/** A slot's content: plain HTML, or another component. */
export type SlotContent = string | RenderNode | (string | RenderNode)[]
export type RenderNode = { component: string; props?: Record<string, unknown>; slots?: Record<string, SlotContent> }

export type RenderResult = {
  ok: boolean
  html: string
  /** The markup alone, without the document around it. */
  markup: string
  components: string[]
  warnings: string[]
  errors: string[]
  classCheck: { ok: boolean; checked: number; unknown: string[] }
  message?: string
}

function slotFns(slots: Record<string, SlotContent> | undefined, known: Set<string>): Record<string, () => Vue.VNode[]> {
  const out: Record<string, () => Vue.VNode[]> = {}
  for (const [k, v] of Object.entries(slots ?? {})) out[k] = () => toVNodes(v, known)
  return out
}

function toVNodes(content: SlotContent, known: Set<string>): Vue.VNode[] {
  const list = Array.isArray(content) ? content : [content]
  return list.map((c) => {
    if (typeof c === 'string') return Vue.createStaticVNode(c, 1)
    // A lowercase name is a plain element (how the CSS-class surfaces render).
    if (/^[a-z][a-z0-9]*$/.test(c.component)) return Vue.h(c.component, c.props ?? {}, c.slots?.default ? toVNodes(c.slots.default, known) : [])
    return Vue.h(Vue.resolveComponent(c.component) as any, c.props ?? {}, slotFns(c.slots, known))
  })
}

function nodeNames(n: SlotContent | undefined, out: Set<string>) {
  if (!n) return
  for (const c of Array.isArray(n) ? n : [n]) {
    if (typeof c === 'string') continue
    out.add(c.component)
    for (const s of Object.values(c.slots ?? {})) nodeNames(s, out)
  }
}

export type RenderInput =
  | { kind: 'nodes'; nodes: (string | RenderNode)[] }
  /** Template markup from the docs, compiled as a template-only SFC. */
  | { kind: 'template'; template: string }

async function renderMarkup(input: RenderInput): Promise<{ markup: string; used: Set<string>; warnings: string[]; errors: string[] }> {
  const known = new Set(vueComponentNames())
  const auto = autoImports()
  const warnings: string[] = []
  const errors: string[] = []
  const used = new Set<string>()

  let root: Vue.Component
  let rootCode: string
  if (input.kind === 'template') {
    // Event listeners do nothing on the server, and docs examples often
    // write them as placeholders (`@remove="…"`); drop them before compiling.
    const template = input.template.replace(/\s(?:@|v-on:)[\w:.-]+(?:="[^"]*")?/g, '')
    rootCode = compileSfc(`<template>${template}</template>`, join(VUE_COMPONENTS_DIR, '__example__.vue'))
    root = evaluate(rootCode, join(VUE_COMPONENTS_DIR, '__example__.vue'), auto).exports.default
  } else {
    const names = new Set<string>()
    nodeNames(input.nodes, names)
    rootCode = [...names].map((n) => `_resolveComponent("${n}")`).join('\n')
    root = Vue.defineComponent({ name: 'Root', setup: () => () => toVNodes(input.nodes, known) })
  }

  const app = Vue.createSSRApp(root)
  app.component('NuxtLink', NuxtLink)
  app.component('ClientOnly', ClientOnly)
  app.config.warnHandler = (msg) => {
    if (warnings.length < 20) warnings.push(msg)
  }
  app.config.errorHandler = (err) => {
    errors.push((err as Error)?.message ?? String(err))
  }
  app.mixin({
    beforeCreate(this: any) {
      const n = this.$options.__name ?? this.$options.name
      if (n && known.has(n)) used.add(n)
    },
  })
  register(app, rootCode, known, auto, new Set(), errors)

  // Components warn in dev about rule breaks (an accent destructive button);
  // keep those warnings for the caller instead of the server's stderr.
  const origWarn = console.warn
  const origError = console.error
  console.warn = (...a: unknown[]) => void (warnings.length < 20 && warnings.push(a.map(String).join(' ')))
  console.error = (...a: unknown[]) => void (warnings.length < 20 && warnings.push(a.map(String).join(' ')))
  try {
    const ctx: ServerRenderer.SSRContext = {}
    let markup = await ServerRenderer.renderToString(app, ctx)
    for (const t of Object.values((ctx as any).teleports ?? {})) markup += `\n${t}`
    // Hydration markers and scope ids mean nothing in a static page.
    markup = markup.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+data-v-[\w-]+(="")?/g, '')
    return { markup, used, warnings, errors }
  } finally {
    console.warn = origWarn
    console.error = origError
  }
}

function componentCss(names: Iterable<string>): string {
  const out: string[] = []
  for (const n of names) {
    const s = readVueComponent(n)?.styles
    if (s) out.push(`/* ${n} */\n${descope(s)}`)
  }
  return out.join('\n')
}

const NO_RENDER = (what: string, why: string) =>
  `No static render for ${what}: ${why}. Use get_component_schema for its props, slots and usage instead of guessing markup.`

const EMPTY_REASON =
  'it renders nothing on the server (a closed overlay needs open: true; a list needs its items; some parts draw only in the browser)'

const isEmpty = (markup: string) => !/<[a-z]/i.test(markup)

type Failure = { index: number; component: string; reason: string }

function finish(
  markup: string,
  used: Set<string>,
  warnings: string[],
  errors: string[],
  title: string,
  theme: 'light' | 'dark',
  failed: Failure[] = [],
): RenderResult & { failed?: Failure[] } {
  const styles = componentCss(used)
  const known = new Set([...classesIn(readGlobalCss()), ...classesIn(styles)])
  const emitted = classesUsed(markup)
  for (const c of SCAFFOLD_CLASSES) emitted.add(c)
  const unknown = [...emitted].filter((c) => !known.has(c)).sort()
  const ok = errors.length === 0 && !isEmpty(markup)
  const res: RenderResult & { failed?: Failure[] } = {
    ok,
    html: ok ? buildHtmlDocument(title, markup, styles, theme) : '',
    markup,
    components: [...used].sort(),
    warnings: [...new Set(warnings)],
    errors,
    classCheck: { ok: unknown.length === 0, checked: emitted.size, unknown },
  }
  if (failed.length) res.failed = failed
  if (!ok) {
    res.message = NO_RENDER(title, errors[0] ?? EMPTY_REASON)
  } else if (unknown.length) {
    res.message = `Rendered. ${unknown.length} class(es) in the output have no rule in the kit CSS (${unknown.join(', ')}): they are hooks or states the component sets, not styling to copy.`
  }
  return res
}

export async function render(input: RenderInput, title: string, theme: 'light' | 'dark'): Promise<RenderResult> {
  try {
    const out = await renderMarkup(input)
    return finish(out.markup, out.used, out.warnings, out.errors, title, theme)
  } catch (e) {
    const why = (e as Error).message.split('\n')[0]!
    return { ok: false, html: '', markup: '', components: [], warnings: [], errors: [why], classCheck: { ok: false, checked: 0, unknown: [] }, message: NO_RENDER(title, why) }
  }
}

/**
 * Render several blocks as one page. They render in one app so ids stay
 * unique; if that fails, each block is rendered alone and the ones that cannot
 * render are listed instead of being guessed at.
 */
export async function compose(nodes: (string | RenderNode)[], title: string, theme: 'light' | 'dark'): Promise<RenderResult & { failed?: Failure[] }> {
  const all = await render({ kind: 'nodes', nodes }, title, theme)
  if (all.ok) return all
  const parts: string[] = []
  const used = new Set<string>()
  const warnings: string[] = []
  const failed: Failure[] = []
  for (const [index, node] of nodes.entries()) {
    try {
      const r = await renderMarkup({ kind: 'nodes', nodes: [node] })
      const component = typeof node === 'string' ? 'html' : node.component
      if (r.errors.length || isEmpty(r.markup)) failed.push({ index, component, reason: r.errors[0] ?? EMPTY_REASON })
      else {
        parts.push(r.markup)
        for (const u of r.used) used.add(u)
        warnings.push(...r.warnings)
      }
    } catch (e) {
      failed.push({ index, component: typeof node === 'string' ? 'html' : node.component, reason: (e as Error).message.split('\n')[0]! })
    }
  }
  const res = finish(parts.join('\n'), used, warnings, [], title, theme, failed)
  if (res.ok && failed.length) {
    res.message = `Rendered ${parts.length} of ${nodes.length} blocks. Not rendered: ${failed.map((f) => `${f.component} (${f.reason})`).join('; ')}. Check their props with get_component_schema.${res.message ? ` ${res.message}` : ''}`
  }
  return res
}

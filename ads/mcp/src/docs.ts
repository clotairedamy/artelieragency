// Usage examples, read from the documentation pages at runtime. The Vue docs
// pass a `*Code` string to `<ComponentDoc :code>`; the Rust docs pass
// `usage.Name` from the RUST_USAGE map to `<RustDoc :code>`. Both are parsed
// (TypeScript compiler API for the scripts, the Vue compiler for the
// templates), so an example is exactly what the site shows.
//
// The docs live at app/pages/ui-kit/ in the site when it has them, and in the
// kit's playground otherwise; both are searched, the site first.
import { basename, join } from 'node:path'
import ts from 'typescript'
import { parse as parseSfc } from 'vue/compiler-sfc'
import { ADS_ROOT, REPO_ROOT, cached, isDir, readText, rel, walk } from './paths.js'

export type DocProp = { name: string; type?: string; default?: string; desc?: string }

export type DocEntry = {
  name: string
  description?: string
  code?: string
  language?: string
  /** The props table the docs page shows (checked against the real API). */
  props?: DocProp[]
  /** The live demo markup inside the doc block. */
  demo?: string
  page: string
  /** Rust docs: the source file the page points at. */
  file?: string
}

export type DocsIndex = {
  vue: Map<string, DocEntry>
  rust: Map<string, DocEntry>
  sources: { vuePages: string[]; rustPages: string[]; rustUsage: string | null }
}

/** Where the Vue docs pages may live, most preferred first. */
function vueDocDirs(): string[] {
  return [join(REPO_ROOT, 'app', 'pages', 'ui-kit'), join(ADS_ROOT, 'playground', 'pages')].filter(isDir)
}

/** Where the Rust docs pages may live, most preferred first. */
function rustDocDirs(): string[] {
  return [
    join(REPO_ROOT, 'app', 'pages', 'ui-kit', 'rust'),
    join(REPO_ROOT, 'app', 'pages', 'rust'),
    join(ADS_ROOT, 'playground', 'pages', 'rust'),
  ].filter(isDir)
}

// ─── Script literals ──────────────────────────────────────────────────────

function literalValue(node: ts.Node | undefined, sf: ts.SourceFile): unknown {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isTemplateExpression(node)) return node.getText(sf).slice(1, -1)
  if (ts.isNumericLiteral(node)) return Number(node.text)
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  if (ts.isParenthesizedExpression(node)) return literalValue(node.expression, sf)
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((e) => literalValue(e, sf))
  if (ts.isObjectLiteralExpression(node)) {
    const o: Record<string, unknown> = {}
    for (const p of node.properties) {
      if (ts.isPropertyAssignment(p)) {
        const k = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(sf)
        o[k] = literalValue(p.initializer, sf)
      }
    }
    return o
  }
  return undefined
}

/** Top-level `const x = <literal>` declarations, by name. */
function scriptConsts(code: string, file: string): Map<string, unknown> {
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const out = new Map<string, unknown>()
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue
    for (const d of st.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.initializer) {
        const v = literalValue(d.initializer, sf)
        if (v !== undefined) out.set(d.name.text, v)
      }
    }
  }
  return out
}

/** Evaluate a binding expression from a template against the page's consts. */
function evalBinding(exp: string, consts: Map<string, unknown>, usage: Record<string, string>): unknown {
  const sf = ts.createSourceFile('x.ts', `(${exp})`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const st = sf.statements[0]
  if (!st || !ts.isExpressionStatement(st)) return undefined
  let e: ts.Expression = st.expression
  while (ts.isParenthesizedExpression(e)) e = e.expression
  if (ts.isIdentifier(e)) return consts.get(e.text)
  if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === 'usage') return usage[e.name.text]
  if (ts.isElementAccessExpression(e) && ts.isIdentifier(e.expression) && e.expression.text === 'usage' && ts.isStringLiteral(e.argumentExpression)) {
    return usage[e.argumentExpression.text]
  }
  return literalValue(e, sf)
}

// ─── RUST_USAGE ───────────────────────────────────────────────────────────

const usageCache = new Map<string, { m: number; v: Record<string, string> }>()

function findRustUsageFile(): string | null {
  const dirs = [join(REPO_ROOT, 'app'), join(ADS_ROOT, 'playground'), join(ADS_ROOT, 'app')]
  for (const d of dirs) {
    for (const f of walk(d, ['.ts'])) {
      const t = readText(f)
      if (t && /\bRUST_USAGE\b\s*(?::[^=]+)?=\s*\{/.test(t)) return f
    }
  }
  return null
}

function readRustUsage(file: string): Record<string, string> {
  return cached(usageCache, file, () => {
    const sf = ts.createSourceFile(file, readText(file) ?? '', ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    const out: Record<string, string> = {}
    const visit = (n: ts.Node) => {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'RUST_USAGE' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
        for (const p of n.initializer.properties) {
          if (!ts.isPropertyAssignment(p)) continue
          const k = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(sf)
          const v = literalValue(p.initializer, sf)
          if (typeof v === 'string') out[k] = v
        }
      }
      ts.forEachChild(n, visit)
    }
    visit(sf)
    return out
  })
}

// ─── Pages ────────────────────────────────────────────────────────────────

type PageDocs = DocEntry[]
const pageCache = new Map<string, { m: number; v: PageDocs }>()

function parsePage(file: string, tag: 'ComponentDoc' | 'RustDoc', usage: Record<string, string>): PageDocs {
  const src = readText(file) ?? ''
  const { descriptor } = parseSfc(src, { filename: file })
  const code = descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ''
  const consts = scriptConsts(code, file)
  const out: DocEntry[] = []
  const walkTpl = (n: any) => {
    if (!n) return
    if (n.type === 1 && n.tag === tag) {
      const e: DocEntry = { name: '', page: rel(file) }
      for (const p of n.props ?? []) {
        if (p.type === 6) {
          const v = p.value?.content
          if (p.name === 'name') e.name = v
          if (p.name === 'description') e.description = v
          if (p.name === 'code') e.code = v
          if (p.name === 'language') e.language = v
          if (p.name === 'file') e.file = v
        } else if (p.type === 7 && p.name === 'bind' && p.arg?.content && p.exp?.content) {
          const v = evalBinding(p.exp.content, consts, usage)
          if (p.arg.content === 'code' && typeof v === 'string') e.code = v
          if (p.arg.content === 'description' && typeof v === 'string') e.description = v
          if (p.arg.content === 'props' && Array.isArray(v)) e.props = v as DocProp[]
        }
      }
      if (n.children?.length) {
        const start = n.children[0].loc.start.offset
        const end = n.children[n.children.length - 1].loc.end.offset
        // Template AST offsets are relative to the whole SFC.
        e.demo = src.slice(start, end).trim()
      }
      if (e.name) out.push(e)
    }
    for (const c of n.children ?? []) walkTpl(c)
    for (const b of n.branches ?? []) walkTpl(b)
  }
  walkTpl(descriptor.template?.ast)
  return out
}

/** Read every docs page. Names are normalised to real component names. */
export function readDocs(knownNames: Set<string>): DocsIndex {
  const vue = new Map<string, DocEntry>()
  const rust = new Map<string, DocEntry>()
  const vuePages: string[] = []
  const rustPages: string[] = []
  const canon = (n: string) => (knownNames.has(n) ? n : knownNames.has(`Ads${n}`) ? `Ads${n}` : n)

  const usageFile = findRustUsageFile()
  const usage = usageFile ? readRustUsage(usageFile) : {}

  const rustDirs = rustDocDirs()
  for (const dir of vueDocDirs()) {
    for (const f of walk(dir, ['.vue'])) {
      if (rustDirs.some((r) => f.startsWith(r))) continue
      const entries = cached(pageCache, `${f}#vue`, () => parsePage(f, 'ComponentDoc', usage))
      if (entries.length) vuePages.push(rel(f))
      for (const e of entries) {
        const name = canon(e.name)
        // The first source wins (the site before the playground); a later
        // page only fills in what the first left out.
        const prev = vue.get(name)
        if (!prev) vue.set(name, { ...e, name })
        else if (!prev.code && e.code) vue.set(name, { ...prev, code: e.code, language: e.language })
      }
    }
  }
  for (const dir of rustDirs) {
    for (const f of walk(dir, ['.vue'])) {
      // Not cached: an entry depends on RUST_USAGE as well as the page.
      const entries = parsePage(f, 'RustDoc', usage)
      if (entries.length) rustPages.push(rel(f))
      for (const e of entries) {
        const name = canon(e.name)
        if (!rust.has(name)) rust.set(name, { ...e, name, code: e.code ?? usage[name] ?? usage[e.name] })
      }
    }
  }
  // Snippets in RUST_USAGE that no page shows are still examples.
  for (const [k, v] of Object.entries(usage)) {
    const name = canon(k)
    if (!rust.has(name)) rust.set(name, { name, code: v, page: usageFile ? rel(usageFile) : '' })
  }
  return { vue, rust, sources: { vuePages, rustPages, rustUsage: usageFile ? rel(usageFile) : null } }
}

export function docCategoryFromPage(page: string): string | undefined {
  const map: Record<string, string> = {
    surfaces: 'Surfaces',
    actions: 'Actions',
    inputs: 'Inputs',
    'data-display': 'Data display',
    disclosure: 'Disclosure',
    navigation: 'Navigation',
    feedback: 'Feedback',
    patterns: 'Patterns',
    elements: 'Elements',
    sections: 'Page sections',
    docs: 'Docs',
  }
  return map[basename(page, '.vue')]
}

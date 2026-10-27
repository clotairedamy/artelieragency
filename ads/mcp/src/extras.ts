// The utility-class vocabulary and the icon names, read from the files that
// define them (ads-utility.css and base.css; utils/glyphs.ts and icons.rs).
import { join } from 'node:path'
import ts from 'typescript'
import { ADS_ROOT, RUST_ROOT, VUE_CSS_DIR, readText, rel } from './paths.js'

function classesDefined(css: string): string[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{[^{}]*\}/g, '{}')
  const out = new Set<string>()
  for (const m of clean.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) out.add(m[1]!)
  return [...out]
}

/** ads-utility.css, grouped by its own section headings; plus the global classes in base.css. */
export function utilityClasses() {
  const file = join(VUE_CSS_DIR, 'ads-utility.css')
  const css = readText(file) ?? ''
  const parts = css.split(/(?=\/\*\s*═══)/)
  const sections = parts
    .map((p) => {
      const head = p.match(/^\/\*\s*═+\s*([^═\n]+?)\s*═*\s*(?:\*\/|\n([\s\S]*?)\*\/)/)
      if (!head) return null
      const note = (head[2] ?? '').replace(/\s+/g, ' ').trim()
      return { section: head[1]!.replace(/═+/g, '').trim(), note: note || undefined, classes: classesDefined(p.slice(head[0].length)) }
    })
    .filter((s): s is NonNullable<typeof s> => !!s && s.classes.length > 0)
  const base = classesDefined(readText(join(VUE_CSS_DIR, 'base.css')) ?? '').filter((c) => !/^(is-|page-|js$|in$|sheet-open$)/.test(c))
  return {
    source: [rel(file), rel(join(VUE_CSS_DIR, 'base.css'))],
    note: 'Compose layouts with these instead of inline styles. They are global: the Rust kit loads the same sheets.',
    sections,
    base: { note: 'Global shapes and type roles from base.css (.btn, .card, .well, .num, .eyebrow …). Use them; never restyle them bare.', classes: base },
  }
}

/** Icon names: the keys of `glyphs` in utils/glyphs.ts, and the names icons.rs matches on. */
export function iconNames() {
  const file = join(ADS_ROOT, 'app', 'utils', 'glyphs.ts')
  const sf = ts.createSourceFile(file, readText(file) ?? '', ts.ScriptTarget.Latest, true)
  const vue: string[] = []
  const visit = (n: ts.Node) => {
    if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.name.text === 'glyphs' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
      for (const p of n.initializer.properties) {
        if (p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) vue.push(p.name.text)
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
  const rsFile = join(RUST_ROOT, 'src', 'icons.rs')
  const rs = readText(rsFile)
  const rust = rs ? [...new Set([...rs.matchAll(/^\s*"([a-z][\w-]*)"\s*(?:\|[^=]*)?=>/gm)].map((m) => m[1]!))] : []
  return {
    vue,
    rust,
    onlyInVue: vue.filter((n) => !rust.includes(n)),
    onlyInRust: rust.filter((n) => !vue.includes(n)),
    sources: [rel(file), ...(rs ? [rel(rsFile)] : [])],
    usage: { vue: '<Icon name="check" />', rust: 'Icon { name: "check" }' },
  }
}

// The Rust kit, read from the crate's source at runtime. The Dioxus port is
// written by hand alongside the Vue kit, so nothing here is hard-coded: every
// `#[component] pub fn Name(…)` is found in src/**/*.rs, its parameters become
// props (optional exactly when Dioxus makes them optional: `#[props(default)]`,
// `#[props(optional)]`, `Option<…>` or `children`), and the enums and structs
// its props use are listed with their variants, `as_str()` values,
// constructors and builder methods.
//
// The parser is a small scanner rather than a Rust grammar: it masks comments
// and string contents, then matches brackets. A file that does not parse (the
// port may be mid-edit) is reported, not fatal.
import { join, relative } from 'node:path'
import { RUST_ROOT, cached, mtime, readText, walk } from './paths.js'

export type RustProp = {
  name: string
  /** The type as written in the signature. */
  type: string
  required: boolean
  default?: string
  /** Accepts anything that converts into the type (`#[props(into)]`). */
  into?: boolean
  /** For `Option<T>` props: pass a `T` directly; Dioxus wraps it in `Some`. */
  pass?: string
  /** An event handler (`EventHandler<…>` / `Callback<…>`). */
  event?: boolean
  description?: string
}

export type RustEnum = {
  kind: 'enum'
  name: string
  path: string
  doc: string
  variants: { name: string; value?: string; default?: boolean; data?: string }[]
}

export type RustStruct = {
  kind: 'struct'
  name: string
  path: string
  doc: string
  fields: { name: string; type: string; doc?: string }[]
  /** `pub fn` signatures from inherent impls: constructors and builders. */
  methods: string[]
  /** Derives and trait impls (`Default`, `From<&str>`, …). */
  traits: string[]
}

export type RustAlias = { kind: 'alias'; name: string; path: string; doc: string; target: string }

export type RustType = RustEnum | RustStruct | RustAlias

export type RustComponent = {
  name: string
  /** Public path, e.g. `ads::ui::AdsButton`. */
  path: string
  file: string
  line: number
  doc: string
  props: RustProp[]
  children: boolean
  source: string
}

export type RustCrate = {
  root: string
  crateName: string
  components: Map<string, RustComponent>
  types: Map<string, RustType>
  errors: string[]
}

// ─── Scanner ──────────────────────────────────────────────────────────────

/** Replace comments and string/char contents with spaces, keeping offsets. */
export function mask(src: string): string {
  const out = src.split('')
  const n = src.length
  let i = 0
  const blank = (a: number, b: number) => {
    for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '
  }
  while (i < n) {
    const c = src[i]!
    const d = src[i + 1]
    if (c === '/' && d === '/') {
      const e = src.indexOf('\n', i)
      const end = e < 0 ? n : e
      blank(i, end)
      i = end
    } else if (c === '/' && d === '*') {
      let depth = 1
      let k = i + 2
      while (k < n && depth > 0) {
        if (src[k] === '/' && src[k + 1] === '*') (depth++, (k += 2))
        else if (src[k] === '*' && src[k + 1] === '/') (depth--, (k += 2))
        else k++
      }
      blank(i, k)
      i = k
    } else if ((c === 'r' || (c === 'b' && d === 'r')) && /^b?r#*"/.test(src.slice(i, i + 40)) && !/\w/.test(src[i - 1] ?? ' ')) {
      const m = /^b?r(#*)"/.exec(src.slice(i))!
      const close = `"${m[1]}`
      const start = i + m[0].length
      const e = src.indexOf(close, start)
      const end = e < 0 ? n : e
      blank(start, end)
      i = end + close.length
    } else if (c === '"') {
      let k = i + 1
      while (k < n && src[k] !== '"') k += src[k] === '\\' ? 2 : 1
      blank(i + 1, k)
      i = k + 1
    } else if (c === "'") {
      // A char literal ('a', '\n', '\u{1F600}', 'é') or a lifetime ('a).
      const m = /^'(\\(?:u\{[0-9a-fA-F]+\}|x[0-9a-fA-F]{2}|.)|[^\\'\n])'/u.exec(src.slice(i, i + 16))
      if (m) {
        blank(i + 1, i + m[0].length - 1)
        i += m[0].length
      } else i++
    } else i++
  }
  return out.join('')
}

const OPEN: Record<string, string> = { '(': ')', '[': ']', '{': '}' }

/** Index of the bracket closing the one at `at`, in masked text; -1 if unbalanced. */
function matchBracket(m: string, at: number): number {
  const stack: string[] = []
  for (let i = at; i < m.length; i++) {
    const c = m[i]!
    if (OPEN[c]) stack.push(OPEN[c]!)
    else if (c === ')' || c === ']' || c === '}') {
      if (stack.pop() !== c) return -1
      if (!stack.length) return i
    }
  }
  return -1
}

/** Split on top-level commas (brackets and generics aware). Returns [start, end] ranges. */
function splitTop(m: string, from: number, to: number): [number, number][] {
  const parts: [number, number][] = []
  let depth = 0
  let angle = 0
  let start = from
  for (let i = from; i < to; i++) {
    const c = m[i]!
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === '<') angle++
    else if (c === '>' && m[i - 1] !== '-' && m[i - 1] !== '=') angle = Math.max(0, angle - 1)
    else if (c === ',' && depth === 0 && angle === 0) {
      parts.push([start, i])
      start = i + 1
    }
  }
  if (m.slice(start, to).trim()) parts.push([start, to])
  return parts
}

const lineOf = (src: string, at: number) => src.slice(0, at).split('\n').length

/** `///` lines (and attributes) directly above the line holding `at`. */
function docAbove(src: string, at: number): { doc: string; start: number } {
  const lines = src.slice(0, at).split('\n')
  lines.pop() // the line holding `at` itself
  const doc: string[] = []
  let start = src.lastIndexOf('\n', at - 1) + 1
  for (let k = lines.length - 1; k >= 0; k--) {
    const t = lines[k]!.trim()
    if (t.startsWith('///')) doc.unshift(t.replace(/^\/\/\/ ?/, ''))
    else if (t.startsWith('#[') || t.startsWith('#![')) {
      /* an attribute between the doc and the item */
    } else break
    start -= lines[k]!.length + 1
  }
  return { doc: joinDoc(doc), start: Math.max(0, start) }
}

function joinDoc(lines: string[]): string {
  return lines
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n(?![*-] )/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n')
}

// ─── Modules and paths ────────────────────────────────────────────────────

function crateName(root: string): string {
  const toml = readText(join(root, 'Cargo.toml')) ?? ''
  const lib = /\[lib\][^[]*?\bname\s*=\s*"([^"]+)"/.exec(toml)
  if (lib) return lib[1]!
  const pkg = /\[package\][^[]*?\bname\s*=\s*"([^"]+)"/.exec(toml)
  return (pkg?.[1] ?? 'ads').replace(/-/g, '_')
}

function moduleOf(root: string, file: string): string[] {
  const r = relative(join(root, 'src'), file).replace(/\\/g, '/').replace(/\.rs$/, '')
  if (r === 'lib' || r === 'main') return []
  const parts = r.split('/')
  if (parts[parts.length - 1] === 'mod') parts.pop()
  return parts
}

function moduleFile(root: string, mod: string[]): string | null {
  if (!mod.length) return join(root, 'src', 'lib.rs')
  const a = join(root, 'src', ...mod) + '.rs'
  if (readText(a) !== null) return a
  const b = join(root, 'src', ...mod, 'mod.rs')
  if (readText(b) !== null) return b
  return null
}

/** Flatten a use tree (`a::{b, c::{D, E as F}}`) into [path, exported name] pairs. */
function flattenUse(tree: string): [string, string][] {
  const out: [string, string][] = []
  const walkTree = (prefix: string, t: string) => {
    t = t.trim()
    const brace = t.indexOf('{')
    if (brace >= 0 && t.endsWith('}')) {
      const head = t.slice(0, brace).replace(/::\s*$/, '')
      const inner = t.slice(brace + 1, -1)
      const m = mask(inner)
      for (const [a, b] of splitTop(m, 0, inner.length)) walkTree(prefix + (head ? `${head}::` : ''), inner.slice(a, b))
      return
    }
    const as = /^(.*?)\s+as\s+(\w+)$/.exec(t)
    const path = (as ? as[1]! : t).trim()
    const last = path.split('::').pop()!
    out.push([prefix + path, as ? as[2]! : last])
  }
  walkTree('', tree)
  return out
}

type ModInfo = { pubMods: Set<string>; uses: [string, string][] }
const modCache = new Map<string, { m: number; v: ModInfo }>()

function modInfo(file: string): ModInfo {
  return cached(modCache, file, () => {
    const src = readText(file) ?? ''
    const m = mask(src)
    const pubMods = new Set<string>()
    for (const x of m.matchAll(/\bpub\s+mod\s+(\w+)\s*;/g)) pubMods.add(x[1]!)
    const uses: [string, string][] = []
    for (const x of m.matchAll(/\bpub\s+use\s+([^;]+);/g)) uses.push(...flattenUse(src.slice(x.index! + x[0].indexOf(x[1]!), x.index! + x[0].indexOf(x[1]!) + x[1]!.length)))
    return { pubMods, uses }
  })
}

/** The shortest public path for an item defined in module `mod`. */
function publicPath(root: string, crate: string, mod: string[], name: string): string {
  for (let k = 0; k <= mod.length; k++) {
    const anc = mod.slice(0, k)
    const f = moduleFile(root, anc)
    if (!f) continue
    const sub = mod.slice(k).join('::')
    for (const [path, exported] of modInfo(f).uses) {
      if (exported !== name && !(path.endsWith('::*') && path.slice(0, -3).replace(/^self::/, '') === sub)) continue
      const p = path.replace(/^self::/, '').replace(/^crate::/, '')
      const target = path.endsWith('::*') ? `${sub}::${name}` : p
      if (target === (sub ? `${sub}::${name}` : name) || path.startsWith('crate::')) return [crate, ...anc, name].join('::')
    }
  }
  return [crate, ...mod, name].join('::')
}

// ─── Items ────────────────────────────────────────────────────────────────

function parseAttrList(attr: string): Map<string, string | true> {
  // `#[props(default = 16u32, into)]` → { default: '16u32', into: true }
  const out = new Map<string, string | true>()
  const inner = /^#\[\s*props\s*\(([\s\S]*)\)\s*\]$/.exec(attr.trim())
  if (!inner) return out
  const body = inner[1]!
  const m = mask(body)
  for (const [a, b] of splitTop(m, 0, body.length)) {
    const item = body.slice(a, b).trim()
    const eq = /^(!?\w+)\s*=\s*([\s\S]+)$/.exec(item)
    if (eq) out.set(eq[1]!, eq[2]!.trim())
    else out.set(item, true)
  }
  return out
}

function optionInner(type: string): string | null {
  const m = /^(?:(?:std::|core::)?option::)?Option\s*<([\s\S]*)>$/.exec(type.trim())
  return m ? m[1]!.trim() : null
}

function defaultFor(type: string, enums: Map<string, RustType>): string {
  const t = type.trim()
  if (optionInner(t) !== null) return 'None'
  if (t === 'bool') return 'false'
  if (t === 'String') return '""'
  if (/^[iuf](8|16|32|64|128|size)$/.test(t)) return '0'
  if (/^Vec\s*</.test(t)) return 'vec![]'
  const e = enums.get(t)
  if (e && e.kind === 'enum') {
    const d = e.variants.find((v) => v.default)
    if (d) return `${t}::${d.name}`
  }
  return 'Default::default()'
}

function parseParam(src: string, m: string, a: number, b: number): (Omit<RustProp, 'required' | 'default'> & { attrs: Map<string, string | true> }) | null {
  let seg = src.slice(a, b)
  let ms = m.slice(a, b)
  const docs: string[] = []
  for (const line of seg.split('\n')) {
    const t = line.trim()
    if (t.startsWith('///')) docs.push(t.replace(/^\/\/\/ ?/, ''))
  }
  // Attributes.
  const attrs = new Map<string, string | true>()
  let k = 0
  for (;;) {
    const at = ms.indexOf('#[', k)
    const firstCode = ms.slice(k).search(/\S/)
    if (at < 0 || firstCode < 0 || at !== k + firstCode) break
    const end = matchBracket(ms, at + 1)
    if (end < 0) break
    for (const [kk, v] of parseAttrList(seg.slice(at, end + 1))) attrs.set(kk, v)
    k = end + 1
  }
  seg = seg.slice(k)
  ms = ms.slice(k)
  const colon = ms.indexOf(':')
  if (colon < 0) return null
  const name = seg.slice(0, colon).trim().replace(/^mut\s+/, '').replace(/^r#/, '')
  if (!/^\w+$/.test(name)) return null
  const type = seg.slice(colon + 1).replace(/\s+/g, ' ').trim()
  return { name, type, attrs, ...(docs.length ? { description: joinDoc(docs) } : {}) }
}

function parseFile(root: string, crate: string, file: string, types: Map<string, RustType>) {
  const src = readText(file) ?? ''
  const m = mask(src)
  const mod = moduleOf(root, file)
  const relFile = relative(root, file)
  const errors: string[] = []
  const components: RustComponent[] = []
  const localTypes: RustType[] = []
  const impls: Impl[] = []

  // Enums.
  for (const x of m.matchAll(/\bpub\s+enum\s+([A-Z]\w*)\s*(?:<[^{]*>)?\s*\{/g)) {
    const name = x[1]!
    const open = x.index! + x[0].length - 1
    const close = matchBracket(m, open)
    if (close < 0) {
      errors.push(`${relFile}: unbalanced braces in enum ${name}`)
      continue
    }
    const variants: RustEnum['variants'] = []
    for (const [a, b] of splitTop(m, open + 1, close)) {
      const seg = src.slice(a, b)
      const mseg = m.slice(a, b)
      const isDefault = /#\[\s*default\s*\]/.test(mseg)
      const body = mseg.replace(/#\[[^\]]*\]/g, '').trim()
      const vm = /^([A-Z]\w*)\s*([({][\s\S]*)?$/.exec(body)
      if (!vm) continue
      const dataAt = vm[2] ? seg.indexOf(vm[2].trim().charAt(0), seg.indexOf(vm[1]!) + vm[1]!.length) : -1
      variants.push({
        name: vm[1]!,
        ...(isDefault ? { default: true } : {}),
        ...(vm[2] && dataAt >= 0 ? { data: seg.slice(dataAt).replace(/\s+/g, ' ').trim() } : {}),
      })
    }
    // `as_str()` values, from any inherent impl.
    for (const im of m.matchAll(new RegExp(`\\bimpl\\s+${name}\\s*\\{`, 'g'))) {
      const io = im.index! + im[0].length - 1
      const ic = matchBracket(m, io)
      if (ic < 0) continue
      const fnAt = m.slice(io, ic).search(/\bfn\s+as_str\b/)
      if (fnAt < 0) continue
      const bodyOpen = m.indexOf('{', io + fnAt)
      const bodyClose = matchBracket(m, bodyOpen)
      const body = src.slice(bodyOpen, bodyClose)
      for (const arm of body.matchAll(new RegExp(`(?:Self|${name})::(\\w+)(?:\\s*\\([^)]*\\)|\\s*\\{[^}]*\\})?\\s*=>\\s*"([^"]*)"`, 'g'))) {
        const v = variants.find((vv) => vv.name === arm[1])
        if (v) v.value = arm[2]
      }
    }
    localTypes.push({ kind: 'enum', name, path: publicPath(root, crate, mod, name), doc: docAbove(src, x.index!).doc, variants })
  }

  // Structs.
  for (const x of m.matchAll(/\bpub\s+struct\s+([A-Z]\w*)\s*(?:<[^{;(]*>)?\s*([{(;])/g)) {
    const name = x[1]!
    const open = x.index! + x[0].length - 1
    const fields: RustStruct['fields'] = []
    if (x[2] === '{' || x[2] === '(') {
      const close = matchBracket(m, open)
      if (close < 0) {
        errors.push(`${relFile}: unbalanced brackets in struct ${name}`)
        continue
      }
      for (const [a, b] of splitTop(m, open + 1, close)) {
        const seg = src.slice(a, b)
        const docs = seg.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('///')).map((l) => l.replace(/^\/\/\/ ?/, ''))
        const code = m.slice(a, b).replace(/#\[[^\]]*\]/g, '').trim()
        if (x[2] === '{') {
          const fm = /^(pub(?:\([^)]*\))?\s+)?(\w+)\s*:\s*([\s\S]+)$/.exec(code)
          if (!fm) continue
          if (!fm[1]) continue // private field: not part of the API
          const tStart = seg.indexOf(':', seg.indexOf(fm[2]!)) + 1
          fields.push({ name: fm[2]!, type: seg.slice(tStart).replace(/\s+/g, ' ').trim(), ...(docs.length ? { doc: joinDoc(docs) } : {}) })
        } else {
          fields.push({ name: String(fields.length), type: code.replace(/^pub\s+/, '') })
        }
      }
    }
    const { doc } = docAbove(src, x.index!)
    const derive = /#\[derive\(([^)]*)\)\]/.exec(src.slice(docAbove(src, x.index!).start, x.index!))
    const traits = derive ? derive[1]!.split(',').map((s) => s.trim()).filter(Boolean) : []
    localTypes.push({ kind: 'struct', name, path: publicPath(root, crate, mod, name), doc, fields, methods: [], traits })
  }

  // Type aliases.
  for (const x of m.matchAll(/\bpub\s+type\s+([A-Z]\w*)\s*=\s*([^;]+);/g)) {
    localTypes.push({ kind: 'alias', name: x[1]!, path: publicPath(root, crate, mod, x[1]!), doc: docAbove(src, x.index!).doc, target: src.slice(x.index! + x[0].indexOf('=') + 1, x.index! + x[0].length - 1).trim() })
  }

  // Impl blocks: methods for structs, trait impls.
  for (const x of m.matchAll(/\bimpl\s*(?:<[^{]*?>)?\s+([\w:<>&', ]+?)\s+for\s+([A-Z]\w*)(?:<[^{]*>)?\s*\{|\bimpl\s*(?:<[^{]*?>)?\s+([A-Z]\w*)(?:<[^{]*>)?\s*\{/g)) {
    const traitName = x[1]?.trim()
    const target = x[2] ?? x[3]!
    const open = x.index! + x[0].length - 1
    const close = matchBracket(m, open)
    if (close < 0) continue
    const pending = { target, trait: traitName, methods: [] as string[] }
    if (!traitName) {
      const body = m.slice(open + 1, close)
      for (const fm of body.matchAll(/\bpub\s+(?:const\s+)?fn\s+(\w+)/g)) {
        const at = open + 1 + fm.index!
        const paren = m.indexOf('(', at)
        const pclose = matchBracket(m, paren)
        if (pclose < 0) continue
        const rest = m.slice(pclose + 1)
        const stop = rest.search(/[{;]/)
        const sig = src.slice(at, pclose + 1 + (stop < 0 ? 0 : stop)).replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/,\s*\)/g, ')').trim()
        const d = docAbove(src, at).doc.split('\n\n')[0]
        pending.methods.push(d ? `${sig}  // ${d}` : sig)
      }
    }
    impls.push(pending)
  }

  // Components.
  for (const x of m.matchAll(/#\[\s*component\s*\]/g)) {
    const after = m.slice(x.index! + x[0].length)
    const fm = /^\s*(?:#\[[^\]]*\]\s*)*(?:pub(?:\([^)]*\))?\s+)?fn\s+([A-Za-z_]\w*)\s*(?:<[^(]*>)?\s*\(/.exec(after)
    if (!fm) {
      errors.push(`${relFile}:${lineOf(src, x.index!)}: #[component] not followed by a fn`)
      continue
    }
    const name = fm[1]!
    const open = x.index! + x[0].length + fm[0].length - 1
    const close = matchBracket(m, open)
    if (close < 0) {
      errors.push(`${relFile}: ${name}: unbalanced parameter list`)
      continue
    }
    const bodyOpen = m.indexOf('{', close)
    const bodyClose = bodyOpen < 0 ? -1 : matchBracket(m, bodyOpen)
    if (bodyClose < 0) errors.push(`${relFile}: ${name}: unbalanced body (file may be mid-edit)`)
    const { doc, start } = docAbove(src, x.index!)
    const props: RustProp[] = []
    let children = false
    for (const [a, b] of splitTop(m, open + 1, close)) {
      const p = parseParam(src, m, a, b)
      if (!p) {
        errors.push(`${relFile}: ${name}: could not read parameter \`${src.slice(a, b).trim().slice(0, 60)}\``)
        continue
      }
      const { attrs, ...rest } = p
      const inner = optionInner(p.type)
      const explicitDefault = attrs.get('default')
      const optional =
        attrs.has('default') || attrs.has('optional') || attrs.has('extends') || (inner !== null && !attrs.has('!optional')) || p.name === 'children'
      const prop: RustProp = { ...rest, required: !optional }
      if (optional) {
        prop.default =
          typeof explicitDefault === 'string'
            ? explicitDefault
            : p.name === 'children'
              ? 'empty'
              : attrs.has('extends')
                ? '(spread attributes)'
                : '__auto__'
      }
      if (attrs.has('into')) prop.into = true
      if (inner !== null && !attrs.has('!optional')) prop.pass = inner
      if (/\b(EventHandler|Callback)\b/.test(p.type)) prop.event = true
      if (p.name === 'children') children = true
      props.push(prop)
    }
    components.push({
      name,
      path: publicPath(root, crate, mod, name),
      file: relFile,
      line: lineOf(src, x.index!),
      doc,
      props,
      children,
      source: src.slice(start, bodyClose < 0 ? close + 1 : bodyClose + 1),
    })
  }

  for (const t of localTypes) if (!types.has(t.name)) types.set(t.name, t)
  return { components, errors, impls }
}

type Impl = { target: string; trait?: string; methods: string[] }

const crateCache = new Map<string, { m: string; v: RustCrate }>()

/** Read the whole crate. Re-parsed when any .rs file changes. */
export function readRustCrate(root = RUST_ROOT): RustCrate {
  const files = walk(join(root, 'src'), ['.rs'])
  // Keyed on the file list and every file's mtime.
  const key = root
  const mt = files.map((f) => `${f}@${mtime(f)}`).join('|')
  const hit = crateCache.get(key)
  if (hit && hit.m === mt) return hit.v
  const crate = crateName(root)
  const components = new Map<string, RustComponent>()
  const types = new Map<string, RustType>()
  const errors: string[] = []
  if (!files.length) errors.push(`No Rust sources found under ${join(root, 'src')}.`)
  const impls: Impl[] = []
  for (const f of files) {
    try {
      const r = parseFile(root, crate, f, types)
      for (const c of r.components) {
        if (components.has(c.name)) errors.push(`${c.name} is defined twice (${components.get(c.name)!.file} and ${c.file}).`)
        else components.set(c.name, c)
      }
      errors.push(...r.errors)
      impls.push(...r.impls)
    } catch (e) {
      errors.push(`${relative(root, f)}: ${(e as Error).message}`)
    }
  }
  for (const imp of impls) {
    const t = types.get(imp.target)
    if (!t || t.kind !== 'struct') continue
    if (imp.trait) t.traits.push(imp.trait)
    t.methods.push(...imp.methods)
  }
  for (const c of components.values()) {
    for (const p of c.props) if (p.default === '__auto__') p.default = defaultFor(p.type, types)
  }
  const v: RustCrate = { root, crateName: crate, components, types, errors }
  crateCache.set(key, { m: mt, v })
  return v
}

const NOT_TYPES = new Set(['String', 'Vec', 'Option', 'Element', 'EventHandler', 'Callback', 'Signal', 'ReadOnlySignal', 'ReadSignal', 'Rc', 'Arc', 'Box', 'HashMap', 'BTreeMap', 'MouseEvent', 'FormEvent', 'KeyboardEvent', 'Event', 'Attribute', 'Self'])

/** The crate types a component's props mention, and the types those mention. */
export function typesFor(crate: RustCrate, c: RustComponent): RustType[] {
  const seen = new Map<string, RustType>()
  const queue = c.props.map((p) => p.type)
  while (queue.length) {
    const t = queue.shift()!
    for (const m of t.matchAll(/\b([A-Z]\w*)\b/g)) {
      const n = m[1]!
      if (NOT_TYPES.has(n) || seen.has(n)) continue
      const ty = crate.types.get(n)
      if (!ty) continue
      seen.set(n, ty)
      if (ty.kind === 'struct') queue.push(...ty.fields.map((f) => f.type))
      if (ty.kind === 'alias') queue.push(ty.target)
      if (ty.kind === 'enum') queue.push(...ty.variants.map((v) => v.data ?? ''))
    }
  }
  return [...seen.values()]
}

/** A `use` line that brings the component and its prop types into scope. */
export function useLine(c: RustComponent, types: RustType[]): string {
  const byMod = new Map<string, string[]>()
  for (const p of [c.path, ...types.map((t) => t.path)]) {
    const i = p.lastIndexOf('::')
    const mod = p.slice(0, i)
    const item = p.slice(i + 2)
    byMod.set(mod, [...(byMod.get(mod) ?? []), item])
  }
  return [...byMod.entries()]
    .map(([mod, items]) => (items.length === 1 ? `use ${mod}::${items[0]};` : `use ${mod}::{${[...new Set(items)].join(', ')}};`))
    .join('\n')
}

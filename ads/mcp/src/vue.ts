// The Vue kit, read from the SFCs themselves. Every component's API comes from
// its own `<script setup>`: the `defineProps<{…}>()` type literal (with
// `withDefaults` defaults), `defineModel`, `defineEmits`, the `<slot>` tags in
// its template, and the header comment as its description. Parsed with the
// TypeScript compiler API, so required vs optional is exactly what the type
// says.
import { basename, dirname, join, resolve } from 'node:path'
import ts from 'typescript'
import { parse as parseSfc } from 'vue/compiler-sfc'
import { VUE_COMPONENTS_DIR, cached, readText, walk } from './paths.js'

export type VueProp = {
  name: string
  type: string
  required: boolean
  default?: string
  description?: string
  /** Declared with defineModel: bind with v-model / v-model:name. */
  model?: boolean
}

export type VueEmit = { name: string; payload: string }

export type VueSchema = {
  name: string
  file: string
  /** The whole header comment: why the component is shaped the way it is. */
  header: string
  /** The first paragraph of the header. */
  summary: string
  props: VueProp[]
  emits: VueEmit[]
  slots: string[]
  /** Type aliases and interfaces the props and emits refer to, with their source. */
  types: Record<string, string>
  /** Types the SFC exports for callers (`import type { … } from '…/X.vue'`). */
  exportedTypes: string[]
  /** Classes the component defines in its own <style>. */
  styleClasses: string[]
  /** The <style> blocks, as written. */
  styles: string
  source: string
  errors: string[]
}

const cache = new Map<string, { m: number; v: VueSchema }>()

export function vueFiles(): string[] {
  return walk(VUE_COMPONENTS_DIR, ['.vue']).filter((f) => dirname(f) === VUE_COMPONENTS_DIR)
}

export function vueComponentNames(): string[] {
  return vueFiles().map((f) => basename(f, '.vue'))
}

export function readVueComponent(name: string): VueSchema | null {
  const file = join(VUE_COMPONENTS_DIR, `${name}.vue`)
  if (readText(file) === null) return null
  return cached(cache, file, () => parseVueFile(file))
}

export function allVueComponents(): VueSchema[] {
  return vueComponentNames().map((n) => readVueComponent(n)!).filter(Boolean)
}

// ─── Comments ─────────────────────────────────────────────────────────────

function commentText(raw: string): string {
  if (raw.startsWith('//')) return raw.replace(/^\/\/ ?/, '')
  return raw
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\* ?/, ''))
    .join('\n')
    .trim()
}

/** The comment block at the very top of the script: the component's header. */
function headerComment(code: string): string {
  const ranges = ts.getLeadingCommentRanges(code, 0) ?? []
  const lines: string[] = []
  let prevEnd = -1
  for (const r of ranges) {
    const raw = code.slice(r.pos, r.end)
    // A blank line between comment blocks is a paragraph break.
    if (prevEnd >= 0 && /\n\s*\n/.test(code.slice(prevEnd, r.pos))) lines.push('')
    lines.push(commentText(raw))
    prevEnd = r.end
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Join comment lines into prose paragraphs, keeping list items on their own line. */
export function prose(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\n(?![*-] )/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n')
}

export function firstParagraph(text: string): string {
  return prose(text).split('\n\n')[0] ?? ''
}

function memberComment(sf: ts.SourceFile, node: ts.Node): string | undefined {
  const text = sf.text
  const lead = (ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []).map((r) => commentText(text.slice(r.pos, r.end)))
  // A trailing `// …` on the same line belongs to this member.
  const trail = (ts.getTrailingCommentRanges(text, node.getEnd()) ?? [])
    .concat(ts.getTrailingCommentRanges(text, node.getEnd() + 1) ?? [])
    .filter((r) => !text.slice(node.getEnd(), r.pos).includes('\n'))
    .map((r) => commentText(text.slice(r.pos, r.end)))
  const all = [...lead, ...trail].join(' ').replace(/\s+/g, ' ').trim()
  return all || undefined
}

// ─── Types ────────────────────────────────────────────────────────────────

type Decls = Map<string, ts.Node>

function localDecls(sf: ts.SourceFile): Decls {
  const map: Decls = new Map()
  for (const st of sf.statements) {
    if (ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isEnumDeclaration(st)) map.set(st.name.text, st)
  }
  return map
}

function typeImports(sf: ts.SourceFile): Map<string, string> {
  const map = new Map<string, string>()
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !ts.isStringLiteral(st.moduleSpecifier)) continue
    const from = st.moduleSpecifier.text
    const named = st.importClause?.namedBindings
    if (named && ts.isNamedImports(named)) {
      for (const el of named.elements) map.set(el.name.text, from)
    }
  }
  return map
}

function referencedTypeNames(node: ts.Node | undefined): string[] {
  const out = new Set<string>()
  const visit = (n: ts.Node) => {
    if (ts.isTypeReferenceNode(n) && ts.isIdentifier(n.typeName)) out.add(n.typeName.text)
    if (ts.isExpressionWithTypeArguments(n) && ts.isIdentifier(n.expression)) out.add(n.expression.text)
    ts.forEachChild(n, visit)
  }
  if (node) visit(node)
  return [...out]
}

const BUILTIN_TYPES = new Set(['Record', 'Partial', 'Pick', 'Omit', 'Array', 'Readonly', 'Date', 'HTMLElement', 'Function', 'Promise', 'Exclude', 'Extract', 'NonNullable'])

/** Load the script of a .vue or .ts file as a TS source file. */
function loadTsSource(file: string): ts.SourceFile | null {
  const candidates = file.endsWith('.vue') || file.endsWith('.ts') ? [file] : [`${file}.ts`, `${file}/index.ts`, `${file}.vue`]
  for (const c of candidates) {
    const text = readText(c)
    if (text === null) continue
    if (c.endsWith('.vue')) {
      const { descriptor } = parseSfc(text, { filename: c })
      const code = [descriptor.script?.content ?? '', descriptor.scriptSetup?.content ?? ''].join('\n')
      return ts.createSourceFile(c, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
    }
    return ts.createSourceFile(c, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  }
  return null
}

/** Resolve the referenced types (local, imported, and the types they use in turn). */
function collectTypes(sf: ts.SourceFile, roots: string[], file: string): Record<string, string> {
  const out: Record<string, string> = {}
  const queue: { name: string; sf: ts.SourceFile; file: string; depth: number }[] = roots.map((name) => ({ name, sf, file, depth: 0 }))
  while (queue.length) {
    const { name, sf: src, file: f, depth } = queue.shift()!
    if (out[name] || BUILTIN_TYPES.has(name) || depth > 4) continue
    const decl = localDecls(src).get(name)
    if (decl) {
      out[name] = decl.getText(src).replace(/^export\s+/, '')
      for (const n of referencedTypeNames(decl)) queue.push({ name: n, sf: src, file: f, depth: depth + 1 })
      continue
    }
    const from = typeImports(src).get(name)
    if (from && (from.startsWith('.') || from.startsWith('~/') || from.startsWith('@/'))) {
      const base = from.startsWith('.') ? resolve(dirname(f), from) : resolve(VUE_COMPONENTS_DIR, '..', from.slice(2))
      const other = loadTsSource(base)
      if (other) queue.push({ name, sf: other, file: other.fileName, depth: depth + 1 })
    }
  }
  return out
}

// ─── Macros ───────────────────────────────────────────────────────────────

function calleeName(call: ts.CallExpression): string | undefined {
  return ts.isIdentifier(call.expression) ? call.expression.text : undefined
}

function propName(name: ts.PropertyName): string {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text
  return name.getText()
}

function defaultText(init: ts.Expression, sf: ts.SourceFile): string {
  // `() => []` is how array/object defaults are written; show the value.
  if ((ts.isArrowFunction(init) || ts.isFunctionExpression(init)) && init.parameters.length === 0) {
    const body = init.body
    if (!ts.isBlock(body)) return (ts.isParenthesizedExpression(body) ? body.expression : body).getText(sf)
  }
  return init.getText(sf)
}

function membersOf(type: ts.TypeNode | undefined, decls: Decls): ts.TypeElement[] {
  if (!type) return []
  if (ts.isTypeLiteralNode(type)) return [...type.members]
  if (ts.isIntersectionTypeNode(type)) return type.types.flatMap((t) => membersOf(t, decls))
  if (ts.isParenthesizedTypeNode(type)) return membersOf(type.type, decls)
  if (ts.isTypeReferenceNode(type) && ts.isIdentifier(type.typeName)) {
    const d = decls.get(type.typeName.text)
    if (d && ts.isInterfaceDeclaration(d)) return [...d.members]
    if (d && ts.isTypeAliasDeclaration(d)) return membersOf(d.type, decls)
  }
  return []
}

function parseVueFile(file: string): VueSchema {
  const name = basename(file, '.vue')
  const source = readText(file) ?? ''
  const errors: string[] = []
  const { descriptor, errors: sfcErrors } = parseSfc(source, { filename: file })
  for (const e of sfcErrors) errors.push(`SFC parse: ${e instanceof Error ? e.message : String(e)}`)

  const code = descriptor.scriptSetup?.content ?? descriptor.script?.content ?? ''
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const decls = localDecls(sf)

  const props: VueProp[] = []
  const emits: VueEmit[] = []
  const typeRoots: ts.Node[] = []

  const visit = (node: ts.Node) => {
    if (ts.isCallExpression(node)) {
      const callee = calleeName(node)
      if (callee === 'defineProps') {
        let defaults: ts.ObjectLiteralExpression | undefined
        const parent = node.parent
        if (ts.isCallExpression(parent) && calleeName(parent) === 'withDefaults' && parent.arguments[0] === node) {
          const d = parent.arguments[1]
          if (d && ts.isObjectLiteralExpression(d)) defaults = d
        }
        const dmap = new Map<string, string>()
        for (const p of defaults?.properties ?? []) {
          if (ts.isPropertyAssignment(p)) dmap.set(propName(p.name), defaultText(p.initializer, sf))
          else if (ts.isShorthandPropertyAssignment(p)) dmap.set(p.name.text, p.name.text)
          else if (ts.isMethodDeclaration(p)) dmap.set(propName(p.name), p.getText(sf))
        }
        const typeArg = node.typeArguments?.[0]
        if (typeArg) {
          typeRoots.push(typeArg)
          for (const m of membersOf(typeArg, decls)) {
            if (!(ts.isPropertySignature(m) || ts.isMethodSignature(m)) || !m.name) continue
            const pname = propName(m.name)
            const type = ts.isPropertySignature(m) ? (m.type?.getText(sf) ?? 'unknown') : m.getText(sf)
            const prop: VueProp = { name: pname, type, required: !m.questionToken }
            if (dmap.has(pname)) prop.default = dmap.get(pname)
            else if (m.questionToken && /^boolean$/.test(type.trim())) prop.default = 'false'
            const desc = memberComment(sf, m)
            if (desc) prop.description = desc
            props.push(prop)
          }
        } else if (node.arguments[0]) {
          // Runtime declaration: `defineProps(['a'])` or `defineProps({ a: String })`.
          const arg = node.arguments[0]
          if (ts.isArrayLiteralExpression(arg)) {
            for (const el of arg.elements) if (ts.isStringLiteral(el)) props.push({ name: el.text, type: 'unknown', required: false })
          } else if (ts.isObjectLiteralExpression(arg)) {
            for (const p of arg.properties) {
              if (!ts.isPropertyAssignment(p)) continue
              const txt = p.initializer.getText(sf)
              props.push({ name: propName(p.name), type: txt, required: /required:\s*true/.test(txt) })
            }
          }
          errors.push('defineProps uses a runtime declaration; types are approximate.')
        }
      } else if (callee === 'defineModel') {
        const first = node.arguments[0]
        const modelName = first && ts.isStringLiteral(first) ? first.text : 'modelValue'
        const opts = node.arguments.find((a) => ts.isObjectLiteralExpression(a)) as ts.ObjectLiteralExpression | undefined
        let required = false
        let dflt: string | undefined
        for (const p of opts?.properties ?? []) {
          if (!ts.isPropertyAssignment(p)) continue
          const k = propName(p.name)
          if (k === 'required') required = p.initializer.kind === ts.SyntaxKind.TrueKeyword
          if (k === 'default') dflt = defaultText(p.initializer, sf)
        }
        const typeArg = node.typeArguments?.[0]
        if (typeArg) typeRoots.push(typeArg)
        props.push({
          name: modelName,
          type: typeArg?.getText(sf) ?? 'unknown',
          required,
          ...(dflt !== undefined ? { default: dflt } : {}),
          description: modelName === 'modelValue' ? 'Bind with v-model.' : `Bind with v-model:${modelName}.`,
          model: true,
        })
        emits.push({ name: `update:${modelName}`, payload: `(value: ${typeArg?.getText(sf) ?? 'unknown'})` })
      } else if (callee === 'defineEmits') {
        const typeArg = node.typeArguments?.[0]
        if (typeArg) {
          typeRoots.push(typeArg)
          for (const m of membersOf(typeArg, decls)) {
            if (ts.isCallSignatureDeclaration(m)) {
              const [evt, ...rest] = m.parameters
              const lit = evt?.type && ts.isLiteralTypeNode(evt.type) && ts.isStringLiteral(evt.type.literal) ? evt.type.literal.text : undefined
              if (!lit) continue
              emits.push({ name: lit, payload: `(${rest.map((p) => p.getText(sf)).join(', ')})` })
            } else if (ts.isPropertySignature(m) && m.name) {
              const t = m.type
              const payload = t && ts.isTupleTypeNode(t) ? `(${t.elements.map((e) => e.getText(sf)).join(', ')})` : `(${t?.getText(sf) ?? ''})`
              emits.push({ name: propName(m.name), payload })
            }
          }
        } else if (node.arguments[0] && ts.isArrayLiteralExpression(node.arguments[0])) {
          for (const el of node.arguments[0].elements) if (ts.isStringLiteral(el)) emits.push({ name: el.text, payload: '(…)' })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)

  // Slots: every <slot> in the template, plus any `slots.x` / `$slots.x` checks.
  const slots = new Set<string>()
  const walkTpl = (n: any) => {
    if (!n) return
    if (n.type === 1 && n.tag === 'slot') {
      let sname = 'default'
      for (const p of n.props ?? []) {
        if (p.type === 6 && p.name === 'name' && p.value) sname = p.value.content
        if (p.type === 7 && p.name === 'bind' && p.arg?.content === 'name') sname = `[dynamic: ${p.exp?.content ?? '?'}]`
      }
      slots.add(sname)
    }
    for (const c of n.children ?? []) walkTpl(c)
    for (const b of n.branches ?? []) walkTpl(b)
  }
  walkTpl(descriptor.template?.ast)
  for (const m of source.matchAll(/(?<![\w.])\$?slots\.([A-Za-z_]\w*)/g)) slots.add(m[1]!)
  for (const m of source.matchAll(/(?<![\w.])\$?slots\[['"]([\w-]+)['"]\]/g)) slots.add(m[1]!)

  const roots = new Set<string>()
  for (const r of typeRoots) for (const n of referencedTypeNames(r)) roots.add(n)
  const types = collectTypes(sf, [...roots], file)

  const exportedTypes: string[] = []
  for (const st of sf.statements) {
    const isExported = (st as any).modifiers?.some((m: ts.Modifier) => m.kind === ts.SyntaxKind.ExportKeyword)
    if ((ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st)) && isExported) exportedTypes.push(st.name.text)
    if (ts.isExportDeclaration(st) && st.exportClause && ts.isNamedExports(st.exportClause)) {
      for (const el of st.exportClause.elements) exportedTypes.push(el.name.text)
    }
  }

  const styles = descriptor.styles.map((s) => s.content).join('\n')
  const styleClasses = [...new Set([...styles.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(-?[A-Za-z_][\w-]*)/g)].map((m) => m[1]!))].sort()

  const header = headerComment(code)
  return {
    name,
    file,
    header,
    summary: firstParagraph(header),
    props,
    emits,
    slots: [...slots],
    types,
    exportedTypes,
    styleClasses,
    styles,
    source,
    errors,
  }
}

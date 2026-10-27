// The CSS side of rendering: the kit's stylesheets, read from disk on demand,
// the set of class names they define (so a render can prove it only emits
// real classes), and the standalone HTML document a render is wrapped in.
import { join } from 'node:path'
import { ADS_ROOT, GLOBAL_CSS, RUST_CSS_DIR, VUE_CSS_DIR, cached, readText } from './paths.js'

const textCache = new Map<string, { m: number; v: string }>()

function cssFile(path: string): string {
  return cached(textCache, path, () => readText(path) ?? '')
}

/** The four shared stylesheets (tokens, base, ads, ads-utility), in load order. */
export function readGlobalCss(): string {
  return GLOBAL_CSS.map((f) => cssFile(join(VUE_CSS_DIR, f))).join('\n')
}

/** The Rust kit's de-scoped component sheet. */
export function readRustComponentsCss(): string {
  return cssFile(join(RUST_CSS_DIR, 'components.css'))
}

/** A component's <style> blocks, de-scoped for a standalone page. */
export function descope(css: string): string {
  return css
    .replace(/:deep\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '$1')
    .replace(/:global\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '$1')
    .replace(/:slotted\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g, '$1')
}

/** Every class a stylesheet defines or references in a selector. */
export function classesIn(css: string): Set<string> {
  const out = new Set<string>()
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, '').replace(/"[^"]*"|'[^']*'/g, '""')
  for (const m of clean.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)) out.add(m[1]!)
  return out
}

/** The class attribute values in a piece of HTML, split into names. */
export function classesUsed(html: string): Set<string> {
  const out = new Set<string>()
  for (const m of html.matchAll(/\sclass="([^"]*)"/g)) for (const c of m[1]!.split(/\s+/)) if (c) out.add(c)
  return out
}

/** The variable fonts the layer loads, linked from a CDN so a preview has the right faces. */
export function fontLinks(): string {
  const cfg = readText(join(ADS_ROOT, 'nuxt.config.ts')) ?? ''
  return [...cfg.matchAll(/['"](@fontsource[^'"]+)['"]/g)]
    .map((m) => `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/${m[1]}/index.css">`)
    .join('\n')
}

/** Classes the preview scaffolding adds around a render. All exist in ads.css. */
export const SCAFFOLD_CLASSES = ['ads-label', 'ads-icon-button', 'is-round']

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * A self-contained HTML document: the kit's CSS plus the rendered components'
 * own styles, inlined, with a light/dark switch.
 */
export function buildHtmlDocument(title: string, body: string, componentStyles: string, theme: 'light' | 'dark' = 'light'): string {
  const themeAttr = theme === 'dark' ? ' data-theme="dark"' : ''
  const script =
    "(function(){var d=document.documentElement;var t=document.getElementById('theme');if(t){t.onclick=function(){if(d.dataset.theme==='dark'){delete d.dataset.theme}else{d.dataset.theme='dark'}}}})()"
  return `<!doctype html>
<html lang="en"${themeAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} · Artelier UI Kit</title>
${fontLinks()}
<style>
${readGlobalCss()}
${componentStyles}
/* preview scaffolding */
body { margin: 0; padding: var(--sp-6, 32px); display: grid; gap: var(--sp-5, 24px); align-content: start; }
body > header { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-4, 16px); }
</style>
</head>
<body>
<header>
  <span class="ads-label">${escapeHtml(title)}</span>
  <button id="theme" class="ads-icon-button is-round" type="button" aria-label="Switch theme">◐</button>
</header>
<main>
${body}
</main>
<script>${script}<\/script>
</body>
</html>`
}

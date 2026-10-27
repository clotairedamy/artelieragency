import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const ROOT = fileURLToPath(new URL('../../', import.meta.url))

const CSS_FILES = ['tokens.css', 'base.css', 'ads.css', 'ads-utility.css']

let globalCssCache: string | null = null

/** The full ADS stylesheet (tokens + base + component layer + utility). */
export function readGlobalCss(): string {
  if (globalCssCache) return globalCssCache
  globalCssCache = CSS_FILES.map((f) => readFileSync(`${ROOT}/app/assets/css/${f}`, 'utf8')).join('\n')
  return globalCssCache
}

/** Extract a .vue file's <style> blocks, de-scoped for a standalone preview. */
export function extractStyles(source: string): string {
  const out: string[] = []
  for (const m of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    let css = m[1] ?? ''
    css = css.replace(/:deep\(([^)]*)\)/g, '$1')
    css = css.replace(/:global\(([^)]*)\)/g, '$1')
    out.push(css)
  }
  return out.join('\n')
}

/**
 * Build a self-contained HTML document for a component render: the real ADS
 * CSS plus the component's own styles, inlined, with a light/dark toggle.
 */
export function buildHtmlDocument(title: string, body: string, componentStyles: string, theme: 'light' | 'dark' = 'light'): string {
  const themeAttr = theme === 'dark' ? ' data-theme="dark"' : ''
  const script =
    "(function(){var d=document.documentElement;var t=document.getElementById('theme');if(t){t.onclick=function(){var dark=d.dataset.theme!=='dark';d.dataset.theme=dark?'dark':undefined;try{localStorage.setItem('artelier:theme',dark?'dark':'light')}catch(e){}}}})()"
  return `<!doctype html>
<html lang="en"${themeAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ADS</title>
<style>
${readGlobalCss()}
${componentStyles}
/* preview scaffolding */
body { margin: 0; padding: 32px; display: grid; gap: 24px; align-content: start; }
.preview-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.ads-label { font-family: var(--font-label); font-size: 0.6rem; letter-spacing: .12em; text-transform: uppercase; color: var(--subdued); }
</style>
</head>
<body>
<div class="preview-toolbar">
  <span class="ads-label">${title}</span>
  <button id="theme" class="ads-icon-button is-round" type="button" aria-label="Toggle theme">◐</button>
</div>
${body}
<script>${script}<\/script>
</body>
</html>`
}

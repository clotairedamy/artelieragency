// Writes every glyph in app/utils/glyphs.ts to public/brand/icons/*.svg, so
// the set can be used outside the site — decks, social cards, Figma — without
// anyone redrawing it. glyphs.ts stays the one source of truth: run
// `npm run icons` after changing it. (Node 24 strips the types itself.)
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { glyphs } from '../app/utils/glyphs.ts'

const SOFT = 0.38
const out = new URL('../public/brand/icons/', import.meta.url)
await rm(out, { recursive: true, force: true })
await mkdir(out, { recursive: true })

const attrs = (l) =>
  (l.soft ? ` opacity="${SOFT}"` : '') + (l.fill ? ' fill="currentColor" stroke="none"' : '')

const layer = (l) => {
  if ('d' in l) return `<path d="${l.d}"${attrs(l)}/>`
  if ('rect' in l) {
    const [x, y, w, h, r] = l.rect
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"${attrs(l)}/>`
  }
  const [cx, cy, r] = l.circle
  return `<circle cx="${cx}" cy="${cy}" r="${r}"${attrs(l)}/>`
}

for (const [name, g] of Object.entries(glyphs)) {
  const body = (typeof g === 'string' ? [{ d: g }] : g).map(layer).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`
  await writeFile(new URL(`${name}.svg`, out), svg)
}

console.log(`Wrote ${Object.keys(glyphs).length} icons to public/brand/icons/`)

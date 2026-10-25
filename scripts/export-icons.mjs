// Writes every glyph in app/components/Icon.vue to public/brand/icons/*.svg,
// so the set can be used outside the site — decks, social cards, Figma —
// without anyone redrawing it. Icon.vue stays the one source of truth: run
// `npm run icons` after changing a path there.
import { readFile, writeFile, mkdir } from 'node:fs/promises'

const source = await readFile(new URL('../app/components/Icon.vue', import.meta.url), 'utf8')
const glyphs = [...source.matchAll(/^\s+([a-z]+): '([^']+)',$/gm)]
const out = new URL('../public/brand/icons/', import.meta.url)
await mkdir(out, { recursive: true })

for (const [, name, d] of glyphs) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>\n`
  await writeFile(new URL(`${name}.svg`, out), svg)
}

console.log(`Wrote ${glyphs.length} icons to public/brand/icons/`)

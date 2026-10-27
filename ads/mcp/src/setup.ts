// How to install each kit, assembled from the files that define it: the Nuxt
// layer's nuxt.config.ts and package.json for Vue, the crate's Cargo.toml,
// README and assets/css/ for Rust. Nothing here is a copy of those files.
import { join, relative } from 'node:path'
import { ADS_ROOT, GLOBAL_CSS, REPO_ROOT, RUST_CSS_DIR, RUST_ROOT, VUE_CSS_DIR, exists, readText, rel, walk } from './paths.js'

export type Setup = {
  kit: 'vue' | 'rust'
  summary: string
  steps: { title: string; detail: string; code?: string; language?: string }[]
  sources: string[]
  notes: string[]
}

/** The `@fontsource…` packages the layer's nuxt.config.ts loads. */
function layerFonts(): string[] {
  const cfg = readText(join(ADS_ROOT, 'nuxt.config.ts')) ?? ''
  return [...cfg.matchAll(/['"](@fontsource[^'"]+)['"]/g)].map((m) => m[1]!)
}

function tomlValue(toml: string, section: string, key: string): string | undefined {
  const block = toml.split(/^\[/m).find((b) => b.startsWith(`${section}]`))
  const m = block?.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, 'm'))
  return m?.[1]?.trim()
}

export function vueSetup(example?: string): Setup {
  const notes: string[] = []
  const pkg = JSON.parse(readText(join(ADS_ROOT, 'package.json')) ?? '{}') as { name?: string; dependencies?: Record<string, string> }
  const deps = Object.entries(pkg.dependencies ?? {}).filter(([n]) => n !== 'nuxt')
  const nuxt = pkg.dependencies?.nuxt
  const fonts = layerFonts()
  const css = GLOBAL_CSS.filter((f) => exists(join(VUE_CSS_DIR, f)))
  if (!readText(join(ADS_ROOT, 'nuxt.config.ts'))) notes.push('ads/nuxt.config.ts not found; the layer may have moved.')
  return {
    kit: 'vue',
    summary: `The Vue kit is a Nuxt layer${nuxt ? ` (Nuxt ${nuxt})` : ''}. Extend it and every component in app/components/, every composable and the stylesheets auto-import; there is nothing to register.`,
    steps: [
      {
        title: 'Copy the layer',
        detail: 'Copy the `ads/` folder into the root of your Nuxt app (or keep it as a sibling and point at it with a relative path).',
      },
      {
        title: 'Extend it',
        detail: 'Add the layer to nuxt.config.ts.',
        language: 'ts',
        code: "// nuxt.config.ts\nexport default defineNuxtConfig({\n  extends: ['./ads'],\n})",
      },
      {
        title: 'Install the layer\'s dependencies',
        detail: `The layer loads its fonts from npm (${fonts.join(', ') || 'see ads/package.json'}).`,
        language: 'sh',
        code: `npm install ${deps.map(([n, v]) => `${n}@${v}`).join(' ')}`,
      },
      {
        title: 'Use the components',
        detail: `No imports needed. The layer's CSS (${css.join(', ')}) is loaded for you; light is the default, dark is data-theme="dark" on <html> (useTheme() toggles it).`,
        language: 'vue',
        code: example ?? '<template>\n  <AdsButton variant="accent" icon="plus">New project</AdsButton>\n</template>',
      },
    ],
    sources: [rel(join(ADS_ROOT, 'nuxt.config.ts')), rel(join(ADS_ROOT, 'package.json'))],
    notes,
  }
}

export function rustSetup(example?: string): Setup {
  const notes: string[] = []
  const toml = readText(join(RUST_ROOT, 'Cargo.toml'))
  if (!toml) {
    return {
      kit: 'rust',
      summary: `The Rust crate was not found at ${rel(RUST_ROOT)}. Set ARTELIER_ADS_RS to its folder.`,
      steps: [],
      sources: [],
      notes: ['No Cargo.toml, so no setup could be read.'],
    }
  }
  const pkgName = (tomlValue(toml, 'package', 'name') ?? '"ads"').replace(/"/g, '')
  const libName = (tomlValue(toml, 'lib', 'name') ?? `"${pkgName}"`).replace(/"/g, '')
  const dioxus = tomlValue(toml, 'dependencies', 'dioxus') ?? '"0.7"'
  const dioxusVersion = dioxus.startsWith('{') ? (dioxus.match(/version\s*=\s*"([^"]+)"/)?.[1] ?? '0.7') : dioxus.replace(/"/g, '')
  const cssFiles = walk(RUST_CSS_DIR, ['.css']).map((f) => relative(RUST_CSS_DIR, f))
  const order = [...GLOBAL_CSS, 'components.css']
  cssFiles.sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))
  const fonts = layerFonts()
  const depPath = relative(REPO_ROOT, RUST_ROOT)
  const crateDep = pkgName === libName ? `${pkgName} = { path = "../${depPath}" }` : `${libName} = { package = "${pkgName}", path = "../${depPath}" }`
  const links = cssFiles.map((f) => `        document::Stylesheet { href: asset!("/assets/ads/${f}") }`).join('\n')

  return {
    kit: 'rust',
    summary: `The Rust kit is the \`${pkgName}\` crate: Dioxus ${dioxusVersion.replace(/^[=^~]/, '')} components that render the same classes as the Vue kit. Add it as a path dependency and load its ${cssFiles.length} stylesheets.`,
    steps: [
      {
        title: 'Add the crate',
        detail: `Path dependency (adjust the path to where ${depPath} sits relative to your crate). Pin Dioxus to the version the kit is built against.`,
        language: 'toml',
        code: `# Cargo.toml\n[dependencies]\n${crateDep}\ndioxus = { version = "${dioxusVersion}", features = ["web"] }`,
      },
      {
        title: 'Load the stylesheets',
        detail: `Copy the files in ${rel(RUST_CSS_DIR)}/ (${cssFiles.join(', ')}) into assets/ads/ in your app and load them in this order. components.css holds the components' own styles; without it the components render unstyled. Light is the default; dark is data-theme="dark" on <html>.`,
        language: 'rust',
        code: `use dioxus::prelude::*;\n\n#[component]\nfn App() -> Element {\n    rsx! {\n${links}\n        // …your app\n    }\n}`,
      },
      {
        title: 'Load the fonts',
        detail: `The tokens name four variable fonts. The Vue layer loads them from npm (${fonts.join(', ')}); in a Dioxus app self-host the same families or link them, otherwise the type falls back to system faces.`,
      },
      {
        title: 'Use the components',
        detail: `Import from the crate's modules (\`${libName}::ui\`, \`${libName}::charts\`, \`${libName}::blocks\`, \`${libName}::Icon\`). get_component_schema with kit "rust" gives each component's exact path and props.`,
        language: 'rust',
        code: example ?? `use dioxus::prelude::*;\nuse ${libName}::ui::{AdsButton, ButtonVariant};\n\n#[component]\nfn Toolbar() -> Element {\n    rsx! {\n        AdsButton { variant: ButtonVariant::Accent, icon: "plus", "New project" }\n    }\n}`,
      },
    ],
    sources: [rel(join(RUST_ROOT, 'Cargo.toml')), rel(join(RUST_ROOT, 'README.md')), rel(RUST_CSS_DIR)],
    notes: [
      'Stateful controls are controlled: pass a value plus an on* handler (or a Signal) where Vue uses v-model.',
      ...notes,
    ],
  }
}

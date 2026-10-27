// ADS — Artelier Design System. A Nuxt **layer**: a UI kit of tokens, CSS,
// components and composables with no pages of its own. Extend it from any
// Nuxt app and everything below auto-imports.
//
//   export default defineNuxtConfig({ extends: ['@artelier/ads'] })
import { fileURLToPath } from 'node:url'

// Layer-relative path: `~/...` in a layer's `css` array resolves against the
// *consumer*, so resolve the stylesheets against this file instead.
const css = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',

  // Components auto-import by filename (all live flat in app/components/).
  css: [
    '@fontsource-variable/bricolage-grotesque',
    '@fontsource-variable/inter-tight',
    '@fontsource-variable/martian-mono',
    '@fontsource-variable/jetbrains-mono',
    css('./app/assets/css/tokens.css'),
    css('./app/assets/css/base.css'),
    css('./app/assets/css/ads.css'),
    css('./app/assets/css/ads-utility.css'),
  ],

  app: {
    head: {
      // Applies a saved dark theme before first paint (read by useTheme).
      // Light needs no attribute, so a visitor without JS gets the default.
      script: [
        {
          innerHTML:
            "(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('artelier:theme')==='dark'){d.dataset.theme='dark';var m=document.querySelector('meta[name=theme-color]');m&&m.setAttribute('content','#131315')}}catch(e){}})()",
        },
      ],
    },
  },
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  // The site is built on ADS, the Artelier Design System, kept in ads/ as a
  // Nuxt layer: its tokens, fonts, stylesheets, components and composables
  // all auto-import from there. The site never overrides a kit component —
  // the /ui-kit pages preview the kit's — it wraps one instead and
  // passes its own copy (StudioFooter, StudioCta). The kit's docs, under
  // /ui-kit, are a second layer beside it so other sites can show them too.
  extends: ['./ads', './ads/ui-kit'],

  // Only what the site adds on top of the kit.
  css: ['~/assets/css/main.css'],

  app: {
    // Vue's own transition, applied between routes. Classes live in main.css
    // and collapse to nothing under prefers-reduced-motion.
    pageTransition: { name: 'page', mode: 'out-in' },

    // GitHub Pages serves artelier.agency from the domain root (see public/CNAME).
    baseURL: '/',
    buildAssetsDir: '/assets/',
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#e2e2e6' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
        { property: 'og:site_name', content: 'Artelier' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      // Runs before first paint. Marks JS as available, so CSS can hide
      // not-yet-revealed sections only when JS will reveal them, and applies a
      // saved dark theme before anything is drawn — light needs no attribute,
      // so a visitor without JS or a saved choice simply gets the default.
      script: [
        {
          innerHTML:
            "(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('artelier:theme')==='dark'){d.dataset.theme='dark';var m=document.querySelector('meta[name=theme-color]');m&&m.setAttribute('content','#131315')}}catch(e){}})()",
        },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/app-icon.svg' }],
    },
  },

  nitro: {
    // Static output only: GitHub Pages cannot run functions.
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      // The crawler finds the rest from these. The component docs are named
      // too, so a broken link in the rail cannot quietly drop them.
      routes: ['/', '/design-system', '/dashboard-example', '/ui-kit', '/ui-kit/rust', '/sitemap.xml'],
      failOnError: true,
      // Write /contact as contact.html rather than contact/index.html, so GitHub
      // Pages answers /contact with a 200 instead of redirecting to /contact/.
      autoSubfolderIndex: false,
    },
  },
})

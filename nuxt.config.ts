// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  css: [
    '@fontsource-variable/bricolage-grotesque',
    '@fontsource-variable/inter-tight',
    '@fontsource-variable/martian-mono',
    '@fontsource-variable/jetbrains-mono',
    '~/assets/css/main.css',
    '~/assets/css/ads.css',
  ],

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
        { name: 'theme-color', content: '#131315' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1' },
        { property: 'og:site_name', content: 'Artelier' },
        { property: 'og:locale', content: 'en_US' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      // Lets CSS hide not-yet-revealed sections only when JS will reveal them.
      script: [{ innerHTML: "document.documentElement.classList.add('js')" }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/mark.svg' }],
    },
  },

  nitro: {
    // Static output only: GitHub Pages cannot run functions.
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      // /design-system is not linked from anywhere yet, so the crawler
      // cannot find it. Named here so it still builds.
      routes: ['/', '/design-system', '/dashboard-example', '/sitemap.xml'],
      failOnError: true,
      // Write /contact as contact.html rather than contact/index.html, so GitHub
      // Pages answers /contact with a 200 instead of redirecting to /contact/.
      autoSubfolderIndex: false,
    },
  },
})

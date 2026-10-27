// The Artelier UI Kit's docs, as a Nuxt layer of their own: the /ui-kit
// pages, the pieces they are made of, and the kits' categories (app.config).
// Kept apart from the kit (../) so a site can show the docs without taking on
// everything else the kit brings.
//
// What the site provides:
//   - the kit's components, composables and styles: extend ../ (artelier.agency
//     does), or register them yourself (clotairedamy.com does);
//   - a `ui-kit` layout, which every page here asks for;
//   - useSeo({ title, description, path }), for each page's title and canonical.
export default defineNuxtConfig({})

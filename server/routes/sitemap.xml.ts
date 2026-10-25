// Written at prerender time; GitHub Pages serves the result as a static file.
const routes = ['/', '/design-system', '/dashboard-example', '/contact', '/privacy']

export default defineEventHandler((event) => {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .map(
      (r) =>
        `  <url><loc>https://artelier.agency${r}</loc><lastmod>${today}</lastmod>` +
        `<priority>${r === '/' ? '1.0' : '0.6'}</priority></url>`,
    )
    .join('\n')

  setHeader(event, 'content-type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
})

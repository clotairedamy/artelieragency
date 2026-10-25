/** Page title, description and canonical in one call. */
export function useSeo(opts: { title: string; description: string; path?: string }) {
  const { studio } = useAppConfig()
  const url = `https://${studio.domain}${opts.path ?? '/'}`
  const full = opts.path === '/' || !opts.path ? `${studio.name} — ${studio.tagline}` : `${opts.title} · ${studio.name}`

  useHead({
    title: full,
    meta: [
      { name: 'description', content: opts.description },
      { property: 'og:title', content: full },
      { property: 'og:description', content: opts.description },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
    ],
    link: [{ rel: 'canonical', href: url }],
  })
}

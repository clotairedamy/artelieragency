<script setup lang="ts">
// The footer, shaped like the studio site's own: one quiet row under a
// hairline — the mark, the domain in mono, the links, the year in mono. A
// larger site can pass `columns` for a sitemap above that row. Nothing here
// is raised or coloured; the footer is the last place to spend attention.
// Like the site, the row shows the bare mark; pass brandName to spell it out.
export type FooterLink = { to: string; label: string }
export type FooterColumn = { title: string; links: FooterLink[] }

withDefaults(
  defineProps<{
    links?: FooterLink[]
    columns?: FooterColumn[]
    description?: string
    domain?: string
    email?: string
    owner?: string
    /** Makes the owner a link, e.g. to their own site. */
    ownerHref?: string
    brandName?: string
  }>(),
  {
    links: () => [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/contact', label: 'Contact' },
      { to: '/privacy', label: 'Privacy' },
    ],
    columns: () => [],
    description: '',
    domain: '',
    email: '',
    owner: '',
    ownerHref: '',
    brandName: '',
  },
)

const year = new Date().getFullYear()
// The address as people say it: no scheme, no www, no trailing slash.
const host = (href: string) => href.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
</script>

<template>
  <footer class="ads-site-footer">
    <div class="ads-site-footer__inner max">
      <div v-if="columns.length" class="ads-site-footer__sitemap">
        <p v-if="description" class="ads-site-footer__desc">{{ description }}</p>
        <nav v-for="col in columns" :key="col.title" class="ads-site-footer__col" :aria-label="col.title">
          <span class="eyebrow">{{ col.title }}</span>
          <NuxtLink v-for="l in col.links" :key="l.to + l.label" :to="l.to" class="ads-site-footer__link">{{ l.label }}</NuxtLink>
        </nav>
      </div>

      <div class="ads-site-footer__bar">
        <div class="ads-site-footer__brand">
          <BrandMark :size="24" />
          <Wordmark v-if="brandName" :text="brandName" :size="15" />
          <span v-if="domain" class="num ads-site-footer__domain">{{ domain }}</span>
        </div>
        <nav v-if="links.length || email" class="ads-site-footer__links" aria-label="Footer">
          <NuxtLink v-for="l in links" :key="l.to + l.label" :to="l.to" class="ads-site-footer__link">{{ l.label }}</NuxtLink>
          <a v-if="email" :href="`mailto:${email}`" class="ads-site-footer__link">{{ email }}</a>
        </nav>
        <!-- © year, the owner, and the owner's own site spelled out, so the
             credit says where it goes. The gap spaces them, not the markup. -->
        <span class="ads-site-footer__copy">
          <span class="num">© {{ year }}</span>
          <span v-if="owner" class="ads-site-footer__owner">{{ owner }}</span>
          <template v-if="ownerHref">
            <span class="ads-site-footer__dot" aria-hidden="true">·</span>
            <a :href="ownerHref" rel="author" class="num ads-site-footer__link">{{ host(ownerHref) }}</a>
          </template>
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ads-site-footer {
  padding: var(--sp-5) clamp(20px, 4vw, 48px) var(--sp-6);
  border-top: 1px solid var(--line);
}

.ads-site-footer__inner {
  display: grid;
  gap: var(--sp-6);
}

.ads-site-footer__sitemap {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));
  gap: var(--sp-6) var(--sp-5);
  padding-top: var(--sp-6);
}

.ads-site-footer__desc {
  max-width: 32ch;
  font-size: 0.9rem;
  color: var(--subdued);
}

.ads-site-footer__col {
  display: grid;
  gap: var(--sp-3);
  align-content: start;
  justify-items: start;
}

.ads-site-footer__col .eyebrow {
  margin-bottom: var(--sp-1);
}

.ads-site-footer__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-4) var(--sp-5);
  font-size: 0.84rem;
  color: var(--subdued);
}

.ads-site-footer__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  color: var(--text-soft);
}

.ads-site-footer__domain {
  font-size: 0.8rem;
}

.ads-site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-5);
  margin-left: auto;
}

.ads-site-footer__link {
  color: var(--subdued);
  transition: color var(--dur-control) var(--ease);
}

.ads-site-footer__col .ads-site-footer__link {
  color: var(--text-soft);
  font-size: 0.9rem;
}

.ads-site-footer__link:hover {
  color: var(--text);
}

.ads-site-footer__copy {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--sp-2);
  font-size: 0.78rem;
}

.ads-site-footer__owner {
  color: var(--text-soft);
}

.ads-site-footer__dot {
  color: var(--subdued);
}

/* On one row the credit follows the links, so a hairline sets it apart
   from them; once the row wraps it starts a line of its own and needs none. */
@media (min-width: 900px) {
  .ads-site-footer__copy {
    padding-left: var(--sp-5);
    border-left: 1px solid var(--line);
  }
}
</style>

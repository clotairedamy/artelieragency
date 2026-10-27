<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Page sections · Artelier UI Kit for Rust',
  description: 'The marketing sections, in rsx!.',
  path: '/ui-kit/rust/sections',
})
const { usage, source } = useRustDocs()
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Page sections</p>
      <h1 class="title face-display">Page sections</h1>
      <p class="lede">The marketing sections, in rsx!.</p>
    </header>

    <RustDoc id="r-sitenav" name="SiteNav" description="Site navigation: brand, links, theme toggle, CTA, and a phone sheet." :code="usage.SiteNav" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><SiteNav :links="[{ label: 'Work', to: '/ui-kit' }, { label: 'Studio', to: '/ui-kit' }]" cta-to="/ui-kit" /></RustDoc>
    <RustDoc id="r-hero" name="HeroSection" description="A hero: eyebrow, title, lead, actions, visual." :code="usage.HeroSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><HeroSection eyebrow="Studio" title="The dashboard your users live in." lead="Grey chrome, coloured data."><template #actions><NuxtLink class="btn btn-accent" to="/ui-kit">Start a project</NuxtLink></template><template #visual><div class="block" style="min-height:120px" /></template></HeroSection></RustDoc>
    <RustDoc id="r-featuregrid" name="FeatureGrid" description="A grid of feature cards." :code="usage.FeatureGrid" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><FeatureGrid :features="[{ icon: 'chart', title: 'Charts', body: 'Hand-drawn.' }, { icon: 'system', title: 'System', body: 'Tokens first.' }, { icon: 'compass', title: 'Compass', body: 'Find your way.' }]" /></RustDoc>
    <RustDoc id="r-logomarquee" name="LogoMarquee" description="A row of wordmarks." :code="usage.LogoMarquee" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><LogoMarquee :names="['CrawlStat', 'Artelier', 'Studio']" /></RustDoc>
    <RustDoc id="r-pricing" name="PricingSection" description="A pricing grid." :code="usage.PricingSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><PricingSection :plans="[{ name: 'Starter', price: '€900', period: '/mo', description: 'For a first crawl.', features: ['One site', 'Monthly crawl'], cta: 'Choose Starter', featured: false }, { name: 'Studio', price: '€2,400', period: '/mo', description: 'Ongoing.', features: ['Unlimited sites', 'Weekly crawls'], cta: 'Start a project', featured: true }]" /></RustDoc>
    <RustDoc id="r-faq" name="FaqSection" description="An FAQ accordion." :code="usage.FaqSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><FaqSection :faqs="[{ title: 'Why is the chrome grey?', body: 'So colour means something when it appears.' }]" /></RustDoc>
    <RustDoc id="r-ctaband" name="CtaBand" description="A call-to-action band." :code="usage.CtaBand" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><CtaBand eyebrow="New project" title="Start a project" body="Every price is public." cta-label="Get a price" cta-to="/ui-kit" /></RustDoc>
    <RustDoc id="r-contactform" name="ContactForm" description="A contact form with inline validation and a consent box." :code="usage.ContactForm" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><div style="max-width:480px"><ContactForm privacy-to="/ui-kit" /></div></RustDoc>
    <RustDoc id="r-content" name="ContentSection" description="A section head over free content." :code="usage.ContentSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><ContentSection eyebrow="Why" title="What we do" lead="A design and data studio."><p class="body">Design and data.</p></ContentSection></RustDoc>
    <RustDoc id="r-image" name="ImageSection" description="Copy beside a framed visual; flip swaps the sides." :code="usage.ImageSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><ImageSection eyebrow="Soft UI" title="See the work" body="Depth is the only decoration." flip><div class="block" style="min-height:120px" /></ImageSection></RustDoc>
    <RustDoc id="r-sitefooter" name="SiteFooter" description="Site footer: mark, domain, links, year." :code="usage.SiteFooter" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><SiteFooter domain="artelier.agency" owner="Clotaire" owner-href="https://clotairedamy.com" :links="[{ to: '/', label: 'Overview' }, { to: '/contact', label: 'Contact' }]" /></RustDoc>
    <RustDoc id="r-screentour" name="ScreenTour" description="A product tour: tabs over a screen, with the copy beside it." :code="usage.ScreenTour" file="blocks/screen_tour.rs" :source="source('blocks/screen_tour.rs')"><ScreenTour :screens="[{ id: 'overview', label: 'Overview', title: 'The week at a glance', body: 'Every number that moved.' }, { id: 'results', label: 'Results', title: 'Every URL', body: 'With its status.' }]"><div class="block" style="min-height:120px" /></ScreenTour></RustDoc>
    <RustDoc id="r-statement" name="StatementSection" description="A few deliberate lines, then a ruled ledger of facts." :code="usage.StatementSection" file="blocks/statement.rs" :source="source('blocks/statement.rs')"><StatementSection :lines="['Less, but', 'done well.']" :facts="[{ term: 'Founded', value: '2019' }]" /></RustDoc>
    <RustDoc id="r-story" name="StorySection" description="A narrative with the rest one click away." :code="usage.StorySection" file="blocks/story.rs" :source="source('blocks/story.rs')"><StorySection :body="['We build the screens people live in.']" :more="['And the data behind them.']" /></RustDoc>
    <RustDoc id="r-worklist" name="WorkList" description="The work as a list; a row without an address is plain text." :code="usage.WorkList" file="blocks/work_list.rs" :source="source('blocks/work_list.rs')"><WorkList :items="[{ name: 'CrawlStat', kind: 'Product', words: 'A crawler that reads like a report.', href: '/ui-kit' }, { name: 'Artelier', kind: 'Studio', words: 'This kit.' }]" /></RustDoc>
    <RustDoc id="r-worksection" name="WorkSection" description="The work as a grid of project cards." :code="usage.WorkSection" file="blocks/work_section.rs" :source="source('blocks/work_section.rs')"><WorkSection :items="[{ name: 'CrawlStat', kind: 'Product', description: 'A crawler that reads like a report.', tags: ['Rust', 'Data'], href: 'https://crawlstat.com' }]" /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

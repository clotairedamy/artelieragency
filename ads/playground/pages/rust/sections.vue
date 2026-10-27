<script setup lang="ts">
const { usage, source } = useRustDocs()
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier Rust · Page sections</p>
      <h1 class="title face-display">Page sections</h1>
      <p class="lede">The marketing sections, in rsx!.</p>
    </header>

    <RustDoc id="r-sitenav" name="SiteNav" description="Site navigation: brand, links, CTA." :code="usage.SiteNav" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><SiteNav :links="[{ label: 'Work', to: '/vue' }, { label: 'Studio', to: '/vue' }]" cta-to="/vue" /></RustDoc>
    <RustDoc id="r-hero" name="HeroSection" description="A hero: eyebrow, title, lead, visual." :code="usage.HeroSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><HeroSection eyebrow="Studio" title="The dashboard your users live in." lead="Grey chrome, coloured data."><div class="block" style="min-height:120px" /></HeroSection></RustDoc>
    <RustDoc id="r-featuregrid" name="FeatureGrid" description="A grid of feature cards." :code="usage.FeatureGrid" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><FeatureGrid :features="[{ icon: 'chart', title: 'Charts', body: 'Hand-drawn.' }, { icon: 'system', title: 'System', body: 'Tokens first.' }, { icon: 'compass', title: 'Compass', body: 'Find your way.' }]" /></RustDoc>
    <RustDoc id="r-logomarquee" name="LogoMarquee" description="A marquee of wordmarks." :code="usage.LogoMarquee" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><LogoMarquee :names="['CrawlStat', 'Artelier', 'Studio']" /></RustDoc>
    <RustDoc id="r-pricing" name="PricingSection" description="A pricing grid." :code="usage.PricingSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><PricingSection :plans="[{ name: 'Starter', price: '900', period: 'mo', description: 'For a first crawl.', features: ['One site', 'Monthly crawl'], featured: false }, { name: 'Studio', price: '2,400', period: 'mo', description: 'Ongoing.', features: ['Unlimited sites', 'Weekly crawls'], featured: true }]" /></RustDoc>
    <RustDoc id="r-faq" name="FaqSection" description="An FAQ accordion." :code="usage.FaqSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><FaqSection :faqs="[{ q: 'Why is the chrome grey?', a: 'So colour means something when it appears.' }]" /></RustDoc>
    <RustDoc id="r-ctaband" name="CtaBand" description="A call-to-action band." :code="usage.CtaBand" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><CtaBand title="Start a project" body="Every price is public." cta-label="Get a price" /></RustDoc>
    <RustDoc id="r-contactform" name="ContactForm" description="A contact form." :code="usage.ContactForm" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><div style="max-width:480px"><ContactForm /></div></RustDoc>
    <RustDoc id="r-content" name="ContentSection" description="A content section." :code="usage.ContentSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><ContentSection title="What we do"><p class="body">Design and data.</p></ContentSection></RustDoc>
    <RustDoc id="r-image" name="ImageSection" description="An image section." :code="usage.ImageSection" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><ImageSection title="See the work"><div class="block" style="min-height:120px" /></ImageSection></RustDoc>
    <RustDoc id="r-sitefooter" name="SiteFooter" description="Site footer." :code="usage.SiteFooter" file="blocks/sections.rs" :source="source('blocks/sections.rs')"><SiteFooter /></RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

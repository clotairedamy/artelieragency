<script setup lang="ts">
// Section components: the page-level blocks you drop into a route and feed a
// couple of props.
const features = [
  { icon: 'gauge', title: 'Grey chrome', body: 'Interface colour and data colour compete; give the data the channel.' },
  { icon: 'layers', title: 'Depth only', body: 'No borders. Two shadows on a matching surface are the whole decoration.' },
  { icon: 'table', title: 'Monospaced numbers', body: 'Counts and codes line up column to column.' },
]

const plans = [
  { name: 'Starter', price: '$0', description: 'For trying the kit.', features: ['Tokens & utilities', 'Sections'], cta: 'Start free' },
  { name: 'Studio', price: '$49', period: '/mo', description: 'For shipping dashboards.', features: ['Everything in Starter', 'Dashboard', 'Support'], cta: 'Start a project', featured: true },
]

const faqs = [
  { title: 'Why is the chrome grey?', body: 'So colour means something when it finally shows up.' },
  { title: 'Is this Tailwind?', body: 'No — ADS is its own token-driven utility layer.' },
]

const navCode = `<SiteNav
  :links="[{ to: '/', label: 'Overview' }, { to: '/dashboard', label: 'Dashboard' }]"
  cta-to="/contact" cta-label="Start a project" />`

const footerCode = `<SiteFooter :columns="[{ title: 'Product', links: [{ to: '/', label: 'Docs' }] }]" />`

const heroCode = `<HeroSection eyebrow="Studio" title="The dashboard your users live in" lead="…" align="center">
  <template #actions><NuxtLink to="/contact" class="btn btn-accent">Start</NuxtLink></template>
  <template #visual><AdsBars :data="bars" /></template>
</HeroSection>`

const contentCode = `<ContentSection eyebrow="Why" title="A system, not a style guide" lead="…">
  <FeatureGrid :features="features" />
</ContentSection>`

const imageCode = `<ImageSection eyebrow="Soft UI" title="Depth is the only decoration" body="…" flip>
  <AdsGauge :value="64" label="Scroll" unit="%" />
</ImageSection>`

const featureCode = `<FeatureGrid :features="[{ icon: 'gauge', title: 'Grey chrome', body: '…' }]" :columns="3" />`

const logoCode = `<LogoMarquee :names="['Northwind', 'Vantage', 'Halo']" />`

const pricingCode = `<PricingSection :plans="[
  { name: 'Studio', price: '$49', period: '/mo', description: '…', features: ['Dashboard'], cta: 'Start', featured: true },
]" @select="onSelect" />`

const faqCode = `<FaqSection :faqs="[{ title: 'Why grey?', body: '…' }]" />`

const ctaCode = `<CtaBand title="Build the dashboard your users live in" cta-label="Start a project" cta-to="/contact" />`

const contactCode = `<ContactForm />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Sections</p>
      <h1 class="title face-display">Page sections</h1>
      <p class="lede">Navigation, heroes, footers and the content blocks between them.</p>
    </header>

    <ComponentDoc
      id="sitenav"
      name="SiteNav"
      description="Sticky navigation: brand, links, one accent CTA and the theme switch. Collapses to a burger on a phone."
      :code="navCode"
      :props="[
        { name: 'links', type: '{ to, label }[]', default: '3 defaults', desc: 'Navigation links.' },
        { name: 'ctaTo', type: 'string', default: '/contact', desc: 'Destination of the accent CTA.' },
        { name: 'ctaLabel', type: 'string', default: 'Start a project', desc: 'Label of the accent CTA.' },
      ]"
    >
      <div class="block"><SiteNav :links="[{ to: '/', label: 'Overview' }, { to: '/dashboard', label: 'Dashboard' }, { to: '/contact', label: 'Contact' }]" cta-to="/contact" cta-label="Start a project" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="sitefooter"
      name="SiteFooter"
      description="Brand, link columns and a legal bar with back-to-top."
      :code="footerCode"
      :props="[
        { name: 'description', type: 'string', default: '…', desc: 'Studio blurb under the brand.' },
        { name: 'columns', type: '{ title, links[] }[]', default: '3 columns', desc: 'Footer link columns.' },
      ]"
    >
      <div class="block"><SiteFooter :columns="[{ title: 'Product', links: [{ to: '/', label: 'Overview' }, { to: '/contact', label: 'Contact' }] }]" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="herosection"
      name="HeroSection"
      description="A big display headline over an optional visual. Actions and visual are slots."
      :code="heroCode"
      :props="[
        { name: 'eyebrow', type: 'string', default: '', desc: 'Small label above the title.' },
        { name: 'title', type: 'string', default: '—', desc: 'The headline.' },
        { name: 'lead', type: 'string', default: '', desc: 'Supporting sentence.' },
        { name: 'align', type: 'center | left', default: 'center', desc: 'Text alignment.' },
      ]"
    >
      <div class="block"><HeroSection eyebrow="Studio" title="The dashboard your users live in" lead="Grey chrome, coloured data." align="center"><template #actions><span class="btn btn-accent">Start</span></template></HeroSection></div>
    </ComponentDoc>

    <ComponentDoc
      id="contentsection"
      name="ContentSection"
      description="A titled block — eyebrow, headline, lede — with any body in the default slot."
      :code="contentCode"
      :props="[
        { name: 'eyebrow', type: 'string', default: '' },
        { name: 'title', type: 'string', default: '—' },
        { name: 'lead', type: 'string', default: '' },
        { name: 'align', type: 'center | left', default: 'left' },
      ]"
    >
      <div class="block"><ContentSection eyebrow="Why" title="A system, not a style guide"><p class="ink-subdued">Depth is the only decoration.</p></ContentSection></div>
    </ComponentDoc>

    <ComponentDoc
      id="imagesection"
      name="ImageSection"
      description="Copy on one side, a soft-framed visual on the other. `flip` swaps them."
      :code="imageCode"
      :props="[
        { name: 'eyebrow', type: 'string', default: '' },
        { name: 'title', type: 'string', default: '—' },
        { name: 'body', type: 'string', default: '' },
        { name: 'flip', type: 'boolean', default: 'false', desc: 'Swap copy and visual.' },
      ]"
    >
      <div class="block"><ImageSection eyebrow="Soft UI" title="Depth is the only decoration" body="A raised surface is available; a pressed-in surface holds something."><AdsGauge :value="64" label="Scroll" unit="%" /></ImageSection></div>
    </ComponentDoc>

    <ComponentDoc
      id="featuregrid"
      name="FeatureGrid"
      description="A responsive grid of feature cards — glyph, title, line of body."
      :code="featureCode"
      :props="[
        { name: 'features', type: '{ icon, title, body }[]', default: '—' },
        { name: 'columns', type: '2 | 3 | 4', default: '3' },
      ]"
    >
      <div class="block"><FeatureGrid :features="features" :columns="3" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="logomarquee"
      name="LogoMarquee"
      description="A quiet row of wordmarks, kept monochrome so they never compete with data."
      :code="logoCode"
      :props="[{ name: 'names', type: 'string[]', default: '6 defaults', desc: 'Wordmarks to show.' }]"
    >
      <div class="block"><LogoMarquee :names="['Northwind', 'Vantage', 'Halo', 'Meridian']" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="pricingsection"
      name="PricingSection"
      description="Pricing cards. The featured plan earns the one accent."
      :code="pricingCode"
      :props="[{ name: 'plans', type: 'Plan[]', default: '—', desc: '{ name, price, period?, description, features[], cta, featured? }' }]"
    >
      <div class="block"><PricingSection :plans="plans" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="faqsection"
      name="FaqSection"
      description="Frequently asked questions on an accordion."
      :code="faqCode"
      :props="[{ name: 'faqs', type: '{ title, body }[]', default: '—' }]"
    >
      <div class="block"><FaqSection :faqs="faqs" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="ctaband"
      name="CtaBand"
      description="The closing call to action — one raised card, one accent button."
      :code="ctaCode"
      :props="[
        { name: 'title', type: 'string', default: '…' },
        { name: 'body', type: 'string', default: '…' },
        { name: 'ctaLabel', type: 'string', default: 'Start a project' },
        { name: 'ctaTo', type: 'string', default: '/contact' },
      ]"
    >
      <div class="block"><CtaBand /></div>
    </ComponentDoc>

    <ComponentDoc
      id="contactform"
      name="ContactForm"
      description="A full contact form (name, email, phone, message, consent) with a toast on submit."
      :code="contactCode"
    >
      <div class="block"><ContactForm /></div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title {
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  font-weight: 600;
}
</style>

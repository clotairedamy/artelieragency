<script setup lang="ts">
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Elements · Artelier UI Kit for Rust',
  description: 'The full set of building blocks, in rsx!.',
  path: '/ui-kit/rust/elements',
})
const { usage, source } = useRustDocs()
const selectVal = ref('')
const comboVal = ref('')
const otp = ref('')
const inputGroup = ref('')
const sheetOpen = ref(false)
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Artelier UI Kit · Rust · Elements</p>
      <h1 class="title face-display">Elements</h1>
      <p class="lede">The full set of building blocks, in rsx!.</p>
    </header>

    <h2 class="h2">Layout &amp; text</h2>
    <RustDoc id="r-typography" name="Typography" description="Text in one of the system's type roles." :code="usage.AdsTypography" file="ui/atom2.rs" :source="source('ui/atom2.rs')">
      <div class="stack gap-2"><AdsTypography role="display">Less, but done well.</AdsTypography><AdsTypography role="eyebrow">A quieter heading</AdsTypography></div>
    </RustDoc>
    <RustDoc id="r-aspect" name="AspectRatio" description="A container with a fixed aspect ratio." :code="usage.AdsAspectRatio" file="ui/atom2.rs" :source="source('ui/atom2.rs')">
      <div style="max-width: 280px"><AdsAspectRatio ratio="16 / 9"><div class="block" style="height:100%; display:grid; place-items:center">16 / 9</div></AdsAspectRatio></div>
    </RustDoc>
    <RustDoc id="r-label" name="Label" description="A form label." :code="usage.AdsLabel" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><AdsLabel>Email address</AdsLabel></RustDoc>
    <RustDoc id="r-kbd" name="Kbd" description="A keyboard key." :code="usage.AdsKbd" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="row gap-2"><AdsKbd :keys="['⌘','K']" /></div></RustDoc>
    <RustDoc id="r-marker" name="Marker" description="A status marker." :code="usage.AdsMarker" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="row gap-4"><AdsMarker label="Live" tone="ok" /><AdsMarker label="Paused" tone="warn" /></div></RustDoc>
    <RustDoc id="r-direction" name="Direction" description="An arrow rotated toward a direction." :code="usage.AdsDirection" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="row gap-4"><AdsDirection to="down" /><AdsDirection to="left" /></div></RustDoc>
    <RustDoc id="r-item" name="Item" description="A list item with an optional glyph." :code="usage.AdsItem" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="block" style="max-width:320px"><AdsItem icon="chart">Audience overview</AdsItem></div></RustDoc>
    <RustDoc id="r-bubble" name="Bubble" description="A chat bubble." :code="usage.AdsBubble" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="stack gap-3"><AdsBubble>Hello from the studio.</AdsBubble><AdsBubble mine>On it.</AdsBubble></div></RustDoc>

    <h2 class="h2">Inputs</h2>
    <RustDoc id="r-inputgroup" name="InputGroup" description="An input with a prefix/suffix addon." :code="usage.AdsInputGroup" file="ui/field2.rs" :source="source('ui/field2.rs')"><div style="max-width:340px"><AdsInputGroup v-model="inputGroup" label="Subdomain" prefix="https://" suffix=".artelier.app" /></div></RustDoc>
    <RustDoc id="r-otp" name="InputOtp" description="A one-time-password input." :code="usage.AdsInputOtp" file="ui/field2.rs" :source="source('ui/field2.rs')"><AdsInputOtp v-model="otp" :length="6" /></RustDoc>
    <RustDoc id="r-native" name="NativeSelect" description="A native select, styled as a well." :code="usage.AdsNativeSelect" file="ui/field2.rs" :source="source('ui/field2.rs')"><div style="max-width:240px"><AdsNativeSelect label="Device" :options="[{ label:'Desktop', value:'desktop' }]" /></div></RustDoc>
    <RustDoc id="r-select" name="Select" description="A custom select." :code="usage.AdsSelect" file="ui/field2.rs" :source="source('ui/field2.rs')"><div style="max-width:240px"><AdsSelect v-model="selectVal" label="Billing" :options="[{ label:'Monthly', value:'monthly' }, { label:'Yearly', value:'yearly' }]" /></div></RustDoc>
    <RustDoc id="r-combo" name="Combobox" description="A text field that filters a list as you type." :code="usage.AdsCombobox" file="ui/field2.rs" :source="source('ui/field2.rs')"><div style="max-width:260px"><AdsCombobox v-model="comboVal" label="Project" :options="[{ label:'CrawlStat', value:'crawlstat' }]" /></div></RustDoc>
    <RustDoc id="r-attachment" name="Attachment" description="A file attachment chip." :code="usage.AdsAttachment" file="ui/field2.rs" :source="source('ui/field2.rs')"><AdsAttachment name="report.pdf" size="1.2 MB" /></RustDoc>
    <RustDoc id="r-codeblock" name="CodeBlock" description="A code block with a copy button." :code="usage.AdsCodeBlock" file="ui/field2.rs" :source="source('ui/field2.rs')"><div style="max-width:420px"><AdsCodeBlock :code="'let chrome = grey;'" /></div></RustDoc>

    <h2 class="h2">Overlays &amp; navigation</h2>
    <RustDoc id="r-hovercard" name="HoverCard" description="A card that appears beside its trigger on hover." :code="usage.AdsHoverCard" file="ui/overlay2.rs" :source="source('ui/overlay2.rs')">
      <AdsHoverCard><template #trigger><AdsButton variant="quiet">Hover me</AdsButton></template>The card that appears beside it.</AdsHoverCard>
    </RustDoc>
    <RustDoc id="r-sheet" name="Sheet" description="A side sheet." :code="usage.AdsSheet" file="ui/overlay2.rs" :source="source('ui/overlay2.rs')">
      <AdsButton @click="sheetOpen = true">Open sheet</AdsButton>
      <AdsSheet v-model:open="sheetOpen" side="right" title="Details">A sheet slides in from the side.</AdsSheet>
    </RustDoc>
    <RustDoc id="r-context" name="ContextMenu" description="A context menu." :code="usage.AdsContextMenu" file="ui/overlay2.rs" :source="source('ui/overlay2.rs')">
      <div class="block" style="max-width:320px"><AdsContextMenu :items="[{ label:'Rename' }, { label:'Delete', destructive: true }]"><p class="body">Right-click this block.</p></AdsContextMenu></div>
    </RustDoc>
    <RustDoc id="r-menubar" name="Menubar" description="A horizontal menu bar." :code="usage.AdsMenubar" file="ui/nav2.rs" :source="source('ui/nav2.rs')">
      <AdsMenubar :items="[{ label:'File', children:[{ label:'New', to:'/ui-kit' }] }, { label:'Edit', to:'/ui-kit' }]" />
    </RustDoc>
    <RustDoc id="r-navmenu" name="NavMenu" description="A navigation menu with dropdowns." :code="usage.AdsNavMenu" file="ui/nav2.rs" :source="source('ui/nav2.rs')">
      <AdsNavMenu :links="[{ label:'Work', to:'/ui-kit', children:[{ label:'CrawlStat', to:'/ui-kit' }] }]" />
    </RustDoc>

    <h2 class="h2">Data &amp; motion</h2>
    <RustDoc id="r-calendar" name="Calendar" description="A month calendar." :code="usage.AdsCalendar" file="ui/widget2.rs" :source="source('ui/widget2.rs')"><AdsCalendar /></RustDoc>
    <RustDoc id="r-carousel" name="Carousel" description="A horizontal rail with prev/next." :code="usage.AdsCarousel" file="ui/widget2.rs" :source="source('ui/widget2.rs')">
      <div style="max-width:520px"><AdsCarousel label="Slides"><AdsAspectRatio v-for="i in 4" :key="i" ratio="4 / 3" style="width:180px"><div style="height:100%; display:grid; place-items:center">{{ i }}</div></AdsAspectRatio></AdsCarousel></div>
    </RustDoc>
    <RustDoc id="r-trace" name="Trace" description="A vertical trail of steps." :code="usage.AdsTrace" file="ui/widget2.rs" :source="source('ui/widget2.rs')">
      <AdsTrace :steps="[{ title:'Discovery', state:'done' }, { title:'Build', state:'now' }, { title:'Handover', state:'todo' }]" />
    </RustDoc>
    <RustDoc id="r-questionnaire" name="Questionnaire" description="One question at a time." :code="usage.AdsQuestionnaire" file="ui/widget2.rs" :source="source('ui/widget2.rs')">
      <AdsQuestionnaire :questions="[{ id:'q1', text:'What do you need?', options:['A site','A dashboard'] }]" />
    </RustDoc>
    <RustDoc id="r-resizable" name="Resizable" description="A panel you can drag wider." :code="usage.AdsResizable" file="ui/widget2.rs" :source="source('ui/widget2.rs')"><AdsResizable><p class="body">Drag the right edge.</p></AdsResizable></RustDoc>
    <RustDoc id="r-scrollarea" name="ScrollArea" description="A scrollable area." :code="usage.AdsScrollArea" file="ui/messages.rs" :source="source('ui/messages.rs')">
      <div style="max-width:320px"><AdsScrollArea label="Example lines" height="140px"><p v-for="i in 8" :key="i" class="body">Line {{ i }}.</p></AdsScrollArea></div>
    </RustDoc>
    <RustDoc id="r-spinner" name="Spinner" description="A bare spinner." :code="usage.AdsSpinner" file="ui/atom2.rs" :source="source('ui/atom2.rs')"><div class="row gap-3"><AdsSpinner :size="18" /><AdsSpinner :size="26" /></div></RustDoc>

    <h2 class="h2">Messaging</h2>
    <RustDoc id="r-message" name="Message" description="A single message in a thread." :code="usage.AdsMessage" file="ui/messages.rs" :source="source('ui/messages.rs')">
      <div class="stack gap-3"><AdsMessage name="Studio" time="09:41">The crawl finished.</AdsMessage><AdsMessage mine time="09:42">Great.</AdsMessage></div>
    </RustDoc>
    <RustDoc id="r-messagescroller" name="MessageScroller" description="A scrollable column pinned to the newest message." :code="usage.AdsMessageScroller" file="ui/messages.rs" :source="source('ui/messages.rs')">
      <div class="block" style="max-width:420px"><AdsMessageScroller><AdsMessage name="Studio">The crawl finished.</AdsMessage><AdsMessage mine>Great.</AdsMessage></AdsMessageScroller></div>
    </RustDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

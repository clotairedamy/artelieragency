<script setup lang="ts">
// Extra elements — the full set of building blocks, built with ADS styling.
const toggle = ref(false)
const toggleGroup = ref(['bold'])
const dialogOpen = ref(false)
const date = ref('')
const selectVal = ref('')
const comboVal = ref('')
const otp = ref('')
const inputGroup = ref('')
const nativeVal = ref('')
const sheetOpen = ref(false)

const toggleCode = `<AdsToggle v-model="bold" icon="theme">Bold</AdsToggle>`
const groupCode = `<AdsToggleGroup v-model="sel" :options="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }]" />`
const separatorCode = `<AdsSeparator />`
const avatarCode = `<AdsAvatar name="Artelier Studio" :size="40" />`
const collapsibleCode = `<AdsCollapsible title="Why the chrome is grey">So colour means something when it appears.</AdsCollapsible>`
const dateCode = `<AdsDatePicker v-model="date" label="Date" />`
const lineCode = `<AdsLineChart :points="[12, 19, 15, 24, 31, 27, 38]" :height="160" />`
const dialogCode = `<AdsAlertDialog v-model="open" title="Delete project?" action-label="Delete" cancel-label="Cancel" />`

const aspectCode = `<AdsAspectRatio ratio="16 / 9">
  <img src="…" alt="…" />
</AdsAspectRatio>`

const bubbleCode = `<AdsBubble>Hello from the studio.</AdsBubble>
<AdsBubble mine>On it — back in an hour.</AdsBubble>`

const itemCode = `<AdsItem icon="chart">Audience overview</AdsItem>`

const markerCode = `<AdsMarker label="Live" color="var(--ok)" />
<AdsMarker label="Paused" color="var(--warn)" />`

const directionCode = `<AdsDirection to="down" />`

const labelCode = `<AdsLabel for="email">Email address</AdsLabel>`

const kbdCode = `<AdsKbd :keys="['⌘', 'K']" />`

const spinnerCode = `<AdsSpinner :size="22" />`

const typeCode = `<AdsTypography role="display">Less, but done well.</AdsTypography>
<AdsTypography role="eyebrow">A quieter heading</AdsTypography>`

const attachmentCode = `<AdsAttachment name="report.pdf" size="1.2 MB" @remove="…" />`

const codeblockCode = `<AdsCodeBlock :code="'const n = 42'" language="ts" />`

const nativeSelectCode = `<AdsNativeSelect v-model="v" :options="[{ label: 'Desktop', value: 'desktop' }]" />`

const inputGroupCode = `<AdsInputGroup v-model="v" prefix="€" suffix="/mo" placeholder="0" />`

const otpCode = `<AdsInputOtp v-model="code" :length="6" />`

const selectCode = `<AdsSelect v-model="v" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]" />`

const comboCode = `<AdsCombobox v-model="v" :options="[{ label: 'CrawlStat', value: 'crawlstat' }, { label: 'Artelier', value: 'artelier' }]" />`

const hoverCode = `<AdsHoverCard>
  <template #trigger><AdsButton>Hover me</AdsButton></template>
  The card that appears beside it.
</AdsHoverCard>`

const sheetCode = `<AdsSheet v-model="open" side="right" title="Details">…</AdsSheet>`

const contextCode = `<AdsContextMenu :items="[{ label: 'Rename' }, { label: 'Delete' }]">
  Right-click me
</AdsContextMenu>`

const menubarCode = `<AdsMenubar :items="[{ label: 'File', children: [{ label: 'New' }] }, { label: 'Edit', to: '/edit' }]" />`

const navmenuCode = `<AdsNavMenu :links="[{ label: 'Work', to: '/work', children: [{ label: 'CrawlStat', to: '/work/crawlstat' }] }]" />`

const calendarCode = `<AdsCalendar month-label="October" @update:value="…" />`

const carouselCode = `<AdsCarousel>
  <AdsAspectRatio ratio="4 / 3">Slide 1</AdsAspectRatio>
  <AdsAspectRatio ratio="4 / 3">Slide 2</AdsAspectRatio>
</AdsCarousel>`

const resizableCode = `<AdsResizable>A panel you can drag wider.</AdsResizable>`

const questionnaireCode = `<AdsQuestionnaire :questions="[{ id: 'q1', text: 'What do you need?', options: ['A site', 'A dashboard'] }]" />`

const traceCode = `<AdsTrace :steps="[{ title: 'Discovery', state: 'done' }, { title: 'Build', state: 'now' }, { title: 'Handover', state: 'todo' }]" />`

const messageCode = `<AdsMessage name="Studio" time="09:41">The crawl finished.</AdsMessage>`

const scrollerCode = `<AdsMessageScroller>
  <AdsMessage name="Studio">…</AdsMessage>
  <AdsMessage mine>…</AdsMessage>
</AdsMessageScroller>`

const scrollAreaCode = `<AdsScrollArea height="180px">…long content…</AdsScrollArea>`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Elements</p>
      <h1 class="title face-display">Elements</h1>
      <p class="lede">The full set of building blocks — layout, text, inputs, overlays, navigation and data — all in the ADS voice.</p>
    </header>

    <h2 class="h2">Layout &amp; text</h2>
    <ComponentDoc id="adstoggle" name="Toggle" description="A single toggle button." :code="toggleCode"><AdsToggle v-model="toggle" icon="theme">Toggle</AdsToggle><span class="dim size-sm">{{ toggle ? 'on' : 'off' }}</span></ComponentDoc>
    <ComponentDoc id="adstogglegroup" name="ToggleGroup" description="A button group." :code="groupCode"><AdsToggleGroup v-model="toggleGroup" :options="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }, { label: 'Code', value: 'code' }]" /></ComponentDoc>
    <ComponentDoc id="adsavatar" name="Avatar" description="A soft circle with initials." :code="avatarCode"><AdsAvatar name="Artelier Studio" :size="40" /><AdsAvatar name="Clotaire Damy" :size="32" /></ComponentDoc>
    <ComponentDoc id="adsseparator" name="Separator" description="A horizontal rule." :code="separatorCode"><div class="block stack gap-4" style="max-width: 320px"><p class="ink-subdued">Above</p><AdsSeparator /><p class="ink-subdued">Below</p></div></ComponentDoc>
    <ComponentDoc id="adscollapsible" name="Collapsible" description="A single collapsible." :code="collapsibleCode"><div class="block" style="max-width: 360px"><AdsCollapsible title="Why the chrome is grey">So colour means something when it appears.</AdsCollapsible></div></ComponentDoc>
    <ComponentDoc id="adsdatepicker" name="DatePicker" description="A single date well." :code="dateCode"><div class="block" style="max-width: 300px"><AdsDatePicker v-model="date" label="Date" /></div></ComponentDoc>
    <ComponentDoc id="adslinechart" name="LineChart" description="A hand-drawn line chart." :code="lineCode"><div class="block"><AdsLineChart :points="[12, 19, 15, 24, 31, 27, 38, 35, 44]" :height="160" /></div></ComponentDoc>
    <ComponentDoc id="adsalertdialog" name="AlertDialog" description="A confirmation dialog." :code="dialogCode"><AdsButton @click="dialogOpen = true">Open dialog</AdsButton><AdsAlertDialog v-model="dialogOpen" title="Delete project?" description="Its crawls, history and comparisons go with it." action-label="Delete" cancel-label="Cancel" /></ComponentDoc>

    <ComponentDoc id="adstypography" name="Typography" description="Text in one of the system's type roles." :code="typeCode">
      <div class="stack gap-3">
        <AdsTypography role="display">Less, but done well.</AdsTypography>
        <AdsTypography role="eyebrow">A quieter heading</AdsTypography>
        <AdsTypography role="lede">The chrome is grey so the data can be coloured.</AdsTypography>
        <AdsTypography role="caption">A caption, for the fine print.</AdsTypography>
      </div>
    </ComponentDoc>

    <ComponentDoc id="adsaspectratio" name="AspectRatio" description="A container with a fixed aspect ratio." :code="aspectCode">
      <div style="max-width: 320px"><AdsAspectRatio ratio="16 / 9"><div class="block" style="height: 100%; display: grid; place-items: center">16 / 9</div></AdsAspectRatio></div>
    </ComponentDoc>

    <ComponentDoc id="adslabel" name="Label" description="A form label." :code="labelCode">
      <AdsLabel>Email address</AdsLabel>
    </ComponentDoc>

    <ComponentDoc id="adskbd" name="Kbd" description="A keyboard key." :code="kbdCode">
      <div class="row gap-2"><AdsKbd :keys="['⌘', 'K']" /><AdsKbd :keys="['Esc']" /></div>
    </ComponentDoc>

    <ComponentDoc id="adscodeblock" name="CodeBlock" description="A code block with a copy button." :code="codeblockCode">
      <div style="max-width: 420px"><AdsCodeBlock :code="'const chrome = grey\nconst data = coloured'" language="ts" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsmarker" name="Marker" description="A status marker — a dot, optionally labelled." :code="markerCode">
      <div class="row gap-4"><AdsMarker label="Live" color="var(--ok)" /><AdsMarker label="Paused" color="var(--warn)" /><AdsMarker label="Down" color="var(--bad)" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsdirection" name="Direction" description="An arrow rotated toward a direction." :code="directionCode">
      <div class="row gap-4"><AdsDirection to="right" /><AdsDirection to="down" /><AdsDirection to="left" /><AdsDirection to="up" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsitem" name="Item" description="A list item with an optional glyph." :code="itemCode">
      <div class="block" style="max-width: 320px"><AdsItem icon="chart">Audience overview</AdsItem><AdsItem icon="alert">4 issues to fix</AdsItem></div>
    </ComponentDoc>

    <ComponentDoc id="adsbubble" name="Bubble" description="A chat bubble." :code="bubbleCode">
      <div class="stack gap-3" style="max-width: 360px"><AdsBubble>Hello from the studio.</AdsBubble><AdsBubble mine>On it — back in an hour.</AdsBubble></div>
    </ComponentDoc>

    <h2 class="h2">Inputs</h2>
    <ComponentDoc id="adsinputgroup" name="InputGroup" description="An input with a prefix/suffix addon." :code="inputGroupCode">
      <div style="max-width: 260px"><AdsInputGroup v-model="inputGroup" prefix="€" suffix="/mo" placeholder="0" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsinputotp" name="InputOtp" description="A one-time-password input." :code="otpCode">
      <AdsInputOtp v-model="otp" :length="6" />
    </ComponentDoc>

    <ComponentDoc id="adsnativeselect" name="NativeSelect" description="A native select, styled as a well." :code="nativeSelectCode">
      <div style="max-width: 240px"><AdsNativeSelect v-model="nativeVal" :options="[{ label: 'Desktop', value: 'desktop' }, { label: 'Mobile', value: 'mobile' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsselect" name="Select" description="A custom select: a button that opens a soft menu." :code="selectCode">
      <div style="max-width: 240px"><AdsSelect v-model="selectVal" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adscombobox" name="Combobox" description="A text field that filters a list as you type." :code="comboCode">
      <div style="max-width: 260px"><AdsCombobox v-model="comboVal" :options="[{ label: 'CrawlStat', value: 'crawlstat' }, { label: 'Artelier', value: 'artelier' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsattachment" name="Attachment" description="A file attachment chip." :code="attachmentCode">
      <div class="row gap-2"><AdsAttachment name="report.pdf" size="1.2 MB" /><AdsAttachment name="tokens.json" size="4 KB" /></div>
    </ComponentDoc>

    <h2 class="h2">Overlays &amp; navigation</h2>
    <ComponentDoc id="adshovercard" name="HoverCard" description="A card that appears beside its trigger on hover." :code="hoverCode">
      <AdsHoverCard>
        <template #trigger><AdsButton variant="quiet">Hover me</AdsButton></template>
        The card that appears beside it, with whatever you need to say.
      </AdsHoverCard>
    </ComponentDoc>

    <ComponentDoc id="adssheet" name="Sheet" description="A side sheet." :code="sheetCode">
      <AdsButton @click="sheetOpen = true">Open sheet</AdsButton>
      <AdsSheet v-model="sheetOpen" side="right" title="Details">A sheet slides in from the side and waits for you to finish.</AdsSheet>
    </ComponentDoc>

    <ComponentDoc id="adscontextmenu" name="ContextMenu" description="A right-click context menu." :code="contextCode">
      <div class="block" style="max-width: 320px"><AdsContextMenu :items="[{ label: 'Rename' }, { label: 'Duplicate' }, { label: 'Delete' }]"><p class="body">Right-click this block.</p></AdsContextMenu></div>
    </ComponentDoc>

    <ComponentDoc id="adsmenubar" name="Menubar" description="A horizontal menu bar." :code="menubarCode">
      <AdsMenubar :items="[{ label: 'File', children: [{ label: 'New', to: '/vue' }, { label: 'Open', to: '/vue' }] }, { label: 'Edit', to: '/vue' }, { label: 'View', to: '/vue' }]" />
    </ComponentDoc>

    <ComponentDoc id="adsnavmenu" name="NavMenu" description="A navigation menu with optional dropdowns." :code="navmenuCode">
      <AdsNavMenu :links="[{ label: 'Work', to: '/vue', children: [{ label: 'CrawlStat', to: '/vue' }, { label: 'Artelier', to: '/vue' }] }, { label: 'Studio', to: '/vue' }]" />
    </ComponentDoc>

    <h2 class="h2">Data &amp; motion</h2>
    <ComponentDoc id="adscalendar" name="Calendar" description="A month calendar." :code="calendarCode">
      <AdsCalendar month-label="October" />
    </ComponentDoc>

    <ComponentDoc id="adscarousel" name="Carousel" description="A horizontal rail with prev/next." :code="carouselCode">
      <div style="max-width: 560px"><AdsCarousel>
        <AdsAspectRatio v-for="i in 5" :key="i" ratio="4 / 3" style="width: 200px"><div style="height: 100%; display: grid; place-items: center">{{ i }}</div></AdsAspectRatio>
      </AdsCarousel></div>
    </ComponentDoc>

    <ComponentDoc id="adstrace" name="Trace" description="A vertical trail of steps." :code="traceCode">
      <AdsTrace :steps="[{ title: 'Discovery', state: 'done', meta: 'wk 1' }, { title: 'Design system', state: 'now', meta: 'wk 2' }, { title: 'Interface build', state: 'todo', meta: 'wk 3' }, { title: 'Handover', state: 'todo', meta: 'wk 4' }]" />
    </ComponentDoc>

    <ComponentDoc id="adsquestionnaire" name="Questionnaire" description="One question at a time, with a progress readout." :code="questionnaireCode">
      <AdsQuestionnaire :questions="[{ id: 'q1', text: 'What do you need?', options: ['A site', 'A dashboard'] }, { id: 'q2', text: 'How soon?', options: ['Now', 'Next month'] }]" />
    </ComponentDoc>

    <ComponentDoc id="adsresizable" name="Resizable" description="A panel you can drag wider." :code="resizableCode">
      <AdsResizable><p class="body">Drag the right edge to resize this panel.</p></AdsResizable>
    </ComponentDoc>

    <ComponentDoc id="adsscrollarea" name="ScrollArea" description="A scrollable area with a slim scrollbar." :code="scrollAreaCode">
      <div style="max-width: 320px"><AdsScrollArea height="160px"><p v-for="i in 12" :key="i" class="body">Line {{ i }} — the chrome is grey so the data can be coloured.</p></AdsScrollArea></div>
    </ComponentDoc>

    <ComponentDoc id="adsspinner" name="Spinner" description="A bare spinner." :code="spinnerCode">
      <div class="row gap-3"><AdsSpinner :size="16" /><AdsSpinner :size="22" /><AdsSpinner :size="30" /></div>
    </ComponentDoc>

    <h2 class="h2">Messaging</h2>
    <ComponentDoc id="adsmessage" name="Message" description="A single message in a thread." :code="messageCode">
      <div class="stack gap-3" style="max-width: 420px"><AdsMessage name="Studio" time="09:41">The crawl finished — 1,284 URLs.</AdsMessage><AdsMessage mine time="09:42">Great, what did it find?</AdsMessage></div>
    </ComponentDoc>

    <ComponentDoc id="adsmessagescroller" name="MessageScroller" description="A scrollable column pinned to the newest message." :code="scrollerCode">
      <div class="block" style="max-width: 420px"><AdsMessageScroller><AdsMessage name="Studio" time="09:41">The crawl finished.</AdsMessage><AdsMessage mine time="09:42">Great.</AdsMessage><AdsMessage name="Studio" time="09:43">12 issues, 3 worth fixing now.</AdsMessage></AdsMessageScroller></div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

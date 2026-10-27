<script setup lang="ts">
// Extra elements — the full set of building blocks, built with ADS styling.
definePageMeta({ layout: 'ui-kit' })
useSeo({
  title: 'Elements · Artelier UI Kit for Vue',
  description: 'The full set of building blocks — layout, text, inputs, overlays, navigation and data — all in the ADS voice.',
  path: '/ui-kit/elements',
})

const toggle = ref(false)
const toggleGroup = ref<(string | number)[]>(['bold'])
const dialogOpen = ref(false)
const date = ref('')
const calendarDay = ref('')
const selectVal = ref('')
const comboVal = ref('')
const otp = ref('')
const inputGroup = ref('')
const nativeVal = ref('')
const sheetOpen = ref(false)
const panelWidth = ref(280)

const toggleCode = `<AdsToggle v-model="bold" icon="theme">Bold</AdsToggle>
<AdsToggle v-model="grid" icon="grid" label="Show grid" />`
const groupCode = `<AdsToggleGroup
  v-model="sel"
  label="Text style"
  :options="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }]"
/>`
const separatorCode = `<AdsSeparator />`
const avatarCode = `<AdsAvatar name="Artelier Studio" :size="40" />
<!-- beside a visible name, keep it out of the reading order -->
<AdsAvatar name="Artelier Studio" decorative />`
const collapsibleCode = `<AdsCollapsible v-model:open="open" title="Why the chrome is grey">
  So colour means something when it appears.
</AdsCollapsible>`
const dateCode = `<AdsDatePicker
  v-model="date"
  label="Crawl date"
  :presets="[{ label: 'Today', offset: 0 }, { label: '7 days ago', offset: -7 }]"
/>`
const lineCode = `<AdsLineChart
  label="Sessions per day, thousands"
  :labels="['2026-10-01', …, '2026-10-09']"
  :series="[
    { name: 'Organic', points: [12, 19, 15, 24, 31, 27, 38, 35, 44] },
    { name: 'Direct', points: [8, 9, 11, 10, 14, 13, 15, 17, 16] },
  ]"
/>`
const dialogCode = `<AdsAlertDialog
  v-model:open="open"
  title="Delete project?"
  description="Its crawls, history and comparisons go with it."
  action-label="Delete project"
  @action="remove"
/>`

const aspectCode = `<AdsAspectRatio ratio="16 / 9">
  <img src="…" alt="…" />
</AdsAspectRatio>`

const bubbleCode = `<AdsBubble>Hello from the studio.</AdsBubble>
<AdsBubble mine>On it — back in an hour.</AdsBubble>`

const itemCode = `<AdsItem icon="chart">Audience overview</AdsItem>
<AdsItem icon="alert" to="/issues">4 issues to fix</AdsItem>`

const markerCode = `<AdsMarker label="Live" tone="ok" />
<AdsMarker label="Paused" tone="warn" />
<AdsMarker label="Down" tone="bad" />
<AdsMarker label="Draft" />
<AdsMarker label="Grade 3" :grade="3" />`

const directionCode = `<AdsDirection to="down" />
<AdsDirection to="up" label="Rising" />`

const labelCode = `<AdsLabel for="email">Email address</AdsLabel>
<input id="email" class="ads-field" type="email" />`

const kbdCode = `<AdsKbd :keys="['⌘', 'K']" />`

const spinnerCode = `<AdsSpinner :size="22" label="Loading crawl" />`

const typeCode = `<AdsTypography role="display">Less, but done well.</AdsTypography>
<AdsTypography role="eyebrow">A quieter heading</AdsTypography>`

const attachmentCode = `<AdsAttachment name="report.pdf" size="1.2 MB" @remove="…" />`

const codeblockCode = `<AdsCodeBlock :code="'const n = 42'" language="ts" />`

const nativeSelectCode = `<AdsNativeSelect
  v-model="v"
  label="Device"
  :options="[{ label: 'Desktop', value: 'desktop' }, { label: 'Mobile', value: 'mobile' }]"
/>`

const inputGroupCode = `<AdsInputGroup v-model="v" label="Subdomain" prefix="https://" suffix=".artelier.app" placeholder="studio" />`

const otpCode = `<AdsInputOtp v-model="code" label="Sign-in code" :length="6" />`

const selectCode = `<AdsSelect
  v-model="v"
  label="Billing"
  :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]"
/>`

const comboCode = `<AdsCombobox
  v-model="v"
  label="Project"
  :options="[{ label: 'CrawlStat', value: 'crawlstat' }, { label: 'Artelier', value: 'artelier' }]"
/>`

const hoverCode = `<AdsHoverCard>
  <template #trigger><AdsButton>Hover me</AdsButton></template>
  The card that appears beside it.
</AdsHoverCard>`

const sheetCode = `<AdsSheet v-model:open="open" side="right" title="Filters">…</AdsSheet>`

const contextCode = `<AdsContextMenu
  label="Project actions"
  :items="[
    { label: 'Rename', shortcut: 'F2', action: rename },
    { label: 'Duplicate', shortcut: '⌘D', action: duplicate },
    { label: 'Delete project', destructive: true, action: confirmDelete },
  ]"
>
  Right-click me, or focus me and press Shift+F10
</AdsContextMenu>`

const menubarCode = `<AdsMenubar
  label="Editor"
  :items="[
    { label: 'File', children: [
      { label: 'New file', shortcut: '⌘N', action: create },
      { label: 'Delete file', destructive: true, action: confirmDelete },
    ] },
    { label: 'Help', to: '/help' },
  ]"
/>`

const navmenuCode = `<AdsNavMenu :links="[{ label: 'Work', to: '/work', children: [{ label: 'CrawlStat', to: '/work/crawlstat' }] }]" />`

const calendarCode = `<AdsCalendar v-model="day" v-model:month="month" />
<!-- day: '2026-10-27', month: '2026-10' -->`

const carouselCode = `<AdsCarousel label="Case studies">
  <AdsAspectRatio ratio="4 / 3">Slide 1</AdsAspectRatio>
  <AdsAspectRatio ratio="4 / 3">Slide 2</AdsAspectRatio>
</AdsCarousel>`

const resizableCode = `<AdsResizable v-model:width="width" :min="200" :max="560" label="Resize sidebar">
  A panel you can drag wider.
</AdsResizable>`

const questionnaireCode = `<AdsQuestionnaire
  :questions="[{ id: 'q1', text: 'What do you need?', options: ['A site', 'A dashboard'] }]"
  submit-label="Send answers"
  @done="save"
/>`

const traceCode = `<AdsTrace
  label="Project timeline"
  :steps="[{ title: 'Discovery', state: 'done' }, { title: 'Build', state: 'now' }, { title: 'Handover', state: 'todo' }]"
/>`

const messageCode = `<AdsMessage name="Studio" time="09:41">The crawl finished.</AdsMessage>`

const scrollerCode = `<AdsMessageScroller label="Thread with Studio">
  <AdsMessage name="Studio">…</AdsMessage>
  <AdsMessage mine>…</AdsMessage>
</AdsMessageScroller>`

const scrollAreaCode = `<AdsScrollArea label="Changelog" height="180px">…long content…</AdsScrollArea>`

const chartLabels = Array.from({ length: 9 }, (_, i) => `2026-10-0${i + 1}`)

const contextItems = [
  { label: 'Rename', shortcut: 'F2' },
  { label: 'Duplicate', shortcut: '⌘D' },
  { label: 'Delete project', destructive: true },
]

const menubarItems = [
  {
    label: 'File',
    children: [
      { label: 'New file', shortcut: '⌘N' },
      { label: 'Open…', shortcut: '⌘O' },
      { label: 'Delete file', destructive: true },
    ],
  },
  { label: 'Edit', children: [{ label: 'Undo', shortcut: '⌘Z' }, { label: 'Redo', shortcut: '⇧⌘Z' }] },
  { label: 'Help', to: '/ui-kit' },
]

const toggleProps = [
  { name: 'v-model', type: 'boolean', default: 'false' },
  { name: 'icon', type: 'string', desc: 'Glyph name.' },
  { name: 'label', type: 'string', desc: 'Accessible name. Required when there is no slot text.' },
]
const toggleGroupProps = [
  { name: 'v-model', type: '(string | number)[]', default: '[]', desc: 'The values that are on.' },
  { name: 'options', type: '{ label, value, icon? }[]', desc: 'The buttons.' },
  { name: 'label', type: 'string', desc: 'Required. Names the group for assistive tech.' },
]
const avatarProps = [
  { name: 'name', type: 'string', desc: 'Required. Initials come from it; read out unless decorative.' },
  { name: 'size', type: 'number', default: '40' },
  { name: 'decorative', type: 'boolean', default: 'false', desc: 'Hide from assistive tech when the name is shown next to it.' },
]
const collapsibleProps = [
  { name: 'title', type: 'string', desc: 'Required. The summary line.' },
  { name: 'v-model:open', type: 'boolean', default: 'false' },
]
const datePickerProps = [
  { name: 'v-model', type: 'string', desc: 'ISO date, YYYY-MM-DD.' },
  { name: 'label', type: 'string', desc: 'Required. Visible field label.' },
  { name: 'presets', type: '{ label, offset }[]', default: 'Today, Yesterday, 7 days ago', desc: 'Offsets in days from today.' },
  { name: 'hint', type: 'string' },
]
const lineProps = [
  { name: 'label', type: 'string', desc: 'Required. Names the chart and carries the unit.' },
  { name: 'series', type: '{ name, points }[]', desc: 'Drawn in slot order --series-1..8; a ninth and beyond fold into "Other".' },
  { name: 'points', type: 'number[]', desc: 'Shorthand for a single series named by label.' },
  { name: 'labels', type: 'string[]', desc: 'X-axis labels; first and last are shown, all go in the table fallback.' },
  { name: 'height', type: 'number', default: '160' },
]
const dialogProps = [
  { name: 'v-model:open', type: 'boolean', default: 'false' },
  { name: 'title', type: 'string', desc: 'Required. A question.' },
  { name: 'action-label', type: 'string', desc: 'Required. The verb and object — "Delete project".' },
  { name: 'description', type: 'string' },
  { name: 'cancel-label', type: 'string', default: 'Cancel' },
  { name: 'destructive', type: 'boolean', default: 'true', desc: 'Keeps the action off the accent and focuses Cancel first.' },
]
const markerProps = [
  { name: 'label', type: 'string', desc: 'Required. Status is never colour alone.' },
  { name: 'tone', type: "'neutral' | 'ok' | 'warn' | 'bad'", default: 'neutral', desc: 'Each tone has its own glyph.' },
  { name: 'grade', type: '1 | 2 | 3 | 4', desc: 'Severity as luminance; worse is brighter.' },
]
const directionProps = [
  { name: 'to', type: "'up' | 'down' | 'left' | 'right'", default: 'right' },
  { name: 'label', type: 'string', desc: 'Give one when the arrow carries meaning; otherwise it is decorative.' },
]
const itemProps = [
  { name: 'icon', type: 'string' },
  { name: 'to', type: 'string', desc: 'Makes the row a link; only links react to hover.' },
]
const kbdProps = [{ name: 'keys', type: 'string[]', desc: 'Required. One key per entry.' }]
const spinnerProps = [
  { name: 'size', type: 'number', default: '18' },
  { name: 'label', type: 'string', default: 'Loading' },
]
const inputGroupProps = [
  { name: 'v-model', type: 'string' },
  { name: 'label', type: 'string', desc: 'Required. Visible field label. Units for a figure belong here, not in an addon.' },
  { name: 'prefix', type: 'string' },
  { name: 'suffix', type: 'string' },
  { name: 'hint', type: 'string' },
]
const otpProps = [
  { name: 'v-model', type: 'string' },
  { name: 'label', type: 'string', default: 'One-time code' },
  { name: 'length', type: 'number', default: '6' },
]
const nativeSelectProps = [
  { name: 'v-model', type: 'string | number' },
  { name: 'label', type: 'string', desc: 'Required. Visible field label (replaces aria-label).' },
  { name: 'options', type: '{ label, value }[]' },
  { name: 'placeholder', type: 'string', default: 'Choose…' },
  { name: 'hint', type: 'string' },
]
const selectProps = [
  { name: 'v-model', type: 'string | number' },
  { name: 'label', type: 'string', desc: 'Required. Visible field label.' },
  { name: 'options', type: '{ label, value }[]' },
  { name: 'placeholder', type: 'string', default: 'Choose…' },
  { name: 'hint', type: 'string' },
]
const comboProps = [
  { name: 'v-model', type: 'string | number' },
  { name: 'label', type: 'string', desc: 'Required. Visible field label.' },
  { name: 'options', type: '{ label, value }[]' },
  { name: 'placeholder', type: 'string', default: 'Type to search' },
  { name: 'hint', type: 'string' },
]
const sheetProps = [
  { name: 'v-model:open', type: 'boolean', default: 'false' },
  { name: 'title', type: 'string', desc: 'Required. Names the dialog.' },
  { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: 'right' },
]
const contextProps = [
  { name: 'items', type: '{ label, action?, shortcut?, destructive?, icon? }[]', desc: 'Destructive items are moved last, below a rule.' },
  { name: 'label', type: 'string', default: 'Context menu' },
]
const menubarProps = [
  { name: 'items', type: '{ label, to?, children? }[]', desc: 'Children take { label, to?, action?, shortcut?, destructive? }.' },
  { name: 'label', type: 'string', default: 'Menu' },
]
const navmenuProps = [
  { name: 'links', type: '{ label, to, children? }[]' },
  { name: 'label', type: 'string', default: 'Primary' },
]
const calendarProps = [
  { name: 'v-model', type: 'string', desc: 'ISO day, YYYY-MM-DD.' },
  { name: 'v-model:month', type: 'string', desc: 'Month on view, YYYY-MM. Defaults to the chosen day or this month.' },
  { name: 'label', type: 'string', default: 'Calendar' },
]
const carouselProps = [{ name: 'label', type: 'string', desc: 'Required. Names the region.' }]
const resizableProps = [
  { name: 'v-model:width', type: 'number', default: '280', desc: 'Width in pixels.' },
  { name: 'min', type: 'number', default: '160' },
  { name: 'max', type: 'number', default: '720' },
  { name: 'label', type: 'string', default: 'Resize panel' },
]
const questionnaireProps = [
  { name: 'questions', type: '{ id, text, options, multi? }[]' },
  { name: 'submit-label', type: 'string', default: 'Send answers' },
]
const traceProps = [
  { name: 'steps', type: "{ title, meta?, state?: 'done' | 'now' | 'todo' }[]" },
  { name: 'label', type: 'string' },
]
const scrollerProps = [
  { name: 'label', type: 'string', default: 'Messages' },
  { name: 'stick', type: 'boolean', default: 'true', desc: 'Follow new messages while the reader is at the bottom.' },
]
const scrollAreaProps = [
  { name: 'label', type: 'string', desc: 'Required. Names the focusable region.' },
  { name: 'height', type: 'string' },
  { name: 'axis', type: "'y' | 'x' | 'both'", default: 'y' },
]
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Elements</p>
      <h1 class="title face-display">Elements</h1>
      <p class="lede">The full set of building blocks — layout, text, inputs, overlays, navigation and data — all in the ADS voice.</p>
    </header>

    <h2 class="h2">Layout &amp; text</h2>
    <ComponentDoc id="adstoggle" name="AdsToggle" description="A single toggle button. Off is raised; on is pressed in." :code="toggleCode" :props="toggleProps"><AdsToggle v-model="toggle" icon="theme">Toggle</AdsToggle><span class="dim size-sm">{{ toggle ? 'on' : 'off' }}</span></ComponentDoc>
    <ComponentDoc id="adstogglegroup" name="AdsToggleGroup" description="A labelled group of toggle buttons." :code="groupCode" :props="toggleGroupProps"><AdsToggleGroup v-model="toggleGroup" label="Text style" :options="[{ label: 'Bold', value: 'bold' }, { label: 'Italic', value: 'italic' }, { label: 'Code', value: 'code' }]" /></ComponentDoc>
    <ComponentDoc id="adsavatar" name="AdsAvatar" description="A soft circle with initials." :code="avatarCode" :props="avatarProps"><AdsAvatar name="Artelier Studio" :size="40" /><AdsAvatar name="Clotaire Damy" :size="32" /></ComponentDoc>
    <ComponentDoc id="adsseparator" name="AdsSeparator" description="A horizontal rule." :code="separatorCode"><div class="block stack gap-4" style="max-width: 320px"><p class="ink-subdued">Above</p><AdsSeparator /><p class="ink-subdued">Below</p></div></ComponentDoc>
    <ComponentDoc id="adscollapsible" name="AdsCollapsible" description="A single collapsible." :code="collapsibleCode" :props="collapsibleProps"><div class="block" style="max-width: 360px"><AdsCollapsible title="Why the chrome is grey">So colour means something when it appears.</AdsCollapsible></div></ComponentDoc>
    <ComponentDoc id="adsdatepicker" name="AdsDatePicker" description="One ISO date, typed or picked from a calendar, with presets." :code="dateCode" :props="datePickerProps"><div class="block" style="max-width: 300px"><AdsDatePicker v-model="date" label="Crawl date" /></div></ComponentDoc>
    <ComponentDoc id="adslinechart" name="AdsLineChart" description="A trend over an ordered axis: series in slot order, a recessive scale, a table fallback." :code="lineCode" :props="lineProps"><div class="block"><AdsLineChart label="Sessions per day, thousands" :labels="chartLabels" :series="[{ name: 'Organic', points: [12, 19, 15, 24, 31, 27, 38, 35, 44] }, { name: 'Direct', points: [8, 9, 11, 10, 14, 13, 15, 17, 16] }]" /></div></ComponentDoc>
    <ComponentDoc id="adsalertdialog" name="AdsAlertDialog" description="A confirmation that says its verb. Destructive by default, so the action stays off the accent." :code="dialogCode" :props="dialogProps"><AdsButton @click="dialogOpen = true">Delete project</AdsButton><AdsAlertDialog v-model:open="dialogOpen" title="Delete project?" description="Its crawls, history and comparisons go with it." action-label="Delete project" /></ComponentDoc>

    <ComponentDoc id="adstypography" name="AdsTypography" description="Text in one of the system's type roles." :code="typeCode">
      <div class="stack gap-3">
        <AdsTypography role="display">Less, but done well.</AdsTypography>
        <AdsTypography role="eyebrow">A quieter heading</AdsTypography>
        <AdsTypography role="lede">The chrome is grey so the data can be coloured.</AdsTypography>
        <AdsTypography role="caption">A caption, for the fine print.</AdsTypography>
      </div>
    </ComponentDoc>

    <ComponentDoc id="adsaspectratio" name="AdsAspectRatio" description="A container with a fixed aspect ratio." :code="aspectCode">
      <div style="max-width: 320px"><AdsAspectRatio ratio="16 / 9"><div class="block" style="height: 100%; display: grid; place-items: center">16 / 9</div></AdsAspectRatio></div>
    </ComponentDoc>

    <ComponentDoc id="adslabel" name="AdsLabel" description="A form label, in the label face." :code="labelCode">
      <div class="ads-field-group" style="max-width: 280px"><AdsLabel for="elements-email">Email address</AdsLabel><input id="elements-email" class="ads-field" type="email"></div>
    </ComponentDoc>

    <ComponentDoc id="adskbd" name="AdsKbd" description="A keyboard shortcut, one key per cap." :code="kbdCode" :props="kbdProps">
      <div class="row gap-2"><AdsKbd :keys="['⌘', 'K']" /><AdsKbd :keys="['Esc']" /></div>
    </ComponentDoc>

    <ComponentDoc id="adscodeblock" name="AdsCodeBlock" description="A code block with a copy button." :code="codeblockCode">
      <div style="max-width: 420px"><AdsCodeBlock :code="'const chrome = grey\nconst data = coloured'" language="ts" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsmarker" name="AdsMarker" description="A status marker: a tone or grade, always with a label and its own glyph." :code="markerCode" :props="markerProps">
      <div class="row gap-4"><AdsMarker label="Live" tone="ok" /><AdsMarker label="Paused" tone="warn" /><AdsMarker label="Down" tone="bad" /><AdsMarker label="Draft" /><AdsMarker label="Grade 3" :grade="3" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsdirection" name="AdsDirection" description="An arrow rotated toward a direction." :code="directionCode" :props="directionProps">
      <div class="row gap-4"><AdsDirection to="right" /><AdsDirection to="down" /><AdsDirection to="left" /><AdsDirection to="up" label="Rising" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsitem" name="AdsItem" description="A list row with an optional glyph; a link when given `to`." :code="itemCode" :props="itemProps">
      <div class="block" style="max-width: 320px"><AdsItem icon="chart">Audience overview</AdsItem><AdsItem icon="alert" to="/ui-kit">4 issues to fix</AdsItem></div>
    </ComponentDoc>

    <ComponentDoc id="adsbubble" name="AdsBubble" description="A chat bubble. Theirs is pressed in, yours is raised." :code="bubbleCode">
      <div class="stack gap-3" style="max-width: 360px"><AdsBubble>Hello from the studio.</AdsBubble><AdsBubble mine>On it — back in an hour.</AdsBubble></div>
    </ComponentDoc>

    <h2 class="h2">Inputs</h2>
    <ComponentDoc id="adsinputgroup" name="AdsInputGroup" description="A field with a fixed addon either side." :code="inputGroupCode" :props="inputGroupProps">
      <div style="max-width: 360px"><AdsInputGroup v-model="inputGroup" label="Subdomain" prefix="https://" suffix=".artelier.app" placeholder="studio" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsinputotp" name="AdsInputOtp" description="A one-time code, pasted or typed." :code="otpCode" :props="otpProps">
      <AdsInputOtp v-model="otp" label="Sign-in code" :length="6" />
    </ComponentDoc>

    <ComponentDoc id="adsnativeselect" name="AdsNativeSelect" description="The browser's select, styled as a well." :code="nativeSelectCode" :props="nativeSelectProps">
      <div style="max-width: 240px"><AdsNativeSelect v-model="nativeVal" label="Device" :options="[{ label: 'Desktop', value: 'desktop' }, { label: 'Mobile', value: 'mobile' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsselect" name="AdsSelect" description="A custom select, for when an option needs more than text." :code="selectCode" :props="selectProps">
      <div style="max-width: 240px"><AdsSelect v-model="selectVal" label="Billing" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adscombobox" name="AdsCombobox" description="A field that filters a list as you type." :code="comboCode" :props="comboProps">
      <div style="max-width: 260px"><AdsCombobox v-model="comboVal" label="Project" :options="[{ label: 'CrawlStat', value: 'crawlstat' }, { label: 'Artelier', value: 'artelier' }]" /></div>
    </ComponentDoc>

    <ComponentDoc id="adsattachment" name="AdsAttachment" description="A file attachment chip." :code="attachmentCode">
      <div class="row gap-2"><AdsAttachment name="report.pdf" size="1.2 MB" /><AdsAttachment name="tokens.json" size="4 KB" /></div>
    </ComponentDoc>

    <h2 class="h2">Overlays &amp; navigation</h2>
    <ComponentDoc id="adshovercard" name="AdsHoverCard" description="Extra context on hover or focus; Escape dismisses it." :code="hoverCode">
      <AdsHoverCard>
        <template #trigger><AdsButton variant="quiet">Hover me</AdsButton></template>
        The card that appears beside it, with whatever you need to say.
      </AdsHoverCard>
    </ComponentDoc>

    <ComponentDoc id="adssheet" name="AdsSheet" description="A modal panel from an edge, for a task that needs room. Not for row detail — use a drawer." :code="sheetCode" :props="sheetProps">
      <AdsButton @click="sheetOpen = true">Open filters</AdsButton>
      <AdsSheet v-model:open="sheetOpen" side="right" title="Filters">A sheet slides in from the side and waits for you to finish.</AdsSheet>
    </ComponentDoc>

    <ComponentDoc id="adscontextmenu" name="AdsContextMenu" description="A menu on right-click or Shift+F10, destructive items last." :code="contextCode" :props="contextProps">
      <div class="block" style="max-width: 320px"><AdsContextMenu label="Project actions" :items="contextItems"><p class="body">Right-click this block, or focus it and press Shift+F10.</p></AdsContextMenu></div>
    </ComponentDoc>

    <ComponentDoc id="adsmenubar" name="AdsMenubar" description="An application menu bar, keyboard-complete." :code="menubarCode" :props="menubarProps">
      <AdsMenubar label="Editor" :items="menubarItems" />
    </ComponentDoc>

    <ComponentDoc id="adsnavmenu" name="AdsNavMenu" description="Site navigation; sub-pages open from their own toggle." :code="navmenuCode" :props="navmenuProps">
      <AdsNavMenu :links="[{ label: 'Work', to: '/ui-kit', children: [{ label: 'CrawlStat', to: '/ui-kit' }, { label: 'Artelier', to: '/ui-kit' }] }, { label: 'Studio', to: '/ui-kit' }]" />
    </ComponentDoc>

    <h2 class="h2">Data &amp; motion</h2>
    <ComponentDoc id="adscalendar" name="AdsCalendar" description="A month grid with ISO dates and full keyboard support." :code="calendarCode" :props="calendarProps">
      <AdsCalendar v-model="calendarDay" />
      <span class="dim size-sm num">{{ calendarDay || '—' }}</span>
    </ComponentDoc>

    <ComponentDoc id="adscarousel" name="AdsCarousel" description="A horizontal rail; the edge with more to see fades." :code="carouselCode" :props="carouselProps">
      <div style="max-width: 560px"><AdsCarousel label="Slides">
        <AdsAspectRatio v-for="i in 5" :key="i" ratio="4 / 3" style="width: 200px"><div style="height: 100%; display: grid; place-items: center">{{ i }}</div></AdsAspectRatio>
      </AdsCarousel></div>
    </ComponentDoc>

    <ComponentDoc id="adstrace" name="AdsTrace" description="A vertical trail of steps." :code="traceCode" :props="traceProps">
      <AdsTrace label="Project timeline" :steps="[{ title: 'Discovery', state: 'done', meta: 'wk 1' }, { title: 'Design system', state: 'now', meta: 'wk 2' }, { title: 'Interface build', state: 'todo', meta: 'wk 3' }, { title: 'Handover', state: 'todo', meta: 'wk 4' }]" />
    </ComponentDoc>

    <ComponentDoc id="adsquestionnaire" name="AdsQuestionnaire" description="One question at a time, with a progress readout." :code="questionnaireCode" :props="questionnaireProps">
      <AdsQuestionnaire :questions="[{ id: 'q1', text: 'What do you need?', options: ['A site', 'A dashboard'] }, { id: 'q2', text: 'How soon?', options: ['Now', 'Next month'] }]" />
    </ComponentDoc>

    <ComponentDoc id="adsresizable" name="AdsResizable" description="A panel you can drag or key wider." :code="resizableCode" :props="resizableProps">
      <AdsResizable v-model:width="panelWidth" label="Resize panel"><p class="body">Drag the right edge, or focus it and use the arrow keys.</p></AdsResizable>
      <span class="dim size-sm num">{{ panelWidth }} px</span>
    </ComponentDoc>

    <ComponentDoc id="adsscrollarea" name="AdsScrollArea" description="A labelled scrolling region whose edges fade while there is more." :code="scrollAreaCode" :props="scrollAreaProps">
      <div style="max-width: 320px"><AdsScrollArea label="Example lines" height="160px"><p v-for="i in 12" :key="i" class="body">Line {{ i }} — the chrome is grey so the data can be coloured.</p></AdsScrollArea></div>
    </ComponentDoc>

    <ComponentDoc id="adsspinner" name="AdsSpinner" description="A bare spinner with an accessible label." :code="spinnerCode" :props="spinnerProps">
      <div class="row gap-3"><AdsSpinner :size="16" /><AdsSpinner :size="22" /><AdsSpinner :size="30" /></div>
    </ComponentDoc>

    <h2 class="h2">Messaging</h2>
    <ComponentDoc id="adsmessage" name="AdsMessage" description="A single message in a thread." :code="messageCode">
      <div class="stack gap-3" style="max-width: 420px"><AdsMessage name="Studio" time="09:41">The crawl finished — 1,284 URLs.</AdsMessage><AdsMessage mine time="09:42">Great, what did it find?</AdsMessage></div>
    </ComponentDoc>

    <ComponentDoc id="adsmessagescroller" name="AdsMessageScroller" description="A live log that follows new messages while you are at the bottom." :code="scrollerCode" :props="scrollerProps">
      <div class="block" style="max-width: 420px"><AdsMessageScroller label="Thread with Studio"><AdsMessage name="Studio" time="09:41">The crawl finished.</AdsMessage><AdsMessage mine time="09:42">Great.</AdsMessage><AdsMessage name="Studio" time="09:43">12 issues, 3 worth fixing now.</AdsMessage></AdsMessageScroller></div>
    </ComponentDoc>
  </div>
</template>

<style scoped>
.title { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -0.03em; font-weight: 600; }
</style>

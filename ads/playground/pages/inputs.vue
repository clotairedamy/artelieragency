<script setup lang="ts">
const email = ref('')
const country = ref('')
const agree = ref(true)
const notify = ref(false)
const range = ref(16)
const num = ref(500)
const filters = ref(['status: 4xx', 'depth ≤ 3', 'indexable'])
const rangePreset = ref('30d')

const fieldCode = `<AdsField v-model="email" label="Email" type="email" hint="We never share it." />
<AdsField v-model="msg" label="Message" type="textarea" />
<AdsField v-model="c" label="Country" type="select" :options="[{ label: 'US', value: 'US' }]" />`

const numberCode = `<AdsNumber v-model="maxUrls" :min="1" :max="999" label="Max URLs" />`

const daterangeCode = `<AdsDaterange v-model="range" from="2026-09-25" to="2026-10-25" :presets="['7d', '30d', '90d', 'Custom']" />`

const choiceCode = `<AdsChoice v-model="agree" kind="checkbox" label="Respect robots.txt" />
<AdsChoice v-model="opt" kind="radio" name="opt" value="a" label="Weekly" />
<!-- A switch applies immediately: never inside a form with a submit button. -->
<AdsChoice v-model="live" kind="switch" label="Live updates" />`

const rangeCode = `<AdsRange v-model="concurrency" :min="1" :max="128" label="Concurrency" />`

const tagCode = `<AdsTag v-for="t in filters" :key="t" :label="t" @remove="filters = filters.filter((x) => x !== t)" />`
</script>

<template>
  <div class="stack gap-6">
    <header class="stack gap-2">
      <p class="eyebrow">Inputs</p>
      <h1 class="title face-display">Inputs</h1>
      <p class="lede">Things that take a value. Every field is a well — a raised input reads as something to press.</p>
    </header>

    <ComponentDoc
      id="adsfield"
      name="AdsField"
      description="A labelled text input, textarea, select or search. Label above, hint below, error replacing the hint."
      :code="fieldCode"
      :props="[
        { name: 'label', type: 'string', default: '— (required)', desc: 'Always visible. A placeholder is never the label.' },
        { name: 'modelValue', type: 'string | number', default: '' },
        { name: 'type', type: 'text | email | password | tel | number | search | date | textarea | select', default: 'text', desc: 'number, date and tel are set in the data face; number is right-aligned.' },
        { name: 'hint', type: 'string', default: '' },
        { name: 'error', type: 'string', default: '', desc: 'Replaces the hint. Say what to do, not that something is wrong.' },
        { name: 'options', type: '{ label, value }[]', default: '—', desc: 'For select.' },
      ]"
    >
      <div class="stack gap-3 block" style="max-width: 360px">
        <AdsField v-model="email" label="Email" type="email" hint="We never share it." />
        <AdsField v-model="country" label="Country" type="select" :options="[{ label: 'US', value: 'US' }, { label: 'EU', value: 'EU' }]" />
        <AdsField label="Depth limit" type="number" :model-value="-3" error="Enter a whole number of 1 or more." />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsnumber"
      name="AdsNumber"
      description="A figure with steppers, right-aligned and monospaced so it lines up with the values it will be compared against."
      :code="numberCode"
      :props="[
        { name: 'modelValue', type: 'number', default: '0' },
        { name: 'min / max / step', type: 'number', default: '0 / ∞ / 1' },
        { name: 'label', type: 'string', default: '— (required)', desc: 'Visible; carries the unit, so the field holds only the figure.' },
      ]"
    >
      <AdsNumber v-model="num" :min="1" :max="999" label="Max URLs" />
    </ComponentDoc>

    <ComponentDoc
      id="adsdaterange"
      name="AdsDaterange"
      description="The most-used control on any dashboard. ISO dates in the data face, presets beside them."
      :code="daterangeCode"
      :props="[
        { name: 'from / to', type: 'string', default: 'ISO dates' },
        { name: 'presets', type: 'string[]', default: '7d / 30d / 90d / Custom' },
        { name: 'modelValue', type: 'string', default: '—' },
        { name: 'label', type: 'string', default: 'Date range', desc: 'Accessible name of the group.' },
      ]"
    >
      <AdsDaterange v-model="rangePreset" from="2026-09-25" to="2026-10-25" />
    </ComponentDoc>

    <ComponentDoc
      id="adschoice"
      name="AdsChoice"
      description="Three shapes for three meanings: many-of (checkbox), one-of (radio), and a setting that takes effect the moment it is flipped (switch). A switch never sits inside a form with a submit button — that is a checkbox."
      :code="choiceCode"
      :props="[
        { name: 'kind', type: 'checkbox | radio | switch', default: 'checkbox' },
        { name: 'label', type: 'string', default: '—', desc: 'Visible label; or use the default slot when it needs a link. One of the two is required.' },
        { name: 'modelValue', type: 'boolean', default: 'false' },
        { name: 'name / value', type: 'string', default: '—', desc: 'For radio groups.' },
      ]"
    >
      <div class="stack gap-3">
        <AdsChoice v-model="agree" kind="checkbox" label="Respect robots.txt" />
        <AdsChoice v-model="notify" kind="switch" label="Live updates" />
      </div>
    </ComponentDoc>

    <ComponentDoc
      id="adsrange"
      name="AdsRange"
      description="A continuous value where the approximate position matters more than the exact figure — but the figure is shown anyway."
      :code="rangeCode"
      :props="[
        { name: 'modelValue', type: 'number', default: '0' },
        { name: 'min / max / step', type: 'number', default: '0 / 100 / 1' },
        { name: 'label', type: 'string', default: '— (required)', desc: 'Visible, with the value always read out beside it.' },
      ]"
    >
      <div class="block" style="max-width: 320px"><AdsRange v-model="range" :min="1" :max="128" label="Concurrency" /></div>
    </ComponentDoc>

    <ComponentDoc
      id="adstag"
      name="AdsTag"
      description="A filter the reader applied and can take off again. Distinct from a status chip, which cannot be removed — the dismiss affordance is the whole difference."
      :code="tagCode"
      :props="[
        { name: 'label', type: 'string', default: '—' },
        { name: '@remove', type: 'event', default: '—', desc: 'Always removable — a chip that cannot be removed is AdsStatus.' },
      ]"
    >
      <div class="row gap-3 wrap">
        <AdsTag v-for="t in filters" :key="t" :label="t" @remove="filters = filters.filter((x) => x !== t)" />
        <AdsButton v-if="filters.length < 3" size="sm" variant="quiet" @click="filters = ['status: 4xx', 'depth ≤ 3', 'indexable']">Reset filters</AdsButton>
      </div>
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
